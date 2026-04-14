import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  RefreshCw,
  Filter,
  Download,
  Eye,
  UserCheck,
  Search,
  Sparkles,
  Building2,
  User,
  ArrowRight,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { CandidateProfile } from "@/types/candidates";
import {
  useGetEmployerJobsQuery,
  useGetJobMatchesQuery,
  aiShortlistApi,
  useShortlistCandidateMutation,
} from "@/app/queries/aiShortlistApi";
import type { EntityId, Job, Match } from "@/app/queries/aiShortlistApi";

type CandidateProfileWithMeta = CandidateProfile & {
  experienceYears?: number;
};

type CandidateListItem = CandidateProfileWithMeta & {
  stage: "matched" | "shortlisted";
  matchReasons: string[];
};

const EMPLOYER_JOBS_PAGE_SIZE = 100;
const JOB_MATCHES_PAGE_SIZE = 50;

const mergeUniqueById = <T extends { id: EntityId }>(
  existingItems: T[],
  nextItems: T[],
) => {
  const seenIds = new Set(existingItems.map((item) => String(item.id)));
  const mergedItems = [...existingItems];

  nextItems.forEach((item) => {
    const itemId = String(item.id);
    if (!seenIds.has(itemId)) {
      seenIds.add(itemId);
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const getEntityIdKey = (id: EntityId) => String(id);

const normalizeSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills)) {
    return skills.filter(
      (skill) => typeof skill === "string" && skill.trim().length > 0,
    );
  }
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeJobSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) =>
        typeof skill === "string"
          ? skill
          : typeof skill?.name === "string"
            ? skill.name
            : "",
      )
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeCertifications = (
  certs: unknown,
): Array<{ name: string; issuer: string; year: string }> => {
  if (Array.isArray(certs)) {
    return certs.filter(
      (cert) =>
        typeof cert === "object" &&
        cert !== null &&
        typeof cert.name === "string" &&
        typeof cert.issuer === "string" &&
        typeof cert.year === "string",
    );
  }
  return [];
};

const normalizeWorkExperience = (
  experience: unknown,
): Array<{
  role: string;
  company: string;
  companyColor?: string;
  period: string;
  location: string;
  highlights: string[];
}> => {
  if (Array.isArray(experience)) {
    return experience.filter(
      (exp) =>
        typeof exp === "object" &&
        exp !== null &&
        typeof exp.role === "string" &&
        typeof exp.company === "string" &&
        typeof exp.period === "string" &&
        typeof exp.location === "string" &&
        Array.isArray(exp.highlights),
    );
  }
  return [];
};

const normalizeProjects = (
  projects: unknown,
): Array<{
  name: string;
  description: string;
  technologies: string[];
  icon: "smartphone" | "shopping";
}> => {
  if (Array.isArray(projects)) {
    return projects.filter(
      (project) =>
        typeof project === "object" &&
        project !== null &&
        typeof project.name === "string" &&
        typeof project.description === "string" &&
        Array.isArray(project.technologies) &&
        (project.icon === "smartphone" || project.icon === "shopping"),
    );
  }
  return [];
};

const mapMatchToCandidate = (match: Match): CandidateProfileWithMeta | null => {
  const matchId = match.id;
  if (typeof matchId !== "number" && typeof matchId !== "string") {
    console.error("Unexpected match.id type in mapMatchToCandidate", {
      id: match.id,
      type: typeof match.id,
    });
    return null;
  }

  const parsedExperience =
    typeof match.experience === "number"
      ? match.experience
      : typeof match.experience === "string"
        ? Number.parseFloat(match.experience)
        : undefined;
  const hourlyFallback =
    typeof match.hourlyRate === "number"
      ? match.hourlyRate
      : typeof match.expectedSalary?.min === "number"
        ? match.expectedSalary.min
        : 0;
  const hourlyMax =
    typeof match.hourlyRate === "number"
      ? match.hourlyRate
      : typeof match.expectedSalary?.max === "number"
        ? match.expectedSalary.max
        : hourlyFallback;

  return {
    id: matchId,
    name: match.name || "Unknown",
    role: match.role || "Unknown Role",
    matchScore: typeof match.matchScore === "number" ? match.matchScore : 0,
    skills: normalizeSkills(match.skills),
    experience:
      parsedExperience !== undefined && !Number.isNaN(parsedExperience)
        ? `${parsedExperience} Years`
        : "Not specified",
    experienceYears:
      parsedExperience !== undefined && !Number.isNaN(parsedExperience)
        ? parsedExperience
        : undefined,
    availability: "Not specified",
    type: match.source === "bench" ? "bench" : "individual",
    hourlyRate: { min: hourlyFallback, max: hourlyMax },
    location: match.location || "Not specified",
    englishLevel: match.englishLevel,
    certifications: normalizeCertifications(match.certifications),
    about: match.about,
    workExperience: normalizeWorkExperience(match.workExperience),
    projects: normalizeProjects(match.projects),
  };
};

const EmployerAIShortlists = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const [selectedJob, setSelectedJob] = useState(
    jobIdParam && jobIdParam !== "all" ? jobIdParam : "",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [shortlistedIds, setShortlistedIds] = useState<EntityId[]>([]);
  const [employerJobsPage, setEmployerJobsPage] = useState(1);
  const [loadedEmployerJobs, setLoadedEmployerJobs] = useState<Job[]>([]);
  const [jobMatchesPage, setJobMatchesPage] = useState(1);
  const [loadedMatches, setLoadedMatches] = useState<Match[]>([]);
  const { data: employerJobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({
      page: employerJobsPage,
      limit: EMPLOYER_JOBS_PAGE_SIZE,
    });

  const employerJobs = loadedEmployerJobs;
  const isAllJobsSelected = !selectedJob;
  const selectedJobId = !isAllJobsSelected ? String(selectedJob) : null;
  const shouldFetchMatches = selectedJobId !== null;
  const jobMatchesQueryId = selectedJobId ?? "";
  const stateJob = (location.state as { job?: Job } | null)?.job;
  const selectedJobDetails =
    employerJobs.find((job) => String(job.id) === selectedJobId) ??
    (stateJob && String(stateJob.id) === selectedJobId ? stateJob : undefined);

  const {
    data: matchesResponse,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useGetJobMatchesQuery(
    {
      id: jobMatchesQueryId,
      page: jobMatchesPage,
      limit: JOB_MATCHES_PAGE_SIZE,
    },
    { skip: !shouldFetchMatches },
  );

  const [shortlistCandidateMutation] = useShortlistCandidateMutation();

  // On component mount, ensure we load the correct job if it's in URL params
  useEffect(() => {
    const initialJobId = searchParams.get("jobId");
    if (initialJobId && initialJobId !== "all" && !selectedJob) {
      setSelectedJob(initialJobId);
    }
    // Intentionally mount-only: selectedJob is read only as a guard to avoid
    // overwriting user selections on re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  // Sync selectedJob with URL search params on mount and navigation
  useEffect(() => {
    const currentJobIdParam = searchParams.get("jobId");
    const jobIdFromUrl =
      currentJobIdParam && currentJobIdParam !== "all" ? currentJobIdParam : "";
    if (selectedJob !== jobIdFromUrl) {
      setSelectedJob(jobIdFromUrl);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    const nextJobs = employerJobsResponse?.data ?? [];
    const responsePageNumber = employerJobsResponse?.meta?.page;

    // Only update if response page matches current page (prevents stale responses from earlier pages)
    if (
      responsePageNumber !== undefined &&
      responsePageNumber !== employerJobsPage
    ) {
      return;
    }

    setLoadedEmployerJobs((previousJobs) => {
      const publishedJobs = nextJobs.filter(
        (job: Job) => job.status === "published" || job.status === "active",
      );
      return employerJobsPage === 1
        ? publishedJobs
        : mergeUniqueById(previousJobs, publishedJobs);
    });
  }, [
    employerJobsPage,
    employerJobsResponse?.data,
    employerJobsResponse?.meta?.page,
  ]);

  useEffect(() => {
    if (!shouldFetchMatches) {
      setLoadedMatches([]);
      return;
    }

    const nextMatches = matchesResponse?.data ?? [];
    setLoadedMatches((previousMatches) =>
      jobMatchesPage === 1
        ? nextMatches
        : mergeUniqueById(previousMatches, nextMatches),
    );
  }, [jobMatchesPage, matchesResponse?.data, shouldFetchMatches]);

  const hasMoreEmployerJobs = useMemo(() => {
    const totalPages = employerJobsResponse?.meta?.totalPages;
    if (typeof totalPages === "number") {
      return employerJobsPage < totalPages;
    }

    const total = employerJobsResponse?.meta?.total;
    if (typeof total === "number") {
      return employerJobs.length < total;
    }

    return false; // unknown pagination — don't assume more pages exist
  }, [
    employerJobs.length,
    employerJobsPage,
    employerJobsResponse?.meta?.total,
    employerJobsResponse?.meta?.totalPages,
  ]);

  const hasMoreMatches = useMemo(() => {
    if (!shouldFetchMatches) {
      return false;
    }

    const totalPages = matchesResponse?.meta?.totalPages;
    if (typeof totalPages === "number") {
      return jobMatchesPage < totalPages;
    }

    const total = matchesResponse?.meta?.total;
    if (typeof total === "number") {
      return loadedMatches.length < total;
    }

    return false;
  }, [
    jobMatchesPage,
    loadedMatches.length,
    matchesResponse?.meta?.total,
    matchesResponse?.meta?.totalPages,
    shouldFetchMatches,
  ]);

  const candidates = useMemo<CandidateListItem[]>(() => {
    const shortlistedIdKeys = new Set(
      shortlistedIds.map((shortlistedId) => getEntityIdKey(shortlistedId)),
    );

    return loadedMatches
      .map(mapMatchToCandidate)
      .filter(
        (candidate): candidate is CandidateProfileWithMeta =>
          candidate !== null,
      )
      .map((c) => ({
        ...c,
        stage: shortlistedIdKeys.has(getEntityIdKey(c.id))
          ? "shortlisted"
          : "matched",
        matchReasons: [],
      }));
  }, [loadedMatches, shortlistedIds]);

  // Compare Job API data with AI Shortlist API data
  // Show only profiles that match: job title = role OR job skills = skills
  const jobRelevantCandidates = useMemo<CandidateListItem[]>(() => {
    // If no job is selected or not fetching matches, return all candidates
    if (!shouldFetchMatches) {
      return candidates;
    }

    // If no job details found, return empty
    if (!selectedJobDetails) return [];

    // Extract and normalize job title for comparison
    const jobTitle = (selectedJobDetails.title ?? "").toLowerCase();
    const jobTitleTokens = jobTitle
      .split(/[^a-z0-9]+/i)
      .map((token) => token.trim())
      .filter((token) => token.length >= 2);

    // Extract and normalize job skills for comparison
    const jobSkills = normalizeJobSkills(selectedJobDetails.skills).map(
      (skill) => skill.toLowerCase(),
    );
    const jobSkillSet = new Set(jobSkills);

    // Filter candidates: Show only if job title matches role OR if skills match
    // This compares Job API data with AI Shortlist API data
    return candidates
      .map((candidate) => {
        const candidateRole = candidate.role.toLowerCase();
        const candidateSkills = candidate.skills.map((skill) =>
          skill.toLowerCase(),
        );

        // Condition 1: Check if job title tokens appear in candidate role
        const titleMatches =
          jobTitleTokens.length > 0 &&
          jobTitleTokens.some((token) => candidateRole.includes(token));

        // Condition 2: Check if any candidate skill matches job skills
        const skillsMatch =
          jobSkillSet.size > 0 &&
          candidateSkills.some((skill) => jobSkillSet.has(skill));

        const matchReasons: string[] = [];
        if (titleMatches) matchReasons.push("Title Match");
        if (skillsMatch) matchReasons.push("Skills Match");

        return {
          ...candidate,
          matchReasons,
          isRelevant: titleMatches || skillsMatch,
        };
      })
      .filter(
        (
          c,
        ): c is CandidateListItem & {
          isRelevant: true;
        } => c.isRelevant,
      );
  }, [candidates, selectedJobDetails, shouldFetchMatches]);

  // Filter candidates: First by job matching, then by tab, then by search term
  // This ensures search results respect the job title/skills matching conditions
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredCandidates = useMemo(
    () =>
      jobRelevantCandidates
        .filter((c) => {
          if (activeTab === "matched") return c.stage === "matched";
          if (activeTab === "shortlisted") return c.stage === "shortlisted";
          return true;
        })
        .filter((c) => {
          if (!normalizedSearchTerm) return true;
          return c.name.toLowerCase().includes(normalizedSearchTerm);
        }),
    [jobRelevantCandidates, activeTab, normalizedSearchTerm],
  );

  const counts = useMemo(() => {
    const matchesSearch = (candidate: CandidateListItem) =>
      !normalizedSearchTerm ||
      candidate.name.toLowerCase().includes(normalizedSearchTerm);

    return {
      all: jobRelevantCandidates.filter(matchesSearch).length,
      matched: jobRelevantCandidates.filter(
        (candidate) =>
          candidate.stage === "matched" && matchesSearch(candidate),
      ).length,
      shortlisted: jobRelevantCandidates.filter(
        (candidate) =>
          candidate.stage === "shortlisted" && matchesSearch(candidate),
      ).length,
    };
  }, [jobRelevantCandidates, normalizedSearchTerm]);

  // Real-time search as user types
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectedJobChange = (value: string) => {
    setSelectedJob(value === "all" ? "" : value);
    setLoadedMatches([]);
    setJobMatchesPage(1);
    // Update URL search params so jobId persists across navigation
    const nextParams = new URLSearchParams(searchParams);
    if (!value) {
      nextParams.delete("jobId");
    } else {
      nextParams.set("jobId", value);
    }
    setSearchParams(nextParams);
  };

  const handleLoadMoreJobs = () => {
    if (!hasMoreEmployerJobs || jobsLoading) return;
    setEmployerJobsPage((currentPage) => currentPage + 1);
  };

  const handleLoadMoreMatches = () => {
    if (!hasMoreMatches || matchesLoading || !shouldFetchMatches) return;
    setJobMatchesPage((currentPage) => currentPage + 1);
  };

  const handleRefreshMatches = () => {
    if (!shouldFetchMatches) return;
    dispatch(aiShortlistApi.util.invalidateTags(["AiShortlistMatches"]));
    setLoadedMatches([]);
    setJobMatchesPage(1);
  };

  const handleViewProfile = (candidate: CandidateProfile) => {
    if (candidate.type === "bench") {
      navigate(`/hire-talent/candidate/${candidate.id}?source=bench`, {
        state: { benchCandidate: candidate },
      });
    } else {
      navigate(`/hire-talent/candidate/${candidate.id}`);
    }
  };

  // Helper function to highlight matching text in candidate name
  const getHighlightedName = (name: string, query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return name;

    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "i");
    const parts = name.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          part.match(regex) ? (
            <span key={index} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    );
  };

  const handleShortlist = (candidate: CandidateProfile) => {
    const shortlistedCandidateKey = getEntityIdKey(candidate.id);
    const hasAlreadyShortlisted = shortlistedIds.some(
      (shortlistedId) =>
        getEntityIdKey(shortlistedId) === shortlistedCandidateKey,
    );

    if (!hasAlreadyShortlisted) {
      // Optimistic update using functional setState to avoid stale closure
      setShortlistedIds((prev) => [...prev, candidate.id]);
      toast.success(`${candidate.name} added to shortlist!`);

      // Call backend mutation
      shortlistCandidateMutation({ candidateId: candidate.id }).catch(() => {
        // Rollback optimistic update on error using functional setState
        setShortlistedIds((prev) =>
          prev.filter((id) => getEntityIdKey(id) !== shortlistedCandidateKey),
        );
        toast.error(`Failed to shortlist ${candidate.name}. Please try again.`);
      });
    }
  };

  const handleSkillTest = (candidate: CandidateProfile) => {
    toast.success(`Skill test scheduled for ${candidate.name}!`);
    navigate("/hire-talent/skill-tests");
  };

  return (
    <div className="min-h-screen bg-[#f2f5fa] font-sans">
      {/* Header */}
      <div className="bg-white px-4 sm:px-8 py-2.5 sm:py-3.5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:bg-gray-100 shrink-0" title="Toggle Sidebar" />
          <div>
            <h1 className="text-lg sm:text-[22px] font-bold text-gray-900 leading-tight">Talent Pipeline</h1>
            <p className="text-gray-500 text-sm mt-1 text-[13px] hidden sm:block">Manage, assess, and move candidates through your hiring process.</p>
          </div>
        </div>
        <Button className="bg-[#08b8cc] hover:bg-[#07a3b5] text-white rounded-md font-semibold text-sm px-4 h-9 shadow-sm">
          + Add Candidate
        </Button>
      </div>

      <div className="px-8 mt-6 max-w-[1400px] mx-auto">
        {/* Stages Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start h-auto p-0 gap-8 rounded-none">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#08b8cc] data-[state=active]:text-[#08b8cc] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 py-3 text-gray-500 font-semibold text-sm transition-none"
            >
              All Candidates <span className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{counts.all}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="matched" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#08b8cc] data-[state=active]:text-[#08b8cc] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 py-3 text-gray-500 font-semibold text-sm transition-none"
            >
              Matched Candidates <span className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{counts.matched}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shortlisted" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#08b8cc] data-[state=active]:text-[#08b8cc] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 py-3 text-gray-500 font-semibold text-sm transition-none"
            >
              Shortlisted <span className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{counts.shortlisted}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 outline-none">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="relative flex-1 min-w-[260px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, skill, or role..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10 rounded-md border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#08b8cc] bg-white"
                />
              </div>

              <Select value={selectedJob} onValueChange={handleSelectedJobChange}>
                <SelectTrigger className="w-[200px] h-10 rounded-md border-gray-200 text-sm bg-white font-medium text-gray-700">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent className="rounded-md">
                  {jobsLoading && (
                    <SelectItem value="__loading__" disabled>Loading jobs...</SelectItem>
                  )}
                  {!jobsLoading && employerJobs.length === 0 && (
                    <SelectItem value="__none__" disabled>No jobs found</SelectItem>
                  )}
                  {employerJobs.map((job) => (
                    <SelectItem key={job.id} value={String(job.id)}>{job.title ?? "Untitled Job"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Static UI Filters to match design */}
              <div className="px-4 h-10 rounded-md border border-gray-200 flex items-center justify-between gap-3 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                All Status <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="px-4 h-10 rounded-md border border-gray-200 flex items-center justify-between gap-3 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                AI Score: All <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              <div className="px-4 h-10 rounded-md border border-gray-200 flex items-center justify-between gap-3 bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Location: All <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
              
              <Button variant="outline" className="ml-auto h-10 rounded-md border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Bulk Actions
              </Button>
            </div>

            <div className="grid gap-3">
              {matchesLoading && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">Loading AI matches...</div>
              )}
              {!matchesLoading && matchesError && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">Failed to load AI matches. Please try again.</div>
              )}
              {!matchesLoading && !matchesError && !shouldFetchMatches && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">Select a job to see AI matched candidates.</div>
              )}
              {!matchesLoading && !matchesError && !jobsLoading && shouldFetchMatches && jobRelevantCandidates.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">No candidates matching this job found.</div>
              )}
              {!matchesLoading && !matchesError && shouldFetchMatches && jobRelevantCandidates.length > 0 && filteredCandidates.length === 0 && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                  <p className="font-semibold mb-1">No results found</p>
                  <p className="text-sm">No candidates matching "{searchTerm}" in the {activeTab} category.</p>
                </div>
              )}

              {filteredCandidates.map((candidate: CandidateListItem) => {
                const scoreColor = candidate.matchScore >= 90 ? "text-[#08b8cc]" : candidate.matchScore >= 80 ? "text-[#3b82f6]" : "text-[#f59e0b]";
                const scoreBorder = candidate.matchScore >= 90 ? "border-[#08b8cc]" : candidate.matchScore >= 80 ? "border-[#3b82f6]" : "border-[#f59e0b]";
                
                let badgeUI;
                if (candidate.stage === "shortlisted") {
                  badgeUI = <Badge className="bg-[#ccfbf1] text-[#0f766e] hover:bg-[#ccfbf1] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">Shortlisted</Badge>;
                } else if (candidate.matchScore >= 90) {
                  badgeUI = (
                    <div className="flex flex-col gap-1.5 items-center">
                      <Badge className="bg-[#f3e8ff] hover:bg-[#f3e8ff] text-[#7e22ce] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">Interview Done</Badge>
                      <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1 border border-gray-200 bg-white rounded flex px-1.5 py-0.5"><div className="w-1.5 h-1.5 rounded-full bg-[#08b8cc]"></div> Test: 92%</div>
                    </div>
                  );
                } else if (candidate.matchScore >= 80) {
                  badgeUI = <Badge className="bg-[#e0f2fe] text-[#0369a1] hover:bg-[#e0f2fe] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">New Match</Badge>;
                } else {
                  badgeUI = (
                    <div className="flex flex-col gap-1.5 items-center">
                      {/* <Badge className="bg-[#fef3c7] hover:bg-[#fef3c7] text-[#b45309] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">Test Assigned</Badge> */}
                      {/* <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1 border border-gray-200 bg-white rounded flex px-1.5 py-0.5"><Clock className="w-2.5 h-2.5" /> Pending</div> */}
                    </div>
                  );
                }

                return (
                <div key={candidate.id} className="bg-white border border-gray-100 rounded-lg p-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 min-w-[280px]">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#08b8cc] focus:ring-[#08b8cc]" />
                    <Avatar className="h-12 w-12 rounded-full border border-gray-100">
                      <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-lg">{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px] cursor-pointer hover:underline" onClick={() => handleViewProfile(candidate)}>
                        {getHighlightedName(candidate.name, searchTerm)}
                      </h3>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500 mt-0.5">
                        <span className="truncate max-w-[150px]">{candidate.role}</span>
                        <span className="text-gray-300">•</span>
                        <span>{candidate.experience.split(" ")[0]} yrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-[#f0f9ff] text-[#5abdcc] text-[11px] font-semibold rounded shrink-0">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 5 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded shrink-0">
                          +{candidate.skills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center min-w-[80px]">
                    <div className={`w-11 h-11 rounded-full border-2 ${scoreBorder} flex items-center justify-center`}>
                      <span className={`font-bold text-[13px] ${scoreColor}`}>{Math.round(candidate.matchScore)}%</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium mt-1">AI Match</span>
                  </div>

                  <div className="min-w-[120px] flex justify-center">
                    {badgeUI}
                  </div>

                  <div className="flex items-center gap-2 ml-auto min-w-[220px] justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => handleShortlist(candidate)}
                      className="h-8 px-4 text-[12px] font-semibold rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      {candidate.stage === "shortlisted" ? "Shortlisted" : "Shortlist"}
                    </Button>
                    <Button 
                      onClick={() => handleSkillTest(candidate)}
                      className="h-8 px-4 text-[12px] font-semibold rounded bg-[#08b8cc] hover:bg-[#07a3b5] text-white border-none shadow-none"
                    >
                      Initiate Skill Test
                    </Button>
                  </div>
                </div>
              )})}

              {shouldFetchMatches && !matchesError && (jobRelevantCandidates.length > 0 || hasMoreMatches) && (
                <div className="flex justify-center pt-6 pb-4">
                  <Button
                    variant="outline"
                    className="rounded-md border-gray-200 h-9 px-6 text-sm font-medium"
                    onClick={handleLoadMoreMatches}
                    disabled={matchesLoading || !hasMoreMatches}
                  >
                    {matchesLoading ? "Loading..." : hasMoreMatches ? "Load More Candidates" : "All Candidates Loaded"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerAIShortlists;

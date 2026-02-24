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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CandidateProfileModal, {
  CandidateProfile,
} from "@/components/employer/candidates/CandidateProfileModal";
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
  const candidateIdParam = searchParams.get("candidateId");
  const [selectedJob, setSelectedJob] = useState(jobIdParam || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [shortlistedIds, setShortlistedIds] = useState<EntityId[]>([]);
  const [employerJobsPage, setEmployerJobsPage] = useState(1);
  const [loadedEmployerJobs, setLoadedEmployerJobs] = useState<Job[]>([]);
  const [jobMatchesPage, setJobMatchesPage] = useState(1);
  const [loadedMatches, setLoadedMatches] = useState<Match[]>([]);
  const parsedCandidateId: EntityId | null =
    candidateIdParam === null || candidateIdParam.trim().length === 0
      ? null
      : candidateIdParam;
  const { data: employerJobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({
      page: employerJobsPage,
      limit: EMPLOYER_JOBS_PAGE_SIZE,
    });

  const employerJobs = loadedEmployerJobs;
  const isAllJobsSelected = selectedJob === "all";
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
    if (initialJobId && initialJobId !== "all" && selectedJob === "all") {
      setSelectedJob(initialJobId);
    }
  }, []); // Run only on mount

  // Sync selectedJob with URL search params on mount and navigation
  useEffect(() => {
    const currentJobIdParam = searchParams.get("jobId");
    const jobIdFromUrl = currentJobIdParam || "all";
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

    setLoadedEmployerJobs((previousJobs) =>
      employerJobsPage === 1
        ? nextJobs
        : mergeUniqueById(previousJobs, nextJobs),
    );
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

  const selectedCandidate = useMemo(() => {
    if (parsedCandidateId === null) {
      return null;
    }

    const candidateIdKey = getEntityIdKey(parsedCandidateId);
    return (
      jobRelevantCandidates.find(
        (item) => getEntityIdKey(item.id) === candidateIdKey,
      ) ?? null
    );
  }, [jobRelevantCandidates, parsedCandidateId]);
  const showProfileModal = selectedCandidate !== null;

  // Real-time search as user types
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectedJobChange = (value: string) => {
    setSelectedJob(value);
    setLoadedMatches([]);
    setJobMatchesPage(1);
    // Update URL search params so jobId persists across navigation
    const nextParams = new URLSearchParams(searchParams);
    if (value === "all") {
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
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("candidateId", String(candidate.id));
    setSearchParams(nextParams);
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

  const closeProfileModal = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("candidateId");
    setSearchParams(nextParams);
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
    closeProfileModal();
  };

  const handleScheduleInterview = (candidate: CandidateProfile) => {
    toast.success(`Interview scheduled with ${candidate.name}!`);
    closeProfileModal();
    navigate("/hire-talent/ai-interviews");
  };

  const handleSkillTest = (candidate: CandidateProfile) => {
    toast.success(`Skill test scheduled for ${candidate.name}!`);
    closeProfileModal();
    navigate("/hire-talent/skill-tests");
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {filteredCandidates.length} Candidates
                </h2>
                <p className="text-muted-foreground">
                  {activeTab === "matched"
                    ? `Matched Candidates`
                    : activeTab === "shortlisted"
                      ? `Shortlisted Candidates`
                      : `For your active job postings`}
                  {searchTerm && ` (Search: "${searchTerm}")`}
                </p>
              </div>
            </div>
            <Button
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleRefreshMatches}
              disabled={!shouldFetchMatches || matchesLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Matches
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        <Select value={selectedJob} onValueChange={handleSelectedJobChange}>
          <SelectTrigger className="w-[200px] rounded-xl">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobsLoading && (
              <SelectItem value="__loading__" disabled>
                Loading jobs...
              </SelectItem>
            )}
            {!jobsLoading && employerJobs.length === 0 && (
              <SelectItem value="__none__" disabled>
                No jobs found
              </SelectItem>
            )}
            {employerJobs.map((job) => (
              <SelectItem key={job.id} value={String(job.id)}>
                {job.title ?? "Untitled Job"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={handleLoadMoreJobs}
          disabled={jobsLoading || !hasMoreEmployerJobs}
        >
          <ChevronDown className="h-4 w-4 mr-2" />
          {hasMoreEmployerJobs ? "Load More Jobs" : "All Jobs Loaded"}
        </Button>

        <Button variant="outline" className="rounded-xl">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>

        <Button variant="outline" className="rounded-xl">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stages Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="all" className="rounded-lg px-6">
            All ({counts.all})
          </TabsTrigger>
          <TabsTrigger value="matched" className="rounded-lg px-6">
            Matched ({counts.matched})
          </TabsTrigger>
          <TabsTrigger value="shortlisted" className="rounded-lg px-6">
            Shortlisted ({counts.shortlisted})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {matchesLoading && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Loading AI matches...
                </CardContent>
              </Card>
            )}
            {!matchesLoading && matchesError && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Failed to load AI matches. Please try again.
                </CardContent>
              </Card>
            )}
            {!matchesLoading && !matchesError && !shouldFetchMatches && (
              <Card className="border-dashed">
                <CardContent className="p-6 text-center text-muted-foreground">
                  Select a job to see AI matched candidates.
                </CardContent>
              </Card>
            )}
            {!matchesLoading &&
              !matchesError &&
              !jobsLoading &&
              shouldFetchMatches &&
              jobRelevantCandidates.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    No candidates matching this job found.
                  </CardContent>
                </Card>
              )}
            {!matchesLoading &&
              !matchesError &&
              shouldFetchMatches &&
              jobRelevantCandidates.length > 0 &&
              filteredCandidates.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <div>
                      <p className="font-semibold mb-1">No results found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? `No candidates matching "${searchTerm}" in the ${activeTab} category.`
                          : `No ${activeTab === "matched" ? "matched " : activeTab === "shortlisted" ? "shortlisted " : ""}candidates found.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            {filteredCandidates.map((candidate: CandidateListItem) => (
              <Card
                key={candidate.id}
                className="hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-start">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-[280px]">
                      <Avatar className="h-14 w-14 bg-primary/10">
                        <AvatarFallback className="text-lg font-semibold text-primary">
                          {candidate.name
                            .trim()
                            .split(/\s+/)
                            .filter((segment) => segment.length > 0)
                            .map((segment) => segment[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {getHighlightedName(candidate.name, searchTerm)}
                          </h3>
                          {candidate.type === "bench" ? (
                            <Badge variant="secondary" className="text-xs">
                              <Building2 className="h-3 w-3 mr-1" />
                              Bench
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <User className="h-3 w-3 mr-1" />
                              Individual
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {candidate.role}
                        </p>
                        {candidate.type === "bench" && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            via {candidate.company}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-center min-w-[100px]">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-muted/30"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${(candidate.matchScore / 100) * 176} 176`}
                            className="text-primary"
                          />
                        </svg>
                        <span className="absolute text-sm font-bold text-primary">
                          {candidate.matchScore}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        AI Match
                      </p>
                    </div>

                    {/* Match Validation - Shows why this candidate is relevant */}
                    {candidate.matchReasons.length > 0 && (
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-xs text-muted-foreground mb-2">
                          Match Reason
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.matchReasons.map((reason: string) => (
                            <Badge
                              key={reason}
                              className="text-xs bg-green-100 text-green-800 border-green-200"
                            >
                              ✓ {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-xs text-muted-foreground mb-2">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 4).map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-[120px]">
                      <p className="text-xs text-muted-foreground">
                        Experience
                      </p>
                      <p className="font-medium text-sm">
                        {candidate.experience}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Availability
                      </p>
                      <p className="font-medium text-sm text-primary">
                        {candidate.availability}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button
                        size="sm"
                        className="rounded-lg"
                        onClick={() => handleViewProfile(candidate)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      {candidate.stage === "matched" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => handleShortlist(candidate)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Shortlist
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-primary border-primary hover:bg-primary/10"
                          onClick={() => handleSkillTest(candidate)}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Skill Test
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {shouldFetchMatches &&
              !matchesError &&
              (jobRelevantCandidates.length > 0 || hasMoreMatches) && (
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={handleLoadMoreMatches}
                    disabled={matchesLoading || !hasMoreMatches}
                  >
                    {matchesLoading
                      ? "Loading..."
                      : hasMoreMatches
                        ? "Load More Candidates"
                        : "All Candidates Loaded"}
                  </Button>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        open={showProfileModal}
        onClose={closeProfileModal}
        onScheduleInterview={handleScheduleInterview}
        onShortlist={handleShortlist}
        onSkillTest={handleSkillTest}
      />
    </div>
  );
};

export default EmployerAIShortlists;

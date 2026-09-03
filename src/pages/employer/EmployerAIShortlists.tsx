import React, { useEffect, useMemo, useRef, useState } from "react";
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
  CheckCircle2,
  Play,
  CircleDot,
  Mail,
  Phone,
  AlertCircle,
  Video,
  FileText,
  Bell,
  Plus,
  X,
  Check,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  useRemoveShortlistCandidateMutation,
  useGetCustomTestByCandidateQuery,
} from "@/app/queries/aiShortlistApi";
import { useGetTestReportQuery } from "@/app/queries/contractorSkillTest";
import type { EntityId, Job, Match } from "@/app/queries/aiShortlistApi";
import CandidateSkillTestDetails from "./CandidateSkillTestDetails";
import { useGetInvitedTestReportQuery } from "@/app/queries/employerApi";

type CandidateProfileWithMeta = CandidateProfile & {
  experienceYears?: number;
  availableWeeklyHours?: number;
  talentSource: "candidate" | "bench";
  email?: string;
  mobileNumber?: string;
};

export type CandidateListItem = CandidateProfileWithMeta & {
  stage: "matched" | "shortlisted" | "invited" | "completed";
  matchReasons: string[];
};

const EMPLOYER_JOBS_PAGE_SIZE = 100;
const JOB_MATCHES_PAGE_SIZE = 10;

const mergeUniqueById = <T extends { id: EntityId }>(
  existingItems: T[],
  nextItems: T[],
  getItemKey: (item: T) => string = (item) => String(item.id),
) => {
  const seenIds = new Set(existingItems.map(getItemKey));
  const mergedItems = [...existingItems];

  nextItems.forEach((item) => {
    const itemKey = getItemKey(item);
    if (!seenIds.has(itemKey)) {
      seenIds.add(itemKey);
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const getEntityIdKey = (id: EntityId) => String(id);

type TalentSource = "candidate" | "bench";
type CandidateIdentityKey = `${TalentSource}:${string}`;
type PendingShortlistChange = {
  isShortlisted: boolean;
  version: number;
  settled: boolean;
};

const getTalentSource = (source: Match["source"]): TalentSource =>
  source === "bench" ? "bench" : "candidate";

const getCandidateIdentityKey = (
  id: EntityId,
  talentSource: TalentSource,
): CandidateIdentityKey => `${talentSource}:${getEntityIdKey(id)}`;

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

const normalizeInvitedTestResults = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData;
    }

    const maybeResults = (payload as { results?: unknown }).results;
    if (Array.isArray(maybeResults)) {
      return maybeResults;
    }
  }

  return [];
};

const normalizeEmail = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().toLowerCase();
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
    talentSource: getTalentSource(match.source),
    hourlyRate: { min: hourlyFallback, max: hourlyMax },
    location: match.location || "Not specified",
    englishLevel: match.englishLevel,
    certifications: normalizeCertifications(match.certifications),
    about: match.about,
    workExperience: normalizeWorkExperience(match.workExperience),
    projects: normalizeProjects(match.projects),
    email: match.email as string | undefined,
    mobileNumber: match.mobileNumber as string | undefined,
    availableWeeklyHours: match.availableWeeklyHours as number | undefined,
  };
};

const findReportByCandidateEmail = (
  candidateEmail: string | undefined,
  invitedTestResults: unknown[],
  scopedJobId?: string | null,
) => {
  if (!candidateEmail) return undefined;
  const normalizedCandidateEmail = normalizeEmail(candidateEmail);

  // When a specific job is selected, only consider results for that job
  const scopedResults = scopedJobId
    ? invitedTestResults.filter((item) => {
        const report = item as Record<string, unknown>;
        const reportJobId =
          report.jobId ??
          report.job_id ??
          (report.job as Record<string, unknown> | undefined)?.id;
        return String(reportJobId) === String(scopedJobId);
      })
    : invitedTestResults;

  return scopedResults.find((item) => {
    const report = item as Record<string, unknown>;
    const reportEmail = normalizeEmail(
      report.candidateEmail ??
        report.email ??
        (report.candidate as Record<string, unknown> | undefined)?.email,
    );
    return reportEmail === normalizedCandidateEmail;
  });
};

const CandidateAiInterviewDetails = ({
  candidate,
}: {
  candidate: CandidateListItem | undefined;
}) => {
  if (!candidate)
    return (
      <div className="text-gray-400 font-medium text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-12">
        Select a candidate to view their AI interview scores
      </div>
    );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex min-w-0 flex-col p-4 sm:p-6">
      <h3 className="text-center">Coming soon...</h3>
    </div>
  );
};

const SidebarCandidateItem = ({
  candidate,
  isSelected,
  onClick,
  tab,
  invitedTestResults,
  selectedJobId,
}: {
  candidate: CandidateListItem;
  isSelected: boolean;
  onClick: () => void;
  tab: "skill-test" | "ai-interview";
  invitedTestResults: any[];
  selectedJobId?: string | null;
}) => {
  const selectedCandidateReport = useMemo(() => {
    return findReportByCandidateEmail(
      candidate.email,
      invitedTestResults,
      selectedJobId,
    );
  }, [candidate.email, invitedTestResults, selectedJobId]);

  let statusDisplay = tab === "skill-test" ? "Pending" : "Interviewed";
  if (tab === "skill-test" && selectedCandidateReport) {
    const reportStatus = (selectedCandidateReport as Record<string, unknown>)
      ?.status;
    if (typeof reportStatus === "string" && reportStatus.trim()) {
      statusDisplay = reportStatus;
    }
  }

  return (
    <div
      onClick={onClick}
      className={`w-[260px] shrink-0 p-4 rounded-xl border cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 lg:w-full ${isSelected ? "border-[#08b8cc] border-l-[3px] shadow-sm bg-white" : "border-gray-100 border-l-[3px] border-l-transparent bg-white shadow-sm"}`}
    >
      <Avatar className="h-10 w-10 shrink-0 shadow-sm border border-gray-100">
        <AvatarFallback className="bg-gray-100 text-gray-700 font-bold">
          {candidate.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex lg:justify-between lg:items-center w-full flex-col lg:flex-row min-w-0">
        <div>
          <h4 className="font-bold text-gray-900 text-[14px] truncate">
            {candidate.name}
          </h4>
          <h5 className="text-[11px] text-gray-600">{candidate?.role}</h5>
        </div>
        <div className="mt-1 text-[11px] font-bold flex items-center justify-between tracking-wide">
          <div
            className={`flex items-center gap-1.5 ${statusDisplay === "Correct" || statusDisplay === "Completed" ? "text-[#08b8cc]" : statusDisplay === "Incorrect" ? "text-red-500" : "text-gray-400"}`}
          >
            <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
            {statusDisplay}
          </div>
        </div>
      </div>
    </div>
  );
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
  const [selectedCandidateId, setSelectedCandidateId] =
    useState<CandidateIdentityKey | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<CandidateIdentityKey[]>(
    [],
  );
  const [pendingShortlistChanges, setPendingShortlistChanges] = useState<
    Record<CandidateIdentityKey, PendingShortlistChange>
  >({});
  const shortlistRequestVersionsRef = useRef<
    Record<CandidateIdentityKey, number>
  >({});
  const backendShortlistStateRef = useRef(
    new Map<CandidateIdentityKey, boolean>(),
  );
  const [bulkFilterStatus, setBulkFilterStatus] = useState<
    "" | "shortlisted" | "unshortlisted"
  >("");
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
  const [removeShortlistCandidateMutation] =
    useRemoveShortlistCandidateMutation();

  const {
    data: invitedTestReportResponse,
    isLoading: invitedTestReportLoading,
  } = useGetInvitedTestReportQuery();

  const invitedTestResults = useMemo(
    () => normalizeInvitedTestResults(invitedTestReportResponse),
    [invitedTestReportResponse],
  );

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
  }, [searchParams]);

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
      backendShortlistStateRef.current.clear();
      return;
    }

    const nextMatches = matchesResponse?.data ?? [];
    setLoadedMatches((previousMatches) =>
      jobMatchesPage === 1
        ? nextMatches
        : mergeUniqueById(previousMatches, nextMatches, (match) =>
            getCandidateIdentityKey(match.id, getTalentSource(match.source)),
          ),
    );

    // Rebuild from the latest backend snapshot, then reapply only mutations
    // that are still pending so stale backend data cannot erase local intent.
    const backendShortlistState = backendShortlistStateRef.current;
    if (jobMatchesPage === 1) {
      backendShortlistState.clear();
    }
    nextMatches.forEach((m: Match) => {
      backendShortlistState.set(
        getCandidateIdentityKey(m.id, getTalentSource(m.source)),
        m.isShortlisted === true,
      );
    });
    const backendShortlistedIds = Array.from(backendShortlistState.entries())
      .filter(([, isShortlisted]) => isShortlisted)
      .map(([id]) => id);

    setShortlistedIds(() => {
      const reconciled = new Set<string>(backendShortlistedIds);
      Object.keys(pendingShortlistChanges).forEach((id) => {
        const shortlistId = id as CandidateIdentityKey;
        const pendingChange = pendingShortlistChanges[shortlistId];
        if (pendingChange.isShortlisted) {
          reconciled.add(shortlistId);
        } else {
          reconciled.delete(shortlistId);
        }
      });
      return Array.from(reconciled) as CandidateIdentityKey[];
    });

    setPendingShortlistChanges((prev) => {
      let next = prev;
      Object.keys(prev).forEach((id) => {
        const shortlistId = id as CandidateIdentityKey;
        const pendingChange = prev[shortlistId];
        if (
          shortlistRequestVersionsRef.current[shortlistId] !==
            pendingChange.version ||
          !pendingChange.settled ||
          backendShortlistState.get(shortlistId) !== pendingChange.isShortlisted
        ) {
          return;
        }
        if (next === prev) next = { ...prev };
        delete next[shortlistId];
      });
      return next;
    });
  }, [
    jobMatchesPage,
    matchesResponse?.data,
    pendingShortlistChanges,
    shouldFetchMatches,
  ]);

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

  const stageById = useMemo(
    () =>
      new Map(
        loadedMatches.map((m) => [
          getCandidateIdentityKey(m.id, getTalentSource(m.source)),
          m.stage,
        ]),
      ),
    [loadedMatches],
  );

  const candidates = useMemo<CandidateListItem[]>(() => {
    const shortlistedIdKeys = new Set(shortlistedIds);

    return loadedMatches
      .map(mapMatchToCandidate)
      .filter(
        (candidate): candidate is CandidateProfileWithMeta =>
          candidate !== null,
      )
      .map((c) => ({
        ...c,
        stage:
          stageById.get(getCandidateIdentityKey(c.id, c.talentSource)) ===
          "completed"
            ? "completed"
            : stageById.get(getCandidateIdentityKey(c.id, c.talentSource)) ===
                "invited"
              ? "invited"
              : shortlistedIdKeys.has(
                    getCandidateIdentityKey(c.id, c.talentSource),
                  )
                ? "shortlisted"
                : "matched",
        matchReasons: [],
      }));
  }, [loadedMatches, shortlistedIds]);

  // No client-side filtering — display exactly what the backend returns for the selected job

  // Filter by tab and search term only — no additional relevance filtering
  const normalizedSearchTerm = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm],
  );

  const filteredCandidates = useMemo(
    () =>
      candidates
        .filter((c) => {
          if (activeTab === "matched") return c.stage === "matched";
          if (activeTab === "shortlisted") return c.stage === "shortlisted";
          return true;
        })
        .filter((c) => {
          if (bulkFilterStatus === "shortlisted")
            return c.stage === "shortlisted";
          if (bulkFilterStatus === "unshortlisted")
            return c.stage === "matched";
          return true;
        })
        .filter((c) => {
          if (!normalizedSearchTerm) return true;
          return c.name.toLowerCase().includes(normalizedSearchTerm);
        }),
    [candidates, activeTab, bulkFilterStatus, normalizedSearchTerm],
  );

  // Sidebar always shows only shortlisted candidates for the selected job,
  // independent of activeTab / bulkFilterStatus filters on the main list.
  const sidebarCandidates = useMemo(
    () =>
      candidates
        .filter((c) =>
          ["shortlisted", "invited", "completed"].includes(c.stage),
        )
        .filter((c) =>
          !normalizedSearchTerm
            ? true
            : c.name.toLowerCase().includes(normalizedSearchTerm),
        ),
    [candidates, normalizedSearchTerm],
  );

  const counts = useMemo(() => {
    const matchesSearch = (candidate: CandidateListItem) =>
      !normalizedSearchTerm ||
      candidate.name.toLowerCase().includes(normalizedSearchTerm);

    return {
      all: candidates.filter(matchesSearch).length,
      matched: candidates.filter(
        (candidate) =>
          candidate.stage === "matched" && matchesSearch(candidate),
      ).length,
      shortlisted: candidates.filter(
        (candidate) =>
          candidate.stage === "shortlisted" && matchesSearch(candidate),
      ).length,
    };
  }, [candidates, normalizedSearchTerm]);

  // Real-time search as user types
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectedJobChange = (value: string) => {
    setSelectedJob(value === "all" ? "" : value);
    setLoadedMatches([]);
    setJobMatchesPage(1);
    setShortlistedIds([]);
    setPendingShortlistChanges({});
    shortlistRequestVersionsRef.current = {};
    backendShortlistStateRef.current.clear();
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
    backendShortlistStateRef.current.clear();
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
    const trimmedQuery = query.trim().slice(0, 100);
    if (!trimmedQuery) return <span>{name}</span>;

    const lowerName = name.toLowerCase();
    const lowerQuery = trimmedQuery.toLowerCase();
    const idx = lowerName.indexOf(lowerQuery);
    if (idx === -1) return <span>{name}</span>;

    return (
      <span>
        {name.slice(0, idx)}
        <span className="bg-yellow-200 font-semibold">
          {name.slice(idx, idx + trimmedQuery.length)}
        </span>
        {name.slice(idx + trimmedQuery.length)}
      </span>
    );
  };

  const handleShortlist = (
    candidate: CandidateProfile & { talentSource?: "candidate" | "bench" },
  ) => {
    if (!selectedJobId) {
      toast.error("Please select a job first.");
      return;
    }

    const talentSource = candidate.talentSource ?? "candidate";
    const shortlistedCandidateKey = getCandidateIdentityKey(
      candidate.id,
      talentSource,
    );
    const hasAlreadyShortlisted = shortlistedIds.includes(
      shortlistedCandidateKey,
    );
    const requestVersion =
      (shortlistRequestVersionsRef.current[shortlistedCandidateKey] ?? 0) + 1;
    shortlistRequestVersionsRef.current[shortlistedCandidateKey] =
      requestVersion;

    if (hasAlreadyShortlisted) {
      // Logic for undoing shortlist
      setPendingShortlistChanges((prev) => ({
        ...prev,
        [shortlistedCandidateKey]: {
          isShortlisted: false,
          version: requestVersion,
          settled: false,
        },
      }));
      setShortlistedIds((prev) =>
        prev.filter((id) => id !== shortlistedCandidateKey),
      );
      toast.info(`${candidate.name} removed from shortlist`);

      removeShortlistCandidateMutation({
        jobId: selectedJobId,
        talentId: candidate.id,
        talentSource,
      })
        .unwrap()
        .then(() => {
          if (
            shortlistRequestVersionsRef.current[shortlistedCandidateKey] !==
            requestVersion
          ) {
            return;
          }
          setPendingShortlistChanges((prev) => {
            const pendingChange = prev[shortlistedCandidateKey];
            if (pendingChange?.version !== requestVersion) return prev;
            return {
              ...prev,
              [shortlistedCandidateKey]: { ...pendingChange, settled: true },
            };
          });
        })
        .catch(() => {
          // Rollback on error
          if (
            shortlistRequestVersionsRef.current[shortlistedCandidateKey] !==
            requestVersion
          ) {
            return;
          }
          setPendingShortlistChanges((prev) => {
            if (prev[shortlistedCandidateKey]?.version !== requestVersion)
              return prev;
            const next = { ...prev };
            delete next[shortlistedCandidateKey];
            return next;
          });
          setShortlistedIds((prev) => [...prev, shortlistedCandidateKey]);
          toast.error("Failed to remove from shortlist. Please try again.");
        });
    } else {
      // Logic for adding to shortlist
      setPendingShortlistChanges((prev) => ({
        ...prev,
        [shortlistedCandidateKey]: {
          isShortlisted: true,
          version: requestVersion,
          settled: false,
        },
      }));
      setShortlistedIds((prev) => [...prev, shortlistedCandidateKey]);
      toast.success(`${candidate.name} added to shortlist!`);

      shortlistCandidateMutation({
        jobId: selectedJobId,
        talentId: candidate.id,
        talentSource,
      })
        .unwrap()
        .then(() => {
          if (
            shortlistRequestVersionsRef.current[shortlistedCandidateKey] !==
            requestVersion
          ) {
            return;
          }
          setPendingShortlistChanges((prev) => {
            const pendingChange = prev[shortlistedCandidateKey];
            if (pendingChange?.version !== requestVersion) return prev;
            return {
              ...prev,
              [shortlistedCandidateKey]: { ...pendingChange, settled: true },
            };
          });
        })
        .catch(() => {
          // Rollback on error
          if (
            shortlistRequestVersionsRef.current[shortlistedCandidateKey] !==
            requestVersion
          ) {
            return;
          }
          setPendingShortlistChanges((prev) => {
            if (prev[shortlistedCandidateKey]?.version !== requestVersion)
              return prev;
            const next = { ...prev };
            delete next[shortlistedCandidateKey];
            return next;
          });
          setShortlistedIds((prev) =>
            prev.filter((id) => id !== shortlistedCandidateKey),
          );
          toast.error(
            `Failed to shortlist ${candidate.name}. Please try again.`,
          );
        });
    }
  };

  const selectedCandidateForDetails = useMemo(
    () =>
      selectedCandidateId == null
        ? undefined
        : candidates.find(
            (c) =>
              getCandidateIdentityKey(c.id, c.talentSource) ===
              selectedCandidateId,
          ),
    [candidates, selectedCandidateId],
  );

  const selectedCandidateSkillReport = useMemo(() => {
    return findReportByCandidateEmail(
      selectedCandidateForDetails?.email,
      invitedTestResults,
      selectedJobId,
    );
  }, [invitedTestResults, selectedCandidateForDetails?.email, selectedJobId]);

  const renderSidebar = (tab: "skill-test" | "ai-interview") => (
    <div className="w-full shrink-0 lg:sticky lg:top-[100px] lg:h-fit lg:w-[320px]">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10 border-gray-200 text-[13px] focus-visible:ring-[#08b8cc] rounded-lg shadow-sm bg-white w-full"
          />
        </div>
        <Button
          variant="outline"
          className="h-10 px-3 text-[13px] font-bold text-gray-700 bg-white border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 rounded-lg shadow-sm sm:w-auto"
        >
          Filter <Filter className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible">
        {sidebarCandidates.length === 0 && (
          <div className="w-full p-4 text-center text-[12px] text-gray-400 font-medium bg-white rounded-xl border border-gray-100 shadow-sm">
            {!selectedJob
              ? "Select a job to see shortlisted candidates."
              : "No shortlisted candidates yet."}
          </div>
        )}
        {sidebarCandidates.map((candidate) => (
          <SidebarCandidateItem
            key={getCandidateIdentityKey(candidate.id, candidate.talentSource)}
            candidate={candidate}
            isSelected={
              selectedCandidateId ===
              getCandidateIdentityKey(candidate.id, candidate.talentSource)
            }
            onClick={() =>
              setSelectedCandidateId(
                getCandidateIdentityKey(candidate.id, candidate.talentSource),
              )
            }
            tab={tab}
            invitedTestResults={invitedTestResults}
            selectedJobId={selectedJobId}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter text-gray-900 flex flex-col">
      {/* Restored Sticky Original Navbar */}
      {/* <div className="bg-white px-4 sm:px-8 py-2.5 sm:py-3.5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <SidebarTrigger className="text-muted-foreground hover:bg-gray-100" title="Toggle Sidebar" />
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-10 px-5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
          <Button size="icon" className="relative bg-transparent hover:bg-gray-100 rounded-xl h-10 w-10">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
        </div>
      </div> */}

      <div className="px-6 sm:px-10 md:px-8 mt-8 max-w-[1400px] w-full mx-auto pb-10 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-gray-900 leading-tight">
            Talent Pipeline
          </h1>
        </div>
        <p className="text-gray-500 font-medium text-sm mb-6">
          {selectedJobDetails?.title ?? "Senior Frontend Engineer"} •{" "}
          {bulkFilterStatus === "shortlisted" ? (
            <span className="text-[#08b8cc] font-semibold">
              {counts.shortlisted} Shortlisted
            </span>
          ) : bulkFilterStatus === "unshortlisted" ? (
            <span className="text-gray-600 font-semibold">
              {counts.matched} Unshortlisted
            </span>
          ) : (
            <span>{counts.all} Total Candidates</span>
          )}
        </p>

        {/* Stages Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-8">
            <TabsList className="bg-gray-100 p-1.5 rounded-xl h-auto inline-flex gap-1 max-w-full">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg px-5 py-2.5 text-gray-500 font-bold text-sm transition-all sm:text-sm text-[10px]"
              >
                All Candidates
              </TabsTrigger>
              <TabsTrigger
                value="skill-test"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg px-5 py-2.5 text-gray-500 font-bold text-sm transition-all sm:text-sm text-[10px]"
              >
                Skill Test Scores
              </TabsTrigger>
              <TabsTrigger
                value="ai-interview"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg px-5 py-2.5 text-gray-500 font-bold text-sm transition-all sm:text-sm text-[10px]"
              >
                AI Interview Scores
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0 outline-none">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="relative flex-1 min-w-[260px] max-w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, skill, or role..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10 rounded-xl border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#08b8cc] bg-white shadow-sm w-full"
                />
              </div>

              <Select
                value={selectedJob}
                onValueChange={handleSelectedJobChange}
              >
                <SelectTrigger className="w-[200px] h-10 rounded-xl border-gray-200 text-sm bg-white font-medium text-gray-700 shadow-sm">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
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

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-10 rounded-xl border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50 shadow-sm flex items-center gap-2 ${
                        bulkFilterStatus
                          ? "border-[#08b8cc] text-[#08b8cc]"
                          : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                      Bulk Actions
                      {bulkFilterStatus && (
                        <span className="ml-1 bg-[#08b8cc] text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                          1
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-72 rounded-xl shadow-xl border-border p-4 bg-white flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">
                        Filter Candidates
                      </span>
                      {bulkFilterStatus && (
                        <button
                          onClick={() => setBulkFilterStatus("")}
                          className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-500">
                        Select Job
                      </span>
                      <Select
                        value={selectedJob || ""}
                        onValueChange={handleSelectedJobChange}
                      >
                        <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 text-sm bg-white font-medium text-gray-700 shadow-sm">
                          <SelectValue placeholder="Select Job" />
                        </SelectTrigger>
                        <SelectContent>
                          {employerJobs.map((job) => (
                            <SelectItem key={job.id} value={String(job.id)}>
                              {job.title ?? "Untitled Job"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-gray-500">
                        Filter by Status
                      </span>
                      <Select
                        value={bulkFilterStatus}
                        onValueChange={(v) =>
                          setBulkFilterStatus(
                            v as "shortlisted" | "unshortlisted" | "",
                          )
                        }
                      >
                        <SelectTrigger className="w-full h-10 rounded-xl border-gray-200 text-sm bg-white font-medium text-gray-700 shadow-sm">
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shortlisted">
                            Shortlisted
                          </SelectItem>
                          <SelectItem value="unshortlisted">
                            Unshortlisted
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-3">
              {matchesLoading && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                  Loading candidates...
                </div>
              )}
              {!matchesLoading && matchesError && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                  Failed to load candidates. Please try again.
                </div>
              )}
              {!matchesLoading && !matchesError && !shouldFetchMatches && (
                <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                  Select a job to see matched candidates.
                </div>
              )}
              {!matchesLoading &&
                !matchesError &&
                !jobsLoading &&
                shouldFetchMatches &&
                candidates.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                    No candidates found for this job.
                  </div>
                )}
              {!matchesLoading &&
                !matchesError &&
                shouldFetchMatches &&
                candidates.length > 0 &&
                filteredCandidates.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground border rounded-lg bg-white">
                    <p className="font-semibold mb-1">No results found</p>
                  </div>
                )}

              {filteredCandidates.map((candidate: CandidateListItem) => {
                const scoreColor =
                  candidate.matchScore >= 90
                    ? "text-[#08b8cc]"
                    : candidate.matchScore >= 80
                      ? "text-[#3b82f6]"
                      : "text-[#f59e0b]";
                const scoreBorder =
                  candidate.matchScore >= 90
                    ? "border-[#08b8cc]"
                    : candidate.matchScore >= 80
                      ? "border-[#3b82f6]"
                      : "border-[#f59e0b]";

                let badgeUI;
                if (candidate.stage === "invited") {
                  badgeUI = (
                    <Badge className="bg-[#e0e7ff] text-[#4f46e5] hover:bg-[#e0e7ff] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">
                      Invited
                    </Badge>
                  );
                } else if (candidate.stage === "shortlisted") {
                  badgeUI = (
                    <Badge className="bg-[#ccfbf1] text-[#0f766e] hover:bg-[#ccfbf1] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">
                      Shortlisted
                    </Badge>
                  );
                } else if (candidate.matchScore >= 90) {
                  badgeUI = (
                    <div className="flex flex-col gap-1.5 items-center">
                      <Badge className="bg-[#f3e8ff] hover:bg-[#f3e8ff] text-[#7e22ce] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">
                        Interview Done
                      </Badge>
                      <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1 border border-gray-200 bg-white rounded px-1.5 py-0.5 whitespace-nowrap">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#08b8cc]"></div>{" "}
                        Test: 92%
                      </div>
                    </div>
                  );
                } else if (candidate.matchScore >= 80) {
                  badgeUI = (
                    <Badge className="bg-[#e0f2fe] text-[#0369a1] hover:bg-[#e0f2fe] border-none px-2.5 py-0.5 font-semibold text-[11px] rounded-sm">
                      New Match
                    </Badge>
                  );
                } else {
                  badgeUI = null;
                }

                return (
                  <div
                    key={getCandidateIdentityKey(
                      candidate.id,
                      candidate.talentSource,
                    )}
                    className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm xl:flex-row xl:items-center xl:gap-6"
                  >
                    <div className="flex items-center gap-4 w-full min-w-0 xl:w-[280px] xl:shrink-0">
                      {/* <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#08b8cc] focus:ring-[#08b8cc]" /> */}
                      <Avatar className="h-12 w-12 shrink-0 rounded-full border border-gray-100 shadow-sm">
                        <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-lg">
                          {candidate.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3
                          className="font-bold text-gray-900 text-[15px] cursor-pointer hover:underline truncate"
                          onClick={() => handleViewProfile(candidate)}
                        >
                          {getHighlightedName(candidate.name, searchTerm)}
                        </h3>
                        <div className="flex items-center gap-2 text-[12px] text-gray-500 mt-0.5 min-w-0">
                          <span className="truncate min-w-0 max-w-[180px] sm:max-w-[240px] lg:max-w-[150px]">
                            {candidate.role}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>{candidate.experience.split(" ")[0]} yrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full min-w-0 xl:flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="max-w-full truncate px-2 py-1 bg-[#fefdfa] border border-gray-100 shadow-sm text-gray-600 text-[11px] font-semibold rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-md shrink-0 border border-gray-100 shadow-sm">
                            +{candidate.skills.length - 5}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-600 mt-3 min-w-0 bg-blue-50/50 px-2.5 py-1.5 rounded-md border border-blue-100/50 w-fit">
                        <Clock className="text-blue-600" size={16} />
                        <span className="font-medium text-gray-600 whitespace-nowrap">
                          Available Weekly Hours:
                        </span>
                        <span className="font-bold text-blue-600 shrink-0">
                          {candidate?.availableWeeklyHours ?? "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full min-w-0 flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 sm:flex-row sm:items-center sm:justify-between xl:w-auto xl:min-w-[430px] xl:border-0 xl:bg-transparent xl:p-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`w-11 h-11 shrink-0 rounded-full border-2 ${scoreBorder} flex items-center justify-center bg-white`}
                        >
                          <span
                            className={`font-bold text-[13px] ${scoreColor}`}
                          >
                            {Math.round(candidate.matchScore)}%
                          </span>
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase text-gray-400">
                            AI Match
                          </span>
                          <div className="mt-1 flex min-w-0 items-center">
                            {badgeUI}
                          </div>
                        </div>
                      </div>

                      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
                        <Button
                          variant="outline"
                          onClick={() =>
                            candidate.stage !== "shortlisted" &&
                            candidate.stage !== "invited" &&
                            handleShortlist(candidate)
                          }
                          className={`h-9 min-w-0 flex-1 px-4 text-[13px] font-bold rounded-xl border shadow-sm transition-all sm:flex-none ${
                            candidate.stage === "invited"
                              ? "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700"
                              : candidate.stage === "shortlisted"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
                                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {candidate.stage === "invited" ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="w-4 h-4" strokeWidth={3} />
                              Invited
                            </span>
                          ) : candidate.stage === "shortlisted" ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="w-4 h-4" strokeWidth={3} />
                              Shortlisted
                            </span>
                          ) : (
                            "Shortlist"
                          )}
                        </Button>

                        {candidate.stage === "shortlisted" && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleShortlist(candidate)}
                            className="h-9 w-9 rounded-xl border-rose-200 text-rose-500 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 shadow-sm"
                            title="Remove from shortlist"
                          >
                            <X className="h-5 w-5" strokeWidth={2.5} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {shouldFetchMatches &&
                !matchesError &&
                (candidates.length > 0 || hasMoreMatches) && (
                  <div className="flex justify-center pt-6 pb-4">
                    <Button
                      variant="outline"
                      className="rounded-xl border-gray-200 h-10 px-6 text-sm font-bold shadow-sm"
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

          <TabsContent value="skill-test" className="mt-0 outline-none">
            <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
              {renderSidebar("skill-test")}
              <div className="flex-1 min-w-0">
                <CandidateSkillTestDetails
                  candidate={selectedCandidateForDetails}
                  report={
                    selectedCandidateSkillReport as
                      | Record<string, unknown>
                      | undefined
                  }
                  isLoading={invitedTestReportLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-interview" className="mt-0 outline-none">
            <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
              {renderSidebar("ai-interview")}
              <div className="flex-1 min-w-0">
                <CandidateAiInterviewDetails
                  candidate={selectedCandidateForDetails}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerAIShortlists;

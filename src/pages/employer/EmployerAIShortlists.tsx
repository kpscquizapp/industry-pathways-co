import React, { useEffect, useState } from "react";
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
  useLazyGetJobMatchesQuery,
} from "@/app/queries/aiShortlistApi";

const EmployerAIShortlists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const candidateIdParam = searchParams.get("candidateId");
  const [selectedJob, setSelectedJob] = useState(
    jobIdParam && Number.isFinite(Number(jobIdParam)) ? jobIdParam : "all",
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);
  const [allJobsMatches, setAllJobsMatches] = useState<any[]>([]);
  const [allJobsLoading, setAllJobsLoading] = useState(false);
  const [allJobsError, setAllJobsError] = useState(false);
  const parsedCandidateId =
    candidateIdParam && Number.isFinite(Number(candidateIdParam))
      ? Number(candidateIdParam)
      : null;
  const [fetchJobMatches] = useLazyGetJobMatchesQuery();

  const { data: employerJobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({
      page: 1,
      limit: 50,
    });

  const employerJobs = employerJobsResponse?.data ?? [];
  const employerJobIdsKey = employerJobs
    .map((job: any) => String(job.id))
    .join(",");
  const isAllJobsSelected = selectedJob === "all";
  const selectedJobId =
    !isAllJobsSelected && Number.isFinite(Number(selectedJob))
      ? Number(selectedJob)
      : null;
  const shouldFetchMatches = selectedJobId !== null;
  const stateJob = (location.state as { job?: any } | null)?.job;
  const selectedJobDetails =
    employerJobs.find((job: any) => Number(job.id) === selectedJobId) ??
    (stateJob && Number(stateJob.id) === selectedJobId ? stateJob : undefined);

  const {
    data: matchesResponse,
    isLoading: matchesLoading,
    isError: matchesError,
    refetch: refetchMatches,
  } = useGetJobMatchesQuery(
    { id: String(selectedJobId ?? 0), page: 1, limit: 20 },
    { skip: !shouldFetchMatches },
  );

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

  type CandidateProfileWithMeta = CandidateProfile & {
    experienceYears?: number;
  };

  const mapMatchToCandidate = (match: any): CandidateProfileWithMeta => {
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
      id: match.id,
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
      certifications: match.certifications,
      about: match.about,
      workExperience: match.workExperience,
      projects: match.projects,
    };
  };

  const candidates = (matchesResponse?.data ?? [])
    .map(mapMatchToCandidate)
    .map((c) => ({
      ...c,
      stage: shortlistedIds.includes(c.id) ? "shortlisted" : "matched",
      matchReasons: [] as string[], // Will be populated in jobRelevantCandidates
    }));

  // Compare Job API data with AI Shortlist API data
  // Show only profiles that match: job title = role OR job skills = skills
  const jobRelevantCandidates = (() => {
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
      .filter((token) => token.length >= 1);

    // Extract and normalize job skills for comparison
    const jobSkills = normalizeJobSkills(selectedJobDetails.skills).map(
      (skill) => skill.toLowerCase(),
    );
    const jobSkillSet = new Set(jobSkills);

    console.log("Job Details:", {
      title: selectedJobDetails.title,
      titleTokens: jobTitleTokens,
      skills: jobSkills,
    });

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

        console.log(`Candidate ${candidate.name}:`, {
          role: candidate.role,
          skills: candidate.skills,
          titleMatches,
          skillsMatch,
          shouldShow: titleMatches || skillsMatch,
          matchReasons,
        });

        return {
          ...candidate,
          matchReasons,
          isRelevant: titleMatches || skillsMatch,
        };
      })
      .filter((c) => c.isRelevant);
  })();

  // Filter candidates: First by job matching, then by tab, then by search term
  // This ensures search results respect the job title/skills matching conditions
  const filteredCandidates = jobRelevantCandidates
    .filter((c) => {
      // Filter by tab (all, matched, or shortlisted)
      if (activeTab === "matched") return c.stage === "matched";
      if (activeTab === "shortlisted") return c.stage === "shortlisted";
      return true;
    })
    .filter((c) => {
      // Search filter: Show candidates that match search term in candidate name only
      // Only applied to candidates already matching job title/skills conditions
      const query = searchTerm.trim().toLowerCase();
      if (!query) return true;

      const matchesName = c.name.toLowerCase().includes(query);

      return matchesName;
    });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  // Real-time search as user types
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Update search term in real-time
    setSearchTerm(value.trim());
  };

  useEffect(() => {
    if (searchInput === "") {
      setSearchTerm("");
    }
  }, [searchInput]);

  useEffect(() => {
    if (!parsedCandidateId) {
      if (showProfileModal) {
        setShowProfileModal(false);
        setSelectedCandidate(null);
      }
      return;
    }

    const candidate = jobRelevantCandidates.find(
      (item) => item.id === parsedCandidateId,
    );

    if (!candidate) {
      if (showProfileModal) {
        setShowProfileModal(false);
        setSelectedCandidate(null);
      }
      return;
    }

    if (!showProfileModal || selectedCandidate?.id !== candidate.id) {
      setSelectedCandidate(candidate);
      setShowProfileModal(true);
    }
  }, [
    parsedCandidateId,
    jobRelevantCandidates,
    selectedCandidate?.id,
    showProfileModal,
  ]);

  const handleViewProfile = (candidate: CandidateProfile) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("candidateId", String(candidate.id));
    setSearchParams(nextParams);
  };

  // Helper function to highlight matching text in candidate name
  const getHighlightedName = (name: string, query: string) => {
    if (!query.trim()) return name;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = name.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          regex.test(part) ? (
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
    if (!shortlistedIds.includes(candidate.id)) {
      setShortlistedIds([...shortlistedIds, candidate.id]);
      toast.success(`${candidate.name} added to shortlist!`);
    }
    closeProfileModal();
  };

  const handleScheduleInterview = (candidate: CandidateProfile) => {
    toast.success(`Interview scheduled with ${candidate.name}!`);
    closeProfileModal();
    navigate("/employer/ai-interviews");
  };

  const handleSkillTest = (candidate: CandidateProfile) => {
    toast.success(`Skill test scheduled for ${candidate.name}!`);
    closeProfileModal();
    navigate("/employer/skill-tests");
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
              onClick={() => {
                if (shouldFetchMatches) {
                  refetchMatches();
                }
              }}
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
        <form
          className="relative flex-1 min-w-[200px] max-w-md flex gap-2"
          onSubmit={handleSearchSubmit}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search candidates by name..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button type="submit" variant="secondary" className="rounded-xl">
            Search
          </Button>
        </form>

        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-[200px] rounded-xl">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobsLoading && (
              <SelectItem value="loading" disabled>
                Loading jobs...
              </SelectItem>
            )}
            {!jobsLoading && employerJobs.length === 0 && (
              <SelectItem value="none" disabled>
                No jobs found
              </SelectItem>
            )}
            {employerJobs.map((job: any) => (
              <SelectItem key={job.id} value={String(job.id)}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
            All (
            {
              jobRelevantCandidates.filter((c) => {
                const query = searchTerm.trim().toLowerCase();
                if (!query) return true;
                return c.name.toLowerCase().includes(query);
              }).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="matched" className="rounded-lg px-6">
            Matched (
            {
              jobRelevantCandidates
                .filter((c) => c.stage === "matched")
                .filter((c) => {
                  const query = searchTerm.trim().toLowerCase();
                  if (!query) return true;
                  return c.name.toLowerCase().includes(query);
                }).length
            }
            )
          </TabsTrigger>
          <TabsTrigger value="shortlisted" className="rounded-lg px-6">
            Shortlisted (
            {
              jobRelevantCandidates
                .filter((c) => c.stage === "shortlisted")
                .filter((c) => {
                  const query = searchTerm.trim().toLowerCase();
                  if (!query) return true;
                  return c.name.toLowerCase().includes(query);
                }).length
            }
            )
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
                          : `No ${activeTab === "matched" ? "matched" : activeTab === "shortlisted" ? "shortlisted" : ""} candidates found.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            {filteredCandidates.map((candidate) => (
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
                            .split(" ")
                            .map((n) => n[0])
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
                    {(candidate as any).matchReasons &&
                      (candidate as any).matchReasons.length > 0 && (
                        <div className="flex-1 min-w-[200px]">
                          <p className="text-xs text-muted-foreground mb-2">
                            Match Reason
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(candidate as any).matchReasons.map(
                              (reason: string) => (
                                <Badge
                                  key={reason}
                                  className="text-xs bg-green-100 text-green-800 border-green-200"
                                >
                                  ✓ {reason}
                                </Badge>
                              ),
                            )}
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

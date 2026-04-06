import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  Video,
  Sparkles,
  TrendingUp,
  Clock,
  MapPin,
  Check,
  X,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import {
  useGetEmployerJobsQuery,
  useLazyGetJobMatchesQuery,
  Job,
  Match,
} from "@/app/queries/aiShortlistApi";
import BarLoader from "@/components/loader/BarLoader";

/** Normalize candidate skills from the Match object */
const normalizeSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills)) {
    return skills
      .filter((skill): skill is string => typeof skill === "string")
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

/** Normalize job skills which may be objects with a `name` field */
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

/**
 * Count relevant matches for a job using the same logic as EmployerAIShortlists:
 * A match is relevant if the job title tokens appear in the candidate role
 * OR if any candidate skill matches a job skill.
 */
const countRelevantMatches = (job: Job, matches: Match[]): number => {
  const jobTitle = (job.title ?? "").toLowerCase();
  const jobTitleTokens = jobTitle
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);

  const jobSkills = normalizeJobSkills(job.skills).map((s) => s.toLowerCase());
  const jobSkillSet = new Set(jobSkills);

  return matches.filter((match) => {
    const candidateRole = (match.role || "").toLowerCase();
    const candidateSkills = normalizeSkills(match.skills).map((s) =>
      s.toLowerCase(),
    );

    const titleMatches =
      jobTitleTokens.length > 0 &&
      jobTitleTokens.some((token) => candidateRole.includes(token));

    const skillsMatch =
      jobSkillSet.size > 0 &&
      candidateSkills.some((skill) => jobSkillSet.has(skill));

    return titleMatches || skillsMatch;
  }).length;
};

const HiringDashboardNew = () => {
  const navigate = useNavigate();
  const [matchCounts, setMatchCounts] = React.useState<
    Record<number | string, number>
  >({});
  const [isMatchCountsLoading, setIsMatchCountsLoading] = React.useState(false);
  const [topCandidates, setTopCandidates] = React.useState<any[]>([]);
  const [isTopCandidatesLoading, setIsTopCandidatesLoading] =
    React.useState(false);
  const [topCandidatesJobId, setTopCandidatesJobId] = React.useState<
    string | null
  >(null);

  // Fetch employer's all jobs using AI Shortlist API
  const { data: jobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({
      page: 1,
      limit: 100, // Get up to 100 jobs
    });

  // Lazy query to fetch matches for each job
  const [getJobMatches] = useLazyGetJobMatchesQuery();

  // Extract jobs data from response
  const jobs = React.useMemo<Job[]>(() => {
    if (!jobsResponse) {
      return [];
    }

    // The AI Shortlist API returns: { data: jobs[] }
    const jobsArray = jobsResponse.data || [];

    return Array.isArray(jobsArray) ? jobsArray : [];
  }, [jobsResponse]);

  // Memoize active jobs list and count
  const activeJobs = React.useMemo(
    () =>
      jobs.filter(
        (job) => job.status === "active" || job.status === "published",
      ),
    [jobs],
  );
  const activeJobsCount = activeJobs.length;

  // Fetch matches for each job to get candidate count
  React.useEffect(() => {
    if (activeJobsCount === 0) {
      setMatchCounts({});
      setIsMatchCountsLoading(false);
      return;
    }
    let active = true;
    setIsMatchCountsLoading(true);
    const fetchAllMatches = async () => {
      // Parallelize all match queries using Promise.all to avoid N+1 queries
      const matchPromises = activeJobs.map((job) =>
        getJobMatches({
          id: String(job.id),
          page: 1,
          limit: 1000, // Fetch up to 1000 records so data.length is reliable fallback for meta.total
        })
          .unwrap()
          .catch((error) => {
            console.error(`Error fetching matches for job ${job.id}:`, error);
            return null;
          }),
      );

      const results = await Promise.all(matchPromises);
      if (!active) return;

      // Map results to counts using the same filtering logic as EmployerAIShortlists:
      // Only count matches where job title matches candidate role OR skills overlap
      const counts: Record<number | string, number> = {};
      activeJobs.forEach((job, index) => {
        const response = results[index];
        const matchesData: Match[] = response?.data ?? [];
        counts[job.id] = countRelevantMatches(job, matchesData);
      });

      setMatchCounts(counts);
      setIsMatchCountsLoading(false);
    };

    fetchAllMatches();
    return () => {
      active = false;
    };
  }, [activeJobs, activeJobsCount, getJobMatches]);

  // Fetch top candidates from the AI Shortlist API
  React.useEffect(() => {
    let active = true;
    if (activeJobsCount === 0) {
      setTopCandidates([]);
      setTopCandidatesJobId(null);
      setIsTopCandidatesLoading(false);
      return () => {
        active = false;
      };
    }

    setIsTopCandidatesLoading(true);
    const fetchTopCandidates = async () => {
      try {
        const jobToFetch = activeJobs[0];

        // Set job ID immediately so it's available even if fetch fails
        if (active) setTopCandidatesJobId(String(jobToFetch.id));

        const response = await getJobMatches({
          id: String(jobToFetch.id),
          page: 1,
          limit: 3, // Fetch top 3 candidates
        }).unwrap();

        // Extract candidates from response and limit to top 3
        const candidates = (response?.data || []).slice(0, 3);
        if (active) setTopCandidates(candidates);
      } catch (error) {
        console.error("Error fetching top candidates:", error);
        // On error, show empty list instead of fake data
        if (active) setTopCandidates([]);
      } finally {
        if (active) setIsTopCandidatesLoading(false);
      }
    };

    fetchTopCandidates();
    return () => {
      active = false;
    };
  }, [activeJobs, activeJobsCount, getJobMatches]);

  // Calculate total candidates - sum of matches from all active jobs
  const totalCandidates = React.useMemo(() => {
    const total = Object.values(matchCounts).reduce(
      (sum, count) => sum + count,
      0,
    );
    return total;
  }, [matchCounts]);

  // Get badge styling based on job status
  const getStatusBadgeStyle = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "published":
        return { variant: "outline" as const, label: "Active" };
      case "draft":
        return { variant: "outline" as const, label: "Draft" };
      case "closed":
        return { variant: "destructive" as const, label: "Closed" };
      default:
        return { variant: "secondary" as const, label: "Unknown" };
    }
  };

  if (jobsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <BarLoader />
        <p className="text-muted-foreground animate-pulse">
          Loading hiring insights...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto py-4 md:py-8 md:px-2 space-y-10 font-sans">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Employer Dashboard
        </h1>
        <p className="text-slate-500 text-lg">
          Here&apos;s what&apos;s happening with your recruitment pipeline today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-premium hover:shadow-premium-lg transition-shadow bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">Active Roles</span>
              <div className="p-2.25 bg-blue-50 text-blue-600 rounded-xl">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeJobsCount}
              </h3>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+2 this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium hover:shadow-premium-lg transition-shadow bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">Total Applicants</span>
              <div className="p-2.25 bg-amber-50 text-amber-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {isMatchCountsLoading ? <span className="animate-pulse">...</span> : totalCandidates}
              </h3>
              <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium hover:shadow-premium-lg transition-shadow bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">AI Matches</span>
              <div className="p-2.25 bg-emerald-50 text-emerald-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                {matchCounts[activeJobs[0]?.id] || 0}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px]">@</div>
                <span>Avg 85% match rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-premium hover:shadow-premium-lg transition-shadow bg-white rounded-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500">Interviews Done</span>
              <div className="p-2.25 bg-purple-50 text-purple-600 rounded-xl">
                <Video className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                0
              </h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>12 scheduled this week</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Your Postings Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Postings</h2>
            <Link
              to="/hire-talent/post-job"
              className="text-emerald-600 text-sm font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <Card className="border-none shadow-premium bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-100">
              {activeJobs.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No active jobs posted yet
                </div>
              ) : (
                activeJobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-6 hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/hire-talent/ai-shortlists?jobId=${job.id}`)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {job.title}
                      </h3>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none px-3 py-0.5 text-xs font-semibold rounded-full capitalize">
                        {job.status === "published" ? "active" : job.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Remote</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Full-time</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        {matchCounts[job.id] || 0} Applicants
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Posted 3 days ago
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top AI-Ranked Candidates */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Top AI-Ranked Candidates
              </h2>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none px-2 py-0.5 text-[10px] font-bold rounded-md flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Auto-Matched
              </Badge>
            </div>
            <Link
              to="/hire-talent/ai-shortlists"
              className="text-emerald-600 text-sm font-semibold hover:underline"
            >
              View Pipeline
            </Link>
          </div>

          <Card className="border-none shadow-premium bg-white rounded-2xl overflow-hidden">
            <CardContent className="p-0 divide-y divide-slate-100">
              {isTopCandidatesLoading ? (
                <div className="p-12 flex justify-center">
                  <SpinnerLoader className="w-8 h-8 text-emerald-600" />
                </div>
              ) : topCandidates.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  No top matches available yet.
                </div>
              ) : (
                topCandidates.slice(0, 3).map((candidate) => (
                  <div key={candidate.id} className="p-4 md:p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4">
                      {/* Avatar & Identity */}
                      <div className="flex flex-1 items-start gap-4 w-full min-w-0">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                            {candidate.profilePicture ? (
                              <img src={candidate.profilePicture} alt={candidate.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                                {candidate.name?.charAt(0) || "C"}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-900 truncate pr-2">
                              {candidate.name}
                            </h4>
                            {/* Match Score */}
                            <div className="flex items-center justify-center flex-col scale-90 shrink-0">
                              <div className="relative w-12 h-12 flex items-center justify-center">
                                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="2.5" />
                                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-500" strokeWidth="2.5" strokeDasharray="100" strokeDashoffset={100 - (candidate.matchScore || 85)} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-[10px] font-bold text-emerald-600 leading-none">
                                    {candidate.matchScore || 85}%
                                  </span>
                                  <span className="text-[6px] font-bold text-emerald-600 leading-none tracking-tighter">MATCH</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-slate-500 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
                            {candidate.role || "Professional"} • {candidate.yearsOfExperience || "5+"} yrs exp
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-0 xl:mb-0">
                            {normalizeSkills(candidate.skills).slice(0, 3).map((skill) => (
                              <span key={skill} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded border border-slate-100 uppercase tracking-tight">
                                {skill}
                              </span>
                            ))}
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded border border-indigo-100 uppercase tracking-tight">
                              New
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full xl:w-auto justify-between xl:justify-start">
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="w-9 h-9 border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-100 rounded-xl transition-all">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="w-9 h-9 border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          className="h-9 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 flex-1 xl:flex-none justify-center"
                          onClick={() => {
                            if (candidate.source === "bench") {
                              navigate(`/hire-talent/candidate/${candidate.id}?source=bench`, { state: { benchCandidate: candidate } });
                            } else {
                              navigate(`/hire-talent/candidate/${candidate.id}`);
                            }
                          }}
                        >
                          {candidate.testScore ? <Plus className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                          {candidate.testScore ? "Results" : "Interview"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className="p-4 bg-slate-50/50 flex justify-center border-t border-slate-100">
              <Link
                to="/hire-talent/ai-shortlists"
                className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
              >
                See all matched candidates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HiringDashboardNew;

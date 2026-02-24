import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileCheck,
  Video,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import {
  useGetEmployerJobsQuery,
  useLazyGetJobMatchesQuery,
  Job,
} from "@/app/queries/aiShortlistApi";

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

  // Fetch matches for each job to get candidate count
  React.useEffect(() => {
    if (jobs.length === 0) {
      setIsMatchCountsLoading(false);
      return;
    }
    let active = true;
    setIsMatchCountsLoading(true);
    const fetchAllMatches = async () => {
      // Parallelize all match queries using Promise.all to avoid N+1 queries
      const matchPromises = jobs.map((job) =>
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

      // Map results to counts, deriving from response metadata
      const counts: Record<number | string, number> = {};
      jobs.forEach((job, index) => {
        const response = results[index];
        // Get count from metadata (response.meta.total), fallback to data.length, then 0
        // With limit: 1000, data.length is a reliable fallback for the total count
        const matchCount = response?.meta?.total ?? response?.data?.length ?? 0;
        counts[job.id] = matchCount;
      });

      setMatchCounts(counts);
      setIsMatchCountsLoading(false);
    };

    fetchAllMatches();
    return () => { active = false; };
  }, [jobs, getJobMatches]);

  // Fetch top candidates from the AI Shortlist API
  React.useEffect(() => {
    if (jobs.length === 0) {
      setTopCandidates([]);
      setTopCandidatesJobId(null);
      setIsTopCandidatesLoading(false);
      return;
    }

    setIsTopCandidatesLoading(true);
    const fetchTopCandidates = async () => {
      try {
        // Fetch candidates from the first active job to get top matches
        const firstActiveJob = jobs.find(
          (job) => job.status === "active" || job.status === "published",
        );

        const jobToFetch = firstActiveJob || jobs[0];

        // Set job ID immediately so it's available even if fetch fails
        setTopCandidatesJobId(String(jobToFetch.id));

        const response = await getJobMatches({
          id: String(jobToFetch.id),
          page: 1,
          limit: 3, // Fetch top 3 candidates
        }).unwrap();

        // Extract candidates from response and limit to top 3
        const candidates = (response?.data || []).slice(0, 3);
        setTopCandidates(candidates);
      } catch (error) {
        console.error("Error fetching top candidates:", error);
        // On error, show empty list instead of fake data
        setTopCandidates([]);
      } finally {
        setIsTopCandidatesLoading(false);
      }
    };

    fetchTopCandidates();
  }, [jobs, getJobMatches]);

  // Calculate active jobs count
  const activeJobsCount = React.useMemo(() => {
    return jobs.filter(
      (job) => job.status === "active" || job.status === "published",
    ).length;
  }, [jobs]);

  // Calculate total candidates - sum of matches from all jobs
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
        <SpinnerLoader className="w-10 h-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading hiring insights...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Find Your Next Great Hire 🚀
            </h2>
            {jobs.length === 0 ? (
              <p className="text-primary-foreground/80">
                Post a job to start finding matching candidates.
              </p>
            ) : isMatchCountsLoading ? (
              <p className="text-primary-foreground/80">
                Loading candidate matches...
              </p>
            ) : (
              <p className="text-primary-foreground/80">
                AI has found {totalCandidates} matching candidate
                {totalCandidates !== 1 ? "s" : ""} across your open roles.
              </p>
            )}
          </div>
          {/* <Button variant="secondary" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/bench/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {jobsLoading ? (
                    <span className="animate-pulse">—</span>
                  ) : (
                    activeJobsCount
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {jobsLoading || isMatchCountsLoading ? (
                    <span className="animate-pulse">—</span>
                  ) : (
                    totalCandidates
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Candidates
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-sm text-muted-foreground">AI Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">—</p>
                <p className="text-sm text-muted-foreground">Interviews Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Active Jobs</CardTitle>
              <Link
                to="/hire-talent/post-job"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                Post Job <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <SpinnerLoader className="w-6 h-6 text-primary" />
                </div>
              ) : jobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No jobs posted yet
                </p>
              ) : (
                jobs.slice(0, 3).map((job) => {
                  const badgeStyle = getStatusBadgeStyle(
                    job.status as string | undefined,
                  );
                  return (
                    <div
                      key={job.id}
                      className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {matchCounts[job.id] || 0} candidates
                          </p>
                        </div>
                        <Badge variant={badgeStyle.variant}>
                          {badgeStyle.label}
                        </Badge>
                      </div>

                      {/* Pipeline Progress */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="text-lg font-bold text-foreground">
                            {matchCounts[job.id] || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Matched
                          </p>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <p className="text-lg font-bold text-primary">—</p>
                          <p className="text-xs text-muted-foreground">
                            AI Shortlisted
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-500/10 rounded-lg">
                          <p className="text-lg font-bold text-green-600">—</p>
                          <p className="text-xs text-muted-foreground">
                            Interviewed
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 rounded-lg"
                          onClick={() =>
                            navigate(
                              `/hire-talent/ai-shortlists?jobId=${job.id}`,
                            )
                          }
                        >
                          View Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() =>
                            navigate(`/hire-talent/post-job?jobId=${job.id}`)
                          }
                        >
                          Manage
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Candidates */}
        <div>
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                Top AI Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isTopCandidatesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <SpinnerLoader />
                </div>
              ) : topCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    No candidates available yet. Post a job to start receiving
                    matches.
                  </p>
                  <Link
                    to="/hire-talent/post-job"
                    className="text-sm text-primary hover:underline"
                  >
                    Post a Job →
                  </Link>
                </div>
              ) : (
                <>
                  {topCandidates.map((candidate, index) => (
                    <div
                      key={candidate.id}
                      className="p-4 border border-border rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-sm">
                            {candidate.name
                              ? candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "?"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {candidate.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {candidate.role || "Candidate"}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {candidate.match || 0}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          <p className="text-sm font-bold">
                            {candidate.testScore || "—"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Test Score
                          </p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-lg">
                          {candidate.interviewScore ? (
                            <>
                              <p className="text-sm font-bold text-primary">
                                {candidate.interviewScore}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Interview
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-bold text-orange-500">
                                —
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Pending
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-lg"
                        onClick={() => {
                          if (topCandidatesJobId) {
                            navigate(
                              `/hire-talent/ai-shortlists?jobId=${topCandidatesJobId}&candidateId=${candidate.id}`,
                            );
                          }
                        }}
                        disabled={!topCandidatesJobId}
                      >
                        View Profile
                      </Button>
                    </div>
                  ))}
                </>
              )}

              <Link
                to="/hire-talent/ai-shortlists"
                className="block text-center text-sm text-primary hover:underline pt-2"
              >
                View All Candidates →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HiringDashboardNew;

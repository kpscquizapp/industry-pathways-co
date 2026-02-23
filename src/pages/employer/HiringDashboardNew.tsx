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
} from "@/app/queries/aiShortlistApi";

const topCandidates = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "React Developer",
    match: 94,
    testScore: 92,
    interviewScore: 95,
  },
  {
    id: 2,
    name: "Alex Kumar",
    role: "React Developer",
    match: 91,
    testScore: 88,
    interviewScore: null,
  },
  {
    id: 3,
    name: "Maria Silva",
    role: "React Developer",
    match: 89,
    testScore: 90,
    interviewScore: null,
  },
];

const HiringDashboardNew = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [matchCounts, setMatchCounts] = React.useState<
    Record<number | string, number>
  >({});

  // Fetch employer's all jobs using AI Shortlist API
  const { data: jobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({
      page: 1,
      limit: 100, // Get up to 100 jobs
    });

  // Lazy query to fetch matches for each job
  const [getJobMatches] = useLazyGetJobMatchesQuery();

  // Extract jobs data from response
  const jobs = React.useMemo(() => {
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
      return;
    }

    const fetchAllMatches = async () => {
      // Parallelize all match queries using Promise.all to avoid N+1 queries
      const matchPromises = jobs.map((job) =>
        getJobMatches({
          id: String(job.id),
          page: 1,
          limit: 1, // Only fetch metadata, not actual records
        })
          .unwrap()
          .catch((error) => {
            console.error(`Error fetching matches for job ${job.id}:`, error);
            return null;
          }),
      );

      const results = await Promise.all(matchPromises);

      // Map results to counts, deriving from response metadata
      const counts: Record<number | string, number> = {};
      jobs.forEach((job, index) => {
        const response = results[index];
        // Get count from metadata (response.meta.total), fallback to data.length, then 0
        const matchCount = response?.meta?.total ?? response?.data?.length ?? 0;
        counts[job.id] = matchCount;
        console.log(`Job ${job.id} (${job.title}): ${matchCount} matches`);
      });

      setMatchCounts(counts);
      console.log("All match counts loaded:", counts);
    };

    fetchAllMatches();
  }, [jobs, getJobMatches]);

  // Calculate active jobs count
  const activeJobsCount = React.useMemo(() => {
    const count = jobs.length;
    return count;
  }, [jobs]);

  // Calculate total candidates - sum of matches from all jobs
  const totalCandidates = React.useMemo(() => {
    const total = Object.values(matchCounts).reduce(
      (sum, count) => sum + count,
      0,
    );
    return total;
  }, [matchCounts]);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
            <p className="text-primary-foreground/80">
              AI has shortlisted {totalCandidates} new candidate
              {totalCandidates !== 1 ? "s" : ""} matching your open roles.
            </p>
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
                  {jobsLoading ? (
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
                jobs.slice(0, 3).map((job: any) => (
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
                      <Badge variant="default">Active</Badge>
                    </div>

                    {/* Pipeline Progress */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-foreground">
                          {matchCounts[job.id] || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Matched</p>
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
                          navigate(`/hire-talent/ai-shortlists?jobId=${job.id}`)
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
                ))
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
              {topCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="p-4 border border-border rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-sm">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidate.role}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {candidate.match}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-sm font-bold">{candidate.testScore}</p>
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
                          <p className="text-sm font-bold text-orange-500">—</p>
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
                  >
                    View Profile
                  </Button>
                </div>
              ))}

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

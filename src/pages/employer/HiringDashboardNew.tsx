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
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  ChevronDown,
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

/* ── helpers ── */

const normalizeSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills))
    return skills
      .filter((s): s is string => typeof s === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof skills === "string")
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

const normalizeJobSkills = (skills: unknown): string[] => {
  if (Array.isArray(skills))
    return skills
      .map((s) =>
        typeof s === "string" ? s : typeof s?.name === "string" ? s.name : "",
      )
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof skills === "string")
    return skills.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

const countRelevantMatches = (job: Job, matches: Match[]): number => {
  const jobTitle = (job.title ?? "").toLowerCase();
  const jobTitleTokens = jobTitle
    .split(/[^a-z0-9]+/i)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);
  const jobSkillSet = new Set(
    normalizeJobSkills(job.skills).map((s) => s.toLowerCase()),
  );
  return matches.filter((m) => {
    const role = (m.role || "").toLowerCase();
    const cSkills = normalizeSkills(m.skills).map((s) => s.toLowerCase());
    const titleMatch =
      jobTitleTokens.length > 0 && jobTitleTokens.some((t) => role.includes(t));
    const skillMatch =
      jobSkillSet.size > 0 && cSkills.some((s) => jobSkillSet.has(s));
    return titleMatch || skillMatch;
  }).length;
};

const formatTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `Posted ${w} week${w > 1 ? "s" : ""} ago`;
  }
  const m = Math.floor(days / 30);
  return `Posted ${m} month${m > 1 ? "s" : ""} ago`;
};

/* ── Match Score Ring ── */
const MatchRing = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 16;
  const offset = circumference - (score / 100) * circumference;
  const ringColor =
    score >= 90 ? "#14b8a6" : score >= 80 ? "#22c55e" : "#f59e0b";

  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18" cy="18" r="16"
          fill="none" stroke="#f0f0f0" strokeWidth="3"
        />
        <circle
          cx="18" cy="18" r="16"
          fill="none" stroke={ringColor} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-extrabold leading-none" style={{ color: ringColor }}>
          {score}%
        </span>
        <span className="text-[7px] font-bold leading-none mt-[2px] tracking-wide" style={{ color: ringColor }}>
          MATCH
        </span>
      </div>
    </div>
  );
};

/* ── main component ── */

const HiringDashboardNew = () => {
  const navigate = useNavigate();
  const [matchCounts, setMatchCounts] = React.useState<
    Record<number | string, number>
  >({});
  const [isMatchCountsLoading, setIsMatchCountsLoading] = React.useState(false);
  const [topCandidates, setTopCandidates] = React.useState<any[]>([]);
  const [isTopCandidatesLoading, setIsTopCandidatesLoading] =
    React.useState(false);
  const [selectedJobId, setSelectedJobId] = React.useState<string>("");

  const { data: jobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({ page: 1, limit: 100 });
  const [getJobMatches] = useLazyGetJobMatchesQuery();

  const jobs = React.useMemo<Job[]>(() => {
    if (!jobsResponse) return [];
    const arr = jobsResponse.data || [];
    return Array.isArray(arr) ? arr : [];
  }, [jobsResponse]);

  const activeJobs = React.useMemo(
    () => jobs.filter((j) => j.status === "active" || j.status === "published"),
    [jobs],
  );
  const activeJobsCount = activeJobs.length;

  // Fetch match counts
  React.useEffect(() => {
    if (activeJobsCount === 0) {
      setMatchCounts({});
      setIsMatchCountsLoading(false);
      return;
    }
    let active = true;
    setIsMatchCountsLoading(true);
    const run = async () => {
      const results = await Promise.all(
        activeJobs.map((job) =>
          getJobMatches({ id: String(job.id), page: 1, limit: 1000 })
            .unwrap()
            .catch(() => null),
        ),
      );
      if (!active) return;
      const counts: Record<number | string, number> = {};
      activeJobs.forEach((job, i) => {
        const data: Match[] = results[i]?.data ?? [];
        counts[job.id] = countRelevantMatches(job, data);
      });
      setMatchCounts(counts);
      setIsMatchCountsLoading(false);
    };
    run();
    return () => { active = false; };
  }, [activeJobs, activeJobsCount, getJobMatches]);

  // Set default selected job
  React.useEffect(() => {
    if (activeJobsCount > 0 && !selectedJobId) {
      setSelectedJobId(String(activeJobs[0].id));
    }
  }, [activeJobsCount, activeJobs, selectedJobId]);

  // Fetch top candidates based on selected job
  React.useEffect(() => {
    let active = true;
    if (!selectedJobId) {
      setTopCandidates([]);
      setIsTopCandidatesLoading(false);
      return () => { active = false; };
    }
    setIsTopCandidatesLoading(true);
    const run = async () => {
      try {
        const resp = await getJobMatches({
          id: selectedJobId, page: 1, limit: 3,
        }).unwrap();
        if (active) setTopCandidates((resp?.data || []).slice(0, 3));
      } catch {
        if (active) setTopCandidates([]);
      } finally {
        if (active) setIsTopCandidatesLoading(false);
      }
    };
    run();
    return () => { active = false; };
  }, [selectedJobId, getJobMatches]);

  const totalCandidates = React.useMemo(
    () => Object.values(matchCounts).reduce((s, c) => s + c, 0),
    [matchCounts],
  );

  if (jobsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <BarLoader />
        <p className="text-gray-400 animate-pulse">Loading hiring insights...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f2f5fa]">
      <div className="max-w-[1400px] mx-auto py-6 md:py-10 px-4 md:px-6 space-y-8 font-sans">

      {/* ═══════════════ HEADER ═══════════════ */}
      <div>
        <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-gray-900 leading-tight">
          Employer Dashboard
        </h1>
        <p className="text-gray-400 text-[15px] mt-1">
          Here&apos;s what&apos;s happening with your recruitment pipeline today.
        </p>
      </div>

      {/* ═══════════════ STAT CARDS ═══════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Roles */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between mb-5">
            <span className="text-[13px] font-semibold text-gray-500 tracking-wide">Active Roles</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Briefcase className="w-[18px] h-[18px] text-blue-500" />
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-2">
            {activeJobsCount}
          </p>
          <div className="flex items-center gap-1.5 text-emerald-500 text-[13px] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 this week</span>
          </div>
        </div>

        {/* Total Applicants */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between mb-5">
            <span className="text-[13px] font-semibold text-gray-500 tracking-wide">Total Applicants</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Users className="w-[18px] h-[18px] text-amber-500" />
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-2">
            {isMatchCountsLoading ? (
              <span className="text-gray-300 animate-pulse">...</span>
            ) : (
              totalCandidates.toLocaleString()
            )}
          </p>
          <div className="flex items-center gap-1.5 text-emerald-500 text-[13px] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18% from last month</span>
          </div>
        </div>

        {/* AI Matches */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between mb-5">
            <span className="text-[13px] font-semibold text-gray-500 tracking-wide">AI Matches</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Sparkles className="w-[18px] h-[18px] text-teal-500" />
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-2">
            {matchCounts[activeJobs[0]?.id] || 0}
          </p>
          <div className="flex items-center gap-1.5 text-gray-400 text-[13px] font-medium">
            <div className="w-4 h-4 rounded-full border-[1.5px] border-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-400">i</div>
            <span>Avg 85% match rate</span>
          </div>
        </div>

        {/* Interviews Done */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between mb-5">
            <span className="text-[13px] font-semibold text-gray-500 tracking-wide">Interviews Done</span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Video className="w-[18px] h-[18px] text-violet-500" />
            </div>
          </div>
          <p className="text-[36px] font-extrabold text-gray-900 leading-none tracking-tight mb-2">
            0
          </p>
          <div className="flex items-center gap-1.5 text-gray-400 text-[13px] font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>12 scheduled this week</span>
          </div>
        </div>
      </div>

      {/* ═══════════════ TWO-COLUMN BODY ═══════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* ────── YOUR POSTINGS (left, ~40%) ────── */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1">
            {/* Card header — inside the card */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900">Your Postings</h2>
              <Link
                to="/hire-talent/jobs"
                className="text-teal-500 text-[13px] font-semibold hover:text-teal-600 transition-colors"
              >
                View All
              </Link>
            </div>

            {activeJobs.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-sm">
                No active jobs posted yet
              </div>
            ) : (
              activeJobs.slice(0, 3).map((job, idx) => {
                const location = (job.location as string) || "Remote";
                const empType = (job.employmentType as string) || "Full-time";
                const isActive =
                  job.status === "published" || job.status === "active";
                const statusLabel = isActive
                  ? "Active"
                  : job.status === "draft"
                    ? "Draft"
                    : job.status === "closed"
                      ? "Paused"
                      : (job.status ?? "").charAt(0).toUpperCase() +
                        (job.status ?? "").slice(1);
                const statusColor = isActive
                  ? "bg-emerald-50 text-emerald-500 border-emerald-200"
                  : statusLabel === "Draft"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-gray-50 text-gray-500 border-gray-200";

                return (
                  <div
                    key={job.id}
                    className={`px-6 py-5 cursor-pointer hover:bg-gray-50/50 transition-colors ${
                      idx < Math.min(activeJobs.length, 3) - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                    onClick={() =>
                      navigate(`/hire-talent/ai-shortlists?jobId=${job.id}`)
                    }
                  >
                    {/* Title + status */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
                        {job.title}
                      </h3>
                      <span
                        className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    {/* Location + type */}
                    <div className="flex items-center gap-4 text-gray-400 text-[13px] mb-3">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {empType}
                      </span>
                    </div>

                    {/* Applicants + posted */}
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-gray-600">
                        {matchCounts[job.id] || 0} Applicants
                      </span>
                      <span className="text-[12px] text-gray-400">
                        {formatTimeAgo(job.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ────── TOP AI-RANKED CANDIDATES (right, ~60%) ────── */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col flex-1">
            {/* Card header — inside the card */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[17px] font-bold text-gray-900">
                  Top AI-Ranked Candidates
                </h2>
                {activeJobsCount > 0 && (
                  <div className="relative">
                    <select 
                      className="appearance-none pl-3 pr-8 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-teal-500/20 max-w-[200px] truncate"
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                    >
                      {activeJobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                )}
                <span className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-600 border border-teal-100 px-2.5 py-1 rounded-md text-[10px] font-bold hidden sm:inline-flex">
                  <Sparkles className="w-3 h-3" />
                  Auto-Matched
                </span>
              </div>
              <Link
                to={`/hire-talent/ai-shortlists${selectedJobId ? `?jobId=${selectedJobId}` : ''}`}
                className="text-teal-500 text-[13px] font-semibold hover:text-teal-600 transition-colors"
              >
                View Pipeline
              </Link>
            </div>

            {isTopCandidatesLoading ? (
              <div className="p-14 flex justify-center">
                <SpinnerLoader className="w-7 h-7 text-teal-500" />
              </div>
            ) : topCandidates.length === 0 ? (
              <div className="p-14 text-center text-gray-400 text-sm">
                No top matches available yet.
              </div>
            ) : (
              <>
                {topCandidates.slice(0, 3).map((candidate, idx) => {
                  const skills = normalizeSkills(candidate.skills);
                  const score = candidate.matchScore || 85;

                  return (
                    <div
                      key={candidate.id}
                      className={`px-6 py-5 hover:bg-gray-50/40 transition-colors ${
                        idx < Math.min(topCandidates.length, 3) - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {/* Main row: Avatar | Info | Ring | Actions */}
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                            {candidate.profilePicture ? (
                              <img
                                src={candidate.profilePicture}
                                alt={candidate.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 font-bold text-sm">
                                {candidate.name?.charAt(0) || "C"}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                        </div>

                        {/* Name + role */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[14px] font-bold text-gray-900 truncate leading-snug">
                            {candidate.name}
                          </h4>
                          <p className="text-[12px] text-gray-400 truncate mt-0.5">
                            {candidate.role || "Professional"} •{" "}
                            {candidate.yearsOfExperience || candidate.experience || "5+"} yrs exp
                          </p>
                        </div>

                        {/* Match score ring */}
                        <MatchRing score={score} />

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Approve */}
                          <button
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 transition-all"
                            title="Shortlist"
                          >
                            <Check className="w-6 h-6" strokeWidth={2.5} />
                          </button>
                          {/* Reject */}
                          <button
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-all"
                            title="Reject"
                          >
                            <X className="w-6 h-6" strokeWidth={2.5} />
                          </button>
                          {/* Primary action */}
                          <button
                            className={`h-10 px-5 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all border ${
                              candidate.testScore
                                ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                : idx === 0
                                  ? "bg-gray-900 border-gray-900 text-white hover:bg-gray-800"
                                  : "bg-white border-teal-400 text-teal-600 hover:bg-teal-50"
                            }`}
                            onClick={() => {
                              if (candidate.source === "bench") {
                                navigate(
                                  `/hire-talent/candidate/${candidate.id}?source=bench`,
                                  { state: { benchCandidate: candidate } },
                                );
                              } else {
                                navigate(
                                  `/hire-talent/candidate/${candidate.id}`,
                                );
                              }
                            }}
                          >
                            {candidate.testScore ? (
                              <>
                                <BarChart3 className="w-4 h-4" />
                                Results
                              </>
                            ) : (
                              <>
                                {idx === 0 ? (
                                  <ClipboardCheck className="w-4 h-4" />
                                ) : (
                                  <Video className="w-4 h-4" />
                                )}
                                {idx === 0 ? "Test" : "Interview"}
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Skill tags - aligned under the name */}
                      <div className="flex flex-wrap gap-2 mt-3 pl-[60px]">
                        {skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-50 text-gray-500 text-[11px] font-semibold rounded-md border border-gray-100"
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length === 0 && (
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-500 text-[11px] font-semibold rounded-md border border-indigo-100">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4 flex justify-center bg-gray-50/40">
                  <Link
                    to="/hire-talent/ai-shortlists"
                    className="flex items-center gap-2 text-[13px] font-bold text-gray-500 hover:text-teal-600 transition-colors"
                  >
                    See all matched candidates
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HiringDashboardNew;

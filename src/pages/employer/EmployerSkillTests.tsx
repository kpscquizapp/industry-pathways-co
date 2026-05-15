import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Users,
  ClipboardCheck,
  CalendarClock,
  ChevronRight,
  ChevronDown,
  X,
  Search,
  Code,
  RefreshCw,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetEmployerJobsQuery,
  useGetJobMatchesQuery,
} from "@/app/queries/aiShortlistApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";

// Mock internal candidate structure
interface Candidate {
  id: string | number;
  name: string;
  role: string;
  matchScore: number;
  skills: string[];
  status: "available" | "scheduled" | "completed";
  testDate?: string;
  testScore?: number;
  profilePicture?: string;
  email?: string;
}

const EmployerSkillTests = () => {
  const navigate = useNavigate();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  // Schedule state
  const [scheduleData, setScheduleData] = useState({
    date: "",
    duration: "60",
    testType: "Technical Assessment",
  });

  // Local state to keep track of candidates we've scheduled manually during the session
  const [sessionScheduled, setSessionScheduled] = useState<
    Record<string, Candidate>
  >({});

  // Queries
  const { data: jobsResponse, isLoading: jobsLoading } =
    useGetEmployerJobsQuery({ page: 1, limit: 100 });
  const activeJobs = useMemo(() => {
    if (!jobsResponse?.data) return [];
    return jobsResponse.data.filter(
      (j: any) => j.status === "active" || j.status === "published",
    );
  }, [jobsResponse]);

  // Removed auto-selection of default job
  // useEffect(() => {
  //   if (activeJobs.length > 0 && !selectedJobId) {
  //     setSelectedJobId(String(activeJobs[0].id));
  //   }
  // }, [activeJobs, selectedJobId]);

  const {
    data: matchesResponse,
    isLoading: matchesLoading,
    refetch: refetchMatches,
  } = useGetJobMatchesQuery(
    { id: selectedJobId, page: 1, limit: 100 },
    { skip: !selectedJobId },
  );

  // Only show candidates that have been shortlisted for this job by the employer.
  // isShortlisted is returned by GET /jobs/:id/matches (annotated by the backend).
  const candidatesList = useMemo<Candidate[]>(() => {
    if (!matchesResponse?.data) return [];
    return matchesResponse.data
      .filter((match: any) => match.isShortlisted === true)
      .map((match: any) => ({
        id: match.id,
        name: match.name || "Unknown Candidate",
        role: match.role || "Professional",
        matchScore: match.matchScore || 0,
        skills: Array.isArray(match.skills)
          ? match.skills
          : typeof match.skills === "string"
            ? match.skills.split(",")
            : [],
        status: "available",
        email: match.email || "candidate@example.com",
      }));
  }, [matchesResponse]);

  // Aggregate with session data (e.g. ones we've already scheduled)
  const fullCandidates = useMemo(() => {
    return candidatesList.map((c) => {
      if (sessionScheduled[c.id]) {
        return sessionScheduled[c.id];
      }
      return c;
    });
  }, [candidatesList, sessionScheduled]);

  const availableCandidates = fullCandidates.filter(
    (c) => c.status === "available",
  );
  const scheduledCandidates = fullCandidates.filter(
    (c) => c.status === "scheduled",
  );
  const completedCandidates = fullCandidates.filter(
    (c) => c.status === "completed",
  );

  // Invited candidates — backend now returns stage === 'invited' on the match record
  const invitedCandidates = useMemo<Candidate[]>(() => {
    if (!matchesResponse?.data) return [];
    return matchesResponse.data
      .filter((m: any) => m.stage === "invited")
      .map((m: any) => ({
        id: m.id,
        name: m.name || "Unknown Candidate",
        role: m.role || "Professional",
        matchScore: m.matchScore || 0,
        skills: Array.isArray(m.skills)
          ? m.skills
          : typeof m.skills === "string"
            ? m.skills.split(",")
            : [],
        status: "scheduled" as const,
        email: m.email || "",
      }));
  }, [matchesResponse]);

  const [activeView, setActiveView] = useState<
    "shortlisted" | "invited" | "completed"
  >("shortlisted");

  const filteredCandidates = (list: Candidate[]) =>
    list.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowScheduleModal(true);
  };

  const handleScheduleTest = async () => {
    if (!selectedCandidate) return;

    if (!scheduleData.date) {
      toast.error("Please select a Date before proceeding.");
      return;
    }

    // Update session scheduled candidates
    setSessionScheduled((prev) => ({
      ...prev,
      [selectedCandidate.id]: {
        ...selectedCandidate,
        status: "scheduled" as const,
        testDate: scheduleData.date,
      },
    }));

    toast.success("Test scheduled successfully!");
    setShowScheduleModal(false);

    // Navigate to interview questions page
    // The actual API scheduling happens there after employer selects questions
    const params = new URLSearchParams({
      candidateId: selectedCandidate.id.toString(),
      candidateName: selectedCandidate.name,
      candidateRole: selectedCandidate.role || "Professional",
      candidateEmail: selectedCandidate.email || "",
      testType: scheduleData.testType || "Technical Assessment",
      testDate: scheduleData.date,
      testDuration: scheduleData.duration,
      jobId: selectedJobId,
      talentSource: "candidate",
    });

    navigate(`/hire-talent/interview-questions?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f2f5fa] px-4 sm:px-8 py-6 sm:py-8 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-7">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-2 border-b border-gray-200/50 mb-6">
          <div className="pb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Skill Tests
            </h1>
            <p className="text-gray-500 mt-1.5 text-[15px]">
              Schedule and manage coding assessments for your candidates
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-end gap-3 pb-4">
            <div className="relative shrink-0">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                Select Job Pipeline
              </div>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="w-full md:w-[280px] h-10 rounded-xl border-gray-200 text-sm bg-white font-bold text-gray-700 shadow-sm">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobsLoading && (
                    <SelectItem value="__loading__" disabled>
                      Loading jobs...
                    </SelectItem>
                  )}
                  {!jobsLoading && activeJobs.length === 0 && (
                    <SelectItem value="__none__" disabled>
                      No active jobs found
                    </SelectItem>
                  )}
                  {activeJobs.map((job: any) => (
                    <SelectItem key={job.id} value={String(job.id)}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div
            className={`bg-white rounded-[20px] border p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer ${activeView === "shortlisted" ? "border-[#0ea5e9] ring-1 ring-[#0ea5e9]" : "border-gray-100"}`}
            onClick={() => setActiveView("shortlisted")}
          >
            <div>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                Shortlisted
              </p>
              <p className="text-[32px] font-extrabold text-gray-900 mt-1 leading-none">
                {availableCandidates.length}
              </p>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-[#f0f9ff] flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0ea5e9]" />
            </div>
          </div>

          {/* Invited stat */}
          <div
            className={`bg-white rounded-[20px] border p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer ${activeView === "invited" ? "border-violet-500 ring-1 ring-violet-500" : "border-gray-100"}`}
            onClick={() => setActiveView("invited")}
          >
            <div>
              <p className="text-[12px] font-bold text-violet-500 uppercase tracking-wider">
                Invited candidates
              </p>
              <p className="text-[32px] font-extrabold text-violet-500 mt-1 leading-none">
                {invitedCandidates.length}
              </p>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-violet-50 flex items-center justify-center">
              <Send className="w-6 h-6 text-violet-500" />
            </div>
          </div>
          <div
            className={`bg-white rounded-[20px] border p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer ${activeView === "completed" ? "border-emerald-500 ring-1 ring-emerald-500" : "border-gray-100"}`}
            onClick={() => setActiveView("completed")}
          >
            <div>
              <p className="text-[12px] font-bold text-emerald-500 uppercase tracking-wider">
                Completed tasks
              </p>
              <p className="text-[32px] font-extrabold text-emerald-500 mt-1 leading-none">
                {completedCandidates.length}
              </p>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search candidates by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 bg-white border-gray-200 text-gray-900 rounded-xl shadow-sm focus-visible:ring-[#0ea5e9] font-medium"
          />
        </div>

        {/* Main Content Area */}
        <div className="space-y-8 pb-10">
          {/* Available Candidates (Shortlisted) */}
          {activeView === "shortlisted" && (
            <Card className="border border-gray-200 shadow-sm rounded-[24px] bg-white overflow-hidden">
              <CardHeader className="bg-[#fcfdfa] border-b border-gray-100 px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f0f9ff] flex items-center justify-center text-[#0ea5e9]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-[18px] font-bold text-gray-900 leading-none">
                      Shortlisted Candidates
                    </CardTitle>
                    <p className="text-[13px] text-gray-500 mt-1.5 font-medium">
                      Select a candidate to invite them to a coding test.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {jobsLoading || matchesLoading ? (
                  <div className="flex justify-center p-14">
                    <SpinnerLoader className="w-8 h-8 text-[#0ea5e9]" />
                  </div>
                ) : filteredCandidates(availableCandidates).length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredCandidates(availableCandidates).map(
                      (candidate) => (
                        <div
                          key={candidate.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 hover:bg-[#fafafa] transition-all cursor-default group"
                        >
                          <Avatar className="h-14 w-14 border border-gray-200 shadow-sm shrink-0">
                            <AvatarFallback className="font-bold text-gray-700 bg-gray-100 text-lg">
                              {candidate.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-[16px] truncate">
                              {candidate.name}
                            </h3>
                            <p className="text-[13px] text-gray-500 font-medium truncate mt-0.5">
                              {candidate.role}
                            </p>
                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                              {candidate.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2.5 py-1 rounded-md bg-white text-gray-600 text-[11px] font-bold border border-gray-200 shadow-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          {(() => {
                            const score = Math.round(candidate.matchScore);
                            const scoreColor =
                              score >= 90
                                ? "text-[#08b8cc]"
                                : score >= 80
                                  ? "text-[#3b82f6]"
                                  : "text-[#f59e0b]";
                            const scoreBorder =
                              score >= 90
                                ? "border-[#08b8cc]"
                                : score >= 80
                                  ? "border-[#3b82f6]"
                                  : "border-[#f59e0b]";

                            return (
                              <div className="flex flex-col items-center justify-center px-6 shrink-0 hidden md:flex border-l border-r border-gray-100 min-w-[120px]">
                                <div
                                  className={`w-11 h-11 rounded-full border-2 ${scoreBorder} flex items-center justify-center`}
                                >
                                  <span
                                    className={`font-extrabold text-[13px] ${scoreColor}`}
                                  >
                                    {score}%
                                  </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">
                                  AI Match
                                </span>
                              </div>
                            );
                          })()}
                          <div className="shrink-0 flex justify-end pl-2">
                            <Button
                              className="bg-white border hover:bg-[#f0f9ff] hover:border-[#0ea5e9] hover:text-[#0ea5e9] border-gray-200 text-gray-700 shadow-sm rounded-xl h-11 px-5 font-bold transition-all w-full sm:w-auto"
                              onClick={() => handleSelectCandidate(candidate)}
                            >
                              <Code className="h-4 w-4 mr-2" />
                              Send Questions
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 bg-gray-50/50">
                    <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-bold text-gray-700 text-[15px]">
                      No shortlisted candidates
                    </p>
                    <p className="text-[13px] mt-1.5 max-w-[280px] mx-auto text-center leading-relaxed">
                      Go to the AI Shortlists page, select this job, and
                      shortlist candidates to invite them here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Invited Candidates */}
          {activeView === "invited" && (
            <>
              <Card className="border border-violet-200 shadow-sm rounded-[24px] bg-white overflow-hidden">
                <CardHeader className="bg-[#faf5ff] border-b border-violet-100 px-7 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                      <Send className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-[18px] font-bold text-gray-900 leading-none">
                        Invited Candidates
                      </CardTitle>
                      <p className="text-[13px] text-gray-500 mt-1.5 font-medium">
                        Candidates who have been sent an invite for this role.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {invitedCandidates.length > 0 ? (
                    <div className="divide-y divide-violet-50">
                      {filteredCandidates(invitedCandidates).map(
                        (candidate) => (
                          <div
                            key={candidate.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 hover:bg-[#fdf8ff] transition-all cursor-default"
                          >
                            <Avatar className="h-14 w-14 border border-violet-200 shadow-sm shrink-0">
                              <AvatarFallback className="font-bold text-violet-700 bg-violet-50 text-lg">
                                {candidate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-[16px] truncate">
                                {candidate.name}
                              </h3>
                              <p className="text-[13px] text-gray-500 font-medium truncate mt-0.5">
                                {candidate.role}
                              </p>
                              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                                {candidate.skills.slice(0, 4).map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 rounded-md bg-white text-gray-600 text-[11px] font-bold border border-gray-200 shadow-sm"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {(() => {
                              const score = Math.round(candidate.matchScore);
                              const scoreColor =
                                score >= 90
                                  ? "text-[#08b8cc]"
                                  : score >= 80
                                    ? "text-[#3b82f6]"
                                    : "text-[#f59e0b]";
                              const scoreBorder =
                                score >= 90
                                  ? "border-[#08b8cc]"
                                  : score >= 80
                                    ? "border-[#3b82f6]"
                                    : "border-[#f59e0b]";
                              return (
                                <div className="flex flex-col items-center justify-center px-6 shrink-0 hidden md:flex border-l border-r border-gray-100 min-w-[120px]">
                                  <div
                                    className={`w-11 h-11 rounded-full border-2 ${scoreBorder} flex items-center justify-center`}
                                  >
                                    <span
                                      className={`font-extrabold text-[13px] ${scoreColor}`}
                                    >
                                      {score}%
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-wider">
                                    AI Match
                                  </span>
                                </div>
                              );
                            })()}
                            <div className="shrink-0 flex justify-end pl-2">
                              <Badge className="bg-violet-100 border-none text-violet-700 hover:bg-violet-100 px-3.5 py-1.5 font-bold shadow-none text-[12px]">
                                <Send className="h-3 w-3 mr-1.5" />
                                Invite Sent
                              </Badge>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400 bg-gray-50/50">
                      <Send className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-bold text-gray-700 text-[15px]">
                        No invited candidates
                      </p>
                      <p className="text-[13px] mt-1.5 max-w-[280px] mx-auto text-center leading-relaxed">
                        Schedule a test for a shortlisted candidate to see them
                        here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scheduled Tests - Grouped with Invited */}
              {scheduledCandidates.length > 0 && (
                <Card className="border border-amber-200 shadow-sm rounded-[24px] bg-white overflow-hidden mt-8">
                  <CardHeader className="bg-[#fffbeb] border-b border-amber-100 px-7 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <CalendarClock className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-[18px] font-bold text-gray-900 leading-none">
                          Scheduled Test
                        </CardTitle>
                        <p className="text-[13px] text-gray-500 mt-1.5 font-medium">
                          Candidates who have been invited to a coding task.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-amber-50">
                      {filteredCandidates(scheduledCandidates).map(
                        (candidate) => (
                          <div
                            key={candidate.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 hover:bg-[#fffdf7] transition-all"
                          >
                            <Avatar className="h-12 w-12 border border-amber-200 shrink-0">
                              <AvatarFallback className="font-bold text-amber-700 bg-amber-50">
                                {candidate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-[15px] truncate">
                                {candidate.name}
                              </h3>
                              <p className="text-[13px] text-gray-500 truncate mt-0.5">
                                {candidate.role}
                              </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 rounded-xl text-amber-700 font-bold text-[13px] border border-amber-100">
                              <Calendar className="h-4 w-4" />
                              <span>{candidate.testDate}</span>
                            </div>
                            <div className="shrink-0 flex justify-end pl-2">
                              <Badge className="bg-amber-100 border-none text-amber-700 hover:bg-amber-100 px-3.5 py-1.5 font-bold shadow-none text-[12px]">
                                Pending Completion
                              </Badge>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Completed Tests */}
          {activeView === "completed" && (
            <Card className="border border-emerald-200 shadow-sm rounded-[24px] bg-white overflow-hidden">
              <CardHeader className="bg-[#ecfdf5] border-b border-emerald-100 px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-[18px] font-bold text-gray-900 leading-none">
                      Completed Tasks
                    </CardTitle>
                    <p className="text-[13px] text-gray-500 mt-1.5 font-medium">
                      Candidates who have finished their assessments.
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {completedCandidates.length > 0 ? (
                  <div className="divide-y divide-emerald-50">
                    {filteredCandidates(completedCandidates).map(
                      (candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between gap-4 p-6 hover:bg-[#f2fdf7] transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border border-emerald-200 shrink-0">
                              <AvatarFallback className="font-bold text-emerald-700 bg-emerald-50">
                                {candidate.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-bold text-gray-900 text-[15px]">
                                {candidate.name}
                              </span>
                              <p className="text-[13px] text-gray-500 mt-0.5">
                                {candidate.role}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-3.5 py-1.5 font-bold text-[12px]">
                            Passed ({candidate.testScore}%)
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400 bg-gray-50/50">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-bold text-gray-700 text-[15px]">
                      No completed tasks
                    </p>
                    <p className="text-[13px] mt-1.5 max-w-[280px] mx-auto text-center leading-relaxed">
                      Once candidates finish their tests, their results will
                      appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md bg-white rounded-[24px] border-none shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] flex items-center justify-center text-[#0ea5e9]">
                <Code className="h-5 w-5" />
              </div>
              Invite to Coding Test
            </DialogTitle>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
                <Avatar className="h-12 w-12 border border-white shadow-sm bg-white">
                  <AvatarFallback className="font-bold text-gray-700 bg-gray-100 text-lg">
                    {selectedCandidate.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px]">
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-[12px] font-bold text-gray-500 mt-0.5">
                    {selectedCandidate.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Date *
                    </Label>
                    <Input
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          date: e.target.value,
                        })
                      }
                      className="mt-1.5 h-11 rounded-xl border-gray-200 text-sm font-semibold shadow-sm focus-visible:ring-[#0ea5e9] cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Test Duration
                  </Label>
                  <Select
                    value={scheduleData.duration}
                    onValueChange={(v) =>
                      setScheduleData({ ...scheduleData, duration: v })
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-11 rounded-xl border-gray-200 shadow-sm text-sm font-semibold focus:ring-[#0ea5e9]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Test Type
                  </Label>
                  <Input
                    placeholder="e.g. Technical Assessment"
                    value={scheduleData.testType}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        testType: e.target.value,
                      })
                    }
                    className="mt-1.5 h-11 rounded-xl border-gray-200 text-sm font-semibold shadow-sm focus-visible:ring-[#0ea5e9]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-11 border-gray-200 font-bold hover:bg-gray-50 text-gray-600 shadow-none"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-[2] rounded-xl h-11 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-bold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleScheduleTest}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Send Questions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerSkillTests;

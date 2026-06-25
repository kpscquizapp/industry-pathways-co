import React, { useState, memo } from "react";
import {
  Target,
  Award,
  Zap,
  Lock,
  Code as CodeIcon,
  Clock,
  ChevronRight,
  CircleAlert,
  WandSparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  LineChart,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCode2,
  Eye,
  Code,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  useCreateSkillTestMutation,
  useGetContractorInvitedTestStatusQuery,
  useGetMyTestResultsQuery,
  useGetProblemTagsQuery,
  useLazyGetTestStatusByIdQuery,
} from "@/app/queries/contractorSkillTest";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ═══════════ DESIGN TOKENS ═══════════ */
const C = {
  accent: "#4DD9E8",
  accentDark: "#0e8a96",
  accentBg: "rgba(77,217,232,0.08)",
  accentBorder: "rgba(77,217,232,0.18)",
  text: "#1a1a2e",
  textSec: "#555",
  textMuted: "#999",
  border: "#e8eaef",
  bgInput: "#f8f9fb",
  bgPage: "#f5f6f8",
  bgCard: "#fff",
  danger: "#ef4444",
  dangerBg: "rgba(239,68,68,0.06)",
  green: "#22c55e",
  greenBg: "rgba(34,197,94,0.08)",
  purple: "#8b5cf6",
  purpleBg: "rgba(139,92,246,0.08)",
  amber: "#f59e0b",
  amberBg: "rgba(245,158,11,0.08)",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.08)",
};

/* ═══════════ REUSABLE COMPONENTS ═══════════ */
const Card = memo(
  ({
    children,
    className,
    hover,
  }: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
  }) => {
    const [hov, setHov] = useState(false);
    return (
      <div
        onMouseEnter={hover ? () => setHov(true) : undefined}
        onMouseLeave={hover ? () => setHov(false) : undefined}
        className={cn(
          "rounded-2xl border transition-all duration-300 overflow-hidden bg-white",
          hov ? "shadow-2xl -translate-y-1" : "shadow-sm",
          className,
        )}
        style={{
          borderColor: C.border,
        }}
      >
        {children}
      </div>
    );
  },
);

const GlassCard = memo(
  ({
    children,
    gradient,
    className,
  }: {
    children: React.ReactNode;
    gradient: string;
    className?: string;
  }) => (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg",
        gradient,
        className,
      )}
    >
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
      <div className="relative z-10">{children}</div>
    </div>
  ),
);

const Badge = memo(
  ({
    text,
    color = C.green,
    bg = C.greenBg,
  }: {
    text: string;
    color?: string;
    bg?: string;
  }) => (
    <span
      className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase"
      style={{ color, background: bg }}
    >
      {text}
    </span>
  ),
);

const ProgressBar = memo(
  ({
    value,
    color = C.accent,
    height = 6,
  }: {
    value: number;
    color?: string;
    height?: number;
  }) => (
    <div
      className="w-full bg-slate-100 rounded-full overflow-hidden"
      style={{ height }}
    >
      <div
        className="h-full transition-all duration-1000 ease-out rounded-full"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        }}
      />
    </div>
  ),
);

const diffColor: Record<string, string> = {
  Intermediate: C.amber,
  Advanced: C.accent,
  Expert: C.purple,
};

const ContractorSkillTest = () => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const [mockDifficulty, setMockDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [createSkillTest, { isLoading: isCreating }] =
    useCreateSkillTestMutation();
  const { data: testResultsData, isLoading: isLoadingResults } =
    useGetMyTestResultsQuery();
  const {
    data: { data: invitedTestStatus } = {},
    isLoading: isLoadingTestStatus,
  } = useGetContractorInvitedTestStatusQuery();

  const allAssessments = isLoadingTestStatus
    ? []
    : [
        ...(invitedTestStatus?.availableTests || []),
        ...(invitedTestStatus?.completedTests || []),
      ];

  const testResults = testResultsData?.data || [];
  const [mockTest, setMockTest] = useState({
    title: "",
    totalTime: 0,
    difficultyDistribution: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
    tags: [], // Added tags field
  });

  const difficultyLevels = ["easy", "medium", "hard"];

  const startMockTest = async () => {
    if (
      !questionCount ||
      !mockDifficulty ||
      !mockTest.title ||
      !mockTest.totalTime
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const resp = await createSkillTest(mockTest).unwrap();
      if (resp.success && resp.data?.id) {
        toast.success("Mock test created successfully");
        navigate(`/coding-challenge/${resp.data.id}`);
      } else if (resp.success) {
        toast.error(
          "Test created but response missing test ID. Please check your results.",
        );
      } else {
        toast.error("Failed to create mock test. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to create mock test");
    }
  };

  return (
    <div className="flex flex-col gap-8 py-6 sm:py-10 px-6 sm:px-9 md:px-8 font-sans  font-inter">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Skill Tests
        </h2>
        <p className="text-muted-foreground mt-2">
          Validate your expertise and unlock premium opportunities with our
          assessment system.
        </p>
      </div>

      {/* KPI Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tests Completed Card */}
        <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9]">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex items-start md:flex-col min-[950px]:flex-row gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-white/20 flex items-center justify-center">
              <Target className="w-6 h-6 md:w-9 md:h-9 text-white" />
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold leading-none mb-1">
                {invitedTestStatus?.summary?.testsCompleted || 0}
              </div>
              <h3 className="text-base md:text-[17px] font-bold text-white mb-2 md:mb-3">
                Tests Completed
              </h3>
              <p className="text-xs md:text-sm font-medium text-white/80 leading-snug mt-2 md:mt-4">
                Number of skill assessments you have successfully attempted as
                part of company hiring processes.
              </p>
            </div>
          </div>
        </div>

        {/* Average Score Card */}
        <div className="relative overflow-hidden rounded-2xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9]">
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 flex items-start md:flex-col min-[950px]:flex-row gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 md:w-9 md:h-9 text-white" />
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold leading-none mb-1">
                {invitedTestStatus?.summary?.averageScore || 0}
              </div>
              <h3 className="text-base md:text-[17px] font-bold text-white mb-2 md:mb-3">
                Average Score
              </h3>
              <p className="text-xs md:text-sm font-medium text-white/80 leading-snug mt-2 md:mt-4">
                Your overall performance score calculated across all completed
                assessments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex gap-2 flex-wrap">
        {[
          { k: "all", l: "All Assessments" },
          { k: "available", l: "Available" },
          { k: "completed", l: "Completed" },
          { k: "mock", l: "Mock Test" },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={cn(
              "px-4 md:px-6 py-2 rounded-full text-[12px] md:text-[13px] font-bold transition-all duration-300 border",
              filter === f.k
                ? "border-[#4DD9E8] bg-white text-[#0EA5E9] shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-cyan-400",
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* All Assessment (Invited) */}
      {filter === "all" && (
        <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-1">
              All Assessments
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingTestStatus ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                  <span className="ml-2 text-slate-400">Loading...</span>
                </div>
              ) : allAssessments.length > 0 ? (
                allAssessments.map((res: any, i: number) => {
                  const scoreVal = Number(res.overallScore ?? res.score ?? 0);
                  const isCompleted = res.status === "completed";

                  const scoreColor =
                    scoreVal >= 70
                      ? "#22c55e"
                      : scoreVal >= 40
                        ? "#f59e0b"
                        : "#ef4444";

                  const expiresAt = res.inviteExpiresAt
                    ? new Date(res.inviteExpiresAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )
                    : "N/A";

                  const submittedAt = res.submittedAt
                    ? new Date(res.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  // SVG ring math
                  const radius = 19;
                  const circumference = 2 * Math.PI * radius;
                  const offset =
                    circumference - (scoreVal / 100) * circumference;

                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-white overflow-hidden"
                    >
                      {/* Card body */}
                      <div className="flex items-start gap-4 p-5">
                        {/* Left: score ring (completed) or icon (active) */}
                        {isCompleted ? (
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              width="46"
                              height="46"
                              viewBox="0 0 46 46"
                              aria-label={`Score: ${scoreVal}%`}
                            >
                              <circle
                                cx="23"
                                cy="23"
                                r={radius}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="3.5"
                              />
                              <circle
                                cx="23"
                                cy="23"
                                r={radius}
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="3.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 23 23)"
                              />
                              <text
                                x="23"
                                y="27"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill={scoreColor}
                                fontFamily="inherit"
                              >
                                {scoreVal}%
                              </text>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Code className="w-5 h-5 text-blue-500" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0 relative">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <h4 className="text-[15px] font-semibold text-slate-800 leading-snug mb-1.5 pr-20">
                                {res.title}
                              </h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                {isCompleted ? (
                                  <>
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                      Completed
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                                      <WandSparkles className="w-3 h-3" />
                                      AI generated
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      Active
                                    </span>
                                    <span className="text-[12px] text-slate-400 flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      {res.totalTime} min
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Date */}
                            <div className="absolute top-0 right-0 text-right">
                              <p className="text-[11px] text-slate-400">
                                {isCompleted ? "Submitted" : "Expires"}
                              </p>
                              <p className="text-[13px] font-medium text-slate-600">
                                {isCompleted ? submittedAt : expiresAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats row — completed only */}
                      {isCompleted && (
                        <div className="grid grid-cols-3 gap-2.5 px-5 pb-4">
                          {[
                            {
                              label: "Overall score",
                              value: `${scoreVal}%`,
                              highlight: true,
                            },
                            {
                              label: "Coding accuracy",
                              value: res.codingAccuracy
                                ? `${res.codingAccuracy}%`
                                : "—",
                            },
                            {
                              label: "Duration",
                              value: res.totalTime
                                ? `${res.totalTime} min`
                                : "—",
                            },
                          ].map(({ label, value, highlight }) => (
                            <div
                              key={label}
                              className="bg-slate-50 rounded-lg px-3 py-2.5"
                            >
                              <p className="text-[11px] text-slate-400 mb-0.5">
                                {label}
                              </p>
                              <p
                                className="text-[15px] font-semibold"
                                style={{
                                  color: highlight ? scoreColor : undefined,
                                }}
                              >
                                {highlight ? (
                                  value
                                ) : (
                                  <span className="text-slate-700">
                                    {value}
                                  </span>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                        {isCompleted ? (
                          <div className="flex w-full justify-end">
                            <button
                              onClick={() =>
                                navigate(
                                  `/contractor/tests/report?id=${res.id}`,
                                )
                              }
                              className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-all"
                            >
                              <Eye className="w-4 h-4 text-slate-400" />
                              View insights
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 min-w-0">
                              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <p className="text-[13px] text-slate-500 truncate">
                                Invite sent to{" "}
                                <span className="font-medium text-slate-700">
                                  {res.candidateEmail}
                                </span>
                              </p>
                            </div>
                            <p className="text-[12px] text-slate-400 flex-shrink-0">
                              Check your inbox
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">
                    No assessments found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {filter === "available" && (
        <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-1">
              Available Invited Tests
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingTestStatus ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                  <span className="ml-2 text-slate-400">Loading...</span>
                </div>
              ) : (invitedTestStatus?.availableTests?.length ?? 0) > 0 ? (
                invitedTestStatus?.availableTests?.map(
                  (res: any, i: number) => {
                    const expiresAt = res.inviteExpiresAt
                      ? new Date(res.inviteExpiresAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "N/A";

                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-white overflow-hidden"
                      >
                        {/* Card body */}
                        <div className="flex items-start gap-4 p-5">
                          {/* Icon */}
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Code className="w-5 h-5 text-blue-500" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 relative">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <h4 className="text-[15px] font-semibold text-slate-800 leading-snug mb-1.5 pr-20">
                                  {res.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {res.status.charAt(0).toUpperCase() +
                                      res.status.slice(1)}
                                  </span>
                                  <span className="text-[12px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {res.totalTime} min
                                  </span>
                                </div>
                              </div>
                              <div className="absolute top-0 right-0 text-right">
                                <p className="text-[11px] text-slate-400">
                                  Expires
                                </p>
                                <p className="text-[13px] font-medium text-slate-600">
                                  {expiresAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <p className="text-[13px] text-slate-500 truncate">
                              Invite sent to{" "}
                              <span className="font-medium text-slate-700">
                                {res.candidateEmail}
                              </span>
                            </p>
                          </div>
                          <p className="text-[12px] text-slate-400 flex-shrink-0">
                            Check your inbox
                          </p>
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">
                    No invited tests available.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Completed Tests (Invited) */}
      {filter === "completed" && (
        <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-1">
              Completed Invited Tests
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingTestStatus ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                  <span className="ml-2 text-slate-400">Loading...</span>
                </div>
              ) : (invitedTestStatus?.completedTests?.length ?? 0) > 0 ? (
                invitedTestStatus?.completedTests?.map(
                  (res: any, i: number) => {
                    const scoreVal = Number(res.overallScore ?? res.score ?? 0);
                    const scoreColor =
                      scoreVal >= 70
                        ? "#22c55e"
                        : scoreVal >= 40
                          ? "#f59e0b"
                          : "#ef4444";

                    const radius = 19;
                    const circumference = 2 * Math.PI * radius;
                    const offset =
                      circumference - (scoreVal / 100) * circumference;

                    const submittedAt = res.submittedAt
                      ? new Date(res.submittedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A";

                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-white overflow-hidden"
                      >
                        {/* Card body */}
                        <div className="flex items-start gap-4 p-5">
                          {/* Score ring */}
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              width="46"
                              height="46"
                              viewBox="0 0 46 46"
                              aria-label={`Score: ${scoreVal}%`}
                            >
                              <circle
                                cx="23"
                                cy="23"
                                r={radius}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="3.5"
                              />
                              <circle
                                cx="23"
                                cy="23"
                                r={radius}
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="3.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 23 23)"
                              />
                              <text
                                x="23"
                                y="27"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill={scoreColor}
                                fontFamily="inherit"
                              >
                                {scoreVal}%
                              </text>
                            </svg>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 relative">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <h4 className="text-[15px] font-semibold text-slate-800 leading-snug mb-1.5 pr-20">
                                  {res.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    Completed
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                                    <WandSparkles className="w-3 h-3" />
                                    AI generated
                                  </span>
                                </div>
                              </div>

                              <div className="absolute top-0 right-0 text-right">
                                <p className="text-[11px] text-slate-400">
                                  Submitted
                                </p>
                                <p className="text-[13px] font-medium text-slate-600">
                                  {submittedAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats strip */}
                        <div className="grid grid-cols-3 gap-2.5 px-5 pb-4">
                          {[
                            {
                              label: "Overall score",
                              value: `${scoreVal}%`,
                              color: scoreColor,
                            },
                            {
                              label: "Coding accuracy",
                              value: res.codingAccuracy
                                ? `${res.codingAccuracy}%`
                                : "—",
                            },
                            {
                              label: "Duration",
                              value: res.totalTime
                                ? `${res.totalTime} min`
                                : "—",
                            },
                          ].map(({ label, value, color }) => (
                            <div
                              key={label}
                              className="bg-slate-50 rounded-lg px-3 py-2.5"
                            >
                              <p className="text-[11px] text-slate-400 mb-0.5">
                                {label}
                              </p>
                              <p
                                className="text-[15px] font-semibold"
                                style={{ color: color ?? undefined }}
                              >
                                <span
                                  className={!color ? "text-slate-700" : ""}
                                >
                                  {value}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex justify-end">
                          <button
                            onClick={() =>
                              navigate(`/contractor/tests/report?id=${res.id}`)
                            }
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-all"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                            View insights
                          </button>
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">
                    No invited tests completed yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mock Test UI */}
      {filter === "mock" && (
        <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Section 1: Start Practice Card */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold text-slate-900 px-1">
              Start a Practice Test
            </h3>
            <Card className="p-5 sm:p-7 md:p-10 border-slate-100 shadow-sm w-full">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Column: Test Type & Question Count */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">
                        Test Name
                      </label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <input
                      type="text"
                      name="testType"
                      placeholder="Enter Test Name"
                      value={mockTest.title}
                      onChange={(e) =>
                        setMockTest({ ...mockTest, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">
                        Number of Questions
                      </label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <Select
                      value={questionCount}
                      onValueChange={(val) => {
                        setQuestionCount(val);
                        if (mockDifficulty) {
                          setMockTest((prev) => ({
                            ...prev,
                            difficultyDistribution: {
                              easy: mockDifficulty === "easy" ? Number(val) : 0,
                              medium:
                                mockDifficulty === "medium" ? Number(val) : 0,
                              hard: mockDifficulty === "hard" ? Number(val) : 0,
                            },
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:border-[#0ea5e9] dark:ring-slate-700 focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 rounded-xl capitalize shadow-none transition-all text-[14px] text-slate-500 font-bold">
                        <SelectValue placeholder="Select Number of Questions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="3"
                          className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                        >
                          3
                        </SelectItem>
                        <SelectItem
                          value="5"
                          className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                        >
                          5
                        </SelectItem>
                        <SelectItem
                          value="10"
                          className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                        >
                          10
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column: Difficulty, Duration & Start Button */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">
                        Select Difficulty Level
                      </label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {difficultyLevels.map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setMockDifficulty(d);
                            setMockTest((prev) => ({
                              ...prev,
                              difficultyDistribution: {
                                easy:
                                  d === "easy" ? Number(questionCount) || 0 : 0,
                                medium:
                                  d === "medium"
                                    ? Number(questionCount) || 0
                                    : 0,
                                hard:
                                  d === "hard" ? Number(questionCount) || 0 : 0,
                              },
                            }));
                          }}
                          className={cn(
                            "py-[11px] rounded-xl text-[14px] font-bold transition-all border capitalize",
                            mockDifficulty === d
                              ? "bg-white border-[#0ea5e9] text-[#0ea5e9] shadow-sm shadow-cyan-100 ring-1 ring-[#0ea5e9]"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">
                        Select Duration
                      </label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <Select
                      value={
                        mockTest.totalTime
                          ? String(mockTest.totalTime)
                          : undefined
                      }
                      onValueChange={(val) =>
                        setMockTest({ ...mockTest, totalTime: parseInt(val) })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:border-[#0ea5e9] dark:ring-slate-700 focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 rounded-xl capitalize shadow-none transition-all text-[14px] text-slate-500 font-bold">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="30"
                          className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                        >
                          30 mins
                        </SelectItem>
                        <SelectItem
                          value="60"
                          className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                        >
                          60 mins
                        </SelectItem>
                        <SelectItem
                          value="90"
                          className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600"
                        >
                          90 mins
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Full Width Button Area */}
              <div className="mt-8 pt-2">
                <button
                  onClick={startMockTest}
                  disabled={isCreating}
                  className="w-full h-[52px] bg-[#0F172A] rounded-xl flex items-center justify-center gap-2 text-white text-[15px] font-bold hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating practice test...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Mock Test</span>
                      <ExternalLink size={18} />
                    </>
                  )}
                </button>
              </div>
            </Card>
            {/* End of section 1 */}
          </div>

          {/* Section 2: Previous Results */}
          <div className="flex flex-col gap-4 max-w-full">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest px-1">
              Your Mock Test Results
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingResults ? (
                <div className="col-span-full flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                  <span className="ml-2 text-slate-400">Loading...</span>
                </div>
              ) : testResults.filter((r) => r.difficultyDistribution).length >
                0 ? (
                testResults
                  .filter((result) => result.difficultyDistribution)
                  .map((res: any, i: number) => {
                    const scoreVal = Number(res.overallScore ?? res.score ?? 0);
                    const scoreColor =
                      scoreVal >= 70
                        ? "#22c55e"
                        : scoreVal >= 40
                          ? "#f59e0b"
                          : "#ef4444";

                    const radius = 19;
                    const circumference = 2 * Math.PI * radius;
                    const offset =
                      circumference - (scoreVal / 100) * circumference;

                    const difficulty =
                      Object.entries(res.difficultyDistribution || {}).find(
                        ([_, v]) => (v as any) > 0,
                      )?.[0] || "Mixed";

                    const submittedAt = res.submittedAt
                      ? new Date(res.submittedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A";

                    return (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-white overflow-hidden"
                      >
                        {/* Card body */}
                        <div className="flex items-start gap-4 p-5">
                          {/* Score ring */}
                          <div className="flex-shrink-0 mt-0.5">
                            <svg
                              width="46"
                              height="46"
                              viewBox="0 0 46 46"
                              aria-label={`Score: ${scoreVal}%`}
                            >
                              <circle
                                cx="23"
                                cy="23"
                                r={radius}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="3.5"
                              />
                              <circle
                                cx="23"
                                cy="23"
                                r={radius}
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="3.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 23 23)"
                              />
                              <text
                                x="23"
                                y="27"
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill={scoreColor}
                                fontFamily="inherit"
                              >
                                {scoreVal}%
                              </text>
                            </svg>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 relative">
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                              <div>
                                <h4 className="text-[15px] font-semibold text-slate-800 leading-snug mb-1.5 pr-20">
                                  {res.title}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap pr-20">
                                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                    Completed
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full capitalize">
                                    {difficulty}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
                                    <WandSparkles className="w-3 h-3" />
                                    AI generated
                                  </span>
                                </div>
                              </div>

                              <div className="absolute top-0 right-0 text-right">
                                <p className="text-[11px] text-slate-400">
                                  Submitted
                                </p>
                                <p className="text-[13px] font-medium text-slate-600">
                                  {submittedAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats strip */}
                        <div className="grid grid-cols-2 gap-2.5 px-5 pb-4">
                          {[
                            {
                              label: "Overall score",
                              value: `${scoreVal}%`,
                              color: scoreColor,
                            },
                            {
                              label: "Coding accuracy",
                              value: res.codingAccuracy
                                ? `${res.codingAccuracy}%`
                                : "—",
                            },
                          ].map(({ label, value, color }) => (
                            <div
                              key={label}
                              className="bg-slate-50 rounded-lg px-3 py-2.5"
                            >
                              <p className="text-[11px] text-slate-400 mb-0.5">
                                {label}
                              </p>
                              <p
                                className="text-[15px] font-semibold"
                                style={{ color: color ?? undefined }}
                              >
                                <span
                                  className={!color ? "text-slate-700" : ""}
                                >
                                  {value}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                        {/* Footer */}
                        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex justify-end">
                          <button
                            onClick={() =>
                              navigate(`/contractor/tests/report?id=${res.id}`)
                            }
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300 transition-all"
                          >
                            <Eye className="w-4 h-4 text-slate-400" />
                            View insights
                          </button>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">
                    No mock tests completed yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorSkillTest;

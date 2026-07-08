import { useMemo } from "react";
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock3,
  Loader2,
  Target,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { CandidateListItem } from "./EmployerAIShortlists";

type CandidateSkillTestDetailsProps = {
  candidate: CandidateListItem | undefined;
  report?: Record<string, unknown>;
  isLoading?: boolean;
};

const formatDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const extractScore = (report?: Record<string, unknown>) => {
  if (!report) {
    return 0;
  }

  const scoreCandidates = [
    report.overallScore,
    report.score,
    (report.result as Record<string, unknown> | undefined)?.overallScore,
    (report.result as Record<string, unknown> | undefined)?.score,
    (report.summary as Record<string, unknown> | undefined)?.overallScore,
    (report.summary as Record<string, unknown> | undefined)?.score,
  ];

  for (const candidate of scoreCandidates) {
    if (candidate === null || candidate === undefined) {
      continue;
    }
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const normalizeQuestions = (report?: Record<string, unknown>) => {
  if (!report) {
    return [] as Array<Record<string, unknown>>;
  }

  const candidates = [report.questions, report.results, report.answers];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(
        (item): item is Record<string, unknown> =>
          !!item && typeof item === "object",
      );
    }
  }

  return [];
};

const CandidateSkillTestDetails = ({
  candidate,
  report,
  isLoading,
}: CandidateSkillTestDetailsProps) => {
  const score = useMemo(() => extractScore(report), [report]);
  const questions = useMemo(() => normalizeQuestions(report), [report]);
  const navigate = useNavigate();

  const clampedScore = Math.min(100, Math.max(0, score));

  if (!candidate) {
    return (
      <div className="text-gray-400 font-medium text-center bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-12">
        Select a candidate to view their skill test scores
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading skill test results...
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No skill test results found yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          We haven't received a skill test score for{" "}
          {candidate.name || "this candidate"} yet.
        </p>
      </div>
    );
  }

  if (report?.status === "active") {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Skill Test is Active, Candidate has not completed the test yet.
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Skill test is currently active for{" "}
          {candidate.name || "this candidate"}.
        </p>
      </div>
    );
  }

  const scoreTone =
    clampedScore >= 70
      ? "text-emerald-600"
      : clampedScore >= 40
        ? "text-amber-600"
        : "text-rose-600";
  const scoreFill =
    clampedScore >= 70
      ? "bg-emerald-500"
      : clampedScore >= 40
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:gap-1 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#08b8cc]">
              Skill Test Scores
            </p>
            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {candidate.name || "Candidate"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {candidate.email || "No email provided"}
            </p>
          </div>
          <Button
            onClick={() => {
              if (report.id !== undefined && report.id !== null) {
                navigate(`/hire-talent/test/report?id=${report.id}`);
              }
            }}
            disabled={report.id === undefined || report.id === null}
            className="bg-[#08b8cc] hover:bg-[#0a9fb8] text-white"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Detailed Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Overall score
              </p>
              <p className={`mt-2 text-4xl font-black ${scoreTone}`}>
                {Math.round(clampedScore)}%
              </p>
            </div>
            <div className="rounded-full bg-white p-3 shadow-sm">
              <Target className="h-5 w-5 text-[#08b8cc]" />
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${scoreFill}`}
              style={{ width: `${clampedScore}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
            {report.title ? (
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">
                {String(report.title)}
              </span>
            ) : null}
            {report.testName ? (
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">
                {String(report.testName)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Test snapshot</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Coding Accuracy
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-700">
                {report?.codingAccuracy !== undefined
                  ? `${report?.codingAccuracy}%`
                  : "Not available"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Submitted on
              </p>
              <p className="mt-2 text-sm font-semibold text-gray-700">
                {formatDate(
                  report.submittedAt ?? report.completedAt ?? report.createdAt,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {questions.length > 0 ? (
        <div className="border-t border-gray-100 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Question breakdown</h3>
            <span className="text-sm text-gray-500">
              {questions.length} questions
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {questions.map((question, index) => {
              const statusValue = String(
                question.status || question.result || "",
              ).toLowerCase();
              const isCorrect = statusValue === "correct";
              const isIncorrect = statusValue === "incorrect";
              const chipClass = isCorrect
                ? "bg-emerald-50 text-emerald-700"
                : isIncorrect
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700";

              return (
                <div
                  key={`${question.questionId ?? question.id ?? index}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {typeof question.question === "string" &&
                        question.question.trim()
                        ? question.question
                        : `Question ${index + 1}`}
                    </p>
                    {question.answer ? (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {String(question.answer)}
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${chipClass}`}
                  >
                    {isCorrect ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Correct
                      </span>
                    ) : isIncorrect ? (
                      "Incorrect"
                    ) : (
                      "Pending"
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CandidateSkillTestDetails;

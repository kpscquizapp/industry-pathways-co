import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Info,
  LockKeyhole,
  Mic,
  ShieldCheck,
  Timer,
  Video,
} from "lucide-react";
import logo from "../assets/White Option.png";

const questions = [
  {
    category: "Data foundations",
    title: "What is a data warehouse?",
    description:
      "Describe the purpose of a data warehouse and how it differs from an operational database.",
  },
  {
    category: "Data management",
    title: "Explain SCD Type 2 in data management",
    description:
      "Briefly explain what Slowly Changing Dimension (SCD) Type 2 means in the context of data management. Keep your answer concise and clear.",
  },
  {
    category: "Data quality",
    title: "How would you identify duplicate records?",
    description:
      "Outline a practical approach to finding and handling duplicate records in a dataset.",
  },
];

const initialTimeInSeconds = 14 * 60 + 31;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function CandidateAssessment() {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(1);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [response, setResponse] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(initialTimeInSeconds);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [status, setStatus] = useState<"active" | "completed" | "ended">(
    "active",
  );

  const question = questions[activeQuestionIndex];
  const wordCount = response.trim()
    ? response.trim().split(/\s+/).length
    : 0;
  const answeredCount =
    activeQuestionIndex +
    (responses[activeQuestionIndex]?.trim() ? 1 : 0);
  const isComplete = status !== "active";

  useEffect(() => {
    if (isComplete || timeRemaining <= 0) return;

    const timerId = window.setInterval(() => {
      setTimeRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isComplete, timeRemaining]);

  const saveAndContinue = () => {
    const nextResponses = { ...responses, [activeQuestionIndex]: response };
    setResponses(nextResponses);

    if (activeQuestionIndex === questions.length - 1) {
      setStatus("completed");
      return;
    }

    const nextIndex = activeQuestionIndex + 1;
    setActiveQuestionIndex(nextIndex);
    setResponse(nextResponses[nextIndex] ?? "");
  };

  return (
    <div className="min-h-screen bg-[#131a24] text-[#e6edf6]">
      <header className="flex h-[62px] items-center justify-between border-b border-[#344353] bg-[#1d2734] px-4 sm:px-6">
        <a
          href="/"
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          aria-label="QuickRekruit home"
        >
          <img src={logo} alt="QuickRekruit Logo" className="h-14 w-auto" />
        </a>
        <div className="flex items-center gap-2 text-xs text-[#a5b5c6]">
          <ShieldCheck className="h-4 w-4 text-white/60" aria-hidden="true" />
          <span className="hidden sm:inline">
            Secure assessment environment
          </span>
          <span className="sm:hidden">Secure session</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-7">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#a5b5c6]">
              Candidate assessment
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Data QA assessment
            </h1>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-xl border border-[#344353] bg-[#1d2734] px-3 py-2 sm:px-5 sm:py-3">
            <Timer className="h-5 w-5 text-[#a5b5c6]" aria-hidden="true" />
            <div>
              <p
                className="text-xl font-semibold leading-6 tabular-nums text-white sm:text-2xl"
                aria-live="off"
              >
                {formatTime(timeRemaining)}
              </p>
              <p className="text-xs text-[#a5b5c6]">Time remaining</p>
            </div>
          </div>
        </div>

        <div
          className="mb-2 flex gap-2"
          role="progressbar"
          aria-label={`Question ${activeQuestionIndex + 1} of ${questions.length}`}
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answeredCount}
        >
          {questions.map((item, index) => {
            const isAnswered =
              index < activeQuestionIndex ||
              Boolean(responses[index]?.trim());

            return (
              <span
                key={item.title}
                className={`h-[5px] flex-1 rounded-full ${
                  isAnswered
                    ? "bg-[#187bba]"
                    : index === activeQuestionIndex
                      ? "bg-gradient-to-r from-[#187bba] via-[#187bba] via-50% to-[#344353] to-50%"
                      : "bg-[#344353]"
                }`}
              />
            );
          })}
        </div>
        <div className="mb-5 flex justify-between gap-3 text-xs text-[#a5b5c6]">
          <span aria-live="polite">
            Question {activeQuestionIndex + 1} of {questions.length}
          </span>
          <span>{answeredCount} completed</span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-6">
          <section
            aria-label="Assessment question"
            className="overflow-hidden rounded-xl border border-[#344353] bg-[#1d2734]"
          >
            <div className="border-b border-[#344353] p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-md bg-sky-500/10 px-2.5 py-1.5 text-xs font-medium text-sky-300">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Text response
                </span>
                <span className="text-xs text-[#a5b5c6]">
                  {question.category}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-semibold leading-7 text-white sm:text-xl">
                {question.title}
              </h2>
              <p className="text-sm leading-6 text-[#a5b5c6]">
                {question.description}
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label
                  htmlFor="candidate-response"
                  className="text-sm font-semibold text-[#e6edf6]"
                >
                  Your response <span className="text-sky-400">*</span>
                </label>
                <span className="text-xs text-[#a5b5c6]">Required</span>
              </div>
              <textarea
                id="candidate-response"
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                placeholder="Write your response here…"
                aria-describedby="response-counts"
                disabled={isComplete}
                className="min-h-[205px] w-full resize-y rounded-lg border border-[#344353] bg-[#17212d] p-4 text-sm leading-6 text-[#e6edf6] placeholder:text-[#8293a6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <div
                id="response-counts"
                className="mb-6 mt-2 flex justify-between text-[11px] text-[#a5b5c6]"
              >
                <span aria-live="polite">{response.length} characters</span>
                <span aria-live="polite">{wordCount} words</span>
              </div>

              <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
                <p
                  className="text-xs text-[#a5b5c6]"
                  aria-live="polite"
                  role="status"
                >
                  {status === "completed"
                    ? "Assessment completed in this preview."
                    : status === "ended"
                      ? "Assessment preview ended."
                      : "Your response is not saved yet"}
                </p>
                <button
                  type="button"
                  onClick={saveAndContinue}
                  disabled={!response.trim() || isComplete}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#187bba] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#14699f] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {activeQuestionIndex === questions.length - 1
                    ? "Finish assessment"
                    : "Save & continue"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {status === "completed" && (
                <div
                  className="mt-4 flex items-start gap-2 rounded-lg border border-[#344353] bg-[#202e3f] p-4 text-xs text-[#e6edf6]"
                  role="status"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  <p>
                    Your responses are saved in this preview. Nothing was sent
                    to an external service.
                  </p>
                </div>
              )}
              {status === "ended" && (
                <div
                  className="mt-4 rounded-lg border border-[#344353] bg-[#202e3f] p-4 text-xs text-[#e6edf6]"
                  role="status"
                >
                  Assessment preview ended.
                </div>
              )}
            </div>
          </section>

          <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <section>
              <div
                className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl border border-[#344353] bg-gradient-to-br from-[#253746] to-[#14232f] text-[#e1eaf2]"
                aria-label="Camera preview placeholder"
              >
                <span className="absolute left-3 top-3 rounded-md border border-[#526273] bg-[#1d2734]/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-[#c8d4e0]">
                  <span className="mr-1 text-emerald-400" aria-hidden="true">
                    ●
                  </span>
                  PREVIEW
                </span>
                <span className="grid h-16 w-16 place-items-center rounded-full border border-sky-300/20 bg-sky-500/10 text-xl font-semibold text-sky-200">
                  AK
                </span>
                <span className="absolute bottom-3 left-3 text-xs text-white">
                  Arun · You
                </span>
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#354754]">
                    <Mic className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#354754]">
                    <Video className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
              <p className="mt-2 flex items-center justify-center gap-1.5 px-2 py-1 text-center text-xs text-[#a5b5c6]">
                <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                Camera placeholder for this preview
              </p>
            </section>

            <section className="rounded-xl border border-[#344353] bg-[#1d2734] p-4 sm:p-5">
              <h2 className="mb-4 text-sm font-semibold text-white">
                Session details
              </h2>
              <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 text-xs">
                <dt className="text-[#a5b5c6]">Assessment</dt>
                <dd className="m-0 text-right font-medium">Data QA</dd>
                <dt className="text-[#a5b5c6]">Response type</dt>
                <dd className="m-0 text-right font-medium">Text-based</dd>
                <dt className="text-[#a5b5c6]">Questions</dt>
                <dd className="m-0 text-right font-medium">
                  {questions.length} total
                </dd>
              </dl>

              <button
                type="button"
                disabled={isComplete}
                onClick={() => setShowEndConfirmation(true)}
                className="mt-5 min-h-11 w-full rounded-lg border border-[#774954] px-4 py-2.5 text-xs font-medium text-[#ffa7b3] transition hover:bg-[#402933] disabled:cursor-not-allowed disabled:opacity-50"
              >
                End assessment
              </button>
              {showEndConfirmation && (
                <div
                  className="mt-3 rounded-lg border border-[#344353] bg-[#131a24] p-3 text-xs"
                  role="alert"
                >
                  <p>End this assessment preview?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEndConfirmation(false)}
                      className="min-h-9 rounded-md border border-[#344353] bg-[#1d2734] px-3 py-2 text-[#e6edf6] hover:bg-[#263b4b]"
                    >
                      Keep working
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("ended");
                        setShowEndConfirmation(false);
                      }}
                      className="min-h-9 rounded-md bg-[#187bba] px-3 py-2 font-semibold text-white hover:bg-[#14699f]"
                    >
                      End preview
                    </button>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>

        <footer className="flex items-center justify-center gap-1.5 pt-6 text-center text-[11px] text-[#a5b5c6]">
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          Your responses are private and secure
          {status === "completed" && (
            <CheckCircle2
              className="ml-1 h-3.5 w-3.5 text-emerald-400"
              aria-label="Assessment completed"
            />
          )}
        </footer>
      </main>
    </div>
  );
}

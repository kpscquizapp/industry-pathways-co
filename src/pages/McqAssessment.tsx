import { useState } from "react";
import { ArrowRight, Check, Clock3, ShieldCheck, Video } from "lucide-react";
import logo from "../assets/White Option.png";

const questions = [
  {
    prompt: "Which React hook manages local state in a function component?",
    options: ["useEffect", "useState", "useContext", "useRef"],
  },
  {
    prompt:
      "What is the primary purpose of a key when rendering a list in React?",
    options: [
      "Style each list item",
      "Sort items automatically",
      "Identify items across renders",
      "Prevent every re-render",
    ],
  },
  {
    prompt: "Which method creates a new array by transforming every element?",
    options: ["map()", "forEach()", "find()", "some()"],
  },
  {
    prompt: "How should you update an object stored in React state?",
    options: [
      "Mutate the object directly",
      "Reload the page",
      "Modify the DOM manually",
      "Pass a new object to the setter",
    ],
  },
];

export default function McqAssessment() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [status, setStatus] = useState<"submitted" | "ended" | null>(null);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const isComplete = status !== null;

  const chooseAnswer = (questionIndex: number, answer: string) => {
    setAnswers((current) => ({ ...current, [questionIndex]: answer }));
    setShowSubmitConfirmation(false);
  };

  const submitAssessment = () => {
    setStatus("submitted");
    setShowSubmitConfirmation(false);
  };

  const endAssessment = () => {
    setStatus("ended");
    setShowEndConfirmation(false);
    setShowSubmitConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-[#131a24] text-[#e6edf6]">
      <header className="flex h-[62px] shrink-0 items-center justify-between border-b border-[#344353] bg-[#1d2734] px-4 sm:px-6">
        <a
          href="/"
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          aria-label="QuickRekruit home"
        >
          <img src={logo} alt="QuickRekruit Logo" className="h-14 w-auto" />
        </a>
        <div className="flex items-center gap-2 text-xs text-[#a5b5c6]">
          <ShieldCheck className="h-4 w-4 text-white/60" />
          <span className="hidden sm:inline">
            Secure assessment environment
          </span>
          <span className="sm:hidden">Secure session</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[1.6px] text-[#a5b5c6]">
              Multiple-choice assessment
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Frontend Developer
            </h1>
            <p className="mt-0.5 text-sm text-[#a5b5c6]">
              React.js / Next.js <span aria-hidden="true">·</span> 4 questions
            </p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-xl border border-[#344353] bg-[#1d2734] px-3 py-2 sm:px-5 sm:py-3">
            <Clock3 className="h-5 w-5 text-[#a5b5c6]" />
            <div>
              <p className="text-xl font-semibold leading-6 text-white tabular-nums sm:text-2xl">
                15:00
              </p>
              <p className="text-xs text-[#a5b5c6]">Time remaining</p>
            </div>
          </div>
        </div>

        <div
          className="mt-6 flex gap-2"
          role="progressbar"
          aria-label="Assessment answer progress"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answeredCount}
        >
          {questions.map((question, index) => (
            <span
              key={question.prompt}
              className={`h-[5px] flex-1 rounded-full ${answers[index] ? "bg-[#187bba]" : "bg-[#344353]"}`}
            />
          ))}
        </div>
        <div className="mb-5 mt-2 flex justify-between gap-3 text-xs text-[#a5b5c6]">
          <span aria-live="polite">
            {answeredCount} of {questions.length} answered
          </span>
          <span className="text-right">Select one answer per question</span>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_235px] lg:gap-6">
          <section aria-label="Assessment questions">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (allAnswered && !isComplete) {
                  setShowSubmitConfirmation(true);
                }
              }}
            >
              <div className="grid gap-4">
                {questions.map((question, questionIndex) => (
                  <fieldset
                    key={question.prompt}
                    id={`mcq-q${questionIndex + 1}`}
                    disabled={isComplete}
                    className="rounded-xl border border-[#344353] bg-[#1d2734] p-4 sm:p-5"
                  >
                    <legend className="mb-4 w-full p-0">
                      <div className="flex items-start gap-2.5 text-sm font-semibold leading-6 text-slate-200">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-sky-500/15 text-xs text-sky-300">
                          {String(questionIndex + 1).padStart(2, "0")}
                        </span>
                        <span className="pt-0.5">{question.prompt}</span>
                      </div>
                    </legend>
                    <div className="clear-both grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => {
                        const checked = answers[questionIndex] === option;
                        const inputId = `question-${questionIndex + 1}-option-${optionIndex + 1}`;

                        return (
                          <label
                            key={option}
                            htmlFor={inputId}
                            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-all ${
                              checked
                                ? "border-sky-400 bg-[#70c2ef]/20"
                                : "border-[#374657] bg-[#1d2836] hover:border-sky-500/40 hover:bg-[#152230]"
                            } ${isComplete ? "cursor-default opacity-80" : ""}`}
                          >
                            <input
                              id={inputId}
                              type="radio"
                              name={`question-${questionIndex + 1}`}
                              value={option}
                              checked={checked}
                              onChange={() =>
                                chooseAnswer(questionIndex, option)
                              }
                              className="min-h-4 min-w-4 appearance-none rounded-full border-2 border-slate-500 bg-transparent shrink-0 cursor-pointer transition-all checked:border-sky-400 checked:bg-sky-400 checked:p-[2.5px] checked:bg-clip-content"
                            />
                            <span className="rounded px-2 py-0.5 font-mono text-xs text-slate-200">
                              {option}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[#a5b5c6]" aria-live="polite">
                  {status === "submitted"
                    ? "Assessment submitted in this preview."
                    : status === "ended"
                      ? "Assessment preview ended."
                      : allAnswered
                        ? "All questions answered. Ready to submit."
                        : `Answer all ${questions.length} questions to submit.`}
                </p>
                <button
                  type="submit"
                  disabled={!allAnswered || isComplete}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#187bba] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#14699f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit assessment
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {showSubmitConfirmation && (
              <div
                className="mt-4 rounded-lg border border-[#344353] bg-[#202e3f] p-4 text-xs"
                role="alert"
              >
                <p className="font-medium">
                  All {questions.length} questions answered. Submit your
                  assessment?
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitConfirmation(false)}
                    className="min-h-10 rounded-md border border-[#344353] bg-[#1d2734] px-3 py-2 font-medium text-[#e6edf6] hover:bg-[#263b4b]"
                  >
                    Review answers
                  </button>
                  <button
                    type="button"
                    onClick={submitAssessment}
                    className="min-h-10 rounded-md bg-[#187bba] px-3 py-2 font-semibold text-white hover:bg-[#14699f]"
                  >
                    Confirm submission
                  </button>
                </div>
              </div>
            )}

            {status === "submitted" && (
              <div
                className="mt-4 flex items-start gap-2 rounded-lg border border-[#344353] bg-[#202e3f] p-4 text-xs text-[#e6edf6]"
                role="status"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                <p>
                  Assessment submitted in this preview. Your {questions.length}{" "}
                  responses have been saved; nothing was sent to an external
                  service.
                </p>
              </div>
            )}
            {status === "ended" && (
              <div
                className="mt-4 rounded-lg border border-[#344353] bg-[#202e3f] p-4 text-xs"
                role="status"
              >
                Assessment preview ended.
              </div>
            )}
          </section>

          <aside className="grid gap-4 sm:grid-cols-[minmax(180px,220px)_minmax(0,1fr)] lg:grid-cols-1">
            <section>
              <div
                className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl border border-[#344353] bg-[#17212d] text-[#e1eaf2]"
                aria-label="Candidate camera placeholder"
              >
                <span className="absolute left-3 top-3 rounded-md border border-[#526273] bg-[#1d2734]/90 px-2 py-1 text-[10px] font-semibold tracking-wide text-[#c8d4e0]">
                  <span className="mr-1 text-emerald-400" aria-hidden="true">
                    ●
                  </span>
                  PREVIEW
                </span>
                <span className="grid h-16 w-16 place-items-center rounded-full border border-sky-300/20 bg-sky-500/10 text-xl font-semibold text-sky-200">
                  PP
                </span>
                <span className="absolute bottom-3 left-3 text-[11px]">
                  Princy Prakash · You
                </span>
              </div>
              <p className="mt-2 flex items-center justify-center gap-1.5 border-t border-[#344353] px-3 py-2 text-center text-xs text-[#a5b5c6] sm:justify-start lg:justify-center">
                <Video className="h-3.5 w-3.5" />
                Camera placeholder
              </p>
            </section>

            <section className="rounded-xl border border-[#344353] bg-[#1d2734] p-4 sm:p-[17px]">
              <h2 className="text-[13px] font-semibold">Question overview</h2>
              <nav
                className="my-4 flex flex-wrap gap-2"
                aria-label="Jump to question"
              >
                {questions.map((question, index) => (
                  <a
                    key={question.prompt}
                    href={`#mcq-q${index + 1}`}
                    aria-label={`Question ${index + 1}, ${
                      answers[index] ? "answered" : "unanswered"
                    }`}
                    className={`grid h-9 w-9 place-items-center rounded-md border text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 ${
                      answers[index]
                        ? "border-sky-500/60 bg-sky-500/15 text-sky-300"
                        : "border-[#344353] text-[#a5b5c6] hover:border-sky-500/40 hover:text-white"
                    }`}
                  >
                    {index + 1}
                  </a>
                ))}
              </nav>
              <p className="text-xs text-[#a5b5c6]" aria-live="polite">
                {questions.length - answeredCount} questions remaining
              </p>

              <div className="my-5 border-t border-[#344353]" />
              <h2 className="mb-4 text-[13px] font-semibold">
                Session details
              </h2>
              <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-3 text-[11px]">
                <dt className="text-[#a5b5c6]">Assessment</dt>
                <dd className="m-0 text-right font-medium">React Developer</dd>
                <dt className="text-[#a5b5c6]">Response type</dt>
                <dd className="m-0 text-right font-medium">Multiple choice</dd>
                <dt className="text-[#a5b5c6]">Questions</dt>
                <dd className="m-0 text-right font-medium">4 Total</dd>
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
                  <p>End this preview without submitting?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEndConfirmation(false)}
                      className="min-h-9 rounded-md border border-[#344353] bg-[#1d2734] px-3 py-2 text-[#e6edf6] hover:bg-[#263b4b]"
                    >
                      Stay
                    </button>
                    <button
                      type="button"
                      onClick={endAssessment}
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
      </main>
    </div>
  );
}

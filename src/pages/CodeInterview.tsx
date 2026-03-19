import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "../hooks/useDebounce";
import WebcamFeed from "./WebcamFeed";
import { toast } from "sonner";

async function detectMultipleMonitors(): Promise<boolean> {
  // 1. Window Management API — most reliable (Chrome 100+)
  if ("getScreenDetails" in window) {
    try {
      const details = await (window as any).getScreenDetails();
      if (details.screens.length > 1) return true;
    } catch {
      /* permission denied — fall through */
    }
  }

  // 2. screen.isExtended — boolean flag (Chrome 100+, Safari 16+)
  if ((window.screen as any).isExtended === true) return true;

  // 3. availWidth wider than screen width — all browsers
  if (window.screen.availWidth - window.screen.width > 8) return true;

  return false;
}

const CodeInterview = () => {
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [tabViolationCount, setTabViolationCount] = useState<number>(0);
  const [isInterviewActive, setIsInterviewActive] = useState<boolean>(false);
  const [isMonitoringActive, setIsMonitoringActive] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const hasMountedRef = useRef(false);
  const suppressViolationsUntilRef = useRef(0);
  const devtoolsOpenRef = useRef(false);
  const [violationLogs, setViolationLogs] = useState<
    { id: string; message: string; time: string }[]
  >([]);

  const addLog = useCallback((message: string): void => {
    const now = new Date();
    const id = `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`;
    const time = now.toLocaleTimeString();
    setViolationLogs((prev) => [{ id, message, time }, ...prev].slice(0, 50));
  }, []);

  const handleViolation = useCallback(
    async (reason: string) => {
      if (!isMonitoringActive) return;
      if (Date.now() < suppressViolationsUntilRef.current) return;

      try {
        await fetch("/api/violations/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, reason }),
        });
        setTabViolationCount((prev) => prev + 1);
        addLog(`Violation: ${reason}`);
      } catch (error) {
        toast.error("Failed to log violation");
      }
    },
    [addLog, isMonitoringActive],
  );

  const onResize = useDebouncedCallback(() => {
    handleViolation("Window resized");
  }, 1000);

  const checkDevtools = useCallback(() => {
    if (!isMonitoringActive) return;
    if (document.visibilityState !== "visible") {
      devtoolsOpenRef.current = false;
      return;
    }
    if (
      window.outerWidth === 0 ||
      window.outerHeight === 0 ||
      window.innerWidth === 0 ||
      window.innerHeight === 0
    ) {
      devtoolsOpenRef.current = false;
      return;
    }
    const threshold = 160;
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    const isOpen = widthDiff > threshold || heightDiff > threshold;

    if (isOpen && !devtoolsOpenRef.current) {
      devtoolsOpenRef.current = true;
      handleViolation("Developer tools opened");
    } else if (!isOpen) {
      devtoolsOpenRef.current = false;
    }
  }, [handleViolation, isMonitoringActive]);

  useEffect(() => {
    const onVisibilityChange = (): void => {
      if (document.visibilityState === "hidden") {
        handleViolation("Tab Switched");
      }
    };
    const onCopy = (event: ClipboardEvent): void => {
      if (!isMonitoringActive) return;
      event.preventDefault();
      handleViolation("Copy attempt");
    };
    const onCut = (event: ClipboardEvent): void => {
      if (!isMonitoringActive) return;
      event.preventDefault();
      handleViolation("Cut attempt");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCut);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCut);
      window.removeEventListener("resize", onResize);
    };
  }, [handleViolation, isMonitoringActive, onResize]);

  useEffect(() => {
    if (!isMonitoringActive) {
      devtoolsOpenRef.current = false;
      return;
    }

    const intervalId = window.setInterval(checkDevtools, 1000);
    checkDevtools();

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkDevtools, isMonitoringActive]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
  }, [isMonitoringActive, tabViolationCount]);

  const startInterview = useCallback(async () => {
    if (isInterviewActive) return;
    const hasMultipleMonitors = await detectMultipleMonitors();

    if (hasMultipleMonitors) {
      handleViolation("Multiple monitors detected");
    }

    try {
      const res = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: "123", jobId: "456" }),
      });

      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
        setIsInterviewActive(true);
        toast.success("Interview started!");
      } else {
        toast.error("Failed to start interview");
      }
    } catch (error) {
      toast.error("Failed to start interview");
    }
  }, [isInterviewActive]);

  const stopInterview = useCallback(async () => {
    if (!isInterviewActive) return;

    try {
      await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      setIsInterviewActive(false);
      setIsMonitoringActive(false);
      toast.info("Interview stopped!");
    } catch (error) {
      toast.error("Failed to stop interview");
    }
  }, [isInterviewActive]);

  const handleRecordingStart = useCallback(() => {
    setIsMonitoringActive(true);
  }, []);

  const handleRecordingStop = useCallback(() => {
    setIsMonitoringActive(false);
  }, []);

  const handleCameraError = useCallback(() => {
    setIsMonitoringActive(false);
  }, []);

  const handleScreenShareStart = useCallback(() => {
    suppressViolationsUntilRef.current = Date.now() + 1500;
  }, []);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
        <div className="pointer-events-none absolute -top-36 -left-24 h-80 w-80 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[var(--accent-2)]/18 blur-3xl" />

        <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
          <div className="mt-6 grid flex-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <section className="flex flex-col gap-5">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-4 backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                      Interview Prompt
                    </p>
                    <h2 className="font-display mt-3 text-2xl">
                      Build a responsive summary card with live stats.
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Narrate tradeoffs and edge cases as you code. Keep the UI
                      accessible.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Time Remaining
                    <div className="mt-2 text-xl font-semibold text-black">
                      35:00
                    </div>
                  </div>
                </div>
              </div>

              <WebcamFeed
                isInterviewActive={isInterviewActive}
                totalViolations={tabViolationCount}
                onScreenShareStart={handleScreenShareStart}
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
                onCameraError={handleCameraError}
                sessionId={sessionId}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-black/10 bg-white/70 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    Interview Controls
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {isInterviewActive
                      ? isMonitoringActive
                        ? "Recording and logging are active."
                        : "Waiting for camera permission to start recording."
                      : "Interview idle. Start to enable recording and logs."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded-full bg-black px-5 py-2 cursor-pointer text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-black/40"
                    onClick={startInterview}
                    disabled={isInterviewActive}
                  >
                    Start Interview
                  </button>
                  <button
                    className="rounded-full border border-black/10 bg-white px-5 py-2 cursor-pointer text-sm font-semibold text-black disabled:cursor-not-allowed disabled:text-black/40 hover:text-red-600"
                    onClick={stopInterview}
                    disabled={!isInterviewActive}
                  >
                    Stop Interview
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-xl">Violation Log</h3>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isMonitoringActive
                          ? "bg-[var(--accent-2)]"
                          : "bg-black/20"
                      }`}
                    />
                    {isMonitoringActive ? "Logging On" : "Logging Paused"}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {violationLogs.length === 0 ? (
                    <div className="rounded-2xl border border-black/5 bg-black/5 p-4">
                      No logs yet. Start the interview to begin monitoring.
                    </div>
                  ) : (
                    violationLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/5 bg-white/80 px-4 py-3"
                      >
                        <span>{log.message}</span>
                        <span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                          {log.time}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <aside className="flex flex-col gap-5">
              <div className="rounded-3xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl">
                <h3 className="font-display text-xl">Participants</h3>
                <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 p-4">
                    <div>
                      <p className="font-semibold text-black">Asha Patel</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Candidate
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 p-4">
                    <div>
                      <p className="font-semibold text-black">Rohan Mehta</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Interviewer
                      </p>
                    </div>
                    <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-black">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-white/80 p-4">
                    <div>
                      <p className="font-semibold text-black">Priya Nair</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                        Observer
                      </p>
                    </div>
                    <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold text-black">
                      Silent
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-white/70 p-5 backdrop-blur-xl">
                <h3 className="font-display text-xl">Room Rules</h3>
                <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                  <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                    Keep the webcam on throughout the interview.
                  </li>
                  <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                    Do not switch tabs or resize the browser window.
                  </li>
                  <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                    Stay in a quiet, well-lit environment.
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </main>

        {isRulesOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <button
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsRulesOpen(false)}
              aria-label="Close rules"
            />
            <section className="relative w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-2xl">Interview Rules</h2>
                <button
                  className="rounded-full cursor-pointer border border-black/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]"
                  onClick={() => setIsRulesOpen(false)}
                >
                  Close
                </button>
              </div>
              <p className="mt-3 text-sm text-[var(--muted)]">
                The interview panel tracks attention and records video for
                review.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[var(--muted)]">
                <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                  You have to open the camera to start the interview.
                </li>
                <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                  No tab switching. Switching away counts as a violation.
                </li>
                <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                  No resizing the window. Resize events are logged.
                </li>
                <li className="rounded-2xl border border-black/5 bg-black/5 p-4">
                  Stay focused. Alerts will appear instantly.
                </li>
              </ul>
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CodeInterview;

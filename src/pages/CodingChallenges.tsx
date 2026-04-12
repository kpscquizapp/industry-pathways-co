import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Play, Send, ChevronLeft, Monitor, AlertTriangle, Clock, Code2, ShieldCheck, Video, Airplay, Layers } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import ProblemPanel from "@/components/coding/ProblemPanel";
import EditorPanel from "@/components/coding/EditorPanel";
import ConsoleOutput from "@/components/coding/ConsoleOutput";
import WebcamFeed from "@/pages/WebcamFeed";
import {
  CodingProblem,
  Difficulty,
  SupportedLanguage,
  TestCase,
} from "@/types/coding";
import { toast } from "sonner";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import TestTimer from "@/components/coding/TestTimer";

type TestStatus = "loading" | "instructions" | "active" | "completed" | "expired" | "error";

interface TestMetadata {
  id: number;
  title: string;
  totalTime: number;
  status: string;
  startedAt: string | null;
  candidateEmail: string;
}

async function detectMultipleMonitors(): Promise<boolean> {
  // 1. Window Management API — most reliable (Chrome 100+)
  if ("getScreenDetails" in window) {
    try {
      const details = await (window as any).getScreenDetails();
      if (details.screens.length > 1) return true;
    } catch {
      toast.error("Failed to detect screens");
    }
  }

  // 2. screen.isExtended — boolean flag (Chrome 100+, Safari 16+)
  if ((window.screen as any).isExtended === true) return true;

  // 3. availWidth wider than screen width — all browsers
  if (window.screen.availWidth - window.screen.width > 8) return true;

  return false;
}

// Deleted sampleProblem - Loading from API instead

const CodingChallenge: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { challengeId: testId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  // State
  const [testStatus, setTestStatus] = useState<TestStatus>("loading");
  const [metadata, setMetadata] = useState<TestMetadata | null>(null);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);

  const [language, setLanguage] = useState<SupportedLanguage>(
    SupportedLanguage.JAVASCRIPT,
  );
  const [code, setCode] = useState<string>("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>();

  // Consents
  const [hasWebcamPermission, setHasWebcamPermission] = useState(false);
  const [isScreenSelected, setIsScreenSelected] = useState(false);

  // Interview/Test state
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [totalViolations, setTotalViolations] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  ).current;
  const hasMountedRef = useRef(false);
  const suppressViolationsUntilRef = useRef(0);
  const devtoolsOpenRef = useRef(false);

  // Back-button & page-close guard
  useEffect(() => {
    const isGuarded = testStatus === "active" || testStatus === "instructions";
    if (!isGuarded) return;

    // Push a dummy state so there's a history entry to intercept
    window.history.pushState({ guardedTest: true }, "");

    const handlePopState = (e: PopStateEvent) => {
      const confirmed = window.confirm(
        "⚠️ Warning: Leaving will permanently end your test!\n\nYou will NOT be able to re-enter this test once you leave. Your current progress will be lost.\n\nAre you sure you want to exit?"
      );
      if (confirmed) {
        // Remove our guard and navigate away
        navigate("/contractor/tests");
      } else {
        // Re-push the dummy state so the back button still works next time
        window.history.pushState({ guardedTest: true }, "");
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "⚠️ Warning: Leaving will permanently end your test! You will NOT be able to re-enter.";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [testStatus, navigate]);

  const currentProblem = problems[activeProblemIndex];

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const urlParams = token ? `?token=${token}` : "";

        // Fetch Status
        const statusRes = await fetch(`${baseUrl}/coding/tests/${testId}/status${urlParams}`);
        const statusData = await statusRes.json();

        if (!statusData.success) {
          toast.error("Failed to load test status");
          setTestStatus("expired");
          return;
        }

        const testMeta = statusData.data.test;
        setMetadata(testMeta);

        if (testMeta.status === "completed") {
          setTestStatus("completed");
          return;
        }

        // Fetch Problems
        const problemsRes = await fetch(`${baseUrl}/coding/tests/${testId}/problems${urlParams}`);
        const problemsData = await problemsRes.json();

        if (problemsData.success) {
          setProblems(problemsData.data);

          // Determine starting state
          if (testMeta.startedAt) {
            setTestStatus("active");
            setIsInterviewActive(true);
            setIsMonitoringActive(true);
          } else {
            setTestStatus("instructions");
          }
        } else {
          setTestStatus("error");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Connection error while loading test");
        setTestStatus("error");
      }
    };

    if (testId) {
      fetchInitialData();
    }
  }, [testId, token]);

  const handleStartTest = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const urlParams = token ? `?token=${token}` : "";
      const res = await fetch(`${baseUrl}/coding/tests/${testId}/start${urlParams}`, {
        method: "PATCH"
      });
      const data = await res.json();

      if (data.success) {
        setMetadata(data.data);
        setTestStatus("active");
        setIsInterviewActive(true);
        setIsMonitoringActive(true);
        toast.success("Test started!");
      }
    } catch (err) {
      toast.error("Failed to start test");
    }
  };
  console.log(metadata)
  const handleEndTest = useCallback(async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const urlParams = token ? `?token=${token}` : "";
      const res = await fetch(`${baseUrl}/coding/tests/${testId}/end${urlParams}`, {
        method: "PATCH"
      });
      const data = await res.json();

      if (data.success) {
        setTestStatus("completed");
        setIsInterviewActive(false);
        setIsMonitoringActive(false);
        toast.success("Test submitted successfully!");
      }
    } catch (err) {
      toast.error("Failed to submit test");
    }
  }, [testId, token]);

  // Violation monitoring
  const handleViolation = useCallback(
    async (reason: string) => {
      if (!isMonitoringActive) return;
      if (Date.now() < suppressViolationsUntilRef.current) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
        await fetch(`${baseUrl}/anti-cheat/violations/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, reason }),
        });
        setTotalViolations((prev) => prev + 1);
      } catch (error) {
        // Silent failure for monitoring logs to avoid disrupting the user experience
      }
    },
    [isMonitoringActive, sessionId],
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
    const threshold = 160;
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    const isOpen = (widthDiff > threshold || heightDiff > threshold) && (window.outerWidth > 0 && window.outerHeight > 0);

    if (isOpen && !devtoolsOpenRef.current) {
      devtoolsOpenRef.current = true;
      handleViolation("Developer tools opened");
    } else if (!isOpen) {
      devtoolsOpenRef.current = false;
    }
  }, [handleViolation, isMonitoringActive]);

  // Update code when language changes or problem changes
  useEffect(() => {
    if (!currentProblem) return;

    const savedCode = localStorage.getItem(`code_${currentProblem.id}_${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      // Use baseCode or fallback
      const baseCode = currentProblem.baseCode || currentProblem.starterCode;
      setCode(baseCode?.[language] || "");
    }
  }, [language, currentProblem]);

  // Auto-save code to localStorage
  useEffect(() => {
    if (!currentProblem) return;
    const timer = setTimeout(() => {
      localStorage.setItem(`code_${currentProblem.id}_${language}`, code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, language, currentProblem]);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    // Flush current code to localStorage before switching
    if (currentProblem) {
      localStorage.setItem(`code_${currentProblem.id}_${language}`, code);
    }
    setLanguage(newLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const simulateTestRun = () => {
    // Simulate running tests with mock results
    return new Promise<TestCase[]>((resolve) => {
      setTimeout(() => {
        // Support both naming schemes
        const problemTests = currentProblem?.testcases || currentProblem?.testCases || [];
        const results: TestCase[] = problemTests.map((tc, idx) => ({
          ...tc,
          actualOutput: idx === 0 ? "1" : "2",
          passed: true,
          runtime: Math.floor(Math.random() * 50) + 10,
          memory: Math.floor(Math.random() * 1024) + 512,
        }));
        resolve(results);
      }, 2000);
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(undefined);
    setTestCases([]);

    try {
      const results = await simulateTestRun();
      setTestCases(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setError(undefined);
    setTestCases([]);

    try {
      const results = await simulateTestRun();
      setTestCases(results);

      const allPassed = results.every((tc) => tc.passed);
      if (allPassed) {
        toast.success("All test cases passed! Submission successful.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  if (testStatus === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600 font-medium">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (testStatus === "completed") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 font-inter">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Assessment Completed</h1>
          <p className="text-slate-600 mb-8">
            Thank you for completing the assessment. Your results have been submitted and are being reviewed.
          </p>
          <Button onClick={() => navigate("/contractor/tests")} className="w-full bg-slate-900 hover:bg-slate-900/90">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (testStatus === "error" || testStatus === "expired") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 font-inter">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {testStatus === "expired" ? "Invite Expired" : "Loading Error"}
          </h1>
          <p className="text-slate-600 mb-8">
            {testStatus === "expired"
              ? "This assessment link has expired or is no longer valid. Please contact your recruiter."
              : "We encountered a problem loading your assessment. Please try again later or contact support."}
          </p>
          <Button onClick={() => navigate("/contractor/tests")} variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (testStatus === "instructions") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] p-4 font-inter">
        <div className="max-w-[850px] w-full bg-white rounded-[24px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-[#e8eaef] overflow-hidden flex flex-col md:flex-row">

          {/* Left Side: Brand / Welcome */}
          <div className="md:w-[40%] bg-[#080b20] p-10 flex flex-col justify-between relative overflow-hidden shrink-0">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-20%] w-[250px] h-[250px] bg-gradient-to-br from-[#4DD9E8]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-gradient-to-tl from-[#0ea5e9]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10 mb-6 backdrop-blur-sm">
                <Code2 className="w-6 h-6 text-[#4DD9E8]" />
              </div>
              <h1 className="text-[28px] font-bold text-white leading-[1.2] tracking-tight mb-4">
                {metadata?.title || "Coding Assessment"}
              </h1>
              <p className="text-white/60 text-[14px] leading-relaxed">
                Demonstrate your technical skills in a secure environment. Please ensure you are in a quiet room with a stable internet connection.
              </p>
            </div>

            <div className="relative z-10 mt-12 space-y-5">
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5">
                  <Clock className="w-4 h-4 text-[#4DD9E8]" />
                </div>
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Duration</div>
                  <div className="font-medium text-[13px]">{metadata?.totalTime || 0} Minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5">
                  <Layers className="w-4 h-4 text-[#4DD9E8]" />
                </div>
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Questions</div>
                  <div className="font-medium text-[13px]">{problems.length} {problems.length === 1 ? 'Problem' : 'Problems'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-[#4DD9E8]" />
                </div>
                <div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider font-semibold mb-0.5">Proctoring</div>
                  <div className="font-medium text-[13px] text-[#4DD9E8]">Strictly Enabled</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Setup & Permissions */}
          <div className="md:w-[60%] p-10 bg-white flex flex-col justify-center">
            <h3 className="text-[20px] font-bold text-[#1a1a2e] mb-2">System Check</h3>
            <p className="text-[14px] text-slate-500 mb-8">
              Please grant the necessary permissions to begin the assessment. Your camera and screen will be monitored.
            </p>

            <div className="space-y-4 mb-8">
              <button
                className={`w-full group flex items-center justify-between p-4 rounded-xl border-[1.5px] transition-all duration-200 shadow-sm ${hasWebcamPermission
                  ? "border-[#4DD9E8]/30 bg-[#4DD9E8]/5"
                  : "border-[#e8eaef] hover:border-[#4DD9E8]/50 hover:shadow-[0_0_0_3px_rgba(77,217,232,0.12)] bg-white"
                  }`}
                onClick={async () => {
                  if (hasWebcamPermission) return;
                  try {
                    await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setHasWebcamPermission(true);
                    toast.success("Camera access granted");
                  } catch {
                    toast.error("Please grant camera access to proceed");
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${hasWebcamPermission ? "bg-[#4DD9E8] text-white" : "bg-[#f8f9fb] border border-[#e8eaef] text-slate-500 group-hover:text-[#4DD9E8]"}`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold text-[14px] ${hasWebcamPermission ? "text-[#1a1a2e]" : "text-slate-700"}`}>Camera & Mic</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">Required for verification</div>
                  </div>
                </div>
                {hasWebcamPermission ? (
                  <div className="px-3 py-1 bg-[#4DD9E8]/10 text-[#0ea5e9] text-[11px] uppercase tracking-wider font-bold rounded-full">Granted</div>
                ) : (
                  <div className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-full group-hover:bg-[#4DD9E8] group-hover:text-white transition-colors shadow-sm">Grant</div>
                )}
              </button>

              <button
                className={`w-full group flex items-center justify-between p-4 rounded-xl border-[1.5px] transition-all duration-200 shadow-sm ${isScreenSelected
                  ? "border-[#4DD9E8]/30 bg-[#4DD9E8]/5"
                  : "border-[#e8eaef] hover:border-[#4DD9E8]/50 hover:shadow-[0_0_0_3px_rgba(77,217,232,0.12)] bg-white"
                  }`}
                onClick={async () => {
                  if (isScreenSelected) return;
                  try {
                    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                    stream.getTracks().forEach(t => t.stop());
                    setIsScreenSelected(true);
                    toast.success("Screen sharing verified");
                  } catch {
                    toast.error("Please select a screen to share to proceed");
                  }
                }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${isScreenSelected ? "bg-[#4DD9E8] text-white" : "bg-[#f8f9fb] border border-[#e8eaef] text-slate-500 group-hover:text-[#4DD9E8]"}`}>
                    <Airplay className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className={`font-semibold text-[14px] ${isScreenSelected ? "text-[#1a1a2e]" : "text-slate-700"}`}>Screen Share</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">Select entire screen</div>
                  </div>
                </div>
                {isScreenSelected ? (
                  <div className="px-3 py-1 bg-[#4DD9E8]/10 text-[#0ea5e9] text-[11px] uppercase tracking-wider font-bold rounded-full">Granted</div>
                ) : (
                  <div className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[12px] font-semibold rounded-full group-hover:bg-[#4DD9E8] group-hover:text-white transition-colors shadow-sm">Grant</div>
                )}
              </button>
            </div>

            <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl mb-8">
              <h4 className="text-[#b45309] text-[13px] font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Anti-Cheat Policies
              </h4>
              <ul className="text-[12px] text-[#92400e] space-y-1.5 list-none ml-0 pl-0">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#fbbf24] mt-1.5 shrink-0" />
                  Your camera and screen will be recorded seamlessly.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#fbbf24] mt-1.5 shrink-0" />
                  Switching tabs or leaving full-screen may flag your submission.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#fbbf24] mt-1.5 shrink-0" />
                  Copying/pasting or external aids are strictly prohibited.
                </li>
              </ul>
            </div>

            <div className="mt-auto pt-2">
              <Button
                style={{
                  background: (!hasWebcamPermission || !isScreenSelected) ? "#f1f5f9" : "linear-gradient(135deg, #4DD9E8, #0ea5e9)",
                  boxShadow: (!hasWebcamPermission || !isScreenSelected) ? "none" : "0 4px 20px rgba(77,217,232,0.35)",
                  color: (!hasWebcamPermission || !isScreenSelected) ? "#94a3b8" : "white",
                  border: (!hasWebcamPermission || !isScreenSelected) ? "1px solid #e2e8f0" : "none"
                }}
                className={`w-full h-[52px] text-[15px] font-bold rounded-xl transition-all active:scale-[0.98] ${(!hasWebcamPermission || !isScreenSelected) ? "cursor-not-allowed opacity-100" : "hover:opacity-90"
                  }`}
                disabled={!hasWebcamPermission || !isScreenSelected}
                onClick={handleStartTest}
              >
                {!hasWebcamPermission || !isScreenSelected ? "Complete Setup to Start" : "Start Assessment"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure? Your progress will stay but the timer is running.")) {
                navigate("/contractor/tests");
              }
            }}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Exit
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg font-semibold truncate max-w-[200px]">{metadata?.title}</h1>

          {/* Tabs */}
          <div className="flex items-center flex-wrap mx-4 bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
            {problems.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveProblemIndex(idx)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                  activeProblemIndex === idx
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                P{idx + 1}: {p.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {metadata?.startedAt && (
            <TestTimer
              startedAt={metadata.startedAt}
              totalMinutes={metadata.totalTime}
              onTimeUp={handleEndTest}
            />
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="gap-2 bg-[#080b20] text-white hover:bg-[#080b20]/90"
            >
              <Play className="h-4 w-4" />
              Run Code
            </Button>
            <Button
              onClick={handleEndTest}
              className="gap-2 bg-red-600 hover:bg-red-700 text-white"
            >
              <Send className="h-4 w-4" />
              End Test
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentProblem && (
          <ResizablePanelGroup direction="horizontal">
            {/* Left Panel - Problem Description */}
            <ResizablePanel defaultSize={35} minSize={25}>
              <ProblemPanel problem={currentProblem} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Editor and Console */}
            <ResizablePanel defaultSize={65} minSize={40}>
              <ResizablePanelGroup direction="vertical">
                {/* Editor */}
                <ResizablePanel defaultSize={60} minSize={30}>
                  <EditorPanel
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    code={code}
                    onCodeChange={handleCodeChange}
                    starterCode={currentProblem.starterCode}
                  />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Console Output */}
                <ResizablePanel defaultSize={40} minSize={20}>
                  <ConsoleOutput
                    testCases={testCases}
                    isRunning={isRunning}
                    error={error}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      {/* Camera monitoring floating window */}
      <div
        ref={popupRef}
        className="fixed z-50 cursor-move select-none"
        style={{
          left: popupPosition.x,
          top: popupPosition.y,
          transform: isDragging ? "scale(1.02)" : "scale(1)",
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragOffset({
            x: e.clientX - popupPosition.x,
            y: e.clientY - popupPosition.y,
          });
        }}
      >
        <div className="relative rounded-lg shadow-2xl max-w-sm">
          {/* <WebcamFeed
            isInterviewActive={testStatus === "active"}
            totalViolations={totalViolations}
            sessionId={sessionId}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Play, Send, ChevronLeft, Monitor, AlertTriangle } from "lucide-react";
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
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-slate-600 font-medium">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (testStatus === "completed") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Assessment Completed</h1>
          <p className="text-slate-600 mb-8">
            Thank you for completing the assessment. Your results have been submitted and are being reviewed.
          </p>
          <Button onClick={() => navigate("/contractor/tests")} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (testStatus === "error" || testStatus === "expired") {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
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
      <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold">{metadata?.title || "Coding Assessment"}</h1>
            <p className="opacity-90">Please review the instructions before starting.</p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  Test Details
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-medium">{metadata?.totalTime} Minutes</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Questions</span>
                    <span className="font-medium">{problems.length} Coding Problems</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Monitoring</span>
                    <span className="font-medium text-green-600">Enabled</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-indigo-600" />
                  Preparation
                </h3>
                <div className="space-y-3">
                  <Button 
                    variant={hasWebcamPermission ? "outline" : "default"}
                    className={cn("w-full justify-between", hasWebcamPermission && "border-green-200 bg-green-50 text-green-700 hover:bg-green-100")}
                    onClick={async () => {
                      try {
                        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                        setHasWebcamPermission(true);
                        toast.success("Camera access granted");
                      } catch {
                        toast.error("Please grant camera access to proceed");
                      }
                    }}
                  >
                    1. Grant Camera Access
                    {hasWebcamPermission && <span className="text-xs font-bold font-mono">OK</span>}
                  </Button>
                  
                  <Button 
                    variant={isScreenSelected ? "outline" : "default"}
                    className={cn("w-full justify-between", isScreenSelected && "border-green-200 bg-green-50 text-green-700 hover:bg-green-100")}
                    onClick={async () => {
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
                    2. Select Screen Share
                    {isScreenSelected && <span className="text-xs font-bold font-mono">OK</span>}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-8">
              <h4 className="text-amber-800 font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Anti-Cheat Policies
              </h4>
              <ul className="text-sm text-amber-700 space-y-1 list-disc ml-5">
                <li>Your camera and screen will be recorded throughout the session.</li>
                <li>Switching tabs or leaving the full-screen mode may flag your submission.</li>
                <li>Copying/pasting or using external aids is strictly prohibited.</li>
              </ul>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700" 
              disabled={!hasWebcamPermission || !isScreenSelected}
              onClick={handleStartTest}
            >
              Start Your Assessment
            </Button>
            {!(!hasWebcamPermission || !isScreenSelected) && (
              <p className="text-center text-xs text-slate-500 mt-4">
                By clicking start, your camera and screen recording will begin.
              </p>
            )}
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
          <div className="flex items-center ml-4 bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
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
              variant="outline"
              onClick={handleRunCode}
              disabled={isRunning}
              className="gap-2"
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

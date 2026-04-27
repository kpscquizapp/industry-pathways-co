import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Play, Send, ChevronLeft, ChevronRight, Monitor, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { config } from "@/services/service";

/** Always returns a URL with exactly one slash between base and path */
const apiUrl = (path: string) => {
  const base = (config.baseURL as string).replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function detectMultipleMonitors(): Promise<boolean> {
  if ("getScreenDetails" in window) {
    try {
      const details = await (window as any).getScreenDetails();
      if (details.screens.length > 1) return true;
    } catch {
      /* permission denied */
    }
  }
  if ((window.screen as any).isExtended === true) return true;
  if (window.screen.availWidth - window.screen.width > 8) return true;
  return false;
}

/** Map backend difficulty string → our local Difficulty enum */
function mapDifficulty(d: string): Difficulty {
  if (d === "Easy") return Difficulty.EASY;
  if (d === "Hard") return Difficulty.HARD;
  return Difficulty.MEDIUM;
}

/** Map backend starter_code object → SupportedLanguage-keyed record */
function mapStarterCode(raw: Record<string, string>): Record<SupportedLanguage, string> {
  const fallback = "// Write your code here";
  return {
    [SupportedLanguage.JAVASCRIPT]: raw["javascript"] ?? fallback,
    [SupportedLanguage.TYPESCRIPT]: raw["typescript"] ?? fallback,
    [SupportedLanguage.PYTHON]:     raw["python"]     ?? fallback,
    [SupportedLanguage.JAVA]:       raw["java"]       ?? fallback,
    [SupportedLanguage.CPP]:        raw["cpp"]        ?? fallback,
  };
}

/** Convert backend problem (custom or standard) → CodingProblem */
function adaptProblem(p: any, index: number): CodingProblem {
  const isCustom = Boolean(p.isCustom);

  const starterCode = isCustom
    ? mapStarterCode(p.starter_code ?? {})
    : mapStarterCode(p.starterCode ?? p.starter_code ?? {});

  const testCases: TestCase[] = isCustom
    ? (p.test_cases ?? []).map((tc: any, i: number) => ({
        id: String(i),
        input: tc.input ?? "",
        expectedOutput: tc.expected_output ?? "",
      }))
    : (p.testcases ?? []).map((tc: any) => ({
        id: String(tc.id),
        input: tc.input ?? "",
        expectedOutput: tc.expectedOutput ?? tc.expected_output ?? "",
      }));

  const examples = (p.examples ?? []).map((ex: any) => ({
    input: ex.input ?? "",
    output: ex.output ?? "",
    explanation: ex.explanation,
  }));

  return {
    id: String(p.id ?? index),
    title: p.title ?? `Question ${index + 1}`,
    difficulty: mapDifficulty(p.difficulty ?? "Medium"),
    description: p.description ?? "",
    examples,
    constraints: p.constraints ?? [],
    starterCode,
    testCases,
  };
}

// ---------------------------------------------------------------------------
// Judge0 language IDs
// ---------------------------------------------------------------------------
const LANG_ID: Record<SupportedLanguage, number> = {
  [SupportedLanguage.JAVASCRIPT]: 63,
  [SupportedLanguage.TYPESCRIPT]: 74,
  [SupportedLanguage.PYTHON]:     71,
  [SupportedLanguage.JAVA]:       62,
  [SupportedLanguage.CPP]:        54,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CodingChallenge: React.FC = () => {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId?: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const testId = challengeId ? parseInt(challengeId, 10) : null;

  // Problem list state
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Editor state — keyed per problem index + language
  const [language, setLanguage] = useState<SupportedLanguage>(SupportedLanguage.JAVASCRIPT);
  const [codeByProblem, setCodeByProblem] = useState<Record<string, string>>({});

  // Console state
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Interview state
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);
  const [totalViolations, setTotalViolations] = useState(0);
  const [popupPosition, setPopupPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`).current;
  const hasMountedRef = useRef(false);
  const suppressViolationsUntilRef = useRef(0);
  const devtoolsOpenRef = useRef(false);

  // -------------------------------------------------------------------------
  // Load problems from API
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!testId) {
      setLoadError("No test ID provided in the URL.");
      setLoadingProblems(false);
      return;
    }

    const base = apiUrl(`coding/tests/${testId}/problems`);
    const url = new URL(base);
    if (token) url.searchParams.set("token", token);

    fetch(url.toString())
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? "Failed to load problems");
        return json;
      })
      .then((json) => {
        const raw: any[] = Array.isArray(json.data) ? json.data : [];
        if (raw.length === 0) throw new Error("This test has no problems configured.");
        setProblems(raw.map((p, i) => adaptProblem(p, i)));
        setLoadingProblems(false);
      })
      .catch((err: Error) => {
        setLoadError(err.message);
        setLoadingProblems(false);
      });
  }, [testId, token]);

  // -------------------------------------------------------------------------
  // Current problem helpers
  // -------------------------------------------------------------------------
  const problem = problems[currentIdx] ?? null;

  const codeKey = `${currentIdx}_${language}`;
  const code = codeByProblem[codeKey] ?? (problem?.starterCode[language] ?? "");

  const setCode = (val: string) =>
    setCodeByProblem((prev) => ({ ...prev, [codeKey]: val }));

  const handleLanguageChange = (lang: SupportedLanguage) => {
    // Persist current code before switching
    setCodeByProblem((prev) => ({ ...prev, [codeKey]: code }));
    setLanguage(lang);
  };

  // -------------------------------------------------------------------------
  // Run / Submit
  // -------------------------------------------------------------------------
  const buildHeaders = () => {
    const token = localStorage.getItem("accessToken") ?? "";
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleRunCode = async () => {
    if (!problem) return;
    setIsRunning(true);
    setError(undefined);
    setTestCases([]);

    try {
      const body: Record<string, any> = {
        problemId: problem.id,
        code,
        languageId: LANG_ID[language],
      };
      if (testId) body.testId = testId;

      const res = await fetch(apiUrl("coding/run-testcases"), {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Execution failed");

      const results: TestCase[] = (json.data?.results ?? []).map((r: any, i: number) => ({
        id: String(r.testcaseId ?? i),
        input: problem.testCases[i]?.input ?? "",
        expectedOutput: problem.testCases[i]?.expectedOutput ?? "",
        actualOutput: r.stdout ?? r.stderr ?? "",
        passed: r.pass,
        runtime: r.time ? parseFloat(r.time) * 1000 : undefined,
        memory: r.memory ?? undefined,
      }));

      setTestCases(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsRunning(true);
    setError(undefined);
    setTestCases([]);

    try {
      const body: Record<string, any> = {
        problemId: problem.id,
        code,
        languageId: LANG_ID[language],
      };
      if (testId) body.testId = testId;

      const res = await fetch(apiUrl("coding/submissions"), {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Submission failed");

      const sub = json.data;
      const results: TestCase[] = (sub?.results ?? []).map((r: any, i: number) => ({
        id: String(r.testcaseId ?? i),
        input: problem.testCases[i]?.input ?? "",
        expectedOutput: problem.testCases[i]?.expectedOutput ?? "",
        actualOutput: r.stdout ?? r.stderr ?? "",
        passed: r.pass,
        runtime: r.time ? parseFloat(r.time) * 1000 : undefined,
        memory: r.memory ?? undefined,
      }));

      setTestCases(results);

      if (sub?.status === "Accepted") {
        toast.success("✅ All test cases passed! Submission accepted.");
      } else {
        toast.error(`❌ Submission status: ${sub?.status ?? "Unknown"}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  // -------------------------------------------------------------------------
  // Violation monitoring
  // -------------------------------------------------------------------------
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
        setTotalViolations((prev) => prev + 1);
      } catch {
        toast.error("Failed to log violation");
      }
    },
    [isMonitoringActive, sessionId],
  );

  const onResize = useDebouncedCallback(() => handleViolation("Window resized"), 1000);

  const checkDevtools = useCallback(() => {
    if (!isMonitoringActive) return;
    if (document.visibilityState !== "visible") { devtoolsOpenRef.current = false; return; }
    if (!window.outerWidth || !window.outerHeight || !window.innerWidth || !window.innerHeight) {
      devtoolsOpenRef.current = false; return;
    }
    const threshold = 160;
    const isOpen = Math.abs(window.outerWidth - window.innerWidth) > threshold
      || Math.abs(window.outerHeight - window.innerHeight) > threshold;
    if (isOpen && !devtoolsOpenRef.current) {
      devtoolsOpenRef.current = true;
      handleViolation("Developer tools opened");
    } else if (!isOpen) devtoolsOpenRef.current = false;
  }, [handleViolation, isMonitoringActive]);

  useEffect(() => {
    const onVisibilityChange = () => { if (document.visibilityState === "hidden") handleViolation("Tab Switched"); };
    const onCopy = (e: ClipboardEvent) => { if (!isMonitoringActive) return; e.preventDefault(); handleViolation("Copy attempt"); };
    const onCut = (e: ClipboardEvent) => { if (!isMonitoringActive) return; e.preventDefault(); handleViolation("Cut attempt"); };
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
    if (!isMonitoringActive) { devtoolsOpenRef.current = false; return; }
    const id = window.setInterval(checkDevtools, 1000);
    checkDevtools();
    return () => window.clearInterval(id);
  }, [checkDevtools, isMonitoringActive]);

  useEffect(() => {
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
  }, [isMonitoringActive, totalViolations]);

  // Dragging
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging) setPopupPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }); };
    const onUp = () => setIsDragging(false);
    if (isDragging) { document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp); }
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [isDragging, dragOffset]);

  // -------------------------------------------------------------------------
  // Render — loading / error states
  // -------------------------------------------------------------------------
  if (loadingProblems) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  if (loadError || !problem) {
    return (
      <div className="h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Unable to load assessment</h2>
          <p className="text-sm text-gray-500">{loadError ?? "No problems found for this test."}</p>
          <Button variant="outline" onClick={() => navigate("/")} className="mt-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Go Home
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render — main IDE
  // -------------------------------------------------------------------------
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* ── Header ── */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight">{problem.title}</h1>
            {problems.length > 1 && (
              <span className="text-xs text-muted-foreground">
                Problem {currentIdx + 1} of {problems.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Problem navigator */}
          {problems.length > 1 && (
            <div className="flex items-center gap-1 mr-2">
              <Button variant="outline" size="sm" onClick={() => { setCurrentIdx((i) => i - 1); setTestCases([]); }} disabled={currentIdx === 0} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {problems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIdx(i); setTestCases([]); }}
                  className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${i === currentIdx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {i + 1}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => { setCurrentIdx((i) => i + 1); setTestCases([]); }} disabled={currentIdx === problems.length - 1} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button variant="outline" onClick={async () => {
            const hasMultipleMonitors = await detectMultipleMonitors();
            if (hasMultipleMonitors) handleViolation("Multiple monitors detected");
            setIsInterviewActive(true);
            setIsMonitoringActive(true);
            setTotalViolations(0);
          }} disabled={isInterviewActive} className="gap-2">
            <Monitor className="h-4 w-4" /> Start Test
          </Button>
          <Button variant="outline" onClick={() => { setIsInterviewActive(false); setIsMonitoringActive(false); }} disabled={!isInterviewActive} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
            <Monitor className="h-4 w-4" /> End Test
          </Button>
          <Button variant="outline" onClick={handleRunCode} disabled={isRunning} className="gap-2">
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run Code
          </Button>
          <Button onClick={handleSubmit} disabled={isRunning} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
            <Send className="h-4 w-4" /> Submit
          </Button>
        </div>
      </header>

      {/* ── Main IDE layout ── */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} minSize={25}>
            <ProblemPanel problem={problem} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={65} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={30}>
                <EditorPanel
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  code={code}
                  onCodeChange={setCode}
                  starterCode={problem.starterCode}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={40} minSize={20}>
                <ConsoleOutput testCases={testCases} isRunning={isRunning} error={error} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ── Draggable webcam popup ── */}
      {isInterviewActive && (
        <div
          ref={popupRef}
          className="fixed z-50 cursor-move select-none"
          style={{ left: popupPosition.x, top: popupPosition.y, transform: isDragging ? "scale(1.02)" : "scale(1)", transition: isDragging ? "none" : "transform 0.2s ease" }}
          onMouseDown={(e) => { setIsDragging(true); setDragOffset({ x: e.clientX - popupPosition.x, y: e.clientY - popupPosition.y }); }}
        >
          <div className="relative rounded-lg shadow-lg max-w-sm">
            <WebcamFeed isInterviewActive={isInterviewActive} totalViolations={totalViolations} sessionId={sessionId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingChallenge;

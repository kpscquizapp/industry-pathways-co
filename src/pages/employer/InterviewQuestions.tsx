import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useCreateCustomTestMutation,
  useSendInviteEmailMutation,
  useUpdateCustomTestMutation,
  useUpdateShortlistStageMutation,
  useGetCustomTestsByEmployerQuery,
  useDeleteCustomQuestionMutation,
  useGetProblemsQuery,
  useGetJobMatchesQuery,
} from "@/app/queries/aiShortlistApi";
import { useScheduleTestForCandidateMutation } from "@/app/queries/assessmentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  ChevronDown,
  Sparkles,
  Edit2,
  Trash2,
  Search,
  Bot,
  Video,
  Plus,
  X,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

type TabMode = "manual" | "ai" | "bulk";

export default function InterviewQuestions() {
  const [activeTab, setActiveTab] = useState<TabMode>("manual");
  const [searchParams] = useSearchParams();

  type Example = { input: string; output: string; explanation?: string };
  type TestCase = { input: string; expected_output: string };
  type StarterCode = {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
    c: string;
    typescript: string;
    go: string;
  };
  type Question = {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    examples: Example[];
    constraints: string[];
    test_cases: TestCase[];
    starter_code: StarterCode;
    expanded: boolean;
    role?: string;
    category?: string;
    // DB metadata (present on questions loaded from backend)
    _testId?: number;
    _testTitle?: string;
    _testStatus?: string;
    _questionIndex?: number;
  };

  const defaultStarterCode = (): StarterCode => ({
    javascript: "var solution = function() {\n    // Write your code here\n};",
    python: "def solution():\n    # Write your code here\n    pass",
    java: "class Solution {\n    // Write your code here\n}",
    cpp: "class Solution {\npublic:\n    // Write your code here\n};",
    c: "// Write your code here\nvoid solution() {\n    \n}",
    typescript: "function solution(): void {\n    // Write your code here\n};",
    go: "func solution() {\n    // Write your code here\n}",
  });

  const newQuestion = (
    id: number,
    roleValue?: string,
    categoryValue?: string,
  ): Question => ({
    id,
    title: "",
    difficulty: "Easy",
    description: "",
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [""],
    test_cases: [{ input: "", expected_output: "" }],
    starter_code: defaultStarterCode(),
    expanded: true,
    role: roleValue,
    category: categoryValue,
  });

  const role = searchParams.get("candidateRole") || "";
  const name = searchParams.get("candidateName");
  const email = searchParams.get("candidateEmail") || "";
  const category = searchParams.get("testType") || "";
  const testId = searchParams.get("testId") || "";
  const testDate = searchParams.get("testDate") || "";
  const testDuration = searchParams.get("testDuration") || "";
  const jobId = searchParams.get("jobId") || "";
  const candidateId = searchParams.get("candidateId") || "";
  const talentSource = (searchParams.get("talentSource") || "candidate") as
    | "candidate"
    | "bench";

  const [questions, setQuestions] = useState<Question[]>([
    newQuestion(1, role, category),
  ]);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const user = useSelector((state: RootState) => state.user.userDetails);
  const employerEmail = user?.email || "";

  const {
    data: employerTestData,
    isLoading: isLoadingExisting,
    refetch: refetchLibrary,
  } = useGetCustomTestsByEmployerQuery();
  const { data: problemsData, isLoading: isLoadingProblems } =
    useGetProblemsQuery(
      { employerEmail: employerEmail },
      { skip: !employerEmail },
    );
  const [deleteCustomQuestion] = useDeleteCustomQuestionMutation();

  // Fetch matches for this job to count invited candidates
  const { data: matchesData } = useGetJobMatchesQuery(
    { id: jobId },
    { skip: !jobId },
  );

  const invitedCount = React.useMemo(() => {
    if (!matchesData?.data) return 0;
    return matchesData.data.filter((m: any) => m.stage === "invited").length;
  }, [matchesData]);

  const [validationAlert, setValidationAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({ show: false, title: "", message: "" });

  const showAlert = (title: string, message: string) => {
    setValidationAlert({ show: true, title, message });
  };

  // Seed savedQuestions with questions specifically associated with this employer email
  useEffect(() => {
    if (problemsData?.success && Array.isArray(problemsData.data)) {
      console.log(
        "🔍 DEBUG: Raw problemsData from backend:",
        problemsData.data,
      );
      console.log("🔍 DEBUG: First question structure:", problemsData.data[0]);

      const loaded = (problemsData.data as any[]).map((q, i) => ({
        ...q,
        id: q.id || q.problemId || q.problem_id || Date.now() + i,
        difficulty: (q.difficulty?.charAt(0).toUpperCase() +
          q.difficulty?.slice(1)) as "Easy" | "Medium" | "Hard",
        starter_code: q.baseCode || defaultStarterCode(),
        expanded: false,
        role: q.role || role,
        category: q.category || category,
      }));

      console.log("🔍 DEBUG: Loaded questions after mapping:", loaded);
      setSavedQuestions(loaded);
    }
  }, [problemsData, role, category]);

  return (
    <div className="min-h-full bg-[#f2f5fa] font-sans">
      <div className="flex flex-1 w-full mx-auto relative items-stretch">
        {/* Left Column - Forms & Lists */}
        <div className="flex-1 flex flex-col gap-8 p-6 lg:p-8 min-w-0 max-w-[1400px] mx-auto w-full">
          {/* ═══════════════ HEADER ═══════════════ */}
          <div className="mb-2">
            <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-gray-900 leading-tight">
              Interview Questions
            </h1>
            <p className="text-gray-400 text-[15px] mt-1">
              <span className="flex items-center gap-2">
                {name
                  ? `Create technical questions for ${name}'s assessment.`
                  : "Build a reusable question bank with manual, AI-generated, and bulk-upload workflows."}
                {invitedCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#0ea5e9]/10 text-[#0ea5e9] text-[10px] font-bold">
                    {invitedCount}{" "}
                    {invitedCount === 1 ? "candidate" : "candidates"} invited
                    for this role
                  </span>
                )}
              </span>
            </p>
          </div>
          {/* Form Content based on Tab (Card) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            {/* Tabs inside Card */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setActiveTab("manual")}
                className={cn(
                  "px-5 py-2 text-sm font-semibold rounded-full transition-colors",
                  activeTab === "manual"
                    ? "bg-[#0ea5e9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={cn(
                  "px-5 py-2 text-sm font-semibold flex items-center gap-2 rounded-full transition-colors",
                  activeTab === "ai"
                    ? "bg-[#0ea5e9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                <Sparkles className="w-4 h-4" />
                AI Generate from JD
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={cn(
                  "px-5 py-2 text-sm font-semibold rounded-full transition-colors",
                  activeTab === "bulk"
                    ? "bg-[#0ea5e9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                )}
              >
                Bulk Upload
              </button>
            </div>

            {activeTab === "manual" && (
              <ManualEntryForm
                defaultRole={role}
                defaultCategory={category}
                defaultEmail={email}
                jobId={jobId}
                candidateId={candidateId}
                talentSource={talentSource}
                questions={questions}
                setQuestions={setQuestions}
                onSaved={setSavedQuestions}
                showAlert={showAlert}
                testId={testId}
                testDuration={testDuration}
                candidateName={name || "Candidate"}
              />
            )}
            {activeTab === "ai" && (
              <AIGenerateForm defaultRole={role} defaultCategory={category} />
            )}
            {activeTab === "bulk" && <BulkUploadForm />}
          </div>

          {activeTab === "manual" &&
            (isLoadingExisting ? (
              <div className="flex items-center gap-3 py-8 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-500 font-medium">
                <svg
                  className="w-5 h-5 text-blue-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Loading existing questions for this candidate...
              </div>
            ) : (
              <QuestionsList
                questions={savedQuestions}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onEdit={(q) => {
                  // Load ONLY the specific question selected into the editor with safe fallback arrays
                  const safeQ = {
                    ...q,
                    examples: q.examples || [],
                    constraints: q.constraints || [],
                    test_cases: q.test_cases || [],
                    starter_code: q.starter_code || defaultStarterCode(),
                    expanded: true,
                  };
                  setQuestions([safeQ]);
                  setActiveTab("manual");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onAdd={(q) => {
                  // Add this question to the active test with safe fallback arrays
                  // IMPORTANT: Keep the original q.id from the problem table - don't override it!
                  const safeQ = {
                    ...q,
                    examples: q.examples || [],
                    constraints: q.constraints || [],
                    test_cases: q.test_cases || [],
                    starter_code: q.starter_code || defaultStarterCode(),
                    expanded: true,
                    _isAddedFromLibrary: true,
                  };
                  setQuestions((prev) => [...prev, safeQ]);
                  setActiveTab("manual");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onDelete={async (q) => {
                  // If it's a saved question from DB, delete from backend first
                  if (
                    q._testId !== undefined &&
                    q._questionIndex !== undefined
                  ) {
                    try {
                      await deleteCustomQuestion({
                        testId: q._testId,
                        questionIndex: q._questionIndex,
                      }).unwrap();
                      // Refetch to ensure sync
                      refetchLibrary();
                    } catch (err) {
                      console.error("Failed to delete question from DB:", err);
                      showAlert(
                        "Delete Failed",
                        "Failed to delete question from library. Please try again.",
                      );
                      return;
                    }
                  }
                  // Remove from local UI state
                  setSavedQuestions((prev) =>
                    prev.filter((item) => item.id !== q.id),
                  );
                }}
              />
            ))}
          {activeTab === "ai" && <GeneratedQuestionsList />}
          {activeTab === "bulk" && (
            <ImportedQuestionsList
              questions={problemsData?.data || []}
              isLoading={isLoadingProblems}
            />
          )}
        </div>

        {/* Right Column - Preview (Sidebar) */}
        <div className="hidden lg:block w-[360px] xl:w-[420px] shrink-0 bg-white border-l border-gray-200">
          <AIInterviewPreview role={role} category={category} />
        </div>
      </div>
      <AlertDialog
        open={validationAlert.show}
        onOpenChange={(open) =>
          setValidationAlert((prev) => ({ ...prev, show: open }))
        }
      >
        <AlertDialogContent className="sm:max-w-[425px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="text-amber-500" size={24} />
              {validationAlert.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 py-4 leading-relaxed">
              {validationAlert.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all duration-300 shadow-lg">
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ManualEntryForm({
  defaultRole = "",
  defaultCategory = "",
  defaultEmail = "",
  jobId = "",
  candidateId = "",
  talentSource = "candidate",
  questions,
  setQuestions,
  onSaved,
  showAlert,
  testId,
  testDuration,
  candidateName,
}: {
  defaultRole?: string;
  defaultCategory?: string;
  defaultEmail?: string;
  jobId?: string;
  candidateId?: string;
  talentSource?: "candidate" | "bench";
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  onSaved: (qs: any[]) => void;
  showAlert: (title: string, message: string) => void;
  testId?: string;
  testDuration?: string;
  candidateName?: string;
}) {
  type Example = { input: string; output: string; explanation?: string };
  type TestCase = { input: string; expected_output: string };
  type StarterCode = {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
    c: string;
    typescript: string;
    go: string;
  };
  type Question = {
    id: number;
    title: string;
    difficulty: "Easy" | "Medium" | "Hard";
    description: string;
    examples: Example[];
    constraints: string[];
    test_cases: TestCase[];
    starter_code: StarterCode;
    expanded: boolean;
    role?: string;
    category?: string;
  };

  const defaultStarterCode = (): StarterCode => ({
    javascript: "var solution = function() {\n    // Write your code here\n};",
    python: "def solution():\n    # Write your code here\n    pass",
    java: "class Solution {\n    // Write your code here\n}",
    cpp: "class Solution {\npublic:\n    // Write your code here\n};",
    c: "// Write your code here\nvoid solution() {\n    \n}",
    typescript: "function solution(): void {\n    // Write your code here\n};",
    go: "func solution() {\n    // Write your code here\n}",
  });

  const newQuestion = (
    id: number,
    roleValue?: string,
    categoryValue?: string,
  ): Question => ({
    id,
    title: "",
    difficulty: "Easy",
    description: "",
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [""],
    test_cases: [{ input: "", expected_output: "" }],
    starter_code: defaultStarterCode(),
    expanded: true,
    role: roleValue,
    category: categoryValue,
  });

  const [activeCodeLang, setActiveCodeLang] = useState<
    Record<number, keyof StarterCode>
  >({});
  const [isSaved, setIsSaved] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [localTestId, setLocalTestId] = useState<number | null>(
    testId ? parseInt(testId) : null,
  );

  // Sync localTestId if editing an existing assessment
  useEffect(() => {
    if (questions.length > 0 && questions[0]._testId) {
      setLocalTestId(questions[0]._testId);
    } else if (questions.length === 1 && !questions[0]._testId && !testId) {
      // New fresh form, reset localTestId
      setLocalTestId(null);
    }
  }, [questions[0]?._testId, testId]);

  const [createCustomTest, { isLoading: isCreating }] =
    useCreateCustomTestMutation();
  const [updateCustomTest, { isLoading: isUpdating }] =
    useUpdateCustomTestMutation();
  const [sendInvite, { isLoading: isInviting }] = useSendInviteEmailMutation();
  const [scheduleTestForCandidate, { isLoading: isScheduling }] =
    useScheduleTestForCandidateMutation();
  const [updateShortlistStage] = useUpdateShortlistStageMutation();
  const { refetch: refetchLibrary } = useGetCustomTestsByEmployerQuery();

  const isSaving = isCreating || isUpdating;

  const addQuestion = () => {
    const id = Date.now();
    setQuestions([...questions, newQuestion(id, defaultRole, defaultCategory)]);
    setIsSaved(false);
    setInviteSent(false);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setIsSaved(false);
    setInviteSent(false);
  };

  const toggleExpand = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, expanded: !q.expanded } : q)),
    );
  };

  const updateField = (id: number, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
    setIsSaved(false);
    setInviteSent(false);
  };

  const updateExample = (
    qId: number,
    idx: number,
    field: keyof Example,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const examples = [...q.examples];
        examples[idx] = { ...examples[idx], [field]: value };
        return { ...q, examples };
      }),
    );
    setIsSaved(false);
  };

  const updateConstraint = (qId: number, idx: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const constraints = [...q.constraints];
        constraints[idx] = value;
        return { ...q, constraints };
      }),
    );
    setIsSaved(false);
  };

  const updateTestCase = (
    qId: number,
    idx: number,
    field: keyof TestCase,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const test_cases = [...q.test_cases];
        test_cases[idx] = { ...test_cases[idx], [field]: value };
        return { ...q, test_cases };
      }),
    );
    setIsSaved(false);
  };

  const updateStarterCode = (
    qId: number,
    lang: keyof StarterCode,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return { ...q, starter_code: { ...q.starter_code, [lang]: value } };
      }),
    );
    setIsSaved(false);
  };

  const removeExample = (qId: number, idx: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return { ...q, examples: q.examples.filter((_, i) => i !== idx) };
      }),
    );
    setIsSaved(false);
  };

  const removeConstraint = (qId: number, idx: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return { ...q, constraints: q.constraints.filter((_, i) => i !== idx) };
      }),
    );
    setIsSaved(false);
  };

  const removeTestCase = (qId: number, idx: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        return { ...q, test_cases: q.test_cases.filter((_, i) => i !== idx) };
      }),
    );
    setIsSaved(false);
  };

  const handleSave = async (qId: number) => {
    try {
      const q = questions.find((question) => question.id === qId);
      if (!q) return;

      if (!q.title.trim() || !q.description.trim()) {
        showAlert(
          "Incomplete Question",
          "Please provide both a title and description before saving.",
        );
        return null;
      }

      const hasInvalidExamples =
        q.examples.length > 0 &&
        q.examples.some((ex: any) => !ex.input.trim() || !ex.output.trim());
      if (hasInvalidExamples) {
        showAlert(
          "Invalid Examples",
          "Please provide both input and output for all examples, or delete empty ones.",
        );
        return null;
      }

      const hasInvalidConstraints =
        q.constraints.length > 0 &&
        q.constraints.some((c: string) => !c.trim());
      if (q.constraints.length === 0 || hasInvalidConstraints) {
        showAlert(
          "Missing Constraints",
          "Please provide valid constraints, and remove empty ones.",
        );
        return null;
      }

      const hasInvalidTestCases =
        q.test_cases.length > 0 &&
        q.test_cases.some(
          (tc: any) => !tc.input.trim() || !tc.expected_output.trim(),
        );
      if (q.test_cases.length === 0 || hasInvalidTestCases) {
        showAlert(
          "Invalid Test Cases",
          "Please provide valid input and expected output for all test cases.",
        );
        return null;
      }

      // We ONLY save this specific question, making it its own independent database record.
      const {
        expanded,
        id,
        _testId,
        _testTitle,
        _testStatus,
        _questionIndex,
        ...questionData
      } = q as any;

      let response;
      if (q._testId) {
        response = await updateCustomTest({
          id: q._testId,
          title: q.title || `${defaultRole} - Question`,
          questions: [questionData],
        }).unwrap();
      } else {
        response = await createCustomTest({
          title: q.title || `${defaultRole} - Question`,
          questions: [questionData],
          ...(defaultEmail ? { candidateEmail: defaultEmail } : {}),
        }).unwrap();
      }

      if (response.success) {
        setIsSaved(true);
        const savedTestId = response.data.id;

        // Remove the saved question from the compose form
        setQuestions(questions.filter((question) => question.id !== qId));

        // Update the global testId for the invite button
        setLocalTestId(savedTestId);

        refetchLibrary();
        return savedTestId as number;
      } else {
        showAlert(
          "Save Failed",
          response.message || "Failed to save assessment",
        );
        return null;
      }
    } catch (error: any) {
      console.error("Error saving assessment:", error);
      showAlert(
        "Network Error",
        "A network error occurred while saving. Please try again.",
      );
      return null;
    }
  };

  // Sends invite after employer manually clicks "Send Invite"
  const handleInvite = async () => {
    if (!defaultEmail) {
      showAlert(
        "Missing Email",
        "Please select a candidate with a valid email address first.",
      );
      return;
    }

    // Ensure there is at least one question
    if (questions.length === 0) {
      showAlert(
        "No Questions",
        "Please add at least one question to the assessment before sending an invite.",
      );
      return;
    }

    // Check for blank questions (missing title or description)
    const blankQuestions = questions.filter(
      (q) => !q.title.trim() || !q.description.trim(),
    );
    if (blankQuestions.length > 0) {
      showAlert(
        "Blank Questions Detected",
        "One or more question cards are incomplete. Please provide a title and description for all questions, or remove any empty cards before sending the invite.",
      );
      return;
    }

    const validQuestions = questions; // Since we now ensure all are valid above

    // Validate arrays inside questions
    for (const q of validQuestions) {
      const hasInvalidExamples =
        q.examples.length > 0 &&
        q.examples.some((ex: any) => !ex.input.trim() || !ex.output.trim());
      const hasInvalidConstraints = q.constraints.some(
        (c: string) => !c.trim(),
      );
      const hasInvalidTestCases = q.test_cases.some(
        (tc: any) => !tc.input.trim() || !tc.expected_output.trim(),
      );

      if (
        hasInvalidExamples ||
        q.constraints.length === 0 ||
        hasInvalidConstraints ||
        q.test_cases.length === 0 ||
        hasInvalidTestCases
      ) {
        showAlert(
          "Incomplete Question",
          `Please complete all fields (examples, constraints, test cases) for question: "${q.title}"`,
        );
        return;
      }
    }

    try {
      // Extract problem IDs from selected questions (from the problem table)
      const problemIds = validQuestions
        .map((q: any) => q.id)
        .filter((id: any) => id !== undefined);

      console.log("=== DEBUG scheduleTestForCandidate ===");
      console.log("validQuestions:", validQuestions);
      console.log("extracted problemIds:", problemIds);

      if (!problemIds || problemIds.length === 0) {
        showAlert(
          "No Questions Selected",
          "Please select at least one question from the saved questions library.",
        );
        return;
      }

      // Schedule the test directly (creates test in ScheduleCandidate with CodingTestProblem links)
      const schedulePayload = {
        candidateName: candidateName || "Candidate",
        candidateEmail: defaultEmail,
        candidateId: candidateId ? parseInt(candidateId) : undefined,
        candidateRole: defaultRole,
        testType: defaultCategory,
        testDuration: testDuration ? parseInt(testDuration) : 60,
        problemIds: problemIds,
      };

      console.log("schedulePayload:", schedulePayload);

      const scheduleResponse =
        await scheduleTestForCandidate(schedulePayload).unwrap();

      const inviteTestId = scheduleResponse?.data?.id;

      if (!inviteTestId) {
        showAlert(
          "Scheduling Error",
          "Failed to create the test. Please try again.",
        );
        return;
      }

      // Send invite using the scheduled test ID
      const response = await sendInvite({
        codingTestId: inviteTestId.toString(),
        candidateEmail: defaultEmail,
        expiresInHours: 48,
      }).unwrap();

      if (response.success) {
        setInviteSent(true);

        // Update shortlist stage to 'invited' if we have the necessary context
        if (jobId && candidateId) {
          try {
            await updateShortlistStage({
              jobId,
              talentId: candidateId,
              talentSource,
              stage: "invited",
            }).unwrap();
          } catch (stageErr) {
            // Non-blocking — invite is still sent even if stage update fails
            console.warn("Could not update shortlist stage:", stageErr);
          }
        }
      } else {
        showAlert("Invite Failed", response.message || "Failed to send invite");
      }
    } catch (error: any) {
      console.error("Error sending invite:", error);
      showAlert(
        "Invite Error",
        error?.data?.message ||
          "A network error occurred while sending the invite.",
      );
    }
  };

  const langs: (keyof StarterCode)[] = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "go",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="flex flex-col gap-4 md:col-span-8">
        <label className="text-sm font-semibold text-gray-700">Questions</label>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
          >
            {/* Card Header */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer"
              onClick={() => toggleExpand(q.id)}
            >
              <div className="flex items-center gap-3">
                {/* <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center">{index + 1}</span> */}
                <span className="text-sm font-semibold text-gray-700 truncate max-w-[240px]">
                  {q.title || `Add Question`}
                </span>
                {/* <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                  q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-600'
                }`}>{q.difficulty}</span> */}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuestion(q.id);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${q.expanded ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {/* Card Body */}
            {q.expanded && (
              <div className="p-4 flex flex-col gap-5">
                {/* Title + Difficulty */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Title
                    </label>
                    <input
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="e.g. Two Sum"
                      value={q.title}
                      onChange={(e) =>
                        updateField(q.id, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Difficulty
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none hover:bg-gray-100/50 transition-colors">
                          <span className="font-medium">{q.difficulty}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl shadow-2xl border-slate-100 p-2 bg-white animate-in fade-in zoom-in-95 duration-200"
                      >
                        {["Easy", "Medium", "Hard"].map((diff) => (
                          <DropdownMenuItem
                            key={diff}
                            onClick={() =>
                              updateField(q.id, "difficulty", diff)
                            }
                            className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors"
                          >
                            {diff}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                    placeholder="Describe the problem..."
                    value={q.description}
                    onChange={(e) =>
                      updateField(q.id, "description", e.target.value)
                    }
                  />
                </div>

                {/* Examples */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Examples
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateField(q.id, "examples", [
                          ...q.examples,
                          { input: "", output: "", explanation: "" },
                        ])
                      }
                      className="text-[11px] text-blue-600 font-bold flex items-center gap-1 hover:opacity-75"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  {q.examples.map((ex, ei) => (
                    <div
                      key={ei}
                      className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeExample(q.id, ei)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Input
                        </span>
                        <input
                          className="w-full p-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none"
                          placeholder="nums=[2,7], target=9"
                          value={ex.input}
                          onChange={(e) =>
                            updateExample(q.id, ei, "input", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Output
                        </span>
                        <input
                          className="w-full p-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none"
                          placeholder="[0,1]"
                          value={ex.output}
                          onChange={(e) =>
                            updateExample(q.id, ei, "output", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Explanation
                        </span>
                        <input
                          className="w-full p-2 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none"
                          placeholder="Optional..."
                          value={ex.explanation || ""}
                          onChange={(e) =>
                            updateExample(
                              q.id,
                              ei,
                              "explanation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Constraints
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateField(q.id, "constraints", [...q.constraints, ""])
                      }
                      className="text-[11px] text-blue-600 font-bold flex items-center gap-1 hover:opacity-75"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  {q.constraints.map((c, ci) => (
                    <div
                      key={ci}
                      className="flex items-center gap-2 group relative"
                    >
                      <span className="text-gray-300 text-sm font-bold">•</span>
                      <input
                        className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none"
                        placeholder="e.g. 2 <= nums.length <= 10^4"
                        value={c}
                        onChange={(e) =>
                          updateConstraint(q.id, ci, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeConstraint(q.id, ci)}
                        className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Test Cases */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                      Test Cases
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateField(q.id, "test_cases", [
                          ...q.test_cases,
                          { input: "", expected_output: "" },
                        ])
                      }
                      className="text-[11px] text-blue-600 font-bold flex items-center gap-1 hover:opacity-75"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  {q.test_cases.map((tc, ti) => (
                    <div
                      key={ti}
                      className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100 relative group"
                    >
                      <button
                        type="button"
                        onClick={() => removeTestCase(q.id, ti)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Input
                        </span>
                        <input
                          className="w-full p-2 rounded-lg border border-gray-200 text-xs font-mono text-gray-700 bg-white focus:outline-none"
                          placeholder="[2,7,11,15], 9"
                          value={tc.input}
                          onChange={(e) =>
                            updateTestCase(q.id, ti, "input", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">
                          Expected Output
                        </span>
                        <input
                          className="w-full p-2 rounded-lg border border-gray-200 text-xs font-mono text-gray-700 bg-white focus:outline-none"
                          placeholder="[0,1]"
                          value={tc.expected_output}
                          onChange={(e) =>
                            updateTestCase(
                              q.id,
                              ti,
                              "expected_output",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Starter Code */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                    Starter Code
                  </label>
                  <div className="flex gap-1 border-b border-gray-100">
                    {langs.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() =>
                          setActiveCodeLang((prev) => ({
                            ...prev,
                            [q.id]: lang,
                          }))
                        }
                        className={cn(
                          "px-3 py-1.5 text-xs font-semibold rounded-t-lg capitalize transition-all",
                          (activeCodeLang[q.id] ?? "javascript") === lang
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <textarea
                    spellCheck="false"
                    className="w-full p-4 bg-[#0f172a] text-emerald-400 rounded-b-2xl rounded-tr-2xl text-[13px] font-mono min-h-[160px] focus:outline-none leading-relaxed selection:bg-blue-600 selection:text-white resize-y"
                    value={q.starter_code[activeCodeLang[q.id] ?? "javascript"]}
                    onChange={(e) =>
                      updateStarterCode(
                        q.id,
                        activeCodeLang[q.id] ?? "javascript",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className="flex items-center justify-end pt-4 border-t border-gray-100 mt-2 gap-3">
                  {/* Status indicator inside card */}
                  {isSaved && !inviteSent && (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full animate-in fade-in duration-300">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Saved
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:bg-gray-100 rounded-xl px-5 font-medium text-sm"
                    onClick={() => removeQuestion(q.id)}
                  >
                    Cancel
                  </Button>
                  {!q._isAddedFromLibrary && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-6 h-10 font-bold disabled:opacity-50 transition-all text-sm"
                      onClick={() => handleSave(q.id)}
                      disabled={isSaving}
                    >
                      {isSaving
                        ? "Saving..."
                        : isSaved
                          ? "Resave"
                          : "Save Question"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold text-sm"
        >
          <Plus className="w-4 h-4" />
          Add another question
        </button>
      </div>
      <div className="flex flex-col gap-4 md:col-span-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Assigned role
          </label>
          <Input
            className="bg-gray-50 border-gray-200 rounded-xl h-12 text-sm font-medium text-gray-700 max-w-full truncate"
            value={defaultRole}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Category
          </label>
          <Input
            className="bg-gray-50 border-gray-200 rounded-xl h-12 text-sm font-medium text-gray-700 max-w-full truncate"
            value={defaultCategory}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Candidate email
          </label>
          <Input
            className="bg-gray-50 border-gray-200 rounded-xl h-12 text-sm font-medium text-gray-700 max-w-full truncate"
            value={defaultEmail}
            readOnly
          />
        </div>
      </div>

      {/* <div className="flex flex-col gap-2 md:col-span-12">
        <label className="text-sm font-semibold text-gray-700">Scoring focus</label>
        <Input 
          className="bg-gray-50 border-gray-200 rounded-xl h-12 text-sm font-medium text-gray-700"
          defaultValue="Architecture, problem solving, communication"
        />
      </div> */}

      <div className="md:col-span-12 flex items-center justify-between gap-3 pt-4 border-t border-gray-100 mt-2">
        {/* Status indicators */}
        <div className="flex items-center gap-2">
          {inviteSent && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full animate-in fade-in duration-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Invite sent{defaultEmail ? ` to ${defaultEmail}` : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* <Button variant="ghost" className="text-gray-500 hover:bg-gray-100 rounded-xl px-5 font-medium">Cancel</Button> */}

          {/* Step 2 — invite appears if there is at least one question */}
          {questions.length > 0 && (
            <Button
              onClick={handleInvite}
              disabled={
                isInviting || isScheduling || inviteSent || !defaultEmail
              }
              title={
                !defaultEmail
                  ? "No candidate email — go back and select a candidate first"
                  : undefined
              }
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm px-6 h-11 font-bold animate-in fade-in slide-in-from-right-4 duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isScheduling
                ? "Scheduling..."
                : isInviting
                  ? "Sending..."
                  : inviteSent
                    ? "Invite Sent ✓"
                    : "Send Invite"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AIGenerateForm({
  defaultRole = "Senior Frontend Engineer",
  defaultCategory = "System design",
}: {
  defaultRole?: string;
  defaultCategory?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Select a posted job
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700 font-medium hover:bg-gray-100 transition-colors text-left">
                <span>{defaultRole}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-slate-100 p-2 bg-white animate-in fade-in zoom-in-95 duration-200"
            >
              <DropdownMenuItem className="py-2.5 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                {defaultRole}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Questions
          </label>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-1 flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700 font-medium hover:bg-gray-100 transition-colors text-left">
                  <span>5 questions</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-slate-100 p-2 bg-white animate-in fade-in zoom-in-95 duration-200"
              >
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                  3 questions
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                  5 questions
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2.5 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                  10 questions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="rounded-xl flex items-center gap-2 text-gray-700 border-gray-200 h-[46px] font-semibold"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Regenerate
            </Button>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-gray-400" /> Advanced focus:{" "}
        <span className="font-medium text-gray-700">
          Architecture, problem solving, communication
        </span>
        <button className="text-blue-600 hover:underline ml-1 font-medium">
          Edit
        </button>
      </div>
    </div>
  );
}

function BulkUploadForm() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
          <UploadCloud className="w-6 h-6 text-teal-500" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Upload CSV or Excel file
        </h3>
        <p className="text-xs text-gray-500 max-w-xs mb-4">
          Import interview questions in bulk with prompt, category, tags,
          difficulty, and source columns. New questions will be reviewed before
          publishing to your bank.
        </p>
        <div className="flex items-center gap-2 mb-6">
          <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">
            CSV
          </span>
          <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">
            XLSX
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
            Up to 500 questions
          </span>
        </div>
        <div className="flex items-center gap-3 w-full justify-center">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-sm">
            Choose file
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 rounded-xl bg-white"
          >
            Download template
          </Button>
        </div>
      </div>

      <div className="w-full md:w-64 flex flex-col gap-4">
        <h4 className="font-semibold text-gray-900 text-sm">Import settings</h4>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">
            Question type
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none hover:bg-gray-100/50 transition-all">
                <span>Mixed types</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-slate-100 p-2 bg-white animate-in slide-in-from-top-1 duration-200">
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Mixed types
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Coding
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Behavioral
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">
            Default difficulty
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none hover:bg-gray-100/50 transition-all">
                <span>Intermediate</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-slate-100 p-2 bg-white animate-in slide-in-from-top-1 duration-200">
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Beginner
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Advanced
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">
            Duplicate handling
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none hover:bg-gray-100/50 transition-all">
                <span>Skip duplicates</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] rounded-xl shadow-2xl border-slate-100 p-2 bg-white animate-in slide-in-from-top-1 duration-200">
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Skip duplicates
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Overwrite
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-xs font-medium text-gray-700">
            Notify owner
          </label>
          <Input
            className="bg-gray-50 border-gray-200 h-9 text-sm"
            value="hiring@aaravrecruitment.com"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

function QuestionsList({
  questions,
  searchTerm,
  setSearchTerm,
  onEdit,
  onAdd,
  onDelete,
}: {
  questions: any[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onEdit: (q: any) => void;
  onAdd: (q: any) => void;
  onDelete: (q: any) => void;
}) {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [activeCodeLang, setActiveCodeLang] = React.useState<
    Record<number, string>
  >({});

  const filtered = questions.filter(
    (q) =>
      !searchTerm.trim() ||
      (q.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.category || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const langs = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "go",
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
          />
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          {questions.length} saved question{questions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400 font-medium">
          No saved questions yet. Fill in the form above and click{" "}
          <span className="text-blue-500 font-semibold">Save Question</span> to
          see them here.
        </div>
      )}

      {/* Question detail cards */}
      {filtered.map((q, index) => {
        const uniqueKey = q.id || `${q._testId}-${q._questionIndex}`;
        const isExpanded = expandedId === (q.id || q._questionIndex);
        const lang = activeCodeLang[q.id || q._questionIndex] ?? "javascript";
        const diffColor =
          q.difficulty === "Easy"
            ? "bg-emerald-100 text-emerald-700"
            : q.difficulty === "Medium"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-600";

        return (
          <div
            key={uniqueKey}
            className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden"
          >
            {/* Card Header — click to toggle */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100/60 transition-colors"
              onClick={() =>
                setExpandedId(isExpanded ? null : q.id || q._questionIndex)
              }
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-gray-800 truncate max-w-[320px]">
                    {q.title || `Question ${index + 1}`}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* {q._testTitle && (
                      <span className="text-[10px] text-gray-400 font-medium truncate">
                        Source: {q._testTitle}
                      </span>
                    )} */}
                    {q.role && (
                      <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                        {q.role}
                      </span>
                    )}
                    {q.category && (
                      <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                        {q.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${diffColor}`}
                  >
                    {q.difficulty}
                  </span>
                  {/* {q._testStatus && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight",
                        q._testStatus === "active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500",
                      )}
                    >
                      {q._testStatus}
                    </span>
                  )} */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(q);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  title="Add question to test"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(q);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="Edit question"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(q);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  title="Delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>
            </div>

            {/* Card Body */}
            {isExpanded && (
              <div className="p-5 flex flex-col gap-5">
                {/* Role & Category */}
                {(q.role || q.category) && (
                  <div className="grid grid-cols-2 gap-3">
                    {q.role && (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Assigned role
                        </label>
                        <div className="bg-gray-50 border-gray-200 rounded-xl h-12 px-3 py-2 text-sm font-medium text-gray-700 flex items-center border">
                          {q.role}
                        </div>
                      </div>
                    )}
                    {q.category && (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                          Category
                        </label>
                        <div className="bg-gray-50 border-gray-200 rounded-xl h-12 px-3 py-2 text-sm font-medium text-gray-700 flex items-center border">
                          {q.category}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {q.description && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Description
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {q.description}
                    </p>
                  </div>
                )}

                {/* Examples */}
                {q.examples?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Examples
                    </span>
                    {q.examples.map((ex: any, ei: number) => (
                      <div
                        key={ei}
                        className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">
                            Input
                          </span>
                          <p className="text-xs font-mono text-gray-700 bg-white border border-gray-200 rounded-lg p-2">
                            {ex.input || "—"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">
                            Output
                          </span>
                          <p className="text-xs font-mono text-gray-700 bg-white border border-gray-200 rounded-lg p-2">
                            {ex.output || "—"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">
                            Explanation
                          </span>
                          <p className="text-xs text-gray-600 bg-white border border-gray-200 rounded-lg p-2">
                            {ex.explanation || "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {q.constraints?.filter((c: string) => c.trim()).length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Constraints
                    </span>
                    <ul className="flex flex-col gap-1">
                      {q.constraints
                        .filter((c: string) => c.trim())
                        .map((c: string, ci: number) => (
                          <li
                            key={ci}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <span className="text-gray-300 font-bold mt-0.5">
                              •
                            </span>
                            <span className="font-mono">{c}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Test Cases */}
                {q.test_cases?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Test Cases
                    </span>
                    {q.test_cases.map((tc: any, ti: number) => (
                      <div
                        key={ti}
                        className="grid grid-cols-2 gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">
                            Input
                          </span>
                          <p className="text-xs font-mono text-gray-700 bg-white border border-gray-200 rounded-lg p-2">
                            {tc.input || "—"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-400 font-semibold uppercase">
                            Expected Output
                          </span>
                          <p className="text-xs font-mono text-gray-700 bg-white border border-gray-200 rounded-lg p-2">
                            {tc.expected_output || "—"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Starter Code */}
                {q.starter_code && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                      Starter Code
                    </span>
                    <div className="flex gap-1 border-b border-gray-100">
                      {langs.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() =>
                            setActiveCodeLang((prev) => ({
                              ...prev,
                              [q.id]: l,
                            }))
                          }
                          className={cn(
                            "px-3 py-1.5 text-xs font-semibold rounded-t-lg capitalize transition-all",
                            lang === l
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <pre className="w-full p-4 bg-[#0f172a] text-emerald-400 rounded-b-2xl rounded-tr-2xl text-[13px] font-mono overflow-x-auto leading-relaxed">
                      {q.starter_code[lang] ||
                        "// No starter code for this language"}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GeneratedQuestionsList() {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Generated Questions (5)</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 h-9 font-semibold"
          >
            Discard All
          </Button>
          <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl h-9 shadow-sm">
            Save 5 to Bank
          </Button>
        </div>
      </div>

      <QuestionCard
        text="How would you design a scalable React component system for a product with multiple hiring workflows and reusable assessment steps?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Frontend", color: "gray" },
          { label: "System design", color: "gray" },
          { label: "Advanced", color: "orange" },
        ]}
        isActive
      />
      <QuestionCard
        text="Describe your approach to state management in a complex React application. When would you choose Context API over Redux or Zustand?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Architecture", color: "gray" },
          { label: "Intermediate", color: "orange" },
        ]}
      />
      <QuestionCard
        text="When integrating a third-party assessment API, how would you handle retries, partial failures, and candidate state consistency in the hiring pipeline?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "API integration", color: "gray" },
          { label: "Problem solving", color: "gray" },
          { label: "Advanced", color: "orange" },
        ]}
      />
      <QuestionCard
        text="How do you collaborate with designers and recruiters when a hiring workflow needs quick UI changes without creating technical debt?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Collaboration", color: "gray" },
          { label: "Communication", color: "gray" },
        ]}
      />
      <QuestionCard
        text="Can you walk me through a time you identified a performance bottleneck in a front-end application and how you resolved it?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Performance", color: "gray" },
          { label: "Intermediate", color: "orange" },
        ]}
      />
    </div>
  );
}

function ImportedQuestionsList({
  questions = [],
  isLoading = false,
}: {
  questions?: any[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Questions Found
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {questions.length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Difficulty: Easy
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {questions.filter((q) => q.difficulty === "easy").length}
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Difficulty: Med/Hard
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {questions.filter((q) => q.difficulty !== "easy").length}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mt-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search imported questions..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-700"
          />
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between gap-2 pl-3 pr-2 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none hover:bg-gray-50 transition-all min-w-[140px]">
                <span>All Categories</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-2xl border-slate-100 p-2 bg-white"
            >
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem className="py-2 px-3 cursor-pointer focus:bg-blue-50 focus:text-blue-600 font-medium text-sm rounded-lg outline-none transition-colors">
                Coding
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-400">
            No custom questions found for your account.
          </p>
        </div>
      ) : (
        questions.map((q) => (
          <QuestionCard
            key={q.id}
            text={q.title}
            description={q.description}
            tags={[
              { label: "Custom", color: "teal" },
              {
                label: q.difficulty?.toUpperCase() || "EASY",
                color:
                  q.difficulty === "hard"
                    ? "red"
                    : q.difficulty === "medium"
                      ? "orange"
                      : "green",
              },
              { label: "Stored", color: "gray" },
            ]}
          />
        ))
      )}
    </div>
  );
}

function QuestionCard({
  text,
  description,
  tags,
  isActive = false,
  activeColor = "blue",
}: {
  text: string;
  description?: string;
  tags: { label: string; color: string }[];
  isActive?: boolean;
  activeColor?: "blue" | "teal";
}) {
  return (
    <div
      className={cn(
        "bg-white p-4 rounded-xl border transition-all",
        isActive
          ? activeColor === "teal"
            ? "border-teal-400 shadow-[0_0_0_1px_rgba(45,212,191,1)]"
            : "border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,1)]"
          : "border-gray-100 hover:border-gray-200 shadow-sm",
      )}
    >
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-800 leading-relaxed">
            {text}
          </p>
          {description && (
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-start gap-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-md",
              tag.color === "blue" && "bg-blue-50 text-blue-600",
              tag.color === "teal" && "bg-teal-50 text-teal-600",
              tag.color === "orange" && "bg-orange-50 text-orange-600",
              tag.color === "orange-solid" && "bg-orange-100 text-orange-700",
              tag.color === "green" && "bg-emerald-50 text-emerald-600",
              tag.color === "gray" &&
                "bg-gray-50 text-gray-600 border border-gray-100",
              tag.color === "gray-solid" && "bg-gray-100 text-gray-700",
            )}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AIInterviewPreview({
  role = "Senior Frontend Engineer",
  category = "Technical deep-dive",
}: {
  role?: string;
  category?: string;
}) {
  return (
    <div className="sticky top-[5px] flex flex-col gap-5 p-6 lg:p-8 w-full h-[calc(100vh-65px)] overflow-y-auto">
      <div className="shrink-0">
        <h2 className="text-[17px] font-bold text-gray-900">
          AI interview preview
        </h2>
        <p className="text-[13px] text-[#8c9fc4] mt-1 leading-relaxed pr-4">
          See how the selected question appears to the candidate during the AI
          interview flow.
        </p>
      </div>

      {/* Phone Mockup */}
      <div className="bg-[#1e2532] rounded-[18px] overflow-hidden flex flex-col w-full flex-1 shrink-0 min-h-[300px] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Inner Screen */}
        <div className="flex-1 flex flex-col relative h-full">
          {/* Main Content Area */}
          <div className="flex-1 p-5 flex flex-col justify-center relative">
            {/* Message Bubble Container */}
            <div className="relative z-10 flex flex-col gap-2.5 items-start w-full mt-auto mb-10">
              {/* AI Badge */}
              <div className="flex items-center gap-1.5 bg-[#2a3545] px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span className="text-[11px] font-semibold text-white tracking-wide">
                  AI interviewer
                </span>
              </div>

              {/* Question Bubble */}
              <div className="bg-white text-gray-900 p-5 rounded-[20px] text-[13.5px] leading-relaxed w-full font-medium shadow-sm">
                How would you design a scalable React component system for a
                product with multiple hiring workflows and reusable assessment
                steps? Please explain your architecture, ownership model, and
                testing strategy.
              </div>
            </div>
          </div>

          {/* Camera Preview Area */}
          <div className="h-[90px] bg-black flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold tracking-wide text-white/80">
              Candidate camera preview
            </span>
          </div>
        </div>
      </div>

      {/* Attributes Metadata Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 shadow-sm w-full shrink-0">
        <div className="flex justify-between items-start text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Assigned role</span>
          <span className="font-bold text-gray-900 text-right">{role}</span>
        </div>
        <div className="flex justify-between items-center text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Interview round</span>
          <span className="font-bold text-gray-900">{category}</span>
        </div>
        {/* <div className="flex justify-between items-center text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Test Duration</span>
          <span className="font-bold text-gray-900">
            {testDuration} minutes
          </span>
        </div> */}
      </div>
    </div>
  );
}

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
  LineChart,
  RotateCcw,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useCreateSkillTestMutation, useGetMyTestResultsQuery, useGetProblemTagsQuery } from "@/app/queries/contractorSkillTest";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
const Card = memo(({ children, className, hover }: { children: React.ReactNode; className?: string; hover?: boolean }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={hover ? () => setHov(true) : undefined}
      onMouseLeave={hover ? () => setHov(false) : undefined}
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden bg-white",
        hov ? "shadow-2xl -translate-y-1" : "shadow-sm",
        className
      )}
      style={{
        borderColor: C.border,
      }}
    >
      {children}
    </div>
  );
});

const GlassCard = memo(({ children, gradient, className }: { children: React.ReactNode; gradient: string; className?: string }) => (
  <div className={cn("relative overflow-hidden rounded-2xl p-6 text-white shadow-lg", gradient, className)}>
    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10" />
    <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5" />
    <div className="relative z-10">{children}</div>
  </div>
));

const Badge = memo(({ text, color = C.green, bg = C.greenBg }: { text: string; color?: string; bg?: string }) => (
  <span
    className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase"
    style={{ color, background: bg }}
  >
    {text}
  </span>
));

const ProgressBar = memo(({ value, color = C.accent, height = 6 }: { value: number; color?: string; height?: number }) => (
  <div className="w-full bg-slate-100 rounded-full overflow-hidden" style={{ height }}>
    <div
      className="h-full transition-all duration-1000 ease-out rounded-full"
      style={{
        width: `${value}%`,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`
      }}
    />
  </div>
));


const diffColor: Record<string, string> = { Intermediate: C.amber, Advanced: C.accent, Expert: C.purple };

const ContractorSkillTest = () => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const [mockDifficulty, setMockDifficulty] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [createSkillTest, { isLoading: isCreating }] = useCreateSkillTestMutation();
  const { data: testResultsData, isLoading: isLoadingResults } = useGetMyTestResultsQuery();
  const { data: tagsData } = useGetProblemTagsQuery();
  
  const testResults = testResultsData?.data || [];
  const availableTags = tagsData?.data || [];
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

  console.log(mockTest)

  const difficultyLevels = ["easy", "medium", "hard"];

  const startMockTest = async () => {

    if (!questionCount || !mockDifficulty || !mockTest.title || !mockTest.totalTime) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const resp = await createSkillTest(mockTest).unwrap();
      toast.success("Mock test created successfully");
      if (resp.success && resp.data?.id) {
        navigate(`/coding-challenge/${resp.data.id}`);
      }
    } catch (error) {
      toast.error("Failed to create mock test");
    }
  }

  return (
    <div className="flex flex-col gap-8 py-4 sm:px-2 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500 font-inter">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Skill Tests</h2>
        <p className="text-muted-foreground mt-2">Validate your expertise and unlock premium opportunities with our assessment system.</p>
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
              <div className="text-3xl md:text-4xl font-bold leading-none mb-1">-</div>
              <h3 className="text-base md:text-[17px] font-bold text-white mb-2 md:mb-3">Tests Completed</h3>
              <p className="text-xs md:text-sm font-medium text-white/80 leading-snug mt-2 md:mt-4">
                Number of skill assessments you have successfully attempted as part of company hiring processes.
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
              <div className="text-3xl md:text-4xl font-bold leading-none mb-1">-</div>
              <h3 className="text-base md:text-[17px] font-bold text-white mb-2 md:mb-3">Average Score</h3>
              <p className="text-xs md:text-sm font-medium text-white/80 leading-snug mt-2 md:mt-4">
                Your overall performance score calculated across all completed assessments.
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
          { k: "mock", l: "Mock Test" }
        ].map(f => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={cn(
              "px-4 md:px-6 py-2 rounded-full text-[12px] md:text-[13px] font-bold transition-all duration-300 border",
              filter === f.k
                ? "border-[#4DD9E8] bg-white text-[#0EA5E9] shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      {filter !== "mock" && (
        <div className="bg-white border border-slate-100 rounded-xl p-4 flex gap-3 md:gap-4 items-center shadow-sm relative overflow-hidden w-full lg:w-[80%] border-l-4 border-l-[#0ea5e9]">
          <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <CircleAlert size={20} className="text-[#0ea5e9]" />
          </div>
          <p className="text-[13px] md:text-sm text-slate-500 font-medium">
            Companies invite candidates to skill assessments based on AI matching scores. Completing tests helps validate your expertise and increases your chances of interview selection.
          </p>
        </div>
      )}

      {/* Tests Grid */}
      {filter !== "mock" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {/* {filtered.map(t => (...))} */}
        </div>
      )}

      {/* Mock Test UI */}
      {filter === "mock" && (
        <div className="flex flex-col gap-10 pb-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
          {/* Section 1: Start Practice Card */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold text-slate-900 px-1">Start a Practice Test</h3>
            <Card className="p-5 sm:p-7 md:p-10 border-slate-100 shadow-sm w-full">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* Left Column: Test Type & Question Count */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">Select Test Type</label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <Select
                      value={mockTest.title}
                      onValueChange={(val) => setMockTest({ ...mockTest, title: val, tags: [val] })}
                    >
                      <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:border-[#0ea5e9] dark:ring-slate-700 focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 rounded-xl capitalize shadow-none transition-all text-[14px] text-slate-500 font-bold">
                        <SelectValue placeholder="Select Test Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((tag: string) => (
                          <SelectItem key={tag} value={tag} className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">
                            {tag}
                          </SelectItem>
                        ))}
                        {availableTags.length === 0 && (
                          <SelectItem value="Mock test" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">Mock test</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">Number of Questions</label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <Select
                      value={questionCount}
                      onValueChange={(val) => {
                        setQuestionCount(val);
                        if (mockDifficulty) {
                          setMockTest(prev => ({
                            ...prev,
                            difficultyDistribution: {
                              easy: mockDifficulty === "easy" ? Number(val) : 0,
                              medium: mockDifficulty === "medium" ? Number(val) : 0,
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
                        <SelectItem value="3" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">3</SelectItem>
                        <SelectItem value="5" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">5</SelectItem>
                        <SelectItem value="10" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column: Difficulty, Duration & Start Button */}
                <div className="flex-1 flex flex-col gap-6 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">Select Difficulty Level</label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {difficultyLevels.map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setMockDifficulty(d);
                            setMockTest(prev => ({
                              ...prev,
                              difficultyDistribution: {
                                easy: d === "easy" ? (Number(questionCount) || 0) : 0,
                                medium: d === "medium" ? (Number(questionCount) || 0) : 0,
                                hard: d === "hard" ? (Number(questionCount) || 0) : 0,
                              },
                            }));
                          }}
                          className={cn(
                            "py-[11px] rounded-xl text-[14px] font-bold transition-all border capitalize",
                            mockDifficulty === d
                              ? "bg-white border-[#0ea5e9] text-[#0ea5e9] shadow-sm shadow-cyan-100 ring-1 ring-[#0ea5e9]"
                              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1 ml-1">
                      <label className="text-[13px] font-bold text-slate-500">Select Duration</label>
                      <span className="text-cyan-500">*</span>
                    </div>
                    <Select
                      value={mockTest.totalTime ? String(mockTest.totalTime) : undefined}
                      onValueChange={(val) => setMockTest({ ...mockTest, totalTime: parseInt(val) })}
                    >
                      <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:border-[#0ea5e9] dark:ring-slate-700 focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 rounded-xl capitalize shadow-none transition-all text-[14px] text-slate-500 font-bold">
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">30 mins</SelectItem>
                        <SelectItem value="60" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">60 mins</SelectItem>
                        <SelectItem value="90" className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">90 mins</SelectItem>
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
                  {isCreating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Start Mock Test"}
                  <ExternalLink size={18} />
                </button>
              </div>
            </Card>
            {/* End of section 1 */}
          </div>

          {/* Section 2: Previous Results */}
          <div className="flex flex-col gap-5 max-w-full">
            <h3 className="text-xl font-bold text-slate-900 px-1">Your Mock Test Results</h3>
            <div className="flex flex-col gap-4">
              {isLoadingResults ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                </div>
              ) : testResults.length > 0 ? (
                testResults.map((res: any, i: number) => {
                  const scoreColor = (res.score || 0) >= 80 ? "#22c55e" : (res.score || 0) >= 60 ? "#f59e0b" : "#ef4444";
                  return (
                    <Card key={i} className="p-5 md:p-6 border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-y-5 gap-x-6 transition-all hover:border-slate-200">
                      <div className="flex items-start md:items-center gap-4 sm:gap-5 flex-1 min-w-[300px]">
                        {/* Score Circle */}
                        <div
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 border-[3px]"
                          style={{ borderColor: scoreColor }}
                        >
                          <div className="text-[14px] md:text-[17px] font-black" style={{ color: scoreColor }}>
                            {res.score || 0}%
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-1.5 md:gap-1">
                          <h4 className="text-[15px] md:text-[16px] font-bold text-slate-800 leading-tight">{res.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-[11px] md:text-[12px] text-slate-500 font-medium">
                            <span className="bg-slate-50 px-2 py-0.5 rounded-md text-slate-600 font-bold border border-slate-100">
                              {Object.entries(res.difficultyDistribution || {}).find(([_, v]) => (v as any) > 0)?.[0] || "Mixed"}
                            </span>
                            <span className="text-slate-400">Completed on {res.createdAt ? new Date(res.createdAt).toLocaleDateString() : 'N/A'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                            <span className="flex items-center gap-1 font-semibold text-purple-600">
                              <WandSparkles size={12} />
                              AI Generated
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col xs:flex-row sm:flex-row items-center gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => navigate(`/contractor/tests/report?id=${res.id}`)} 
                          className="w-full sm:w-auto h-[44px] sm:h-10 px-5 rounded-lg border border-slate-200 text-slate-600 font-bold text-[13px] hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
                        >
                          <LineChart size={16} className="text-slate-400" />
                          View Insights
                        </button>
                        {/* <button className="w-full sm:w-auto h-[44px] sm:h-10 px-5 rounded-lg bg-[#0F172A] text-white font-bold text-[13px] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm">
                          <RotateCcw size={16} />
                          Retake (₹99)
                        </button> */}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No practice tests completed yet.</p>
                </div>
              )}
            </div>
          </div>
        </div >
      )}
    </div >
  );
};

export default ContractorSkillTest;

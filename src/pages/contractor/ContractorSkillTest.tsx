import React, { useState, memo } from "react";
import {
  Target,
  Award,
  Zap,
  Lock,
  Code as CodeIcon,
  Clock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

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

/* ═══════════ DATA ═══════════ */
// const TESTS = [
//   { id: 1, title: "React Advanced", category: "Frontend", difficulty: "Advanced", duration: "45 min", questions: 30, status: "available", score: null, color: C.accent },
//   { id: 2, title: "JavaScript Fundamentals", category: "Frontend", difficulty: "Intermediate", duration: "30 min", questions: 25, status: "completed", score: 88, color: C.green },
//   { id: 3, title: "QA & Testing", category: "Quality Assurance", difficulty: "Advanced", duration: "40 min", questions: 35, status: "completed", score: 92, color: C.green },
//   { id: 4, title: "SQL & Databases", category: "Backend", difficulty: "Intermediate", duration: "35 min", questions: 28, status: "available", score: null, color: C.amber },
//   { id: 5, title: "API Testing", category: "Quality Assurance", difficulty: "Advanced", duration: "50 min", questions: 32, status: "locked", score: null, color: C.textMuted },
//   { id: 6, title: "Cypress & Selenium", category: "Automation", difficulty: "Expert", duration: "60 min", questions: 40, status: "available", score: null, color: C.purple },
// ];

const diffColor: Record<string, string> = { Intermediate: C.amber, Advanced: C.accent, Expert: C.purple };

const ContractorSkillTest = () => {
  const [filter, setFilter] = useState("all");

  // const filtered = filter === "all" ? TESTS : TESTS.filter(t => t.status === filter);
  // const completedCount = TESTS.filter(t => t.status === "completed").length;
  // const avgScore = Math.round(TESTS.filter(t => t.score !== null).reduce((a, t) => a + (t.score || 0), 0) / (TESTS.filter(t => t.score !== null).length || 1));

  return (
    <div className="flex flex-col gap-8 py-4 sm:px-2 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Skill Tests</h2>
        <p className="text-muted-foreground mt-2">Validate your expertise and unlock premium opportunities with our assessment system.</p>
      </div>

      {/* KPI Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <GlassCard gradient="bg-gradient-to-br from-cyan-600 to-[#06b6d4]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-white">
              <Target size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl font-extrabold leading-none">-</div>
              <div className="text-sm font-medium text-white/80 mt-1">Tests Completed</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard gradient="bg-gradient-to-br from-emerald-600 to-[#22c55e]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner text-white">
              <Award size={28} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-3xl font-extrabold leading-none">-</div>
              <div className="text-sm font-medium text-white/80 mt-1">Average Score</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filter Section */}
      <div className="flex gap-2.5 flex-wrap">
        {[{ k: "all", l: "All Tests" }, { k: "available", l: "Available" }, { k: "completed", l: "Completed" }, { k: "locked", l: "Locked" }].map(f => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 border-2",
              filter === f.k
                ? "border-[#4DD9E8] bg-[#4DD9E8]/10 text-[#0e8a96] shadow-sm"
                : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
            )}
          >
            {f.l}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {/* {filtered.map(t => (
          <Card key={t.id} hover className="flex flex-col border-slate-100">
            <div className="p-6 md:p-8 flex-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300",
                      t.status === "locked" ? "bg-slate-50 text-slate-400" : "group-hover:scale-110"
                    )}
                    style={{
                      backgroundColor: t.status !== "locked" ? `${t.color}14` : undefined,
                      color: t.status !== "locked" ? t.color : undefined
                    }}
                  >
                    {t.status === "locked" ? <Lock size={22} /> : <CodeIcon size={22} />}
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-lg font-bold leading-tight",
                      t.status === "locked" ? "text-slate-400" : "text-slate-900"
                    )}>{t.title}</h4>
                    <p className="text-[13px] font-medium text-slate-500 mt-1">{t.category}</p>
                  </div>
                </div>
                <Badge
                  text={t.status === "completed" ? `${t.score}%` : t.status}
                  color={t.status === "completed" ? C.green : t.status === "available" ? C.accent : C.textMuted}
                  bg={t.status === "completed" ? C.greenBg : t.status === "available" ? C.accentBg : "#f8fafc"}
                />
              </div>

              <div className="flex items-center gap-4 mb-6 text-[13px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg"><Clock size={14} className="text-slate-400" /> {t.duration}</span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg"><ChevronRight size={14} className="text-slate-400" /> {t.questions} Questions</span>
                <span
                  className="px-2.5 py-1 rounded-lg border uppercase tracking-[0.5px] text-[10px] font-bold"
                  style={{ color: diffColor[t.difficulty] || C.textMuted, borderColor: `${diffColor[t.difficulty] || C.textMuted}30` }}
                >
                  {t.difficulty}
                </span>
              </div>

              {t.status === "completed" && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assessment Status</span>
                    <span className={cn(
                      "text-[13px] font-extrabold px-2 py-0.5 rounded",
                      (t.score || 0) >= 80 ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                    )}>
                      {(t.score || 0) >= 80 ? "PASS" : "RETRY"} ({(t.score || 0)}%)
                    </span>
                  </div>
                  <ProgressBar value={t.score || 0} color={(t.score || 0) >= 80 ? C.green : C.amber} height={8} />
                </div>
              )}
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <button
                disabled={t.status === "locked"}
                className={cn(
                  "w-full py-4 rounded-xl text-[13px] font-bold transition-all duration-300 border-2",
                  t.status === "locked"
                    ? "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"
                    : t.status === "completed"
                      ? "bg-white border-[#4DD9E8]/20 text-[#0e8a96] hover:bg-[#4DD9E8]/05 hover:border-[#4DD9E8]/50"
                      : "bg-gradient-to-r from-[#4DD9E8] to-[#06b6d4] border-transparent text-white shadow-lg shadow-cyan-200/50 hover:shadow-cyan-300/60 hover:-translate-y-0.5 active:translate-y-0"
                )}
              >
                {t.status === "completed" ? "Retake Assessment" : t.status === "locked" ? "Complete Prerequisites" : "Start Assessment Now"}
              </button>
            </div>
          </Card>
        ))} */}
      </div>
    </div>
  );
};

export default ContractorSkillTest;

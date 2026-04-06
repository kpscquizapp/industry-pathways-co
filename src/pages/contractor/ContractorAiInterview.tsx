import React, { useState, memo } from "react";
import { 
  Video, 
  Mic, 
  Brain, 
  Play, 
  Check, 
  Clock, 
  Target, 
  ChevronRight,
  Info,
  LineChart
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
const GlassCard = memo(({ children, className, gradient, style }: { children: React.ReactNode; className?: string; gradient?: string; style?: React.CSSProperties }) => (
  <div 
    className={cn("rounded-3xl overflow-hidden relative text-white", className)}
    style={{ background: gradient || "linear-gradient(135deg, #1e1b4b, #4338ca, #6366f1)", ...style }}
  >
    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
));

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
      style={{ borderColor: C.border }}
    >
      {children}
    </div>
  );
});

const SectionTitle = memo(({ icon: Icon, title, className }: { icon: any; title: string; className?: string }) => (
  <div className={cn("flex items-center gap-3 mb-6", className)}>
    <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400">
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
  </div>
));

const ProgressBar = memo(({ value, color = C.accent, height = 8 }: { value: number; color?: string; height?: number }) => (
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

const ProgressRing = memo(({ value, size = 100, stroke = 6, color = "rgba(255,255,255,0.7)" }: { value: number; size?: number; stroke?: number; color?: string }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="transparent" r={radius} cx={size/2} cy={size/2} />
      <circle 
        stroke={color} strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset} 
        strokeLinecap="round" fill="transparent" r={radius} cx={size/2} cy={size/2}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
    </svg>
  );
});

/* ═══════════ DATA ═══════════ */
const INTERVIEWS = [
  { id: 1, role: "Senior QA Engineer", company: "TechCorp Inc.", status: "completed", date: "Mar 22, 2026", score: 85, duration: "32 min", feedback: "Strong technical knowledge. Improve communication on edge cases." },
  { id: 2, role: "Lead QA Analyst", company: "FinServe Ltd.", status: "scheduled", date: "Mar 30, 2026", score: null, duration: "~45 min", feedback: null },
  { id: 3, role: "Automation Engineer", company: "CloudNine", status: "available", date: null, score: null, duration: "~40 min", feedback: null },
];

const TIPS = [
  { icon: Mic, title: "Clear Audio", desc: "Use headphones and a quiet room for best results.", color: C.purple, bg: C.purpleBg },
  { icon: Video, title: "Camera Ready", desc: "Good lighting and centered framing help AI analysis.", color: C.accent, bg: C.accentBg },
  { icon: Brain, title: "Think Aloud", desc: "Explain your reasoning — the AI evaluates your approach.", color: C.green, bg: C.greenBg },
];

const SKILLS = [
  { skill: "Technical Knowledge", score: 90 },
  { skill: "Problem Solving", score: 82 },
  { skill: "Communication", score: 75 },
  { skill: "Domain Expertise", score: 88 },
  { skill: "Analytical Thinking", score: 85 },
  { skill: "Adaptability", score: 78 }
];

const ContractorAiInterview = () => {
  return (
    <div className="flex flex-col gap-8 py-4 sm:px-2 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500 overflow-x-hidden">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">AI Interviews</h2>
        <p className="text-muted-foreground mt-2">Ace your interviews with our real-time AI evaluation and feedback.</p>
      </div>

      {/* Hero Card */}
      <GlassCard className="p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1">
            <div className="flex items-center gap-2 mb-4 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider uppercase opacity-90">AI-Powered System Active</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight max-w-xl">
              Practice & Ace <br className="hidden md:block" /> your interviews
            </h2>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
              Our AI conducts realistic interviews, evaluates your responses in real-time, and provides actionable feedback to sharpen your skills.
            </p>
            <button className="px-8 py-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 text-white font-bold text-sm sm:text-base flex items-center gap-3 hover:bg-white/25 transition-all duration-300 shadow-xl group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={16} fill="currentColor" />
              </div>
              Start Practice Interview
            </button>
          </div>

          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse opacity-50" />
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl flex items-center justify-center shadow-inner">
              <div className="relative">
                <ProgressRing value={85} size={140} stroke={8} color="rgba(255,255,255,0.85)" />
                <div className="absolute inset-0 flex flex-col items-center justify-center -mt-1">
                  <span className="text-4xl sm:text-5xl font-black leading-none transition-transform group-hover:scale-110 duration-500">85</span>
                  <span className="text-[10px] sm:text-xs font-bold opacity-60 tracking-wider uppercase mt-1">Avg Score</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white text-[#4338ca] px-3.5 py-1.5 rounded-xl font-black text-xs shadow-xl flex items-center gap-1.5 animate-bounce">
              <LineChart size={14} strokeWidth={3} /> Top 10%
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TIPS.map((tip, i) => (
          <Card key={i} hover className="p-5">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: tip.bg, color: tip.color }}
              >
                <tip.icon size={22} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-800 mb-1">{tip.title}</h4>
                <p className="text-[12px] text-slate-400 leading-relaxed truncate-2">{tip.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
        {/* Interviews List */}
        <Card hover className="xl:col-span-2 p-6 md:p-8 flex flex-col h-fit">
          <SectionTitle icon={Video} title="Your Interviews" />
          <div className="flex flex-col divide-y divide-slate-50">
            {INTERVIEWS.map((iv) => (
              <div key={iv.id} className="py-6 flex flex-col sm:flex-row sm:items-center gap-6 group hover:translate-x-1 transition-transform">
                <div 
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300",
                    iv.status === "completed" ? "bg-emerald-50 text-emerald-500" : 
                    iv.status === "scheduled" ? "bg-amber-50 text-amber-500" : 
                    "bg-cyan-50 text-cyan-500"
                  )}
                >
                  {iv.status === "completed" ? <Check size={28} strokeWidth={2.5} /> : 
                   iv.status === "scheduled" ? <Clock size={28} strokeWidth={2.5} /> : 
                   <Play size={28} strokeWidth={2.5} fill="currentColor" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1.5">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">{iv.role}</h4>
                    {iv.score && (
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "text-xl sm:text-2xl font-black",
                          iv.score >= 80 ? "text-emerald-500" : "text-amber-500"
                        )}>{iv.score}%</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter -mt-1">Score</span>
                      </div>
                    )}
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 flex flex-wrap items-center gap-2">
                    <span className="text-slate-900">{iv.company}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{iv.date || "Available Anytime"}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{iv.duration}</span>
                  </p>
                  {iv.feedback && (
                    <div className="mt-4 p-3.5 rounded-xl bg-slate-50 flex gap-3 border border-slate-100/50">
                      <div className="mt-0.5 text-amber-500 shrink-0"><Info size={16} /></div>
                      <p className="text-[12.5px] text-slate-600 leading-relaxed italic">"{iv.feedback}"</p>
                    </div>
                  )}
                </div>

                <button 
                  className={cn(
                    "px-6 py-3 rounded-xl text-[13px] font-bold transition-all duration-300 shrink-0 self-start sm:self-center border-2",
                    iv.status === "completed" 
                      ? "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50" 
                      : iv.status === "scheduled" 
                        ? "bg-white border-amber-100 text-amber-500 hover:bg-amber-50 hover:border-amber-200" 
                        : "bg-gradient-to-r from-cyan-400 to-cyan-500 border-transparent text-white shadow-lg shadow-cyan-200/50 hover:shadow-cyan-300/60"
                  )}
                >
                  {iv.status === "completed" ? "View Report" : iv.status === "scheduled" ? "Join Now" : "Start Now"}
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills Breakdown */}
        <Card hover className="p-6 md:p-8 flex flex-col h-fit">
          <SectionTitle icon={Target} title="Assessment Breakdown" />
          <div className="space-y-6">
            {SKILLS.map((s) => (
              <div key={s.skill} className="group">
                <div className="flex justify-between items-end mb-2.5">
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-800 uppercase tracking-tight">{s.skill}</h5>
                    <p className="text-[11px] text-slate-400 font-medium">Global average: {Math.max(s.score - 5, 0)}%</p>
                  </div>
                  <span 
                    className="text-lg font-black"
                    style={{ color: s.score >= 85 ? C.green : s.score >= 75 ? C.accent : C.amber }}
                  >
                    {s.score}%
                  </span>
                </div>
                <ProgressBar 
                  value={s.score} 
                  color={s.score >= 85 ? C.green : s.score >= 75 ? C.accent : C.amber} 
                  height={10} 
                />
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-none mb-1">
              <Info size={14} className="text-cyan-400" /> Improvement Recommendation
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed italic">
              Focus on <span className="font-bold text-slate-800">Communication</span> to reach the top 5% in your category.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContractorAiInterview;

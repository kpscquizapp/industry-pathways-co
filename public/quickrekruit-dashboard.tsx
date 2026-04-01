import { useState, useCallback, useMemo, memo, useRef } from "react";

/* ═══════════ DESIGN TOKENS ═══════════ */
const C = {
  accent: "#4DD9E8", accentDark: "#0e8a96", accentBg: "rgba(77,217,232,0.08)",
  accentBorder: "rgba(77,217,232,0.18)",
  text: "#1a1a2e", textSec: "#555", textMuted: "#999", border: "#e8eaef",
  bgInput: "#f8f9fb", bgPage: "#f5f6f8", bgCard: "#fff",
  danger: "#ef4444", dangerBg: "rgba(239,68,68,0.06)",
  green: "#22c55e", greenBg: "rgba(34,197,94,0.08)",
  purple: "#8b5cf6", purpleBg: "rgba(139,92,246,0.08)",
  amber: "#f59e0b", amberBg: "rgba(245,158,11,0.08)",
  rose: "#f43f5e", roseBg: "rgba(244,63,94,0.08)",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.08)",
};

/* ═══════════ ICONS ═══════════ */
const I = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  user: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" /></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.32 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  interview: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  test: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 14l2 2 4-4" /></svg>,
  eye: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  star: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
  loc: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  briefcase: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>,
  globe: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
  camera: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
  upload: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4DD9E8" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4DD9E8" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>,
  file: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  play: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>,
  mic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>,
  video: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>,
  lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  zap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  award: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  arrowUp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>,
  code: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  brain: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 2 3.46A4 4 0 0 1 17 16a4 4 0 0 1-5 3.87A4 4 0 0 1 7 16a4 4 0 0 1-1-6.54A4 4 0 0 1 8 6a4 4 0 0 1 4-4z" /><path d="M12 2v20" /></svg>,
};

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="11" r="5" stroke="currentColor" strokeWidth="2.2" fill="none" />
    <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" />
  </svg>
);

/* ═══════════ REUSABLE COMPONENTS ═══════════ */
const Card = memo(({ children, style, hover }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={hover ? () => setHov(true) : undefined} onMouseLeave={hover ? () => setHov(false) : undefined}
      style={{ background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, boxShadow: hov ? C.shadowLg : C.shadow, transition: "box-shadow 0.3s, transform 0.3s", transform: hov ? "translateY(-2px)" : "none", ...style }}>
      {children}
    </div>
  );
});

const GlassCard = memo(({ children, gradient, style }) => (
  <div style={{ borderRadius: 18, padding: 24, position: "relative", overflow: "hidden", background: gradient, color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", ...style }}>
    <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
    <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
    <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
  </div>
));

const SectionTitle = memo(({ icon, title, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{icon}<h3 style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{title}</h3></div>
    {action}
  </div>
));

const FormField = memo(({ label, required, children, half }) => (
  <div style={{ flex: half ? "1 1 calc(50% - 8px)" : "1 1 100%", minWidth: half ? 200 : "auto" }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{label} {required && <span style={{ color: C.accent }}>*</span>}</label>
    {children}
  </div>
));

const TextInput = memo(({ placeholder, value, onChange, type = "text", prefix }) => (
  <div style={{ display: "flex", alignItems: "center", background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 10, height: 44, padding: "0 14px", transition: "border-color 0.2s" }}
    onFocus={e => e.currentTarget.style.borderColor = C.accent} onBlur={e => e.currentTarget.style.borderColor = C.border}>
    {prefix && <span style={{ color: C.textMuted, fontSize: 14, marginRight: 6 }}>{prefix}</span>}
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14, color: C.text, fontFamily: "inherit" }} />
  </div>
));

const SelectField = memo(({ options, value, onChange }) => (
  <select value={value} onChange={onChange} style={{ width: "100%", height: 44, padding: "0 14px", background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
));

const TextArea = memo(({ placeholder, value, onChange, maxLen }) => (
  <div>
    <textarea placeholder={placeholder} value={value} onChange={onChange} rows={4} style={{ width: "100%", padding: 14, background: C.bgInput, border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, color: C.text, fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.5 }} />
    {maxLen && <div style={{ textAlign: "right", fontSize: 12, color: C.textMuted, marginTop: 4 }}>{(value || "").length} / {maxLen}</div>}
  </div>
));

const Toggle = memo(({ enabled, onToggle }) => (
  <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: enabled ? C.accent : "#ddd", transition: "background 0.2s", position: "relative", flexShrink: 0 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: enabled ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
  </div>
));

const EmptyState = memo(({ text }) => (
  <div style={{ textAlign: "center", padding: "32px 20px", color: C.textMuted, background: C.bgInput, borderRadius: 12, border: `1.5px dashed ${C.border}` }}>
    <p style={{ fontSize: 13 }}>{text}</p>
  </div>
));

const AddButton = memo(({ label }) => (
  <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: `1.5px solid ${C.accentBorder}`, background: C.accentBg, color: C.accentDark, cursor: "pointer", fontFamily: "inherit" }}>{I.plus} {label}</button>
));

const SkillChip = memo(({ label, onRemove }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.accentBg, color: C.accentDark, borderRadius: 20, padding: "5px 14px", fontSize: 13, fontWeight: 500 }}>
    {label}{onRemove && <span onClick={onRemove} style={{ cursor: "pointer", opacity: 0.5, fontSize: 15 }}>×</span>}
  </span>
));

const Badge = memo(({ text, color = C.green, bg = C.greenBg }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, background: bg }}>{text}</span>
));

const ProgressRing = memo(({ value, size = 56, stroke = 5, color = C.accent }) => {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eee" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
});

const ProgressBar = memo(({ value, color = C.accent, height = 6 }) => (
  <div style={{ width: "100%", height, borderRadius: height, background: "#eee", overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: height, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: "width 0.8s ease" }} />
  </div>
));

/* ═══════════ SIDEBAR ═══════════ */
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: I.dashboard },
  { id: "profile", label: "Profile", icon: I.user },
  { id: "skilltest", label: "Skill Tests", icon: I.code },
  { id: "aiinterview", label: "AI Interview", icon: I.video },
  { id: "settings", label: "Settings", icon: I.settings },
];

const Sidebar = memo(({ active, onNav }) => (
  <aside style={{ width: 250, background: "linear-gradient(180deg, #0a0e17 0%, #111827 50%, #0f172a 100%)", display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 24px", marginBottom: 36 }}>
      <span style={{ color: C.accent }}><LogoIcon /></span>
      <span style={{ color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>QuickRekruit</span>
    </div>
    <div style={{ padding: "0 12px", marginBottom: 8 }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", padding: "0 12px", textTransform: "uppercase" }}>Menu</p>
    </div>
    <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
      {NAV.map(item => {
        const a = active === item.id;
        return (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderRadius: 10, border: "none",
            background: a ? "linear-gradient(135deg, rgba(77,217,232,0.12), rgba(6,182,212,0.08))" : "transparent",
            color: a ? C.accent : "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: a ? 600 : 500,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: "left", width: "100%", position: "relative",
          }}>
            {a && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: 2, background: C.accent }} />}
            {item.icon} {item.label}
          </button>
        );
      })}
    </nav>
    <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 12px" }}>
      <div style={{ padding: "12px 14px", borderRadius: 12, background: "linear-gradient(135deg, rgba(77,217,232,0.06), rgba(6,182,212,0.03))", border: "1px solid rgba(77,217,232,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, rgba(77,217,232,0.2), rgba(6,182,212,0.15))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.accent }}>AT</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Arun Thampy</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>QA Engineer</div></div>
        <span style={{ cursor: "pointer", color: "rgba(255,255,255,0.25)" }}>{I.logout}</span>
      </div>
    </div>
  </aside>
));

/* ═══════════ DASHBOARD TAB ═══════════ */
const KPI = [
  { label: "Interview Invites", value: "3", icon: I.interview, gradient: "linear-gradient(135deg, #0e7490, #06b6d4)", change: "+2", sub: "this week" },
  { label: "Pending Tests", value: "1", icon: I.test, gradient: "linear-gradient(135deg, #b45309, #f59e0b)", change: "1", sub: "due soon" },
  { label: "Profile Views", value: "47", icon: I.eye, gradient: "linear-gradient(135deg, #6d28d9, #8b5cf6)", change: "+12", sub: "this month" },
  { label: "Skill Score", value: "82", icon: I.star, gradient: "linear-gradient(135deg, #15803d, #22c55e)", change: "Top", sub: "15%" },
];

const ACTIVITY = [
  { time: "2 hours ago", text: "Your profile was viewed by TechCorp Inc.", color: C.purple },
  { time: "5 hours ago", text: "New skill test invitation: React Advanced", color: C.accent },
  { time: "1 day ago", text: "AI Interview completed for Senior QA role", color: C.green },
  { time: "2 days ago", text: "Profile updated successfully", color: C.textMuted },
];

const DashboardTab = memo(({ onNav }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {KPI.map((k, i) => (
        <GlassCard key={i} gradient={k.gradient} style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>{k.icon}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 8px", borderRadius: 6, background: "rgba(255,255,255,0.15)", fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: "rgba(255,255,255,0.9)" }}>{I.arrowUp}</span>{k.change}
            </div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>{k.value}</div>
          <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 500 }}>{k.label}</div>
          <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>{k.sub}</div>
        </GlassCard>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card hover style={{ textAlign: "center", padding: "28px 24px" }}>
          <div style={{ position: "relative", width: 88, height: 88, margin: "0 auto 14px" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><ProgressRing value={72} size={88} stroke={3} /></div>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: C.bgInput, border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: 8, left: 8 }}>{I.camera}</div>
          </div>
          <p style={{ fontSize: 10, color: C.accent, fontWeight: 600, marginBottom: 10 }}>72% Complete</p>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 2 }}>Arun Thampy</h3>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 10 }}>QA</p>
          <Badge text="CONTRACT RESOURCE" />
          <div style={{ marginTop: 20, padding: "14px 0 0", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
            {[{ icon: I.clock, label: "Availability", value: "15 Days", color: C.green }, { icon: I.loc, label: "Location", value: "None", color: C.textMuted }, { icon: I.briefcase, label: "Experience", value: "11 Years", color: C.text }, { icon: I.globe, label: "English", value: "Basic", color: C.text }].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.textMuted }}>{r.icon}<span style={{ fontSize: 13, color: C.textSec }}>{r.label}</span></div>
                <span style={{ fontSize: 13, fontWeight: 600, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card hover><h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Skills & Tech</h4><SkillChip label="QA" /></Card>
        <Card hover><h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 10 }}>Certifications</h4><div style={{ display: "flex", alignItems: "center", gap: 8, color: C.textMuted, fontSize: 13 }}>🎓 No Certifications</div></Card>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[{ label: "Take Skill Test", icon: I.code, color: C.accent, tab: "skilltest" }, { label: "Start AI Interview", icon: I.video, color: C.purple, tab: "aiinterview" }, { label: "Update Profile", icon: I.user, color: C.green, tab: "profile" }].map(a => (
            <Card key={a.label} hover style={{ padding: 18, cursor: "pointer" }}>
              <div onClick={() => onNav(a.tab)} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${a.color}14`, display: "flex", alignItems: "center", justifyContent: "center", color: a.color }}>{a.icon}</div>
                <div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{a.label}</div><div style={{ fontSize: 11, color: C.textMuted }}>Quick action</div></div>
              </div>
            </Card>
          ))}
        </div>
        <Card hover><h4 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>About Candidate</h4><p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6 }}>No bio</p></Card>
        <Card hover><h4 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>Work Experience</h4><p style={{ fontSize: 14, color: C.textMuted }}>No work experience</p></Card>
        <Card hover>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Featured Projects</h4>
            <a href="#" style={{ fontSize: 13, color: C.accentDark, textDecoration: "none", fontWeight: 600 }}>View Portfolio</a>
          </div>
          <p style={{ fontSize: 14, color: C.textMuted }}>No projects yet</p>
        </Card>
        <Card hover>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 16 }}>Recent Activity</h4>
          {ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}><p style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{a.text}</p><p style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{a.time}</p></div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  </div>
));

/* ═══════════ PROFILE TAB ═══════════ */
const CONTRACTOR_OPTS = [{ value: "", label: "Select contractor type" }, { value: "fulltime", label: "Full-Time Job Seeker" }, { value: "contract", label: "Contract / Freelance" }, { value: "hybrid", label: "Hybrid Professional" }];
const AVAIL_OPTS = [{ value: "", label: "Select availability" }, { value: "immediate", label: "Immediate" }, { value: "15", label: "15 Days" }, { value: "30", label: "30 Days" }, { value: "60", label: "60 Days+" }];
const ENGLISH_OPTS = [{ value: "basic", label: "Basic" }, { value: "proficient", label: "Proficient" }, { value: "fluent", label: "Fluent" }, { value: "native", label: "Native" }];
const CURRENCY_OPTS = [{ value: "", label: "Select currency" }, { value: "USD", label: "USD - US Dollar" }, { value: "EUR", label: "EUR - Euro" }, { value: "GBP", label: "GBP - British Pound" }, { value: "INR", label: "INR - Indian Rupee" }, { value: "AED", label: "AED - UAE Dirham" }];

const ProfileTab = memo(() => {
  const [skills, setSkills] = useState(["QA"]);
  const [si, setSi] = useState("");
  const [bio, setBio] = useState("");
  const fr = useRef(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card hover><SectionTitle icon={I.camera} title="Profile Image" />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: C.bgInput, border: `3px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{I.camera}</div>
          <div>
            <button style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: C.text, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 8 }}>Upload Image</button>
            <p style={{ fontSize: 12, color: C.textMuted }}>Allowed formats: JPG, PNG, WebP. Max size: 2MB.</p>
          </div>
        </div>
      </Card>
      <Card hover><SectionTitle icon={I.file} title="Resume" />
        <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "32px 24px", textAlign: "center", background: C.bgInput, cursor: "pointer" }} onClick={() => fr.current?.click()}>
          <div style={{ color: C.textMuted, marginBottom: 8 }}>{I.upload}</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>Upload Your Resume</p>
          <p style={{ fontSize: 12, color: C.textMuted }}>Supported formats: PDF, DOCX — Maximum size: 2MB</p>
          <input ref={fr} type="file" accept=".pdf,.docx" hidden />
          <button style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: "#fff", fontSize: 13, fontWeight: 600, color: C.textSec, cursor: "pointer", fontFamily: "inherit" }}>Choose File</button>
        </div>
        <div style={{ marginTop: 16 }}><p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>Your Resumes (0)</p><EmptyState text="No resumes uploaded yet. Upload your first resume above." /></div>
      </Card>
      <Card hover><SectionTitle icon={I.user} title="Basic Information" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <FormField label="First Name" required half><TextInput placeholder="Arun" /></FormField>
          <FormField label="Last Name" required half><TextInput placeholder="Thampy" /></FormField>
          <FormField label="Email" required half><TextInput placeholder="arun@example.com" type="email" /></FormField>
          <FormField label="Primary Job Role" half><TextInput placeholder="QA Engineer" /></FormField>
          <FormField label="Mobile Number" required><TextInput placeholder="+91 9876543210" /></FormField>
        </div>
      </Card>
      <Card hover><SectionTitle icon={I.briefcase} title="Professional Details" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <FormField label="Location" half><TextInput placeholder="City, Country" /></FormField>
          <FormField label="Contractor Type" required half><SelectField options={CONTRACTOR_OPTS} /></FormField>
          <FormField label="Country" half><TextInput placeholder="India" /></FormField>
          <FormField label="City" half><TextInput placeholder="Kochi" /></FormField>
          <FormField label="Available To Join" half><SelectField options={AVAIL_OPTS} /></FormField>
          <FormField label="English Proficiency" half><SelectField options={ENGLISH_OPTS} /></FormField>
          <FormField label="Years of Experience" half><TextInput placeholder="11" type="number" /></FormField>
          <FormField label="Preferred Job Locations" half><TextInput placeholder="Remote, Dubai..." /></FormField>
          <FormField label="Currency" half><SelectField options={CURRENCY_OPTS} /></FormField>
          <FormField label="Expected Salary (Min)" required half><TextInput placeholder="0" prefix="$" /></FormField>
          <FormField label="Expected Salary (Max)" required half><TextInput placeholder="0" prefix="$" /></FormField>
          <FormField label="Hourly Rate (Min)" half><TextInput placeholder="0" prefix="$" /></FormField>
          <FormField label="Hourly Rate (Max)" half><TextInput placeholder="0" prefix="$" /></FormField>
        </div>
      </Card>
      <Card hover><SectionTitle title="Short Bio" /><TextArea placeholder="Tell employers about yourself..." value={bio} onChange={e => setBio(e.target.value)} maxLen={1000} /></Card>
      <Card hover><SectionTitle title="Skills & Tech" />
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <TextInput placeholder="Add a skill..." value={si} onChange={e => setSi(e.target.value)} />
          <button onClick={() => { if (si.trim() && !skills.includes(si.trim())) { setSkills(s => [...s, si.trim()]); setSi(""); } }} style={{ padding: "0 20px", borderRadius: 10, border: "none", background: C.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{skills.map(s => <SkillChip key={s} label={s} onRemove={() => setSkills(p => p.filter(x => x !== s))} />)}</div>
        <p style={{ fontSize: 12, color: C.textMuted }}>{skills.length} / 50 skills added</p>
      </Card>
      <Card hover><SectionTitle title="Work Experience" action={<AddButton label="Add Experience" />} /><EmptyState text='No work experience added yet.' /></Card>
      <Card hover><SectionTitle title="Projects" action={<AddButton label="Add Project" />} /><EmptyState text='No projects added yet.' /></Card>
      <Card hover><SectionTitle title="Certifications" action={<AddButton label="Add Certification" />} /><EmptyState text='No certifications added yet.' /></Card>
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button style={{ padding: "12px 32px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "#fff", fontSize: 14, fontWeight: 600, color: C.textSec, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        <button style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, #06b6d4)`, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(77,217,232,0.3)" }}>Update Profile</button>
      </div>
    </div>
  );
});

/* ═══════════ SKILL TEST TAB ═══════════ */
const TESTS = [
  { id: 1, title: "React Advanced", category: "Frontend", difficulty: "Advanced", duration: "45 min", questions: 30, status: "available", score: null, color: C.accent },
  { id: 2, title: "JavaScript Fundamentals", category: "Frontend", difficulty: "Intermediate", duration: "30 min", questions: 25, status: "completed", score: 88, color: C.green },
  { id: 3, title: "QA & Testing", category: "Quality Assurance", difficulty: "Advanced", duration: "40 min", questions: 35, status: "completed", score: 92, color: C.green },
  { id: 4, title: "SQL & Databases", category: "Backend", difficulty: "Intermediate", duration: "35 min", questions: 28, status: "available", score: null, color: C.amber },
  { id: 5, title: "API Testing", category: "Quality Assurance", difficulty: "Advanced", duration: "50 min", questions: 32, status: "locked", score: null, color: C.textMuted },
  { id: 6, title: "Cypress & Selenium", category: "Automation", difficulty: "Expert", duration: "60 min", questions: 40, status: "available", score: null, color: C.purple },
];
const diffColor = { Intermediate: C.amber, Advanced: C.accent, Expert: C.purple };

const SkillTestTab = memo(() => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? TESTS : TESTS.filter(t => t.status === filter);
  const completed = TESTS.filter(t => t.status === "completed").length;
  const avgScore = Math.round(TESTS.filter(t => t.score).reduce((a, t) => a + t.score, 0) / (TESTS.filter(t => t.score).length || 1));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <GlassCard gradient="linear-gradient(135deg, #0e7490, #06b6d4)">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.target}</div>
            <div><div style={{ fontSize: 26, fontWeight: 800 }}>{completed}/{TESTS.length}</div><div style={{ fontSize: 12, opacity: 0.7 }}>Tests Completed</div></div>
          </div>
        </GlassCard>
        <GlassCard gradient="linear-gradient(135deg, #15803d, #22c55e)">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.award}</div>
            <div><div style={{ fontSize: 26, fontWeight: 800 }}>{avgScore}%</div><div style={{ fontSize: 12, opacity: 0.7 }}>Average Score</div></div>
          </div>
        </GlassCard>
        <GlassCard gradient="linear-gradient(135deg, #6d28d9, #8b5cf6)">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>{I.zap}</div>
            <div><div style={{ fontSize: 26, fontWeight: 800 }}>Top 15%</div><div style={{ fontSize: 12, opacity: 0.7 }}>Global Ranking</div></div>
          </div>
        </GlassCard>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[{ k: "all", l: "All Tests" }, { k: "available", l: "Available" }, { k: "completed", l: "Completed" }, { k: "locked", l: "Locked" }].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{
            padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            border: filter === f.k ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`,
            background: filter === f.k ? C.accentBg : "#fff", color: filter === f.k ? C.accentDark : C.textSec, cursor: "pointer",
          }}>{f.l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {filtered.map(t => (
          <Card key={t.id} hover style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: t.status === "locked" ? "#f0f0f0" : `${t.color}14`, display: "flex", alignItems: "center", justifyContent: "center", color: t.status === "locked" ? C.textMuted : t.color }}>{t.status === "locked" ? I.lock : I.code}</div>
                  <div><h4 style={{ fontSize: 15, fontWeight: 700, color: t.status === "locked" ? C.textMuted : C.text }}>{t.title}</h4><p style={{ fontSize: 12, color: C.textMuted }}>{t.category}</p></div>
                </div>
                <Badge text={t.status === "completed" ? `${t.score}%` : t.status} color={t.status === "completed" ? C.green : t.status === "available" ? C.accent : C.textMuted} bg={t.status === "completed" ? C.greenBg : t.status === "available" ? C.accentBg : "#f0f0f0"} />
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 16, fontSize: 12, color: C.textMuted }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>{I.clock} {t.duration}</span>
                <span>{t.questions} questions</span>
                <span style={{ color: diffColor[t.difficulty] || C.textMuted, fontWeight: 600 }}>{t.difficulty}</span>
              </div>
              {t.status === "completed" && <div style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}><span style={{ color: C.textMuted }}>Score</span><span style={{ fontWeight: 700, color: t.score >= 80 ? C.green : C.amber }}>{t.score}%</span></div><ProgressBar value={t.score} color={t.score >= 80 ? C.green : C.amber} /></div>}
              <button disabled={t.status === "locked"} style={{
                width: "100%", padding: "10px 0", borderRadius: 10,
                background: t.status === "locked" ? "#eee" : t.status === "completed" ? "#fff" : `linear-gradient(135deg, ${C.accent}, #06b6d4)`,
                color: t.status === "locked" ? C.textMuted : t.status === "completed" ? C.accentDark : "#fff",
                fontSize: 13, fontWeight: 600, cursor: t.status === "locked" ? "not-allowed" : "pointer", fontFamily: "inherit",
                border: t.status === "completed" ? `1.5px solid ${C.accentBorder}` : t.status === "locked" ? "none" : "none",
                boxShadow: t.status === "available" ? "0 4px 12px rgba(77,217,232,0.25)" : "none",
              }}>{t.status === "completed" ? "Retake Test" : t.status === "locked" ? "Complete Prerequisites" : "Start Test"}</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

/* ═══════════ AI INTERVIEW TAB ═══════════ */
const INTERVIEWS = [
  { id: 1, role: "Senior QA Engineer", company: "TechCorp Inc.", status: "completed", date: "Mar 22, 2026", score: 85, duration: "32 min", feedback: "Strong technical knowledge. Improve communication on edge cases." },
  { id: 2, role: "Lead QA Analyst", company: "FinServe Ltd.", status: "scheduled", date: "Mar 30, 2026", score: null, duration: "~45 min", feedback: null },
  { id: 3, role: "Automation Engineer", company: "CloudNine", status: "available", date: null, score: null, duration: "~40 min", feedback: null },
];
const TIPS = [
  { icon: I.mic, title: "Clear Audio", desc: "Use headphones and a quiet room for best results." },
  { icon: I.video, title: "Camera Ready", desc: "Good lighting and centered framing help AI analysis." },
  { icon: I.brain, title: "Think Aloud", desc: "Explain your reasoning — the AI evaluates your approach." },
];

const AIInterviewTab = memo(() => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
    <GlassCard gradient="linear-gradient(135deg, #1e1b4b, #4338ca, #6366f1)" style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.8 }}>AI-Powered Interview System</span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>Practice & ace your interviews</h2>
          <p style={{ fontSize: 14, opacity: 0.65, maxWidth: 480, lineHeight: 1.6 }}>Our AI conducts realistic interviews, evaluates your responses in real-time, and provides actionable feedback to sharpen your skills.</p>
          <button style={{ marginTop: 20, padding: "12px 28px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>{I.play} Start Practice Interview</button>
        </div>
        <div style={{ width: 140, height: 140, borderRadius: 24, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <ProgressRing value={85} size={100} stroke={6} color="rgba(255,255,255,0.7)" />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 24, fontWeight: 800 }}>85</span><span style={{ fontSize: 10, opacity: 0.6 }}>Avg Score</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      {TIPS.map((tip, i) => (
        <Card key={i} hover style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.purpleBg, display: "flex", alignItems: "center", justifyContent: "center", color: C.purple, flexShrink: 0 }}>{tip.icon}</div>
            <div><h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 2 }}>{tip.title}</h4><p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>{tip.desc}</p></div>
          </div>
        </Card>
      ))}
    </div>
    <Card hover>
      <SectionTitle icon={I.video} title="Your Interviews" />
      {INTERVIEWS.map((iv, i) => (
        <div key={iv.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 0", borderBottom: i < INTERVIEWS.length - 1 ? `1px solid ${C.border}` : "none" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: iv.status === "completed" ? C.greenBg : iv.status === "scheduled" ? C.amberBg : C.accentBg, display: "flex", alignItems: "center", justifyContent: "center", color: iv.status === "completed" ? C.green : iv.status === "scheduled" ? C.amber : C.accent, flexShrink: 0 }}>
            {iv.status === "completed" ? I.check : iv.status === "scheduled" ? I.clock : I.play}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{iv.role}</h4>
            <p style={{ fontSize: 12, color: C.textMuted }}>{iv.company} • {iv.date || "Anytime"} • {iv.duration}</p>
            {iv.feedback && <p style={{ fontSize: 12, color: C.textSec, marginTop: 6, padding: "6px 10px", background: C.bgInput, borderRadius: 6, lineHeight: 1.4 }}>💡 {iv.feedback}</p>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {iv.score && <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 800, color: iv.score >= 80 ? C.green : C.amber }}>{iv.score}%</div><div style={{ fontSize: 10, color: C.textMuted }}>Score</div></div>}
            <button style={{
              padding: "8px 20px", borderRadius: 8,
              background: iv.status === "completed" ? "#fff" : iv.status === "scheduled" ? C.amberBg : `linear-gradient(135deg, ${C.accent}, #06b6d4)`,
              color: iv.status === "completed" ? C.textSec : iv.status === "scheduled" ? C.amber : "#fff",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: iv.status !== "available" ? `1.5px solid ${iv.status === "completed" ? C.border : "rgba(245,158,11,0.3)"}` : "none",
            }}>{iv.status === "completed" ? "View Report" : iv.status === "scheduled" ? "Join" : "Start Now"}</button>
          </div>
        </div>
      ))}
    </Card>
    <Card hover>
      <SectionTitle icon={I.target} title="Skills Assessment Breakdown" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {[{ skill: "Technical Knowledge", score: 90 }, { skill: "Problem Solving", score: 82 }, { skill: "Communication", score: 75 }, { skill: "Domain Expertise", score: 88 }, { skill: "Analytical Thinking", score: 85 }, { skill: "Adaptability", score: 78 }].map(s => (
          <div key={s.skill}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{s.skill}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.score >= 85 ? C.green : s.score >= 75 ? C.accent : C.amber }}>{s.score}%</span>
            </div>
            <ProgressBar value={s.score} color={s.score >= 85 ? C.green : s.score >= 75 ? C.accent : C.amber} height={8} />
          </div>
        ))}
      </div>
    </Card>
  </div>
));

/* ═══════════ SETTINGS TAB ═══════════ */
const SettingsTab = memo(() => {
  const [notifs, setNotifs] = useState({ jobAlerts: true, interviews: true, push: false, marketing: false });
  const [vis, setVis] = useState({ employers: true, contact: false });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Card hover><SectionTitle icon={I.shield} title="Account Security" />
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Manage your password and security settings</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
          <FormField label="Current Password"><TextInput type="password" placeholder="Enter current password" /></FormField>
          <FormField label="New Password"><TextInput type="password" placeholder="Enter new password" /></FormField>
          <FormField label="Confirm Password"><TextInput type="password" placeholder="Confirm new password" /></FormField>
          <button style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: C.text, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-start" }}>Update Password</button>
        </div>
      </Card>
      <Card hover><SectionTitle icon={I.bell} title="Notifications" />
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Configure how you receive notifications</p>
        {[{ k: "jobAlerts", l: "Job Alert Emails", d: "Receive emails for new job matches" }, { k: "interviews", l: "Interview Notifications", d: "Get notified about interview updates" }, { k: "push", l: "Push Notifications", d: "Browser push notifications" }, { k: "marketing", l: "Marketing Emails", d: "Receive tips and product updates" }].map((n, i) => (
          <div key={n.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{n.l}</div><div style={{ fontSize: 12, color: C.textMuted }}>{n.d}</div></div>
            <Toggle enabled={notifs[n.k]} onToggle={() => setNotifs(p => ({ ...p, [n.k]: !p[n.k] }))} />
          </div>
        ))}
      </Card>
      <Card hover><SectionTitle icon={I.eye} title="Profile Visibility" />
        <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>Control who can see your profile</p>
        {[{ k: "employers", l: "Visible to Employers", d: "Allow employers to find your profile" }, { k: "contact", l: "Show Contact Info", d: "Display email and phone to matched employers" }].map((v, i) => (
          <div key={v.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < 1 ? `1px solid ${C.border}` : "none" }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{v.l}</div><div style={{ fontSize: 12, color: C.textMuted }}>{v.d}</div></div>
            <Toggle enabled={vis[v.k]} onToggle={() => setVis(p => ({ ...p, [v.k]: !p[v.k] }))} />
          </div>
        ))}
      </Card>
      <Card style={{ border: `1px solid rgba(239,68,68,0.2)`, background: C.dangerBg }}>
        <SectionTitle icon={I.trash} title="Danger Zone" />
        <p style={{ fontSize: 13, color: C.textSec, marginBottom: 16 }}>Irreversible actions for your account</p>
        <button style={{ padding: "10px 24px", borderRadius: 8, border: `1.5px solid ${C.danger}`, background: "transparent", color: C.danger, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Delete Account</button>
      </Card>
    </div>
  );
});

/* ═══════════ MAIN ═══════════ */
export default function QuickRekruitDashboard() {
  const [tab, setTab] = useState("dashboard");
  const titles = { dashboard: "Dashboard", profile: "Update Profile", skilltest: "Skill Tests", aiinterview: "AI Interview", settings: "Settings" };
  const subs = { dashboard: "Welcome back, Arun. Here's your activity overview.", profile: "Keep your profile up to date to get the best matches.", skilltest: "Validate your expertise and unlock opportunities.", aiinterview: "Practice with AI and ace your next interview.", settings: "Manage your account preferences and security." };
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: C.bgPage }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #aab0be; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(77,217,232,0.25); border-radius: 4px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <Sidebar active={tab} onNav={setTab} />
      <main style={{ flex: 1, padding: "28px 36px", overflowY: "auto" }}>
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-0.02em", marginBottom: 2 }}>{titles[tab]}</h1>
            <p style={{ fontSize: 14, color: C.textMuted }}>{subs[tab]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.bgInput, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.textMuted }}>{I.bell}</div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${C.accentBg}, rgba(6,182,212,0.08))`, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.accentDark, cursor: "pointer" }}>AT</div>
          </div>
        </div>
        <div key={tab} style={{ animation: "fadeIn 0.35s ease" }}>
          {tab === "dashboard" && <DashboardTab onNav={setTab} />}
          {tab === "profile" && <ProfileTab />}
          {tab === "skilltest" && <SkillTestTab />}
          {tab === "aiinterview" && <AIInterviewTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

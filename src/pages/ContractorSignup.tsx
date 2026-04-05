import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
  type FC,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCheckExistingEmailMutation,
  useCreateCandidateMutation,
  useSendVerificationOtpMutation,
  useVerifyOtpMutation,
} from "@/app/queries/loginApi";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";
import logo from "@/assets/White Option.png";
import logo2 from "@/assets/Dark Option.png";
import { toast } from "sonner";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { Briefcase, Clock, Lock, Mail, Phone, Star, User } from "lucide-react";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ═══════════ TYPES ═══════════ */
interface StepConfig {
  id: number;
  label: string;
  title: string;
  subtitle: string;
}

interface SelectOption {
  value: string;
  label: string;
}

interface InputProps {
  label: string;
  icon: ReactNode;
  required?: boolean;
  placeholder?: string;
  type?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  suffix?: ReactNode;
  error?: string;
  min?: number;
  max?: number;
  maxLength?: number;
}

interface SelectProps {
  label: string;
  icon: ReactNode;
  required?: boolean;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

interface ChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
  required?: boolean;
  error?: string;
}

interface SkillTagsProps {
  skills: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
  error?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  contractorType: string;
  yearsExperience: number | null;
  primaryJobRole: string;
  availableToJoin: string;
}

/* ═══════════ VALIDATION ═══════════ */
const VALIDATION = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    validate: (email: string) => {
      if (!email) return "Email is required";
      if (email.length > 254) return "Email must be less than 254 characters";
      if (!VALIDATION.email.regex.test(email))
        return "Please enter a valid email address (e.g., name@company.com)";
      return null;
    },
  },
  password: {
    minLength: 8,
    maxLength: 128,
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    validate: (password: string) => {
      if (!password) return "Password is required";
      if (password.length < 8)
        return "Password must be at least 8 characters long";
      if (password.length > 128)
        return "Password must be less than 128 characters";
      if (!/[a-z]/.test(password))
        return "Password must contain at least one lowercase letter";
      if (!/[A-Z]/.test(password))
        return "Password must contain at least one uppercase letter";
      if (!/\d/.test(password))
        return "Password must contain at least one number";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        return "Password must contain at least one special character";
      return null;
    },
  },
  phone: {
    regex: /^\+?[1-9]\d{6,14}$/,
    validate: (phone: string) => {
      if (!phone) return "Mobile number is required";
      const cleaned = phone.replace(/[\s\-()]/g, "");
      if (!VALIDATION.phone.regex.test(cleaned)) {
        return "Please enter a valid mobile number (e.g., +14155551234 or +919876543210)";
      }
      return null;
    },
  },
  name: {
    minLength: 1,
    maxLength: 50,
    regex: /^[\p{L}\s\-']+$/u,
    validate: (name: string, fieldName: string) => {
      if (!name || !name.trim()) return `${fieldName} is required`;
      if (name.trim().length > 50)
        return `${fieldName} must be less than 50 characters`;
      if (!VALIDATION.name.regex.test(name)) {
        return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
      }
      return null;
    },
  },
  skills: {
    minCount: 1,
    maxCount: 20,
    maxLength: 50,
    validate: (skills: string[]) => {
      if (skills.length === 0) return "Please add at least one skill";
      if (skills.length > 20) return "You can add a maximum of 20 skills";
      const invalidSkill = skills.find((s) => s.length > 50);
      if (invalidSkill) return "Each skill must be less than 50 characters";
      return null;
    },
  },
  experience: {
    min: 0,
    max: 70,
    validate: (years: number | null) => {
      if (years === null || years === undefined)
        return "Years of experience is required";
      if (!Number.isInteger(years))
        return "Years of experience must be a whole number";
      if (years < 0) return "Years of experience cannot be negative";
      if (years > 70) return "Years of experience must be less than 70";
      return null;
    },
  },
  salary: {
    min: 0,
    max: 10000000,
    validate: (min: number | null, max: number | null) => {
      if (min === null || min === undefined)
        return "Minimum salary is required";
      if (max === null || max === undefined)
        return "Maximum salary is required";
      if (isNaN(min) || isNaN(max)) return "Please enter valid salary amounts";
      if (min < 0 || max < 0) return "Salary cannot be negative";
      if (min > 10000000 || max > 10000000)
        return "Salary exceeds reasonable limit ($10,000,000)";
      if (min > max) return "Minimum salary cannot exceed maximum salary";
      return null;
    },
  },
};

/* ═══════════ CONSTANTS ═══════════ */
const ACCENT = "#4DD9E8";
const ACCENT_DARK = "#0e8a96";
const TEXT_PRIMARY = "#1a1a2e";
const TEXT_MUTED = "#999";
const TEXT_SECONDARY = "#555";
const BORDER = "#e8eaef";
const BORDER_ERROR = "#ef4444";
const BG_INPUT = "#f8f9fb";
const FOCUS_SHADOW = `0 0 0 3px rgba(77,217,232,0.12)`;
const ERROR_SHADOW = `0 0 0 3px rgba(239,68,68,0.10)`;

const STEPS: StepConfig[] = [
  {
    id: 1,
    label: "ACCOUNT",
    title: "Contractor Signup",
    subtitle: "Start your journey as an elite contractor.",
  },
  {
    id: 2,
    label: "PROFILE",
    title: "Professional Profile",
    subtitle: "Tell us about your skills and experience.",
  },
  {
    id: 3,
    label: "PREFERENCES",
    title: "Career Preferences",
    subtitle: "Finalize your settings and join the ecosystem.",
  },
];

const VALUE_PROPS = [
  "Access to top-tier opportunities",
  "Build your professional network",
  "Streamlined hiring process",
];

const CONTRACTOR_TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "Select contractor type" },
  { value: "Full-Time Job Seeker", label: "Full-Time Job Seeker" },
  { value: "Contract / Freelancer", label: "Contract / Freelancer" },
  { value: "Hybrid Professional", label: "Hybrid Professional" },
];

const AVAILABILITY_OPTIONS: SelectOption[] = [
  { value: "", label: "Select availability" },
  { value: "Immediate", label: "Immediate / Serving Notice" },
  { value: "15 Days", label: "15 Days" },
  { value: "30 Days", label: "30 Days" },
  { value: "60 Days+", label: "60 Days+" },
];

const WORK_TYPES = ["Remote", "Hybrid", "Onsite"];

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  password: "",
  confirmPassword: "",
  contractorType: "",
  yearsExperience: null,
  primaryJobRole: "",
  availableToJoin: "",
};

/* ═══════════ SHARED STYLES ═══════════ */
const S = {
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: TEXT_PRIMARY,
    letterSpacing: "0.02em",
  } as CSSProperties,
  asterisk: { color: ACCENT } as CSSProperties,
  fieldWrap: (hasError?: boolean): CSSProperties => ({
    display: "flex",
    alignItems: "center",
    minWidth: 0,
    gap: 10,
    background: BG_INPUT,
    border: `1.5px solid ${hasError ? BORDER_ERROR : BORDER}`,
    borderRadius: 10,
    padding: "0 14px",
    height: 46,
    transition: "border-color 0.2s, box-shadow 0.2s",
  }),
  inputBase: {
    flex: 1,
    minWidth: 0,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 14,
    color: TEXT_PRIMARY,
    fontFamily: "inherit",
  } as CSSProperties,
  column: (gap: number) =>
    ({
      display: "flex",
      flexDirection: "column",
      gap,
      minWidth: 0,
    }) as CSSProperties,
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  } as CSSProperties,
  errorText: {
    fontSize: 12,
    color: BORDER_ERROR,
    marginTop: 2,
  } as CSSProperties,
};

const handleFocus = (e: React.FocusEvent<HTMLElement>, hasError?: boolean) => {
  e.currentTarget.style.borderColor = hasError ? BORDER_ERROR : ACCENT;
  e.currentTarget.style.boxShadow = hasError ? ERROR_SHADOW : FOCUS_SHADOW;
};

const handleBlur = (e: React.FocusEvent<HTMLElement>, hasError?: boolean) => {
  e.currentTarget.style.borderColor = hasError ? BORDER_ERROR : BORDER;
  e.currentTarget.style.boxShadow = "none";
};

/* ═══════════ ICONS ═══════════ */
const Icon: FC<{
  d: string;
  size?: number;
  stroke?: string;
  extra?: ReactNode;
}> = memo(({ d, size = 16, stroke = "#aaa", extra }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
  >
    <path d={d} />
    {extra}
  </svg>
));

const LogoIcon: FC = memo(() => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle
      cx="16"
      cy="11"
      r="5"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="none"
    />
    <path
      d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10"
      stroke="currentColor"
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
));

const CheckIcon: FC = memo(() => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8.5L6.5 12L13 4"
      stroke={ACCENT}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

const EyeIcon: FC<{ open: boolean }> = memo(({ open }) =>
  open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#999"
      strokeWidth="1.8"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#999"
      strokeWidth="1.8"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
);

const UserIcon = <User style={{ width: 16, height: 16, color: "gray" }} />;
const MailIcon = <Mail style={{ width: 16, height: 16, color: "gray" }} />;
const PhoneIcon = <Phone style={{ width: 16, height: 16, color: "gray" }} />;
const LockIcon = <Lock style={{ width: 16, height: 16, color: "gray" }} />;
const BriefcaseIcon = (
  <Briefcase style={{ width: 16, height: 16, color: "gray" }} />
);
const ClockIcon = <Clock style={{ width: 16, height: 16, color: "gray" }} />;
const StarIcon = <Star style={{ width: 16, height: 16, color: "gray" }} />;

/* ═══════════ FORM COMPONENTS ═══════════ */
const FormLabel: FC<{ text: string; required?: boolean; hint?: string }> = memo(
  ({ text, required, hint }) => (
    <label style={S.label}>
      {text} {required && <span style={S.asterisk}>*</span>}
      {hint && (
        <span
          style={{
            fontWeight: 400,
            color: TEXT_MUTED,
            marginLeft: 6,
            fontSize: 12,
          }}
        >
          {hint}
        </span>
      )}
    </label>
  ),
);

const FieldError: FC<{ error?: string }> = memo(({ error }) =>
  error ? <p style={S.errorText}>{error}</p> : null,
);

const Input: FC<InputProps> = memo(
  ({ label, icon, required, suffix, error, ...props }) => (
    <div style={S.column(6)}>
      <FormLabel text={label} required={required} />
      <div
        style={S.fieldWrap(!!error)}
        onFocus={(e) => handleFocus(e, !!error)}
        onBlur={(e) => handleBlur(e, !!error)}
      >
        {icon}
        <input {...props} style={S.inputBase} />
        {suffix}
      </div>
      <FieldError error={error} />
    </div>
  ),
);

const PasswordInput: FC<{
  label: string;
  placeholder: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  onToggle: () => void;
  error?: string;
}> = memo(
  ({ label, placeholder, name, value, onChange, show, onToggle, error }) => (
    <Input
      label={label}
      required
      name={name}
      icon={LockIcon}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      suffix={
        <span style={{ cursor: "pointer", display: "flex" }} onClick={onToggle}>
          <EyeIcon open={show} />
        </span>
      }
    />
  ),
);

const Select: FC<SelectProps> = memo(
  ({ label, icon, required, options, value = "", onChange, error }) => {
    const placeholder =
      options.find((option) => option.value === "")?.label ??
      "Select an option";
    const selectOptions = options.filter((option) => option.value !== "");
    const hasValue = value.trim().length > 0;

    return (
      <div style={S.column(6)}>
        <FormLabel text={label} required={required} />
        <UiSelect value={hasValue ? value : undefined} onValueChange={onChange}>
          <SelectTrigger
            aria-label={label}
            aria-invalid={!!error}
            className="w-full border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0 focus:ring-offset-0 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-[#8c97aa] [&>svg]:opacity-100 text-left"
            style={{
              ...S.fieldWrap(!!error),
              width: "100%",
              cursor: "pointer",
            }}
            onFocus={(e) => handleFocus(e, !!error)}
            onBlur={(e) => handleBlur(e, !!error)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: 0,
                flex: 1,
              }}
            >
              {icon}
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 14,
                  fontWeight: hasValue ? 500 : 400,
                  color: hasValue ? TEXT_PRIMARY : "#aab0be",
                  fontFamily: "inherit",
                }}
              >
                <SelectValue placeholder={placeholder} />
              </span>
            </div>
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={8}
            className="rounded-[14px] border border-[#d9e1ea] bg-white p-1.5 shadow-[0_20px_50px_rgba(15,23,42,0.14)]"
          >
            {selectOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-[10px] py-2.5 pl-9 pr-3 text-[13px] text-[#1a1a2e] outline-none focus:bg-[rgba(77,217,232,0.12)] focus:text-[#0e8a96]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </UiSelect>
        <FieldError error={error} />
      </div>
    );
  },
);

const ChipGroup: FC<ChipGroupProps> = memo(
  ({ label, options, selected, onSelect, required, error }) => (
    <div style={S.column(8)}>
      <FormLabel text={label} required={required} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              onClick={() => onSelect(o)}
              type="button"
              style={{
                padding: "9px 18px",
                borderRadius: 24,
                fontSize: 13,
                fontWeight: 500,
                border: `1.5px solid ${active ? ACCENT : "#e0e2e8"}`,
                background: active ? "rgba(77,217,232,0.08)" : "#fff",
                color: active ? ACCENT_DARK : TEXT_SECONDARY,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      <FieldError error={error} />
    </div>
  ),
);

const SkillTags: FC<SkillTagsProps> = memo(
  ({ skills, onAdd, onRemove, error }) => {
    const [input, setInput] = useState("");
    const skillInputRef = useRef<HTMLInputElement>(null);

    const tryAdd = useCallback(() => {
      const trimmed = input.trim();
      if (!trimmed) return;
      if (trimmed.length > 50) {
        toast.error("Skill name must be less than 50 characters");
        return;
      }
      if (skills.length >= 20) {
        toast.error("You can add a maximum of 20 skills");
        return;
      }
      if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
        toast.error("This skill has already been added");
        return;
      }
      onAdd(trimmed);
      setInput("");
      skillInputRef.current?.focus();
    }, [input, skills, onAdd]);

    const handleKey = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          tryAdd();
        }
      },
      [tryAdd],
    );

    return (
      <div style={S.column(6)}>
        <FormLabel text="Primary Skills" required hint="(Press Enter to add)" />
        <div
          style={{
            ...S.fieldWrap(!!error),
            flexWrap: "wrap",
            padding: "8px 12px",
            minHeight: 46,
            height: "auto",
            alignItems: "center",
          }}
        >
          {skills.map((s) => (
            <span
              key={s}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(77,217,232,0.1)",
                color: ACCENT_DARK,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {s}
              <span
                onClick={() => onRemove(s)}
                style={{ cursor: "pointer", opacity: 0.6, fontSize: 15 }}
              >
                ×
              </span>
            </span>
          ))}
          <input
            ref={skillInputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={skills.length ? "" : "e.g. React, Python, AWS..."}
            maxLength={50}
            style={{ ...S.inputBase, minWidth: 100, flex: "1 1 auto" }}
          />
          {input.trim() && (
            <button
              type="button"
              onClick={tryAdd}
              style={{
                padding: "4px 12px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: `1.5px solid ${BORDER}`,
                background: "#fff",
                color: TEXT_SECONDARY,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.color = ACCENT_DARK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = BORDER;
                e.currentTarget.style.color = TEXT_SECONDARY;
              }}
            >
              Add
            </button>
          )}
        </div>
        {skills.length === 0 && !error && (
          <p
            style={{
              fontSize: 12,
              color: "#bbb",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            No skills added yet. Add at least one skill to continue.
          </p>
        )}
        {skills.length > 0 && (
          <p style={{ fontSize: 12, color: TEXT_MUTED, margin: 0 }}>
            {skills.length} / 20 skills added
          </p>
        )}
        <FieldError error={error} />
      </div>
    );
  },
);

const Checkbox: FC<{
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}> = memo(({ checked, onChange, children }) => (
  <label
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      cursor: "pointer",
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{
        width: 18,
        height: 18,
        accentColor: ACCENT,
        marginTop: 2,
        cursor: "pointer",
        flexShrink: 0,
        minHeight: 0,
        minWidth: 0,
      }}
    />
    <span style={{ fontSize: 13, color: TEXT_SECONDARY, lineHeight: 1.5 }}>
      {children}
    </span>
  </label>
));

/* ═══════════ STEP INDICATOR ═══════════ */
const StepIndicator: FC<{
  current: number;
}> = memo(({ current }) => (
  <div
    className="contractor-stepper"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 44,
    }}
  >
    {STEPS.map((s, i) => (
      <div
        key={s.id}
        className="contractor-stepper-item"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div
          className="contractor-stepper-step"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            className="contractor-stepper-circle"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              background: current >= s.id ? ACCENT : "#e8eaef",
              color: current >= s.id ? "#fff" : TEXT_MUTED,
              transition: "all 0.3s",
            }}
          >
            {current > s.id ? "✓" : s.id}
          </div>
          <span
            className="contractor-stepper-label"
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: current >= s.id ? TEXT_PRIMARY : "#bbb",
              transition: "color 0.3s",
            }}
          >
            {s.label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className="contractor-stepper-connector"
            style={{
              width: 60,
              height: 2,
              margin: "0 12px",
              background: current > s.id ? ACCENT : "#e8eaef",
              borderRadius: 2,
              transition: "background 0.3s",
            }}
          />
        )}
      </div>
    ))}
  </div>
));

/* ═══════════ LEFT PANEL ═══════════ */
const LeftPanel: FC = memo(() => {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 6,
        dur: 8 + Math.random() * 10,
      })),
    [],
  );

  return (
    <div
      className="contractor-left-panel"
      style={{
        flex: "0 0 50%",
        width: "50%",
        maxWidth: "50%",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #0d1117 0%, #111827 40%, #0c1a2a 100%)",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 64px",
      }}
    >
      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "rgba(77,217,232,0.15)",
            animation: `floatY ${p.dur}s ease-in-out ${p.delay}s infinite, pulse ${p.dur * 0.7}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 50,
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "fadeUp 0.6s ease",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logo} alt="company logo" className="w-44 h-auto" />
        </Link>
      </div>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          animation: "fadeUp 0.8s ease",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: 16,
            opacity: 0.9,
          }}
        >
          CONTRACTOR REGISTRATION
        </p>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}
        >
          Ready to land
          <br />
          your{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, #06d6a0)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            next contract?
          </span>
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.6,
            maxWidth: 360,
            marginTop: 32,
          }}
        >
          Join the ecosystem of elite contractors and find the perfect match for
          your career trajectory.
        </p>
      </div>

      {/* Value props */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          zIndex: 2,
          animation: "fadeUp 1s ease",
        }}
      >
        {VALUE_PROPS.map((t) => (
          <div
            key={t}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "rgba(77,217,232,0.1)",
                border: "1px solid rgba(77,217,232,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckIcon />
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>

      {/* Decorative circle */}
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: "50%",
          border: "1px solid rgba(77,217,232,0.08)",
          background:
            "radial-gradient(circle, rgba(77,217,232,0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
});

/* ═══════════ LINK COMPONENT ═══════════ */
const ALink: FC<{ href?: string; children: ReactNode }> = ({
  href = "#",
  children,
}) => (
  <a
    href={href}
    style={{ color: ACCENT_DARK, textDecoration: "none", fontWeight: 600 }}
  >
    {children}
  </a>
);

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function ContractorSignup(): JSX.Element {
  const navigate = useNavigate();
  const [createContractor, { isLoading }] = useCreateCandidateMutation();
  const [checkExistingEmail, { isLoading: isCheckingEmail }] =
    useCheckExistingEmailMutation();
  const [sendVerificationOtp, { isLoading: isSendingOtp }] = useSendVerificationOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [dir, setDir] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [primarySkills, setPrimarySkills] = useState<string[]>([]);
  const [preferredWorkType, setPreferredWorkType] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);

  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSendOtp = useCallback(async () => {
    try {
      await sendVerificationOtp({ email: form.email }).unwrap();
      toast.success("Verification code sent to your email.");
      setResendCooldown(60);
    } catch (err) {
      toast.error("Failed to send verification code. Please try again.");
    }
  }, [form.email, sendVerificationOtp]);

  const handleVerifyOtp = useCallback(async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    try {
      await verifyOtp({ email: form.email, otp }).unwrap();
      setIsEmailVerified(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      toast.error("Invalid verification code. Please check and try again.");
    }
  }, [form.email, otp, verifyOtp]);

  /* ── Timer for OTP resend cooldown ── */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /* ── Updater helpers ── */
  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFieldErrors((prev) => {
      const n = { ...prev };
      delete n[name];
      return n;
    });
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
  }, []);

  const handleSelect = useCallback(
    (name: keyof FormData) => (selectedValue: string) => {
      setFieldErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
      setForm((prev) => ({ ...prev, [name]: selectedValue }));
    },
    [],
  );

  const addSkill = useCallback((skill: string) => {
    setPrimarySkills((prev) => [...prev, skill]);
    setFieldErrors((prev) => {
      const n = { ...prev };
      delete n.primarySkills;
      return n;
    });
  }, []);

  const removeSkill = useCallback((skill: string) => {
    setPrimarySkills((prev) => prev.filter((s) => s !== skill));
  }, []);

  const toggleWorkType = useCallback((type: string) => {
    setPreferredWorkType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
    setFieldErrors((prev) => {
      const n = { ...prev };
      delete n.preferredWorkType;
      return n;
    });
  }, []);

  const go = useCallback(
    (next: number) => {
      setDir(next > step ? 1 : -1);
      setStep(next);
      setAnimKey((k) => k + 1);
    },
    [step],
  );

  /* ── Validation ── */
  const validateStep = useCallback(async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      const fnErr = VALIDATION.name.validate(form.firstName, "First name");
      if (fnErr) errors.firstName = fnErr;
      const lnErr = VALIDATION.name.validate(form.lastName, "Last name");
      if (lnErr) errors.lastName = lnErr;
      const emailErr = VALIDATION.email.validate(form.email);
      if (emailErr) {
        errors.email = emailErr;
      } else {
        try {
          await checkExistingEmail({ email: form.email }).unwrap();
        } catch (error) {
          if (
            isFetchBaseQueryError(error) &&
            "status" in error &&
            error.status === 409
          ) {
            errors.email =
              "Email already registered, please use a different email.";
          } else {
            errors.email =
              "Could not verify email right now. Please try again.";
          }
        }
      }
      const phoneErr = VALIDATION.phone.validate(form.mobileNumber);
      if (phoneErr) errors.mobileNumber = phoneErr;
      const pwErr = VALIDATION.password.validate(form.password);
      if (pwErr) errors.password = pwErr;
      if (!form.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (step === 2) {
      if (!form.contractorType)
        errors.contractorType = "Please select a contractor type";
      const expErr = VALIDATION.experience.validate(form.yearsExperience);
      if (expErr) errors.yearsExperience = expErr;
      if (!form.primaryJobRole || !form.primaryJobRole.trim()) {
        errors.primaryJobRole = "Primary job role is required";
      } else if (form.primaryJobRole.length > 100) {
        errors.primaryJobRole = "Job role must be less than 100 characters";
      }
      const skillsErr = VALIDATION.skills.validate(primarySkills);
      if (skillsErr) errors.primarySkills = skillsErr;
      if (!isEmailVerified) {
        errors.otp = "Please verify your email to proceed";
      }
    } else if (step === 3) {
      if (!form.availableToJoin)
        errors.availableToJoin = "Please select your availability";
      if (preferredWorkType.length === 0)
        errors.preferredWorkType =
          "Please select at least one preferred work type";
      if (!acceptedTerms)
        errors.acceptedTerms =
          "You must accept the Terms of Service to continue";
      if (!acceptedPrivacyPolicy)
        errors.acceptedPrivacyPolicy =
          "You must accept the Privacy Policy to continue";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error(Object.values(errors)[0]);
      return false;
    }
    setFieldErrors({});
    return true;
  }, [
    step,
    form,
    primarySkills,
    preferredWorkType,
    acceptedTerms,
    acceptedPrivacyPolicy,
    checkExistingEmail,
  ]);

  const nextStep = useCallback(async () => {
    if (await validateStep()) {
      if (step === 1 && !isEmailVerified) {
        handleSendOtp();
      }
      go(step + 1);
    }
  }, [validateStep, go, step, isEmailVerified, handleSendOtp]);

  const prevStep = useCallback(() => {
    setFieldErrors({});
    go(step - 1);
  }, [go, step]);

  const handleSubmit = useCallback(async () => {
    if (!(await validateStep())) return;

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.toLowerCase().trim(),
      mobileNumber: form.mobileNumber.replace(/[\s\-()]/g, ""),
      password: form.password,
      contractorType: form.contractorType,
      yearsExperience: form.yearsExperience,
      primaryJobRole: form.primaryJobRole.trim(),
      primarySkills,
      availableToJoin: form.availableToJoin,
      preferredWorkType,
      acceptedTerms,
      acceptedPrivacyPolicy,
    };

    try {
      await createContractor(payload).unwrap();
      toast.success("Registration successful! Please login to continue.");
      navigate("/contractor-login");
    } catch (error: unknown) {
      if (isFetchBaseQueryError(error)) {
        if (error.status === 409) {
          toast.error(
            "An account with this email already exists. Please login instead.",
          );
        } else if (
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data
        ) {
          toast.error((error.data as { message: string }).message);
        } else if (error.status === 400) {
          toast.error(
            "Invalid registration data. Please check your inputs and try again.",
          );
        } else {
          toast.error(
            "Registration failed. Please try again or contact support.",
          );
        }
      } else {
        toast.error(
          "Registration failed. Please try again or contact support.",
        );
      }
    }
  }, [
    validateStep,
    form,
    primarySkills,
    preferredWorkType,
    acceptedTerms,
    acceptedPrivacyPolicy,
    createContractor,
    navigate,
  ]);

  const currentStepCfg = STEPS[step - 1];
  const isLast = step === 3;

  const btnPrimary: CSSProperties = useMemo(
    () => ({
      flex: 1,
      padding: "14px 28px",
      borderRadius: 10,
      border: "none",
      background: isLast
        ? `linear-gradient(135deg, ${ACCENT} 0%, #06b6d4 100%)`
        : TEXT_PRIMARY,
      fontSize: 14,
      fontWeight: 600,
      color: "#fff",
      cursor: isLoading || isCheckingEmail ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      transition: "all 0.25s",
      letterSpacing: "0.02em",
      opacity: isLoading || isCheckingEmail ? 0.7 : 1,
      boxShadow: isLast
        ? `0 4px 20px rgba(77,217,232,0.35)`
        : "0 4px 16px rgba(26,26,46,0.2)",
    }),
    [isLast, isLoading, isCheckingEmail],
  );

  return (
    <div
      className="contractor-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(${dir > 0 ? 40 : -40}px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50%      { opacity: 0.35; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        input::placeholder { color: #aab0be; }
        .contractor-page,
        .contractor-page * { box-sizing: border-box; margin: 0; padding: 0; }
        .contractor-page ::-webkit-scrollbar { width: 4px; }
        .contractor-page ::-webkit-scrollbar-thumb { background: rgba(77,217,232,0.3); border-radius: 4px; }
        .contractor-page {
          min-height: 100vh;
          display: flex;
          width: 100%;
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
          background: #f3f5f8;
          overflow-x: hidden;
        }
        /* Mobile-first: right panel takes full width, left panel hidden */
        .contractor-left-panel {
          display: none;
          flex: 0 0 50%;
          width: 50%;
          max-width: 50%;
          min-height: 100vh;
          overflow: hidden;
        }
        .contractor-right-panel {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          padding: 40px 24px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          min-width: 0;
          min-height: 100vh;
        }
        .contractor-mobile-brand {
          display: none;
        }
        @media (min-width: 1025px) {
          .contractor-page {
            background: #f3f5f8;
          }
          .contractor-stepper {
            min-width: 0;
          }
          .contractor-left-panel {
            display: flex;
          }
          .contractor-right-panel {
            flex: 0 0 50%;
            width: 50%;
            max-width: 50%;
            padding: 60px 70px;
            justify-content: center;
          }
          .contractor-page {
            overflow-x: hidden;
          }
        }
        .contractor-stepper-item {
          display: flex;
          align-items: center;
        }
        .contractor-stepper-step {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .contractor-stepper-circle {
          flex-shrink: 0;
        }
        .contractor-stepper-label {
          white-space: nowrap;
        }
        .contractor-stepper-connector {
          flex-shrink: 0;
        }
        .contractor-form-shell {
          max-width: 520px;
          width: 100%;
          margin: 0 auto;
          min-width: 0;
          animation: slideIn 0.4s ease;
        }
        .contractor-step-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          min-width: 0;
        }
        .contractor-actions {
          display: flex;
          gap: 12px;
          margin-top: 36px;
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .contractor-right-panel {
            padding: 40px 48px;
          }
          .contractor-mobile-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 24px;
            width: 100%;
            animation: fadeUp 0.55s ease;
          }
          .contractor-mobile-brand img {
            width: 180px;
            height: auto;
            display: block;
          }
          .contractor-mobile-brand span {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #6b7280;
          }
          .contractor-stepper {
            margin-bottom: 36px;
            margin-top: 0;
          }
          .contractor-form-shell {
            max-width: 520px;
          }
          .contractor-form-shell > h2 {
            font-size: 28px;
          }
          .contractor-form-shell > p {
            font-size: 14px;
            margin-bottom: 28px;
          }
          .contractor-step-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
        @media (max-width: 640px) {
          .contractor-left-panel {
            display: none;
          }
          .contractor-right-panel {
            padding: 20px 14px;
          }
          .contractor-mobile-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 16px;
            width: 100%;
            animation: fadeUp 0.55s ease;
          }
          .contractor-mobile-brand img {
            width: 180px;
            height: auto;
            display: block;
            max-width: 70vw;
          }
          .contractor-mobile-brand span {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #6b7280;
          }
          .contractor-stepper {
            margin-bottom: 20px;
            margin-top: 0;
            padding: 14px 12px;
            border-radius: 16px;
            background: #fff;
            border: 1px solid rgba(200,210,220,0.4);
            box-shadow: 0 8px 24px rgba(15,23,42,0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            width: 100%;
          }
          .contractor-stepper::-webkit-scrollbar {
            height: 3px;
          }
          .contractor-stepper::-webkit-scrollbar-track {
            background: transparent;
          }
          .contractor-stepper::-webkit-scrollbar-thumb {
            background: rgba(77,217,232,0.25);
            border-radius: 2px;
          }
          .contractor-stepper-item {
            min-width: auto;
            flex: 0 1 auto;
          }
          .contractor-stepper-circle {
            width: 26px;
            height: 26px;
            min-width: 26px;
            font-size: 11px;
          }
          .contractor-stepper-label {
            font-size: 10px;
            max-width: 60px;
            letter-spacing: 0.05em;
          }
          .contractor-stepper-connector {
            flex: 0 1 40px;
            margin: 0 6px;
            min-width: 30px;
          }
          .contractor-form-shell {
            max-width: 100%;
            background: rgba(255,255,255,0.95);
            border-radius: 14px;
            padding: 28px 16px;
            box-shadow: 0 10px 32px rgba(15,23,42,0.06);
            border: 1px solid rgba(200,210,220,0.2);
            margin: 0;
          }
          .contractor-form-shell > h2 {
            font-size: clamp(18px, 5vw, 24px);
            margin-bottom: 8px;
          }
          .contractor-form-shell > p {
            font-size: 13px;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          .contractor-step-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .contractor-actions {
            flex-direction: column;
            gap: 10px;
            margin-top: 24px;
          }
          .contractor-actions > button {
            width: 100%;
            padding: 12px 20px !important;
            font-size: 13px !important;
          }
        }
        @media (max-width: 640px) {
          .contractor-right-panel {
            padding: 12px 10px;
          }
          .contractor-mobile-brand {
            display: flex;
            margin-bottom: 14px;
          }
          .contractor-mobile-brand img {
            width: 150px;
          }
          .contractor-mobile-brand span {
            font-size: 10px;
            letter-spacing: 0.18em;
          }
          .contractor-stepper {
            margin-bottom: 16px;
            padding: 10px 10px;
            gap: 4px;
            border-radius: 14px;
          }
          .contractor-stepper-item {
            min-width: auto;
          }
          .contractor-stepper-step {
            gap: 5px;
          }
          .contractor-stepper-circle {
            width: 24px;
            height: 24px;
            min-width: 24px;
            font-size: 10px;
          }
          .contractor-stepper-label {
            font-size: 9px;
            letter-spacing: 0.08em;
            max-width: 50px;
          }
          .contractor-stepper-connector {
            flex: 0 1 32px;
            min-width: 24px;
            margin: 0 4px;
          }
          .contractor-form-shell {
            max-width: 100%;
            padding: 24px 16px;
            border-radius: 16px;
            box-shadow: 0 12px 40px rgba(15,23,42,0.08);
            border: 1px solid rgba(200,210,220,0.3);
          }
          .contractor-form-shell > h2 {
            font-size: 16px;
            letter-spacing: -0.01em;
          }
          .contractor-form-shell > p {
            font-size: 12px;
            margin-bottom: 16px;
          }
          .contractor-step-grid {
            gap: 11px;
          }
          .contractor-actions {
            margin-top: 20px;
            gap: 9px;
          }
          .contractor-actions > button {
            padding: 11px 16px !important;
            font-size: 12px !important;
          }
        }
        @media (max-width: 480px) {
          .contractor-right-panel {
            padding: 10px 8px;
          }
          .contractor-mobile-brand {
            margin-bottom: 10px;
          }
          .contractor-mobile-brand img {
            width: 130px;
          }
          .contractor-mobile-brand span {
            font-size: 9px;
            letter-spacing: 0.15em;
          }
          .contractor-stepper {
            margin-bottom: 12px;
            padding: 8px 8px;
            gap: 2px;
            border-radius: 12px;
          }
          .contractor-stepper-item {
            min-width: auto;
          }
          .contractor-stepper-step {
            gap: 4px;
          }
          .contractor-stepper-circle {
            width: 20px;
            height: 20px;
            min-width: 20px;
            font-size: 8px;
          }
          .contractor-stepper-label {
            display: none;
          }
          .contractor-stepper-connector {
            flex: 0 1 18px;
            min-width: 12px;
            margin: 0 2px;
          }
          .contractor-form-shell {
            padding: 32px 12px;
            border-radius: 8px;
            box-shadow: 0 8px 30px rgba(15,23,42,0.06);
          }
          .contractor-form-shell > h2 {
            font-size: 14px;
            margin-bottom: 4px;
          }
          .contractor-form-shell > p {
            font-size: 11px;
            margin-bottom: 14px;
            text-align: center;
          }
          .contractor-form-shell > h2,
          .contractor-form-shell > p {
            text-align: center;
          }
          .contractor-actions {
            margin-top: 16px;
            gap: 8px;
          }
          .contractor-actions > button {
            padding: 10px 14px !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <LeftPanel />

      {/* ────── RIGHT PANEL ────── */}
      <div
        className="contractor-right-panel"
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          className="contractor-mobile-brand"
          style={{
            animation: "fadeUp 0.55s ease",
          }}
        >
          <img
            src={logo2}
            alt="Hirion"
            style={{
              height: "auto",
              display: "block",
            }}
          />
          <span style={{ color: "#6b7280" }}>Contractor onboarding</span>
        </div>

        <div style={{ maxWidth: 520, width: "100%", margin: "0 auto" }}>
          <StepIndicator current={step} />
        </div>

        <div
          key={animKey}
          className="contractor-form-shell"
          style={{
            maxWidth: 520,
            width: "100%",
            margin: "0 auto",
            animation: "slideIn 0.4s ease",
          }}
        >
          <h2
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: TEXT_PRIMARY,
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            {currentStepCfg.title}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#888",
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            {currentStepCfg.subtitle}
          </p>

          {/* ── STEP 1: Account ── */}
          {step === 1 && (
            <div style={S.column(18)}>
              <div className="contractor-step-grid">
                <Input
                  label="First Name"
                  required
                  name="firstName"
                  placeholder="First Name"
                  icon={UserIcon}
                  value={form.firstName}
                  onChange={handleInput}
                  error={fieldErrors.firstName}
                />
                <Input
                  label="Last Name"
                  required
                  name="lastName"
                  placeholder="Last Name"
                  icon={UserIcon}
                  value={form.lastName}
                  onChange={handleInput}
                  error={fieldErrors.lastName}
                />
              </div>
              <Input
                label="Work Email"
                required
                name="email"
                placeholder="contractor@example.com"
                type="email"
                icon={MailIcon}
                value={form.email}
                onChange={handleInput}
                error={fieldErrors.email}
              />
              {isCheckingEmail && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: TEXT_MUTED }}>
                  <SpinnerLoader />
                  Checking availability...
                </div>
              )}
              <Input
                label="Mobile Number"
                required
                name="mobileNumber"
                placeholder="+1 (555) 000-0000"
                icon={PhoneIcon}
                value={form.mobileNumber}
                onChange={handleInput}
                error={fieldErrors.mobileNumber}
              />
              <div className="contractor-step-grid">
                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleInput}
                  show={showPw}
                  onToggle={() => setShowPw((p) => !p)}
                  error={fieldErrors.password}
                />
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleInput}
                  show={showCpw}
                  onToggle={() => setShowCpw((p) => !p)}
                  error={fieldErrors.confirmPassword}
                />
              </div>
            </div>
          )}


          {step === 2 && (
            <div style={S.column(22)}>

              <div
                style={{
                  background: isEmailVerified ? "rgba(77,217,232,0.05)" : "#fff9f9",
                  border: `1.5px solid ${isEmailVerified ? ACCENT : "#fee2e2"}`,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: isEmailVerified ? ACCENT : "#fee2e2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isEmailVerified ? "#fff" : "#ef4444"
                    }}>
                      {isEmailVerified ? "✓" : "!"}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: TEXT_PRIMARY }}>Email Verification</p>
                      <p style={{ fontSize: 12, color: TEXT_MUTED }}>{form.email}</p>
                    </div>
                  </div>
                  {isEmailVerified && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT_DARK }}>Verified</span>
                  )}
                </div>

                {!isEmailVerified && (
                  <div style={S.column(12)}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                      <div style={{ flex: 1 }}>
                        <Input
                          label="Enter 6-digit Code"
                          name="otp"
                          placeholder="000000"
                          value={otp}
                          maxLength={6}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                          icon={LockIcon}
                          error={fieldErrors.otp}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || otp.length !== 6}
                        style={{
                          height: 46,
                          padding: "0 20px",
                          borderRadius: 10,
                          background: TEXT_PRIMARY,
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: (isVerifyingOtp || otp.length !== 6) ? "not-allowed" : "pointer",
                          opacity: (isVerifyingOtp || otp.length !== 6) ? 0.7 : 1,
                          border: "none",
                          marginBottom: fieldErrors.otp ? 24 : 0
                        }}
                      >
                        {isVerifyingOtp ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: 12, color: TEXT_MUTED }}>
                        Didn't receive the code?
                      </p>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || resendCooldown > 0}
                        style={{
                          background: "none",
                          border: "none",
                          color: (isSendingOtp || resendCooldown > 0) ? TEXT_MUTED : ACCENT_DARK,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: (isSendingOtp || resendCooldown > 0) ? "not-allowed" : "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        {isSendingOtp ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="contractor-step-grid">
                {/* Contractor Type — dropdown */}
                <Select
                  label="Contractor Type"
                  required
                  icon={BriefcaseIcon}
                  options={CONTRACTOR_TYPE_OPTIONS}
                  value={form.contractorType}
                  onChange={handleSelect("contractorType")}
                  error={fieldErrors.contractorType}
                />
                {/* Years of Experience — number input */}
                <Input
                  label="Years of Experience"
                  required
                  name="yearsExperience"
                  type="number"
                  placeholder="e.g. 5"
                  icon={StarIcon}
                  value={form.yearsExperience ?? ""}
                  onChange={handleInput}
                  error={fieldErrors.yearsExperience}
                  min={0}
                  max={70}
                />
              </div>
              <Input
                label="Primary Job Role"
                required
                name="primaryJobRole"
                placeholder="e.g. Software Engineer"
                icon={BriefcaseIcon}
                value={form.primaryJobRole}
                onChange={handleInput}
                error={fieldErrors.primaryJobRole}
              />
              {/* Primary Skills — tag input with Add button + validation */}
              <SkillTags
                skills={primarySkills}
                onAdd={addSkill}
                onRemove={removeSkill}
                error={fieldErrors.primarySkills}
              />
            </div>
          )}

          {/* ── STEP 3: Preferences ── */}
          {step === 3 && (
            <div style={S.column(22)}>
              <Select
                label="Availability to Join"
                required
                icon={ClockIcon}
                options={AVAILABILITY_OPTIONS}
                value={form.availableToJoin}
                onChange={handleSelect("availableToJoin")}
                error={fieldErrors.availableToJoin}
              />
              <ChipGroup
                label="Preferred Work Type"
                required
                options={WORK_TYPES}
                selected={preferredWorkType}
                onSelect={toggleWorkType}
                error={fieldErrors.preferredWorkType}
              />
              <div style={{ ...S.column(14), marginTop: 8 }}>
                <div>
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={() => {
                      setAcceptedTerms((p) => !p);
                      setFieldErrors((prev) => {
                        const n = { ...prev };
                        delete n.acceptedTerms;
                        return n;
                      });
                    }}
                  >
                    I accept the <ALink href="/terms">Terms of Service</ALink>{" "}
                    and agree to communications.{" "}
                    <span style={S.asterisk}>*</span>
                  </Checkbox>
                  <FieldError error={fieldErrors.acceptedTerms} />
                </div>
                <div>
                  <Checkbox
                    checked={acceptedPrivacyPolicy}
                    onChange={() => {
                      setAcceptedPrivacyPolicy((p) => !p);
                      setFieldErrors((prev) => {
                        const n = { ...prev };
                        delete n.acceptedPrivacyPolicy;
                        return n;
                      });
                    }}
                  >
                    I agree to the <ALink href="/privacy">Privacy Policy</ALink>{" "}
                    and data processing. <span style={S.asterisk}>*</span>
                  </Checkbox>
                  <FieldError error={fieldErrors.acceptedPrivacyPolicy} />
                </div>
              </div>
            </div>
          )}

          {/* ── BUTTONS ── */}
          <div
            className="contractor-actions"
            style={{ display: "flex", gap: 12, marginTop: 36 }}
          >
            {step > 1 && (
              <button
                onClick={prevStep}
                disabled={isLoading || isCheckingEmail}
                style={{
                  padding: "14px 28px",
                  borderRadius: 10,
                  border: "1.5px solid #e0e2e8",
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  color: TEXT_SECONDARY,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.color = ACCENT_DARK;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e2e8";
                  e.currentTarget.style.color = TEXT_SECONDARY;
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={isLast ? handleSubmit : nextStep}
              disabled={isLoading || isCheckingEmail}
              style={btnPrimary}
              onMouseEnter={(e) => {
                if (!isLoading && !isCheckingEmail)
                  e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {isLoading || isCheckingEmail ? (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Processing...
                </span>
              ) : isLast ? (
                "Create Account"
              ) : (
                "Next Step →"
              )}
            </button>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: 28,
              fontSize: 13,
              color: TEXT_MUTED,
              fontWeight: 700,
            }}
          >
            Already have an account?{" "}
            <Link to="/contractor-login" className="text-teal-600 hover:underline">Sign In to Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

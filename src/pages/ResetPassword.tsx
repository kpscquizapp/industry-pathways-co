import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logo from "@/assets/White Option.png";
import logo2 from "@/assets/Dark Option.png";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/app/queries/loginApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { VALIDATION } from "@/services/utils/signUpValidation";

type Password = {
  password: string;
};
type FieldErrorKey = keyof Password;

const ResetPassword = () => {
  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldErrorKey, string>>
  >({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [resetNewPassword, { isLoading }] = useResetPasswordMutation();

  const [resetPassword, setResetPassword] = useState({
    password: "",
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (fieldErrors[name as FieldErrorKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as FieldErrorKey];
        return newErrors;
      });
    }
    setResetPassword((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleBlur = (field: "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ password: true });

    const errors: Record<string, string> = {};
    const trimmedPassword = resetPassword.password.trim();

    const passwordError = VALIDATION.password.validate(trimmedPassword);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    setFieldErrors({});

    const updatedResetPassword = {
      ...resetPassword,
      password: trimmedPassword,
    };
    setResetPassword(updatedResetPassword);

    try {
      const result = await resetNewPassword({
        token,
        password: trimmedPassword,
      }).unwrap();

      if (result?.success) {
        toast.success("Password reset successfully.");
        navigation("/");
      }
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        (error instanceof Error ? error.message : "Failed to reset password.");
      toast.error(message);
    }
  };

  const stats = [
    {
      value: "12k+",
      label: "Active Contractors",
    },
    {
      value: "850+",
      label: "Companies Hiring",
    },
    {
      value: "98%",
      label: "Match Accuracy",
    },
  ];

  return (
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
        fontFamily: "'Inter', sans-serif",
        background: "#f3f5f8",
        overflowX: "hidden",
      }}
    >
      <style>{`
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
        .login-page * { box-sizing: border-box; }
        .login-left-panel {
          display: none;
          flex: 0 0 50%;
          width: 50%;
          max-width: 50%;
          min-height: 100vh;
          overflow: hidden;
        }
        .login-right-panel {
          flex: 1 1 auto;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          padding: 24px 14px;
          overflow-y: auto;
          overflow-x: hidden;
          background: #fff;
          min-width: 0;
          min-height: 100vh;
        }
        .login-mobile-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
          width: 100%;
          animation: fadeUp 0.6s ease;
        }
        .login-mobile-brand img {
          width: 180px;
          height: auto;
          display: block;
          max-width: 70vw;
        }
        .login-mobile-brand span {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
        }
        @media (min-width: 1025px) {
          .login-left-panel {
            display: flex;
          }
          .login-right-panel {
            flex: 0 0 50%;
            width: 50%;
            max-width: 50%;
            padding: 60px 70px;
            background: #fff;
          }
          .login-mobile-brand {
            display: none;
          }
        }
        .animate-fade-up {
          animation: fadeUp 0.6s ease forwards;
        }
        .animate-float {
          animation: floatY 6s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Left Panel - Immersive Branding */}
      <div className="login-left-panel bg-[#080b20] px-16 py-8 flex-col justify-center relative shrink-0 border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none animate-pulse-slow">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="dotGrid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1" fill="#fff" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotGrid)" />
          </svg>
        </div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[350px] h-[350px] border border-white/[0.03] rounded-full animate-float" />
        <div
          className="absolute bottom-[-20%] right-[-15%] w-[500px] h-[500px] border border-white/[0.02] rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="absolute top-10 left-16 z-20 animate-fade-up">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="company logo" className="w-44 h-auto" />
          </Link>
        </div>

        <div className="relative z-10 animate-fade-up">
          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2">
              <span className="text-[#4DD9E8] text-[11px] font-semibold tracking-[0.15em] uppercase">
                SECURE ACCESS
              </span>
            </div>

            <h1 className="text-[44px] font-bold text-white leading-[1.2] tracking-tight">
              Create a new
              <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                secure password.
              </span>
            </h1>

            <p className="text-[16px] text-white/40 leading-relaxed max-w-sm">
              Please enter your new password below. Make sure it's secure and easy for you to remember.
            </p>
          </div>
        </div>

        {/* <div className="relative z-10 grid grid-cols-3 gap-8 pb-4 mt-[44px] animate-fade-up [animation-delay:200ms]">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40 font-semibold uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Right Panel - Premium Reset Section */}
      <div className="login-right-panel flex flex-col overflow-y-auto">
        <div className="login-mobile-brand">
          <img src={logo2} alt="company logo" className="mb-1" />
          <span>SECURE ACCESS</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[420px] animate-fade-up [animation-delay:150ms]">
            <div className="w-full flex flex-col mb-10">
              <h3 className="text-4xl font-bold text-[#1a1a2e] mb-3 lg:text-left text-center">
                Reset Password
              </h3>
              <p className="text-slate-400 font-medium lg:text-left text-center text-sm">
                Enter your new password to secure your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="flex flex-col gap-1.5 min-w-0">
                <Label
                  htmlFor="password"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a2e",
                    letterSpacing: "0.02em",
                  }}
                  className="ml-1"
                >
                  New Password
                </Label>
                <div
                  className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${touched.password && fieldErrors.password
                      ? "border-[#ef4444] focus-within:border-[#ef4444] focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
                      : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                    }`}
                >
                  <Lock className="w-4 h-4 text-[#aaa] shrink-0" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    className="flex-1 min-w-0 border-none bg-transparent outline-none h-full p-0 text-sm focus-visible:ring-0 shadow-none font-normal"
                    value={resetPassword.password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur("password")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#999] hover:text-slate-500 transition-colors shrink-0"
                  >
                    {showPassword ? (
                      <Eye className="w-4.5 h-4.5" />
                    ) : (
                      <EyeOff className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                {touched.password && (
                  <ErrorMessage error={fieldErrors.password} />
                )}
              </div>

              <Button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #4DD9E8, #0ea5e9)",
                  boxShadow: "0 4px 20px rgba(77,217,232,0.35)",
                }}
                className="w-full h-[52px] text-[15px] font-bold rounded-xl text-white hover:opacity-90 transition-all active:scale-[0.98] group disabled:opacity-50 mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <SpinnerLoader className="w-5 h-5 text-current" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>Reset Password</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-12 text-center text-sm font-medium text-slate-400">
              <Link
                to="/"
                className="text-[#999] hover:text-[#1a1a2e] transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back To Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Star,
  ShieldCheck,
  LayoutDashboard,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useLoginCandidateMutation } from "@/app/queries/loginApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/slices/userAuth";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

// ==================== TYPE GUARDS ====================
function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "data" in error;
}

// ==================== VALIDATION ====================
const VALIDATION = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (email: string) => {
      if (!email || !email.trim()) return "Email address is required";
      if (!VALIDATION.email.regex.test(email)) {
        return "Please enter a valid email address";
      }
      return null;
    },
  },
  password: {
    validate: (password: string) => {
      if (!password) return "Password is required";
      if (password.length < 8) return "Password must be at least 8 characters";
      return null;
    },
  },
};

// ==================== COMPONENT ====================
const CandidateLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginCandidateMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const CREDENTIAL_ERROR_MSG = "Please check your credentials";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        // Clear credential-related errors on both fields
        const otherField = name === "email" ? "password" : "email";
        if (prev[otherField] === CREDENTIAL_ERROR_MSG) {
          delete newErrors[otherField];
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let error: string | null = null;

    if (field === "email") {
      error = VALIDATION.email.validate(formData.email);
    } else if (field === "password") {
      error = VALIDATION.password.validate(formData.password);
    }

    if (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
      return false;
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Always mark all fields as touched on submit attempt
    setTouched({ email: true, password: true });

    const emailError = VALIDATION.email.validate(formData.email);
    if (emailError) errors.email = emailError;

    const passwordError = VALIDATION.password.validate(formData.password);
    if (passwordError) errors.password = passwordError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      // Show the first error in a toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);

      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login({
        email: formData.email.toLowerCase().trim(), // Sanitize email
        password: formData.password,
      }).unwrap();

      dispatch(setUser(result));

      // Check if this is first login (profile not completed)
      const isFirstLogin =
        typeof result?.profileCompleted === "boolean"
          ? !result.profileCompleted
          : result?.isFirstLogin === true;

      if (isFirstLogin) {
        toast.success(
          `Welcome${result?.user?.firstName ? ` ${result.user.firstName}` : ""}! Let's complete your profile.`,
        );
        navigate("/contractor/profile");
      } else {
        toast.success(
          `Welcome back${result?.user?.firstName ? `, ${result.user.firstName}` : ""}!`,
        );
        navigate("/contractor/dashboard");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      // Extract error message
      let errorMessage = "Login failed. Please try again.";

      if (isFetchBaseQueryError(error)) {
        // Handle different status codes
        if (error.status === 401) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
        } else if (error.status === 404) {
          errorMessage =
            "No account found with this email. Please sign up first.";
        } else if (error.status === 403) {
          errorMessage =
            "Your account has been suspended. Please contact support.";
        } else if (error.status === 429) {
          errorMessage =
            "Too many login attempts. Please try again in a few minutes.";
        } else if (error.status === 500 || error.status === 503) {
          errorMessage =
            "Server error. Please try again later or contact support.";
        } else if (
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof (error.data as { message: string }).message === "string"
        ) {
          errorMessage = (error.data as { message: string }).message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);

      // Mark credential fields with errors for auth failures
      if (
        isFetchBaseQueryError(error) &&
        (error.status === 401 || error.status === 404)
      ) {
        setFieldErrors({
          email: CREDENTIAL_ERROR_MSG,
          password: CREDENTIAL_ERROR_MSG,
        });
      }
    }
  };

  const features = [
    {
      icon: LayoutDashboard,
      title: "Career Dashboard",
      description:
        "Track your applications and manage your profile in one place.",
      color: "bg-emerald-500/20 text-emerald-400",
    },
    {
      icon: Star,
      title: "Premium Matches",
      description: "Get exclusive access to roles that match your top skills.",
      color: "bg-primary/20 text-primary",
    },
    {
      icon: ShieldCheck,
      title: "Verified Profile",
      description: "Strengthen your credibility with skill assessments.",
      color: "bg-green-500/20 text-green-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#080b14] p-12 flex-col justify-between relative overflow-hidden shrink-0 border-r border-white/5">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              HIRION
            </span>
          </Link>

          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
              <span className="text-white/80 text-[10px] font-bold tracking-[0.1em] uppercase">
                Candidate Portal
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Welcome Back,
              <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Contractor
              </span>
            </h1>

            <p className="text-xl text-white/50 leading-relaxed font-light">
              Log in to access your dream contracts and manage your professional
              profile.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6 mt-12">
          <div className="grid gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex items-start gap-4 p-5 bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Premium Login Section */}
      <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#030303] overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16">
          <div className="w-full max-w-[500px]">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-12 flex flex-col items-center">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                  HIRION
                </span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-[36px] blur-xl opacity-50 dark:opacity-20" />

              <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-white/[0.05] p-8 md:p-10">
                <div className="mb-10 text-center lg:text-left">
                  <h3 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    Sign In
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Enter your candidate credentials below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300 z-10" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                          fieldErrors.email && touched.email
                            ? "border-red-500 dark:border-red-500 focus:ring-red-500/10"
                            : ""
                        }`}
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        required
                      />
                    </div>
                    {touched.email && (
                      <ErrorMessage error={fieldErrors.email} />
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                        Password
                      </Label>
                      <Link
                        to="/forgot-password"
                        title="Forgot Password"
                        className="text-xs font-bold text-primary dark:text-emerald-400 hover:opacity-80 transition-opacity"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300 z-10" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className={`h-12 pl-12 pr-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                          fieldErrors.password && touched.password
                            ? "border-red-500 dark:border-red-500 focus:ring-red-500/10"
                            : ""
                        }`}
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("password")}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {touched.password && (
                      <ErrorMessage error={fieldErrors.password} />
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold mt-4 rounded-2xl bg-primary dark:bg-primary text-white hover:opacity-90 shadow-2xl shadow-primary/10 transition-all active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <SpinnerLoader className="w-5 h-5 text-current" />
                        <span>Logging you in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/[0.03] flex flex-col items-center gap-4">
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    New to Hirion?{" "}
                    <Link
                      to="/candidate-signup"
                      className="text-primary hover:text-emerald-500 transition-colors underline-offset-8 underline decoration-primary/30"
                    >
                      Create Contractor Account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateLogin;

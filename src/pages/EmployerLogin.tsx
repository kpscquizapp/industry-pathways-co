import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  Target,
  Users,
  TrendingUp,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/slices/userAuth";
import { RootState } from "@/app/store";
import { useLoginEmployerMutation } from "@/app/queries/loginApi";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";

// ==================== VALIDATION ====================
const CREDENTIAL_ERROR_MSG = "Please check your credentials";

const VALIDATION = {
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    validate: (email: string) => {
      const trimmed = email?.trim() ?? "";
      if (!trimmed) return "Email address is required";
      if (!VALIDATION.email.regex.test(trimmed)) {
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
const EmployerLogin = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginEmployerMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userDetails && userDetails.role === "employer") {
      navigate("/employer-dashboard");
    }
  }, [userDetails, navigate]);

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

    // Clear previous API-set field errors before making new request
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      for (const key of Object.keys(newErrors)) {
        if (key.startsWith("credential")) {
          delete newErrors[key];
        }
      }
      return newErrors;
    });

    try {
      const result = await login({
        email: formData.email.toLowerCase().trim(), // Sanitize email
        password: formData.password,
      }).unwrap();

      dispatch(setUser(result));
      toast.success(
        `Welcome back${result?.user?.firstName ? `, ${result.user.firstName}` : ""}!`,
      );
      navigate("/employer-dashboard");
    } catch (error: unknown) {
      // Extract error message
      let errorMessage = "Login failed. Please try again.";

      if (isFetchBaseQueryError(error)) {
        // Handle different status codes
        if (error.status === 401 || error.status === 404) {
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
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
      if (isFetchBaseQueryError(error)) {
        if (error.status === 404 || error.status === 401) {
          setFieldErrors({
            email: CREDENTIAL_ERROR_MSG,
            password: CREDENTIAL_ERROR_MSG,
          });
        }
      }
    }
  };

  const features = [
    {
      icon: Zap,
      title: "AI technical fit score",
      description:
        "Skip up to three rounds with 0-100 fit scores from coding tests and assessments.",
      color: "bg-blue-500/20 text-blue-400",
    },
    {
      icon: Target,
      title: "Bench-to-billable",
      description:
        "List idle talent, get matched to contract demand, and turn bench into a profit center.",
      color: "bg-green-500/20 text-green-400",
    },
    {
      icon: Users,
      title: "AI skill filtering",
      description:
        "Only validated experts surface to your recruiters across permanent & contract roles.",
      color: "bg-purple-500/20 text-purple-400",
    },
    {
      icon: TrendingUp,
      title: "Growth ecosystem",
      description:
        "Career path visualization and continuous upskilling keep your best engaged.",
      color: "bg-orange-500/20 text-orange-400",
    },
  ];

  const stats = [
    { value: "40%", label: "Reduction in hiring time" },
    { value: "3x", label: "Faster deployment" },
    { value: "100%", label: "Skills verified" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#080b14] p-12 flex-col justify-between relative overflow-hidden shrink-0 border-r border-white/5">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-green-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              HIRION
            </span>
          </Link>

          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <Shield className="h-3 w-3 text-green-400" />
              <span className="text-white/80 text-[10px] font-bold tracking-[0.1em] uppercase">
                Enterprise Grade Platform
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Move Beyond <br />
              <span className="bg-gradient-to-r from-blue-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                Resumes.
              </span>
            </h1>

            <p className="text-xl text-white/50 leading-relaxed font-light">
              Sign in to manage hiring, deployments, and bench monetization from
              a single, AI-enabled workspace.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-4 bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">
                  {feature.title}
                </h3>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Section */}
      <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#030303] overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 lg:p-12 xl:p-16">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-12 flex flex-col items-center">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                  HIRION
                </span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-[36px] blur-xl opacity-50 dark:opacity-20" />
              <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-white/[0.05] p-8 md:p-10 md:min-w-[32rem] ">
                <div className="mb-10">
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    Employer Login
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Access your enterprise talent dashboard.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                      Work Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-all duration-300 z-10" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        autoComplete="email"
                        className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 font-medium ${
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
                    <div className="flex justify-between items-center mb-1">
                      <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                        Password
                      </Label>
                      <Link
                        to="/forgot-password"
                        virtual-link="forgot-password"
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-wider"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-all duration-300 z-10" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className={`h-12 pl-12 pr-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 font-medium ${
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

                  {/* <div className="flex items-center space-x-2 py-2">
                    <Checkbox 
                      id="keep-signed-in" 
                      checked={keepSignedIn}
                      onCheckedChange={(checked) => setKeepSignedIn(!!checked)}
                      className="border-slate-300 dark:border-white/10 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label htmlFor="keep-signed-in" className="text-sm font-medium leading-none text-slate-500 dark:text-slate-400 cursor-pointer select-none">
                      Keep me signed in
                    </label> */}
                  {/* </div> */}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold mt-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 shadow-2xl shadow-slate-900/10 dark:shadow-white/5 transition-all active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>

                  {/* <Button 
                    type="button" 
                    variant="outline"
                    className="w-full h-14 text-base font-bold rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300"
                    onClick={() => navigate("/employer-signup")}
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Request Employer Access
                  </Button> */}
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/[0.03] flex flex-col items-center gap-4">
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    Don't have an account yet?{" "}
                    <Link
                      to="/employer-signup"
                      className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-colors underline-offset-8 underline decoration-blue-500/30"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide leading-relaxed">
              From resumes to real results. From hiring to deployment. <br />
              Enterprise-grade talent ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerLogin;

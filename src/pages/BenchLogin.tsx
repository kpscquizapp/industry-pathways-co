import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HirionLogo from "../assets/White Option.png";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Users,
  TrendingUp,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useLoginHrMutation } from "@/app/queries/loginApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/slices/userAuth";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { RootState } from "@/app/store";
import {
  CREDENTIAL_ERROR_MSG,
  clearCredentialErrors,
  clearLoginFieldErrors,
  getLoginErrorDetails,
  sanitizeLoginEmail,
  validateLoginField,
  validateLoginForm,
} from "@/services/utils/loginValidation";

const FEATURES = [
  {
    icon: Users,
    title: "Bench Talent Pool",
    description: "Maximize ROI by listing your idle resources.",
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    icon: TrendingUp,
    title: "AI-Powered Matching",
    description: "Our engine finds the perfect projects for your bench.",
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    icon: Shield,
    title: "Secure Contracts",
    description: "Automated legal and billing workflows.",
    color: "bg-primary/20 text-primary",
  },
] as const;

// ==================== COMPONENT ====================
const BenchLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginHrMutation();
  const userDetails = useSelector((state: RootState) => state.user.userDetails);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userDetails && userDetails.role === "hr") {
      navigate("/bench-dashboard");
    }
  }, [userDetails, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if ((name === "email" || name === "password") && fieldErrors[name]) {
      setFieldErrors((prev) => {
        return clearLoginFieldErrors(prev, name);
      });
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: "email" | "password") => {
    const error = validateLoginField(field, formData);

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
    // Always mark all fields as touched on submit attempt
    setTouched({ email: true, password: true });

    const { errors, firstError } = validateLoginForm(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors as Record<string, string>);

      // Show the first error in a toast
      if (firstError) toast.error(firstError);

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
    setFieldErrors((prev) => clearCredentialErrors(prev));

    try {
      const result = await login({
        email: sanitizeLoginEmail(formData.email),
        password: formData.password,
      }).unwrap();

      dispatch(setUser(result));
      toast.success(
        `Welcome back${result?.user?.firstName ? `, ${result.user.firstName}` : ""}!`,
      );
      navigate("/bench-dashboard");
    } catch (error: unknown) {
      const { message, hasCredentialError } = getLoginErrorDetails(error);
      toast.error(message);

      if (hasCredentialError) {
        setFieldErrors({
          email: CREDENTIAL_ERROR_MSG,
          password: CREDENTIAL_ERROR_MSG,
        });
      }
    }
  };

  return (
    
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Immersive Branding */}
     <div className="hidden lg:flex lg:w-[50%] bg-[#080b20] px-16 py-8 flex-col justify-center relative overflow-hidden shrink-0 border-r border-white/5">
  <div className="absolute top-0 left-0 w-full h-full opacity-[0.15] pointer-events-none animate-pulse-slow">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dotGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#fff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotGrid)" opacity="0.4" />
    </svg>
  </div>
        <div className="absolute z-10 top-8 left-16 animate-fade-up">
  <div className="relative z-10" style={{marginBottom: "4rem",marginTop:"1rem"}}>
  <Link to="/" className="flex items-center gap-3 group" >
    <img src={HirionLogo} alt="Hirion Logo" className="w-44 h-auto" />
  </Link>
</div>




<div className="space-y-8 max-w-lg" style={{marginTop:"10rem"}}>
  <div className="inline-flex items-center gap-2">
    <span className="text-[#4DD9E8] text-[11px] font-semibold tracking-[0.15em] uppercase">
      BENCH DASHBOARD</span></div>

  <h1 className="text-[44px] font-bold text-white leading-[1.2] tracking-tight">
    Welcome back,<br />
    <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
      let's build.
    </span>
  </h1>

  <p className="text-[16px] text-white/40 leading-relaxed max-w-sm">
    Access your projects, track interviews, and manage your bench profile — all in one place.
  </p>

</div>
        </div>

      </div>

      {/* Right Panel - Premium Login Section */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto animate-fade-up">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16">
          <div className="w-full max-w-[500px]">
           <div className="lg:hidden mb-12 flex flex-col items-center">
  <Link to="/" className="flex items-center gap-2 mb-2">
   <img src={HirionLogo} alt="Hirion Logo" className="w-32 h-12 object-contain invert" />
  </Link>
  <p className="text-xs text-gray-400 uppercase tracking-widest">Bench Dashboard</p>
</div>

            <div className="relative">
             <div className="p-8 md:p-10">

                <div className="mb-10 text-center lg:text-left">
                  <h3 className="text-4xl font-bold text-[#1a1a2e] mb-3 lg:text-left text-center">
                    Sign In
                  </h3>
                  <p className="text-slate-400 font-medium lg:text-left text-center text-sm">
                   Enter your partner credentials below.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Email Field */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1" htmlFor="email" style={{fontSize: "13px", fontWeight: "600", color: "rgb(26, 26, 46)", letterSpacing: "0.02em"}}>
                    Email Address
                      </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300 z-10" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="bench@example.com"
                        autoComplete="email"
                        className={`h-12 w-full pl-12 pr-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700 transition-all duration-300 font-medium ${
                          fieldErrors.email && touched.email
                            ? "ring-2 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500"
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
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-1" htmlFor="password" style={{fontSize: "13px", fontWeight: "600", color: "rgb(26, 26, 46)", letterSpacing: "0.02em"}}>
  Password
</label>
                      <Link
                        to="/forgot-password"
                        title="Forgot Password"
                        className="text-xs font-semibold text-slate-400 hover:text-teal-600 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300 z-10" />
                      <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        className={`h-12 w-full pl-12 pr-12 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none text-slate-700 transition-all duration-300 font-medium ${
                          fieldErrors.password && touched.password
                            ? "ring-2 ring-red-500 focus:ring-red-500 focus-visible:ring-red-500"
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
  className="w-full h-[52px] text-[15px] font-bold mt-4 rounded-xl text-white hover:opacity-90 transition-all active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
  style={{background: "linear-gradient(135deg, rgb(77, 217, 232), rgb(14, 165, 233))", boxShadow: "rgba(77, 217, 232, 0.35) 0px 4px 20px"}}
  disabled={isLoading}
>
  {isLoading ? (
    <div className="flex items-center gap-3">
      <SpinnerLoader className="w-5 h-5 text-current" />
      <span>Logging you in...</span>
    </div>
  ) : (
    <div className="flex items-center justify-center gap-3">
      <span>Sign In to Dashboard</span>
      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </div>
  )}
</Button>
                </form>

                <div className="mt-12 text-center text-sm font-medium text-slate-400">
                  <p className="mt-12 text-center text-sm font-medium text-slate-400">
                    New to QuickRekruit?{" "}
                    <Link
                      to="/bench-registration"
                      className="text-teal-500 font-bold hover:underline"
                    >
                      Bench Signup
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

export default BenchLogin;

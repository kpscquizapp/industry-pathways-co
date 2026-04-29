import React, { useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Target,
  User,
  FileText,
  Upload,
  X,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useCheckExistingEmailMutation,
  useRegisterEmployerMutation,
  useSendVerificationOtpMutation,
  useVerifyOtpMutation,
} from "@/app/queries/loginApi";
import { toast } from "sonner";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";
import { VALIDATION } from "@/services/utils/signUpValidation";
import logo from "@/assets/White Option.png";
import logo2 from "@/assets/Dark Option.png";

type EmployerFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  companyName: string;
  companyDetails: string;
};
type FieldErrorKey = keyof EmployerFormData | "companyDocument" | "otp";

interface StepConfig {
  id: number;
  label: string;
  title: string;
  subtitle: string;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    label: "ACCOUNT",
    title: "Employer Signup",
    subtitle: "Start your journey as a hiring partner.",
  },
  {
    id: 2,
    label: "COMPANY",
    title: "Organization Profile",
    subtitle: "Tell us about your company and mission.",
  },
  {
    id: 3,
    label: "PREFERENCES",
    title: "Verification Docs",
    subtitle: "Finalize your settings and join the ecosystem.",
  },
];

const EmployerSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;

  const [formData, setFormData] = useState<EmployerFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    companyName: "",
    companyDetails: "",
  });

  const [companyDocument, setCompanyDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field-level errors for better UX
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldErrorKey, string>>
  >({});

  const [registerEmployer] = useRegisterEmployerMutation();
  const [checkExistingEmail, { isLoading: isCheckingEmail }] =
    useCheckExistingEmailMutation();
  const [sendVerificationOtp, { isLoading: isSendingOtp }] =
    useSendVerificationOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  const handleSendOtp = React.useCallback(async () => {
    try {
      await sendVerificationOtp({ email: formData.email }).unwrap();
      toast.success("Verification code sent to your email.");
      setResendCooldown(60);
    } catch (err) {
      toast.error("Failed to send verification code. Please try again.");
    }
  }, [formData.email, sendVerificationOtp]);

  const handleVerifyOtp = React.useCallback(async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }
    try {
      await verifyOtp({ email: formData.email, otp }).unwrap();
      setIsEmailVerified(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      toast.error("Invalid verification code. Please check and try again.");
    }
  }, [formData.email, otp, verifyOtp]);

  /* ── Timer for OTP resend cooldown ── */
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Reset email verification when email changes
    if (name === "email" && value !== formData.email && isEmailVerified) {
      setIsEmailVerified(false);
      setOtp("");
    }

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear confirmPassword error when editing either password field
    if (
      (name === "password" || name === "confirmPassword") &&
      fieldErrors.confirmPassword
    ) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file
      const fileError = VALIDATION.document.validate(file);
      if (fileError) {
        toast.error(fileError);
        setCompanyDocument(null);
        setFieldErrors((prev) => ({
          ...prev,
          companyDocument: fileError,
        }));
        e.target.value = "";
        return;
      }

      setCompanyDocument(file);

      // Clear document error if it exists
      if (fieldErrors.companyDocument) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.companyDocument;
          return newErrors;
        });
      }
    }
  };

  const removeFile = () => {
    setCompanyDocument(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateStep = async (): Promise<boolean> => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      // Validate first name
      const firstNameError = VALIDATION.name.validate(
        formData.firstName,
        "First name",
      );
      if (firstNameError) errors.firstName = firstNameError;

      // Validate last name
      const lastNameError = VALIDATION.name.validate(
        formData.lastName,
        "Last name",
      );
      if (lastNameError) errors.lastName = lastNameError;

      // Validate email
      const emailError = VALIDATION.email.validate(formData.email);
      if (emailError) errors.email = emailError;
      // Check email availability only when format is valid
      if (!emailError && formData.email) {
        try {
          await checkExistingEmail({ email: formData.email }).unwrap();
        } catch (error) {
          if (isFetchBaseQueryError(error) && error.status === 409) {
            errors.email =
              "Email already registered, please use a different email.";
          } else {
            errors.email =
              "Could not verify email right now. Please try again.";
          }
        }
      }

      // Validate password
      const passwordError = VALIDATION.password.validate(formData.password);
      if (passwordError) errors.password = passwordError;
      // Validate confirm password
      const confirmPasswordError = VALIDATION.confirmPassword.validate(
        formData.password,
        formData.confirmPassword,
      );
      if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    } else if (currentStep === 2) {
      // Validate email verification
      if (!isEmailVerified) {
        errors.otp = "Please verify your email to proceed";
      }

      // Validate company name
      const companyNameError = VALIDATION.companyName.validate(
        formData.companyName,
      );
      if (companyNameError) errors.companyName = companyNameError;

      // Validate company details (optional, but enforce max length)
      const companyDetailsError = VALIDATION.companyDetails.validate(
        formData.companyDetails,
      );
      if (companyDetailsError) errors.companyDetails = companyDetailsError;
    } else if (currentStep === 3) {
      // Validate document
      const documentError = VALIDATION.document.validate(companyDocument);
      if (documentError) errors.companyDocument = documentError;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      // Show the first error in a toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);

      return false;
    }

    setFieldErrors({});
    return true;
  };

  const nextStep = async () => {
    if (await validateStep()) {
      if (currentStep === 1 && !isEmailVerified) {
        handleSendOtp();
      }
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setFieldErrors({}); // Clear errors when going back
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      await nextStep();
      return;
    }

    if (!(await validateStep())) return;

    setIsLoading(true);

    try {
      const submissionData = new FormData();

      // Sanitize and append data
      submissionData.append("email", formData.email.toLowerCase().trim());
      submissionData.append("password", formData.password);
      submissionData.append("firstName", formData.firstName.trim());
      submissionData.append("lastName", formData.lastName.trim());
      submissionData.append("companyName", formData.companyName.trim());

      // Only append companyDetails if provided (optional field)
      if (formData.companyDetails && formData.companyDetails.trim()) {
        submissionData.append("companyDetails", formData.companyDetails.trim());
      }

      if (companyDocument) {
        submissionData.append("companyDocument", companyDocument);
      }

      await registerEmployer(submissionData).unwrap();

      toast.success(
        "Registration successful! Welcome to the enterprise platform.",
      );
      navigate("/hire-talent-login");
    } catch (error: unknown) {
      // Handle specific error cases
      if (isFetchBaseQueryError(error)) {
        if (
          typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof (error.data as Record<string, unknown>).message === "string"
        ) {
          toast.error((error.data as { message: string }).message);
        } else if (error.status === 409) {
          toast.error(
            "An account with this email already exists. Please login instead.",
          );
        } else if (error.status === 400) {
          toast.error(
            "Invalid registration data. Please check your inputs and try again.",
          );
        } else {
          toast.error(
            "Registration failed. Please try again or contact support if the issue persists.",
          );
        }
      } else {
        toast.error(
          "Registration failed. Please try again or contact support if the issue persists.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: CheckCircle2,
      label: "AI-verified skill scores",
      color: "text-primary",
    },
    {
      icon: Target,
      label: "Bench to billable in days",
      color: "text-emerald-400",
    },
    { icon: Sparkles, label: "Automated screening", color: "text-green-400" },
    {
      icon: TrendingUp,
      label: "Monetize internal talent",
      color: "text-emerald-500",
    },
  ];

  const stats = [
    {
      id: "stat-time-to-hire",
      value: "40%",
      label: "Time to Hire",
      sub: "with AI scoring",
    },
    {
      id: "stat-bench-util",
      value: "30%",
      label: "Bench Utilization",
      sub: "revenue growth",
    },
  ];

  const currentStepCfg = STEPS[currentStep - 1];

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 5,
        delay: Math.random() * 6,
        dur: 8 + Math.random() * 10,
      })),
    [],
  );

  return (
    <div className="flex min-h-screen w-full bg-[#f3f5f8] font-inter overflow-x-hidden">
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-y {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .animate-fade-up { animation: fade-up 0.6s ease forwards; }
        .login-left-panel { display: none; }
        .login-right-panel { 
          flex: 1 1 auto; 
          width: 100%; 
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
        }
        .login-mobile-brand { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; margin-bottom: 24px; width: 100%; animation: fade-up 0.55s ease; padding-top: 24px; }
        
        @media (min-width: 1025px) {
          .login-left-panel { 
            display: flex; 
            flex: 0 0 50%; 
            width: 50%; 
            max-width: 50%; 
            min-height: 100vh; 
            position: relative; 
            padding: 60px 64px;
          }
          .login-right-panel { 
            flex: 0 0 50%; 
            width: 50%; 
            max-width: 50%; 
            justify-content: center; 
            padding: 60px 70px; 
          }
          .login-mobile-brand { display: none; }
        }

        /* Stepper Responsiveness matching ContractorSignup */
        @media (max-width: 640px) {
          .stepper-label { display: none; }
          .stepper-dot { width: 32px !important; height: 32px !important; font-size: 11px !important; }
          .stepper-connector { width: 30px !important; background-color: #f1f5f9 !important; height: 2px !important; }
          .stepper-container { 
            gap: 12px !important; 
            margin-bottom: 32px !important;
            background: white;
            padding: 16px 20px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.04);
            border: 1px solid rgba(226,232,240,0.8);
            width: 100%;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
          }
          .mobile-brand-tagline {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #64748b;
            margin-top: 12px;
            margin-bottom: 20px;
          }
        }
      `}</style>

      {/* Left Panel - Hero Branding (Match ContractorSignup animation) */}
      <div
        className="login-left-panel flex-col justify-center p-16 px-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0d1117 0%, #111827 40%, #0c1a2a 100%)",
        }}
      >
        {/* Floating particles - Same as ContractorSignup */}
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
              animation: `float-y ${p.dur}s ease-in-out ${p.delay}s infinite, pulse-soft ${p.dur * 0.7}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        {/* Grid pattern - Same as ContractorSignup */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-[36px] left-[50px] z-20 animate-fade-up">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Logo" className="w-44 h-auto" />
          </Link>
        </div>

        <div className="relative z-10 animate-fade-up">
          <div className="max-w-lg text-left">
            <div className="inline-flex items-center gap-2 mb-4 opacity-90">
              <span className="text-[#4DD9E8] text-[11px] font-bold tracking-[0.18em] uppercase">
                HIRING PARTNER REGISTRATION
              </span>
            </div>

            <h1 className="text-[44px] font-bold text-white leading-[1.15] tracking-tight mb-4">
              Ready to build your
              <br />
              <span className="text-[#4DD9E8]">dream team?</span>
            </h1>

            <p className="text-[16px] text-white/55 leading-relaxed max-w-sm mt-8">
              Join the ecosystem of elite companies and find the perfect match
              for your company's growth trajectory.
            </p>

            <div className="space-y-4 mt-12 relative z-10">
              {[
                "Access to top-tier candidates",
                "Build your talent pipeline",
                "Streamlined hiring process",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#4DD9E8]/10 border border-[#4DD9E8]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4DD9E8]" />
                  </div>
                  <span className="text-white/80 text-[14px] font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Section */}
      <div className="login-right-panel overflow-y-auto bg-white font-inter">
        {/* Mobile Logo */}
        <div className="login-mobile-brand text-center sm:py-4">
          <Link to="/" className="inline-block">
            <img src={logo2} alt="Logo" className="w-[180px] h-auto mx-auto" />
          </Link>
          <div className="mobile-brand-tagline">Hiring Partner Onboarding</div>
        </div>

        <div className="flex flex-col items-center justify-center sm:py-6">
          <div className="w-full max-w-[520px] animate-fade-up [animation-delay:150ms]">
            {/* Custom Stepper - No Glow & Connector Styles */}
            <div className="stepper-container flex items-center justify-center mb-9 gap-x-2 sm:gap-x-4">
              {STEPS.map((item, index) => (
                <div key={item.id} className="flex items-center text-[11px]">
                  <div className="flex items-center gap-2">
                    <div
                      className={`stepper-dot w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                        currentStep >= item.id
                          ? "bg-[#4DD9E8] text-white"
                          : "bg-slate-100 text-slate-400 border border-slate-50"
                      }`}
                    >
                      {currentStep > item.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        item.id
                      )}
                    </div>
                    <span
                      className={`stepper-label text-[10px] sm:text-[11px] font-semibold tracking-widest transition-colors duration-300 ${
                        currentStep >= item.id
                          ? "text-[#080b20]"
                          : "text-[#bbb]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="stepper-connector w-6 sm:w-12 h-[1px] bg-slate-200 mx-2" />
                  )}
                </div>
              ))}
            </div>

            <div className="employer-form-shell bg-white dark:bg-[#0a0a0a] rounded-[24px] sm:bg-transparent sm:dark:bg-transparent sm:p-0 py-8 px-4 shadow-[0_10px_32px_rgba(0,0,0,0.05)] sm:shadow-none border border-slate-100 sm:border-0">
              <div className="mb-8 lg:text-left text-center">
                <h3 className="text-3xl font-bold text-[#1a1a2e] mb-2">
                  {currentStepCfg.title}
                </h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  {currentStepCfg.subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {(currentStep === 1 ||
                  currentStep === 2 ||
                  currentStep === 3) && (
                  <div className="space-y-5 animate-fade-up">
                    {currentStep === 1 && (
                      <div className="space-y-5 animate-fade-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                              First Name{" "}
                              <span className="text-[#4DD9E8]">*</span>
                            </Label>
                            <div
                              className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                                fieldErrors.firstName
                                  ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                  : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                              }`}
                            >
                              <User className="w-4 h-4 text-[#aaa] shrink-0" />
                              <input
                                name="firstName"
                                placeholder="John"
                                className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                                value={formData.firstName}
                                onChange={handleInputChange}
                              />
                            </div>
                            <ErrorMessage error={fieldErrors.firstName} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                              Last Name{" "}
                              <span className="text-[#4DD9E8]">*</span>
                            </Label>
                            <div
                              className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                                fieldErrors.lastName
                                  ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                  : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                              }`}
                            >
                              <User className="w-4 h-4 text-[#aaa] shrink-0" />
                              <input
                                name="lastName"
                                placeholder="Doe"
                                className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                                value={formData.lastName}
                                onChange={handleInputChange}
                              />
                            </div>
                            <ErrorMessage error={fieldErrors.lastName} />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                            Work Email <span className="text-[#4DD9E8]">*</span>
                          </Label>
                          <div
                            className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                              fieldErrors.email
                                ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                            }`}
                          >
                            <Mail className="w-4 h-4 text-[#aaa] shrink-0" />
                            <input
                              name="email"
                              type="email"
                              placeholder="company@example.com"
                              className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.email} />
                          {isCheckingEmail && (
                            <div className="text-sm text-slate-500 flex items-center gap-2 mt-3">
                              <SpinnerLoader />{" "}
                              <span>Checking availability...</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                              Password <span className="text-[#4DD9E8]">*</span>
                            </Label>
                            <div
                              className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                                fieldErrors.password
                                  ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                  : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                              }`}
                            >
                              <Lock className="w-4 h-4 text-[#aaa] shrink-0" />
                              <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal w-full"
                                value={formData.password}
                                onChange={handleInputChange}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="flex items-center justify-center h-full px-1 focus:outline-none transition-transform active:scale-95"
                              >
                                {showPassword ? (
                                  <Eye className="w-[18px] h-[18px] text-slate-400 hover:text-[#4DD9E8] transition-colors" />
                                ) : (
                                  <EyeOff className="w-[18px] h-[18px] text-slate-400 hover:text-[#4DD9E8] transition-colors" />
                                )}
                              </button>
                            </div>
                            <ErrorMessage error={fieldErrors.password} />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                              Confirm Password{" "}
                              <span className="text-[#4DD9E8]">*</span>
                            </Label>
                            <div
                              className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                                fieldErrors.confirmPassword
                                  ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                  : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                              }`}
                            >
                              <Lock className="w-4 h-4 text-[#aaa] shrink-0" />
                              <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal w-full"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="flex items-center justify-center h-full px-1 focus:outline-none transition-transform active:scale-95"
                              >
                                {showConfirmPassword ? (
                                  <Eye className="w-[18px] h-[18px] text-slate-400 hover:text-[#4DD9E8] transition-colors" />
                                ) : (
                                  <EyeOff className="w-[18px] h-[18px] text-slate-400 hover:text-[#4DD9E8] transition-colors" />
                                )}
                              </button>
                            </div>
                            <ErrorMessage error={fieldErrors.confirmPassword} />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fade-up">
                        {/* Email Verification Section */}
                        <div
                          className={`rounded-2xl p-5 border-[1.5px] transition-all duration-200 ${
                            isEmailVerified
                              ? "bg-emerald-50/30 border-emerald-100"
                              : "bg-[#f8f9fb] border-[#e8eaef]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                                  isEmailVerified
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                              >
                                {isEmailVerified ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Mail className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <h4 className="text-[15px] font-bold text-[#1a1a2e]">
                                  Email Verification
                                </h4>
                                <p className="text-[12px] text-slate-400">
                                  {formData.email}
                                </p>
                              </div>
                            </div>
                            {isEmailVerified && (
                              <span className="text-[12px] font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>

                          {!isEmailVerified && (
                            <div className="space-y-4">
                              <div className="flex flex-col gap-1.5">
                                <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                                  Enter 6-digit Code
                                </Label>
                                <div className="flex gap-3">
                                  <div
                                    className={`flex-1 flex items-center gap-2.5 bg-white border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                                      fieldErrors.otp
                                        ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                        : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                                    }`}
                                  >
                                    <Lock className="w-4 h-4 text-[#aaa] shrink-0" />
                                    <input
                                      placeholder="000000"
                                      maxLength={6}
                                      className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-medium tracking-[0.2em]"
                                      value={otp}
                                      onChange={(e) => {
                                        setOtp(
                                          e.target.value.replace(/\D/g, ""),
                                        );
                                        if (fieldErrors.otp) {
                                          setFieldErrors((prev) => {
                                            const newErrors = { ...prev };
                                            delete newErrors.otp;
                                            return newErrors;
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={
                                      isVerifyingOtp || otp.length !== 6
                                    }
                                    className="h-[46px] px-6 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white font-bold rounded-[10px] transition-all"
                                  >
                                    {isVerifyingOtp ? (
                                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      "Verify"
                                    )}
                                  </Button>
                                </div>
                                <ErrorMessage error={fieldErrors.otp} />
                              </div>

                              <div className="flex items-center justify-between text-[12px]">
                                <span className="text-slate-400">
                                  Didn't receive the code?
                                </span>
                                <button
                                  type="button"
                                  onClick={handleSendOtp}
                                  disabled={isSendingOtp || resendCooldown > 0}
                                  className={`font-bold transition-colors ${
                                    isSendingOtp || resendCooldown > 0
                                      ? "text-slate-300 cursor-not-allowed"
                                      : "text-[#4DD9E8] hover:text-[#0e8a96] underline"
                                  }`}
                                >
                                  {isSendingOtp
                                    ? "Sending..."
                                    : resendCooldown > 0
                                      ? `Resend in ${resendCooldown}s`
                                      : "Resend Code"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                            Organization Name{" "}
                            <span className="text-[#4DD9E8]">*</span>
                          </Label>
                          <div
                            className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${
                              fieldErrors.companyName
                                ? "border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                                : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                            }`}
                          >
                            <Building2 className="w-4 h-4 text-[#aaa] shrink-0" />
                            <input
                              name="companyName"
                              placeholder="Organization Ltd."
                              className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                              value={formData.companyName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.companyName} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                            Company Details (Optional)
                          </Label>
                          <div
                            className={`flex flex-col gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] p-3.5 transition-all duration-200 ${
                              fieldErrors.companyDetails
                                ? "border-red-500"
                                : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"
                            }`}
                          >
                            <textarea
                              name="companyDetails"
                              placeholder="Tell us about your organization..."
                              className="min-h-[120px] bg-transparent border-none focus:ring-0 p-0 text-sm font-normal resize-none shadow-none outline-none"
                              value={formData.companyDetails}
                              onChange={handleInputChange}
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.companyDetails} />
                          <div className="text-[11px] text-slate-400 text-right">
                            {formData.companyDetails.length}/1000
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-5 animate-fade-up">
                        <div className="flex flex-col gap-3">
                          <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                            Verification Document{" "}
                            <span className="text-[#4DD9E8]">*</span>
                          </Label>

                          {!companyDocument ? (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className={`group cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center gap-4 ${
                                fieldErrors.companyDocument
                                  ? "border-red-500 bg-red-50/10"
                                  : "border-slate-100 hover:border-[#4DD9E8] hover:bg-[#4DD9E8]/5"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-white group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-[#4DD9E8]" />
                              </div>
                              <div className="text-center">
                                <p className="text-[14px] font-bold text-[#1a1a2e]">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-[12px] text-slate-400 mt-1">
                                  PDF, DOC, DOCX or PDF (max. 10MB)
                                </p>
                              </div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 bg-[#f8f9fb] border border-slate-100 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#4DD9E8]/10 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-[#4DD9E8]" />
                                </div>
                                <div>
                                  <p className="text-[13px] font-bold text-[#1a1a2e] truncate max-w-[200px]">
                                    {companyDocument.name}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    {(
                                      companyDocument.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={removeFile}
                                className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors"
                              >
                                <X className="w-5 h-5 text-slate-400" />
                              </button>
                            </div>
                          )}
                          <ErrorMessage error={fieldErrors.companyDocument} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevStep}
                          className="h-[52px] px-6 rounded-xl hover:border-[#4DD9E8] text-[#1a1a2e] font-bold hover:bg-slate-50 hover:text-teal-600"
                        >
                          Back
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="flex-1 h-[52px] bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoading || isCheckingEmail}
                      >
                        {isLoading || isCheckingEmail ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </span>
                        ) : (
                          <>
                            <span>
                              {currentStep === totalSteps
                                ? "Create Account"
                                : "Next Step"}
                            </span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>

              <div className="mt-10 text-center text-sm font-medium text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/hire-talent-login"
                  className="text-teal-600 font-semibold hover:underline"
                >
                  Sign In to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;

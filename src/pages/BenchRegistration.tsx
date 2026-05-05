import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HirionLogo from "../assets/White Option.png";
import { CircleCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Sparkles,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Mail,
  Lock,
  User,
  Upload,
  FileIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCheckExistingEmailMutation,
  useRegisterHrMutation,
  useSendVerificationOtpMutation,
  useVerifyOtpMutation,
} from "@/app/queries/loginApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import RegistrationStepIndicator from "@/components/auth/RegistrationStepIndicator";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { VALIDATION } from "@/services/utils/signUpValidation";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";

const BenchRegistration = () => {
  const navigate = useNavigate();
  const [registerHr, { isLoading }] = useRegisterHrMutation();
  const [checkExistingEmail, { isLoading: isCheckingEmail }] =
    useCheckExistingEmailMutation();
  const [sendVerificationOtp, { isLoading: isSendingOtp }] =
    useSendVerificationOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    companyDetails: "",
    password: "",
    confirmPassword: "",
  });

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

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const stepInfo = [
    { title: "Account", desc: "Start your enterprise journey" },
    { title: "Details", desc: "Tell us about your organization" },
    { title: "Verify", desc: "Upload business documents" },
  ];



  const [companyDocument, setCompanyDocument] = useState<File | null>(null);

  // Field-level errors for better UX
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
      // if (!emailError && formData.email) {
      //   try {
      //     await checkExistingEmail({ email: formData.email }).unwrap();
      //   } catch (error) {
      //     if (isFetchBaseQueryError(error) && error.status === 409) {
      //       errors.email =
      //         "Email already registered, please use a different email.";
      //     } else {
      //       errors.email =
      //         "Could not verify email right now. Please try again.";
      //     }
      //   }
      // }

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

    const submitData = new FormData();

    // Sanitize and append data
    submitData.append("email", formData.email.toLowerCase().trim());
    submitData.append("password", formData.password);
    submitData.append("firstName", formData.firstName.trim());
    submitData.append("lastName", formData.lastName.trim());
    submitData.append("companyName", formData.companyName.trim());
    if (formData.companyDetails && formData.companyDetails.trim()) {
      submitData.append("companyDetails", formData.companyDetails.trim());
    }

    if (companyDocument) {
      submitData.append("companyDocument", companyDocument);
    }

    try {
      await registerHr(submitData).unwrap();
      toast.success("Registration successful! Please login to continue.");
      navigate("/bench-login");
    } catch (error: unknown) {
      // Handle specific error cases
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
            "Registration failed. Please try again or contact support if the issue persists.",
          );
        }
      } else {
        toast.error(
          "Registration failed. Please try again or contact support if the issue persists.",
        );
      }
    }
  };

  const features = [
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
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-[50%] px-16 py-8 flex-col justify-center relative overflow-hidden shrink-0 border-r border-white/5" style={{ background: "linear-gradient(160deg, rgb(13, 17, 23) 0%, rgb(17, 24, 39) 40%, rgb(12, 26, 42) 100%)" }}>
        {[
          { left: "29.1%", top: "19.3%", size: 6, delay: "2.7s", dur: "13.5s" },
          { left: "95.8%", top: "27.1%", size: 5.2, delay: "1.3s", dur: "14.7s" },
          { left: "27.4%", top: "14.6%", size: 4.4, delay: "1.8s", dur: "9.8s" },
          { left: "69.5%", top: "10.7%", size: 6.1, delay: "3.6s", dur: "9.4s" },
          { left: "1.7%", top: "8.8%", size: 3, delay: "4.9s", dur: "11.6s" },
          { left: "31.5%", top: "30.7%", size: 5.5, delay: "3.1s", dur: "17.2s" },
          { left: "32.1%", top: "93%", size: 3.3, delay: "4.2s", dur: "10.7s" },
          { left: "95.6%", top: "7.5%", size: 5.6, delay: "5.2s", dur: "10s" },
          { left: "43.8%", top: "50.9%", size: 3.7, delay: "3.8s", dur: "14.7s" },
          { left: "27.1%", top: "57.1%", size: 6.9, delay: "3s", dur: "11.4s" },
          { left: "76.8%", top: "5.6%", size: 4.1, delay: "5s", dur: "17.7s" },
          { left: "69.1%", top: "34.6%", size: 7, delay: "5.6s", dur: "8.8s" },
          { left: "43.3%", top: "9%", size: 4.6, delay: "0.07s", dur: "17.4s" },
          { left: "47.8%", top: "10.1%", size: 6.4, delay: "4.8s", dur: "10.4s" },
          { left: "20.9%", top: "63.5%", size: 5, delay: "2.9s", dur: "14.4s" },
          { left: "27.4%", top: "59.5%", size: 7.9, delay: "3.1s", dur: "8s" },
          { left: "94.7%", top: "72.1%", size: 5.5, delay: "2.9s", dur: "16.6s" },
          { left: "75.6%", top: "52.1%", size: 4.1, delay: "4s", dur: "16.4s" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            left: b.left,
            top: b.top,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: "50%",
            background: "rgba(77, 217, 232, 0.15)",
            animation: `floatY ${b.dur} ease-in-out ${b.delay} infinite, pulse ${b.dur} ease-in-out ${b.delay} infinite`
          }} />
        ))}

        <div style={{
          position: "absolute",
          bottom: "-80px",
          right: "-80px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          border: "1px solid rgba(77, 217, 232, 0.08)",
          background: "radial-gradient(circle, rgba(77, 217, 232, 0.04) 0%, transparent 70%)"
        }} />
        <div className="absolute z-10 top-8 left-16 animate-fade-up">
          <div className="relative z-10" style={{ marginBottom: "5rem", marginTop: "0.5rem", marginLeft: "-14px" }}>

            <Link to="/" className="flex items-center gap-3 group" >
              <img src={HirionLogo} alt="Hirion Logo" className="w-44 h-auto" />
            </Link>
          </div>




          <div className="space-y-8 max-w-lg" style={{ marginTop: "5rem" }}>
            <div className="inline-flex items-center gap-2">
              <span className="text-[#4DD9E8] text-[11.5px] font-semibold tracking-[0.15em] uppercase">

                BENCH REGISTRATION</span></div>

            <h1 className="text-[44px] font-bold text-white leading-[1.1] tracking-tight">
              Ready to build your<br />
              <span className="text-[#4DD9E8]">dream team?</span>
            </h1>

            <p className="text-[16px] text-white/50 leading-relaxed max-w-sm">Join the ecosystem of elite companies and find the perfect match for your company's growth trajectory.</p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#4DD9E8]/10 border border-[#4DD9E8]/20">
                  <CircleCheck className="w-3.5 h-3.5 text-[#4DD9E8]" />
                </div>
                <span className="text-white/80 text-[15px] font-medium">Access to top-tier candidates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#4DD9E8]/10 border border-[#4DD9E8]/20">
                  <CircleCheck className="w-3.5 h-3.5 text-[#4DD9E8]" />
                </div>
                <span className="text-white/80 text-[15px] font-medium">Build your talent pipeline</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#4DD9E8]/10 border border-[#4DD9E8]/20">
                  <CircleCheck className="w-3.5 h-3.5 text-[#4DD9E8]" />
                </div>
                <span className="text-white/80 text-[15px] font-medium">Streamlined hiring process</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Right Panel - Premium Form Section */}
      {/* Right Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col items-center justify-center sm:py-6 px-6 lg:px-12">
          <div className="w-full max-w-[540px] px-2 md:px-0 animate-fade-up">

            <div className="lg:hidden mb-12 flex flex-col items-center">
              <Link to="/" className="flex items-center gap-2 mb-2">
                <img src={HirionLogo} alt="Hirion Logo" className="w-[180px] h-12 object-contain invert" />
              </Link>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Hiring Partner Onboarding</p>
            </div>

            <div className="relative py-8 px-4 md:px-0">
              <RegistrationStepIndicator
                currentStep={currentStep}
                steps={stepInfo}
                totalSteps={totalSteps}
              />

              <div className="mb-8 lg:text-left text-center" >
                <h3 className="text-3xl sm:text-4xl font-bold text-[#1a1a2e] mb-2 sm:mb-3">
                  {currentStep === 1
                    ? "Bench Signup"
                    : currentStep === 2
                      ? "Company Details"
                      : "Verification"}
                </h3>
                <p className="text-slate-400 text-sm sm:text-[15px]">
                  {currentStep === 1
                    ? "Start your enterprise journey here."
                    : currentStep === 2
                      ? "Tell us more about your staffing company."
                      : "Upload documents for account verification."}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-5 ">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                          First Name <span className="text-[#4DD9E8]">*</span>
                        </Label>
                        <div className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.firstName ? "border-red-500" : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}>
                          <User className="w-4 h-4 text-[#aaa] shrink-0" />
                          <input
                            name="firstName"
                            placeholder="John"
                            className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.firstName} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                          Last Name <span className="text-[#4DD9E8]">*</span>
                        </Label>
                        <div className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.lastName ? "border-red-500" : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}>
                          <User className="w-4 h-4 text-[#aaa] shrink-0" />
                          <input
                            name="lastName"
                            placeholder="Smith"
                            className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.lastName} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                        Work Email <span className="text-[#4DD9E8]">*</span>
                      </Label>
                      <div className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.email ? "border-red-500" : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}>
                        <Mail className="w-4 h-4 text-[#aaa] shrink-0" />
                        <input
                          name="email"
                          type="email"
                          placeholder="bench@example.com"
                          className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {isCheckingEmail && (
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <SpinnerLoader />
                          <span>Checking availability...</span>
                        </div>
                      )}
                      <ErrorMessage error={fieldErrors.email} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                          Password <span className="text-[#4DD9E8]">*</span>
                        </Label>
                        <div className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.password ? "border-red-500" : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}>
                          <Lock className="w-4 h-4 text-[#aaa] shrink-0" />
                          <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal w-full"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.password} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                          Confirm Password <span className="text-[#4DD9E8]">*</span>
                        </Label>
                        <div className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.confirmPassword ? "border-red-500" : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}>
                          <Lock className="w-4 h-4 text-[#aaa] shrink-0" />
                          <input
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal w-full"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.confirmPassword} />
                      </div>
                    </div>


                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Email Verification Section */}
                    <div
                      className={`rounded-2xl p-5 border-[1.5px] transition-all duration-200 ${isEmailVerified
                        ? "bg-emerald-50/30 border-emerald-100"
                        : "bg-[#f8f9fb] border-[#e8eaef]"
                        }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isEmailVerified
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
                                className={`flex-1 flex items-center gap-2.5 bg-white border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.otp
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
                              className={`font-bold transition-colors ${isSendingOtp || resendCooldown > 0
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
                        ORGANIZATION NAME<span className="text-[#4DD9E8]">*</span>
                      </Label>
                      <div className={`flex items-center gap-2.5 bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 h-[46px] transition-all duration-200 ${fieldErrors.companyName ? "border-red-500" : "border-[#e8eaef] focus-within:border-[#4DD9E8] focus-within:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}>
                        <Building2 className="w-4 h-4 text-[#aaa] shrink-0" />
                        <input
                          name="companyName"
                          placeholder="Company Co."
                          className="flex-1 bg-transparent outline-none h-full p-0 text-sm font-normal"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <ErrorMessage error={fieldErrors.companyName} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                        ORGANIZATION DETAILS (OPTIONAL)
                      </Label>
                      <Textarea
                        name="companyDetails"
                        placeholder="Tell us about your staffing capabilities..."
                        maxLength={1000}
                        className={`min-h-[150px] bg-[#f8f9fb] border-[1.5px] rounded-[10px] px-3.5 transition-all duration-200 text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ${fieldErrors.companyDetails ? "border-red-500" : "border-[#e8eaef] focus:border-[#4DD9E8] focus:shadow-[0_0_0_3px_rgba(77,217,232,0.12)]"}`}
                        value={formData.companyDetails}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-slate-500 mt-2 ml-1">
                        {formData.companyDetails.length}/1000 characters
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-col gap-1.5">
                      <Label className="text-[13px] font-semibold text-[#1a1a2e] ml-1">
                        COMPANY DOCUMENT (ID/VERIFICATION) <span className="text-[#4DD9E8]">*</span>
                      </Label>
                      {!companyDocument ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              fileInputRef.current?.click();
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label="Upload company document"
                          className={`group relative border-2 border-dashed rounded-[10px] p-12 transition-all hover:bg-slate-50 cursor-pointer flex flex-col items-center justify-center gap-4 ${fieldErrors.companyDocument ? "border-red-500" : "border-[#e8eaef] hover:border-[#4DD9E8]"}`}
                        >
                          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            <Upload className={`w-8 h-8 ${fieldErrors.companyDocument ? "text-red-500" : "text-slate-400 group-hover:text-[#4DD9E8]"}`} />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-extrabold text-slate-600">Select business document</p>
                            <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest">PDF, DOC, DOCX up to 10MB</p>
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
                        <div className="flex items-center justify-between p-6 bg-[#4DD9E8]/5 border border-[#4DD9E8]/20 rounded-[10px] relative overflow-hidden group">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#4DD9E8]" />
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#4DD9E8]/10 rounded-xl flex items-center justify-center">
                              <FileIcon className="w-6 h-6 text-[#4DD9E8]" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700 truncate max-w-[250px]">{companyDocument.name}</p>
                              <p className="text-[11px] font-bold text-[#4DD9E8]/60 uppercase">
                                {(companyDocument.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            aria-label="Remove uploaded document"
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      <ErrorMessage error={fieldErrors.companyDocument} />
                    </div>

                    <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      By submitting this application, you agree to Hirion's staffing partner terms and permit us to verify your company credentials.
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="flex-1 h-[52px] font-bold rounded-xl border-slate-200 hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="flex-1 h-[52px] bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <SpinnerLoader className="w-5 h-5 text-current" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <span>{currentStep === totalSteps ? "Sign Up" : "Next Step"}</span>
                        {currentStep < totalSteps ? (
                          <ChevronRight className="w-5 h-5" />
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-10 text-center text-[14px] sm:text-sm font-medium text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/bench-login"
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

export default BenchRegistration;

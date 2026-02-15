import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { toast } from "sonner";
import { useRegisterHrMutation } from "@/app/queries/loginApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import RegistrationStepIndicator from "@/components/auth/RegistrationStepIndicator";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { VALIDATION } from "@/services/utils/signUpValidation";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";

const BenchRegistration = () => {
  const navigate = useNavigate();
  const [registerHr, { isLoading }] = useRegisterHrMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const stepInfo = [
    { title: "Account", desc: "Start your enterprise journey" },
    { title: "Details", desc: "Tell us about your organization" },
    { title: "Verify", desc: "Upload business documents" },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    companyDetails: "",
    password: "",
    confirmPassword: "",
  });

  const [companyDocument, setCompanyDocument] = useState<File | null>(null);

  // Field-level errors for better UX
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

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

  const validateStep = (): boolean => {
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
      // Validate company name
      const companyNameError = VALIDATION.companyName.validate(
        formData.companyName,
      );
      if (companyNameError) errors.companyName = companyNameError;
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

  const nextStep = () => {
    if (validateStep()) {
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
      nextStep();
      return;
    }

    if (!validateStep()) return;

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
      console.error("Registration error:", error);

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
      <div className="hidden lg:flex lg:w-[50%] bg-[#080b14] p-12 flex-col justify-between relative overflow-hidden shrink-0 border-r border-white/5">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              HIRION
            </span>
          </Link>

          <div className="space-y-8 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-white/80 text-[10px] font-bold tracking-[0.1em] uppercase">
                Staffing Partner Hub
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Scale Your <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Partner Business
              </span>
            </h1>

            <p className="text-xl text-white/50 leading-relaxed font-light">
              Join the ecosystem where staffing leaders automate resource
              monetization and drive recurring revenue.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
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

      {/* Right Panel - Premium Form Section */}
      <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#030303] overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 xl:p-16">
          <div className="w-full max-w-[600px]">
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
                <RegistrationStepIndicator
                  currentStep={currentStep}
                  steps={stepInfo}
                  totalSteps={totalSteps}
                />

                <div className="mb-6">
                  <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    {currentStep === 1
                      ? "Partner Account"
                      : currentStep === 2
                        ? "Company Details"
                        : "Verification"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                    {currentStep === 1
                      ? "Start your enterprise journey here."
                      : currentStep === 2
                        ? "Tell us more about your staffing company."
                        : "Upload documents for account verification."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            First Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="firstName"
                              placeholder="John"
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.firstName
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.firstName} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            Last Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="lastName"
                              placeholder="Smith"
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.lastName
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.lastName} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                          Work Email <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="hr@agency.com"
                            className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                              fieldErrors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : ""
                            }`}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.email} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            Password <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.password
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.password} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                            Confirm Password
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.confirmPassword
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.confirmPassword} />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">
                        Password must contain: 8+ characters, uppercase,
                        lowercase, number, special character
                      </p>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                          Organization Name{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative group">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="companyName"
                            placeholder="company Co."
                            className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                              fieldErrors.companyName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : ""
                            }`}
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.companyName} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                          Organization Details (Optional)
                        </Label>
                        <Textarea
                          name="companyDetails"
                          placeholder="Tell us about your staffing capabilities..."
                          className={`min-h-[150px] bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                            fieldErrors.companyDetails
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                              : ""
                          }`}
                          value={formData.companyDetails}
                          onChange={handleInputChange}
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">
                          {formData.companyDetails.length}/1000 characters (min
                          10)
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                          Company Document (ID/Verification){" "}
                          <span className="text-destructive">*</span>
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
                            className={`group relative border-2 border-dashed rounded-2xl p-12 transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer flex flex-col items-center justify-center gap-4 ${
                              fieldErrors.companyDocument
                                ? "border-red-500 hover:border-red-500"
                                : "border-slate-200 dark:border-white/10 hover:border-primary/50"
                            }`}
                          >
                            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                              <Upload
                                className={`w-8 h-8 ${
                                  fieldErrors.companyDocument
                                    ? "text-red-500"
                                    : "text-slate-400 group-hover:text-primary"
                                }`}
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-extrabold text-slate-600 dark:text-slate-200">
                                Select business document
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest">
                                PDF, DOC, DOCX up to 10MB
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
                          <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <FileIcon className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[250px]">
                                  {companyDocument.name}
                                </p>
                                <p className="text-[11px] font-bold text-primary/60 uppercase">
                                  {(companyDocument.size / 1024 / 1024).toFixed(
                                    2,
                                  )}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeFile}
                              aria-label="Remove uploaded document"
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                        <ErrorMessage error={fieldErrors.companyDocument} />
                      </div>

                      <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/10">
                        By submitting this application, you agree to Hirion's
                        staffing partner terms and permit us to verify your
                        company credentials.
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-white/[0.03]">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-14 text-lg font-bold rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
                      >
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Back
                      </Button>
                    )}

                    <Button
                      type="submit"
                      className="flex-[2] h-14 text-lg font-bold rounded-2xl bg-primary text-white hover:opacity-90 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <SpinnerLoader className="w-5 h-5 text-current" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>
                            {currentStep === totalSteps
                              ? "Submit Application"
                              : "Next Step"}
                          </span>
                          {currentStep < totalSteps ? (
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          )}
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/[0.03] flex flex-col items-center gap-4">
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    Already a partner?{" "}
                    <Link
                      to="/bench-login"
                      className="text-primary hover:text-primary/80 transition-colors underline-offset-8 underline decoration-primary/30"
                    >
                      Sign In
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

export default BenchRegistration;

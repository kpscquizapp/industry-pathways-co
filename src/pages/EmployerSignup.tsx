import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Mail,
  Lock,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  User,
  Globe,
  FileText,
  Upload,
  X,
  FileIcon,
  Check,
  ChevronLeft,
} from "lucide-react";
import { useRegisterEmployerMutation } from "@/app/queries/loginApi";
import { toast } from "sonner";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import RegistrationStepIndicator from "@/components/auth/RegistrationStepIndicator";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

// ==================== VALIDATION PATTERNS ====================
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
  companyName: {
    minLength: 2,
    maxLength: 100,
    regex: /^[\p{L}\p{N}\s\-'&.,()]+$/u,
    validate: (companyName: string) => {
      if (!companyName || !companyName.trim())
        return "Organization name is required";
      if (companyName.trim().length < 2)
        return "Organization name must be at least 2 characters";
      if (companyName.trim().length > 100)
        return "Organization name must be less than 100 characters";
      if (!VALIDATION.companyName.regex.test(companyName)) {
        return "Organization name can only contain letters, numbers, spaces, and basic punctuation";
      }
      return null;
    },
  },
  companyDetails: {
    maxLength: 1000,
    validate: (details: string) => {
      // Optional field - only validate if provided
      if (!details || !details.trim()) return null;
      if (details.trim().length > 1000)
        return "Company details must be less than 1000 characters";
      return null;
    },
  },
  document: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    validate: (file: File | null) => {
      if (!file) return "Verification document is required";

      // Check file size
      if (file.size > VALIDATION.document.maxSize) {
        return "File size must be 10MB or less";
      }

      // Check file type
      if (!VALIDATION.document.allowedTypes.includes(file.type)) {
        const fileName = file.name.toLowerCase();
        const hasValidExtension = VALIDATION.document.allowedExtensions.some(
          (ext) => fileName.endsWith(ext),
        );

        if (!hasValidExtension) {
          return "Please upload a PDF or Word document (.pdf, .doc, .docx)";
        }
      }

      return null;
    },
  },
};

// Helper function for checking FetchBaseQueryError
function isFetchBaseQueryError(error: unknown): error is {
  status: number;
  data: unknown;
} {
  return typeof error === "object" && error != null && "status" in error;
}

const EmployerSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Field-level errors for better UX
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [registerEmployer] = useRegisterEmployerMutation();
  const navigate = useNavigate();

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
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = "Passwords do not match";
    } else if (currentStep === 2) {
      // Validate company name
      const companyNameError = VALIDATION.companyName.validate(
        formData.companyName,
      );
      if (companyNameError) errors.companyName = companyNameError;

      // Validate company details (optional field)
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
      value: "-40%",
      label: "Time to Hire",
      sub: "with AI scoring",
    },
    {
      id: "stat-bench-util",
      value: "↑ 30%",
      label: "Bench Utilization",
      sub: "revenue growth",
    },
  ];

  const stepInfo = [
    { title: "Account Registration", sub: "Personal details" },
    { title: "Organization", sub: "Company profile" },
    { title: "Verification", sub: "Upload document" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel - Immersive Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#080b14] p-12 flex-col justify-between relative overflow-hidden shrink-0 border-r border-white/5">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-20 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              HIRION
            </span>
          </Link>

          <div className="space-y-8 max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-white/80 text-[10px] font-bold tracking-[0.1em] uppercase">
                Enterprise Registration
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Scale Your <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Talent Ecosystem.
              </span>
            </h1>

            <p className="text-lg text-white/50 leading-relaxed font-light">
              AI-driven verification and instant procurement. Join the network
              of high-performance engineering teams.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-4 bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div
                  className={`w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-white/90 text-xs mb-1 uppercase tracking-tight">
                  {feature.label}
                </h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            {stats.map((stat) => (
              <div key={stat.id} className="text-left">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mt-1">
                  {stat.label}
                </p>
                <p className="text-[9px] text-white/20 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Section */}
      <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#030303] overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 lg:p-12 xl:p-20">
          <div className="w-full max-w-xl">
            <div className="lg:hidden mb-12 flex flex-col items-center text-center">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-xl shadow-primary/20">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                  HIRION
                </span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-[36px] blur-xl opacity-50 dark:opacity-20" />

              <div className="relative bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-white/[0.05] p-8 md:p-12">
                {/* Progress Bar */}
                <RegistrationStepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  steps={stepInfo}
                />

                <div className="mb-10">
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 tracking-tight">
                    {stepInfo[currentStep - 1].title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                    {stepInfo[currentStep - 1].sub}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            First Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="firstName"
                              placeholder="John"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.firstName
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.firstName} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Last Name{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.lastName
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.lastName} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Work Email <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                              fieldErrors.email
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : ""
                            }`}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.email} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Password <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleInputChange}
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.password
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.password} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Confirm Password{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                                fieldErrors.password
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                  : ""
                              }`}
                              required
                            />
                          </div>
                          <ErrorMessage error={fieldErrors.confirmPassword} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">
                        Must contain: 8+ characters, uppercase, lowercase,
                        number, special character
                      </p>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Organization Name{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative group">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="companyName"
                            placeholder="Acme Inc."
                            value={formData.companyName}
                            onChange={handleInputChange}
                            className={`h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                              fieldErrors.companyName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : ""
                            }`}
                            required
                          />
                        </div>
                        <ErrorMessage error={fieldErrors.companyName} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Company Details (Optional)
                        </Label>
                        <div className="relative group">
                          <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Textarea
                            name="companyDetails"
                            placeholder="Tell us about your organization... (optional)"
                            value={formData.companyDetails}
                            onChange={handleInputChange}
                            className={`min-h-[150px] pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium ${
                              fieldErrors.companyDetails
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                                : ""
                            }`}
                          />
                        </div>
                        {fieldErrors.companyDetails && (
                          <p className="text-xs text-red-500 mt-1 ml-1">
                            {fieldErrors.companyDetails}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-1">
                          {formData.companyDetails.length}/1000 characters
                        </p>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Verification Document{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <p className="text-xs text-slate-500 mb-4">
                          Please upload a document to verify your organization
                          (e.g., business license, incorporation certificate).
                        </p>

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
                            aria-label="Upload verification document"
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
                              required
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-6 bg-primary/5 dark:bg-primary/5 border border-primary/20 dark:border-primary/20 rounded-2xl relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
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
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                        <ErrorMessage error={fieldErrors.companyDocument} />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 h-14 text-base font-bold rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50"
                      >
                        <ChevronLeft className="mr-2 w-5 h-5" />
                        Back
                      </Button>
                    )}

                    <Button
                      type="submit"
                      className="flex-[2] h-14 text-lg font-bold rounded-2xl bg-primary text-white hover:opacity-90 shadow-2xl shadow-primary/10 transition-all active:scale-[0.98] group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-3">
                          <SpinnerLoader className="w-5 h-5" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>
                            {currentStep === totalSteps
                              ? "Register Organization"
                              : "Next Step"}
                          </span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-white/[0.03] flex flex-col items-center gap-4 text-center">
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    Already have an enterprise account?{" "}
                    <Link
                      to="/hire-talent-login"
                      className="text-primary hover:opacity-80 transition-colors underline-offset-8 underline decoration-primary/30"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600 font-medium tracking-wide leading-relaxed">
              By registering, you agree to our{" "}
              <span className="text-slate-600 dark:text-slate-300">
                Terms of Service
              </span>{" "}
              <br />
              and{" "}
              <span className="text-slate-600 dark:text-slate-300">
                Enterprise Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  Award,
  Loader,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateCandidateMutation } from "@/app/queries/loginApi";

interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  // Step 2
  candidateType: string;
  primaryJobRole: string;
  yearsExperience: number | null;
  primarySkills: string[];
  // Step 3
  preferredWorkType: string[];
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  availableToJoin: string;
  acceptedTerms: boolean;
  acceptedPrivacyPolicy: boolean;
}

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const CandidateRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: "",
    candidateType: "",
    primaryJobRole: "",
    yearsExperience: null,
    primarySkills: [],
    preferredWorkType: [],
    expectedSalaryMin: null,
    expectedSalaryMax: null,
    availableToJoin: "",
    acceptedTerms: false,
    acceptedPrivacyPolicy: false,
  });
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [createCandidate, { isLoading: isLoadingCandidate }] =
    useCreateCandidateMutation();
  // const navigate = useNavigate();

  const totalSteps = 4;

  const candidateTypeOptions = [
    "Full-Time Job Seeker",
    "Contract",
    "Freelance",
  ];

  const preferredWorkTypeOptions = ["Remote", "Hybrid", "Onsite"];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPrimarySkill = (skill?: string) => {
    const raw = (skill ?? primarySkillInput).trim();
    if (!raw) return;
    const skills = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      primarySkills: Array.from(new Set([...prev.primarySkills, ...skills])),
    }));
    setPrimarySkillInput("");
  };

  const removePrimarySkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      primarySkills: prev.primarySkills.filter((s) => s !== skill),
    }));
  };

  const togglePreferredWorkType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.preferredWorkType.includes(type);
      return {
        ...prev,
        preferredWorkType: exists
          ? prev.preferredWorkType.filter((t) => t !== type)
          : [...prev.preferredWorkType, type],
      };
    });
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Email validation
      if (!EMAIL_REGEX.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Password validation
      if (!PASSWORD_REGEX.test(formData.password)) {
        toast.error(
          "Password must be at least 8 characters with uppercase, lowercase, and a number",
        );
        return;
      }
    } else if (currentStep === 2) {
      if (
        !formData.mobileNumber ||
        !formData.candidateType ||
        !formData.primaryJobRole ||
        formData.yearsExperience === null
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 3) {
      if (
        formData.primarySkills.length === 0 ||
        formData.preferredWorkType.length === 0 ||
        formData.expectedSalaryMin === null ||
        formData.expectedSalaryMax === null
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (
      Number(formData.expectedSalaryMin) > Number(formData.expectedSalaryMax)
    ) {
      toast.error("Minimum salary cannot exceed maximum salary");
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 3 validation
    if (
      formData.preferredWorkType.length === 0 ||
      formData.expectedSalaryMin === null ||
      formData.expectedSalaryMax === null ||
      !formData.availableToJoin
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.acceptedTerms) {
      toast.error("Please accept the Terms and Conditions");
      return;
    }

    if (!formData.acceptedPrivacyPolicy) {
      toast.error("Please accept the Privacy Policy");
      return;
    }

    try {
      await createCandidate(formData).unwrap();
      toast.success("Registration successful! Welcome aboard!");
      // navigate("/candidate-dashboard"); candidate profile coming soon...
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  const features = [
    { icon: Zap, label: "AI-powered skill matching", highlight: true },
    { icon: Target, label: "Smart job recommendations", highlight: false },
    { icon: Award, label: "Verified skill assessments", highlight: false },
    {
      icon: CheckCircle2,
      label: "Direct employer connections",
      highlight: false,
    },
  ];

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => updateFormData("firstName", e.target.value)}
              className="pl-12 h-12 rounded-xl border-border bg-background"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => updateFormData("lastName", e.target.value)}
              className="pl-12 h-12 rounded-xl border-border bg-background"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="pl-12 h-12 rounded-xl border-border bg-background"
            required
          />
        </div>
        {formData.email && !EMAIL_REGEX.test(formData.email) && (
          <p className="text-xs text-destructive">
            Please enter a valid email address
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className="pl-12 h-12 rounded-xl border-border bg-background"
            required
          />
        </div>
        {formData.password && !PASSWORD_REGEX.test(formData.password) && (
          <p className="text-xs text-destructive">
            At least 8 characters, include uppercase, lowercase, and a number
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="mobileNumber" className="text-sm font-medium">
          Mobile Number <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="mobileNumber"
            type="tel"
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChange={(e) => updateFormData("mobileNumber", e.target.value)}
            className="pl-12 h-12 rounded-xl border-border bg-background"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="candidateType" className="text-sm font-medium">
          Candidate Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.candidateType}
          onValueChange={(value) => updateFormData("candidateType", value)}
        >
          <SelectTrigger className="h-12 rounded-xl border-border bg-background">
            <SelectValue placeholder="Select candidate type" />
          </SelectTrigger>
          <SelectContent>
            {candidateTypeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryJobRole" className="text-sm font-medium">
          Primary Job Role <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Briefcase className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="primaryJobRole"
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={formData.primaryJobRole}
            onChange={(e) => updateFormData("primaryJobRole", e.target.value)}
            className="pl-12 h-12 rounded-xl border-border bg-background"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearsExperience" className="text-sm font-medium">
          Years of Experience <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Award className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="yearsExperience"
            type="number"
            min={0}
            placeholder="e.g. 5"
            value={formData.yearsExperience}
            onChange={(e) =>
              updateFormData(
                "yearsExperience",
                e.target.value ? Number(e.target.value) : null,
              )
            }
            className="pl-12 h-12 rounded-xl border-border bg-background"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="primarySkills" className="text-sm font-medium">
          Primary Skills <span className="text-destructive">*</span>
        </Label>
        <div className="relative flex items-center">
          <Sparkles className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="primarySkills"
            type="text"
            placeholder="Type a skill and press Enter or comma, or click Add"
            value={primarySkillInput}
            onChange={(e) => setPrimarySkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addPrimarySkill();
              }
            }}
            className="pl-12 h-12 rounded-xl border-border bg-background flex-1"
          />
          <Button
            type="button"
            onClick={() => addPrimarySkill()}
            className="ml-3 h-10 rounded-xl"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.primarySkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center md:gap-2 md:px-3 pl-3 md:py-1 rounded-full bg-muted text-muted-foreground text-sm"
            >
              {skill}
              <button
                type="button"
                className="md:ml-2 text-destructive"
                onClick={() => removePrimarySkill(skill)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Add skills individually so they are stored as a list
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredWorkType" className="text-sm font-medium">
          Preferred Work Type <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-4">
          {preferredWorkTypeOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={formData.preferredWorkType.includes(option)}
                onCheckedChange={(checked) => togglePreferredWorkType(option)}
                className="min-h-0 min-w-0"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expectedSalaryMin" className="text-sm font-medium">
            Expected Salary Min <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="expectedSalaryMin"
              type="number"
              placeholder="Enter Expected Yearly Salary Min"
              value={formData.expectedSalaryMin}
              onChange={(e) =>
                updateFormData("expectedSalaryMin", Number(e.target.value))
              }
              className="h-12 rounded-xl border-border bg-background"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedSalaryMax" className="text-sm font-medium">
            Expected Salary Max <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="expectedSalaryMax"
              type="number"
              placeholder="Enter Expected Yearly Salary Max"
              value={formData.expectedSalaryMax}
              onChange={(e) =>
                updateFormData("expectedSalaryMax", Number(e.target.value))
              }
              className="h-12 rounded-xl border-border bg-background"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="availableToJoin" className="text-sm font-medium">
          Available to Join <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="availableToJoin"
            type="text"
            placeholder="e.g. Immediate, 2 weeks, 1 month"
            value={formData.availableToJoin}
            onChange={(e) => updateFormData("availableToJoin", e.target.value)}
            className="pl-12 h-12 rounded-xl border-border bg-background"
            required
          />
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptedTerms"
            checked={formData.acceptedTerms}
            onCheckedChange={(checked) =>
              updateFormData("acceptedTerms", checked === true)
            }
            className="mt-1 min-h-0 min-w-0"
          />
          <Label
            htmlFor="acceptedTerms"
            className="text-sm font-normal leading-relaxed cursor-pointer"
          >
            I accept the{" "}
            <Link
              to="/terms"
              className="text-primary hover:underline font-medium"
            >
              Terms and Conditions
            </Link>{" "}
            <span className="text-destructive">*</span>
          </Label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="acceptedPrivacyPolicy"
            checked={formData.acceptedPrivacyPolicy}
            onCheckedChange={(checked) =>
              updateFormData("acceptedPrivacyPolicy", checked === true)
            }
            className="mt-1 min-h-0 min-w-0"
          />
          <Label
            htmlFor="acceptedPrivacyPolicy"
            className="text-sm font-normal leading-relaxed cursor-pointer"
          >
            I accept the{" "}
            <Link
              to="/privacy"
              className="text-primary hover:underline font-medium"
            >
              Privacy Policy
            </Link>{" "}
            <span className="text-destructive">*</span>
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Create Candidate Account";
      case 2:
        return "Professional Details";
      case 3:
        return "Skills & Preferences";
      case 4:
        return "Final Details";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Enter your basic information to get started";
      case 2:
        return "Tell us about your professional background";
      case 3:
        return "Share your skills and work preferences";
      case 4:
        return "Complete your registration";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingHeader />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-9xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-8">
            {/* Left Column - Features */}
            <div className="space-y-6 order-2 lg:order-1">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-foreground">
                      HIRION
                    </span>
                    <p className="text-xs text-muted-foreground">
                      AI Talent & Bench Marketplace
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                  <Sparkles className="h-4 w-4" />
                  Candidate Registration
                </span>

                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
                  Find Your Perfect Opportunity
                </h1>
                <p className="text-muted-foreground text-lg">
                  Let AI match your skills with opportunities. Get discovered by
                  top companies. Accelerate your career with verified
                  assessments.
                </p>
              </div>

              {/* Feature Pills Grid */}
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      feature.highlight
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border"
                    }`}
                  >
                    <feature.icon
                      className={`h-5 w-5 ${feature.highlight ? "" : "text-primary"}`}
                    />
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    AVERAGE MATCH TIME
                  </p>
                  <p className="text-3xl font-bold text-primary">24hrs</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI-powered job matching
                  </p>
                </Card>
                <Card className="bg-card border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    SUCCESS RATE
                  </p>
                  <p className="text-3xl font-bold text-primary">85%</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    candidates placed in 90 days
                  </p>
                </Card>
              </div>
            </div>

            {/* Right Column - Registration Form */}
            <Card className="shadow-xl border-border rounded-2xl overflow-hidden bg-card order-1 lg:order-2">
              <CardContent className="p-8 sm:p-10">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {getStepTitle()}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {getStepDescription()}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {renderStepContent()}

                    <div className="flex gap-3 pt-2">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleBack}
                          className="flex-1 h-12 rounded-xl border-2 border-border"
                        >
                          <ArrowLeft className="mr-2 h-5 w-5" />
                          Back
                        </Button>
                      )}

                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          className={`h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all text-base shadow-lg ${
                            currentStep === 1 ? "w-full" : "flex-1"
                          }`}
                        >
                          Next Step
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all text-base shadow-lg"
                          disabled={isLoadingCandidate}
                        >
                          {isLoadingCandidate ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              Complete Registration
                              <CheckCircle2 className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </form>

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                      to="/candidate-login"
                      className="text-primary hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default CandidateRegistration;

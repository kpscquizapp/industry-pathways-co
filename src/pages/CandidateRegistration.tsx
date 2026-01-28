import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Shield,
  X,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  FileText,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/header/Logo";

interface FormData {
  // Step 1: Personal Details
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;

  // Step 2: Account Type
  candidateType: "fulltime" | "contract" | "";

  // Step 3: Career Basics
  primaryJobRole: string;
  totalExperience: string;
  currentCity: string;
  currentCountry: string;
  preferredWorkType: string;

  // Step 4: Skills
  primarySkills: string[];
  secondarySkills: string[];

  // Step 5: Resume
  resumeFile: File | null;

  // Step 6: Preferences
  preferredLocations: string[];
  expectedSalaryMin: string;
  expectedSalaryMax: string;
  noticePeriod: string;
  availableToJoin: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  enableAIMatching: boolean;
  takeAssessment: boolean;
  scheduleInterview: boolean;
}

const steps = [
  { number: 1, title: "Personal Details" },
  { number: 2, title: "Account Type" },
  { number: 3, title: "Career Basics" },
  { number: 4, title: "Skills" },
  { number: 5, title: "Resume" },
  { number: 6, title: "Preferences" },
];

const CandidateRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [secondarySkillInput, setSecondarySkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    candidateType: "",
    primaryJobRole: "",
    totalExperience: "",
    currentCity: "",
    currentCountry: "",
    preferredWorkType: "",
    primarySkills: [],
    secondarySkills: [],
    resumeFile: null,
    preferredLocations: [],
    expectedSalaryMin: "",
    expectedSalaryMax: "",
    noticePeriod: "",
    availableToJoin: "",
    acceptTerms: false,
    acceptPrivacy: false,
    enableAIMatching: true,
    takeAssessment: false,
    scheduleInterview: false,
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (type: "primary" | "secondary") => {
    const input = type === "primary" ? primarySkillInput : secondarySkillInput;
    const field = type === "primary" ? "primarySkills" : "secondarySkills";

    if (input.trim() && !formData[field].includes(input.trim())) {
      updateFormData(field, [...formData[field], input.trim()]);
      type === "primary"
        ? setPrimarySkillInput("")
        : setSecondarySkillInput("");
    }
  };

  const removeSkill = (skill: string, type: "primary" | "secondary") => {
    const field = type === "primary" ? "primarySkills" : "secondarySkills";
    updateFormData(
      field,
      formData[field].filter((s) => s !== skill)
    );
  };

  const addLocation = () => {
    if (
      locationInput.trim() &&
      !formData.preferredLocations.includes(locationInput.trim())
    ) {
      updateFormData("preferredLocations", [
        ...formData.preferredLocations,
        locationInput.trim(),
      ]);
      setLocationInput("");
    }
  };

  const removeLocation = (location: string) => {
    updateFormData(
      "preferredLocations",
      formData.preferredLocations.filter((l) => l !== location)
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (validTypes.includes(file.type)) {
        updateFormData("resumeFile", file);
        toast({
          title: "Resume Uploaded",
          description:
            "Your resume has been uploaded successfully. AI will extract skills automatically.",
        });
      } else {
        toast({
          title: "Invalid File Format",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
      }
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.mobile ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          toast({
            title: "Please fill all required fields",
            variant: "destructive",
          });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Passwords do not match", variant: "destructive" });
          return false;
        }
        if (formData.password.length < 8) {
          toast({
            title: "Password must be at least 8 characters",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.candidateType) {
          toast({
            title: "Please select a candidate type",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (
          !formData.primaryJobRole ||
          !formData.totalExperience ||
          !formData.currentCity ||
          !formData.currentCountry ||
          !formData.preferredWorkType
        ) {
          toast({
            title: "Please fill all required fields",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 4:
        if (formData.primarySkills.length === 0) {
          toast({
            title: "Please add at least one primary skill",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 5:
        if (!formData.resumeFile) {
          toast({ title: "Please upload your resume", variant: "destructive" });
          return false;
        }
        return true;
      case 6:
        if (!formData.acceptTerms || !formData.acceptPrivacy) {
          toast({
            title: "Please accept Terms & Conditions and Privacy Policy",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Registration Successful! 🎉",
      description:
        "Your profile has been created. Please verify your email to complete registration.",
    });
    navigate("/job-recommendations");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                currentStep === step.number
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.number
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {currentStep > step.number ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`text-xs mt-1 hidden sm:block ${
                currentStep === step.number
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-16 h-0.5 mx-1 ${
                currentStep > step.number ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Let's get started
        </h2>
        <p className="text-muted-foreground mt-1">
          Enter your personal details to begin your journey with Hirion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="e.g. John"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="e.g. Doe"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            placeholder="+91 98765 43210"
            value={formData.mobile}
            onChange={(e) => updateFormData("mobile", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">
            Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repeat password"
              value={formData.confirmPassword}
              onChange={(e) =>
                updateFormData("confirmPassword", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          What type of candidate are you?
        </h2>
        <p className="text-muted-foreground mt-1">
          This helps us personalize your job recommendations.
        </p>
      </div>

      <RadioGroup
        value={formData.candidateType}
        onValueChange={(value) => updateFormData("candidateType", value)}
        className="space-y-4"
      >
        <div
          className={`flex items-start space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
            formData.candidateType === "fulltime"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => updateFormData("candidateType", "fulltime")}
        >
          <RadioGroupItem value="fulltime" id="fulltime" className="mt-1" />
          <div className="flex-1">
            <Label
              htmlFor="fulltime"
              className="text-lg font-semibold cursor-pointer"
            >
              Full-Time Job Seeker
            </Label>
            <p className="text-muted-foreground mt-1">
              Looking for permanent employment opportunities with companies.
            </p>
          </div>
          <Building2 className="h-8 w-8 text-primary" />
        </div>

        <div
          className={`flex items-start space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
            formData.candidateType === "contract"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => updateFormData("candidateType", "contract")}
        >
          <RadioGroupItem value="contract" id="contract" className="mt-1" />
          <div className="flex-1">
            <Label
              htmlFor="contract"
              className="text-lg font-semibold cursor-pointer"
            >
              Contract / Freelance Talent
            </Label>
            <p className="text-muted-foreground mt-1">
              Available for project-based, contract, or freelance work.
            </p>
          </div>
          <FileText className="h-8 w-8 text-primary" />
        </div>
      </RadioGroup>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Career Basics</h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your professional background.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryJobRole">
          Primary Job Role <span className="text-destructive">*</span>
        </Label>
        <Input
          id="primaryJobRole"
          placeholder="e.g., Software Developer, Data Analyst"
          value={formData.primaryJobRole}
          onChange={(e) => updateFormData("primaryJobRole", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Total Experience <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.totalExperience}
          onValueChange={(value) => updateFormData("totalExperience", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fresher">Fresher</SelectItem>
            <SelectItem value="0-2">0–2 Years</SelectItem>
            <SelectItem value="2-5">2–5 Years</SelectItem>
            <SelectItem value="5-10">5–10 Years</SelectItem>
            <SelectItem value="10+">10+ Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentCity">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="currentCity"
            placeholder="e.g., Mumbai"
            value={formData.currentCity}
            onChange={(e) => updateFormData("currentCity", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentCountry">
            Country <span className="text-destructive">*</span>
          </Label>
          <Input
            id="currentCountry"
            placeholder="e.g., India"
            value={formData.currentCountry}
            onChange={(e) => updateFormData("currentCountry", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Preferred Work Type <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.preferredWorkType}
          onValueChange={(value) => updateFormData("preferredWorkType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select work type preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="onsite">Onsite</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Your Skills</h2>
        <p className="text-muted-foreground mt-1">
          Add skills that showcase your expertise.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>
            Primary Skills <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill (e.g., React, Python)"
              value={primarySkillInput}
              onChange={(e) => setPrimarySkillInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill("primary"))
              }
            />
            <Button type="button" onClick={() => addSkill("primary")}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.primarySkills.map((skill) => (
              <Badge
                key={skill}
                variant="default"
                className="gap-1 py-1.5 px-3"
              >
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => removeSkill(skill, "primary")}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Secondary Skills{" "}
            <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add secondary skills"
              value={secondarySkillInput}
              onChange={(e) => setSecondarySkillInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill("secondary"))
              }
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addSkill("secondary")}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.secondarySkills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="gap-1 py-1.5 px-3"
              >
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => removeSkill(skill, "secondary")}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Upload Your Resume
        </h2>
        <p className="text-muted-foreground mt-1">
          Our AI will automatically extract your skills and experience.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          formData.resumeFile
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          id="resume"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileUpload}
        />
        <label htmlFor="resume" className="cursor-pointer">
          {formData.resumeFile ? (
            <div className="space-y-3">
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
              <div>
                <p className="font-semibold text-foreground">
                  {formData.resumeFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Click to replace
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <p className="font-semibold text-foreground">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>
            </div>
          )}
        </label>
      </div>

      <div className="bg-primary/10 p-4 rounded-xl flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">
            AI-Powered Skill Extraction
          </p>
          <p className="text-sm text-muted-foreground">
            Our AI will automatically identify and extract skills from your
            resume to improve your profile visibility.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Job Preferences</h2>
        <p className="text-muted-foreground mt-1">
          Set your preferences for better job matches. (Optional fields)
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Preferred Job Location(s)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addLocation())
              }
            />
            <Button type="button" variant="outline" onClick={addLocation}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.preferredLocations.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="gap-1 py-1.5 px-3"
              >
                {location}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => removeLocation(location)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Expected Salary (Min)</Label>
            <Input
              placeholder="e.g., ₹5,00,000"
              value={formData.expectedSalaryMin}
              onChange={(e) =>
                updateFormData("expectedSalaryMin", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Expected Salary (Max)</Label>
            <Input
              placeholder="e.g., ₹10,00,000"
              value={formData.expectedSalaryMax}
              onChange={(e) =>
                updateFormData("expectedSalaryMax", e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>
            Available to Join <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.availableToJoin}
            onValueChange={(value) => updateFormData("availableToJoin", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="15-days">15 Days</SelectItem>
              <SelectItem value="30-days">30 Days</SelectItem>
              <SelectItem value="60-days">60+ Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="font-semibold text-foreground">Terms & AI Options</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                updateFormData("acceptTerms", checked)
              }
            />
            <Label htmlFor="terms" className="text-sm cursor-pointer">
              I accept the{" "}
              <Link to="#" className="text-primary hover:underline">
                Terms & Conditions
              </Link>{" "}
              <span className="text-destructive">*</span>
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="privacy"
              checked={formData.acceptPrivacy}
              onCheckedChange={(checked) =>
                updateFormData("acceptPrivacy", checked)
              }
            />
            <Label htmlFor="privacy" className="text-sm cursor-pointer">
              I accept the{" "}
              <Link to="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              <span className="text-destructive">*</span>
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="aiMatching"
              checked={formData.enableAIMatching}
              onCheckedChange={(checked) =>
                updateFormData("enableAIMatching", checked)
              }
            />
            <Label htmlFor="aiMatching" className="text-sm cursor-pointer">
              Enable AI Skill Matching for personalized job recommendations
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="assessment"
              checked={formData.takeAssessment}
              onCheckedChange={(checked) =>
                updateFormData("takeAssessment", checked)
              }
            />
            <Label htmlFor="assessment" className="text-sm cursor-pointer">
              Take Skill Assessment after registration
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="interview"
              checked={formData.scheduleInterview}
              onCheckedChange={(checked) =>
                updateFormData("scheduleInterview", checked)
              }
            />
            <Label htmlFor="interview" className="text-sm cursor-pointer">
              Schedule AI Interview later
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-[#0a1628] py-4 px-6">
        <Logo />
      </header>

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          {renderStepIndicator()}

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              {renderCurrentStep()}

              {/* Footer with security note and navigation */}
              <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Shield className="h-4 w-4" />
                  <span>Your data is encrypted and secure.</span>
                </div>

                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}
                  <Button onClick={handleNext}>
                    {currentStep === 6 ? "Create Account" : "Next Step"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in here
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default CandidateRegistration;

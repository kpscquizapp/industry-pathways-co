import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  Phone,
  Briefcase,
  CheckCircle2,
  Globe,
  Rocket,
  Target,
  DollarSign,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateCandidateMutation } from "@/app/queries/loginApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import RegistrationStepIndicator from "@/components/auth/RegistrationStepIndicator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const CandidateSignup = () => {
  const navigate = useNavigate();
  const [createCandidate, { isLoading }] = useCreateCandidateMutation();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    candidateType: "Full-Time Job Seeker",
    primaryJobRole: "",
    yearsExperience: 0,
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
    availableToJoin: "Immediate",
    password: "",
    confirmPassword: "",
  });

  const [primarySkills, setPrimarySkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [preferredWorkType, setPreferredWorkType] = useState<string[]>([
    "remote",
    "hybrid",
  ]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!primarySkills.includes(skillInput.trim())) {
        setPrimarySkills([...primarySkills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setPrimarySkills(primarySkills.filter((s) => s !== skillToRemove));
  };

  const toggleWorkType = (type: string) => {
    if (preferredWorkType.includes(type)) {
      setPreferredWorkType(preferredWorkType.filter((t) => t !== type));
    } else {
      setPreferredWorkType([...preferredWorkType, type]);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.mobileNumber ||
        !formData.password
      ) {
        toast.error("Please fill in all required fields");
        return false;
      }
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.primaryJobRole || primarySkills.length === 0) {
        toast.error("Please provide your job role and at least one skill");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      nextStep();
      return;
    }

    if (!acceptedTerms || !acceptedPrivacyPolicy) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }

    const payload = {
      ...formData,
      primarySkills,
      preferredWorkType,
      acceptedTerms,
      acceptedPrivacyPolicy,
    };

    try {
      await createCandidate(payload).unwrap();
      toast.success("Registration successful! Please login to continue.");
      navigate("/candidate-login");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  const features = [
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access roles from top global companies.",
      color: "bg-emerald-500/20 text-emerald-400",
    },
    {
      icon: Rocket,
      title: "Career Acceleration",
      description: "AI-powered matching to fast-track growth.",
      color: "bg-primary/20 text-primary",
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Find roles that perfectly match your skills.",
      color: "bg-green-500/20 text-green-400",
    },
  ];

  const steps = [
    { title: "Account" },
    { title: "Profile" },
    { title: "Preferences" },
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
                Talent Ecosystem
              </span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
              Launch Your <br />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-green-400 bg-clip-text text-transparent">
                Contract Career
              </span>
            </h1>

            <p className="text-xl text-white/50 leading-relaxed font-light">
              Join the elite network of professional contractors and get
              discovered by industry leaders worldwide.
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

      {/* Right Panel - Premium Registration Section */}
      <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#030303] overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 lg:p-12 xl:p-16">
          <div className="w-full max-w-2xl">
            {/* Progress Indicator */}

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
                <div className="mb-10 text-center md:text-left">
                  <RegistrationStepIndicator
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    steps={steps}
                  />

                  <h3 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                    {currentStep === 1
                      ? "Create Account"
                      : currentStep === 2
                        ? "Professional Profile"
                        : "Career Preferences"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {currentStep === 1
                      ? "Start your journey as an elite contractor."
                      : currentStep === 2
                        ? "Tell us about your skills and experience."
                        : "Finalize your settings and join the ecosystem."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            First Name
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="firstName"
                              placeholder="John"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Last Name
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="lastName"
                              placeholder="Doe"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Work Email
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Mobile Number
                        </Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="mobileNumber"
                            type="tel"
                            placeholder="+1 (555) 000-1234"
                            className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Password
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Confirm
                          </Label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Candidate Type
                          </Label>
                          <Select
                            value={formData.candidateType}
                            onValueChange={(val) =>
                              setFormData({ ...formData, candidateType: val })
                            }
                          >
                            <SelectTrigger className="h-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-sm font-medium">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/[0.08]">
                              <SelectItem value="Full-Time Job Seeker">
                                Full-Time Job Seeker
                              </SelectItem>
                              <SelectItem value="Contractor / Freelancer">
                                Contractor / Freelancer
                              </SelectItem>
                              <SelectItem value="Hybrid Professional">
                                Hybrid Professional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Years of Experience
                          </Label>
                          <div className="relative group">
                            <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="yearsExperience"
                              type="number"
                              min="0"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.yearsExperience}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Primary Job Role
                        </Label>
                        <div className="relative group">
                          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            name="primaryJobRole"
                            placeholder="e.g. Full Stack Developer, Data Scientist"
                            className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                            value={formData.primaryJobRole}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Primary Skills (Press Enter to add)
                        </Label>
                        <div className="relative group">
                          <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                          <Input
                            placeholder="Type skill and press Enter..."
                            className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={addSkill}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {primarySkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="px-3 py-1.5 bg-primary/10 text-primary dark:text-emerald-400 border-primary/20 flex items-center gap-2 group"
                            >
                              {skill}
                              <X
                                className="w-3 h-3 cursor-pointer group-hover:text-red-500 transition-colors"
                                onClick={() => removeSkill(skill)}
                              />
                            </Badge>
                          ))}
                          {primarySkills.length === 0 && (
                            <p className="text-xs text-slate-400 italic">
                              No skills added yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Exp. Salary (Min $)
                          </Label>
                          <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="expectedSalaryMin"
                              type="number"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.expectedSalaryMin}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                            Exp. Salary (Max $)
                          </Label>
                          <div className="relative group">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                            <Input
                              name="expectedSalaryMax"
                              type="number"
                              className="h-12 pl-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 font-medium"
                              value={formData.expectedSalaryMax}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Availability to Join
                        </Label>
                        <Select
                          value={formData.availableToJoin}
                          onValueChange={(val) =>
                            setFormData({ ...formData, availableToJoin: val })
                          }
                        >
                          <SelectTrigger className="h-12 bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08] rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300 text-sm font-medium">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/[0.08]">
                            <SelectItem value="Immediate">
                              Immediate / Serving Notice
                            </SelectItem>
                            <SelectItem value="15 Days">15 Days</SelectItem>
                            <SelectItem value="30 Days">30 Days</SelectItem>
                            <SelectItem value="60 Days+">60 Days+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
                          Preferred Work Type
                        </Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                          {["remote", "hybrid", "on-site"].map((type) => (
                            <div
                              key={type}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`type-${type}`}
                                checked={preferredWorkType.includes(type)}
                                onCheckedChange={() => toggleWorkType(type)}
                                className="border-slate-300 dark:border-white/10"
                              />
                              <label
                                htmlFor={`type-${type}`}
                                className="text-sm font-medium leading-none capitalize text-slate-600 dark:text-slate-400 cursor-pointer"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 mt-6 border-t border-slate-100 dark:border-white/[0.05]">
                        <div className="flex items-start space-x-3 group">
                          <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) =>
                              setAcceptedTerms(!!checked)
                            }
                            className="mt-1 border-slate-300 dark:border-white/10"
                          />
                          <label
                            htmlFor="terms"
                            className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 cursor-pointer group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors"
                          >
                            I accept the{" "}
                            <Link
                              to="/terms"
                              className="text-primary font-bold hover:underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and agree to communications.
                          </label>
                        </div>

                        <div className="flex items-start space-x-3 group">
                          <Checkbox
                            id="privacy"
                            checked={acceptedPrivacyPolicy}
                            onCheckedChange={(checked) =>
                              setAcceptedPrivacyPolicy(!!checked)
                            }
                            className="mt-1 border-slate-300 dark:border-white/10"
                          />
                          <label
                            htmlFor="privacy"
                            className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 cursor-pointer group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors"
                          >
                            I agree to the{" "}
                            <Link
                              to="/privacy"
                              className="text-primary font-bold hover:underline"
                            >
                              Privacy Policy
                            </Link>{" "}
                            and data processing.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-12 pt-8 border-t border-slate-100 dark:border-white/[0.03]">
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
                      className="flex-[2] h-14 text-lg font-bold rounded-2xl bg-primary dark:bg-primary text-white hover:opacity-90 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] group"
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
                              ? "Launch Your Career"
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

                <div className="mt-10 text-center">
                  <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold tracking-tight">
                    Already an elite contractor?{" "}
                    <Link
                      to="/candidate-login"
                      className="text-primary hover:opacity-80 transition-colors underline-offset-8 underline decoration-primary/30"
                    >
                      Sign In to Dashboard
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

export default CandidateSignup;

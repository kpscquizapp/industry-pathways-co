import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Shield,
  Save,
  Send,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles as SparklesIcon,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateJobMutation,
  useGetJobsByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useSaveJobAsDraftMutation,
} from "@/app/queries/jobApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useExtractSkillsMutation } from "@/app/queries/atsApi";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";

const INITIAL_FORM_DATA = {
  // Basic Information
  title: "",
  description: "",
  category: "",
  role: "",
  status: "draft",

  // Location
  location: "",
  city: "",
  state: "",
  country: "",
  multipleLocationsAllowed: false,

  // Employment Details
  employmentType: "",
  workMode: "",

  // Experience
  minExperience: "",
  maxExperience: "",
  experienceLevel: "",
  fresherAllowed: false,

  // Compensation
  salaryMin: "",
  salaryMax: "",
  salaryType: "not-disclosed",
  currency: "USD",
  expectedBudgetMin: "",
  expectedBudgetMax: "",

  // Duration & Timing
  duration: "",
  durationUnit: "",
  startDate: "",
  expiresAt: "",

  // Payment
  paymentType: "",

  // Openings & Visibility
  openings: "",
  jobVisibility: "public",
  urgency: "normal",
  openToBenchResources: false,

  // Certifications & Education
  certifications: "",
  educationQualification: "",
  languagesKnown: "",

  // Perks & Benefits
  healthInsurance: false,
  esops: false,
  performanceBonus: false,
  remoteAllowance: false,

  // AI & Screening
  enableAiMatching: true,
  autoScreenCandidates: false,
  enableSkillAssessment: true,
  scheduleAIInterview: false,
  testType: "",
  difficultyLevel: "",
  timeLimit: "",
  autoRejectBelowScore: "",
  interviewType: "",
  autoAdvanceScore: "",

  // Compliance
  equalOpportunityEmployer: true,
  dataPrivacyPolicies: true,
  termsAndConditions: false,
};

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const jobIdRaw = jobIdParam ? parseInt(jobIdParam, 10) : null;
  const jobId = typeof jobIdRaw === "number" && jobIdRaw > 0 ? jobIdRaw : null;
  const isEditing = jobId !== null;

  const [createJob, { isLoading: createJobLoading }] = useCreateJobMutation();
  const [updateJob, { isLoading: updateJobLoading }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: deleteJobLoading }] = useDeleteJobMutation();
  const [saveJobAsDraft, { isLoading: saveJobAsDraftLoading }] =
    useSaveJobAsDraftMutation();
  const [extractSkills, { isLoading: isExtractingSkills }] =
    useExtractSkillsMutation();

  const { data: jobDetailsData, isLoading: jobDetailsLoading } =
    useGetJobsByIdQuery(isEditing ? { id: jobId } : skipToken);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [postingAction, setPostingAction] = useState<
    "post" | "postAndShow" | null
  >(null);
  const [currentStep, setCurrentStep] = useState(1);
  const stepAdvanceInFlightRef = useRef(false);
  const totalSteps = 4;
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });

  useEffect(() => {
    if (isEditing && jobDetailsData?.data?.[0]) {
      const job = jobDetailsData.data[0];

      setFormData({
        // Basic Information
        title: job.title || "",
        description: job.description || "",
        category: job.category || "",
        role: job.role || "",
        status: job.status || "draft",

        // Location
        location: job.location || "",
        city: job.city || "",
        state: job.state || "",
        country: job.country || "",
        multipleLocationsAllowed:
          job.multipleLocationsAllowed || job.mltipleLocationsAllowed || false,

        // Employment Details
        employmentType: job.employmentType || "",
        workMode: job.workMode || "",

        // Experience
        minExperience: job.minExperience?.toString() || "",
        maxExperience: job.maxExperience?.toString() || "",
        experienceLevel: job.experienceLevel || "",
        fresherAllowed: job.fresherAllowed || false,

        // Compensation
        salaryMin: job.salaryMin?.toString() || "",
        salaryMax: job.salaryMax?.toString() || "",
        salaryType: job.salaryType || "not-disclosed",
        currency: job.currency || "USD",
        expectedBudgetMin: job.expectedBudgetMin?.toString() || "",
        expectedBudgetMax: job.expectedBudgetMax?.toString() || "",

        // Duration & Timing
        duration: job.duration?.toString() || "",
        durationUnit: normalizeDurationUnit(job.durationUnit || ""),
        startDate: job.startDate || "",
        expiresAt: job.expiresAt || "",

        // Payment
        paymentType: job.paymentType || "",

        // Openings & Visibility
        openings: job.numberOfOpenings?.toString() || "",
        jobVisibility: job.jobVisibility || "public",
        urgency: job.urgency || "normal",
        openToBenchResources: job.openToBenchResources || false,

        // Certifications & Education
        certifications: Array.isArray(job.certifications)
          ? job.certifications.join(", ")
          : "",
        educationQualification: job.educationQualification || "",
        languagesKnown: job.languagesKnown || "",

        // Perks & Benefits
        healthInsurance: job.healthInsurance || false,
        esops: job.ESOPs || false,
        performanceBonus: job.performanceBonus || false,
        remoteAllowance: job.remoteAllowance || false,

        // AI & Screening
        enableAiMatching:
          job.enableAiTalentMatching || job.aiMatchingEnabled || false,
        autoScreenCandidates: job.autoScreenCandidates || false,
        enableSkillAssessment: job.enableSkillAssessment || false,
        scheduleAIInterview: job.scheduleAIInterviews || false,
        testType: job.testType || "",
        difficultyLevel: job.difficultyLevel || "",
        timeLimit: job.timeLimit?.toString() || "",
        autoRejectBelowScore: job.autoRejectBelowScore?.toString() || "",
        interviewType: job.interviewType || "",
        autoAdvanceScore: job.autoAdvanceScore?.toString() || "",

        // Compliance
        equalOpportunityEmployer: job.equalOpportunityEmployer || false,
        dataPrivacyPolicies: job.dataPrivacyPolicies || false,
        termsAndConditions: job.termsAndConditions || false,
      });

      const normalizedSkills = Array.isArray(job.skills)
        ? job.skills
          .map((s: { name?: string } | string) =>
            typeof s === "string" ? s : (s.name ?? ""),
          )
          .map((s) => s.trim())
          .filter(Boolean)
        : [];
      setSkills(normalizedSkills);
    } else if (!isEditing) {
      // Reset form when switching back to create mode
      setFormData({ ...INITIAL_FORM_DATA });
      setSkills([]);
      setCurrentStep(1);
    }
  }, [isEditing, jobDetailsData]);

  const parseOptionalNumber = (value: string | number) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    const numValue = typeof value === "number" ? value : Number(value);
    const result =
      Number.isFinite(numValue) && numValue >= 0 ? numValue : undefined;
    return result;
  };

  const parsePositiveNumber = (value: string | number) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }
    const numValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numValue) && numValue > 0 ? numValue : undefined;
  };

  const normalizeDurationUnit = (unit: string): string => {
    switch (unit) {
      case "weeks":
        return "week";
      case "months":
        return "month";
      case "years":
        return "year";
      default:
        return unit;
    }
  };

  const mapDurationUnit = (unit: string) => {
    switch (unit) {
      case "week":
        return "weeks";
      case "month":
        return "months";
      case "year":
        return "years";
      default:
        return undefined;
    }
  };

  const parseCertifications = (value: string) => {
    if (!value.trim()) {
      return undefined;
    }
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : undefined;
  };

  const experienceLevelToRange = (
    level: string,
  ): { minExperience: number; maxExperience: number | null } | null => {
    switch (level?.toLowerCase()) {
      case "junior":
        return { minExperience: 0, maxExperience: 2 };
      case "mid":
      case "mid-level":
        return { minExperience: 3, maxExperience: 5 };
      case "mid-senior":
        return { minExperience: 6, maxExperience: 9 };
      case "senior":
        return { minExperience: 10, maxExperience: null };
      case "lead":
      case "principal":
        return { minExperience: 15, maxExperience: null };
      default:
        return null;
    }
  };

  const mapExperienceLevelToYears = (
    experienceLevel: string,
    minExp: string | number | undefined,
    maxExp: string | number | undefined,
  ) => {
    // If an experience level is selected, prefer its mapped range
    const mapped = experienceLevelToRange(experienceLevel);
    if (mapped) return mapped;

    // Fallback to explicit min/max when no level is set
    const minExperience = parseOptionalNumber(minExp ?? "");
    const maxExperience = parseOptionalNumber(maxExp ?? "");
    return { minExperience, maxExperience };
  };

  const buildCreateJobPayload = (enableAiMatching: boolean) => {
    const salaryMin = parseOptionalNumber(formData.salaryMin);
    const salaryMax = parseOptionalNumber(formData.salaryMax);
    const normalizedSalaryMin =
      salaryMin !== undefined &&
        salaryMax !== undefined &&
        salaryMin > salaryMax
        ? salaryMax
        : salaryMin;
    const normalizedSalaryMax =
      salaryMin !== undefined &&
        salaryMax !== undefined &&
        salaryMin > salaryMax
        ? salaryMin
        : salaryMax;

    const numberOfOpenings = parsePositiveNumber(formData.openings);
    const { minExperience, maxExperience } = mapExperienceLevelToYears(
      formData.experienceLevel,
      formData.minExperience,
      formData.maxExperience,
    );
    const expectedBudgetMin = parsePositiveNumber(formData.expectedBudgetMin);
    const expectedBudgetMax = parsePositiveNumber(formData.expectedBudgetMax);

    return {
      // Basic Information
      title: formData.title,
      description: formData.description,
      category: formData.category || undefined,
      role: formData.role || undefined,
      // status: formData.status || "draft",

      // Location
      location: formData.location || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      // The backend column is misspelled as 'mltipleLocationsAllowed', so we intentionally map the correctly-spelled client field to it
      mltipleLocationsAllowed: formData.multipleLocationsAllowed,

      // Employment Details
      employmentType: formData.employmentType || undefined,
      workMode: formData.workMode || undefined,

      // Experience
      experienceLevel: formData.experienceLevel || undefined,
      minExperience: minExperience,
      maxExperience: maxExperience,
      fresherAllowed: formData.fresherAllowed,

      // Compensation
      salaryMin: normalizedSalaryMin,
      salaryMax: normalizedSalaryMax,
      salaryType: formData.salaryType || "not-disclosed",
      currency: formData.currency || "USD",
      expectedBudgetMin: expectedBudgetMin,
      expectedBudgetMax: expectedBudgetMax,

      // Duration & Timing
      duration: parseOptionalNumber(formData.duration),
      durationUnit: mapDurationUnit(formData.durationUnit),
      startDate: formData.startDate || undefined,
      expiresAt: formData.expiresAt || undefined,

      // Payment
      paymentType: formData.paymentType || undefined,

      // Openings & Visibility
      numberOfOpenings: numberOfOpenings,
      jobVisibility: formData.jobVisibility || "public",
      urgency: formData.urgency || "normal",
      openToBenchResources: formData.openToBenchResources,

      // Certifications & Education
      certifications: parseCertifications(formData.certifications),
      educationQualification: formData.educationQualification || undefined,
      languagesKnown: formData.languagesKnown || undefined,

      // Perks & Benefits
      healthInsurance: formData.healthInsurance,
      ESOPs: formData.esops,
      performanceBonus: formData.performanceBonus,
      remoteAllowance: formData.remoteAllowance,

      // AI & Screening
      enableAiTalentMatching: isEditing
        ? formData.enableAiMatching
        : enableAiMatching,
      aiMatchingEnabled: isEditing
        ? formData.enableAiMatching
        : enableAiMatching,
      autoScreenCandidates: formData.autoScreenCandidates,
      enableSkillAssessment: formData.enableSkillAssessment,
      scheduleAIInterviews: formData.scheduleAIInterview,
      testType: formData.testType || undefined,
      difficultyLevel: formData.difficultyLevel || undefined,
      timeLimit: parseOptionalNumber(formData.timeLimit),
      autoRejectBelowScore: parseOptionalNumber(formData.autoRejectBelowScore),
      interviewType: formData.interviewType || undefined,
      aiEvaluationCriteria: undefined, // Can be set separately if needed
      autoAdvanceScore: parseOptionalNumber(formData.autoAdvanceScore),

      // Compliance
      equalOpportunityEmployer: formData.equalOpportunityEmployer,
      dataPrivacyPolicies: formData.dataPrivacyPolicies,
      termsAndConditions: formData.termsAndConditions,

      // Skills
      skills: skills.map((skill) => ({ name: skill })),
    };
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (typeof error === "string" && error.trim()) {
      return error;
    }

    // Handle RTK Query FetchBaseQueryError cases first
    if (isFetchBaseQueryError(error)) {
      if (typeof error.status === "string") {
        switch (error.status) {
          case "FETCH_ERROR":
            return "Network error. Please check your connection and try again.";
          case "TIMEOUT_ERROR":
            return "Request timed out. Please try again in a moment.";
          case "PARSING_ERROR":
            return "Unexpected server response. Please try again later.";
        }
      }

      // Extract message from error.data for HTTP status errors
      if (typeof error.data === "string" && error.data.trim()) {
        return error.data;
      }
      if (
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
      ) {
        const msg = (error.data as { message?: unknown }).message;
        if (typeof msg === "string" && msg.trim()) {
          return msg;
        }
      }
    }

    // Fallback: generic object with .message
    if (error && typeof error === "object" && "message" in error) {
      const message = (error as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    return fallback;
  };

  const handleSaveDraft = async () => {
    try {
      const payload = buildCreateJobPayload(false);

      if (!payload.title?.trim() || !payload.description?.trim()) {
        toast.error("Job title and description are required.");
        return;
      }

      await saveJobAsDraft(payload).unwrap();
      toast.success("Job saved as draft successfully!");
      // Navigate to jobs list to prevent duplicate drafts
      navigate("/hire-talent/jobs");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to save draft"));
    }
  };

  const getCreatedJobId = (
    response:
      | {
        data?: { id?: string | number; job?: { id?: string | number } };
        id?: string | number;
      }
      | undefined,
  ) => response?.data?.id ?? response?.data?.job?.id ?? response?.id;

  const submitJob = async (enableAiMatching: boolean, redirectPath: string) => {
    try {
      const payload = buildCreateJobPayload(enableAiMatching);
      if (!payload.title?.trim() || !payload.description?.trim()) {
        toast.error("Job title and description are required.");
        return;
      }

      let response;
      if (isEditing && jobId) {
        // Update existing job — preserve current status unless a separate publish action is triggered
        const job = jobDetailsData?.data?.[0];
        const currentStatus = job?.status ?? formData.status;
        const nextStatus =
          currentStatus === "draft" ? "published" : currentStatus;
        response = await updateJob({
          id: jobId,
          data: { ...payload, status: nextStatus },
        }).unwrap();
        toast.success("Job updated successfully!");
        navigate("/hire-talent/dashboard");
      } else {
        // Create new job
        response = await createJob(payload).unwrap();
        const createdJobId = getCreatedJobId(response);
        const jobState =
          enableAiMatching && response?.data
            ? { job: response.data }
            : undefined;
        if (enableAiMatching && !createdJobId) {
          toast.warning(
            "Job posted, but could not retrieve job ID for AI matching.",
          );
        } else {
          toast.success(
            enableAiMatching
              ? "Job posted! Finding AI-matched candidates..."
              : "Job posted successfully!",
          );
        }
        const redirectUrl =
          enableAiMatching && createdJobId
            ? `${redirectPath}?jobId=${createdJobId}`
            : redirectPath;
        navigate(redirectUrl, jobState ? { state: jobState } : undefined);
      }
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          isEditing ? "Failed to update job" : "Failed to post job",
        ),
      );
    }
  };

  const handleDeleteJob = () => {
    if (!jobId) {
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobId) {
      return;
    }

    try {
      await deleteJob({ id: jobId }).unwrap();
      toast.success("Job deleted successfully!");
      navigate("/hire-talent/jobs");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete job"));
    }
  };

  const handlePostJob = async () => {
    setPostingAction("post");
    try {
      await submitJob(false, "/hire-talent/dashboard");
    } finally {
      setPostingAction(null);
    }
  };

  const handlePostAndShowProfiles = async () => {
    setPostingAction("postAndShow");
    try {
      await submitJob(true, "/hire-talent/ai-shortlists");
    } finally {
      setPostingAction(null);
    }
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const validateStep = (step: number): boolean => {
    const errors: Record<string, boolean> = {};

    if (step === 1) {
      if (!formData.title.trim()) errors.title = true;
      if (!formData.description.trim()) errors.description = true;
    }

    if (step === 2) {
      if (skills.length === 0) errors.skills = true;
    }

    if (step === 3) {
      if (!formData.workMode) errors.workMode = true;
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill in all required fields before continuing.");
      return false;
    }
    return true;
  };

  const nextStep = async () => {
    if (stepAdvanceInFlightRef.current) return;
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      stepAdvanceInFlightRef.current = true;
      try {
        if (currentStep === 1) {
          try {
            const result = await extractSkills({
              title: formData.title,
              content: formData.description,
            }).unwrap();
            const extracted = result?.data?.technicalSkills ?? [];
            if (extracted.length > 0) {
              const currentSkills = skills;
              const merged = [...currentSkills];
              const lowerSet = new Set(merged.map((s) => s.toLowerCase()));
              let newCount = 0;
              extracted.forEach((s: string) => {
                if (!lowerSet.has(s.toLowerCase())) {
                  merged.push(s);
                  lowerSet.add(s.toLowerCase());
                  newCount++;
                }
              });
              setSkills(merged);
              if (newCount > 0) {
                toast.success(
                  `${newCount} new skill${newCount > 1 ? "s" : ""} extracted from description`,
                );
              } else {
                toast.info("All extracted skills already present");
              }
            }
          } catch (err: unknown) {
            if (isFetchBaseQueryError(err) && err.status === 404) {
              toast.warning(
                "Skill extraction endpoint not available. Add skills manually.",
              );
            } else {
              toast.warning(
                "Could not auto-extract skills. Add them manually.",
              );
            }
          }
        }
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } finally {
        stepAdvanceInFlightRef.current = false;
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setFieldErrors({});
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const stepTitles = [
    "Basic Information",
    "Skills & Experience",
    "Location & Terms",
    "Budget & Duration",
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-4 md:py-8 md:px-2 space-y-10 font-sans">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {isEditing ? "Edit Job" : "Post a New Job"}
        </h1>
        <p className="text-slate-500 text-lg">
          {isEditing
            ? "Update the job details"
            : "Create a contract opportunity for top talent"}
        </p>
      </div>

      {isEditing && jobDetailsLoading && (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Loading job details...
            </p>
          </CardContent>
        </Card>
      )}

      <div
        className={`${isEditing && jobDetailsLoading ? "pointer-events-none opacity-50" : ""
          }`}
      >        {/* Step Indicator */}
        <div className="mb-10 max-w-full">
          <div className="flex justify-between mb-4">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const lineColor =
                index < currentStep
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))";
              // Actually use emerald-600 for completed/active
              const activeColorClass = isCompleted || isActive ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-200 text-slate-400";
              const activeLineClass = index < currentStep ? "bg-emerald-600" : "bg-slate-200";

              return (
                <div
                  key={stepNumber}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {/* Left-half connector */}
                  {index !== 0 && (
                    <div
                      className={`absolute top-4 left-0 right-1/2 h-0.5 -translate-y-1/2 transition-colors ${activeLineClass}`}
                    />
                  )}
                  {/* Right-half connector */}
                  {index !== stepTitles.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 right-0 h-0.5 -translate-y-1/2 transition-colors ${index < currentStep - 1 ? "bg-emerald-600" : "bg-slate-200"
                        }`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-300 ${activeColorClass} ${isActive ? "ring-4 ring-emerald-50" : ""}`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-bold">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-2 font-bold uppercase tracking-wider transition-colors ${isActive ? "text-emerald-700" : "text-slate-400"
                      }`}
                  >
                    {title.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-1 bg-slate-100" />
        </div>


        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border-none shadow-premium bg-white rounded-2xl overflow-hidden max-w-4xl">
              <CardContent className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Basic Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className={`text-sm font-bold uppercase tracking-tight ${fieldErrors.title ? "text-rose-500" : "text-slate-500"}`}
                    >
                      Job Title <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (fieldErrors.title)
                          setFieldErrors((p) => ({ ...p, title: false }));
                      }}
                      placeholder="e.g., Senior React Native Developer (Contract)"
                      className={`mt-1.5 ${fieldErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {fieldErrors.title && (
                      <p className="text-xs text-destructive mt-1">
                        Job title is required.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className={`text-sm font-bold uppercase tracking-tight ${fieldErrors.description ? "text-rose-500" : "text-slate-500"}`}
                    >
                      Job Description <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        });
                        if (fieldErrors.description)
                          setFieldErrors((p) => ({ ...p, description: false }));
                      }}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      rows={8}
                      className={`mt-1.5 resize-none ${fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {fieldErrors.description && (
                      <p className="text-xs text-destructive mt-1">
                        Job description is required.
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Job Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) =>
                          setFormData({ ...formData, category: v })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">
                            Engineering
                          </SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="data">Data Science</SelectItem>
                          <SelectItem value="devops">DevOps</SelectItem>
                          <SelectItem value="qa">Quality Assurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">
                        Employment Type
                      </Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(v) =>
                          setFormData({ ...formData, employmentType: v })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="openings" className="text-sm font-medium">
                        Number of Openings
                      </Label>
                      <Input
                        id="openings"
                        type="number"
                        placeholder="Enter number of openings"
                        min="1"
                        max="999"
                        value={formData.openings}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, openings: value });
                        }}
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Skills & Experience */}
          {currentStep === 2 && (
            <Card className="border-none shadow-premium bg-white rounded-2xl overflow-hidden max-w-4xl">
              <CardContent className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Skills & Experience
                  </h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label
                      className={`text-sm font-bold uppercase tracking-tight ${fieldErrors.skills ? "text-rose-500" : "text-slate-500"}`}
                    >
                      Required Skills <span className="text-rose-500">*</span>
                    </Label>
                    <div
                      className={`flex gap-2 mt-2 p-1 bg-slate-50 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all ${fieldErrors.skills ? "ring-2 ring-rose-500/20" : ""}`}
                    >
                      <Input
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value);
                          if (fieldErrors.skills)
                            setFieldErrors((p) => ({ ...p, skills: false }));
                        }}
                        placeholder="Add a skill (e.g. React, Node.js)..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                            if (fieldErrors.skills)
                              setFieldErrors((p) => ({ ...p, skills: false }));
                          }
                        }}
                        className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none h-11 px-4"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          addSkill();
                          if (fieldErrors.skills)
                            setFieldErrors((p) => ({ ...p, skills: false }));
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-6 h-11 font-bold shadow-sm"
                      >
                        <Plus className="h-4 w-4 mr-1 stroke-[3px]" />
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="bg-emerald-50 text-emerald-700 border-none px-4 py-2 text-sm font-bold rounded-full group flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            aria-label={`Remove skill ${skill}`}
                            onClick={() => removeSkill(skill)}
                            className="text-emerald-400 hover:text-emerald-600 transition-colors"
                          >
                            <X className="h-3.5 w-3.5 stroke-[3px]" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-bold uppercase tracking-tight text-slate-500">
                        Experience Level
                      </Label>
                      <Select
                        value={formData.experienceLevel}
                        onValueChange={(v) => {
                          const range = experienceLevelToRange(v);
                          setFormData({
                            ...formData,
                            experienceLevel: v,
                            minExperience: range
                              ? String(range.minExperience)
                              : "",
                            maxExperience:
                              range?.maxExperience !== null &&
                                range?.maxExperience !== undefined
                                ? String(range.maxExperience)
                                : "",
                          });
                        }}
                      >
                        <SelectTrigger className="mt-2 h-11 rounded-xl border-slate-200 bg-white">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                          <SelectItem value="junior">Junior (0-2 Years)</SelectItem>
                          <SelectItem value="mid">Mid Level (3-5 Years)</SelectItem>
                          <SelectItem value="mid-senior">Mid Senior (6-9 Years)</SelectItem>
                          <SelectItem value="senior">Senior (10+ Years)</SelectItem>
                          <SelectItem value="lead">Lead (15+ Years)</SelectItem>
                          <SelectItem value="principal">Principal (15+ Years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="certifications" className="text-sm font-bold uppercase tracking-tight text-slate-500">
                        Certifications
                      </Label>
                      <Input
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) =>
                          setFormData({ ...formData, certifications: e.target.value })
                        }
                        placeholder="e.g., AWS Certified, PMP, CISSP"
                        className="mt-2 h-11 rounded-xl border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Location & Terms */}
          {currentStep === 3 && (
            <Card className="border-none shadow-premium bg-white rounded-2xl overflow-hidden max-w-4xl">
              <CardContent className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="font-bold">3</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Location & Terms
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label className={`text-sm font-bold uppercase tracking-tight ${fieldErrors.workMode ? "text-rose-500" : "text-slate-500"}`}>
                        Work Mode <span className="text-rose-500">*</span>
                      </Label>
                      <Select
                        value={formData.workMode}
                        onValueChange={(v) => {
                          setFormData({ ...formData, workMode: v });
                          if (fieldErrors.workMode)
                            setFieldErrors((p) => ({ ...p, workMode: false }));
                        }}
                      >
                        <SelectTrigger className={`mt-2 h-11 rounded-xl border-slate-200 bg-white ${fieldErrors.workMode ? "border-rose-500 focus:ring-rose-500/20" : ""}`}>
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-bold uppercase tracking-tight text-slate-500">
                        Location
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="City, Country"
                          className="h-11 rounded-xl border-slate-200 bg-white pr-10"
                        />
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={formData.openToBenchResources}
                          onCheckedChange={(v) => setFormData({ ...formData, openToBenchResources: v })}
                          className="data-[state=checked]:bg-emerald-600"
                        />
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-sm">
                            Open to Bench Resources
                          </p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Allow agencies and companies to propose their bench employees for this role.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Budget & Duration */}
          {currentStep === 4 && (
            <Card className="border-none shadow-premium bg-white rounded-2xl overflow-hidden max-w-4xl">
              <CardContent className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span className="font-bold">4</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Budget & Duration
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <Label htmlFor="duration" className="text-sm font-bold uppercase tracking-tight text-slate-500">
                        Duration
                      </Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="duration"
                          type="number"
                          placeholder="Value"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="flex-1 h-11 rounded-xl border-slate-200 bg-white"
                        />
                        <Select
                          value={formData.durationUnit}
                          onValueChange={(v) => setFormData({ ...formData, durationUnit: v })}
                        >
                          <SelectTrigger className="w-32 h-11 rounded-xl border-slate-200 bg-white shadow-sm">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                            <SelectItem value="week">Weeks</SelectItem>
                            <SelectItem value="month">Months</SelectItem>
                            <SelectItem value="year">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="startDate" className="text-sm font-bold uppercase tracking-tight text-slate-500">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="mt-2 h-11 rounded-xl border-slate-200 bg-white px-4"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div className="col-span-2 sm:col-span-1">
                      <Label className="text-sm font-bold uppercase tracking-tight text-slate-500">Payment Type</Label>
                      <Select value={formData.paymentType} onValueChange={(v) => setFormData({ ...formData, paymentType: v })}>
                        <SelectTrigger className="mt-2 h-11 rounded-xl border-slate-200 bg-white">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <Label className="text-sm font-bold uppercase tracking-tight text-slate-500">Currency</Label>
                      <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                        <SelectTrigger className="mt-2 h-11 rounded-xl border-slate-200 bg-white">
                          <SelectValue placeholder="Cur" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="budgetMin" className="text-sm font-bold uppercase tracking-tight text-slate-500 truncate">Min Budget</Label>
                      <Input id="budgetMin" type="number" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} className="mt-2 h-11 rounded-xl border-slate-200 bg-white" />
                    </div>

                    <div>
                      <Label htmlFor="budgetMax" className="text-sm font-bold uppercase tracking-tight text-slate-500 truncate">Max Budget</Label>
                      <Input id="budgetMax" type="number" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} className="mt-2 h-11 rounded-xl border-slate-200 bg-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between pt-8 border-t border-slate-100 max-w-4xl">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 min-w-[100px] font-bold h-11"
            >
              <ChevronLeft className="h-4 w-4 mr-2 stroke-[3px]" />
              Back
            </Button>
          )}
          {isEditing && (
            <Button
              variant="ghost"
              onClick={handleDeleteJob}
              className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold h-11"
              disabled={deleteJobLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {!isEditing && (
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 min-w-[100px] font-bold h-11"
              disabled={saveJobAsDraftLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveJobAsDraftLoading ? "Saving..." : "Save Draft"}
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-10 h-11 font-bold shadow-sm"
              disabled={isExtractingSkills}
            >
              {isExtractingSkills && currentStep === 1
                ? "Extracting..."
                : "Continue"}
              <ChevronRight className="h-4 w-4 ml-2 stroke-[3px]" />
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePostJob}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-8 h-11 font-bold shadow-sm"
                disabled={
                  updateJobLoading ||
                  createJobLoading ||
                  (isEditing && jobDetailsLoading)
                }
              >
                <Send className="h-4 w-4 mr-2" />
                {isEditing
                  ? updateJobLoading
                    ? "Updating..."
                    : "Update Job"
                  : createJobLoading && postingAction === "post"
                    ? "Posting..."
                    : "Post Job"}
              </Button>
              {!isEditing && (
                <Button
                  onClick={handlePostAndShowProfiles}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 font-bold shadow-md transition-all active:scale-[0.98] border-none"
                  disabled={createJobLoading}
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {createJobLoading && postingAction === "postAndShow"
                    ? "Posting..."
                    : "Post & Show Profiles"}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployerPostJob;

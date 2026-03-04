import React, { useState, useEffect } from "react";
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
import { skipToken, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useExtractSkillsMutation } from "@/app/queries/atsApi";

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
  const totalSteps = 4;
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
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
  });

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
        durationUnit: job.durationUnit || "",
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

      if (job.skills && Array.isArray(job.skills)) {
        setSkills(job.skills.map((s: any) => s.name || s));
      }
    } else if (!isEditing) {
      // Clear skills when switching back to create mode
      setSkills([]);
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

  const mapExperienceLevelToYears = (
    experienceLevel: string,
    minExp: string | number | undefined,
    maxExp: string | number | undefined,
  ) => {
    // If explicit min/max experience is provided, use those
    const minExperience = parseOptionalNumber(minExp ?? "");
    const maxExperience = parseOptionalNumber(maxExp ?? "");

    if (minExperience !== undefined || maxExperience !== undefined) {
      return { minExperience, maxExperience };
    }

    // Otherwise, map from experience level
    switch (experienceLevel?.toLowerCase()) {
      case "junior":
        return { minExperience: 0, maxExperience: 2 };
      case "mid":
      case "mid-level":
        return { minExperience: 3, maxExperience: 5 };
      case "mid-senior":
        return { minExperience: 6, maxExperience: 9 };
      case "senior":
        return { minExperience: 10, maxExperience: undefined };
      case "lead":
      case "principal":
        return { minExperience: 15, maxExperience: undefined };
      default:
        return { minExperience, maxExperience };
    }
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
    if (error && typeof error === "object" && "data" in error) {
      return (
        (error as { data?: { message?: string } }).data?.message || fallback
      );
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

      const response = await saveJobAsDraft(payload).unwrap();
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
        // Update existing job — publish it so it appears in active listings
        response = await updateJob({
          id: jobId,
          data: { ...payload, status: "published" },
        }).unwrap();
        toast.success("Job updated and published successfully!");
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
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      if (currentStep === 1) {
        try {
          const result = await extractSkills({
            title: formData.title,
            content: formData.description,
          }).unwrap();
          const extracted = result?.data?.technicalSkills ?? [];
          if (extracted.length > 0) {
            setSkills((prev) => {
              const merged = [...prev];
              extracted.forEach((s: string) => {
                if (!merged.includes(s)) merged.push(s);
              });
              return merged;
            });
            toast.success(
              `${extracted.length} skill${extracted.length > 1 ? "s" : ""} extracted from description`,
            );
          }
        } catch (err: unknown) {
          const isFetchError = (e: unknown): e is FetchBaseQueryError =>
            typeof e === "object" && e !== null && "status" in e;

          if (isFetchError(err) && err.status === 404) {
            toast.warning(
              "Skill extraction endpoint not available. Add skills manually.",
            );
          } else {
            toast.warning("Could not auto-extract skills. Add them manually.");
          }
        }
      }
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setFieldErrors({});
      setCurrentStep(currentStep - 1);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditing ? "Edit Job" : "Post a New Job"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update the job details"
              : "Create a contract opportunity for top talent"}
          </p>
        </div>
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
        className={`${
          isEditing && jobDetailsLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {stepTitles.map((title, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;
              const lineColor =
                index < currentStep
                  ? "hsl(var(--primary))"
                  : "hsl(var(--border))";

              return (
                <div
                  key={stepNumber}
                  className="flex flex-col items-center flex-1 relative"
                >
                  {/* Left-half connector (connects from previous step's center to this step's circle) */}
                  {index !== 0 && (
                    <div
                      className="absolute top-4 left-0 right-1/2 h-0.5 -translate-y-1/2"
                      style={{ background: lineColor }}
                    />
                  )}
                  {/* Right-half connector (connects from this step's circle outward to the next step) */}
                  {index !== stepTitles.length - 1 && (
                    <div
                      className="absolute top-4 left-1/2 right-0 h-0.5 -translate-y-1/2"
                      style={{
                        background:
                          index < currentStep
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                      }}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-semibold">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium hidden sm:block ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
        </div>

        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border border-border rounded-xl bg-card overflow-hidden">
              <CardContent className="px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      1
                    </span>
                  </div>
                  <h2 className="font-semibold text-xl text-foreground">
                    Basic Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="title"
                      className={`text-sm font-medium ${fieldErrors.title ? "text-destructive" : "text-foreground"}`}
                    >
                      Job Title <span className="text-destructive">*</span>
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
                      className={`text-sm font-medium ${fieldErrors.description ? "text-destructive" : ""}`}
                    >
                      Job Description{" "}
                      <span className="text-destructive">*</span>
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
            <Card className="border border-border rounded-xl bg-card overflow-hidden">
              <CardContent className="px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      2
                    </span>
                  </div>
                  <h2 className="font-semibold text-xl text-foreground">
                    Skills & Experience
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label
                      className={`text-sm font-medium ${fieldErrors.skills ? "text-destructive" : "text-foreground"}`}
                    >
                      Required Skills{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div
                      className={`flex gap-2 mt-1.5 rounded-md ${fieldErrors.skills ? "ring-1 ring-destructive" : ""}`}
                    >
                      <Input
                        value={newSkill}
                        onChange={(e) => {
                          setNewSkill(e.target.value);
                          if (fieldErrors.skills)
                            setFieldErrors((p) => ({ ...p, skills: false }));
                        }}
                        placeholder="Add a skill..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                            if (fieldErrors.skills)
                              setFieldErrors((p) => ({ ...p, skills: false }));
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          addSkill();
                          if (fieldErrors.skills)
                            setFieldErrors((p) => ({ ...p, skills: false }));
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {fieldErrors.skills && (
                      <p className="text-xs text-destructive mt-1">
                        Please add at least one skill.
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Experience Level
                      </Label>
                      <Select
                        value={formData.experienceLevel}
                        onValueChange={(v) =>
                          setFormData({ ...formData, experienceLevel: v })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">
                            Junior (0-2 Years)
                          </SelectItem>
                          <SelectItem value="mid">
                            Mid Level (3-5 Years)
                          </SelectItem>
                          <SelectItem value="mid-senior">
                            Mid Senior (6-9 Years)
                          </SelectItem>
                          <SelectItem value="senior">
                            Senior (10+ Years)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="certifications"
                        className="text-sm font-medium"
                      >
                        Certifications
                      </Label>
                      <Input
                        id="certifications"
                        value={formData.certifications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certifications: e.target.value,
                          })
                        }
                        placeholder="e.g., AWS Certified, PMP, CISSP"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Location & Terms */}
          {currentStep === 3 && (
            <Card className="border border-border rounded-xl bg-card overflow-hidden">
              <CardContent className="px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      3
                    </span>
                  </div>
                  <h2 className="font-semibold text-xl text-foreground">
                    Location & Terms
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label
                        className={`text-sm font-medium ${fieldErrors.workMode ? "text-destructive" : "text-foreground"}`}
                      >
                        Work Mode <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.workMode}
                        onValueChange={(v) => {
                          setFormData({ ...formData, workMode: v });
                          if (fieldErrors.workMode)
                            setFieldErrors((p) => ({ ...p, workMode: false }));
                        }}
                      >
                        <SelectTrigger
                          className={`mt-1.5 ${fieldErrors.workMode ? "border-destructive focus:ring-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.workMode && (
                        <p className="text-xs text-destructive mt-1">
                          Work mode is required.
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          placeholder="City, Country"
                          className="pr-10"
                        />
                        <Shield className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.openToBenchResources}
                          onCheckedChange={(value) =>
                            setFormData({
                              ...formData,
                              openToBenchResources: value,
                            })
                          }
                          className="data-[state=checked]:bg-green-500"
                        />
                        <div>
                          <p className="font-medium text-sm">
                            Open to Bench Resources
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Allow agencies and companies to propose their bench
                            employees
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
            <Card className="border border-border rounded-xl bg-card overflow-hidden">
              <CardContent className="px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      4
                    </span>
                  </div>
                  <h2 className="font-semibold text-xl text-foreground">
                    Budget & Duration
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <Label
                        htmlFor="duration"
                        className="text-sm font-medium text-foreground"
                      >
                        Duration
                      </Label>
                      <div className="flex gap-2 mt-1.5">
                        <Input
                          id="duration"
                          type="number"
                          placeholder="Enter duration"
                          min="1"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="flex-1"
                        />
                        <Select
                          value={formData.durationUnit}
                          onValueChange={(v) =>
                            setFormData({ ...formData, durationUnit: v })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Week</SelectItem>
                            <SelectItem value="month">Month</SelectItem>
                            <SelectItem value="year">Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium"
                      >
                        Start Date
                      </Label>
                      <div className="relative mt-1.5">
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Payment Type
                      </Label>
                      <Select
                        value={formData.paymentType}
                        onValueChange={(v) =>
                          setFormData({ ...formData, paymentType: v })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(v) =>
                          setFormData({ ...formData, currency: v })
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="budgetMin"
                        className="text-sm font-medium"
                      >
                        Min Budget
                        {formData.currency ? ` (${formData.currency})` : ""}
                      </Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        min="0"
                        value={formData.salaryMin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salaryMin: e.target.value,
                          })
                        }
                        placeholder="e.g., 1500"
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="budgetMax"
                        className="text-sm font-medium"
                      >
                        Max Budget
                        {formData.currency ? ` (${formData.currency})` : ""}
                      </Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        min="0"
                        value={formData.salaryMax}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salaryMax: e.target.value,
                          })
                        }
                        placeholder="e.g., 2500"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-between pt-6 border-t border-border">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="rounded-xl border-primary text-primary hover:bg-primary/5"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {isEditing && (
            <Button
              variant="ghost"
              onClick={handleDeleteJob}
              className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/5"
              disabled={deleteJobLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Job
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {!isEditing && (
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="rounded-xl"
              disabled={saveJobAsDraftLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveJobAsDraftLoading ? "Saving..." : "Save Draft"}
            </Button>
          )}

          {currentStep < totalSteps ? (
            <Button
              onClick={nextStep}
              className="rounded-xl bg-primary hover:bg-primary/90 px-8"
              disabled={isExtractingSkills}
            >
              {isExtractingSkills && currentStep === 1
                ? "Extracting Skills..."
                : "Next"}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePostJob}
                className="rounded-xl bg-primary hover:bg-primary/90"
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
                  className="rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:opacity-90 shadow-md transition-all active:scale-[0.98]"
                  disabled={createJobLoading}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {createJobLoading && postingAction === "postAndShow"
                    ? "Posting..."
                    : "Post & Show Relevant Profiles"}
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

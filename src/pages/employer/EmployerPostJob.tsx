import React, { useState, useEffect } from "react";
import { Plus, X, Shield, Save, Send, Sparkles, Trash2 } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateJobMutation,
  useGetJobsByIdQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "@/app/queries/jobApi";

const EmployerPostJob = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId");
  const jobId = jobIdParam ? parseInt(jobIdParam, 10) : null;
  const isEditing = Number.isFinite(jobId) && jobId !== null;

  const [createJob, { isLoading: createJobLoading }] = useCreateJobMutation();
  const [updateJob, { isLoading: updateJobLoading }] = useUpdateJobMutation();
  const [deleteJob, { isLoading: deleteJobLoading }] = useDeleteJobMutation();

  const { data: jobDetailsData, isLoading: jobDetailsLoading } =
    useGetJobsByIdQuery({ id: jobId }, { skip: !jobId });

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [postingAction, setPostingAction] = useState<
    "post" | "postAndShow" | null
  >(null);
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
    return Number.isFinite(numValue) && numValue >= 0 ? numValue : undefined;
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
    const minExperience = parsePositiveNumber(formData.minExperience);
    const maxExperience = parsePositiveNumber(formData.maxExperience);
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
      experienceLevel: formData.experienceLevel || undefined,
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
      enableAiTalentMatching: isEditing ? formData.enableAiMatching : enableAiMatching,
      aiMatchingEnabled: isEditing ? formData.enableAiMatching : enableAiMatching,
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

  const handleSaveDraft = () => {
    // TODO: integrate with a draft-save API endpoint.
    toast.info("Draft saving is not yet available.");
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
        // Update existing job
        response = await updateJob({ id: jobId, data: payload }).unwrap();
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
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(
        message || (isEditing ? "Failed to update job" : "Failed to post job"),
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
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || "Failed to delete job");
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
        <Accordion
          type="multiple"
          defaultValue={["basic", "skills", "location", "budget"]}
          className="space-y-4"
        >
          {/* Basic Information */}
          <AccordionItem
            value="basic"
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">1</span>
                </div>
                <span className="font-semibold text-foreground">
                  Basic Information
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-foreground"
                  >
                    Job Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Senior React Native Developer (Contract)"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Job Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={5}
                    className="mt-1.5 resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Job Category</Label>
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
                        <SelectItem value="engineering">Engineering</SelectItem>
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
            </AccordionContent>
          </AccordionItem>

          {/* Skills & Experience */}
          <AccordionItem
            value="skills"
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">2</span>
                </div>
                <span className="font-semibold text-foreground">
                  Skills & Experience
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">
                    Required Skills
                  </Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={addSkill}
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
            </AccordionContent>
          </AccordionItem>

          {/* Location & Terms */}
          <AccordionItem
            value="location"
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">3</span>
                </div>
                <span className="font-semibold text-foreground">
                  Location & Terms
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      Work Mode
                    </Label>
                    <Select
                      value={formData.workMode}
                      onValueChange={(v) =>
                        setFormData({ ...formData, workMode: v })
                      }
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select work mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
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
                          setFormData({ ...formData, location: e.target.value })
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
            </AccordionContent>
          </AccordionItem>

          {/* Budget & Duration */}
          <AccordionItem
            value="budget"
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">4</span>
                </div>
                <span className="font-semibold text-foreground">
                  Budget & Duration
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
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
                          setFormData({ ...formData, duration: e.target.value })
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
                    <Label htmlFor="startDate" className="text-sm font-medium">
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
                    <Label className="text-sm font-medium">Payment Type</Label>
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
                    <Label htmlFor="budgetMin" className="text-sm font-medium">
                      Min Budget
                      {formData.currency ? ` (${formData.currency})` : ""}
                    </Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      min="0"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMin: e.target.value })
                      }
                      placeholder="e.g., 1500"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budgetMax" className="text-sm font-medium">
                      Max Budget
                      {formData.currency ? ` (${formData.currency})` : ""}
                    </Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      min="0"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMax: e.target.value })
                      }
                      placeholder="e.g., 2500"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border">
        {isEditing && (
          <Button
            variant="outline"
            onClick={handleDeleteJob}
            className="rounded-xl text-destructive hover:text-destructive"
            disabled={deleteJobLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteJobLoading ? "Deleting..." : "Delete Job"}
          </Button>
        )}
        {!isEditing && (
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="rounded-xl"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        )}
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
            className="rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:opacity-90"
            disabled={createJobLoading}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {createJobLoading && postingAction === "postAndShow"
              ? "Posting..."
              : "Post & Show Relevant Profiles"}
          </Button>
        )}
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
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployerPostJob;

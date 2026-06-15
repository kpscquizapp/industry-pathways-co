import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Send,
  Sparkles,
  Trash2,
  Sparkles as SparklesIcon,
  MapPin,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  List,
  ListOrdered,
  Link,
  CheckCircle,
  Loader2,
  Plus,
  Check,
  PencilLine,
  CheckSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ExtractedSkill = {
  id: string;
  name: string;
  isPrimary: boolean;
};

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
import SpinnerLoader from "@/components/loader/SpinnerLoader";

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  category: "",
  role: "",
  status: "draft",
  location: "",
  city: "",
  state: "",
  country: "",
  multipleLocationsAllowed: false,
  employmentType: "",
  workMode: "",
  minExperience: "",
  maxExperience: "",
  experienceLevel: "",
  fresherAllowed: false,
  salaryMin: "",
  salaryMax: "",
  salaryType: "not-disclosed",
  currency: "USD",
  expectedBudgetMin: "",
  expectedBudgetMax: "",
  duration: "",
  durationUnit: "",
  startDate: "",
  expiresAt: "",
  paymentType: "",
  openings: "",
  jobVisibility: "public",
  urgency: "normal",
  openToBenchResources: false,
  certifications: "",
  educationQualification: "",
  languagesKnown: "",
  healthInsurance: false,
  esops: false,
  performanceBonus: false,
  remoteAllowance: false,
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
  equalOpportunityEmployer: true,
  dataPrivacyPolicies: true,
  termsAndConditions: false,
};

const SKILL_COLORS = [
  {
    bg: "bg-teal-50",
    text: "text-teal-700",
    close: "text-teal-400 hover:text-teal-600",
  },
  {
    bg: "bg-teal-50",
    text: "text-teal-700",
    close: "text-teal-400 hover:text-teal-600",
  },
  {
    bg: "bg-teal-50",
    text: "text-teal-700",
    close: "text-teal-400 hover:text-teal-600",
  },
  {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    close: "text-indigo-400 hover:text-indigo-600",
  },
  {
    bg: "bg-blue-50",
    text: "text-blue-700",
    close: "text-blue-400 hover:text-blue-600",
  },
];

const ToolbarBtn = ({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="p-2 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-[#112433]/10 hover:text-[#00e5ff]"
  >
    <Icon className="h-4 w-4" />
  </button>
);

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

  const [primarySkills, setPrimarySkills] = useState<string[]>([]);
  const [optionalSkills, setOptionalSkills] = useState<string[]>([]);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [isEditingPrimarySkills, setIsEditingPrimarySkills] = useState(false);
  const [showPrimarySkillsDisplay, setShowPrimarySkillsDisplay] =
    useState(false);
  const [editingExtractedSkillId, setEditingExtractedSkillId] = useState<
    string | null
  >(null);
  const [editingExtractedSkillName, setEditingExtractedSkillName] =
    useState("");
  const [skillInput, setSkillInput] = useState("");
  const [postingAction, setPostingAction] = useState<
    "post" | "postAndShow" | null
  >(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [skillsExtracted, setSkillsExtracted] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && jobDetailsData?.data?.[0]) {
      const job = jobDetailsData.data[0];
      setFormData({
        title: job.title || "",
        description: job.description || "",
        category: job.category || "",
        role: job.role || "",
        status: job.status || "draft",
        location: job.location || "",
        city: job.city || "",
        state: job.state || "",
        country: job.country || "",
        multipleLocationsAllowed:
          job.multipleLocationsAllowed || job.mltipleLocationsAllowed || false,
        employmentType: job.employmentType || "",
        workMode: job.workMode || "",
        minExperience: job.minExperience?.toString() || "",
        maxExperience: job.maxExperience?.toString() || "",
        experienceLevel: job.experienceLevel || "",
        fresherAllowed: job.fresherAllowed || false,
        salaryMin: job.salaryMin?.toString() || "",
        salaryMax: job.salaryMax?.toString() || "",
        salaryType: job.salaryType || "not-disclosed",
        currency: job.currency || "USD",
        expectedBudgetMin: job.expectedBudgetMin?.toString() || "",
        expectedBudgetMax: job.expectedBudgetMax?.toString() || "",
        duration: job.duration?.toString() || "",
        durationUnit: normalizeDurationUnit(job.durationUnit || ""),
        startDate: job.startDate || "",
        expiresAt: job.expiresAt || "",
        paymentType: job.paymentType || "",
        openings: job.numberOfOpenings?.toString() || "",
        jobVisibility: job.jobVisibility || "public",
        urgency: job.urgency || "normal",
        openToBenchResources: job.openToBenchResources || false,
        certifications: Array.isArray(job.certifications)
          ? job.certifications.join(", ")
          : "",
        educationQualification: job.educationQualification || "",
        languagesKnown: job.languagesKnown || "",
        healthInsurance: job.healthInsurance || false,
        esops: job.ESOPs || false,
        performanceBonus: job.performanceBonus || false,
        remoteAllowance: job.remoteAllowance || false,
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
        equalOpportunityEmployer: job.equalOpportunityEmployer || false,
        dataPrivacyPolicies: job.dataPrivacyPolicies || false,
        termsAndConditions: job.termsAndConditions || false,
      });
      let normalizedPrimary: string[] = [];
      let normalizedOptional: string[] = [];

      if (Array.isArray(job.skills)) {
        job.skills.forEach((s: any) => {
          const name = (typeof s === "string" ? s : (s.name ?? "")).trim();
          if (!name) return;
          const level =
            typeof s === "object" && s !== null ? s.proficiencyLevel : "";
          if (level === "intermediate") {
            normalizedOptional.push(name);
          } else {
            normalizedPrimary.push(name);
          }
        });
      }

      if (Array.isArray(job.optionalSkills)) {
        job.optionalSkills.forEach((s: any) => {
          const name = (typeof s === "string" ? s : (s.name ?? "")).trim();
          if (name && !normalizedOptional.includes(name)) {
            normalizedOptional.push(name);
          }
        });
      }

      // If we got some skills, but no optional skills and primary is > 5, split them (first 5 as primary, rest as optional)
      if (normalizedPrimary.length > 5 && normalizedOptional.length === 0) {
        normalizedOptional = normalizedPrimary.slice(5);
        normalizedPrimary = normalizedPrimary.slice(0, 5);
      }

      setPrimarySkills(normalizedPrimary);
      setOptionalSkills(normalizedOptional);
      if (normalizedPrimary.length > 0 || normalizedOptional.length > 0) {
        setSkillsExtracted(true);
      }
    } else if (!isEditing) {
      setFormData({ ...INITIAL_FORM_DATA });
      setPrimarySkills([]);
      setOptionalSkills([]);
      setExtractedSkills([]);
    }
  }, [isEditing, jobDetailsData]);

  useEffect(() => {
    if (
      descriptionRef.current &&
      formData.description &&
      !descriptionRef.current.innerHTML
    ) {
      descriptionRef.current.innerHTML = formData.description;
    }
  }, [formData.description]);

  const parseOptionalNumber = (value: string | number) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const parsePositiveNumber = (value: string | number) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const normalizeDurationUnit = (u: string) =>
    ({ weeks: "week", months: "month", years: "year" })[u] || u;
  const mapDurationUnit = (u: string) =>
    ({ week: "weeks", month: "months", year: "years" })[u] || undefined;
  const parseCertifications = (v: string) => {
    const items = v
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    return items.length ? items : undefined;
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
    const mapped = experienceLevelToRange(experienceLevel);
    if (mapped) return mapped;
    return {
      minExperience: parseOptionalNumber(minExp ?? ""),
      maxExperience: parseOptionalNumber(maxExp ?? ""),
    };
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
    const { minExperience, maxExperience } = mapExperienceLevelToYears(
      formData.experienceLevel,
      formData.minExperience,
      formData.maxExperience,
    );
    return {
      title: formData.title,
      description: formData.description,
      category: formData.category || undefined,
      role: formData.role || undefined,
      location: formData.location || undefined,
      city: formData.city || undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
      mltipleLocationsAllowed: formData.multipleLocationsAllowed,
      employmentType: formData.employmentType || undefined,
      workMode: formData.workMode || undefined,
      experienceLevel: formData.experienceLevel || undefined,
      minExperience,
      maxExperience,
      fresherAllowed: formData.fresherAllowed,
      salaryMin: normalizedSalaryMin,
      salaryMax: normalizedSalaryMax,
      salaryType: formData.salaryType || "not-disclosed",
      currency: formData.currency || "USD",
      expectedBudgetMin: parsePositiveNumber(formData.expectedBudgetMin),
      expectedBudgetMax: parsePositiveNumber(formData.expectedBudgetMax),
      duration: parseOptionalNumber(formData.duration),
      durationUnit: mapDurationUnit(formData.durationUnit),
      startDate: formData.startDate || undefined,
      expiresAt: formData.expiresAt || undefined,
      paymentType: formData.paymentType || undefined,
      numberOfOpenings: parsePositiveNumber(formData.openings),
      jobVisibility: formData.jobVisibility || "public",
      urgency: formData.urgency || "normal",
      openToBenchResources: formData.openToBenchResources,
      certifications: parseCertifications(formData.certifications),
      educationQualification: formData.educationQualification || undefined,
      languagesKnown: formData.languagesKnown || undefined,
      healthInsurance: formData.healthInsurance,
      ESOPs: formData.esops,
      performanceBonus: formData.performanceBonus,
      remoteAllowance: formData.remoteAllowance,
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
      aiEvaluationCriteria: undefined,
      autoAdvanceScore: parseOptionalNumber(formData.autoAdvanceScore),
      equalOpportunityEmployer: formData.equalOpportunityEmployer,
      dataPrivacyPolicies: formData.dataPrivacyPolicies,
      termsAndConditions: formData.termsAndConditions,
      skills: primarySkills.map((skill) => ({
        name: skill,
        proficiencyLevel: "beginner",
      })),
      optionalSkills: optionalSkills.map((skill) => ({
        name: skill,
        proficiencyLevel: "beginner",
      })),
    };
  };

  const normalizeSkill = (value: string) => value.toLowerCase().trim();

  const createLocalId = (prefix = "local") =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const syncExtractedSkillsFromCurrentSkills = () => {
    setExtractedSkills((prev) => {
      const previousByName = new Map(
        prev.map((skill) => [normalizeSkill(skill.name), skill]),
      );
      const next: ExtractedSkill[] = [];
      const seen = new Set<string>();

      const addSkill = (name: string, isPrimary: boolean) => {
        const normalized = normalizeSkill(name);
        if (!normalized || seen.has(normalized)) return;

        const existingSkill = previousByName.get(normalized);
        next.push({
          id: existingSkill?.id ?? createLocalId("ext"),
          name,
          isPrimary,
        });
        seen.add(normalized);
      };

      primarySkills.forEach((skill) => addSkill(skill, true));
      optionalSkills.forEach((skill) => addSkill(skill, false));

      return next;
    });
  };

  const handleTogglePrimarySkillsEdit = () => {
    setEditingExtractedSkillId(null);
    setEditingExtractedSkillName("");

    if (!isEditingPrimarySkills) {
      syncExtractedSkillsFromCurrentSkills();
    }

    setIsEditingPrimarySkills((prev) => !prev);
  };

  const handleToggleExtractedSkill = (id: string, check: boolean) => {
    const skill = extractedSkills.find((s) => s.id === id);
    if (!skill) return;

    if (check) {
      if (primarySkills.length >= 5) {
        toast.error(
          "You can only select up to 5 primary skills. Please uncheck one first.",
        );
        return;
      }

      setPrimarySkills((prev) => {
        const newPrimary = [...prev];
        if (
          !newPrimary.some(
            (s) => normalizeSkill(s) === normalizeSkill(skill.name),
          )
        ) {
          newPrimary.push(skill.name);
        }
        return newPrimary;
      });
      setExtractedSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPrimary: true } : s)),
      );
    } else {
      if (primarySkills.length <= 1) {
        toast.warning("You must have at least one primary skill overall");
        return;
      }
      setPrimarySkills((prev) =>
        prev.filter((s) => normalizeSkill(s) !== normalizeSkill(skill.name)),
      );
      setExtractedSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPrimary: false } : s)),
      );
    }
  };

  const getMergedSecondarySkills = (
    baseSecondarySkills: string[] = optionalSkills,
  ) => {
    const seen = new Set(baseSecondarySkills.map((s) => normalizeSkill(s)));
    const mergedSecondarySkills = [...baseSecondarySkills];

    extractedSkills.forEach((skill) => {
      if (skill.isPrimary) return;

      const normalized = normalizeSkill(skill.name);
      const inPrimary = primarySkills.some(
        (primarySkill) => normalizeSkill(primarySkill) === normalized,
      );

      if (!seen.has(normalized) && !inPrimary) {
        seen.add(normalized);
        mergedSecondarySkills.push(skill.name);
      }
    });

    return mergedSecondarySkills;
  };

  const handleUpdateSkillExtraction = () => {
    const syncedPrimarySkills = extractedSkills
      .filter((s) => s.isPrimary)
      .map((s) => s.name);

    const syncedSecondarySkills = extractedSkills
      .filter((s) => !s.isPrimary)
      .map((s) => s.name);

    setPrimarySkills(syncedPrimarySkills);
    setOptionalSkills(syncedSecondarySkills);

    setShowPrimarySkillsDisplay(false);
    setIsEditingPrimarySkills(false);
    toast.success("Skills updated successfully!");
  };

  const saveExtractedSkillEdit = (id: string) => {
    const skill = extractedSkills.find((s) => s.id === id);
    if (!skill) return;
    const newName = editingExtractedSkillName.trim();
    if (!newName) {
      toast.error("Skill name cannot be empty");
      return;
    }
    if (newName.length > 50) {
      toast.error("Skill name must be less than 50 characters");
      return;
    }

    if (
      extractedSkills.some(
        (s) =>
          s.id !== id && normalizeSkill(s.name) === normalizeSkill(newName),
      )
    ) {
      toast.error("This skill already exists in extracted skills");
      return;
    }

    setExtractedSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s)),
    );

    if (skill.isPrimary) {
      setPrimarySkills((prev) =>
        prev.map((s) =>
          normalizeSkill(s) === normalizeSkill(skill.name) ? newName : s,
        ),
      );
    } else {
      setOptionalSkills((prev) =>
        prev.map((s) =>
          normalizeSkill(s) === normalizeSkill(skill.name) ? newName : s,
        ),
      );
    }

    setEditingExtractedSkillId(null);
    setEditingExtractedSkillName("");
  };

  const deleteExtractedSkill = (id: string) => {
    const skill = extractedSkills.find((s) => s.id === id);
    if (!skill) return;

    const totalSkills =
      primarySkills.length + getMergedSecondarySkills().length;
    if (totalSkills <= 1) {
      toast.warning("You must keep at least one skill.");
      return;
    }

    if (skill.isPrimary && primarySkills.length <= 1) {
      toast.warning("You must have at least one primary skill overall");
      return;
    }

    setExtractedSkills((prev) => prev.filter((s) => s.id !== id));

    if (skill.isPrimary) {
      setPrimarySkills((prev) =>
        prev.filter((s) => normalizeSkill(s) !== normalizeSkill(skill.name)),
      );
    } else {
      setOptionalSkills((prev) =>
        prev.filter((s) => normalizeSkill(s) !== normalizeSkill(skill.name)),
      );
    }
  };

  const addSecondarySkill = () => {
    const name = skillInput.trim();

    if (!name) {
      toast.error("Please enter a skill name");
      return;
    }

    if (name.length > 50) {
      toast.error("Skill name must be less than 50 characters");
      return;
    }

    if (optionalSkills.length >= 50) {
      toast.error("You can add a maximum of 50 optional skills");
      return;
    }

    if (
      optionalSkills.some((skill) => skill.toLowerCase() === name.toLowerCase())
    ) {
      toast.error("This skill has already been added to optional skills");
      return;
    }

    if (
      primarySkills.some((skill) => skill.toLowerCase() === name.toLowerCase())
    ) {
      toast.error("This skill is already in primary skills");
      return;
    }

    setOptionalSkills((prev) => [...prev, name]);
    setExtractedSkills((prev) => {
      if (
        prev.some(
          (skill) => normalizeSkill(skill.name) === normalizeSkill(name),
        )
      ) {
        return prev;
      }

      return [
        ...prev,
        {
          id: createLocalId("ext"),
          name,
          isPrimary: false,
        },
      ];
    });
    setSkillInput("");

    if (fieldErrors.skills) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.skills;
        return newErrors;
      });
    }
  };

  const removeSecondarySkill = (skillToRemove: string) => {
    if (primarySkills.length + optionalSkills.length <= 1) {
      toast.warning("You must keep at least one skill.");
      return;
    }
    setOptionalSkills((prev) =>
      prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase()),
    );
    setExtractedSkills((prev) =>
      prev.filter(
        (s) => normalizeSkill(s.name) !== normalizeSkill(skillToRemove),
      ),
    );
  };

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (typeof error === "string" && error.trim()) return error;
    if (isFetchBaseQueryError(error)) {
      if (typeof error.status === "string") {
        switch (error.status) {
          case "FETCH_ERROR":
            return "Network error.";
          case "TIMEOUT_ERROR":
            return "Request timed out.";
          case "PARSING_ERROR":
            return "Unexpected response.";
        }
      }
      if (typeof error.data === "string" && error.data.trim())
        return error.data;
      if (
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
      ) {
        const msg = (error.data as { message?: unknown }).message;
        if (typeof msg === "string" && msg.trim()) return msg;
      }
    }
    if (error && typeof error === "object" && "message" in error) {
      const m = (error as { message?: unknown }).message;
      if (typeof m === "string" && m.trim()) return m;
    }
    return fallback;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (!formData.title.trim()) errors.title = true;
    if (!formData.description.trim()) errors.description = true;
    if (!formData.employmentType.trim()) errors.employmentType = true;
    if (!formData.workMode.trim()) errors.workMode = true;
    if (primarySkills.length === 0) errors.skills = true;
    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    try {
      const payload = buildCreateJobPayload(false);
      await saveJobAsDraft(payload).unwrap();
      toast.success("Job saved as draft successfully!");
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
    if (!validateForm()) return;
    try {
      const payload = buildCreateJobPayload(enableAiMatching);
      if (isEditing && jobId) {
        const job = jobDetailsData?.data?.[0];
        const currentStatus = job?.status ?? formData.status;
        const nextStatus =
          currentStatus === "draft" ? "published" : currentStatus;
        await updateJob({
          id: jobId,
          data: { ...payload, status: nextStatus },
        }).unwrap();
        toast.success("Job updated successfully!");
        navigate("/hire-talent/dashboard");
      } else {
        const response = await createJob(payload).unwrap();
        const createdJobId = getCreatedJobId(response);
        const jobState =
          enableAiMatching && response?.data
            ? { job: response.data }
            : undefined;
        if (enableAiMatching && !createdJobId)
          toast.warning(
            "Job posted, but could not retrieve job ID for AI matching.",
          );
        else
          toast.success(
            enableAiMatching
              ? "Job posted! Finding AI-matched candidates..."
              : "Job posted successfully!",
          );
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
    if (!jobId) return;
    setIsDeleteConfirmOpen(true);
  };
  const confirmDeleteJob = async () => {
    if (!jobId) return;
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

  const handleExtractSkills = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in the job title and description first.");
      return;
    }
    try {
      const result = await extractSkills({
        title: formData.title,
        content: formData.description,
      }).unwrap();
      const extracted = result?.data?.technicalSkills ?? [];
      if (extracted.length > 0) {
        const validExtractedSkills = extracted.filter(
          (s: any): s is string => typeof s === "string" && s.trim() !== "",
        );

        setShowPrimarySkillsDisplay(true);

        const currentPrimary = [...primarySkills];
        const currentSecondary = [...optionalSkills];
        const newExtractedObjects: ExtractedSkill[] = [];
        const newPrimarySkills = [...currentPrimary];
        const newSecondarySkills = [...currentSecondary];
        let checkedCount = currentPrimary.length;

        // Add all current primary skills into our local tracker so they appear in the banner checked.
        currentPrimary.forEach((skill) => {
          newExtractedObjects.push({
            id: createLocalId("ext"),
            name: skill,
            isPrimary: true,
          });
        });

        // Also include existing secondary skills in the banner (unchecked)
        currentSecondary.forEach((skill) => {
          newExtractedObjects.push({
            id: createLocalId("ext"),
            name: skill,
            isPrimary: false,
          });
        });

        let autoCheckedCount = checkedCount;
        let newCount = 0;
        const seenResumeSkills = new Set<string>();

        for (const skill of validExtractedSkills) {
          const normalized = normalizeSkill(skill);
          if (seenResumeSkills.has(normalized)) continue;

          const inPrimary = currentPrimary.some(
            (p) => normalizeSkill(p) === normalized,
          );
          const inSecondary = currentSecondary.some(
            (s) => normalizeSkill(s) === normalized,
          );

          if (!inPrimary && !inSecondary) {
            newCount++;
            // Completely new extracted skill
            if (autoCheckedCount < 5) {
              newPrimarySkills.push(skill);
              seenResumeSkills.add(normalized);
              newExtractedObjects.push({
                id: createLocalId("ext"),
                name: skill,
                isPrimary: true,
              });
              autoCheckedCount++;
            } else {
              newSecondarySkills.push(skill);
              seenResumeSkills.add(normalized);
              newExtractedObjects.push({
                id: createLocalId("ext"),
                name: skill,
                isPrimary: false,
              });
            }
          } else {
            seenResumeSkills.add(normalized);
          }
        }

        setExtractedSkills((prevExt) => {
          const updated = [...prevExt];
          for (const newObj of newExtractedObjects) {
            const existingIdx = updated.findIndex(
              (u) => normalizeSkill(u.name) === normalizeSkill(newObj.name),
            );
            if (existingIdx === -1) {
              updated.push(newObj);
            } else {
              updated[existingIdx] = {
                ...updated[existingIdx],
                isPrimary: newObj.isPrimary,
              };
            }
          }
          return updated;
        });

        setPrimarySkills(newPrimarySkills);
        setOptionalSkills(newSecondarySkills);
        setSkillsExtracted(true);

        if (newCount > 0)
          toast.success(
            `${newCount} new skill${newCount > 1 ? "s" : ""} extracted from description`,
          );
        else toast.info("All extracted skills already present");
      }
    } catch (err: unknown) {
      if (isFetchBaseQueryError(err) && err.status === 404)
        toast.warning(
          "Skill extraction endpoint not available. Add skills manually.",
        );
      else toast.warning("Could not auto-extract skills. Add them manually.");
    }
  };

  const execCommand = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    descriptionRef.current?.focus();
  };
  const handleDescriptionInput = () => {
    if (descriptionRef.current)
      setFormData((p) => ({
        ...p,
        description: descriptionRef.current?.innerHTML || "",
      }));
  };

  const currencySymbol =
    formData.currency === "EUR"
      ? "€"
      : formData.currency === "GBP"
        ? "£"
        : formData.currency === "INR"
          ? "₹"
          : "$";
  const isBusy =
    createJobLoading ||
    updateJobLoading ||
    saveJobAsDraftLoading ||
    deleteJobLoading;

  return (
    <div className="min-h-full font-inter bg-gray-50">
      <div className="max-w-full mx-auto py-6 md:py-10 px-6 sm:px-10 md:px-8 space-y-8 flex-1">
        {/* ═══════════════ HEADER ═══════════════ */}
        <div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight text-gray-900 leading-tight">
            {isEditing ? "Edit Job" : "Post New Job"}
          </h1>
          <p className="text-gray-400 text-[15px] mt-1">
            {isEditing
              ? "Update and republish your job listing."
              : "Create and publish a new role to get AI-ranked matches instantly."}
          </p>
        </div>

        {isEditing && jobDetailsLoading && (
          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm rounded-2xl mb-6">
            <CardContent className="p-8 flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-[#00e5ff]" />
              <p className="text-muted-foreground font-medium">
                Loading job details...
              </p>
            </CardContent>
          </Card>
        )}

        {/* ═══════════ SINGLE CARD FORM ═══════════ */}
        <div
          className={
            isEditing && jobDetailsLoading
              ? "pointer-events-none opacity-50"
              : ""
          }
        >
          <Card className="border border-[hsl(40 15% 88%)] shadow-[var(--shadow-card)] bg-[#ffffff] rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-10 space-y-10 bg-[#ffffff]">
              {/* ── Section: Basic Information ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">
                  Basic Information
                </h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label
                        htmlFor="title"
                        className={`text-xs font-bold text-foreground mb-2 block`}
                      >
                        Job Title <span className="text-destructive">*</span>
                      </Label>
                      <input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                          if (fieldErrors.title)
                            setFieldErrors((p) => ({
                              ...p,
                              title: false,
                            }));
                        }}
                        placeholder="e.g., Senior Frontend Developer"
                        className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${
                          fieldErrors.title
                            ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                            : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                        } focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                      />
                      {fieldErrors.title && (
                        <p className="text-xs text-destructive mt-1.5">
                          Job title is required.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Location
                      </Label>
                      <div className="relative">
                        <input
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          placeholder="Enter your location"
                          className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50"
                        />
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Details ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">
                  Details
                </h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Job Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.employmentType}
                        onValueChange={(v) => {
                          setFormData({ ...formData, employmentType: v });
                          if (fieldErrors.employmentType)
                            setFieldErrors((p) => ({
                              ...p,
                              employmentType: false,
                            }));
                        }}
                      >
                        <SelectTrigger
                          className={`w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50 ${fieldErrors.employmentType ? "border-destructive ring-1 ring-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.employmentType && (
                        <p className="text-xs text-destructive mt-1.5">
                          Job type is required.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Experience
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
                        <SelectTrigger className="w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">0-2 years</SelectItem>
                          <SelectItem value="mid">3-5 years</SelectItem>
                          <SelectItem value="mid-senior">6-9 years</SelectItem>
                          <SelectItem value="senior">10+ years</SelectItem>
                          <SelectItem value="lead">15+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Remote Friendly toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border mt-6">
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        Remote Friendly
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-0.5">
                        Allow candidates to work from anywhere
                      </p>
                    </div>
                    <Switch
                      checked={formData.workMode === "remote"}
                      onCheckedChange={(v) =>
                        setFormData({
                          ...formData,
                          workMode: v ? "remote" : "",
                        })
                      }
                      className="data-[state=checked]:bg-[#4dd9e8] accent-[#4dd9e8]"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section: Job Description ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Job Description <span className="text-destructive">*</span>
                </h2>
                <div
                  className={`mt-2 rounded-xl overflow-hidden transition-all border ${fieldErrors.description ? "border-destructive" : "border-[hsl(40 15% 88%)]"}`}
                  onClick={() => {
                    if (fieldErrors.description)
                      setFieldErrors((p) => ({
                        ...p,
                        description: false,
                      }));
                  }}
                >
                  <div className="flex items-center gap-1 px-4 py-2 border-b border-[hsl(40 15% 88%)] bg-white">
                    <ToolbarBtn
                      icon={Bold}
                      label="Bold"
                      onClick={() => execCommand("bold")}
                    />
                    <ToolbarBtn
                      icon={Italic}
                      label="Italic"
                      onClick={() => execCommand("italic")}
                    />
                    <ToolbarBtn
                      icon={UnderlineIcon}
                      label="Underline"
                      onClick={() => execCommand("underline")}
                    />
                    <div className="w-px h-5 bg-border/50 mx-1" />
                    <ToolbarBtn
                      icon={AlignLeft}
                      label="Align"
                      onClick={() => execCommand("justifyLeft")}
                    />
                    <ToolbarBtn
                      icon={List}
                      label="List"
                      onClick={() => execCommand("insertUnorderedList")}
                    />
                    <ToolbarBtn
                      icon={ListOrdered}
                      label="Ordered"
                      onClick={() => execCommand("insertOrderedList")}
                    />
                    <div className="w-px h-5 bg-border/50 mx-1" />
                    <ToolbarBtn
                      icon={Link}
                      label="Link"
                      onClick={() => {
                        const url = prompt("Enter URL:");
                        if (url) execCommand("createLink", url);
                      }}
                    />
                  </div>
                  <div
                    ref={descriptionRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="px-5 py-4 min-h-[180px] max-h-[350px] overflow-y-auto text-[14px] text-foreground leading-relaxed focus:outline-none bg-white"
                    onInput={handleDescriptionInput}
                    data-placeholder="Describe the role, responsibilities, and requirements..."
                  />
                </div>
                {fieldErrors.description && (
                  <p className="text-xs text-destructive mt-1.5">
                    Job description is required.
                  </p>
                )}

                {/* Save JD & Extract Skills */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleExtractSkills}
                    disabled={isExtractingSkills}
                    className="h-9 px-4 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isExtractingSkills ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" /> Save JD &amp;
                        Extract Skills
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Section: Skills Extraction Checkbox Grid ── */}
              {showPrimarySkillsDisplay &&
                extractedSkills.length > 0 &&
                !isEditingPrimarySkills && (
                  <div className="border border-[#4DD9E8]/20 bg-[#4DD9E8]/5 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-[#288e99]" />
                        <h3 className="text-base font-bold text-foreground">
                          Extracted Skills Selection
                        </h3>
                      </div>
                      {skillsExtracted && (
                        <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold">
                          <CheckCircle className="h-3.5 w-3.5" /> JD Skills
                          Extracted
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Select up to 5 primary skills from your extracted job
                      description. Unchecked skills will be added as optional
                      skills.
                    </p>
                    {extractedSkills.filter((s) => s.isPrimary).length > 0 && (
                      <p className="text-xs font-semibold text-gray-500">
                        {extractedSkills.filter((s) => s.isPrimary).length} / 5
                        primary skills selected
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {extractedSkills.map((skill) => {
                        const isChecked = skill.isPrimary;
                        return (
                          <div
                            key={skill.id}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                handleToggleExtractedSkill(
                                  skill.id,
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 text-[#4DD9E8] rounded border-gray-300 focus:ring-[#4DD9E8] accent-[#4DD9E8] min-h-0 min-w-0"
                            />
                            {editingExtractedSkillId === skill.id ? (
                              <div className="flex-1 flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editingExtractedSkillName}
                                  onChange={(e) =>
                                    setEditingExtractedSkillName(
                                      e.target.value.toLowerCase(),
                                    )
                                  }
                                  className="flex-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded outline-none focus:border-[#4DD9E8]"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    saveExtractedSkillEdit(skill.id)
                                  }
                                  className="text-green-500 hover:text-green-600 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingExtractedSkillId(null);
                                    setEditingExtractedSkillName("");
                                  }}
                                  className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex-1 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  {skill.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingExtractedSkillId(skill.id);
                                      setEditingExtractedSkillName(skill.name);
                                    }}
                                    className="text-gray-400 hover:text-[#4DD9E8] transition-colors"
                                  >
                                    <PencilLine className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteExtractedSkill(skill.id)
                                    }
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-end mt-4 pt-2">
                      <button
                        type="button"
                        onClick={handleUpdateSkillExtraction}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-xs"
                      >
                        Update Skills
                      </button>
                    </div>
                  </div>
                )}

              {/* ── Section: Required Skills Management Layout ── */}
              <div className="border border-border/80 p-6 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Label className="text-base font-bold text-foreground">
                      Skills
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTogglePrimarySkillsEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-sm shadow-none border-none"
                  >
                    <PencilLine className="w-4 h-4" />
                    {isEditingPrimarySkills ? "Done Editing" : "Edit Primary"}
                  </Button>
                </div>

                {/* Primary Skills Subsection - Only shown when editing */}
                {isEditingPrimarySkills && (
                  <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-xs font-semibold text-blue-900">
                        Edit Skills (Select up to 5 as Primary)
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Show all primary skills */}
                      {primarySkills.map((skillName, idx) => {
                        const extractedSkill = extractedSkills.find(
                          (s) =>
                            normalizeSkill(s.name) ===
                            normalizeSkill(skillName),
                        );
                        return (
                          <div
                            key={`primary-${skillName}-${idx}`}
                            className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-xl"
                          >
                            <input
                              type="checkbox"
                              checked={true}
                              onChange={(e) => {
                                if (!e.target.checked) {
                                  if (primarySkills.length <= 1) {
                                    toast.warning(
                                      "You must have at least one primary skill overall",
                                    );
                                    return;
                                  }
                                  // Move from primary to secondary
                                  setPrimarySkills((prev) =>
                                    prev.filter(
                                      (s) =>
                                        s.toLowerCase() !==
                                        skillName.toLowerCase(),
                                    ),
                                  );
                                  setOptionalSkills((prev) => {
                                    if (
                                      prev.some(
                                        (s) =>
                                          s.toLowerCase() ===
                                          skillName.toLowerCase(),
                                      )
                                    )
                                      return prev;
                                    return [...prev, skillName];
                                  });
                                  if (extractedSkill) {
                                    setExtractedSkills((prev) =>
                                      prev.map((s) =>
                                        s.id === extractedSkill.id
                                          ? { ...s, isPrimary: false }
                                          : s,
                                      ),
                                    );
                                  }
                                }
                              }}
                              className="w-4 h-4 text-[#4DD9E8] rounded border-gray-300 focus:ring-[#4DD9E8] accent-[#4DD9E8] min-h-0 min-w-0"
                            />
                            {extractedSkill &&
                            editingExtractedSkillId === extractedSkill.id ? (
                              <div className="flex-1 flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editingExtractedSkillName}
                                  onChange={(e) =>
                                    setEditingExtractedSkillName(
                                      e.target.value.toLowerCase(),
                                    )
                                  }
                                  className="flex-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded outline-none focus:border-[#4DD9E8]"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    saveExtractedSkillEdit(extractedSkill.id)
                                  }
                                  className="text-green-500 hover:text-green-600 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingExtractedSkillId(null);
                                    setEditingExtractedSkillName("");
                                  }}
                                  className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex-1 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  {skillName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (extractedSkill) {
                                        setEditingExtractedSkillId(
                                          extractedSkill.id,
                                        );
                                        setEditingExtractedSkillName(
                                          extractedSkill.name,
                                        );
                                      } else {
                                        const newId = createLocalId("ext");
                                        setExtractedSkills((prev) => [
                                          ...prev,
                                          {
                                            id: newId,
                                            name: skillName,
                                            isPrimary: true,
                                          },
                                        ]);
                                        setEditingExtractedSkillId(newId);
                                        setEditingExtractedSkillName(skillName);
                                      }
                                    }}
                                    className="text-gray-400 hover:text-[#4DD9E8] transition-colors"
                                  >
                                    <PencilLine className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (extractedSkill) {
                                        deleteExtractedSkill(extractedSkill.id);
                                      } else {
                                        if (primarySkills.length <= 1) {
                                          toast.warning(
                                            "You must have at least one primary skill overall",
                                          );
                                          return;
                                        }
                                        setPrimarySkills((prev) =>
                                          prev.filter(
                                            (s) =>
                                              s.toLowerCase() !==
                                              skillName.toLowerCase(),
                                          ),
                                        );
                                      }
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Show all secondary skills */}
                      {optionalSkills.map((skillName, idx) => {
                        const extractedSkill = extractedSkills.find(
                          (s) =>
                            normalizeSkill(s.name) ===
                            normalizeSkill(skillName),
                        );
                        return (
                          <div
                            key={`secondary-${skillName}-${idx}`}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                          >
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (primarySkills.length >= 5) {
                                    toast.error(
                                      "You can only select up to 5 primary skills. Please uncheck one first.",
                                    );
                                    return;
                                  }
                                  // Move from secondary to primary
                                  setPrimarySkills((prev) => {
                                    if (
                                      prev.some(
                                        (s) =>
                                          s.toLowerCase() ===
                                          skillName.toLowerCase(),
                                      )
                                    )
                                      return prev;
                                    return [...prev, skillName];
                                  });
                                  setOptionalSkills((prev) =>
                                    prev.filter(
                                      (s) =>
                                        s.toLowerCase() !==
                                        skillName.toLowerCase(),
                                    ),
                                  );
                                  if (extractedSkill) {
                                    setExtractedSkills((prev) =>
                                      prev.map((s) =>
                                        s.id === extractedSkill.id
                                          ? { ...s, isPrimary: true }
                                          : s,
                                      ),
                                    );
                                  } else {
                                    setExtractedSkills((prev) => [
                                      ...prev,
                                      {
                                        id: createLocalId("ext"),
                                        name: skillName,
                                        isPrimary: true,
                                      },
                                    ]);
                                  }
                                }
                              }}
                              className="w-4 h-4 text-[#4DD9E8] rounded border-gray-300 focus:ring-[#4DD9E8] accent-[#4DD9E8] min-h-0 min-w-0"
                            />
                            {extractedSkill &&
                            editingExtractedSkillId === extractedSkill.id ? (
                              <div className="flex-1 flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={editingExtractedSkillName}
                                  onChange={(e) =>
                                    setEditingExtractedSkillName(
                                      e.target.value.toLowerCase(),
                                    )
                                  }
                                  className="flex-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded outline-none focus:border-[#4DD9E8]"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    saveExtractedSkillEdit(extractedSkill.id)
                                  }
                                  className="text-green-500 hover:text-green-600 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingExtractedSkillId(null);
                                    setEditingExtractedSkillName("");
                                  }}
                                  className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex-1 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">
                                  {skillName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (extractedSkill) {
                                        setEditingExtractedSkillId(
                                          extractedSkill.id,
                                        );
                                        setEditingExtractedSkillName(
                                          extractedSkill.name,
                                        );
                                      } else {
                                        const newId = createLocalId("ext");
                                        setExtractedSkills((prev) => [
                                          ...prev,
                                          {
                                            id: newId,
                                            name: skillName,
                                            isPrimary: false,
                                          },
                                        ]);
                                        setEditingExtractedSkillId(newId);
                                        setEditingExtractedSkillName(skillName);
                                      }
                                    }}
                                    className="text-gray-400 hover:text-[#4DD9E8] transition-colors"
                                  >
                                    <PencilLine className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const totalSkills =
                                        primarySkills.length +
                                        optionalSkills.length;

                                      if (totalSkills <= 1) {
                                        toast.warning(
                                          "You must keep at least one skill.",
                                        );
                                        return;
                                      }

                                      if (extractedSkill) {
                                        deleteExtractedSkill(extractedSkill.id);
                                      } else {
                                        removeSecondarySkill(skillName);
                                      }
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {primarySkills.length > 0 && (
                      <p className="text-xs font-medium text-blue-600 mt-3">
                        {primarySkills.length} / 5 primary skills selected
                      </p>
                    )}
                    <div className="flex items-center justify-end mt-4 pt-2">
                      <button
                        type="button"
                        onClick={handleUpdateSkillExtraction}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-xs"
                      >
                        Update Skills
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Skills Display - Always shown when skills exist and not editing */}
                {!isEditingPrimarySkills && primarySkills.length > 0 && (
                  <div className="p-4 bg-[#4DD9E8]/10 border border-[#4DD9E8] rounded-xl">
                    <h4 className="text-sm font-semibold text-inherit mb-3">
                      Primary Skills <span className="text-destructive">*</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {primarySkills.map((skill, index) => (
                        <div
                          key={`${skill}-${index}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD9E8]/20 text-[#288e99] rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {fieldErrors.skills && primarySkills.length === 0 && (
                  <p className="text-xs text-destructive">
                    At least one primary skill is required.
                  </p>
                )}

                {/* Optional Skills Subsection */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Optional Skills
                  </h4>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) =>
                        setSkillInput(e.target.value.toLowerCase())
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addSecondarySkill())
                      }
                      maxLength={50}
                      placeholder="Add an optional skill (e.g., TypeScript)"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] outline-none rounded-xl"
                    />
                    <Button
                      type="button"
                      onClick={addSecondarySkill}
                      className="px-5 py-2.5 bg-[#4DD9E8] text-white rounded-xl hover:bg-[#4DD9E8]/90 transition shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {optionalSkills.map((name, index) => (
                      <div
                        key={`${name}-${index}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD9E8]/10 text-[#288e99] rounded-xl text-sm font-medium"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => removeSecondarySkill(name)}
                          className="hover:text-red-500 transition-colors bg-white/50 rounded-full p-0.5 min-w-0 min-h-0"
                          aria-label={`Remove ${name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-between items-center flex-wrap gap-y-3">
                    {optionalSkills.length === 0 && (
                      <p className="text-sm text-gray-400 italic">
                        No optional skills added yet.
                      </p>
                    )}
                    {optionalSkills.length > 0 && (
                      <p className="text-xs font-medium text-gray-400 mt-3">
                        {optionalSkills.length} optional skills added
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Section: Additional Details ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">
                  Additional Details
                </h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Job Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) =>
                          setFormData({ ...formData, category: v })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50">
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
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Number of Openings
                      </Label>
                      <input
                        type="number"
                        placeholder="e.g. 3"
                        min="1"
                        max="999"
                        value={formData.openings}
                        onChange={(e) =>
                          setFormData({ ...formData, openings: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label
                        className={`text-xs font-bold text-foreground mb-2 block`}
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
                          className={`w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50 ${fieldErrors.workMode ? "border-destructive ring-1 ring-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="on-site">On-site</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.workMode && (
                        <p className="text-xs text-destructive mt-1.5">
                          Work mode is required.
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Certifications
                      </Label>
                      <input
                        value={formData.certifications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            certifications: e.target.value,
                          })
                        }
                        placeholder="e.g., AWS Certified, PMP, CISSP"
                        className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* Bench Resources toggle */}
                  <div className="p-5 rounded-2xl bg-gray-50 border border-primary/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={formData.openToBenchResources}
                          onCheckedChange={(v) =>
                            setFormData({
                              ...formData,
                              openToBenchResources: v,
                            })
                          }
                          className="accent-[#4dd9e8]"
                        />
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-sm">
                            Open to Bench Resources
                          </p>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            Allow agencies to propose their bench employees for
                            this role.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Budget & Duration ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">
                  Budget & Duration
                </h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Duration
                      </Label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Value"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50"
                        />
                        <Select
                          value={formData.durationUnit}
                          onValueChange={(v) =>
                            setFormData({ ...formData, durationUnit: v })
                          }
                        >
                          <SelectTrigger className="w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Weeks</SelectItem>
                            <SelectItem value="month">Months</SelectItem>
                            <SelectItem value="year">Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Start Date
                      </Label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Payment Type
                      </Label>
                      <Select
                        value={formData.paymentType}
                        onValueChange={(v) =>
                          setFormData({ ...formData, paymentType: v })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly Rate</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="fixed">Fixed Price</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Currency
                      </Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(v) =>
                          setFormData({ ...formData, currency: v })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">
                        Salary Range
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                            {currencySymbol}
                          </span>
                          <input
                            type="number"
                            value={formData.salaryMin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salaryMin: e.target.value,
                              })
                            }
                            placeholder=""
                            className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50 pl-6"
                          />
                        </div>
                        <span className="text-muted-foreground/60">–</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                            {currencySymbol}
                          </span>
                          <input
                            type="number"
                            value={formData.salaryMax}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salaryMax: e.target.value,
                              })
                            }
                            placeholder=""
                            className="w-full px-4 py-2.5 border-0 ring-1 outline-none ring-inset ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700 focus:ring-1 focus:ring-inset dark:bg-slate-900 rounded-xl bg-gray-50 pl-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Footer Buttons ── */}
          <div className="flex justify-end gap-3 mt-8">
            {isEditing && (
              <Button
                variant="ghost"
                onClick={handleDeleteJob}
                className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold h-10 mr-auto bg-white border border-gray-300 hover:bg-gray-50/10 transition-all disabled:opacity-50 hover:bg-red-50"
                disabled={deleteJobLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            {!isEditing && (
              <button
                onClick={handleSaveDraft}
                className="rounded-xl border-gray-200 text-foreground min-w-[100px] font-semibold h-10 border text-sm border-gray-300 hover:bg-gray-50/10 transition-all disabled:opacity-50 text-gray-700 bg-white"
                disabled={saveJobAsDraftLoading}
              >
                {saveJobAsDraftLoading ? "Saving..." : "Save Draft"}
              </button>
            )}
            <Button
              onClick={handlePostAndShowProfiles}
              disabled={isBusy}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] dark:bg-[#4DD9E8]/10 hover:bg-[#1a1a2e]/90 dark:hover:bg-[#4DD9E8]/20 text-white dark:text-[#4DD9E8] font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm"
            >
              {createJobLoading && postingAction === "postAndShow" ? (
                <>
                  <SpinnerLoader className="mr-2" />
                  Posting...
                </>
              ) : isEditing ? (
                "Update Job"
              ) : (
                "Post Job & Run AI Match"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row justify-end">
            <AlertDialogAction
              onClick={confirmDeleteJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
            >
              Delete
            </AlertDialogAction>
            <AlertDialogCancel className="rounded-xl hover:bg-gray-100 text-gray-600">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        [contenteditable][data-placeholder]:empty::before { content: attr(data-placeholder); color: hsl(var(--muted-foreground)); pointer-events: none; display: block; }
        [contenteditable] a { color: hsl(var(--primary)); text-decoration: underline; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] li { margin-bottom: 0.25rem; }
        [contenteditable] b, [contenteditable] strong { font-weight: 600; color: hsl(var(--foreground)); }
      `}</style>
    </div>
  );
};

export default EmployerPostJob;

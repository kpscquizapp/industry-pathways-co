import React, { useState, useEffect, useRef } from "react";
import {
  X, Save, Send, Sparkles, Trash2,
  Sparkles as SparklesIcon, MapPin, Bold, Italic, Underline as UnderlineIcon,
  AlignLeft, List, ListOrdered, Link, CheckCircle, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateJobMutation, useGetJobsByIdQuery, useUpdateJobMutation,
  useDeleteJobMutation, useSaveJobAsDraftMutation,
} from "@/app/queries/jobApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useExtractSkillsMutation } from "@/app/queries/atsApi";
import isFetchBaseQueryError from "@/hooks/isFetchBaseQueryError";

const INITIAL_FORM_DATA = {
  title: "", description: "", category: "", role: "", status: "draft",
  location: "", city: "", state: "", country: "", multipleLocationsAllowed: false,
  employmentType: "", workMode: "",
  minExperience: "", maxExperience: "", experienceLevel: "", fresherAllowed: false,
  salaryMin: "", salaryMax: "", salaryType: "not-disclosed", currency: "USD",
  expectedBudgetMin: "", expectedBudgetMax: "",
  duration: "", durationUnit: "", startDate: "", expiresAt: "",
  paymentType: "",
  openings: "", jobVisibility: "public", urgency: "normal", openToBenchResources: false,
  certifications: "", educationQualification: "", languagesKnown: "",
  healthInsurance: false, esops: false, performanceBonus: false, remoteAllowance: false,
  enableAiMatching: true, autoScreenCandidates: false, enableSkillAssessment: true,
  scheduleAIInterview: false, testType: "", difficultyLevel: "", timeLimit: "",
  autoRejectBelowScore: "", interviewType: "", autoAdvanceScore: "",
  equalOpportunityEmployer: true, dataPrivacyPolicies: true, termsAndConditions: false,
};

const SKILL_COLORS = [
  { bg: "bg-teal-50", text: "text-teal-700", close: "text-teal-400 hover:text-teal-600" },
  { bg: "bg-teal-50", text: "text-teal-700", close: "text-teal-400 hover:text-teal-600" },
  { bg: "bg-teal-50", text: "text-teal-700", close: "text-teal-400 hover:text-teal-600" },
  { bg: "bg-indigo-50", text: "text-indigo-700", close: "text-indigo-400 hover:text-indigo-600" },
  { bg: "bg-blue-50", text: "text-blue-700", close: "text-blue-400 hover:text-blue-600" },
];

const ToolbarBtn = ({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick?: () => void }) => (
  <button type="button" aria-label={label} onClick={onClick}
    className="p-2 rounded-lg transition-all duration-200 text-muted-foreground hover:bg-[#112433]/10 hover:text-[#00e5ff]">
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
  const [saveJobAsDraft, { isLoading: saveJobAsDraftLoading }] = useSaveJobAsDraftMutation();
  const [extractSkills, { isLoading: isExtractingSkills }] = useExtractSkillsMutation();
  const { data: jobDetailsData, isLoading: jobDetailsLoading } = useGetJobsByIdQuery(isEditing ? { id: jobId } : skipToken);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [postingAction, setPostingAction] = useState<"post" | "postAndShow" | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [skillsExtracted, setSkillsExtracted] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && jobDetailsData?.data?.[0]) {
      const job = jobDetailsData.data[0];
      setFormData({
        title: job.title || "", description: job.description || "",
        category: job.category || "", role: job.role || "", status: job.status || "draft",
        location: job.location || "", city: job.city || "", state: job.state || "",
        country: job.country || "",
        multipleLocationsAllowed: job.multipleLocationsAllowed || job.mltipleLocationsAllowed || false,
        employmentType: job.employmentType || "", workMode: job.workMode || "",
        minExperience: job.minExperience?.toString() || "",
        maxExperience: job.maxExperience?.toString() || "",
        experienceLevel: job.experienceLevel || "", fresherAllowed: job.fresherAllowed || false,
        salaryMin: job.salaryMin?.toString() || "", salaryMax: job.salaryMax?.toString() || "",
        salaryType: job.salaryType || "not-disclosed", currency: job.currency || "USD",
        expectedBudgetMin: job.expectedBudgetMin?.toString() || "",
        expectedBudgetMax: job.expectedBudgetMax?.toString() || "",
        duration: job.duration?.toString() || "",
        durationUnit: normalizeDurationUnit(job.durationUnit || ""),
        startDate: job.startDate || "", expiresAt: job.expiresAt || "",
        paymentType: job.paymentType || "",
        openings: job.numberOfOpenings?.toString() || "",
        jobVisibility: job.jobVisibility || "public", urgency: job.urgency || "normal",
        openToBenchResources: job.openToBenchResources || false,
        certifications: Array.isArray(job.certifications) ? job.certifications.join(", ") : "",
        educationQualification: job.educationQualification || "",
        languagesKnown: job.languagesKnown || "",
        healthInsurance: job.healthInsurance || false, esops: job.ESOPs || false,
        performanceBonus: job.performanceBonus || false, remoteAllowance: job.remoteAllowance || false,
        enableAiMatching: job.enableAiTalentMatching || job.aiMatchingEnabled || false,
        autoScreenCandidates: job.autoScreenCandidates || false,
        enableSkillAssessment: job.enableSkillAssessment || false,
        scheduleAIInterview: job.scheduleAIInterviews || false,
        testType: job.testType || "", difficultyLevel: job.difficultyLevel || "",
        timeLimit: job.timeLimit?.toString() || "",
        autoRejectBelowScore: job.autoRejectBelowScore?.toString() || "",
        interviewType: job.interviewType || "",
        autoAdvanceScore: job.autoAdvanceScore?.toString() || "",
        equalOpportunityEmployer: job.equalOpportunityEmployer || false,
        dataPrivacyPolicies: job.dataPrivacyPolicies || false,
        termsAndConditions: job.termsAndConditions || false,
      });
      const normalizedSkills = Array.isArray(job.skills)
        ? job.skills.map((s: { name?: string } | string) => typeof s === "string" ? s : (s.name ?? "")).map((s) => s.trim()).filter(Boolean)
        : [];
      setSkills(normalizedSkills);
      if (normalizedSkills.length > 0) setSkillsExtracted(true);
    } else if (!isEditing) {
      setFormData({ ...INITIAL_FORM_DATA }); setSkills([]);
    }
  }, [isEditing, jobDetailsData]);

  useEffect(() => {
    if (descriptionRef.current && formData.description && !descriptionRef.current.innerHTML) {
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
  const normalizeDurationUnit = (u: string) => ({ weeks: "week", months: "month", years: "year" }[u] || u);
  const mapDurationUnit = (u: string) => ({ week: "weeks", month: "months", year: "years" }[u] || undefined);
  const parseCertifications = (v: string) => { const items = v.split(",").map(i => i.trim()).filter(Boolean); return items.length ? items : undefined; };

  const experienceLevelToRange = (level: string): { minExperience: number; maxExperience: number | null } | null => {
    switch (level?.toLowerCase()) {
      case "junior": return { minExperience: 0, maxExperience: 2 };
      case "mid": case "mid-level": return { minExperience: 3, maxExperience: 5 };
      case "mid-senior": return { minExperience: 6, maxExperience: 9 };
      case "senior": return { minExperience: 10, maxExperience: null };
      case "lead": case "principal": return { minExperience: 15, maxExperience: null };
      default: return null;
    }
  };

  const mapExperienceLevelToYears = (experienceLevel: string, minExp: string | number | undefined, maxExp: string | number | undefined) => {
    const mapped = experienceLevelToRange(experienceLevel);
    if (mapped) return mapped;
    return { minExperience: parseOptionalNumber(minExp ?? ""), maxExperience: parseOptionalNumber(maxExp ?? "") };
  };

  const buildCreateJobPayload = (enableAiMatching: boolean) => {
    const salaryMin = parseOptionalNumber(formData.salaryMin);
    const salaryMax = parseOptionalNumber(formData.salaryMax);
    const normalizedSalaryMin = salaryMin !== undefined && salaryMax !== undefined && salaryMin > salaryMax ? salaryMax : salaryMin;
    const normalizedSalaryMax = salaryMin !== undefined && salaryMax !== undefined && salaryMin > salaryMax ? salaryMin : salaryMax;
    const { minExperience, maxExperience } = mapExperienceLevelToYears(formData.experienceLevel, formData.minExperience, formData.maxExperience);
    return {
      title: formData.title, description: formData.description,
      category: formData.category || undefined, role: formData.role || undefined,
      location: formData.location || undefined, city: formData.city || undefined,
      state: formData.state || undefined, country: formData.country || undefined,
      mltipleLocationsAllowed: formData.multipleLocationsAllowed,
      employmentType: formData.employmentType || undefined, workMode: formData.workMode || undefined,
      experienceLevel: formData.experienceLevel || undefined,
      minExperience, maxExperience, fresherAllowed: formData.fresherAllowed,
      salaryMin: normalizedSalaryMin, salaryMax: normalizedSalaryMax,
      salaryType: formData.salaryType || "not-disclosed", currency: formData.currency || "USD",
      expectedBudgetMin: parsePositiveNumber(formData.expectedBudgetMin),
      expectedBudgetMax: parsePositiveNumber(formData.expectedBudgetMax),
      duration: parseOptionalNumber(formData.duration), durationUnit: mapDurationUnit(formData.durationUnit),
      startDate: formData.startDate || undefined, expiresAt: formData.expiresAt || undefined,
      paymentType: formData.paymentType || undefined,
      numberOfOpenings: parsePositiveNumber(formData.openings),
      jobVisibility: formData.jobVisibility || "public", urgency: formData.urgency || "normal",
      openToBenchResources: formData.openToBenchResources,
      certifications: parseCertifications(formData.certifications),
      educationQualification: formData.educationQualification || undefined,
      languagesKnown: formData.languagesKnown || undefined,
      healthInsurance: formData.healthInsurance, ESOPs: formData.esops,
      performanceBonus: formData.performanceBonus, remoteAllowance: formData.remoteAllowance,
      enableAiTalentMatching: isEditing ? formData.enableAiMatching : enableAiMatching,
      aiMatchingEnabled: isEditing ? formData.enableAiMatching : enableAiMatching,
      autoScreenCandidates: formData.autoScreenCandidates,
      enableSkillAssessment: formData.enableSkillAssessment,
      scheduleAIInterviews: formData.scheduleAIInterview,
      testType: formData.testType || undefined, difficultyLevel: formData.difficultyLevel || undefined,
      timeLimit: parseOptionalNumber(formData.timeLimit),
      autoRejectBelowScore: parseOptionalNumber(formData.autoRejectBelowScore),
      interviewType: formData.interviewType || undefined, aiEvaluationCriteria: undefined,
      autoAdvanceScore: parseOptionalNumber(formData.autoAdvanceScore),
      equalOpportunityEmployer: formData.equalOpportunityEmployer,
      dataPrivacyPolicies: formData.dataPrivacyPolicies, termsAndConditions: formData.termsAndConditions,
      skills: skills.map((skill) => ({ name: skill })),
    };
  };

  const addSkill = () => { if (newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills([...skills, newSkill.trim()]); setNewSkill(""); } };
  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  const getErrorMessage = (error: unknown, fallback: string): string => {
    if (typeof error === "string" && error.trim()) return error;
    if (isFetchBaseQueryError(error)) {
      if (typeof error.status === "string") { switch (error.status) { case "FETCH_ERROR": return "Network error."; case "TIMEOUT_ERROR": return "Request timed out."; case "PARSING_ERROR": return "Unexpected response."; } }
      if (typeof error.data === "string" && error.data.trim()) return error.data;
      if (typeof error.data === "object" && error.data !== null && "message" in error.data) { const msg = (error.data as { message?: unknown }).message; if (typeof msg === "string" && msg.trim()) return msg; }
    }
    if (error && typeof error === "object" && "message" in error) { const m = (error as { message?: unknown }).message; if (typeof m === "string" && m.trim()) return m; }
    return fallback;
  };

  const handleSaveDraft = async () => {
    try {
      const payload = buildCreateJobPayload(false);
      if (!payload.title?.trim() || !payload.description?.trim()) { toast.error("Job title and description are required."); return; }
      await saveJobAsDraft(payload).unwrap();
      toast.success("Job saved as draft successfully!"); navigate("/hire-talent/jobs");
    } catch (error: unknown) { toast.error(getErrorMessage(error, "Failed to save draft")); }
  };

  const getCreatedJobId = (response: { data?: { id?: string | number; job?: { id?: string | number } }; id?: string | number } | undefined) =>
    response?.data?.id ?? response?.data?.job?.id ?? response?.id;

  const submitJob = async (enableAiMatching: boolean, redirectPath: string) => {
    try {
      const payload = buildCreateJobPayload(enableAiMatching);
      if (!payload.title?.trim() || !payload.description?.trim()) { toast.error("Job title and description are required."); return; }
      if (isEditing && jobId) {
        const job = jobDetailsData?.data?.[0]; const currentStatus = job?.status ?? formData.status;
        const nextStatus = currentStatus === "draft" ? "published" : currentStatus;
        await updateJob({ id: jobId, data: { ...payload, status: nextStatus } }).unwrap();
        toast.success("Job updated successfully!"); navigate("/hire-talent/dashboard");
      } else {
        const response = await createJob(payload).unwrap();
        const createdJobId = getCreatedJobId(response);
        const jobState = enableAiMatching && response?.data ? { job: response.data } : undefined;
        if (enableAiMatching && !createdJobId) toast.warning("Job posted, but could not retrieve job ID for AI matching.");
        else toast.success(enableAiMatching ? "Job posted! Finding AI-matched candidates..." : "Job posted successfully!");
        const redirectUrl = enableAiMatching && createdJobId ? `${redirectPath}?jobId=${createdJobId}` : redirectPath;
        navigate(redirectUrl, jobState ? { state: jobState } : undefined);
      }
    } catch (error: unknown) { toast.error(getErrorMessage(error, isEditing ? "Failed to update job" : "Failed to post job")); }
  };

  const handleDeleteJob = () => { if (!jobId) return; setIsDeleteConfirmOpen(true); };
  const confirmDeleteJob = async () => {
    if (!jobId) return;
    try { await deleteJob({ id: jobId }).unwrap(); toast.success("Job deleted successfully!"); navigate("/hire-talent/jobs"); }
    catch (error: unknown) { toast.error(getErrorMessage(error, "Failed to delete job")); }
  };
  const handlePostJob = async () => { setPostingAction("post"); try { await submitJob(false, "/hire-talent/dashboard"); } finally { setPostingAction(null); } };
  const handlePostAndShowProfiles = async () => { setPostingAction("postAndShow"); try { await submitJob(true, "/hire-talent/ai-shortlists"); } finally { setPostingAction(null); } };

  const handleExtractSkills = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in the job title and description first.");
      return;
    }
    try {
      const result = await extractSkills({ title: formData.title, content: formData.description }).unwrap();
      const extracted = result?.data?.technicalSkills ?? [];
      if (extracted.length > 0) {
        const merged = [...skills]; const lowerSet = new Set(merged.map((s) => s.toLowerCase())); let newCount = 0;
        extracted.forEach((s: string) => { if (!lowerSet.has(s.toLowerCase())) { merged.push(s); lowerSet.add(s.toLowerCase()); newCount++; } });
        setSkills(merged); setSkillsExtracted(true);
        if (newCount > 0) toast.success(`${newCount} new skill${newCount > 1 ? "s" : ""} extracted from description`);
        else toast.info("All extracted skills already present");
      }
    } catch (err: unknown) {
      if (isFetchBaseQueryError(err) && err.status === 404) toast.warning("Skill extraction endpoint not available. Add skills manually.");
      else toast.warning("Could not auto-extract skills. Add them manually.");
    }
  };

  const execCommand = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); descriptionRef.current?.focus(); };
  const handleDescriptionInput = () => { if (descriptionRef.current) setFormData((p) => ({ ...p, description: descriptionRef.current?.innerHTML || "" })); };

  const currencySymbol = formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "INR" ? "₹" : "$";
  const isBusy = createJobLoading || updateJobLoading || saveJobAsDraftLoading || deleteJobLoading;

  return (
    <div className="min-h-screen bg-[#f2f5fa] font-sans flex flex-col">
      {/* Page Header — replacing dashboard layout header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 py-2.5 sm:py-3.5 shrink-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:bg-gray-100" title="Toggle Sidebar" />
          <div className="space-y-0.5">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#112433]">
              {isEditing ? "Edit Job" : "Post New Job"}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
              {isEditing ? "Update and republish your job listing." : "Create and publish a new role to get AI-ranked matches instantly."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl h-9 px-4 text-sm font-medium border-gray-200">Cancel</Button>
          <Button onClick={handlePostAndShowProfiles} disabled={isBusy}
            className="rounded-xl bg-[#00A99D] hover:bg-[#00968b] text-white px-5 h-9 text-sm font-semibold shadow-sm transition-all duration-300">
            <SparklesIcon className="h-3.5 w-3.5 mr-1.5" />Publish Job
          </Button>
        </div>
      </div>

      <div className="max-w-[1000px] w-full mx-auto py-6 md:py-8 px-2 md:px-4 flex-1">

        {isEditing && jobDetailsLoading && (
          <Card className="border-none shadow-lg bg-card/80 backdrop-blur-sm rounded-2xl mb-6">
            <CardContent className="p-8 flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-[#00e5ff]" />
              <p className="text-muted-foreground font-medium">Loading job details...</p>
            </CardContent>
          </Card>
        )}

        {/* ═══════════ SINGLE CARD FORM ═══════════ */}
        <div className={isEditing && jobDetailsLoading ? "pointer-events-none opacity-50" : ""}>
          <Card className="border border-border/50 shadow-[var(--shadow-card)] bg-[#ffffff] rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-10 space-y-10 bg-[#ffffff]">

              {/* ── Section: Basic Information ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">Basic Information</h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="title" className={`text-xs font-bold text-foreground mb-2 block`}>
                        Job Title <span className="text-destructive">*</span>
                      </Label>
                      <Input id="title" value={formData.title}
                        onChange={(e) => { setFormData({ ...formData, title: e.target.value }); if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: false })); }}
                        placeholder="e.g., Senior Frontend Developer"
                        className={`h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium focus-visible:ring-1 focus-visible:ring-ring ${fieldErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}`} />
                      {fieldErrors.title && <p className="text-xs text-destructive mt-1.5">Job title is required.</p>}
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Location</Label>
                      <div className="relative">
                        <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Enter your location" className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring pr-10" />
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Details ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">Details</h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Job Type</Label>
                      <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-border">
                          <SelectItem value="full-time">Full-time</SelectItem><SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem><SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Experience</Label>
                      <Select value={formData.experienceLevel} onValueChange={(v) => {
                        const range = experienceLevelToRange(v);
                        setFormData({ ...formData, experienceLevel: v, minExperience: range ? String(range.minExperience) : "", maxExperience: range?.maxExperience !== null && range?.maxExperience !== undefined ? String(range.maxExperience) : "" });
                      }}>
                        <SelectTrigger className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium"><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-border">
                          <SelectItem value="junior">0-2 years</SelectItem><SelectItem value="mid">3-5 years</SelectItem>
                          <SelectItem value="mid-senior">6-9 years</SelectItem><SelectItem value="senior">10+ years</SelectItem>
                          <SelectItem value="lead">15+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Remote Friendly toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border mt-6">
                    <div>
                      <p className="font-bold text-foreground text-sm">Remote Friendly</p>
                      <p className="text-xs text-muted-foreground/80 mt-0.5">Allow candidates to work from anywhere</p>
                    </div>
                    <Switch
                      checked={formData.workMode === "remote"}
                      onCheckedChange={(v) => setFormData({ ...formData, workMode: v ? "remote" : "" })}
                      className="data-[state=checked]:bg-[#14b8a6]"
                    />
                  </div>
                </div>
              </div>

              {/* ── Section: Job Description ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-4">Job Description</h2>
                <div className={`mt-2 rounded-xl overflow-hidden transition-all border ${fieldErrors.description ? "border-destructive" : "border-border/50"}`}>
                  <div className="flex items-center gap-1 px-4 py-2 border-b border-border/50 bg-white">
                    <ToolbarBtn icon={Bold} label="Bold" onClick={() => execCommand("bold")} />
                    <ToolbarBtn icon={Italic} label="Italic" onClick={() => execCommand("italic")} />
                    <ToolbarBtn icon={UnderlineIcon} label="Underline" onClick={() => execCommand("underline")} />
                    <div className="w-px h-5 bg-border/50 mx-1" />
                    <ToolbarBtn icon={AlignLeft} label="Align" onClick={() => execCommand("justifyLeft")} />
                    <ToolbarBtn icon={List} label="List" onClick={() => execCommand("insertUnorderedList")} />
                    <ToolbarBtn icon={ListOrdered} label="Ordered" onClick={() => execCommand("insertOrderedList")} />
                    <div className="w-px h-5 bg-border/50 mx-1" />
                    <ToolbarBtn icon={Link} label="Link" onClick={() => { const url = prompt("Enter URL:"); if (url) execCommand("createLink", url); }} />
                  </div>
                  <div ref={descriptionRef} contentEditable suppressContentEditableWarning
                    className="px-5 py-4 min-h-[180px] max-h-[350px] overflow-y-auto text-[14px] text-foreground leading-relaxed focus:outline-none bg-white"
                    onInput={handleDescriptionInput} data-placeholder="Describe the role, responsibilities, and requirements..." />
                </div>
                {fieldErrors.description && <p className="text-xs text-destructive mt-1.5">Job description is required.</p>}

                {/* Save JD & Extract Skills */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleExtractSkills}
                    disabled={isExtractingSkills}
                    className="h-9 px-4 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isExtractingSkills ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Extracting...</>
                    ) : (
                      <><Sparkles className="h-3.5 w-3.5" /> Save JD &amp; Extract Skills</>
                    )}
                  </button>
                </div>
              </div>

              {/* ── Section: Required Skills ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className={`text-sm font-bold ${fieldErrors.skills ? "text-destructive" : "text-foreground"}`}>
                    Required Skills <span className="text-destructive">*</span>
                  </Label>
                  {skillsExtracted && (
                    <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" /> Skills Extracted Successfully
                    </div>
                  )}
                </div>
                <div className={`flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white border transition-all min-h-[56px] focus-within:border-indigo-200 focus-within:ring-2 focus-within:ring-indigo-100 ${fieldErrors.skills ? "border-destructive" : "border-border"}`}>
                  {skills.map((skill, index) => {
                    const c = SKILL_COLORS[index % SKILL_COLORS.length];
                    return (
                      <Badge key={skill} variant="secondary" className={`${c.bg} ${c.text} border-none px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5`}>
                        {skill}
                        <button type="button" aria-label={`Remove ${skill}`} onClick={() => removeSkill(skill)} className={`${c.close} transition-colors`}>
                          <X className="h-3 w-3 stroke-[2.5px]" />
                        </button>
                      </Badge>
                    );
                  })}
                  <Input value={newSkill} onChange={(e) => { setNewSkill(e.target.value); if (fieldErrors.skills) setFieldErrors((p) => ({ ...p, skills: false })); }}
                    placeholder="Type a skill and press Enter..."
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); if (fieldErrors.skills) setFieldErrors((p) => ({ ...p, skills: false })); } }}
                    className="flex-1 min-w-[180px] bg-transparent border-none focus-visible:ring-0 shadow-none h-8 px-2 text-sm" />
                </div>
                <p className="text-xs text-muted-foreground/80 mt-2.5">Review and adjust the AI-extracted skills above to improve candidate matching accuracy.</p>
              </div>

              {/* ── Section: Additional Details ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">Additional Details</h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Job Category</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-border">
                          <SelectItem value="engineering">Engineering</SelectItem><SelectItem value="design">Design</SelectItem>
                          <SelectItem value="product">Product</SelectItem><SelectItem value="data">Data Science</SelectItem>
                          <SelectItem value="devops">DevOps</SelectItem><SelectItem value="qa">Quality Assurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Number of Openings</Label>
                      <Input type="number" placeholder="e.g. 3" min="1" max="999" value={formData.openings}
                        onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                        className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label className={`text-xs font-bold text-foreground mb-2 block`}>
                        Work Mode <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.workMode} onValueChange={(v) => { setFormData({ ...formData, workMode: v }); if (fieldErrors.workMode) setFieldErrors((p) => ({ ...p, workMode: false })); }}>
                        <SelectTrigger className={`h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium ${fieldErrors.workMode ? "border-destructive ring-1 ring-destructive" : ""}`}>
                          <SelectValue placeholder="Select work mode" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-border">
                          <SelectItem value="remote">Remote</SelectItem><SelectItem value="onsite">On-site</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Certifications</Label>
                      <Input value={formData.certifications} onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                        placeholder="e.g., AWS Certified, PMP, CISSP" className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>

                  {/* Bench Resources toggle */}
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Switch checked={formData.openToBenchResources} onCheckedChange={(v) => setFormData({ ...formData, openToBenchResources: v })} className="data-[state=checked]:bg-primary" />
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-sm">Open to Bench Resources</p>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">Allow agencies to propose their bench employees for this role.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section: Budget & Duration ── */}
              <div>
                <h2 className="text-lg font-bold text-foreground mb-6">Budget & Duration</h2>
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <Label className="text-xs font-bold text-foreground mb-2 block">Duration</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Value" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="flex-1 h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium focus-visible:ring-1 focus-visible:ring-ring" />
                        <Select value={formData.durationUnit} onValueChange={(v) => setFormData({ ...formData, durationUnit: v })}>
                          <SelectTrigger className="w-32 h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium"><SelectValue placeholder="Unit" /></SelectTrigger>
                          <SelectContent className="rounded-xl shadow-xl"><SelectItem value="week">Weeks</SelectItem><SelectItem value="month">Months</SelectItem><SelectItem value="year">Years</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Start Date</Label>
                      <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium px-4 focus-visible:ring-1 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-5">
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Payment Type</Label>
                      <Select value={formData.paymentType} onValueChange={(v) => setFormData({ ...formData, paymentType: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl"><SelectItem value="hourly">Hourly Rate</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="fixed">Fixed Price</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Currency</Label>
                      <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
                        <SelectTrigger className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium"><SelectValue placeholder="Currency" /></SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl"><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem><SelectItem value="INR">INR (₹)</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-foreground mb-2 block">Salary Range</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">{currencySymbol}</span>
                          <Input type="number" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                            placeholder="" className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium pl-6 focus-visible:ring-1 focus-visible:ring-ring" />
                        </div>
                        <span className="text-muted-foreground/60">–</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">{currencySymbol}</span>
                          <Input type="number" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                            placeholder="" className="h-11 rounded-xl border-transparent bg-[#f2f5fa] text-sm font-medium pl-6 focus-visible:ring-1 focus-visible:ring-ring" />
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
              <Button variant="ghost" onClick={handleDeleteJob} className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold h-10 mr-auto" disabled={deleteJobLoading}>
                <Trash2 className="h-4 w-4 mr-2" />Delete
              </Button>
            )}
            {!isEditing && (
              <Button variant="outline" onClick={handleSaveDraft} className="rounded-xl border-gray-200 text-foreground hover:bg-gray-50 min-w-[100px] font-semibold h-10" disabled={saveJobAsDraftLoading}>
                {saveJobAsDraftLoading ? "Saving..." : "Save Draft"}
              </Button>
            )}
            <Button onClick={handlePostAndShowProfiles} disabled={isBusy}
              className="rounded-xl bg-[#14b8a6] hover:bg-[#0f9688] text-white px-6 h-10 font-semibold shadow-sm transition-all hover:-translate-y-0.5 border-none">
              {createJobLoading && postingAction === "postAndShow" ? "Posting..." : isEditing ? "Update Job" : "Post Job & Run AI Match"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this job? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteJob} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">Delete</AlertDialogAction>
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

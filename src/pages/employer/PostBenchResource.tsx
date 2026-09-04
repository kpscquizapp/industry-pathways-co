import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseResume } from "@/lib/resumeParser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  FileText,
  X,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
  PencilLine,
  Trash2,
  CheckSquare,
  Plus,
  Code,
} from "lucide-react";
import { toast } from "sonner";
import { useExtractResumeMutation } from "@/app/queries/atsApi";
import {
  useGetBenchResourceByIdQuery,
  usePostBenchResourceMutation,
  useUpdateBenchResourceMutation,
} from "@/app/queries/benchApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { currencySymbols } from "@/lib/currency";
import { useSelector } from "react-redux";

// ── Types ──────────────────────────────────────────────────────────────────────
type ExtractedSkill = {
  id: string;
  name: string;
  isPrimary: boolean;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const createLocalId = (prefix = "local") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const validateWeeklyWorkingHours = (value: string) => {
  const normalizedValue = value.trim();
  if (!normalizedValue) return null;

  const hours = Number(normalizedValue);
  return Number.isFinite(hours) && hours >= 0 && hours <= 40
    ? null
    : "Weekly working hours must be between 0 and 40";
};

const normalizeSkill = (value: string) => value.toLowerCase().trim();

// ── Component ──────────────────────────────────────────────────────────────────
const PostBenchResource = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editIdNumber = editId && !isNaN(Number(editId)) ? Number(editId) : null;
  const isEditMode = !!editIdNumber;
  const token = useSelector((state: any) => state.user?.token);

  const [extractResume, { isLoading: isExtracting }] =
    useExtractResumeMutation();
  const [postBenchResource, { isLoading: isSubmitting }] =
    usePostBenchResourceMutation();
  const [updateBenchResource, { isLoading: isUpdating }] =
    useUpdateBenchResourceMutation();

  const {
    data: resourceData,
    isLoading: isLoadingResource,
    isError: isResourceError,
  } = useGetBenchResourceByIdQuery(editIdNumber ?? skipToken);

  // ── Form state ───────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<{
    resourceName: string;
    email: string;
    currentRole: string;
    totalExperience: string | number | null;
    employeeId: string;
    primarySkills: string[];
    secondarySkills: string[];
    professionalSummary: string;
    hourlyRate: string | null;
    currency: string;
    availableFrom: string;
    minimumDuration: string;
    locationPreferences: { remote: boolean; hybrid: boolean; onSite: boolean };
    requireNonSolicitation: boolean;
    weeklyWorkingHours: string;
    resumeFile: File | null;
  }>({
    resourceName: "",
    email: "",
    currentRole: "",
    totalExperience: null,
    employeeId: "",
    primarySkills: [],
    secondarySkills: [],
    professionalSummary: "",
    hourlyRate: "",
    currency: "USD - US Dollar",
    availableFrom: "",
    minimumDuration: "3",
    locationPreferences: { remote: false, hybrid: false, onSite: false },
    requireNonSolicitation: false,
    weeklyWorkingHours: "",
    resumeFile: null,
  });

  // ── Skill UI state ───────────────────────────────────────────────────────────
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [secondarySkillInput, setSecondarySkillInput] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [editingExtractedSkillId, setEditingExtractedSkillId] = useState<
    string | null
  >(null);
  const [editingExtractedSkillName, setEditingExtractedSkillName] =
    useState("");
  const [isEditingPrimarySkills, setIsEditingPrimarySkills] = useState(false);
  const [showExtractedBanner, setShowExtractedBanner] = useState(false);

  // ── Other state ──────────────────────────────────────────────────────────────
  const [autoFill, setAutoFill] = useState(true);

  // Use a ref so processExtractedSkills always reads latest formData without
  // being recreated on every render (avoids stale-closure bugs).
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // ── Populate form in edit mode ────────────────────────────────────────────────
  useEffect(() => {
    if (isEditMode && resourceData?.data) {
      const resource = resourceData.data;

      let deploymentPrefs: string[] = [];
      try {
        deploymentPrefs = Array.isArray(resource.deploymentPreference)
          ? resource.deploymentPreference
          : JSON.parse(resource.deploymentPreference || "[]");
      } catch {
        deploymentPrefs = [];
      }

      setFormData({
        resourceName: resource.resourceName || "",
        email: resource.email || "",
        currentRole: resource.currentRole || "",
        totalExperience: isNaN(Number(resource.totalExperience))
          ? null
          : Number(resource.totalExperience),
        employeeId: resource.employeeId || "",
        // First 5 → primary, rest → secondary (temporary until BE splits them)
        // ADD THIS
        primarySkills: (() => {
          const arr = Array.isArray(resource.primarySkills)
            ? resource.primarySkills
            : (() => {
                try {
                  return JSON.parse(resource.primarySkills || "[]");
                } catch {
                  return [];
                }
              })();
          return arr
            .map((item: any) =>
              typeof item === "string" ? item : item?.name || "",
            )
            .filter(Boolean);
        })(),
        secondarySkills: (() => {
          const arr = Array.isArray(resource.secondarySkills)
            ? resource.secondarySkills
            : (() => {
                try {
                  return JSON.parse(resource.secondarySkills || "[]");
                } catch {
                  return [];
                }
              })();
          return arr
            .map((item: any) =>
              typeof item === "string" ? item : item?.name || "",
            )
            .filter(Boolean);
        })(),
        professionalSummary: resource.professionalSummary || "",
        hourlyRate: resource.hourlyRate?.toString() || "",
        currency: resource.currency || "USD($) - US Dollar",
        availableFrom: (() => {
          if (!resource.availableFrom) return "";
          const d = new Date(resource.availableFrom);
          return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
        })(),
        minimumDuration: resource.minimumContractDuration?.toString() || "3",
        locationPreferences: {
          remote: deploymentPrefs.includes("remote"),
          hybrid: deploymentPrefs.includes("hybrid"),
          onSite: deploymentPrefs.includes("onsite"),
        },
        requireNonSolicitation: resource.requireNonSolicitation || false,
        weeklyWorkingHours: resource.weeklyWorkingHours?.toString() || "",
        resumeFile: null,
      });
    }
  }, [isEditMode, resourceData]);

  // ── Skill handlers ────────────────────────────────────────────────────────────

  /**
   * Called after resume extraction. Reads the latest formData via ref (no stale
   * closure) and builds the extracted-skills banner list.
   */
  const processExtractedSkills = useCallback((resumeSkills: string[]) => {
    if (!resumeSkills.length) return;

    const { primarySkills: currentPrimary, secondarySkills: currentSecondary } =
      formDataRef.current;

    const newExtractedObjects: ExtractedSkill[] = [];
    const newPrimarySkills = [...currentPrimary];

    // Existing primary → checked in the banner
    currentPrimary.forEach((skill) => {
      newExtractedObjects.push({
        id: createLocalId("ext"),
        name: skill,
        isPrimary: true,
      });
    });

    // Existing secondary → unchecked in the banner
    currentSecondary.forEach((skill) => {
      newExtractedObjects.push({
        id: createLocalId("ext"),
        name: skill,
        isPrimary: false,
      });
    });

    // New skills from resume
    let autoCheckedCount = currentPrimary.length;
    for (const skill of resumeSkills) {
      const normalized = normalizeSkill(skill);
      const inPrimary = currentPrimary.some(
        (p) => normalizeSkill(p) === normalized,
      );
      const inSecondary = currentSecondary.some(
        (s) => normalizeSkill(s) === normalized,
      );
      if (!inPrimary && !inSecondary) {
        if (autoCheckedCount < 5) {
          newPrimarySkills.push(skill);
          newExtractedObjects.push({
            id: createLocalId("ext"),
            name: skill,
            isPrimary: true,
          });
          autoCheckedCount++;
        } else {
          newExtractedObjects.push({
            id: createLocalId("ext"),
            name: skill,
            isPrimary: false,
          });
        }
      }
    }

    setExtractedSkills(newExtractedObjects);
    setShowExtractedBanner(true);
    setFormData((prev) => ({ ...prev, primarySkills: newPrimarySkills }));
  }, []); // stable — reads formData via ref

  const handleToggleExtractedSkill = (id: string, checked: boolean) => {
    const skill = extractedSkills.find((s) => s.id === id);
    if (!skill) return;

    if (checked) {
      if (formData.primarySkills.length >= 5) {
        toast.error(
          "You can only select up to 5 primary skills. Uncheck one first.",
        );
        return;
      }
      setFormData((prev) => {
        const newPrimary = [...prev.primarySkills];
        if (
          !newPrimary.some(
            (s) => normalizeSkill(s) === normalizeSkill(skill.name),
          )
        ) {
          newPrimary.push(skill.name);
        }
        const newSecondary = prev.secondarySkills.filter(
          (s) => normalizeSkill(s) !== normalizeSkill(skill.name),
        );
        return {
          ...prev,
          primarySkills: newPrimary,
          secondarySkills: newSecondary,
        };
      });
      setExtractedSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPrimary: true } : s)),
      );
    } else {
      if (formData.primarySkills.length <= 1) {
        toast.warning("You must have at least one primary skill.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        primarySkills: prev.primarySkills.filter(
          (s) => normalizeSkill(s) !== normalizeSkill(skill.name),
        ),
        secondarySkills: prev.secondarySkills.filter(
          (s) => normalizeSkill(s) !== normalizeSkill(skill.name),
        ),
      }));
      setExtractedSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPrimary: false } : s)),
      );
    }
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
      toast.error("This skill already exists");
      return;
    }
    setExtractedSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s)),
    );
    if (skill.isPrimary) {
      setFormData((prev) => ({
        ...prev,
        primarySkills: prev.primarySkills.map((s) =>
          normalizeSkill(s) === normalizeSkill(skill.name) ? newName : s,
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        secondarySkills: prev.secondarySkills.map((s) =>
          normalizeSkill(s) === normalizeSkill(skill.name) ? newName : s,
        ),
      }));
    }
    setEditingExtractedSkillId(null);
    setEditingExtractedSkillName("");
  };

  const deleteExtractedSkill = (id: string) => {
    const skill = extractedSkills.find((s) => s.id === id);
    if (!skill) return;
    if (skill.isPrimary && formData.primarySkills.length <= 1) {
      toast.warning("You must have at least one primary skill.");
      return;
    }
    setExtractedSkills((prev) => prev.filter((s) => s.id !== id));
    if (skill.isPrimary) {
      setFormData((prev) => ({
        ...prev,
        primarySkills: prev.primarySkills.filter(
          (s) => normalizeSkill(s) !== normalizeSkill(skill.name),
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        secondarySkills: prev.secondarySkills.filter(
          (s) => normalizeSkill(s) !== normalizeSkill(skill.name),
        ),
      }));
    }
  };

  /**
   * Confirm button on the extracted-skills banner.
   * Unchecked extracted skills move to secondarySkills, banner hides.
   */
  const handleConfirmExtractedSkills = () => {
    const seen = new Set(
      formData.secondarySkills.map((s) => normalizeSkill(s)),
    );
    const newSecondary = [...formData.secondarySkills];
    extractedSkills.forEach((s) => {
      if (!s.isPrimary) {
        const normalized = normalizeSkill(s.name);
        const inPrimary = formData.primarySkills.some(
          (p) => normalizeSkill(p) === normalized,
        );
        if (!seen.has(normalized) && !inPrimary) {
          seen.add(normalized);
          newSecondary.push(s.name);
        }
      }
    });
    setFormData((prev) => ({ ...prev, secondarySkills: newSecondary }));
    setShowExtractedBanner(false);
  };

  const addPrimarySkill = () => {
    const trimmed = primarySkillInput.trim().toLowerCase();
    if (!trimmed) return;
    if (formData.primarySkills.length >= 5) {
      toast.error("You can only add up to 5 primary skills.");
      return;
    }
    if (
      formData.primarySkills.some(
        (s) => normalizeSkill(s) === normalizeSkill(trimmed),
      ) ||
      formData.secondarySkills.some(
        (s) => normalizeSkill(s) === normalizeSkill(trimmed),
      )
    ) {
      toast.error("This skill already exists.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      primarySkills: [...prev.primarySkills, trimmed],
    }));
    setPrimarySkillInput("");
  };

  const removePrimarySkill = (skill: string) => {
    if (formData.primarySkills.length <= 1) {
      toast.warning("You must have at least one primary skill.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      primarySkills: prev.primarySkills.filter((s) => s !== skill),
      secondarySkills: [...prev.secondarySkills, skill], // ← moves to secondary
    }));
  };
  const addSecondarySkill = () => {
    const trimmed = secondarySkillInput.trim().toLowerCase();
    if (!trimmed) return;
    if (
      formData.secondarySkills.some(
        (s) => normalizeSkill(s) === normalizeSkill(trimmed),
      ) ||
      formData.primarySkills.some(
        (s) => normalizeSkill(s) === normalizeSkill(trimmed),
      )
    ) {
      toast.error("This skill already exists.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      secondarySkills: [...prev.secondarySkills, trimmed],
    }));
    setSecondarySkillInput("");
  };

  const removeSecondarySkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter((s) => s !== skill),
    }));
  };

  // ── Resume upload ─────────────────────────────────────────────────────────────
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error("File size must be less than 5MB");
      input.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, resumeFile: file }));

    if (autoFill) {
      try {
        const result = await extractResume(file).unwrap();

        if (result.success && result.data) {
          // setFormData((prev) => ({
          //   ...prev,
          //   resourceName: result.data.resourceName || prev.resourceName,
          //   professionalSummary: result.data.professionalSummary || prev.professionalSummary,
          //   totalExperience: result.data.totalExperience ?? prev.totalExperience,
          // }));
          processExtractedSkills(result.data.technicalSkills || []);
          toast.success("Resume processed successfully!", {
            description: "Skills has been populated from your resume.",
          });
        } else {
          toast.error("Failed to extract data from resume");
        }
      } catch (error) {
        console.error("OCR API error, trying AI fallback:", error);
        try {
          if (file.type !== "application/pdf") {
            toast.error(
              "Fallback parser only supports PDF. Please upload a PDF file.",
            );
            setFormData((prev) => ({ ...prev, resumeFile: null }));
            input.value = "";
            return;
          }
          toast.info("ATS service unavailable, using AI parser...");
          const parsed = await parseResume(file, token);
          // setFormData((prev) => ({
          //   ...prev,
          //   resourceName: parsed.resourceName || prev.resourceName,
          //   professionalSummary: parsed.professionalSummary || prev.professionalSummary,
          //   totalExperience: parsed.totalExperience || prev.totalExperience,
          // }));
          processExtractedSkills(
            parsed.technicalSkills.length > 0 ? parsed.technicalSkills : [],
          );
          toast.success("Resume processed with AI!", {
            description: "Skills have been populated from your resume.",
          });
        } catch (geminiError) {
          console.error("AI fallback also failed:", geminiError);
          toast.error("Could not extract resume data. Please fill manually.");
          setFormData((prev) => ({ ...prev, resumeFile: null }));
          input.value = "";
        }
      }
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleProceed = async () => {
    const trimmedResourceName = formData.resourceName.trim();
    if (!trimmedResourceName) {
      toast.error("Resource name is required");
      return;
    }
    if (!formData.currentRole.trim()) {
      toast.error("Current role is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.primarySkills.length === 0) {
      toast.error("At least one primary skill is required");
      return;
    }
    if (!formData.hourlyRate) {
      toast.error("Hourly rate is required");
      return;
    }

    const hourlyRateNum = parseFloat(formData.hourlyRate);
    if (isNaN(hourlyRateNum) || hourlyRateNum <= 0) {
      toast.error("Hourly rate must be a positive number");
      return;
    }
    if (!formData.availableFrom.trim()) {
      toast.error("Available from is required");
      return;
    }
    if (formData.totalExperience === null || formData.totalExperience === "") {
      toast.error("Total experience is required");
      return;
    }

    const totalExpNum = parseFloat(String(formData.totalExperience));
    if (isNaN(totalExpNum) || totalExpNum < 0) {
      toast.error("Total experience must be a non-negative number");
      return;
    }
    if (!formData.employeeId.trim()) {
      toast.error("Employee ID is required");
      return;
    }
    if (!formData.minimumDuration) {
      toast.error("Minimum contract duration is required");
      return;
    }

    const weeklyWorkingHours = formData.weeklyWorkingHours.trim();
    const weeklyWorkingHoursError =
      validateWeeklyWorkingHours(weeklyWorkingHours);
    if (weeklyWorkingHoursError) {
      toast.error(weeklyWorkingHoursError);
      return;
    }

    const hasLocationPreference = Object.values(
      formData.locationPreferences,
    ).some((v) => v);
    if (!hasLocationPreference) {
      toast.error("At least one location preference is required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("resourceName", trimmedResourceName);
    formDataToSend.append("email", formData.email.trim());
    formDataToSend.append("currentRole", formData.currentRole);
    formDataToSend.append(
      "totalExperience",
      formData.totalExperience.toString(),
    );
    // Merge primary + secondary into technicalSkills until BE splits them
    // ADD THIS
    formDataToSend.append(
      "primarySkills",
      JSON.stringify(formData.primarySkills),
    );
    formDataToSend.append(
      "secondarySkills",
      JSON.stringify(formData.secondarySkills),
    );
    formDataToSend.append("hourlyRate", formData.hourlyRate);
    if (weeklyWorkingHours) {
      formDataToSend.append("weeklyWorkingHours", weeklyWorkingHours);
    }
    formDataToSend.append("currency", formData.currency);
    formDataToSend.append("availableFrom", formData.availableFrom);
    formDataToSend.append("employeeId", formData.employeeId);
    formDataToSend.append("minimumContractDuration", formData.minimumDuration);
    formDataToSend.append("professionalSummary", formData.professionalSummary);
    formDataToSend.append(
      "requireNonSolicitation",
      String(formData.requireNonSolicitation),
    );

    const deploymentPreference = Object.entries(formData.locationPreferences)
      .filter(([, v]) => v)
      .map(([k]) => (k === "onSite" ? "onsite" : k));
    formDataToSend.append(
      "deploymentPreference",
      JSON.stringify(deploymentPreference),
    );

    if (formData.resumeFile) {
      formDataToSend.append("resume", formData.resumeFile);
    }

    try {
      if (isEditMode) {
        if (!editIdNumber) return;
        await updateBenchResource({
          id: editIdNumber,
          formData: formDataToSend,
        }).unwrap();
        toast.success("Bench resource updated successfully!");
      } else {
        await postBenchResource(formDataToSend).unwrap();
        toast.success("Bench resource posted successfully!", {
          description: "Your resource is now visible to potential clients.",
        });
      }
      navigate("/bench-dashboard/active-resources");
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "post"} bench resource:`,
        error,
      );
      toast.error(`Failed to ${isEditMode ? "update" : "post"} bench resource`);
    }
  };

  // ── Loading / error states ────────────────────────────────────────────────────
  if (isEditMode && isLoadingResource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-slate-600 font-medium">Loading resource data...</p>
        </div>
      </div>
    );
  }

  if (isEditMode && isResourceError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-slate-600 font-medium">
            Failed to load resource data
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isProcessing = isSubmitting || isUpdating;

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Page Title */}
        <div className="mb-6 p-5 border border-slate-200 rounded-xl bg-white">
          <h1 className="text-2xl font-bold text-slate-800">
            {isEditMode ? "Edit Bench Resource" : "Post Bench Resource"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode
              ? "Update the details of your bench resource"
              : "Add a new resource to your bench pool. Detailed profiles remain anonymized to potential clients until the interview stage."}
          </p>
        </div>

        <div className="space-y-6">
          {/* ── Document Upload ─────────────────────────────────────────────── */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Document Upload
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div
                className={`border-2 border-dashed ${isExtracting ? "border-blue-400 bg-blue-50/30" : "border-slate-200"} rounded-xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group relative`}
                onClick={() =>
                  document.getElementById("resume-upload")?.click()
                }
              >
                <input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={isExtracting}
                />
                <div className="flex items-center justify-center mx-auto mb-4">
                  {isExtracting ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                  ) : (
                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                  {isExtracting
                    ? "Extracting information..."
                    : formData.resumeFile
                      ? formData.resumeFile.name
                      : "Click or drag anonymized resume to upload"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supported formats: PDF. Max size: 5MB.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 px-6 h-9 rounded-lg border-slate-200 text-slate-600 text-sm hover:bg-[#1e293b] hover:text-white transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("resume-upload")?.click();
                  }}
                  disabled={isExtracting}
                >
                  Browse Files
                </Button>
              </div>

              {/* Auto-fill toggle */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Auto-fill details from resume
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our AI will automatically extract skills.
                  </p>
                </div>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: 44,
                    height: 24,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={autoFill}
                    onChange={(e) => setAutoFill(e.target.checked)}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                      position: "absolute",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 24,
                      background: autoFill ? "#3b82f6" : "#cbd5e1",
                      transition: "background 0.2s",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: autoFill ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      transition: "left 0.2s",
                    }}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* ── Resource Basic Information ───────────────────────────────────── */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-500" />
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Resource Basic Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Resource Name (Internal){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="John D."
                    value={formData.resourceName}
                    onChange={(e) =>
                      setFormData({ ...formData, resourceName: e.target.value })
                    }
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Employee ID / Reference Code{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. EMP-001"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Total Experience (Years){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={formData.totalExperience ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalExperience: e.target.value,
                      })
                    }
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Current Role / Designation{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Senior Java Developer"
                  value={formData.currentRole}
                  onChange={(e) =>
                    setFormData({ ...formData, currentRole: e.target.value })
                  }
                  className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                />
              </div>

              {/* Professional Summary */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Professional Summary
                </Label>
                <Textarea
                  placeholder="Brief summary of their expertise and key projects..."
                  value={formData.professionalSummary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professionalSummary: e.target.value,
                    })
                  }
                  rows={4}
                  className="px-4 py-2.5 rounded-xl resize-none bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* ── Technical Skills (separate card, mirrors contractor page) ─────── */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Skills
                  </CardTitle>
                </div>
                {/* Edit Primary toggle — only shown when banner is not visible */}
                {!showExtractedBanner && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingExtractedSkillId(null);
                      setEditingExtractedSkillName("");
                      setIsEditingPrimarySkills((prev) => !prev);
                    }}
                    className="h-9 px-3 rounded-lg border-slate-200 text-[#288e99] bg-[#4DD9E8]/10 hover:bg-[#4DD9E8]/20 hover:text-[#288e99] text-sm shadow-none"
                  >
                    <PencilLine className="h-4 w-4 mr-1.5" />
                    {isEditingPrimarySkills ? "Done Editing" : "Edit Primary"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* ── Extracted skills banner (shown after resume upload) ─── */}
              {showExtractedBanner &&
                extractedSkills.length > 0 &&
                !isEditingPrimarySkills && (
                  <div className="p-4 border border-blue-200 bg-blue-50/50 rounded-xl space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-500" />
                      <h4 className="text-sm font-semibold text-slate-800">
                        Skills extracted from resume
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      Select up to 5 as primary. Unchecked skills will be saved
                      as secondary.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {extractedSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl"
                        >
                          <input
                            type="checkbox"
                            checked={skill.isPrimary}
                            onChange={(e) =>
                              handleToggleExtractedSkill(
                                skill.id,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 min-w-0 min-h-0 rounded border-gray-300 accent-[#4DD9E8]"
                          />
                          {editingExtractedSkillId === skill.id ? (
                            <div className="flex-1 flex gap-2 items-center">
                              <input
                                type="text"
                                value={editingExtractedSkillName}
                                onChange={(e) =>
                                  setEditingExtractedSkillName(e.target.value)
                                }
                                className="flex-1 px-2 py-1 text-sm bg-white border border-slate-200 rounded outline-none focus:border-[#4DD9E8]"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => saveExtractedSkillEdit(skill.id)}
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
                                className="text-slate-400 hover:text-slate-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">
                                {skill.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingExtractedSkillId(skill.id);
                                    setEditingExtractedSkillName(skill.name);
                                  }}
                                  className="text-slate-400 hover:text-[#4DD9E8] transition-colors"
                                >
                                  <PencilLine className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteExtractedSkill(skill.id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-slate-400 font-medium">
                        {extractedSkills.filter((s) => s.isPrimary).length} / 5
                        primary selected
                      </p>
                      <Button
                        type="button"
                        onClick={handleConfirmExtractedSkills}
                        className="h-9 px-4 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-sm font-medium"
                      >
                        Confirm Skills
                      </Button>
                    </div>
                  </div>
                )}

              {/* ── Edit mode: checkbox grid of primary + secondary ───────── */}
              {isEditingPrimarySkills && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">
                      Edit Skills
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Select up to 5 as primary · Check to promote · Uncheck to
                      move to secondary
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Primary skills — checked */}
                    {formData.primarySkills.map((skillName, idx) => {
                      const extractedSkill = extractedSkills.find(
                        (s) =>
                          normalizeSkill(s.name) === normalizeSkill(skillName),
                      );
                      return (
                        <div
                          key={`primary-${skillName}-${idx}`}
                          className="flex items-center gap-3 p-3 bg-white border border-blue-100 rounded-xl"
                        >
                          <input
                            type="checkbox"
                            checked
                            onChange={(e) => {
                              if (!e.target.checked) {
                                if (formData.primarySkills.length <= 1) {
                                  toast.warning(
                                    "You must have at least one primary skill.",
                                  );
                                  return;
                                }
                                setFormData((prev) => ({
                                  ...prev,
                                  primarySkills: prev.primarySkills.filter(
                                    (s) =>
                                      s.toLowerCase() !==
                                      skillName.toLowerCase(),
                                  ),
                                  secondarySkills: [
                                    ...prev.secondarySkills,
                                    skillName,
                                  ].filter(
                                    (skill, i, self) =>
                                      self.findIndex(
                                        (s) =>
                                          s.toLowerCase() ===
                                          skill.toLowerCase(),
                                      ) === i,
                                  ),
                                }));
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
                            className="w-4 h-4 min-w-0 min-h-0 rounded border-gray-300 accent-[#4DD9E8]"
                          />
                          {extractedSkill &&
                          editingExtractedSkillId === extractedSkill.id ? (
                            <div className="flex-1 flex gap-2 items-center">
                              <input
                                type="text"
                                value={editingExtractedSkillName}
                                onChange={(e) =>
                                  setEditingExtractedSkillName(e.target.value)
                                }
                                className="flex-1 px-2 py-1 text-sm bg-white border border-slate-200 rounded outline-none focus:border-[#4DD9E8]"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  saveExtractedSkillEdit(extractedSkill.id)
                                }
                                className="text-green-500 hover:text-green-600"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingExtractedSkillId(null);
                                  setEditingExtractedSkillName("");
                                }}
                                className="text-slate-400 hover:text-slate-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-700">
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
                                  className="text-slate-400 hover:text-[#4DD9E8]"
                                >
                                  <PencilLine className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (extractedSkill) {
                                      deleteExtractedSkill(extractedSkill.id);
                                    } else {
                                      removePrimarySkill(skillName);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Secondary skills — unchecked */}
                    {formData.secondarySkills.map((skillName, idx) => {
                      const extractedSkill = extractedSkills.find(
                        (s) =>
                          normalizeSkill(s.name) === normalizeSkill(skillName),
                      );
                      return (
                        <div
                          key={`secondary-${skillName}-${idx}`}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl"
                        >
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (formData.primarySkills.length >= 5) {
                                  toast.error(
                                    "You can only select up to 5 primary skills.",
                                  );
                                  return;
                                }
                                setFormData((prev) => ({
                                  ...prev,
                                  primarySkills: [
                                    ...prev.primarySkills,
                                    skillName,
                                  ],
                                  secondarySkills: prev.secondarySkills.filter(
                                    (s) =>
                                      s.toLowerCase() !==
                                      skillName.toLowerCase(),
                                  ),
                                }));
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
                            className="w-4 h-4 min-w-0 min-h-0 rounded border-gray-300 accent-[#4DD9E8]"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                              {skillName}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSecondarySkill(skillName)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {formData.primarySkills.length > 0 && (
                    <p className="text-xs font-medium text-blue-600">
                      {formData.primarySkills.length} / 5 primary skills
                      selected
                    </p>
                  )}
                </div>
              )}

              {/* ── Primary skills display + input inside blue box ───────────────────── */}
              {!isEditingPrimarySkills && !showExtractedBanner && (
                <div className=" rounded-xl space-y-3">
                  <h4 className="text-sm font-semibold text-slate-800">
                    Primary Skills{" "}
                    <span className="text-xs text-slate-400 font-normal">
                      (max 5)
                    </span>
                  </h4>

                  {/* Skills badges */}
                  {formData.primarySkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.primarySkills.map((skill, index) => (
                        <Badge
                          key={`${skill}-${index}`}
                          className="px-3 py-1.5 rounded-lg text-sm bg-[#4DD9E8]/20 text-[#288e99] font-medium border-0 hover:bg-[#4DD9E8]/30 transition-colors"
                        >
                          {skill}
                          <X
                            className="h-3 w-3 ml-1.5 cursor-pointer hover:text-red-500"
                            onClick={() => removePrimarySkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Input inside box — hidden when 5 skills added */}
                  {formData.primarySkills.length < 5 && (
                    <div className="flex gap-2 w-full">
                      <Input
                        placeholder="e.g. React, Java, AWS…"
                        value={primarySkillInput}
                        onChange={(e) => setPrimarySkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addPrimarySkill();
                          }
                        }}
                        maxLength={50}
                        className="h-12 flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none "
                      />
                      <Button
                        type="button"
                        onClick={addPrimarySkill}
                        disabled={!primarySkillInput.trim()}
                        className="h-11 px-5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Counter */}
                  <p className="text-xs text-slate-400 font-medium">
                    {formData.primarySkills.length}/5 primary skills added
                    {formData.primarySkills.length === 0 && (
                      <span className="ml-1 text-slate-400 italic">
                        — add at least one
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* ── Add primary skill input — only when no banner and no primary skills yet ── */}

              {/* ── Secondary skills ──────────────────────────────────────── */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Label className="text-sm font-medium text-slate-700">
                  Secondary Skills
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. TypeScript, Docker, GraphQL…"
                    value={secondarySkillInput}
                    onChange={(e) => setSecondarySkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSecondarySkill();
                      }
                    }}
                    maxLength={50}
                    className="h-12 flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                  <Button
                    type="button"
                    onClick={addSecondarySkill}
                    disabled={!secondarySkillInput.trim()}
                    className="h-12 px-4 rounded-xl bg-[#4DD9E8] hover:bg-[#4DD9E8]/90 text-white font-medium"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.secondarySkills.map((skill, index) => (
                    <Badge
                      key={`${skill}-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm bg-[#4DD9E8]/10 text-[#288e99] font-medium border-0"
                    >
                      {skill}
                      <X
                        className="h-3.5 w-3.5 cursor-pointer hover:text-red-500"
                        onClick={() => removeSecondarySkill(skill)}
                      />
                    </Badge>
                  ))}
                  {formData.secondarySkills.length === 0 && (
                    <p className="text-sm text-slate-400 italic">
                      No secondary skills added yet.
                    </p>
                  )}
                </div>
                {formData.secondarySkills.length > 0 && (
                  <p className="text-xs text-slate-400">
                    {formData.secondarySkills.length} secondary skill
                    {formData.secondarySkills.length !== 1 ? "s" : ""} added
                  </p>
                )}
              </div>

              {/* ── Update Skills button (mirrors contractor page) ────────── */}
              {/* <div className="flex justify-end border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    // Placeholder — wire to dedicated BE endpoint when ready
                    toast.info("Skill update endpoint coming soon. Skills will be saved when you publish.");
                  }}
                  className="px-6 h-10 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium text-sm"
                >
                  Update Skills
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* ── Availability & Contract Terms ────────────────────────────────── */}
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-teal-500" />
                <CardTitle className="text-lg font-semibold text-slate-800">
                  Availability & Contract Terms
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Hourly Rate (Client Billable){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="h-12 w-28 px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none rounded-xl text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1em_1em] pr-8"
                    >
                      {Object.keys(currencySymbols).map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="45.00"
                      value={formData.hourlyRate ?? ""}
                      onChange={(e) =>
                        setFormData({ ...formData, hourlyRate: e.target.value })
                      }
                      className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Available From <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableFrom: e.target.value,
                      })
                    }
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Weekly Working Hours{" "}
                  <span className="text-muted-foreground font-normal">
                    (max 40)
                  </span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  placeholder="e.g. 40"
                  value={formData.weeklyWorkingHours}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (Number(val) > 40) return;
                    setFormData({ ...formData, weeklyWorkingHours: val });
                  }}
                  className="h-12 w-full md:w-1/2 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Minimum Contract Duration{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <select
                  value={formData.minimumDuration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumDuration: e.target.value,
                    })
                  }
                  className="h-12 w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none rounded-xl text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.2em_1.2em] pr-10"
                >
                  {[
                    { value: "1", label: "1 Month" },
                    { value: "3", label: "3 Months" },
                    { value: "6", label: "6 Months" },
                    { value: "12", label: "12 Months" },
                  ].map((dur) => (
                    <option key={dur.value} value={dur.value}>
                      {dur.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">
                  Deployment Location Preference{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:gap-4">
                  {[
                    {
                      id: "remote",
                      label: "Remote",
                      checked: formData.locationPreferences.remote,
                    },
                    {
                      id: "hybrid",
                      label: "Hybrid",
                      checked: formData.locationPreferences.hybrid,
                    },
                    {
                      id: "onSite",
                      label: "On-site",
                      checked: formData.locationPreferences.onSite,
                    },
                  ].map((loc) => (
                    <div
                      key={loc.id}
                      className="flex items-center gap-2 bg-slate-50 px-2 py-1.5 rounded-lg md:px-4 md:py-2.5 md:rounded-xl"
                    >
                      <input
                        type="checkbox"
                        id={loc.id}
                        checked={loc.checked}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            locationPreferences: {
                              ...formData.locationPreferences,
                              [loc.id]: e.target.checked,
                            },
                          })
                        }
                        style={{
                          position: "absolute",
                          opacity: 0,
                          width: 1,
                          height: 1,
                        }}
                      />
                      <label
                        htmlFor={loc.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 18,
                          height: 18,
                          minWidth: 18,
                          minHeight: 18,
                          borderRadius: "50%",
                          border: loc.checked
                            ? "2px solid #3b82f6"
                            : "2px solid #94a3b8",
                          background: loc.checked ? "#3b82f6" : "#fff",
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "background 0.15s, border-color 0.15s",
                        }}
                      >
                        {loc.checked && (
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: "#fff",
                              display: "block",
                            }}
                          />
                        )}
                      </label>
                      <label
                        htmlFor={loc.id}
                        className="text-sm cursor-pointer text-slate-600 font-medium whitespace-nowrap"
                      >
                        {loc.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border bg-slate-50 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Non-Solicitation Agreement Required
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Clients must agree not to hire this resource directly for 12
                    months post-contract.
                  </p>
                </div>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: 44,
                    height: 24,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.requireNonSolicitation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requireNonSolicitation: e.target.checked,
                      })
                    }
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                      position: "absolute",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 24,
                      background: formData.requireNonSolicitation
                        ? "#3b82f6"
                        : "#cbd5e1",
                      transition: "background 0.2s",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: formData.requireNonSolicitation ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      transition: "left 0.2s",
                    }}
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* ── Bottom Compliance Bar ─────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-5 border border-slate-200 rounded-xl bg-white gap-3 md:gap-0">
            <div className="flex items-start gap-2 w-full md:flex-1">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-slate-600">
                <strong>Compliance Notice:</strong> By publishing this resource,
                you confirm they are currently on your payroll and you adhere to
                the bench marketplace guidelines.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center justify-end gap-3 md:ml-6 shrink-0">
              <Button
                onClick={handleProceed}
                disabled={isProcessing}
                className="md:flex-none w-auto px-6 h-10 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update Resource" : "Publish Resource"}</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//new_form
export default PostBenchResource;

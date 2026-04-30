import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox, } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  Lightbulb,
  X,
  User,
  Calendar,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useExtractResumeMutation } from "@/app/queries/atsApi";
import {
  useGetBenchResourceByIdQuery,
  usePostBenchResourceMutation,
  useUpdateBenchResourceMutation,
} from "@/app/queries/benchApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { currencySymbols, getCurrencySymbol } from "@/lib/currency";

const PostBenchResource = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const editIdNumber = editId && !isNaN(Number(editId)) ? Number(editId) : null;
  const isEditMode = !!editIdNumber;

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

  const formatDuration = (months: number | string): string => {
    const monthNum = typeof months === "string" ? parseInt(months, 10) : months;
    return `${monthNum} ${monthNum === 1 ? "Month" : "Months"}`;
  };

  const [formData, setFormData] = useState<{
    resourceName: string;
    email: string;
    currentRole: string;
    totalExperience: string | number | null;
    employeeId: string;
    skills: string[];
    professionalSummary: string;
    hourlyRate: string | null;
    currency: string;
    availableFrom: string;
    minimumDuration: string;
    locationPreferences: {
      remote: boolean;
      hybrid: boolean;
      onSite: boolean;
    };
    requireNonSolicitation: boolean;
    resumeFile: File | null;
  }>({
    resourceName: "",
    email: "",
    currentRole: "",
    totalExperience: null,
    employeeId: "",
    skills: [] as string[],
    professionalSummary: "",
    hourlyRate: "",
    currency: "USD - US Dollar",
    availableFrom: "",
    minimumDuration: "3",
    locationPreferences: {
      remote: false,
      hybrid: false,
      onSite: false,
    },
    requireNonSolicitation: false,
    resumeFile: null as File | null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [autoFill, setAutoFill] = useState(true);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && resourceData?.data) {
      const resource = resourceData.data;

      // Parse deployment preferences
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
        skills: (() => {
          if (Array.isArray(resource.technicalSkills)) {
            return resource.technicalSkills;
          }
          try {
            return JSON.parse(resource.technicalSkills || "[]");
          } catch {
            return [];
          }
        })(),
        professionalSummary: resource.professionalSummary || "",
        hourlyRate: resource.hourlyRate?.toString() || "",
        currency: resource.currency || "USD($) - US Dollar",
        availableFrom: (() => {
          if (!resource.availableFrom) return "";
          const d = new Date(resource.availableFrom);
          return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
        })(),
        minimumDuration: resource.minimumContractDuration?.toString() || "3", // Store as number string
        locationPreferences: {
          remote: deploymentPrefs.includes("remote"),
          hybrid: deploymentPrefs.includes("hybrid"),
          onSite: deploymentPrefs.includes("onsite"),
        },
        requireNonSolicitation: resource.requireNonSolicitation || false,
        resumeFile: null,
      });
    }
  }, [isEditMode, resourceData]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed) {
      setFormData((prev) => {
        if (prev.skills.includes(trimmed)) return prev;
        return { ...prev, skills: [...prev.skills, trimmed] };
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
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
          setFormData((prev) => ({
            ...prev,
            resourceName: result.data.resourceName || prev.resourceName,
            professionalSummary:
              result.data.professionalSummary || prev.professionalSummary,
            skills: result.data.technicalSkills || prev.skills,
            totalExperience: result.data.totalExperience ?? prev.totalExperience,
          }));
          toast.success("Resume processed successfully!", {
            description: "Form fields have been populated from your resume.",
          });
        } else {
          toast.error("Failed to extract data from resume");
        }
      } catch (error) {
        console.error("OCR API error:", error);
        toast.error("Error connecting to OCR service");
        setFormData((prev) => ({ ...prev, resumeFile: null }));
        input.value = "";
      }
    } else {
      toast.success("Resume uploaded successfully!", {
        description: "Auto-fill is disabled. Please fill in the details manually.",
      });
    }
  };

  const handleSaveDraft = () => {
    toast.success("This feature is under development", {
      description: "",
    });
  };

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

    if (formData.skills.length === 0) {
      toast.error("At least one technical skill is required");
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
    formDataToSend.append("technicalSkills", JSON.stringify(formData.skills));
    formDataToSend.append("hourlyRate", formData.hourlyRate);
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
      .filter(([_, v]) => v)
      .map(([k, _]) => (k === "onSite" ? "onsite" : k));
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

  // Show loading state while fetching resource data
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
        <div>
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
          {/* Main Form */}
          <div className="space-y-6">
            {/* Policy Alert */}
            {/* <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-sm text-orange-800">
                  <strong>Bench Policy:</strong> Resources listed here must be
                  on your company payroll. Profiles can be anonymized until an
                  interview request is accepted.
                </p>
              </CardContent>
            </Card> */}

            {/* Documents */}
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
                  onClick={() => document.getElementById("resume-upload")?.click()}
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                    onClick={(e) => { e.stopPropagation(); document.getElementById("resume-upload")?.click(); }}
                    disabled={isExtracting}
                  >
                    Browse Files
                  </Button>
                </div>

                {/* Auto-fill toggle */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-sm font-medium text-slate-800">Auto-fill details from resume</p>
                    <p className="text-xs text-slate-500 mt-0.5">Our AI will automatically extract skills, experience, and summary.</p>
                  </div>
                  <Switch
                    checked={autoFill}
                    onCheckedChange={setAutoFill}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Resource Basic Info */}
            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
              <CardHeader className="pb-4 border-b border-slate-100 ">
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
                      Resource Name (Internal) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="John D."
                      value={formData.resourceName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resourceName: e.target.value,
                        })
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
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      Employee ID / Reference Code <span className="text-destructive">*</span>
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
                      Total Experience (Years) <span className="text-destructive">*</span>
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
                    Current Role / Designation <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Senior Java Developer"
                    value={formData.currentRole}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentRole: e.target.value,
                      })
                    }
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Technical Skills <span className="text-destructive">*</span>
                  </Label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type skill and press enter..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-12 flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                    />

                    <Button
                      type="button"
                      onClick={addSkill}
                      disabled={!skillInput.trim()}
                      className="h-12 px-6 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium"
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="px-4 py-2 rounded-full text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 cursor-pointer shadow-sm shadow-blue-500/30 transition-all"
                      >
                        {skill}
                        <X
                          className="h-3 w-3 ml-2 cursor-pointer hover:scale-110 transition-transform"
                          onClick={() => removeSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>

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

                </div>

              </CardContent>
            </Card>

            {/* Availability & Contract Terms */}
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
                          setFormData({
                            ...formData,
                            hourlyRate: e.target.value,
                          })
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
                    Minimum Contract Duration{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <select
                    value={formData.minimumDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, minimumDuration: e.target.value })
                    }
                    className="h-12 w-[22rem] px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none rounded-xl text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1.2em_1.2em] pr-10"
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
                        <Checkbox
                          id={loc.id}
                          checked={loc.checked}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              locationPreferences: {
                                ...formData.locationPreferences,
                                [loc.id]: checked === true,
                              },
                            })
                          }
                          className="h-4 w-4 rounded-full bg-slate-50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"

                        />
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
                      Clients must agree not to hire this resource directly for 12 months post-contract.
                    </p>
                  </div>
                  <Switch
                    checked={formData.requireNonSolicitation}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        requireNonSolicitation: checked === true,
                      })
                    }
                    className="data-[state=checked]:bg-blue-500 scale-75 md:scale-100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bottom Compliance Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-5 border border-slate-200 rounded-xl bg-white gap-3 md:gap-0">
              <div className="flex items-start gap-2 w-full md:flex-1">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600">
                  <strong>Compliance Notice:</strong> By publishing this resource, you confirm they are currently on your payroll and you adhere to the bench marketplace guidelines.
                </p>
              </div>
              <div className="flex w-full md:w-auto items-center justify-end gap-3 md:ml-6 shrink-0">
                {/* <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="flex-1 md:flex-none w-full md:w-auto px-6 h-10 rounded-xl hover:bg-[#1e293b] text-slate-600 font-medium"
                  disabled={isProcessing}
                >
                  Save as Draft
                </Button> */}
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
                    <>
                      {isEditMode ? "Update Resource" : "Publish Resource"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBenchResource;

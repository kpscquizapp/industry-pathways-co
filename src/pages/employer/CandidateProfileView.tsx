import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Briefcase,
  Camera,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Eye,
  X,
  LoaderCircle,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import {
  useGetCandidateByIdQuery,
  useLazyViewCandidateResumeQuery,
  type EmployerCandidateProfileDto,
} from "@/app/queries/employerApi";
import { useGetCandidateProfileImageQuery } from "@/app/queries/profileApi";
import {
  useGetBenchResourceByIdQuery,
  useLazyViewBenchResumeQuery,
} from "@/app/queries/benchApi";
import BarLoader from "@/components/loader/BarLoader";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { skipToken } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const getSafeProjectUrl = (value?: string) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
};

type Resume = {
  id: number;
  originalName: string;
  mimeType?: string;
  fileSize?: number;
  uploadedAt?: string;
  isDefault?: boolean;
};

const isPdfFile = (resume?: Resume | null): boolean =>
  !!resume && resume.mimeType?.toLowerCase() === "application/pdf";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatCurrency = (amount: number, currency = "USD") => {
  const upper = currency?.toUpperCase?.() ?? "";
  const safeCurrency = /^[A-Z]{3}$/.test(upper) ? upper : "USD";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const normalizeBenchCandidate = (c: any) => {
  const fullName = c.name || c.resourceName || "";
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ");

  // Resolve skills from either shape (array or comma-string)
  // Treat empty arrays as absent so comma-string values can be used as fallback
  const rawSkillsArr =
    Array.isArray(c.skills) && c.skills.length > 0
      ? c.skills
      : Array.isArray(c.technicalSkills) && c.technicalSkills.length > 0
        ? c.technicalSkills
        : null;
  const skillsArr: string[] =
    rawSkillsArr ??
    (typeof c.skills === "string" && c.skills
      ? c.skills
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : typeof c.technicalSkills === "string" && c.technicalSkills
        ? c.technicalSkills
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : []);

  const rawHourlyMin =
    c.hourlyRate != null && typeof c.hourlyRate === "object"
      ? c.hourlyRate.min
      : typeof c.hourlyRate === "number"
        ? c.hourlyRate
        : (c.expectedSalary?.min ?? null);
  const rawHourlyMax =
    c.hourlyRate != null && typeof c.hourlyRate === "object"
      ? c.hourlyRate.max
      : typeof c.hourlyRate === "number"
        ? c.hourlyRate
        : (c.expectedSalary?.max ?? null);
  const hourlyMin =
    rawHourlyMin != null && Number.isFinite(Number(rawHourlyMin))
      ? Number(rawHourlyMin)
      : null;
  const _rawHourlyMax =
    rawHourlyMax != null && Number.isFinite(Number(rawHourlyMax))
      ? Number(rawHourlyMax)
      : null;
  // Collapse equal min/max into a single value to avoid "$X - $X/hr"
  const hourlyMax =
    _rawHourlyMax !== null && hourlyMin !== null && _rawHourlyMax === hourlyMin
      ? null
      : _rawHourlyMax;

  const yearsExp =
    c.experienceYears != null && Number.isFinite(Number(c.experienceYears))
      ? Number(c.experienceYears)
      : c.experience != null && Number.isFinite(Number(c.experience))
        ? Number(c.experience)
        : null;

  const certs = Array.isArray(c.certifications)
    ? c.certifications.map((cert: any) =>
        typeof cert === "string" ? { name: cert } : cert,
      )
    : [];

  const deploymentPref: string[] = Array.isArray(c.deploymentPreference)
    ? c.deploymentPreference
    : typeof c.deploymentPreference === "string" && c.deploymentPreference
      ? c.deploymentPreference
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  return {
    id: c.id,
    userId: c.userId ?? null,
    firstName,
    lastName,
    email: c.email ?? null,
    mobileNumber: c.mobileNumber ?? null,
    primaryJobRole: c.role ?? c.currentRole ?? null,
    bio: c.about ?? c.professionalSummary ?? null,
    headline: c.role ?? c.currentRole ?? null,
    candidateType: "bench" as const,
    resourceType: "bench" as const,
    location: c.location ?? null,
    city: c.city ?? null,
    country: c.country ?? null,
    hourlyRateMin: hourlyMin,
    hourlyRateMax: hourlyMax,
    expectedSalaryMin: null,
    expectedSalaryMax: null,
    yearsExperience: yearsExp,
    experience: yearsExp,
    primarySkills: skillsArr.map((name: string) => ({ name })),
    secondarySkills: [],
    preferredWorkType: deploymentPref,
    preferredJobLocations: [],
    certifications: certs,
    workExperiences: Array.isArray(c.workExperience) ? c.workExperience : [],
    workExperience: Array.isArray(c.workExperience) ? c.workExperience : [],
    projects: Array.isArray(c.projects) ? c.projects : [],
    resumes: Array.isArray(c.resumes) ? c.resumes : [],
    availability: c.availability ?? null,
    availableIn: c.availableIn ?? null,
    englishProficiency: c.englishLevel ?? c.englishProficiency ?? null,
    enableAiMatching: null,
    createdAt: c.createdAt ?? null,
    updatedAt: c.updatedAt ?? null,
    isActive: c.isActive ?? true,
    employerProfileId: c.employerProfileId,
    resourceName: c.resourceName || fullName,
    currentRole: c.currentRole || c.role,
    designation: c.designation,
    totalExperience: c.totalExperience,
    employeeId: c.employeeId,
    refCode: c.refCode,
    technicalSkills: skillsArr,
    professionalSummary: c.professionalSummary ?? c.about ?? null,
    currency: c.currency,
    availableFrom: c.availableFrom,
    minimumContractDuration: c.minimumContractDuration,
    deploymentPreference: deploymentPref,
    category: c.category,
    requireNonSolicitation: c.requireNonSolicitation,
    availableForDeployment: c.availableForDeployment,
    resumePath: c.resumePath,
    resumeOriginalName: c.resumeOriginalName,
  };
};

type BenchProfile = ReturnType<typeof normalizeBenchCandidate>;
type CandidateProfile = EmployerCandidateProfileDto;
type ProfileData = BenchProfile | CandidateProfile;

const isBenchProfile = (p: ProfileData): p is BenchProfile =>
  p.candidateType === "bench";

const CandidateProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { state } = useLocation() as { state: { benchCandidate?: any } | null };
  const candidateId = useId();
  const isMobile = useIsMobile();

  const isBench = searchParams.get("source") === "bench";

  const benchProfile = useMemo(
    () =>
      isBench && state?.benchCandidate
        ? normalizeBenchCandidate(state.benchCandidate)
        : null,
    [isBench, state?.benchCandidate],
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingViewId, setLoadingViewId] = useState<number | null>(null);
  const latestRequestIdRef = useRef<number | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const {
    data: response,
    isLoading: isLoadingProfile,
    isError,
  } = useGetCandidateByIdQuery(!isBench && id ? id : skipToken);

  // Always fetch full bench resource data from API; use state data only while loading
  const {
    data: benchResponse,
    isLoading: isLoadingBenchProfile,
    isError: isBenchError,
  } = useGetBenchResourceByIdQuery(isBench && id ? id : skipToken);

  const normalizedBenchData = useMemo(
    () =>
      benchResponse?.data ? normalizeBenchCandidate(benchResponse.data) : null,
    [benchResponse],
  );

  const profile: ProfileData | undefined =
    normalizedBenchData ?? benchProfile ?? response?.data;

  const hasAvatar = !!profile?.userId;

  const { data: profileImage, isLoading: isLoadingImage } =
    useGetCandidateProfileImageQuery(
      hasAvatar && profile?.userId != null ? String(profile.userId) : skipToken,
    );

  const [viewCandidateResume] = useLazyViewCandidateResumeQuery();
  const [viewBenchResume] = useLazyViewBenchResumeQuery();

  const defaultResume = useMemo(() => {
    if (isBench && profile && isBenchProfile(profile) && profile.resumePath) {
      const originalName = profile.resumeOriginalName || "Resume";
      return {
        id: profile.id as number,
        originalName,
        mimeType: originalName.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : undefined,
        fileSize: undefined,
        uploadedAt: undefined,
        isDefault: true,
      } as Resume;
    }
    const resumes: Resume[] = profile?.resumes ?? [];
    return resumes.find((r) => r.isDefault) ?? resumes[0] ?? null;
  }, [profile, isBench]);

  const revokePreviewUrl = (url?: string | null) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  };

  const clearPreview = useCallback(() => {
    latestRequestIdRef.current = null;
    revokePreviewUrl(previewUrlRef.current);
    setPreviewUrl(null);
    setSelectedResume(null);
    setIsModalOpen(false);
  }, []);

  const handleViewResume = async (resume: Resume) => {
    if (!id) return;
    setLoadingViewId(resume.id);
    latestRequestIdRef.current = resume.id;
    try {
      let resumeUrl: string;

      if (isBench && id) {
        // For bench resources, fetch blob from the API endpoint
        const { data, error } = await viewBenchResume(id);
        if (latestRequestIdRef.current !== resume.id) {
          revokePreviewUrl(data as string);
          return;
        }
        if (error || !data) throw new Error("Failed to fetch resume");
        resumeUrl = data;
      } else {
        // For regular candidates, fetch from resume endpoint
        const { data, error } = await viewCandidateResume({
          candidateId: id,
          resumeId: resume.id,
        });

        if (latestRequestIdRef.current !== resume.id) {
          revokePreviewUrl(data as string);
          return;
        }

        if (error || !data) {
          throw new Error("Failed to fetch resume");
        }
        resumeUrl = data;
      }

      const isPdf = isPdfFile(resume);

      if (isMobile && isPdf) {
        window.open(resumeUrl, "_blank", "noopener,noreferrer");
        window.setTimeout(() => revokePreviewUrl(resumeUrl), 60_000);
        return;
      }

      setSelectedResume(resume);
      setIsModalOpen(true);
      revokePreviewUrl(previewUrl);
      setPreviewUrl(resumeUrl);
    } catch (err) {
      console.error("Error loading resume:", err);
      toast.error("Failed to open resume");
    } finally {
      if (latestRequestIdRef.current === resume.id) {
        setLoadingViewId(null);
      }
    }
  };

  // Prevent body scroll when modal is open & close on Escape
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") clearPreview();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, clearPreview]);

  // Close modal on mobile viewport
  useEffect(() => {
    if (isMobile && isModalOpen) clearPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  // Keep ref in sync so clearPreview always sees the latest URL
  useEffect(() => {
    previewUrlRef.current = previewUrl;
    return () => revokePreviewUrl(previewUrl);
  }, [previewUrl]);

  const loading = isBench ? isLoadingBenchProfile : isLoadingProfile;
  const hasError = isBench ? isBenchError && !profile : isError;
  const benchData = profile && isBenchProfile(profile) ? profile : null;

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900">
      {loading && !profile ? (
        <BarLoader />
      ) : hasError ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-red-600">Error loading candidate profile</div>
        </div>
      ) : !profile ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-gray-500">Candidate profile not found</div>
        </div>
      ) : (
        <div className="w-full dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            {/* Inline refresh indicator while bench API re-fetches */}
            {isBench && isLoadingBenchProfile && (
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-slate-400">
                <LoaderCircle className="w-3 h-3 animate-spin" />
                Refreshing profile…
              </div>
            )}
            {/* Back Button */}
            <div className="mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-3 space-y-4">
                {/* Profile Card */}
                <Card
                  id={candidateId}
                  className="dark:bg-slate-800 dark:border-slate-700 w-full"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 mx-auto mb-4 shadow-xl ring-4 ring-white/90 dark:ring-slate-700/90 relative">
                      {isLoadingImage ? (
                        <div className="flex items-center justify-center mx-auto">
                          <SpinnerLoader />
                        </div>
                      ) : (
                        <>
                          <AvatarImage
                            className="object-cover"
                            src={profileImage ?? ""}
                          />
                          <AvatarFallback>
                            <Camera className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <h2 className="text-base sm:text-lg lg:text-xl font-bold mb-1 dark:text-slate-100 break-words">
                      {profile?.firstName
                        ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
                        : benchData?.resourceName || "—"}
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm mb-1 font-semibold break-words">
                      {profile?.headline ??
                        profile?.primaryJobRole ??
                        benchData?.currentRole ??
                        "—"}
                    </p>
                    {profile?.email && (
                      <p className="text-gray-500 dark:text-slate-400 text-xs mb-1 break-words flex items-center justify-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {profile.email}
                      </p>
                    )}
                    {profile?.mobileNumber && (
                      <p className="text-gray-500 dark:text-slate-400 text-xs mb-3 break-words flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {profile.mobileNumber}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold text-xs">
                        {isBench ||
                        profile?.candidateType === "bench" ||
                        profile?.resourceType === "bench"
                          ? "BENCH RESOURCE"
                          : "CONTRACT RESOURCE"}
                      </Badge>
                      {Array.isArray(profile?.preferredWorkType) &&
                      profile.preferredWorkType.length > 0
                        ? profile.preferredWorkType
                            .filter((w: string) => w)
                            .map((workType: string) => (
                              <Badge
                                key={workType}
                                variant="outline"
                                className="text-xs capitalize"
                              >
                                {workType}
                              </Badge>
                            ))
                        : null}
                    </div>

                    {/* Details Card */}
                    <div className="border-t-2 border-t-gray-200 dark:border-t-slate-700 mt-6 sm:mt-8" />
                    <div className="p-0 my-6 sm:my-8 space-y-3">
                      {(() => {
                        const rawMin = profile?.hourlyRateMin;
                        const rawMax = profile?.hourlyRateMax;
                        const currency = benchData?.currency ?? "USD";
                        const rateMin =
                          rawMin != null && Number.isFinite(Number(rawMin))
                            ? Number(rawMin)
                            : null;
                        const rateMax =
                          rawMax != null && Number.isFinite(Number(rawMax))
                            ? Number(rawMax)
                            : null;
                        // Show a range only when both ends are finite and distinct
                        if (
                          rateMin != null &&
                          rateMax != null &&
                          rateMin !== rateMax
                        ) {
                          return (
                            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                              <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                                <DollarSign className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">Hourly Rate</span>
                              </span>
                              <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                                {formatCurrency(rateMin, currency)} -{" "}
                                {formatCurrency(rateMax, currency)}/hr
                              </span>
                            </div>
                          );
                        }
                        // Single value: prefer normalised min/max
                        const single = rateMin ?? rateMax;
                        if (single != null) {
                          return (
                            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                              <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                                <DollarSign className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">Hourly Rate</span>
                              </span>
                              <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                                {formatCurrency(single, currency)}/hr
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      {(profile?.expectedSalaryMin != null ||
                        profile?.expectedSalaryMax != null) && (
                        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                          <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                            <DollarSign className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Expected Salary</span>
                          </span>
                          <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                            {profile.expectedSalaryMin != null &&
                            profile.expectedSalaryMax != null
                              ? `$${profile.expectedSalaryMin} - $${profile.expectedSalaryMax}`
                              : profile.expectedSalaryMin != null
                                ? `From $${profile.expectedSalaryMin}`
                                : `Up to $${profile.expectedSalaryMax}`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Location</span>
                        </span>
                        <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right max-w-[50%] truncate">
                          {[profile?.city, profile?.country]
                            .filter(Boolean)
                            .join(", ") ||
                            profile?.location ||
                            "None"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <Briefcase className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">Experience</span>
                        </span>
                        <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                          {(() => {
                            const exp =
                              profile?.yearsExperience ??
                              profile?.experience ??
                              benchData?.totalExperience;
                            if (exp == null) return "None";
                            return typeof exp === "number"
                              ? `${exp} Years`
                              : String(exp).toLowerCase().includes("year")
                                ? String(exp)
                                : `${exp} Years`;
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <span className="text-gray-600 dark:text-slate-400 flex items-center gap-1 sm:gap-2 min-w-0">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">English</span>
                        </span>
                        <span className="font-semibold whitespace-nowrap dark:text-slate-200 text-right">
                          {profile?.englishProficiency || "None"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Card */}
                <Card
                  id={`CandidateProfile-${candidateId}-skillsCard`}
                  className="dark:bg-slate-800 dark:border-slate-700 w-full"
                >
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-bold mb-3 text-sm sm:text-base dark:text-slate-100">
                      Skills & Tech
                    </h3>
                    <div
                      id={`CandidateProfile-${candidateId}-skills`}
                      className="flex flex-wrap gap-2"
                    >
                      {(() => {
                        const rawSkills: any[] = profile?.primarySkills?.length
                          ? profile.primarySkills
                          : (benchData?.technicalSkills?.map((s: string) => ({
                              name: s,
                            })) ?? []);
                        return rawSkills.length ? (
                          rawSkills.map((skill: any, index: number) => {
                            const name =
                              typeof skill === "string" ? skill : skill.name;
                            const skillId =
                              typeof skill === "string" ? undefined : skill.id;
                            if (!name) return null;
                            return (
                              <Badge
                                key={skillId ?? name ?? index}
                                variant="secondary"
                                className="bg-gray-100 text-xs dark:bg-slate-700 dark:text-slate-200"
                              >
                                {name}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            No skills listed
                          </span>
                        );
                      })()}
                    </div>
                    {profile?.secondarySkills?.length > 0 && (
                      <>
                        <h4 className="font-semibold mt-4 mb-2 text-xs dark:text-slate-300">
                          Secondary Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.secondarySkills.map(
                            (skill: any, index: number) => {
                              const name =
                                typeof skill === "string" ? skill : skill.name;
                              if (!name) return null;
                              return (
                                <Badge
                                  key={name ?? index}
                                  variant="outline"
                                  className="text-xs dark:border-slate-600 dark:text-slate-300"
                                >
                                  {name}
                                </Badge>
                              );
                            },
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Certifications Card */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-bold mb-3 text-sm sm:text-base dark:text-slate-100">
                      Certifications
                    </h3>
                    <div className="space-y-3">
                      {profile?.certifications?.length ? (
                        profile.certifications.map(
                          (cert: any, cIndex: number) => {
                            const certName =
                              typeof cert === "string"
                                ? cert
                                : cert.name || cert.title;
                            const certIssuer =
                              typeof cert === "string" ? null : cert.issuer;
                            const certDate =
                              typeof cert === "string"
                                ? null
                                : cert.year || cert.issueDate;
                            return (
                              <div
                                id={`CandidateProfile-${candidateId}-cert-${cIndex}`}
                                className="flex items-start gap-2 sm:gap-3"
                                key={`${certName}-${cIndex}`}
                              >
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 dark:bg-blue-900/40">
                                  <span role="img" aria-label="diploma">
                                    🎓
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-xs sm:text-sm dark:text-slate-200 break-words">
                                    {certName}
                                  </p>
                                  {certIssuer && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                      {certIssuer}
                                    </p>
                                  )}
                                  {certDate && (
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                      {certDate}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          },
                        )
                      ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                            🎓
                          </div>
                          <div>
                            <p className="font-semibold text-xs my-auto sm:text-sm text-gray-500">
                              No Certifications
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-9 min-w-0">
                <Tabs defaultValue="overview" className="space-y-4 w-full">
                  <TabsList className="w-full justify-start overflow-x-auto dark:bg-slate-800 dark:text-slate-400 flex-nowrap">
                    <TabsTrigger
                      value="overview"
                      className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="resume"
                      className="text-xs sm:text-sm dark:data-[state=active]:bg-slate-900 dark:data-[state=active]:text-slate-100"
                    >
                      Resume
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* About Candidate / Professional Summary */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-3 dark:text-slate-100">
                          {isBench ? "Professional Summary" : "About Candidate"}
                        </h3>
                        <p
                          className="text-sm sm:text-base text-gray-700 dark:text-slate-300 mb-3 break-words"
                          style={{ lineHeight: "1.8" }}
                        >
                          {isBench
                            ? benchData?.professionalSummary ||
                              "No summary provided"
                            : (profile?.bio ?? "No bio")}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Contact & Preferences Card */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-4 dark:text-slate-100">
                          Contact & Preferences
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Email
                            </p>
                            <p className="text-sm font-medium dark:text-slate-200 break-words">
                              {profile?.email || "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Mobile
                            </p>
                            <p className="text-sm font-medium dark:text-slate-200">
                              {profile?.mobileNumber || "—"}
                            </p>
                          </div>
                          {!isBench && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                City
                              </p>
                              <p className="text-sm font-medium dark:text-slate-200">
                                {profile?.city || "—"}
                              </p>
                            </div>
                          )}
                          {!isBench && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Country
                              </p>
                              <p className="text-sm font-medium dark:text-slate-200">
                                {profile?.country || "—"}
                              </p>
                            </div>
                          )}
                          {!isBench && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Candidate Type
                              </p>
                              <p className="text-sm font-medium dark:text-slate-200 capitalize">
                                {profile?.candidateType || "—"}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Work mode
                            </p>
                            <p className="text-sm font-medium dark:text-slate-200 capitalize">
                              {benchData?.deploymentPreference &&
                              benchData.deploymentPreference.length > 0
                                ? benchData.deploymentPreference.join(", ")
                                : Array.isArray(profile?.preferredWorkType) &&
                                    profile.preferredWorkType.length > 0
                                  ? profile.preferredWorkType
                                      .filter((w: string) => w)
                                      .join(", ")
                                  : "—"}
                            </p>
                          </div>
                          {!isBench && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Preferred Job Locations
                              </p>
                              <p className="text-sm font-medium dark:text-slate-200">
                                {Array.isArray(
                                  profile?.preferredJobLocations,
                                ) && profile.preferredJobLocations.length > 0
                                  ? profile.preferredJobLocations.join(", ")
                                  : "—"}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Available To Join
                            </p>
                            <p className="text-sm font-medium dark:text-slate-200 capitalize">
                              {profile?.availableIn ||
                                profile?.availability ||
                                (benchData?.availableFrom
                                  ? (() => {
                                      const d = new Date(
                                        benchData.availableFrom,
                                      );
                                      return Number.isNaN(d.getTime())
                                        ? "—"
                                        : d.toLocaleDateString();
                                    })()
                                  : "—")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Resource Details - Bench only */}
                    {isBench && benchData && (
                      <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-base sm:text-lg font-bold mb-4 dark:text-slate-100">
                            Resource Details
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {benchData.employeeId && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Employee ID
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200">
                                  {benchData.employeeId}
                                </p>
                              </div>
                            )}
                            {benchData.refCode && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Ref Code
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200">
                                  {benchData.refCode}
                                </p>
                              </div>
                            )}
                            {benchData.designation && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Designation
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200">
                                  {benchData.designation}
                                </p>
                              </div>
                            )}
                            {benchData.category && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Category
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200 capitalize">
                                  {benchData.category}
                                </p>
                              </div>
                            )}
                            {benchData.currency && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Currency
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200">
                                  {benchData.currency}
                                </p>
                              </div>
                            )}
                            {benchData.availableFrom && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Available From
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200">
                                  {(() => {
                                    const d = new Date(benchData.availableFrom);
                                    return Number.isNaN(d.getTime())
                                      ? "—"
                                      : d.toLocaleDateString();
                                  })()}
                                </p>
                              </div>
                            )}
                            {benchData.minimumContractDuration && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">
                                  Min Contract Duration
                                </p>
                                <p className="text-sm font-medium dark:text-slate-200">
                                  {benchData.minimumContractDuration} months
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Work Experience */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-4 dark:text-slate-100">
                          Work Experience
                        </h3>
                        {((profile?.workExperiences ?? profile?.workExperience)
                          ?.length ?? 0) > 0 ? (
                          <div className="space-y-6">
                            {(
                              profile?.workExperiences ??
                              profile?.workExperience
                            )?.map((entry: any, index: number) => {
                              const {
                                role,
                                companyName,
                                startDate,
                                endDate,
                                location,
                                description,
                              } = entry;
                              const entryId = `${candidateId}-work-${index}`;
                              return (
                                <div
                                  key={entryId}
                                  id={entryId}
                                  className="flex gap-3 sm:gap-4"
                                >
                                  <div
                                    className={`w-1 ${index === 0 ? "bg-green-600 dark:bg-green-600" : "bg-gray-300 dark:bg-slate-600"} rounded-full flex-shrink-0`}
                                  ></div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm sm:text-base dark:text-slate-100 break-words">
                                      {role}
                                    </h4>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm mb-1 font-semibold break-words">
                                      {companyName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mb-2 break-words">
                                      {startDate} - {endDate ?? "Present"} •{" "}
                                      {location}
                                    </p>
                                    <div className="text-xs sm:text-sm text-gray-700 dark:text-slate-300 space-y-1">
                                      {(Array.isArray(description)
                                        ? description
                                        : description
                                          ? description
                                              .split(/\r?\n/)
                                              .filter(Boolean)
                                          : []
                                      ).map(
                                        (bullet: string, bIndex: number) => (
                                          <p
                                            key={`${entryId}-bullet-${bIndex}`}
                                            className="break-words"
                                          >
                                            {bullet}
                                          </p>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm sm:text-base text-gray-700 dark:text-slate-300">
                            No work experience
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Featured Projects */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between mb-4 gap-2">
                          <h3 className="text-base sm:text-lg font-bold dark:text-slate-100">
                            Featured Projects
                          </h3>
                          <Button
                            variant="link"
                            disabled
                            className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm p-0 whitespace-nowrap"
                          >
                            View Portfolio
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {profile?.projects?.length ? (
                            profile.projects.map(
                              (project: any, pIndex: number) => {
                                const safeProjectUrl = getSafeProjectUrl(
                                  project.url ?? project.projectUrl,
                                );
                                return (
                                  <Card
                                    id={`CandidateProfile-${candidateId}-project-${pIndex}`}
                                    className="border dark:border-slate-700 dark:bg-slate-800 w-full"
                                    key={`${project.name || project.title}-${pIndex}`}
                                  >
                                    <CardContent className="p-4 sm:p-6">
                                      <div className="w-full h-24 sm:h-32 bg-gray-100 dark:bg-slate-700/50 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                                        <div className="w-10 h-14 sm:w-12 sm:h-16 border-2 border-gray-300 dark:border-slate-500 rounded flex items-center justify-center text-2xl dark:text-slate-300">
                                          {safeProjectUrl ? "🌐" : "📂"}
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base dark:text-slate-100 break-words">
                                          {project.name || project.title}
                                        </h4>
                                        {safeProjectUrl && (
                                          <a
                                            href={safeProjectUrl}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                            className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words mb-1 font-semibold hover:underline"
                                          >
                                            Link
                                          </a>
                                        )}
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words">
                                        {Array.isArray(
                                          project.technologies ??
                                            project.techStack,
                                        )
                                          ? (
                                              project.technologies ??
                                              project.techStack
                                            ).join(", ")
                                          : (project.technologies ??
                                            project.techStack)}
                                      </p>
                                      <p className="mt-3 text-xs sm:text-sm text-gray-600 dark:text-slate-400 break-words">
                                        {project.description}
                                      </p>
                                    </CardContent>
                                  </Card>
                                );
                              },
                            )
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-slate-400 col-span-2">
                              No projects yet
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Resume Tab */}
                  <TabsContent value="resume" className="space-y-4">
                    <Card className="dark:bg-slate-800 dark:border-slate-700 w-full">
                      <CardContent className="p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-bold mb-4 dark:text-slate-100">
                          Resumes
                        </h3>
                        {defaultResume ? (
                          <div className="space-y-3">
                            <Card
                              key={defaultResume.id}
                              className="border dark:border-slate-700 dark:bg-slate-800/50"
                            >
                              <CardContent className="p-4 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-sm dark:text-slate-200 truncate">
                                        {defaultResume.originalName}
                                      </p>
                                      {defaultResume.isDefault && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs flex-shrink-0 gap-1"
                                        >
                                          <Star className="w-3 h-3" />
                                          Default
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-slate-400">
                                      {typeof defaultResume.fileSize ===
                                      "number"
                                        ? formatFileSize(defaultResume.fileSize)
                                        : "Unknown size"}{" "}
                                      •{" "}
                                      {defaultResume.uploadedAt &&
                                      !Number.isNaN(
                                        Date.parse(defaultResume.uploadedAt),
                                      )
                                        ? new Date(
                                            defaultResume.uploadedAt,
                                          ).toLocaleDateString()
                                        : "Unknown date"}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-lg flex-shrink-0 gap-1"
                                  disabled={loadingViewId === defaultResume.id}
                                  onClick={() =>
                                    handleViewResume(defaultResume)
                                  }
                                >
                                  {loadingViewId === defaultResume.id ? (
                                    <LoaderCircle className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                  View
                                </Button>
                              </CardContent>
                            </Card>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">
                              No resumes uploaded by this candidate
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {isModalOpen && selectedResume && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={clearPreview}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-preview-title"
            className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-700">
              <h3
                id="resume-preview-title"
                className="font-semibold text-sm dark:text-slate-100 truncate"
              >
                {selectedResume.originalName}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close resume preview"
                onClick={clearPreview}
                className="flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {isPdfFile(selectedResume) ? (
                <iframe
                  src={previewUrl}
                  title="Resume Preview"
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-3 opacity-40" />
                    <p className="text-sm mb-2">
                      Preview not available for this file type
                    </p>
                    <a
                      href={previewUrl}
                      download={selectedResume.originalName}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Download instead
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfileView;

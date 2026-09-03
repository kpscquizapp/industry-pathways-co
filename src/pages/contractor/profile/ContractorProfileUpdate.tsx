import {
  ChangeEvent,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  Camera,
  FileText,
  CheckSquare,
  Check,
  PencilLine,
} from "lucide-react";
import {
  useGetCandidateProfileImageQuery,
  useGetProfileQuery,
  useRemoveCertificateMutation,
  useRemoveProfileImageMutation,
  useRemoveProjectMutation,
  useRemoveSkillMutation,
  useRemoveWorkExperienceMutation,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "@/app/queries/profileApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { skipToken } from "@reduxjs/toolkit/query";
import ResumeManager, { type Resume } from "./ResumeManager";
import { currencySymbols } from "@/lib/currency";
import { useNavigate } from "react-router-dom";
import { clearExtractedSkills } from "@/app/slices/extractResumeSkills";

const BasicInfoSection = lazy(() => import("./BasicInfoSection").then(m => ({ default: m.BasicInfoSection })));
const SkillsSection = lazy(() => import("./SkillsSection").then(m => ({ default: m.SkillsSection })));
const WorkExperienceSection = lazy(() => import("./WorkExperienceSection").then(m => ({ default: m.WorkExperienceSection })));
const ProjectsSection = lazy(() => import("./ProjectsSection").then(m => ({ default: m.ProjectsSection })));
const CertificationsSection = lazy(() => import("./CertificationsSection").then(m => ({ default: m.CertificationsSection })));

// ==================== TYPES ====================
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type Skill = {
  id: number;
  name: string;
};

type ExtractedSkill = {
  id: string;
  name: string;
  isPrimary: boolean;
};

type WorkExperienceForm = {
  id: number | null;
  localId?: string;
  companyName: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  description: string | string[];
  location: string;
};

type ProjectForm = {
  id: number | null;
  localId?: string;
  title: string;
  description: string;
  techStack: string[] | string;
  projectUrl: string;
  isFeatured: boolean;
};

type CertificationForm = {
  id: number | null;
  localId?: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string | null;
  credentialUrl: string;
};

interface FormDataState {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  location: string;
  country: string | null;
  city: string | null;
  candidateType: string;
  bio: string;
  yearsExperience: string | number;
  weeklyWorkingHours: string | number;
  primarySkills: string[];
  secondarySkills: string[];
  primaryJobRole: string;
  availableToJoin: string;
  englishProficiency: string;
  preferredJobLocations: string[];
  expectedSalaryMin: number | string;
  expectedSalaryMax: number | string;
  hourlyRateMin: number | string;
  hourlyRateMax: number | string;
  currency: string;
  workExperiences: WorkExperienceForm[];
  projects: ProjectForm[];
  certifications: CertificationForm[];
}

interface CandidateProfileUpdateProps {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    candidateProfile: {
      location?: string;
      mobileNumber?: string;
      country?: string | null;
      city?: string | null;
      candidateType?: string;
      bio?: string;
      yearsExperience?: string | number;
      weeklyWorkingHours?: string | number;
      primarySkills?: Skill[];
      secondarySkills?: any[];
      primaryJobRole?: string;
      availableToJoin?: string;
      englishProficiency?: string;
      preferredJobLocations?: string[];
      hourlyRateMin?: number | string;
      hourlyRateMax?: number | string;
      expectedSalaryMin?: number | string;
      expectedSalaryMax?: number | string;
      currency?: string;
      workExperiences?: Array<{
        id: number | null;
        localId?: string;
        companyName: string;
        role: string;
        employmentType: string;
        startDate: string;
        endDate: string | null;
        description: string;
        location: string;
      }>;
      projects?: Array<{
        id: number | null;
        localId?: string;
        title: string;
        description: string;
        techStack: string[];
        projectUrl: string;
        isFeatured: boolean;
      }>;
      certifications?: Array<{
        id: number | null;
        localId?: string;
        name: string;
        issuedBy: string;
        issueDate: string;
        expiryDate?: string;
        credentialUrl: string;
      }>;
      resumes?: Resume[];
    };
  };
}

// ==================== VALIDATION ====================
const parseLocalDate = (dateStr: string): Date | null => {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  // Verify the date wasn't normalized (e.g., Feb 30 → Mar 2)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

const VALIDATION = {
  name: {
    minLength: 1,
    maxLength: 50,
    regex: /^[\p{L}\s\-']+$/u,
    validate: (name: string, fieldName: string) => {
      if (!name || !name.trim()) return `${fieldName} is required`;
      if (name.trim().length > 50)
        return `${fieldName} must be less than 50 characters`;
      if (!VALIDATION.name.regex.test(name)) {
        return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
      }
      return null;
    },
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 254,
    validate: (email: string) => {
      if (!email) return "Email is required";
      if (email.length > 254) return "Email must be less than 254 characters";
      if (!VALIDATION.email.regex.test(email))
        return "Please enter a valid email address";
      return null;
    },
  },
  primaryJobRole: {
    maxLength: 100,
    validate: (primaryJobRole: string) => {
      if (primaryJobRole && primaryJobRole.length > 100)
        return "Primary Job Role must be less than 100 characters";
      return null;
    },
  },
  bio: {
    maxLength: 1000,
    validate: (bio: string) => {
      if (bio && bio.length > 1000)
        return "Bio must be less than 1000 characters";
      return null;
    },
  },
  experience: {
    min: 0,
    max: 70,
    validate: (years: number | string) => {
      if (years === "" || years == null) return null; // Optional field
      const num = Number(years);
      if (isNaN(num)) return "Years of experience must be a number";
      if (!Number.isInteger(num))
        return "Years of experience must be a whole number";
      if (num < 0) return "Years of experience cannot be negative";
      if (num > 70) return "Years of experience must be less than 70";
      return null;
    },
  },
  hourlyRate: {
    min: 0,
    max: 10000,
    validate: (min: number | string, max: number | string) => {
      if ((min === "" || min == null) && (max === "" || max == null))
        return null; // Both optional

      const minNum = Number(min);
      const maxNum = Number(max);

      if (min !== "" && min != null) {
        if (isNaN(minNum)) return "Minimum rate must be a number";
        if (minNum < 0) return "Minimum rate cannot be negative";
        if (minNum > 10000)
          return "Minimum rate exceeds reasonable limit ($10,000/hr)";
      }

      if (max !== "" && max != null) {
        if (isNaN(maxNum)) return "Maximum rate must be a number";
        if (maxNum < 0) return "Maximum rate cannot be negative";
        if (maxNum > 10000)
          return "Maximum rate exceeds reasonable limit ($10,000/hr)";
      }

      if (min !== "" && max !== "" && min != null && max != null) {
        if (minNum > maxNum) return "Minimum rate cannot exceed maximum rate";
      }

      return null;
    },
  },
  url: {
    validate: (url: string) => {
      if (!url || url.trim() === "") return null; // Optional
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          return "URL must use http or https protocol";
        }
        return null;
      } catch {
        return "Please enter a valid URL (e.g., https://example.com)";
      }
    },
  },
  certificationDate: {
    validate: (
      issueDate: string,
      expiryDate: string | null,
    ): { field: "issueDate" | "expiryDate"; message: string } | null => {
      if (!issueDate)
        return { field: "issueDate", message: "Issue date is required" };

      const issue = parseLocalDate(issueDate);
      if (!issue)
        return { field: "issueDate", message: "Invalid issue date format" };
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      if (issue > now) {
        return {
          field: "issueDate",
          message: "Issue date cannot be in the future",
        };
      }

      if (expiryDate) {
        const expiry = parseLocalDate(expiryDate);
        if (!expiry)
          return { field: "expiryDate", message: "Invalid expiry date format" };
        if (expiry < issue) {
          return {
            field: "expiryDate",
            message: "Expiry date cannot be before issue date",
          };
        }
        // Note: expiry date CAN be in the future - that's valid
      }

      return null;
    },
  },
  date: {
    validate: (
      startDate: string,
      endDate: string | null,
      fieldName: string = "date",
    ) => {
      if (!startDate) return `Start date is required for ${fieldName}`;

      const start = parseLocalDate(startDate);
      if (!start) {
        return `Invalid start date format for ${fieldName}`;
      }
      const now = new Date();

      // Normalize to date-only (strip time) for fair comparison
      now.setHours(23, 59, 59, 999);

      if (start > now) {
        return "Start date cannot be in the future";
      }

      if (endDate) {
        const end = parseLocalDate(endDate);
        if (!end) {
          return `Invalid end date format for ${fieldName}`;
        }
        if (end < start) {
          return "End date cannot be before start date";
        }
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        if (end > endOfToday) {
          return "End date cannot be in the future";
        }
      }

      return null;
    },
  },
  skill: {
    minCount: 1,
    maxCount: 50,
    maxLength: 50,
    validate: (skills: string[]) => {
      if (skills.length === 0) return "Please add at least one skill";
      if (skills.length > 50) return "You can add a maximum of 50 skills";
      const invalidSkill = skills.find((s) => s.length > 50);
      if (invalidSkill) return "Each skill must be less than 50 characters";
      return null;
    },
  },
};

// ==================== UI HELPERS ====================
const DashCard = ({
  children,
  className = "",
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) => (
  <div
    className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 ${noPadding ? "" : "p-4 sm:p-6 md:p-8"} ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({
  icon,
  title,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6">
    <div className="flex items-center gap-3 text-gray-900 dark:text-white">
      {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
    </div>
    {action && <div className="self-start sm:self-auto">{action}</div>}
  </div>
);

// ==================== COMPONENT ====================
const CandidateProfileUpdate = (): JSX.Element => {
  // API calls
  const { token, userDetails } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { data: response, isLoading: isLoadingProfile } = useGetProfileQuery(
    undefined,
    { skip: !token },
  );
  const data = response?.data;

  const [updateProfile, { isLoading: isUpdating, isError: updateError }] =
    useUpdateProfileMutation();
  const [removeSkill] = useRemoveSkillMutation();
  const [removeWorkExperience] = useRemoveWorkExperienceMutation();
  const [removeProject] = useRemoveProjectMutation();
  const [removeCertificate] = useRemoveCertificateMutation();
  const [uploadProfileImage, { isLoading: isLoadingImage }] =
    useUploadProfileImageMutation();
  const [removeProfileImage, { isLoading: isRemovingImage }] =
    useRemoveProfileImageMutation();
  const navigation = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasAvatar = !!data?.avatar;

  const {
    currentData: profileImage,
    isLoading: isProfileImageLoading,
    refetch: refetchCandidateProfileImage,
  } = useGetCandidateProfileImageQuery(hasAvatar ? data.id : skipToken);

  const [skillInput, setSkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [removingSkillId, setRemovingSkillId] = useState<
    string | number | null
  >(null);
  const [removingWorkExperienceId, setRemovingWorkExperienceId] = useState<
    string | number | null
  >(null);
  const [removingProjectId, setRemovingProjectId] = useState<
    string | number | null
  >(null);
  const [removingCertificateId, setRemovingCertificateId] = useState<
    string | number | null
  >(null);
  const resumeData = useSelector((state: RootState) => state.resumeSkills.data);
  const preferredLocationsDirtyRef = useRef(false);
  const previousProfileIdRef = useRef<string | null>(null);
  const removeSkillTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const removeWorkTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const removeProjectTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const removeCertTimeoutsRef = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [editingExtractedSkillId, setEditingExtractedSkillId] = useState<
    string | null
  >(null);
  const [editingExtractedSkillName, setEditingExtractedSkillName] =
    useState("");
  const [isEditingPrimarySkills, setIsEditingPrimarySkills] = useState(false);
  const [showPrimarySkillsDisplay, setShowPrimarySkillsDisplay] =
    useState(false);
  const processedResumeDataRef = useRef<any>(null);
  const primarySkillsRef = useRef<string[]>([]);

  useEffect(() => {
    preferredLocationsDirtyRef.current = false;
  }, [data?.id]);

  const normalizeSkill = (value: string) => value.toLowerCase().trim();

  const profileSkills = useMemo(() => {
    // Get profile skills ONLY
    const profileSkillsList =
      data?.candidateProfile?.primarySkills
        ?.map((skill) => (typeof skill === "string" ? skill : skill.name))
        .filter((s): s is string => typeof s === "string" && s.trim() !== "") ||
      [];

    return profileSkillsList.filter(
      (skill, index, self) =>
        index ===
        self.findIndex(
          (s) => s.toLowerCase().trim() === skill.toLowerCase().trim(),
        ),
    );
  }, [data]);

  const toNumberOrEmpty = (value: number | string | null | undefined) => {
    if (value === "" || value == null) return "";
    const n = Number(value);
    return Number.isFinite(n) ? n : "";
  };

  // Single memoized form initializer — no intermediate useMemo chains for
  // workExperiences / projects / certifications. All field mapping lives here
  // so the dependency list is just [data, profileSkills] instead of 4 cascading memos.
  const initialFormData = useMemo((): FormDataState => {
    if (!data)
      return {
        firstName: "",
        lastName: "",
        email: "",
        mobileNumber: "",
        location: "",
        country: null,
        city: null,
        candidateType: "",
        bio: "",
        yearsExperience: "",
        weeklyWorkingHours: "",
        primarySkills: [],
        secondarySkills: [],
        primaryJobRole: "",
        availableToJoin: "",
        englishProficiency: "",
        preferredJobLocations: [],
        hourlyRateMin: "",
        hourlyRateMax: "",
        expectedSalaryMin: "",
        expectedSalaryMax: "",
        currency: "",
        workExperiences: [],
        projects: [],
        certifications: [],
      };
    const profile = data.candidateProfile;
    if (!profile) {
      return {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        mobileNumber: "",
        location: "",
        country: null,
        city: null,
        candidateType: "",
        bio: "",
        yearsExperience: "",
        weeklyWorkingHours: "",
        primarySkills: [],
        secondarySkills: [],
        primaryJobRole: "",
        availableToJoin: "",
        englishProficiency: "",
        preferredJobLocations: [],
        hourlyRateMin: "",
        hourlyRateMax: "",
        expectedSalaryMin: "",
        expectedSalaryMax: "",
        currency: "",
        workExperiences: [],
        projects: [],
        certifications: [],
      };
    }
    return {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      mobileNumber: profile.mobileNumber || "",
      location: profile.location || "",
      country: profile.country ?? null,
      city: profile.city ?? null,
      candidateType: profile.candidateType || "",
      bio: profile.bio || "",
      yearsExperience: profile.yearsExperience ?? "",
      weeklyWorkingHours: profile.weeklyWorkingHours ?? "",
      primarySkills: profileSkills || [],
      secondarySkills:
        profile.secondarySkills
          ?.map((s: any) => (typeof s === "string" ? s : s.name))
          .filter((s: string) => !!s) || [],
      primaryJobRole: profile.primaryJobRole || "",
      availableToJoin: profile.availableToJoin || "",
      englishProficiency: profile.englishProficiency ?? "",
      preferredJobLocations: profile.preferredJobLocations ?? [],
      hourlyRateMin: toNumberOrEmpty(profile.hourlyRateMin),
      hourlyRateMax: toNumberOrEmpty(profile.hourlyRateMax),
      expectedSalaryMin: toNumberOrEmpty(profile.expectedSalaryMin),
      expectedSalaryMax: toNumberOrEmpty(profile.expectedSalaryMax),
      currency: (() => {
        const raw = (profile as { currency?: string })?.currency;
        return raw && currencySymbols[raw] ? raw : "";
      })(),
      workExperiences:
        profile.workExperiences?.map(
          ({ id, localId, companyName, role, employmentType, startDate, endDate, description, location }) => ({
            id, localId, companyName, role, employmentType, startDate, endDate, description, location,
          }),
        ) || [],
      projects:
        profile.projects?.map(
          ({ id, localId, title, description, techStack, projectUrl, isFeatured }) => ({
            id, localId, title, description, techStack, projectUrl, isFeatured,
          }),
        ) || [],
      certifications:
        profile.certifications?.map(
          ({ id, localId, name, issueDate, issuedBy, expiryDate, credentialUrl }) => ({
            id, localId, name, issueDate, issuedBy, expiryDate, credentialUrl,
          }),
        ) || [],
    };
  }, [data, profileSkills]);

  const [formData, setFormData] = useState<FormDataState>(() => initialFormData);

  useEffect(() => {
    primarySkillsRef.current = formData.primarySkills;
  }, [formData.primarySkills]);

  const teardownPendingRemovals = useCallback(() => {
    Object.values(removeSkillTimeoutsRef.current).forEach((t) => {
      clearTimeout(t);
    });
    Object.values(removeWorkTimeoutsRef.current).forEach((t) => {
      clearTimeout(t);
    });
    Object.values(removeProjectTimeoutsRef.current).forEach((t) => {
      clearTimeout(t);
    });
    Object.values(removeCertTimeoutsRef.current).forEach((t) => {
      clearTimeout(t);
    });
    removeSkillTimeoutsRef.current = {};
    removeWorkTimeoutsRef.current = {};
    removeProjectTimeoutsRef.current = {};
    removeCertTimeoutsRef.current = {};
    setRemovingSkillId(null);
    setRemovingWorkExperienceId(null);
    setRemovingProjectId(null);
    setRemovingCertificateId(null);
  }, []);

  useEffect(() => {
    if (!data) {
      previousProfileIdRef.current = null;
      return;
    }

    if (previousProfileIdRef.current !== data.id) {
      // Clear any pending removal timeouts from the previous profile
      teardownPendingRemovals();
      previousProfileIdRef.current = data.id;
      preferredLocationsDirtyRef.current = false;
      setFormData(initialFormData);
    }
  }, [data, initialFormData, teardownPendingRemovals]);

  useEffect(() => {
    const validResumeSkills = Array.isArray(resumeData)
      ? resumeData.filter(
        (s): s is string => typeof s === "string" && s.trim() !== "",
      )
      : [];

    if (
      validResumeSkills.length === 0 ||
      JSON.stringify(validResumeSkills) ===
      JSON.stringify(processedResumeDataRef.current)
    ) {
      return;
    }

    processedResumeDataRef.current = validResumeSkills;
    setShowPrimarySkillsDisplay(true);

    const currentPrimary = primarySkillsRef.current;
    const newExtractedObjects: ExtractedSkill[] = [];
    const newPrimarySkills = [...currentPrimary];
    let checkedCount = 0;

    // Pass 1: existing skills (both matched and unmatched with resume)
    // First, add all current primary skills into our local tracker so they appear in the banner checked.
    currentPrimary.forEach((skill) => {
      const normalized = normalizeSkill(skill);
      // It is already primary, so it's a checked item
      checkedCount++;
      newExtractedObjects.push({
        id: createLocalId("ext"),
        name: skill,
        isPrimary: true,
      });
    });

    // Also include existing secondary skills in the banner (unchecked) so the user sees everything
    formData.secondarySkills.forEach((skill) => {
      newExtractedObjects.push({
        id: createLocalId("ext"),
        name: skill,
        isPrimary: false,
      });
    });

    // Now, handle the validResumeSkills
    // If a resume skill matches an existing one, we don't add duplicates.
    // If it's completely new, it evaluates auto-promote logic.
    const currentPrimaryCount = currentPrimary.length;
    let autoCheckedCount = checkedCount;
    const seenResumeSkills = new Set<string>();

    for (const skill of validResumeSkills) {
      const normalized = normalizeSkill(skill);
      if (seenResumeSkills.has(normalized)) continue;

      const inPrimary = currentPrimary.some(
        (p) => normalizeSkill(p) === normalized,
      );
      const inSecondary = formData.secondarySkills.some(
        (s) => normalizeSkill(s) === normalized,
      );

      if (!inPrimary && !inSecondary) {
        // Completely new extracted skill
        if (autoCheckedCount < 5) {
          // simplify to autoCheckedCount < 5
          newPrimarySkills.push(skill);
          seenResumeSkills.add(normalized);
          newExtractedObjects.push({
            id: createLocalId("ext"),
            name: skill,
            isPrimary: true,
          });
          autoCheckedCount++;
        } else {
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

    // setExtractedSkills is called OUTSIDE setFormData — no nested setState
    setExtractedSkills((prevExt) => {
      const updated = [...prevExt];
      // Note: Because we could have duplicate executions or existing items in prevExt,
      // we merge cleanly using name.
      for (const newObj of newExtractedObjects) {
        const existingIdx = updated.findIndex(
          (u) => normalizeSkill(u.name) === normalizeSkill(newObj.name),
        );
        if (existingIdx === -1) {
          updated.push(newObj);
        } else {
          // Keep existing ID so UI keys don't jump, but update state
          updated[existingIdx] = {
            ...updated[existingIdx],
            isPrimary: newObj.isPrimary,
          };
        }
      }
      return updated;
    });

    setFormData((prev) => ({ ...prev, primarySkills: newPrimarySkills }));
  }, [resumeData]);

  useEffect(() => {
    return () => {
      teardownPendingRemovals();
    };
  }, [teardownPendingRemovals]);

  const candidateTypeOptions = [
    "Full-Time Job Seeker",
    "Contract / Freelance",
    "Hybrid Professional",
  ];
  const availableToJoinOptions = [
    "Immediate",
    "15 Days",
    "30 Days",
    "60 Days+",
  ];
  const englishProficiencyOptions = [
    "Basic",
    "Professional",
    "Fluent",
    "Native",
  ];
  const employmentTypeOptions = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
  ];

  const handleInputChange = (e: ChangeEvent<FormElement>) => {
    const { name, value } = e.target;

    // Clear field error when user starts typing
    const errorKeysToCheck = [name];
    // hourlyRate error is stored under a shared key
    if (name === "hourlyRateMin" || name === "hourlyRateMax") {
      errorKeysToCheck.push("hourlyRate");
    }

    // expected salary has paired validation behavior (min/max relationship)
    if (name === "expectedSalaryMin" || name === "expectedSalaryMax") {
      errorKeysToCheck.push("expectedSalaryMin", "expectedSalaryMax");
    }

    setFieldErrors((prev) => {
      const hasMatch = errorKeysToCheck.some((key) => prev[key]);
      if (!hasMatch) return prev;
      const newErrors = { ...prev };
      errorKeysToCheck.forEach((key) => {
        delete newErrors[key];
      });
      return newErrors;
    });

    switch (name) {
      case "hourlyRateMin":
      case "hourlyRateMax":
      case "yearsExperience":
      case "expectedSalaryMin":
      case "expectedSalaryMax":
        {
          const parsed = value === "" ? "" : Number(value);
          if (parsed === "" || Number.isFinite(parsed)) {
            setFormData((prev) => ({
              ...prev,
              [name]: parsed,
            }));
          }
        }
        return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addLocation = () => {
    const name = locationInput.trim();

    if (!name) {
      toast.error("Please enter a location");
      return;
    }

    if (name.length > 100) {
      toast.error("Location must be less than 100 characters");
      return;
    }

    if (formData.preferredJobLocations.length >= 100) {
      toast.error("You can add a maximum of 100 preferred locations");
      return;
    }

    if (
      formData.preferredJobLocations.some(
        (loc) => loc.trim().toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error("This location has already been added");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      preferredJobLocations: [...prev.preferredJobLocations, name],
    }));
    setFieldErrors((prev) => {
      if (!prev.preferredJobLocations) return prev;
      const newErrors = { ...prev };
      delete newErrors.preferredJobLocations;
      return newErrors;
    });
    preferredLocationsDirtyRef.current = true;
    setLocationInput("");
  };

  const handleLocationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);

    setFieldErrors((prev) => {
      if (!prev.preferredJobLocations) return prev;
      const newErrors = { ...prev };
      delete newErrors.preferredJobLocations;
      return newErrors;
    });
  };

  const removeLocation = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      preferredJobLocations: prev.preferredJobLocations.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
    preferredLocationsDirtyRef.current = true;
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

    if (formData.secondarySkills.length >= 50) {
      toast.error("You can add a maximum of 50 secondary skills");
      return;
    }

    // Check if skill already exists in either primary or secondary
    if (
      formData.secondarySkills.some(
        (skill) => skill.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error("This skill has already been added to secondary skills");
      return;
    }

    if (
      formData.primarySkills.some(
        (skill) => skill.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error("This skill is already in primary skills");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      secondarySkills: [...prevData.secondarySkills, name],
    }));
    setSkillInput("");

    // Clear secondary skills error if it exists
    if (fieldErrors.secondarySkills) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.secondarySkills;
        return newErrors;
      });
    }
  };

  const removeSkills = async (skillToRemove: string) => {
    // Guard clause: prevent removing the last skill
    if (formData.primarySkills.length <= 1) {
      toast.warning("You must have at least one skill");
      return;
    }

    // Find the skill to remove
    const filteredSkill = data?.candidateProfile?.primarySkills?.find(
      (skill: string | { name: string }) =>
        typeof skill === "string"
          ? skill.toLowerCase() === skillToRemove.toLowerCase()
          : (skill as { name: string }).name.toLowerCase() ===
          skillToRemove.toLowerCase(),
    );

    // Guard clause: skill not found (local, not persisted)
    if (
      filteredSkill == null ||
      typeof filteredSkill === "string" ||
      filteredSkill.id == null
    ) {
      // Not persisted yet — animate local removal with spinner for a short moment
      const localName = skillToRemove;
      const timerKey = localName.toLowerCase();

      setRemovingSkillId(localName);
      if (removeSkillTimeoutsRef.current[timerKey]) {
        clearTimeout(removeSkillTimeoutsRef.current[timerKey]);
      }
      removeSkillTimeoutsRef.current[timerKey] = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          primarySkills: prev.primarySkills.filter(
            (s) => s.toLowerCase() !== localName.toLowerCase(),
          ),
        }));
        setExtractedSkills((prev) =>
          prev.map((sk) =>
            normalizeSkill(sk.name) === normalizeSkill(localName)
              ? { ...sk, isPrimary: false }
              : sk,
          ),
        );
        setRemovingSkillId(null);
        delete removeSkillTimeoutsRef.current[timerKey];
      }, 180);
      return;
    }

    setRemovingSkillId(Number(filteredSkill.id));
    try {
      await removeSkill(Number(filteredSkill.id)).unwrap();
      toast.success("Skill removed successfully!");

      setFormData((prev) => ({
        ...prev,
        primarySkills: prev.primarySkills.filter(
          (s) => s.toLowerCase() !== skillToRemove.toLowerCase(),
        ),
      }));
      setExtractedSkills((prev) =>
        prev.map((sk) =>
          normalizeSkill(sk.name) === normalizeSkill(skillToRemove)
            ? { ...sk, isPrimary: false }
            : sk,
        ),
      );
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error?.data?.message || error?.message || "Failed to remove skill";
      toast.error(errorMessage);
    } finally {
      setRemovingSkillId(null);
    }
  };

  const removeSecondarySkill = (skillToRemove: string) => {
    if (formData.primarySkills.length + formData.secondarySkills.length <= 1) {
      toast.warning("You must keep at least one skill.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      secondarySkills: prev.secondarySkills.filter(
        (s) => s.toLowerCase() !== skillToRemove.toLowerCase(),
      ),
    }));
  };

  const createLocalId = (prefix = "local") =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const handleToggleExtractedSkill = (id: string, check: boolean) => {
    const skill = extractedSkills.find((s) => s.id === id);
    if (!skill) return;

    if (check) {
      // Use formData.primarySkills.length — consistent with edit section
      if (formData.primarySkills.length >= 5) {
        toast.error(
          "You can only select up to 5 primary skills. Please uncheck one first.",
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
        return { ...prev, primarySkills: newPrimary };
      });
      setExtractedSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPrimary: true } : s)),
      );
    } else {
      if (formData.primarySkills.length <= 1) {
        toast.warning("You must have at least one primary skill overall");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        primarySkills: prev.primarySkills.filter(
          (s) => normalizeSkill(s) !== normalizeSkill(skill.name),
        ),
      }));
      setExtractedSkills((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isPrimary: false } : s)),
      );
    }
  };

  const getMergedSecondarySkills = (
    baseSecondarySkills: string[] = formData.secondarySkills,
  ) => {
    const seen = new Set(baseSecondarySkills.map((s) => normalizeSkill(s)));
    const mergedSecondarySkills = [...baseSecondarySkills];

    extractedSkills.forEach((skill) => {
      if (skill.isPrimary) return;

      const normalized = normalizeSkill(skill.name);
      const inPrimary = formData.primarySkills.some(
        (primarySkill) => normalizeSkill(primarySkill) === normalized,
      );

      if (!seen.has(normalized) && !inPrimary) {
        seen.add(normalized);
        mergedSecondarySkills.push(skill.name);
      }
    });

    return mergedSecondarySkills;
  };

  const markResumeExtractionHandled = () => {
    processedResumeDataRef.current = null;
    setShowPrimarySkillsDisplay(false);
    dispatch(clearExtractedSkills());
  };

  const handleSaveSkillsOnly = async (secondarySkillsOverride?: string[]) => {
    // Since check/uncheck/edit/delete actions already keep formData in sync,
    // we can directly save the current state from formData.
    const primarySkillsToSave = formData.primarySkills;
    const baseSecondarySkills =
      secondarySkillsOverride ?? formData.secondarySkills;

    const secondarySkillsToPersist =
      getMergedSecondarySkills(baseSecondarySkills);

    const cleanDate = (date: string | null | undefined) => {
      if (!date || date.trim() === "") return null;
      return date.trim();
    };

    const payload = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      currency: formData.currency || "",
      mobileNumber: formData.mobileNumber.replace(/[\s\-()]/g, ""),
      location: formData.location.trim(),
      country: formData.country?.trim() || null,
      city: formData.city?.trim() || null,
      primaryJobRole: formData.primaryJobRole.trim(),
      bio: formData.bio.trim(),
      primarySkills: primarySkillsToSave,
      secondarySkills: secondarySkillsToPersist,
      preferredJobLocations: formData.preferredJobLocations,
      hourlyRateMin:
        formData.hourlyRateMin === "" ? null : Number(formData.hourlyRateMin),
      hourlyRateMax:
        formData.hourlyRateMax === "" ? null : Number(formData.hourlyRateMax),
      expectedSalaryMin:
        formData.expectedSalaryMin === ""
          ? null
          : Number(formData.expectedSalaryMin),
      expectedSalaryMax:
        formData.expectedSalaryMax === ""
          ? null
          : Number(formData.expectedSalaryMax),
      certifications: formData.certifications
        .filter(
          (cert) =>
            cert.name.trim() && cert.issuedBy.trim() && cert.issueDate.trim(),
        )
        .map(({ localId, ...cert }) => ({
          ...cert,
          name: cert.name.trim(),
          issuedBy: cert.issuedBy.trim(),
          issueDate: cert.issueDate.trim(),
          credentialUrl: cert.credentialUrl.trim(),
          expiryDate: cleanDate(cert.expiryDate),
        })),
      projects: formData.projects
        .filter((project) => project.title.trim() && project.description.trim())
        .map(({ localId, ...project }) => ({
          ...project,
          title: project.title.trim(),
          description: project.description.trim(),
          projectUrl: project.projectUrl.trim(),
          techStack: Array.isArray(project.techStack)
            ? project.techStack
            : String(project.techStack ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        })),
      workExperiences: formData.workExperiences
        .filter(
          (exp) =>
            exp.companyName.trim() && exp.role.trim() && exp.startDate.trim(),
        )
        .map(({ localId, ...exp }) => ({
          ...exp,
          companyName: exp.companyName.trim(),
          role: exp.role.trim(),
          startDate: exp.startDate.trim(),
          employmentType: exp.employmentType.trim(),
          location: exp.location.trim(),
          endDate: cleanDate(exp.endDate),
          description: Array.isArray(exp.description)
            ? exp.description.join("\n")
            : String(exp.description ?? "").trim(),
        })),
    };

    try {
      await updateProfile(payload).unwrap();
      setFormData((prev) => ({
        ...prev,
        primarySkills: primarySkillsToSave, // Update formData with synced skills
        secondarySkills: secondarySkillsToPersist,
      }));
      markResumeExtractionHandled();
      toast.success("Skills updated successfully!");
      setIsEditingPrimarySkills(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update skills. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleUpdateSkillExtraction = async () => {
    // 1. Compute locally the merged secondary skills
    const newSecondary = getMergedSecondarySkills();

    // Update the local state for UI immediately
    setFormData((prev) => ({ ...prev, secondarySkills: newSecondary }));

    // 2. Save updates to the backend explicitly without full form validation
    await handleSaveSkillsOnly(newSecondary);
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

    const totalSkills =
      formData.primarySkills.length + getMergedSecondarySkills().length;
    if (totalSkills <= 1) {
      toast.warning("You must keep at least one skill.");
      return;
    }

    if (skill.isPrimary && formData.primarySkills.length <= 1) {
      toast.warning("You must have at least one primary skill overall");
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

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          id: null,
          localId: createLocalId("we"),
          companyName: "",
          role: "",
          employmentType: "",
          startDate: "",
          endDate: null,
          description: "",
          location: "",
        },
      ],
    }));
  };

  const updateWorkExperience = (index: number, field: string, value: any) => {
    // Clear field-specific validation error
    const errorKey = `workExp_${index}_${field === "companyName" ? "company" : field}`;
    const compositeKey =
      field === "startDate" || field === "endDate"
        ? `workExp_${index}_dates`
        : null;
    if (fieldErrors[errorKey] || (compositeKey && fieldErrors[compositeKey])) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        // Also clear composite date error
        if (field === "startDate" || field === "endDate") {
          delete newErrors[`workExp_${index}_dates`];
        }
        return newErrors;
      });
    }
    setFormData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const removeWorkExperiences = async (id: number | null, index?: number) => {
    // Clear any stale validation errors for this and subsequent work experiences
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors)
        .filter((key) => key.startsWith("workExp_"))
        .forEach((key) => {
          delete newErrors[key];
        });
      return newErrors;
    });

    if (id == null) {
      if (index == null) return;
      const item = formData.workExperiences[index];
      // Use stable local id when available, otherwise create one and set it on the item
      const localKey = item?.localId ? item.localId : createLocalId("we");

      if (!item?.localId) {
        setFormData((prev) => ({
          ...prev,
          workExperiences: prev.workExperiences.map((we, i) =>
            i === index ? { ...we, localId: localKey } : we,
          ),
        }));
      }

      setRemovingWorkExperienceId(localKey);
      if (removeWorkTimeoutsRef.current[localKey]) {
        clearTimeout(removeWorkTimeoutsRef.current[localKey]);
      }
      removeWorkTimeoutsRef.current[localKey] = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          workExperiences: prev.workExperiences.filter(
            (we) => we.id != null || we.localId !== localKey,
          ),
        }));
        setRemovingWorkExperienceId(null);
        delete removeWorkTimeoutsRef.current[localKey];
      }, 180);
      return;
    }

    setRemovingWorkExperienceId(Number(id));
    try {
      await removeWorkExperience(id).unwrap();
      toast.success("Work experience removed successfully!");

      setFormData((prev) => ({
        ...prev,
        workExperiences: prev.workExperiences.filter((exp) => exp.id !== id),
      }));
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to remove work experience";
      toast.error(errorMessage);
    } finally {
      setRemovingWorkExperienceId(null);
    }
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: null,
          localId: createLocalId("project"),
          title: "",
          description: "",
          techStack: [],
          projectUrl: "",
          isFeatured: false,
        },
      ],
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    const errorKeyMap: Record<string, string> = {
      title: "title",
      description: "description",
      projectUrl: "url",
      isFeatured: "featured",
    };
    const errorKey = `project_${index}_${errorKeyMap[field] ?? field}`;
    if (fieldErrors[errorKey]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj,
      ),
    }));
  };

  const removeProjects = async (id: number | null, index?: number) => {
    // Clear any stale validation errors for this and subsequent projects
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors)
        .filter((key) => key.startsWith("project_"))
        .forEach((key) => {
          delete newErrors[key];
        });
      return newErrors;
    });

    if (id == null) {
      if (index == null) return;
      const item = formData.projects[index];
      const localKey = item?.localId ? item.localId : createLocalId("project");

      if (!item?.localId) {
        setFormData((prev) => ({
          ...prev,
          projects: prev.projects.map((p, i) =>
            i === index ? { ...p, localId: localKey } : p,
          ),
        }));
      }

      setRemovingProjectId(localKey);
      if (removeProjectTimeoutsRef.current[localKey]) {
        clearTimeout(removeProjectTimeoutsRef.current[localKey]);
      }
      removeProjectTimeoutsRef.current[localKey] = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          projects: prev.projects.filter(
            (p) => p.id != null || p.localId !== localKey,
          ),
        }));
        setRemovingProjectId(null);
        delete removeProjectTimeoutsRef.current[localKey];
      }, 180);
      return;
    }

    setRemovingProjectId(Number(id));
    try {
      await removeProject(id).unwrap();
      toast.success("Project removed successfully!");

      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((proj) => proj.id !== id),
      }));
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error?.data?.message || error?.message || "Failed to remove project";
      toast.error(errorMessage);
    } finally {
      setRemovingProjectId(null);
    }
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: null,
          localId: createLocalId("cert"),
          name: "",
          issuedBy: "",
          issueDate: "",
          expiryDate: "",
          credentialUrl: "",
        },
      ],
    }));
  };

  const updateCertification = (index: number, field: string, value: any) => {
    const errorKeyMap: Record<string, string> = {
      name: "name",
      issuedBy: "issuer",
      issueDate: "issueDate",
      credentialUrl: "url",
    };
    const errorKey = `cert_${index}_${errorKeyMap[field] ?? field}`;
    const isDateField = field === "issueDate" || field === "expiryDate";
    const compositeKey = isDateField ? `cert_${index}_expiryDate` : null;
    if (fieldErrors[errorKey] || (compositeKey && fieldErrors[compositeKey])) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        if (isDateField) {
          delete newErrors[`cert_${index}_expiryDate`];
          delete newErrors[`cert_${index}_issueDate`];
        }
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const removeCertification = async (id: number | null, index?: number) => {
    // Clear any stale validation errors for this and subsequent certifications
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(newErrors)
        .filter((key) => key.startsWith("cert_"))
        .forEach((key) => {
          delete newErrors[key];
        });
      return newErrors;
    });

    if (id == null) {
      if (index == null) return;
      const item = formData.certifications[index];
      const localKey = item?.localId ? item.localId : createLocalId("cert");

      if (!item?.localId) {
        setFormData((prev) => ({
          ...prev,
          certifications: prev.certifications.map((c, i) =>
            i === index ? { ...c, localId: localKey } : c,
          ),
        }));
      }

      setRemovingCertificateId(localKey);
      if (removeCertTimeoutsRef.current[localKey]) {
        clearTimeout(removeCertTimeoutsRef.current[localKey]);
      }
      removeCertTimeoutsRef.current[localKey] = setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          certifications: prev.certifications.filter(
            (c) => c.id != null || c.localId !== localKey,
          ),
        }));
        setRemovingCertificateId(null);
        delete removeCertTimeoutsRef.current[localKey];
      }, 180);
      return;
    }

    setRemovingCertificateId(Number(id));
    try {
      await removeCertificate(id).unwrap();
      toast.success("Certificate removed successfully!");

      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((cert) => cert.id !== id),
      }));
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to remove certificate";
      toast.error(errorMessage);
    } finally {
      setRemovingCertificateId(null);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.candidateType) {
      errors.candidateType = "Contractor type is required";
    }

    if (!formData.preferredJobLocations.length) {
      errors.preferredJobLocations =
        "At least one preferred job location is required";
    }

    // Validate mobile number
    const sanitizedMobile = formData.mobileNumber.replace(/[\s\-()]/g, "");
    if (!sanitizedMobile) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\+?\d{7,15}$/.test(sanitizedMobile)) {
      errors.mobileNumber = "Please enter a valid mobile number";
    }

    // Validate basic fields
    const firstNameError = VALIDATION.name.validate(
      formData.firstName,
      "First name",
    );
    if (firstNameError) errors.firstName = firstNameError;

    const lastNameError = VALIDATION.name.validate(
      formData.lastName,
      "Last name",
    );
    if (lastNameError) errors.lastName = lastNameError;

    const emailError = VALIDATION.email.validate(formData.email);
    if (emailError) errors.email = emailError;

    const primaryJobRoleError = VALIDATION.primaryJobRole.validate(
      formData.primaryJobRole,
    );
    if (primaryJobRoleError) errors.primaryJobRole = primaryJobRoleError;

    const bioError = VALIDATION.bio.validate(formData.bio);
    if (bioError) errors.bio = bioError;

    const experienceError = VALIDATION.experience.validate(
      formData.yearsExperience,
    );
    if (experienceError) errors.yearsExperience = experienceError;

    if (
      formData.weeklyWorkingHours !== "" &&
      formData.weeklyWorkingHours != null
    ) {
      const hoursNum = Number(formData.weeklyWorkingHours);
      if (!Number.isFinite(hoursNum) || hoursNum < 0 || hoursNum > 40) {
        errors.weeklyWorkingHours = "Weekly hours must be between 0 and 40";
      }
    }

    const rateError = VALIDATION.hourlyRate.validate(
      formData.hourlyRateMin,
      formData.hourlyRateMax,
    );
    if (rateError) errors.hourlyRate = rateError;

    // Validate expected salary
    const salaryMinNum = Number(formData.expectedSalaryMin);
    const salaryMaxNum = Number(formData.expectedSalaryMax);

    if (
      formData.expectedSalaryMin === "" ||
      formData.expectedSalaryMin == null
    ) {
      errors.expectedSalaryMin = "Minimum expected salary is required";
    } else if (!Number.isFinite(salaryMinNum) || salaryMinNum < 0) {
      errors.expectedSalaryMin = "Please enter a valid minimum salary";
    }

    if (
      formData.expectedSalaryMax === "" ||
      formData.expectedSalaryMax == null
    ) {
      errors.expectedSalaryMax = "Maximum expected salary is required";
    } else if (!Number.isFinite(salaryMaxNum) || salaryMaxNum < 0) {
      errors.expectedSalaryMax = "Please enter a valid maximum salary";
    }

    if (
      !errors.expectedSalaryMin &&
      !errors.expectedSalaryMax &&
      salaryMinNum > salaryMaxNum
    ) {
      errors.expectedSalaryMax =
        "Maximum salary cannot be less than minimum salary";
    }

    const skillsError = VALIDATION.skill.validate(formData.primarySkills);
    if (skillsError) errors.primarySkills = skillsError;

    // Validate work experiences (if a card exists, required fields must be filled)
    formData.workExperiences.forEach((exp, index) => {
      const companyName = exp.companyName.trim();
      const role = exp.role.trim();
      const startDate = exp.startDate.trim();
      const endDate = (exp.endDate ?? "").trim();

      if (!companyName)
        errors[`workExp_${index}_company`] = "Company name is required";
      if (!role) errors[`workExp_${index}_role`] = "Role is required";
      if (!startDate)
        errors[`workExp_${index}_startDate`] = "Start date is required";
      else {
        const dateError = VALIDATION.date.validate(
          startDate,
          endDate || null,
          "work experience",
        );
        if (dateError) errors[`workExp_${index}_dates`] = dateError;
      }
    });

    // Validate projects (every added project card requires title & description)
    formData.projects.forEach((project, index) => {
      const title = project.title.trim();
      const description = project.description.trim();
      const projectUrl = project.projectUrl.trim();

      if (!title)
        errors[`project_${index}_title`] = "Project title is required";
      if (!description)
        errors[`project_${index}_description`] =
          "Project description is required";

      if (projectUrl) {
        const urlError = VALIDATION.url.validate(projectUrl);
        if (urlError) errors[`project_${index}_url`] = urlError;
      }
    });

    // Validate certifications (all added cards require these fields)
    formData.certifications.forEach((cert, index) => {
      const name = cert.name.trim();
      const issuedBy = cert.issuedBy.trim();
      const issueDate = cert.issueDate.trim();
      const expiryDate = (cert.expiryDate ?? "").trim();
      const credentialUrl = cert.credentialUrl.trim();

      if (!name)
        errors[`cert_${index}_name`] = "Certification name is required";
      if (!issuedBy) errors[`cert_${index}_issuer`] = "Issuer is required";
      if (!issueDate)
        errors[`cert_${index}_issueDate`] = "Issue date is required";
      else {
        const dateError = VALIDATION.certificationDate.validate(
          issueDate,
          expiryDate || null,
        );
        if (dateError) {
          errors[`cert_${index}_${dateError.field}`] = dateError.message;
        }
      }
      if (credentialUrl) {
        const urlError = VALIDATION.url.validate(credentialUrl);
        if (urlError) errors[`cert_${index}_url`] = urlError;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);

      // Show the first error in a toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);

      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const cleanDate = (date: string | null | undefined) => {
      if (!date || date.trim() === "") return null;
      return date.trim();
    };

    const payload = {
      ...formData,
      // Sanitize data before sending
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      currency: formData.currency || "",
      mobileNumber: formData.mobileNumber.replace(/[\s\-()]/g, ""),
      location: formData.location.trim(),
      country: formData.country?.trim() || null,
      city: formData.city?.trim() || null,
      primaryJobRole: formData.primaryJobRole.trim(),
      bio: formData.bio.trim(),
      primarySkills: formData.primarySkills,
      secondarySkills: (() => {
        const seen = new Set<string>();
        // Ensure we preserve existing secondary skills fetched from the profile (they are already in formData.secondarySkills)
        // AND add in any unselected skills from the extraction process.
        return [
          ...formData.secondarySkills,
          ...extractedSkills.filter((s) => !s.isPrimary).map((s) => s.name),
        ].filter((sec) => {
          const key = sec.toLowerCase().trim();
          if (seen.has(key)) return false;
          seen.add(key);
          // Never include a secondary skill if it has been marked as a primary skill
          return !formData.primarySkills.some(
            (prim) => prim.toLowerCase().trim() === key,
          );
        });
      })(),
      preferredJobLocations: formData.preferredJobLocations,
      hourlyRateMin:
        formData.hourlyRateMin === "" ? null : Number(formData.hourlyRateMin),
      hourlyRateMax:
        formData.hourlyRateMax === "" ? null : Number(formData.hourlyRateMax),
      expectedSalaryMin:
        formData.expectedSalaryMin === ""
          ? null
          : Number(formData.expectedSalaryMin),
      expectedSalaryMax:
        formData.expectedSalaryMax === ""
          ? null
          : Number(formData.expectedSalaryMax),
      weeklyWorkingHours:
        formData.weeklyWorkingHours === ""
          ? null
          : Number(formData.weeklyWorkingHours),
      certifications: formData.certifications
        .filter(
          (cert) =>
            cert.name.trim() && cert.issuedBy.trim() && cert.issueDate.trim(),
        ) // Only include completed certifications
        .map(({ localId, ...cert }) => ({
          ...cert,
          name: cert.name.trim(),
          issuedBy: cert.issuedBy.trim(),
          issueDate: cert.issueDate.trim(),
          credentialUrl: cert.credentialUrl.trim(),
          expiryDate: cleanDate(cert.expiryDate),
        })),
      projects: formData.projects
        .filter((project) => project.title.trim() && project.description.trim()) // Only include completed projects
        .map(({ localId, ...project }) => ({
          ...project,
          title: project.title.trim(),
          description: project.description.trim(),
          projectUrl: project.projectUrl.trim(),
          techStack: Array.isArray(project.techStack)
            ? project.techStack
            : String(project.techStack ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
        })),
      workExperiences: formData.workExperiences
        .filter(
          (exp) =>
            exp.companyName.trim() && exp.role.trim() && exp.startDate.trim(),
        ) // Only include completed experiences
        .map(({ localId, ...exp }) => ({
          ...exp,
          companyName: exp.companyName.trim(),
          role: exp.role.trim(),
          startDate: exp.startDate.trim(),
          employmentType: exp.employmentType.trim(),
          location: exp.location.trim(),
          endDate: cleanDate(exp.endDate),
          description: Array.isArray(exp.description)
            ? exp.description.join("\n")
            : String(exp.description ?? "").trim(),
        })),
    };
    try {
      await updateProfile(payload).unwrap();
      preferredLocationsDirtyRef.current = false;
      toast.success("Profile updated successfully!");
      setFieldErrors({}); // Clear all errors on success
      setIsEditingPrimarySkills(false);
      setShowPrimarySkillsDisplay(false);
      navigation("/contractor/dashboard");
    } catch (err: unknown) {
      const error = err as {
        data?: { message?: string };
        status?: number;
        message?: string;
      };
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 2 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    const lowerFileName = file.name.toLowerCase();
    const hasAllowedExtension =
      lowerFileName.endsWith(".jpg") ||
      lowerFileName.endsWith(".jpeg") ||
      lowerFileName.endsWith(".png") ||
      lowerFileName.endsWith(".webp");
    const hasAllowedMime = ALLOWED_TYPES.includes(file.type);

    // Trust MIME type when available; fall back to extension only when MIME is empty
    const isValidFile =
      hasAllowedMime || (file.type === "" && hasAllowedExtension);
    if (!isValidFile) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_SIZE) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.error("Image must be 2 MB or smaller.");
      return;
    }

    try {
      const imageFormData = new FormData();
      imageFormData.append("image", file);
      await uploadProfileImage(imageFormData).unwrap();
      toast.success("Image uploaded successfully.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const message =
        typeof error === "object" && error != null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || "Failed to upload image.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    toast("Are you sure you want to delete profile image?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await removeProfileImage(data.id).unwrap();
            await refetchCandidateProfileImage();
            toast.success("Image deleted successfully.");
          } catch (error) {
            const message =
              typeof error === "object" && error != null && "data" in error
                ? (error as { data?: { message?: string } }).data?.message
                : undefined;
            toast.error(message || "Failed to delete image.");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => { } },
    });
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center gap-4 h-full">
        <SpinnerLoader className="w-10 h-10" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-6 sm:px-9 md:px-8 py-6 sm:py-10 font-inter">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Update Profile</h2>
        <p className="text-muted-foreground my-2">
          Keep your profile up to date to get the best matches.
        </p>
      </div>
      <div className="space-y-6 sm:space-y-8">
        {/* Profile Image Section */}
        <DashCard>
          <SectionTitle
            icon={<Camera className="w-6 h-6" />}
            title="Profile Image"
          />
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full mt-2">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shadow-lg ring-4 ring-white/90 dark:ring-slate-700/90 relative">
              {isLoadingImage || isRemovingImage || isProfileImageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full">
                  <SpinnerLoader />
                </div>
              ) : null}
              <AvatarImage
                className="object-cover"
                src={profileImage ?? undefined}
              />
              <AvatarFallback className="bg-gray-100 dark:bg-slate-800">
                <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoadingImage || isRemovingImage}
                  className="bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white px-6 rounded-md"
                >
                  {isLoadingImage ? (
                    <SpinnerLoader />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Upload Image
                </Button>
                {profileImage && (
                  <Button
                    variant="outline"
                    onClick={handleRemoveImage}
                    disabled={isLoadingImage || isRemovingImage}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-900/20 rounded-md"
                  >
                    {isRemovingImage ? (
                      <SpinnerLoader />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    Delete
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Allowed formats: JPG, PNG, WebP. Max size: 2MB.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
        </DashCard>

        {/* Resume Section */}
        <DashCard>
          <SectionTitle
            icon={<FileText className="w-6 h-6" />}
            title="Resume"
          />
          <ResumeManager resumes={data?.candidateProfile?.resumes ?? []} />
        </DashCard>

        {/* Primary Skills Section - Hidden when editing */}
        {showPrimarySkillsDisplay &&
          extractedSkills.length > 0 &&
          !isEditingPrimarySkills && (
            <DashCard>
              <SectionTitle
                icon={<CheckSquare className="w-5 h-5" />}
                title="Primary Skills"
              />
              <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                Select up to 5 primary skills from your extracted resume.
                Unchecked skills are kept as secondary skills. <br />
              </p>
              {extractedSkills.filter((s) => s.isPrimary).length > 0 && (
                <p className="text-xs font-medium text-gray-400 mt-4 my-3">
                  {extractedSkills.filter((s) => s.isPrimary).length} / 5
                  primary skills selected from resume
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extractedSkills.map((skill) => {
                  const isChecked = skill.isPrimary;
                  return (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl dark:bg-slate-900 dark:border-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          handleToggleExtractedSkill(skill.id, e.target.checked)
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
                            className="flex-1 px-2 py-1 text-sm bg-white border border-gray-200 rounded dark:bg-slate-800 dark:border-slate-600 outline-none focus:border-[#4DD9E8]"
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
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                              onClick={() => deleteExtractedSkill(skill.id)}
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
              <div className="flex items-center justify-end mt-4">
                <button
                  type="button"
                  onClick={handleUpdateSkillExtraction}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] dark:bg-[#4DD9E8]/10 hover:bg-[#1a1a2e]/90 dark:hover:bg-[#4DD9E8]/20 text-white dark:text-[#4DD9E8] font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm"
                >
                  {isUpdating ? (
                    <>
                      <SpinnerLoader className="w-4 h-4" />
                      Saving...
                    </>
                  ) : (
                    "Update Skills"
                  )}
                </button>
              </div>
            </DashCard>
          )}

        {/* Basic Information */}

        <Suspense fallback={<SpinnerLoader />}>
          <BasicInfoSection
            formData={formData}
            fieldErrors={fieldErrors}
            handleInputChange={handleInputChange}
            locationInput={locationInput}
            handleLocationInputChange={handleLocationInputChange}
            addLocation={addLocation}
            removeLocation={removeLocation}
            candidateTypeOptions={candidateTypeOptions}
            availableToJoinOptions={availableToJoinOptions}
            englishProficiencyOptions={englishProficiencyOptions}
          />
          <SkillsSection
            formData={formData}
            fieldErrors={fieldErrors}
            extractedSkills={extractedSkills}
            showPrimarySkillsDisplay={showPrimarySkillsDisplay}
            isEditingPrimarySkills={isEditingPrimarySkills}
            setIsEditingPrimarySkills={setIsEditingPrimarySkills}
            editingExtractedSkillId={editingExtractedSkillId}
            editingExtractedSkillName={editingExtractedSkillName}
            setEditingExtractedSkillName={setEditingExtractedSkillName}
            saveExtractedSkillEdit={saveExtractedSkillEdit}
            setEditingExtractedSkillId={setEditingExtractedSkillId}
            deleteExtractedSkill={deleteExtractedSkill}
            handleToggleExtractedSkill={handleToggleExtractedSkill}
            handleUpdateSkillExtraction={handleUpdateSkillExtraction}
            isUpdating={isUpdating}
            removeSecondarySkill={removeSecondarySkill}
            setFormData={setFormData}
            createLocalId={createLocalId}
            setExtractedSkills={setExtractedSkills}
            removeSkills={removeSkills}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSecondarySkill={addSecondarySkill}
            normalizeSkill={normalizeSkill}
            data={data}
            handleSaveSkillsOnly={handleSaveSkillsOnly}
          />
          <WorkExperienceSection
            formData={formData}
            fieldErrors={fieldErrors}
            addWorkExperience={addWorkExperience}
            updateWorkExperience={updateWorkExperience}
            removeWorkExperiences={removeWorkExperiences}
            removingWorkExperienceId={removingWorkExperienceId}
            employmentTypeOptions={employmentTypeOptions}
          />
          <ProjectsSection
            formData={formData}
            fieldErrors={fieldErrors}
            addProject={addProject}
            updateProject={updateProject}
            removeProjects={removeProjects}
            removingProjectId={removingProjectId}
          />
          <CertificationsSection
            formData={formData}
            fieldErrors={fieldErrors}
            addCertification={addCertification}
            updateCertification={updateCertification}
            removeCertification={removeCertification}
            removingCertificateId={removingCertificateId}
          />
        </Suspense>


        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row flex-col gap-3 sm:gap-4 pt-6 pb-8 border-t border-gray-100 dark:border-slate-800/50 mt-8">
          <button
            type="button"
            style={{
              background: "linear-gradient(135deg, #4DD9E8, #0ea5e9)",
              boxShadow: "0 4px 20px rgba(77,217,232,0.35)",
            }}
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <div className="flex items-center justify-center gap-2">
                <SpinnerLoader />
                <span>Updating...</span>
              </div>
            ) : (
              <span className="hidden sm:inline">Update Profile</span>
            )}
            {!isUpdating && <span className="sm:hidden">Update</span>}
          </button>

          <button
            onClick={() => {
              // Clear any pending removal timeouts
              teardownPendingRemovals();
              setFormData(initialFormData);
              setFieldErrors({}); // Clear errors on cancel
              setLocationInput("");
              setIsEditingPrimarySkills(false);
              preferredLocationsDirtyRef.current = false;
              toast.info("Changes discarded");
            }}
            type="button"
            className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-slate-800 hover:bg-gray-50 hover:text-red-600 ring-1 ring-inset ring-gray-200 dark:ring-slate-700 rounded-xl transition-all font-medium text-gray-700 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-slate-800/80 shadow-sm"
          >
            Cancel
          </button>
        </div>

        {updateError && (
          <div className="mt-4 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
            <p className="text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>Failed to update profile. Please try again.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfileUpdate;

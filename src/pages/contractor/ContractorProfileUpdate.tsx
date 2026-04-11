import {
  ChangeEvent,
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
  Briefcase,
  Award,
  FolderGit2,
  AlertCircle,
  Camera,
  User,
  FileText,
  Code,
  AlignLeft,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { skipToken } from "@reduxjs/toolkit/query";
import ResumeManager, { type Resume } from "../ResumeManager";
import { currencySymbols, getCurrencySymbol } from "@/lib/currency";
import { useNavigate } from "react-router-dom";

// ==================== TYPES ====================
type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type Skill = {
  id: number;
  name: string;
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
  primarySkills: string[];
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
      primarySkills?: Skill[];
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
const DashCard = ({ children, className = "", noPadding = false }: { children: React.ReactNode; className?: string; noPadding?: boolean }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 ${noPadding ? "" : "p-4 sm:p-6 md:p-8"} ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ icon, title, action }: { icon?: React.ReactNode, title: string, action?: React.ReactNode }) => (
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
  const { data: response, isLoading: isLoadingProfile } = useGetProfileQuery(undefined, { skip: !token });
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

  useEffect(() => {
    preferredLocationsDirtyRef.current = false;
  }, [data?.id]);

  const normalizeSkill = (value: string) => value.toLowerCase().trim();

  const skills = useMemo(() => {
    // Get resume skills (priority)
    const resumeSkills = Array.isArray(resumeData)
      ? resumeData.filter(
        (s): s is string => typeof s === "string" && s.trim() !== "",
      )
      : [];

    // Get profile skills
    const profileSkills =
      data?.candidateProfile?.primarySkills
        ?.map((skill) => (typeof skill === "string" ? skill : skill.name))
        .filter((s): s is string => typeof s === "string" && s.trim() !== "") ||
      [];

    // Combine with resume skills first, then profile skills
    const combined = [...resumeSkills, ...profileSkills];

    // Remove duplicates (case-insensitive comparison)
    const unique = combined.filter(
      (skill, index, self) =>
        index ===
        self.findIndex(
          (s) => s.toLowerCase().trim() === skill.toLowerCase().trim(),
        ),
    );

    return unique;
  }, [data, resumeData]);

  const workExperiences = useMemo(
    () =>
      data?.candidateProfile?.workExperiences?.map(
        ({
          id,
          localId,
          companyName,
          role,
          employmentType,
          startDate,
          endDate,
          description,
          location,
        }) => ({
          id,
          localId,
          companyName,
          role,
          employmentType,
          startDate,
          endDate,
          description,
          location,
        }),
      ) || [],
    [data],
  );

  const projects = useMemo(
    () =>
      data?.candidateProfile?.projects?.map(
        ({
          id,
          localId,
          title,
          description,
          techStack,
          projectUrl,
          isFeatured,
        }) => ({
          id,
          localId,
          title,
          description,
          techStack,
          projectUrl,
          isFeatured,
        }),
      ) || [],
    [data],
  );

  const certification = useMemo(
    () =>
      data?.candidateProfile?.certifications?.map(
        ({
          id,
          localId,
          name,
          issueDate,
          issuedBy,
          expiryDate,
          credentialUrl,
        }) => ({
          id,
          localId,
          name,
          issueDate,
          issuedBy,
          expiryDate,
          credentialUrl,
        }),
      ) || [],
    [data],
  );

  const toNumberOrEmpty = (value: number | string | null | undefined) => {
    if (value === "" || value == null) return "";
    const n = Number(value);
    return Number.isFinite(n) ? n : "";
  };

  const handleForm = useCallback((): FormDataState => {
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
        primarySkills: [],
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
    return {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      mobileNumber: data?.candidateProfile.mobileNumber || "",
      location: data?.candidateProfile.location || "",
      country: data?.candidateProfile.country ?? null,
      city: data?.candidateProfile.city ?? null,
      candidateType: data?.candidateProfile.candidateType || "",
      bio: data?.candidateProfile.bio || "",
      yearsExperience: data?.candidateProfile.yearsExperience ?? "",
      primarySkills: skills || [],
      primaryJobRole: data?.candidateProfile.primaryJobRole || "",
      availableToJoin: data?.candidateProfile.availableToJoin || "",
      englishProficiency: data?.candidateProfile.englishProficiency ?? "",
      preferredJobLocations: data?.candidateProfile.preferredJobLocations ?? [],
      hourlyRateMin: toNumberOrEmpty(data?.candidateProfile.hourlyRateMin),
      hourlyRateMax: toNumberOrEmpty(data?.candidateProfile.hourlyRateMax),
      expectedSalaryMin: toNumberOrEmpty(
        data?.candidateProfile.expectedSalaryMin,
      ),
      expectedSalaryMax: toNumberOrEmpty(
        data?.candidateProfile.expectedSalaryMax,
      ),
      currency: (() => {
        const raw = (data?.candidateProfile as { currency?: string })?.currency;
        return raw && currencySymbols[raw] ? raw : "";
      })(),
      workExperiences: workExperiences || [],
      projects: projects || [],
      certifications: certification || [],
    };
  }, [data, skills, workExperiences, projects, certification]);

  const [formData, setFormData] = useState<FormDataState>(handleForm);

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
      setFormData(handleForm());
    }
  }, [data, handleForm, teardownPendingRemovals]);

  useEffect(() => {
    if (!data) return;

    // Compute the authoritative primary skills list from parsed resumes and profile
    // This is idempotent - it replaces formData.primarySkills with the computed set
    // rather than appending, so deleted/removed skills are properly cleaned up
    setFormData((prev) => {
      const normalizedSkills = skills
        .map((s) => normalizeSkill(s))
        .filter(Boolean);
      const normalizedPrev = prev.primarySkills.map((s) => normalizeSkill(s));

      // Check if skills have actually changed (for performance optimization)
      const skillsChanged =
        normalizedSkills.length !== normalizedPrev.length ||
        !normalizedSkills.every((s) => normalizedPrev.includes(s));

      if (!skillsChanged) return prev;

      return {
        ...prev,
        primarySkills: skills,
      };
    });
  }, [data, skills]);

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
    preferredLocationsDirtyRef.current = true;
    setLocationInput("");
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

  const addSkill = () => {
    const name = skillInput.trim();

    if (!name) {
      toast.error("Please enter a skill name");
      return;
    }

    if (name.length > 50) {
      toast.error("Skill name must be less than 50 characters");
      return;
    }

    if (formData.primarySkills.length >= 50) {
      toast.error("You can add a maximum of 50 skills");
      return;
    }

    if (
      formData.primarySkills.some(
        (skill) => skill.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error("This skill has already been added");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      primarySkills: [...prevData.primarySkills, name],
    }));
    setSkillInput("");

    // Clear skills error if it exists
    if (fieldErrors.primarySkills) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.primarySkills;
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
    } catch (err) {
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage =
        error?.data?.message || error?.message || "Failed to remove skill";
      toast.error(errorMessage);
    } finally {
      setRemovingSkillId(null);
    }
  };

  const createLocalId = (prefix = "local") =>
    `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
    toast("Are you sure you want to remove profile image?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await removeProfileImage(data.id).unwrap();
            await refetchCandidateProfileImage();
            toast.success("Image removed successfully.");
          } catch (error) {
            const message =
              typeof error === "object" && error != null && "data" in error
                ? (error as { data?: { message?: string } }).data?.message
                : undefined;
            toast.error(message || "Failed to remove image.");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => { } },
    });
  };

  return (
    <div className="w-full mx-auto sm:px-6 md:px-2 py-4 sm:py-4 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500 font-inter">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Update Profile
        </h2>
        <p className="text-muted-foreground my-2">Keep your profile up to date to get the best matches.</p>
      </div>
      <div className="space-y-6 sm:space-y-8">
        {/* Profile Image Section */}
        <DashCard>
          <SectionTitle icon={<Camera className="w-6 h-6" />} title="Profile Image" />
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
          <SectionTitle icon={<FileText className="w-6 h-6" />} title="Resume" />
          <ResumeManager
            resumes={
              data && data.candidateProfile.resumes
                ? data.candidateProfile.resumes
                : []
            }
          />
        </DashCard>

        {/* Basic Information */}
        <DashCard>
          <SectionTitle icon={<User className="w-5 h-5" />} title="Basic Information" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                First Name <span className="text-rose-500">*</span>
              </Label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                maxLength={50}
                required
                placeholder="Enter your first name"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${fieldErrors.firstName
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.firstName} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Last Name <span className="text-rose-500">*</span>
              </Label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                maxLength={50}
                required
                placeholder="Enter your last name"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${fieldErrors.lastName
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.lastName} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Email <span className="text-rose-500">*</span>
              </Label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={254}
                required
                placeholder="Enter your email address"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${fieldErrors.email
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.email} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Primary Job Role
              </Label>
              <input
                type="text"
                name="primaryJobRole"
                value={formData.primaryJobRole}
                onChange={handleInputChange}
                maxLength={100}
                placeholder="e.g., Senior Full Stack Developer"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${fieldErrors.primaryJobRole
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.primaryJobRole} />
            </div>

            <div className="sm:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Mobile Number <span className="text-rose-500">*</span>
              </Label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                maxLength={20}
                placeholder="Enter your mobile number"
                className={`w-full md:w-1/2 px-4 py-2.5 bg-gray-50 border-0 ring-1 outline-none ring-inset ${fieldErrors.mobileNumber
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.mobileNumber} />
            </div>
          </div>
        </DashCard>

        {/* Professional Details */}
        <DashCard>
          <SectionTitle icon={<Briefcase className="w-5 h-5" />} title="Professional Details" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Location
              </Label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, London"
                className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Contractor Type <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={formData.candidateType}
                onValueChange={(val) => handleInputChange({ target: { name: "candidateType", value: val } } as any)}
              >
                <SelectTrigger
                  className={`w-full px-4 py-3 bg-gray-50 border-0 ring-1 outline-none ring-inset ${fieldErrors.candidateType
                    ? "ring-rose-500 dark:ring-rose-500 focus:border-rose-500"
                    : "ring-gray-200 focus:border-[#0ea5e9] dark:ring-slate-700"
                    } focus:ring-0 focus:ring-offset-0 dark:bg-slate-900 rounded-xl capitalize shadow-none`}
                >
                  <SelectValue placeholder="Select contractor type" />
                </SelectTrigger>
                <SelectContent>
                  {candidateTypeOptions.map((option) => (
                    <SelectItem key={option} value={option} className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage error={fieldErrors.candidateType} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Country
              </Label>
              <input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleInputChange}
                placeholder="e.g., United States, India, UK"
                maxLength={100}
                className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                City
              </Label>
              <input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                placeholder="e.g., New York, Mumbai, London"
                maxLength={100}
                className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Available To Join
              </Label>
              <Select
                value={formData.availableToJoin}
                onValueChange={(val) => handleInputChange({ target: { name: "availableToJoin", value: val } } as any)}
              >
                <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl capitalize shadow-none">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availableToJoinOptions.map((option) => (
                    <SelectItem key={option} value={option} className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                English Proficiency
              </Label>
              <Select
                value={formData.englishProficiency}
                onValueChange={(val) => handleInputChange({ target: { name: "englishProficiency", value: val } } as any)}
              >
                <SelectTrigger className="w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl capitalize shadow-none">
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {englishProficiencyOptions.map((option) => (
                    <SelectItem key={option} value={option} className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Years of Experience
              </Label>
              <input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                min="0"
                max="70"
                className={`w-full px-4 py-2.5 bg-gray-50 border-0 outline-none ring-1 ring-inset ${fieldErrors.yearsExperience
                  ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                  : "ring-gray-200 focus:ring-[#4DD9E8] dark:ring-slate-700"
                  } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
              />
              <ErrorMessage error={fieldErrors.yearsExperience} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Preferred Job Locations
              </Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLocation();
                    }
                  }}
                  placeholder="e.g., New York"
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={addLocation}
                  variant="outline"
                  className="shrink-0 h-[44px] w-[44px] rounded-xl border-gray-200 bg-[#4DD9E8] text-white hover:bg-[#4DD9E8]/90"
                  aria-label="Add preferred job location"
                  title="Add preferred job location"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.preferredJobLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.preferredJobLocations.map((location, index) => (
                    <div
                      key={`${location}-${index}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#4DD9E8]/10 text-[#288e99] rounded-full text-sm font-medium"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="hover:text-red-500 transition-colors bg-white/50 rounded-full p-0.5 min-w-0 min-h-0"
                        aria-label={`Remove ${location}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(val) => handleInputChange({ target: { name: "currency", value: val } } as any)}
              >
                <SelectTrigger className="w-full md:w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:bg-slate-900 dark:ring-slate-700 rounded-xl shadow-none">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(currencySymbols).map((curr) => (
                    <SelectItem key={curr} value={curr} className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Expected Salary (Min){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="expectedSalaryMin"
                  value={formData.expectedSalaryMin}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter your expected salary (min)"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${fieldErrors.expectedSalaryMin
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                    } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
              <ErrorMessage error={fieldErrors.expectedSalaryMin} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Expected Salary (Max){" "}
                <span className="text-rose-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="expectedSalaryMax"
                  value={formData.expectedSalaryMax}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Enter your expected salary (max)"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 outline-none ring-1 ring-inset ${fieldErrors.expectedSalaryMax
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                    } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
              <ErrorMessage error={fieldErrors.expectedSalaryMax} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Hourly Rate (Min)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="hourlyRateMin"
                  value={formData.hourlyRateMin}
                  onChange={handleInputChange}
                  placeholder="Enter your hourly rate (min)"
                  min="0"
                  max="10000"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${fieldErrors.hourlyRate
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                    } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-gray-300">
                Hourly Rate (Max)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  name="hourlyRateMax"
                  value={formData.hourlyRateMax}
                  onChange={handleInputChange}
                  min="0"
                  max="10000"
                  placeholder="Enter your hourly rate (max)"
                  className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${fieldErrors.hourlyRate
                    ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                    : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                    } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
                />
              </div>
            </div>
            {fieldErrors.hourlyRate && <div className="sm:col-span-2"><ErrorMessage error={fieldErrors.hourlyRate} /></div>}
          </div>
        </DashCard>

        {/* Short Bio */}
        <DashCard>
          <SectionTitle icon={<AlignLeft className="w-5 h-5" />} title="Short Bio" />
          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={1000}
              rows={5}
              className={`w-full px-4 py-3 bg-gray-50 border-0 ring-1 ring-inset ${fieldErrors.bio
                ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl text-base leading-relaxed resize-y`}
              placeholder="Tell us about yourself, your background, and what you're looking for..."
            />
            <div className="flex justify-between items-center mt-2.5">
              <ErrorMessage error={fieldErrors.bio} />
              <span className="text-xs font-medium text-gray-400">
                {formData.bio.length} / 1000
              </span>
            </div>
          </div>
        </DashCard>


        <DashCard>
          <SectionTitle icon={<Code className="w-5 h-5" />} title="Skills & Tech" />
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              maxLength={50}
              placeholder="Add a skill (e.g., TypeScript)"
              className={`flex-1 px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ${fieldErrors.primarySkills
                ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                } focus:ring-2 focus:ring-inset dark:bg-slate-900 rounded-xl`}
            />
            <Button
              type="button"
              onClick={addSkill}
              className="px-5 py-2.5 bg-[#4DD9E8] text-white rounded-xl hover:bg-[#4DD9E8]/90 transition shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <ErrorMessage error={fieldErrors.primarySkills} />

          <div className="flex flex-wrap gap-2.5 mt-4">
            {formData.primarySkills.map((name, index) => {
              const skillObj = data?.candidateProfile?.primarySkills?.find(
                (s) =>
                  typeof s === "string"
                    ? false
                    : s.name.toLowerCase() === name.toLowerCase(),
              );
              const skillId = skillObj?.id ?? null;

              return (
                <div
                  key={`${skillId ?? name.toLowerCase()}-${index}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4DD9E8]/10 text-[#288e99] rounded-xl text-sm font-medium"
                >
                  {name}
                  {(() => {
                    const isRemoving = removingSkillId === (skillId ?? name);
                    return isRemoving ? (
                      <div className="ml-2 flex items-center justify-center">
                        <SpinnerLoader className="text-red-500 w-3 h-3" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeSkills(name)}
                        className="hover:text-red-500 transition-colors bg-white/50 dark:bg-black/20 rounded-full p-0.5 min-w-0 min-h-0"
                        aria-label={`Remove ${name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    );
                  })()}
                </div>
              );
            })}
            {formData.primarySkills.length === 0 && (
              <p className="text-sm text-gray-400 italic">
                No skills added yet. Add at least one skill.
              </p>
            )}
          </div>
          {formData.primarySkills.length > 0 && (
            <p className="text-xs font-medium text-gray-400 mt-3">
              {formData.primarySkills.length} / 50 skills added
            </p>
          )}
        </DashCard>

        {/* Work Experience */}
        <DashCard>
          <SectionTitle
            icon={<Briefcase className="w-5 h-5" />}
            title="Work Experience"
            action={
              <Button
                type="button"
                onClick={addWorkExperience}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-[10px] sm:text-sm shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </Button>
            }
          />

          <div className="space-y-4">
            {formData.workExperiences.map((exp, index) => (
              <div
                key={exp.localId ?? exp.id ?? index}
                className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-xl space-y-4 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:border-gray-200 dark:hover:border-slate-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Experience #{index + 1}
                  </h3>
                  {(() => {
                    const localKey = exp?.localId ?? `local-we-${index}`;
                    const isRemoving =
                      exp.id != null
                        ? removingWorkExperienceId === exp.id
                        : removingWorkExperienceId === localKey;
                    return isRemoving ? (
                      <div className="flex items-center justify-center p-2">
                        <SpinnerLoader className="text-red-500 w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeWorkExperiences(exp.id, index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove work experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={exp.companyName}
                      onChange={(e) =>
                        updateWorkExperience(index, "companyName", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`workExp_${index}_company`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage error={fieldErrors[`workExp_${index}_company`]} />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Role/Title *"
                      value={exp.role}
                      onChange={(e) =>
                        updateWorkExperience(index, "role", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`workExp_${index}_role`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage error={fieldErrors[`workExp_${index}_role`]} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    value={exp.employmentType}
                    onValueChange={(val) =>
                      updateWorkExperience(index, "employmentType", val)
                    }
                  >
                    <SelectTrigger className="px-4 py-3 bg-white dark:bg-slate-900 border-0 w-full ring-1 ring-inset ring-gray-200 focus:ring-0 focus:border-[#0ea5e9] focus:ring-offset-0 outline-none dark:ring-slate-700 rounded-xl shadow-none">
                      <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypeOptions.map((option) => (
                        <SelectItem key={option} value={option} className="focus:bg-[#f0fdfa] focus:text-[#0ea5e9] cursor-pointer font-semibold text-slate-600">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      updateWorkExperience(index, "location", e.target.value)
                    }
                    className="px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      Start Date *
                    </Label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateWorkExperience(index, "startDate", e.target.value)
                      }
                      className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`workExp_${index}_startDate`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl text-gray-700 dark:text-white`}
                    />
                    <ErrorMessage
                      error={fieldErrors[`workExp_${index}_startDate`]}
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      End Date (Leave empty if current)
                    </Label>
                    <input
                      type="date"
                      value={exp.endDate ?? ""}
                      onChange={(e) =>
                        updateWorkExperience(
                          index,
                          "endDate",
                          e.target.value === "" ? null : e.target.value,
                        )
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl text-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <ErrorMessage error={fieldErrors[`workExp_${index}_dates`]} />

                <textarea
                  placeholder="Description of your role and achievements..."
                  value={
                    Array.isArray(exp.description)
                      ? exp.description.join("\n")
                      : exp.description
                  }
                  onChange={(e) =>
                    updateWorkExperience(index, "description", e.target.value)
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl resize-y"
                />
              </div>
            ))}

            {formData.workExperiences.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No work experience added yet. Click "Add Experience" to get started.
              </p>
            )}
          </div>
        </DashCard>

        {/* Projects */}
        <DashCard>
          <SectionTitle
            icon={<FolderGit2 className="w-5 h-5" />}
            title="Projects"
            action={
              <Button
                type="button"
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-[10px] sm:text-sm shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            }
          />

          <div className="space-y-4">
            {formData.projects.map((project, index) => (
              <div
                key={project.localId ?? project.id ?? index}
                className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-xl space-y-4 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:border-gray-200 dark:hover:border-slate-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Project #{index + 1}
                  </h3>
                  {(() => {
                    const localKey = project?.localId ?? `local-project-${index}`;
                    const isRemoving =
                      project.id != null
                        ? removingProjectId === project.id
                        : removingProjectId === localKey;
                    return isRemoving ? (
                      <div className="flex items-center justify-center p-2">
                        <SpinnerLoader className="text-red-500 w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeProjects(project.id, index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Project Title *"
                    value={project.title}
                    onChange={(e) => updateProject(index, "title", e.target.value)}
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`project_${index}_title`]
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl`}
                  />
                  <ErrorMessage error={fieldErrors[`project_${index}_title`]} />
                </div>

                <div>
                  <textarea
                    placeholder="Project Description *"
                    value={project.description}
                    onChange={(e) =>
                      updateProject(index, "description", e.target.value)
                    }
                    rows={3}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`project_${index}_description`]
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl resize-y`}
                  />
                  <ErrorMessage
                    error={fieldErrors[`project_${index}_description`]}
                  />
                </div>

                <input
                  type="text"
                  placeholder="Tech Stack (comma separated, e.g., Node.js, PostgreSQL)"
                  value={
                    Array.isArray(project.techStack)
                      ? project.techStack.join(", ")
                      : (project.techStack ?? "")
                  }
                  onChange={(e) =>
                    updateProject(index, "techStack", e.target.value)
                  }
                  onBlur={(e) =>
                    updateProject(
                      index,
                      "techStack",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none dark:ring-slate-700 rounded-xl"
                />

                <div>
                  <input
                    type="url"
                    placeholder="Project URL (e.g., https://github.com/username/project)"
                    value={project.projectUrl}
                    onChange={(e) =>
                      updateProject(index, "projectUrl", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`project_${index}_url`]
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl`}
                  />
                  <ErrorMessage error={fieldErrors[`project_${index}_url`]} />
                </div>

                <Label className="flex items-center gap-3 dark:text-gray-300 w-max cursor-pointer">
                  <input
                    type="checkbox"
                    checked={project.isFeatured}
                    onChange={(e) =>
                      updateProject(index, "isFeatured", e.target.checked)
                    }
                    className="min-h-0 min-w-0 w-5 h-5 rounded border-gray-300 text-primary focus:ring-[#4DD9E8] outline-none dark:border-slate-600 dark:bg-slate-800 accent-[#4DD9E8]"
                  />
                  <span className="text-sm font-medium">
                    Featured Project <span className="text-destructive">*</span>
                  </span>
                </Label>
              </div>
            ))}

            {formData.projects.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No projects added yet. Click "Add Project" to showcase your work.
              </p>
            )}
          </div>
        </DashCard>

        {/* Certifications */}
        <DashCard>
          <SectionTitle
            icon={<Award className="w-5 h-5" />}
            title="Certifications"
            action={
              <Button
                type="button"
                onClick={addCertification}
                className="flex items-center gap-2 px-4 py-2 bg-[#4DD9E8]/10 text-[#288e99] hover:bg-[#4DD9E8]/20 hover:text-[#288e99] rounded-xl transition text-[10px] sm:text-sm shadow-none"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            }
          />

          <div className="space-y-4">
            {formData.certifications.map((cert, index) => (
              <div
                key={cert.localId ?? cert.id ?? index}
                className="p-5 border border-gray-100 dark:border-slate-700/50 rounded-xl space-y-4 bg-gray-50/50 dark:bg-slate-800/50 transition-all hover:border-gray-200 dark:hover:border-slate-600"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Certification #{index + 1}
                  </h3>
                  {(() => {
                    const localKey = cert?.localId ?? `local-cert-${index}`;
                    const isRemoving =
                      cert.id != null
                        ? removingCertificateId === cert.id
                        : removingCertificateId === localKey;
                    return isRemoving ? (
                      <div className="flex items-center justify-center p-2">
                        <SpinnerLoader className="text-red-500 w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeCertification(cert.id, index)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        aria-label="Remove certification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Certification Name *"
                      value={cert.name}
                      onChange={(e) =>
                        updateCertification(index, "name", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_name`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage error={fieldErrors[`cert_${index}_name`]} />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Issued By *"
                      value={cert.issuedBy}
                      onChange={(e) =>
                        updateCertification(index, "issuedBy", e.target.value)
                      }
                      className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_issuer`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl`}
                    />
                    <ErrorMessage error={fieldErrors[`cert_${index}_issuer`]} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      Issue Date *
                    </Label>
                    <input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) =>
                        updateCertification(index, "issueDate", e.target.value)
                      }
                      className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_issueDate`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl text-gray-700 dark:text-white`}
                    />
                    <ErrorMessage error={fieldErrors[`cert_${index}_issueDate`]} />
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-gray-500 mb-1.5 dark:text-gray-400">
                      Expiry Date (Optional)
                    </Label>
                    <input
                      type="date"
                      value={cert.expiryDate ?? ""}
                      onChange={(e) =>
                        updateCertification(
                          index,
                          "expiryDate",
                          e.target.value || null,
                        )
                      }
                      className={`w-full px-4 py-2 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_expiryDate`]
                        ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                        : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                        } focus:ring-2 focus:ring-inset rounded-xl text-gray-700 dark:text-white`}
                    />
                    <ErrorMessage error={fieldErrors[`cert_${index}_expiryDate`]} />
                  </div>
                </div>

                <div>
                  <input
                    type="url"
                    placeholder="Credential URL (e.g., https://coursera.org/verify/...)"
                    value={cert.credentialUrl}
                    onChange={(e) =>
                      updateCertification(index, "credentialUrl", e.target.value)
                    }
                    className={`w-full px-4 py-2.5 bg-white dark:bg-slate-900 border-0 ring-1 ring-inset ${fieldErrors[`cert_${index}_url`]
                      ? "ring-rose-500 dark:ring-rose-500 focus:ring-rose-500"
                      : "ring-gray-200 focus:ring-[#4DD9E8] outline-none dark:ring-slate-700"
                      } focus:ring-2 focus:ring-inset rounded-xl`}
                  />
                  <ErrorMessage error={fieldErrors[`cert_${index}_url`]} />
                </div>
              </div>
            ))}

            {formData.certifications.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                No certifications added yet. Click "Add Certification" to highlight
                your credentials.
              </p>
            )}
          </div>
        </DashCard>

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
              setFormData(handleForm());
              setFieldErrors({}); // Clear errors on cancel
              setLocationInput("");
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

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
} from "lucide-react";
import {
  useGetCandidateProfileImageQuery,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { skipToken } from "@reduxjs/toolkit/query";

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
  location: string;
  country: string | null;
  city: string | null;
  availability: string;
  bio: string;
  yearsExperience: string | number;
  primarySkills: string[];
  headline: string;
  resourceType: string;
  availableIn: string;
  englishProficiency: string;
  preferredWorkType: string[];
  hourlyRateMin: number | string;
  hourlyRateMax: number | string;
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
      country?: string | null;
      city?: string | null;
      availability?: string;
      bio?: string;
      yearsExperience?: string | number;
      primarySkills?: Skill[];
      headline?: string;
      resourceType?: string;
      availableIn?: string;
      englishProficiency?: string;
      preferredWorkType?: string[];
      hourlyRateMin?: number | string;
      hourlyRateMax?: number | string;
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
    };
  };
}

// ==================== VALIDATION ====================
const parseLocalDate = (dateStr: string): Date | null => {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
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
  headline: {
    maxLength: 100,
    validate: (headline: string) => {
      if (headline && headline.length > 100)
        return "Headline must be less than 100 characters";
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
    validate: (issueDate: string, expiryDate: string | null) => {
      if (!issueDate) return "Issue date is required";

      const issue = parseLocalDate(issueDate);
      if (!issue || isNaN(issue.getTime())) return "Invalid issue date format";
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      if (issue > now) {
        return "Issue date cannot be in the future";
      }

      if (expiryDate) {
        const [expYear, expMonth, expDay] = expiryDate.split("-").map(Number);
        const expiry = new Date(expYear, expMonth - 1, expDay);
        if (expiry < issue) {
          return "Expiry date cannot be before issue date";
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

      // Parse as local date to avoid timezone issues with YYYY-MM-DD format
      const [startYear, startMonth, startDay] = startDate
        .split("-")
        .map(Number);
      const start = new Date(startYear, startMonth - 1, startDay);
      const now = new Date();

      // Normalize to date-only (strip time) for fair comparison
      now.setHours(23, 59, 59, 999);

      if (start > now) {
        return "Start date cannot be in the future";
      }

      if (endDate) {
        const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
        const end = new Date(endYear, endMonth - 1, endDay);
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

// ==================== COMPONENT ====================
const CandidateProfileUpdate = ({
  data,
}: CandidateProfileUpdateProps): JSX.Element => {
  // API calls
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasAvatar = !!data?.avatar;

  const {
    data: profileImage,
    isLoading: isProfileImageLoading,
    refetch: refetchCandidateProfileImage,
  } = useGetCandidateProfileImageQuery(hasAvatar ? data.id : skipToken);

  const [skillInput, setSkillInput] = useState("");
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

  const handleForm = useCallback((): FormDataState => {
    if (!data)
      return {
        firstName: "",
        lastName: "",
        email: "",
        location: "",
        country: null,
        city: null,
        availability: "",
        bio: "",
        yearsExperience: "",
        primarySkills: [],
        headline: "",
        resourceType: "",
        availableIn: "",
        englishProficiency: "",
        preferredWorkType: [],
        hourlyRateMin: "",
        hourlyRateMax: "",
        workExperiences: [],
        projects: [],
        certifications: [],
      };
    return {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      location: data?.candidateProfile.location || "",
      country: data?.candidateProfile.country ?? null,
      city: data?.candidateProfile.city ?? null,
      availability: data?.candidateProfile.availability || "",
      bio: data?.candidateProfile.bio || "",
      yearsExperience: data?.candidateProfile.yearsExperience ?? "",
      primarySkills: skills || [],
      headline: data?.candidateProfile.headline || "",
      resourceType: data?.candidateProfile.resourceType || "",
      availableIn: data?.candidateProfile.availableIn || "",
      englishProficiency: data?.candidateProfile.englishProficiency ?? "",
      preferredWorkType: data?.candidateProfile.preferredWorkType ?? [],
      hourlyRateMin:
        data?.candidateProfile.hourlyRateMin === "" ||
        data?.candidateProfile.hourlyRateMin == null
          ? ""
          : Number(data?.candidateProfile.hourlyRateMin),
      hourlyRateMax:
        data?.candidateProfile.hourlyRateMax === "" ||
        data?.candidateProfile.hourlyRateMax == null
          ? ""
          : Number(data?.candidateProfile.hourlyRateMax),
      workExperiences: workExperiences || [],
      projects: projects || [],
      certifications: certification || [],
    };
  }, [data, skills, workExperiences, projects, certification]);

  const [formData, setFormData] = useState<FormDataState>(handleForm);

  useEffect(() => {
    if (!data) return;
    setFormData((prev) => {
      const base = handleForm();
      // Preserve user's skill edits by merging rather than replacing
      if (prev.primarySkills.length > 0) {
        const existingLower = new Set(
          prev.primarySkills.map((s) => s.toLowerCase().trim()),
        );
        const newSkills = skills.filter(
          (s) => !existingLower.has(s.toLowerCase().trim()),
        );
        return {
          ...base,
          primarySkills: [...prev.primarySkills, ...newSkills],
        };
      }
      return base;
    });
  }, [data, handleForm, skills]);

  const availabilityOptions = ["freelance", "full-time", "both"];
  const resourceTypeOptions = [
    "Bench Resource",
    "Active Resource",
    "Available",
  ];
  const availableInOptions = ["Immediate", "15 Days", "30 Days"];
  const preferredWorkTypeOptions = ["remote", "hybrid", "onsite"];
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
        {
          const parsed = value === "" ? "" : Number(value);
          if (parsed === "" || !Number.isNaN(parsed)) {
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

  const handleWorkTypeChange = (workType: string) => {
    setFormData((prev) => {
      const currentTypes = prev.preferredWorkType || [];
      const isSelected = currentTypes.includes(workType);

      return {
        ...prev,
        preferredWorkType: isSelected
          ? currentTypes.filter((type) => type !== workType)
          : [...currentTypes, workType],
      };
    });
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

      setRemovingSkillId(localName);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          primarySkills: prev.primarySkills.filter(
            (s) => s.toLowerCase() !== localName.toLowerCase(),
          ),
        }));
        setRemovingSkillId(null);
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
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          workExperiences: prev.workExperiences.filter(
            (we) => we.id != null || we.localId !== localKey,
          ),
        }));
        setRemovingWorkExperienceId(null);
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
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          projects: prev.projects.filter(
            (p) => p.id != null || p.localId !== localKey,
          ),
        }));
        setRemovingProjectId(null);
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
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          certifications: prev.certifications.filter(
            (c) => c.id != null || c.localId !== localKey,
          ),
        }));
        setRemovingCertificateId(null);
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

    const headlineError = VALIDATION.headline.validate(formData.headline);
    if (headlineError) errors.headline = headlineError;

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

    const skillsError = VALIDATION.skill.validate(formData.primarySkills);
    if (skillsError) errors.primarySkills = skillsError;

    // Validate work experiences
    formData.workExperiences.forEach((exp, index) => {
      if (exp.companyName || exp.role || exp.startDate) {
        // If any field is filled
        if (!exp.companyName)
          errors[`workExp_${index}_company`] = "Company name is required";
        if (!exp.role) errors[`workExp_${index}_role`] = "Role is required";
        if (!exp.startDate)
          errors[`workExp_${index}_startDate`] = "Start date is required";
        else {
          const dateError = VALIDATION.date.validate(
            exp.startDate,
            exp.endDate,
            "work experience",
          );
          if (dateError) errors[`workExp_${index}_dates`] = dateError;
        }
      }
    });

    // Validate projects
    formData.projects.forEach((project, index) => {
      if (project.title || project.description) {
        // If any field is filled
        if (!project.title)
          errors[`project_${index}_title`] = "Project title is required";
        if (!project.description)
          errors[`project_${index}_description`] =
            "Project description is required";

        if (project.projectUrl) {
          const urlError = VALIDATION.url.validate(project.projectUrl);
          if (urlError) errors[`project_${index}_url`] = urlError;
        }
      }
    });

    // Validate certifications
    formData.certifications.forEach((cert, index) => {
      if (cert.name || cert.issuedBy || cert.issueDate) {
        // If any field is filled
        if (!cert.name)
          errors[`cert_${index}_name`] = "Certification name is required";
        if (!cert.issuedBy)
          errors[`cert_${index}_issuer`] = "Issuer is required";
        if (!cert.issueDate)
          errors[`cert_${index}_issueDate`] = "Issue date is required";
        else {
          const dateError = VALIDATION.certificationDate.validate(
            cert.issueDate,
            cert.expiryDate ?? null,
          );
          if (dateError) {
            if (dateError.includes("Issue date")) {
              errors[`cert_${index}_issueDate`] = dateError;
            } else {
              errors[`cert_${index}_expiryDate`] = dateError;
            }
          }
        }
        if (cert.credentialUrl) {
          const urlError = VALIDATION.url.validate(cert.credentialUrl);
          if (urlError) errors[`cert_${index}_url`] = urlError;
        }
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
      return date;
    };

    const payload = {
      ...formData,
      // Sanitize data before sending
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      location: formData.location.trim(),
      country: formData.country?.trim() || null,
      city: formData.city?.trim() || null,
      headline: formData.headline.trim(),
      bio: formData.bio.trim(),
      primarySkills: formData.primarySkills,
      preferredWorkType: formData.preferredWorkType,
      hourlyRateMin:
        formData.hourlyRateMin === "" ? null : Number(formData.hourlyRateMin),
      hourlyRateMax:
        formData.hourlyRateMax === "" ? null : Number(formData.hourlyRateMax),
      certifications: formData.certifications
        .filter((cert) => cert.name && cert.issuedBy && cert.issueDate) // Only include completed certifications
        .map(({ localId, ...cert }) => ({
          ...cert,
          name: cert.name.trim(),
          issuedBy: cert.issuedBy.trim(),
          credentialUrl: cert.credentialUrl.trim(),
          expiryDate: cleanDate(cert.expiryDate),
        })),
      projects: formData.projects
        .filter((project) => project.title && project.description) // Only include completed projects
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
        .filter((exp) => exp.companyName && exp.role && exp.startDate) // Only include completed experiences
        .map(({ localId, ...exp }) => ({
          ...exp,
          companyName: exp.companyName.trim(),
          role: exp.role.trim(),
          location: exp.location.trim(),
          endDate: cleanDate(exp.endDate),
          description: Array.isArray(exp.description)
            ? exp.description.join("\n")
            : String(exp.description ?? "").trim(),
        })),
    };
    try {
      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully!");
      setFieldErrors({}); // Clear all errors on success
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

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or WebP).");
      return;
    }
    if (file.size > MAX_SIZE) {
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
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  return (
    <div className="sm:p-8">
      <div className="space-y-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center sm:items-start gap-4 pb-6 border-b dark:border-b-gray-600">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white w-full text-left">
            Profile Image
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
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

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoadingImage || isRemovingImage}
                  className="bg-primary hover:bg-primary/90 text-white px-6"
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
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-900/20"
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
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left">
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
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b dark:border-b-gray-600 pb-6 text-left dark:text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                maxLength={50}
                required
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.firstName
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
              <ErrorMessage error={fieldErrors.firstName} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                maxLength={50}
                required
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.lastName
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
              <ErrorMessage error={fieldErrors.lastName} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                maxLength={254}
                required
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.email ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              <ErrorMessage error={fieldErrors.email} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Headline
              </Label>
              <Input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleInputChange}
                maxLength={100}
                placeholder="e.g., Senior Full Stack Developer"
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.headline
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
              <ErrorMessage error={fieldErrors.headline} />
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="space-y-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-6 text-left dark:border-b-gray-600 dark:text-white">
            Professional Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Location
              </Label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Remote, New York, London"
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Availability
              </Label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border capitalize dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              >
                <option value="">Select availability</option>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Country
              </Label>
              <Input
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleInputChange}
                placeholder="e.g., United States, India, UK"
                maxLength={100}
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                City
              </Label>
              <Input
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleInputChange}
                placeholder="e.g., New York, Mumbai, London"
                maxLength={100}
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Years of Experience
              </Label>
              <Input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                min="0"
                max="70"
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.yearsExperience
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
              <ErrorMessage error={fieldErrors.yearsExperience} />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Resource Type
              </Label>
              <select
                name="resourceType"
                value={formData.resourceType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white capitalize"
              >
                <option value="">Select resource type</option>
                {resourceTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Available In
              </Label>
              <select
                name="availableIn"
                value={formData.availableIn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white capitalize"
              >
                <option value="">Select availability</option>
                {availableInOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                English Proficiency
              </Label>
              <select
                name="englishProficiency"
                value={formData.englishProficiency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white capitalize"
              >
                <option value="">Select proficiency</option>
                {englishProficiencyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pb-2">
            <Label className="block text-sm font-medium text-gray-700 mb-2 dark:text-white">
              Preferred Work Type
            </Label>
            <div className="flex flex-wrap gap-4">
              {preferredWorkTypeOptions?.map((workType) => (
                <label
                  key={workType}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.preferredWorkType?.includes(workType) || false
                    }
                    onChange={() => handleWorkTypeChange(workType)}
                    className="w-4 h-4 min-h-0 min-w-0 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary dark:border-slate-500 dark:bg-slate-800"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {workType}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Hourly Rate (Min) $
              </Label>
              <Input
                type="number"
                name="hourlyRateMin"
                value={formData.hourlyRateMin}
                onChange={handleInputChange}
                placeholder="Enter your hourly rate (min)"
                min="0"
                max="10000"
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.hourlyRate
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Hourly Rate (Max) $
              </Label>
              <Input
                type="number"
                name="hourlyRateMax"
                value={formData.hourlyRateMax}
                onChange={handleInputChange}
                min="0"
                max="10000"
                placeholder="Enter your hourly rate (max)"
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors.hourlyRate
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
            </div>
          </div>
          <ErrorMessage error={fieldErrors.hourlyRate} />

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Short Bio
            </Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={1000}
              rows={4}
              className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white leading-6 ${
                fieldErrors.bio ? "border-red-500 dark:border-red-500" : ""
              }`}
              placeholder="Tell us about yourself..."
            />
            <div className="flex justify-between items-center mt-1">
              <ErrorMessage error={fieldErrors.bio} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formData.bio.length} / 1000
              </span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-6 text-left dark:border-b-gray-600 dark:text-white">
            Skills & Tech <span className="text-destructive">*</span>
          </h2>

          <div className="flex gap-2">
            <Input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              maxLength={50}
              placeholder="Add a skill (e.g., TypeScript)"
              className={`flex-1 px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                fieldErrors.primarySkills
                  ? "border-red-500 dark:border-red-500"
                  : ""
              }`}
            />
            <Button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 text-white rounded-md transition"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <ErrorMessage error={fieldErrors.primarySkills} />

          <div className="flex flex-wrap gap-2">
            {formData.primarySkills.map((name, index) => {
              const skillObj = data?.candidateProfile?.primarySkills?.find(
                (s) =>
                  typeof s === "string"
                    ? false
                    : s.name.toLowerCase() === name.toLowerCase(),
              );
              const skillId = skillObj?.id ?? null;

              return (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
                >
                  {name}
                  {(() => {
                    const isRemoving = removingSkillId === (skillId ?? name);
                    return isRemoving ? (
                      <div className="ml-2 flex items-center justify-center">
                        <SpinnerLoader className="text-red-600" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeSkills(name)}
                        className="hover:text-teal-900 min-w-0 min-h-0"
                        aria-label={`Remove ${name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    );
                  })()}
                </span>
              );
            })}
            {formData.primarySkills.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No skills added yet. Add at least one skill.
              </p>
            )}
          </div>
          {formData.primarySkills.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formData.primarySkills.length} / 50 skills added
            </p>
          )}
        </div>
      </div>

      {/* Work Experience */}
      <div className="space-y-4 text-left mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 border-b dark:border-b-gray-600 dark:text-white pb-2 flex-1">
            Work Experience
          </h2>
          <Button
            type="button"
            onClick={addWorkExperience}
            className="flex items-center gap-2 px-4 py-2  bg-primary text-white rounded-md hover:bg-primary/90 transition text-[10px] sm:text-sm min-h-0 min-w-0"
          >
            <Briefcase className="w-4 h-4" />
            Add Experience
          </Button>
        </div>

        {formData.workExperiences.map((exp, index) => (
          <div
            key={exp.localId ?? exp.id ?? index}
            className="p-4 border dark:border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-white">
                Experience #{index + 1}
              </h3>
              {(() => {
                const localKey = exp?.localId ?? `local-we-${index}`;
                const isRemoving =
                  exp.id != null
                    ? removingWorkExperienceId === exp.id
                    : removingWorkExperienceId === localKey;
                return isRemoving ? (
                  <div className="flex items-center justify-center">
                    <SpinnerLoader className="text-red-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeWorkExperiences(exp.id, index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove work experience"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  type="text"
                  placeholder="Company Name *"
                  value={exp.companyName}
                  onChange={(e) =>
                    updateWorkExperience(index, "companyName", e.target.value)
                  }
                  className={`px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`workExp_${index}_company`]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage error={fieldErrors[`workExp_${index}_company`]} />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Role/Title *"
                  value={exp.role}
                  onChange={(e) =>
                    updateWorkExperience(index, "role", e.target.value)
                  }
                  className={`px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`workExp_${index}_role`] ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage error={fieldErrors[`workExp_${index}_role`]} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={exp.employmentType}
                onChange={(e) =>
                  updateWorkExperience(index, "employmentType", e.target.value)
                }
                className="px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              >
                <option value="">Employment Type</option>
                {employmentTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Input
                type="text"
                placeholder="Location"
                value={exp.location}
                onChange={(e) =>
                  updateWorkExperience(index, "location", e.target.value)
                }
                className="px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="block text-xs text-gray-600 mb-1 dark:text-white">
                  Start Date *
                </Label>
                <input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateWorkExperience(index, "startDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`workExp_${index}_startDate`]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  error={fieldErrors[`workExp_${index}_startDate`]}
                />
              </div>
              <div>
                <Label className="block text-xs text-gray-600 mb-1 dark:text-white">
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
                  className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
                />
              </div>
            </div>
            <ErrorMessage error={fieldErrors[`workExp_${index}_dates`]} />

            <Textarea
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
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
            />
          </div>
        ))}

        {formData.workExperiences.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
            No work experience added yet. Click "Add Experience" to get started.
          </p>
        )}
      </div>

      {/* Projects */}
      <div className="space-y-4 text-left mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 border-b dark:border-gray-600 pb-2 flex-1 dark:text-white">
            Projects
          </h2>
          <Button
            type="button"
            onClick={addProject}
            className="flex items-center gap-2 px-4 py-2  bg-primary text-white rounded-md hover:bg-primary/90 transition text-[10px] sm:text-sm min-h-0 min-w-0"
          >
            <FolderGit2 className="w-4 h-4" />
            Add Project
          </Button>
        </div>

        {formData.projects.map((project, index) => (
          <div
            key={project.localId ?? project.id ?? index}
            className="p-4 border dark:border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-white">
                Project #{index + 1}
              </h3>
              {(() => {
                const localKey = project?.localId ?? `local-project-${index}`;
                const isRemoving =
                  project.id != null
                    ? removingProjectId === project.id
                    : removingProjectId === localKey;
                return isRemoving ? (
                  <div className="flex items-center justify-center">
                    <SpinnerLoader className="text-red-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeProjects(project.id, index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                );
              })()}
            </div>

            <div>
              <Input
                type="text"
                placeholder="Project Title *"
                value={project.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors[`project_${index}_title`] ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage error={fieldErrors[`project_${index}_title`]} />
            </div>

            <div>
              <Textarea
                placeholder="Project Description *"
                value={project.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                rows={2}
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors[`project_${index}_description`]
                    ? "border-red-500"
                    : ""
                }`}
              />
              <ErrorMessage
                error={fieldErrors[`project_${index}_description`]}
              />
            </div>

            <Input
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
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
            />

            <div>
              <Input
                type="url"
                placeholder="Project URL (e.g., https://github.com/username/project)"
                value={project.projectUrl}
                onChange={(e) =>
                  updateProject(index, "projectUrl", e.target.value)
                }
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors[`project_${index}_url`] ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage error={fieldErrors[`project_${index}_url`]} />
            </div>

            <Label className="flex items-center gap-2 dark:text-white">
              <Input
                type="checkbox"
                checked={project.isFeatured}
                onChange={(e) =>
                  updateProject(index, "isFeatured", e.target.checked)
                }
                className="min-h-0 min-w-0 w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white accent-primary dark:accent-white"
              />
              <span className="text-sm text-gray-700 dark:text-white">
                Featured Project
              </span>
            </Label>
          </div>
        ))}

        {formData.projects.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
            No projects added yet. Click "Add Project" to showcase your work.
          </p>
        )}
      </div>

      {/* Certifications */}
      <div className="space-y-4 text-left mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 border-b dark:border-gray-600 pb-2 flex-1 dark:text-white">
            Certifications
          </h2>
          <Button
            type="button"
            onClick={addCertification}
            className="flex items-center gap-2 px-4 py-2  bg-primary text-white rounded-md hover:bg-primary/90 transition text-[10px] sm:text-sm min-h-0 min-w-0"
          >
            <Award className="w-4 h-4" />
            Add Certification
          </Button>
        </div>

        {formData.certifications.map((cert, index) => (
          <div
            key={cert.localId ?? cert.id ?? index}
            className="p-4 border dark:border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-white">
                Certification #{index + 1}
              </h3>
              {(() => {
                const localKey = cert?.localId ?? `local-cert-${index}`;
                const isRemoving =
                  cert.id != null
                    ? removingCertificateId === cert.id
                    : removingCertificateId === localKey;
                return isRemoving ? (
                  <div className="flex items-center justify-center">
                    <SpinnerLoader className="text-red-600" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeCertification(cert.id, index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove certification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                );
              })()}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Input
                  type="text"
                  placeholder="Certification Name *"
                  value={cert.name}
                  onChange={(e) =>
                    updateCertification(index, "name", e.target.value)
                  }
                  className={`px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`cert_${index}_name`] ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage error={fieldErrors[`cert_${index}_name`]} />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Issued By *"
                  value={cert.issuedBy}
                  onChange={(e) =>
                    updateCertification(index, "issuedBy", e.target.value)
                  }
                  className={`px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`cert_${index}_issuer`] ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage error={fieldErrors[`cert_${index}_issuer`]} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="block text-xs text-gray-600 mb-1 dark:text-white">
                  Issue Date *
                </Label>
                <input
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) =>
                    updateCertification(index, "issueDate", e.target.value)
                  }
                  className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`cert_${index}_issueDate`]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage error={fieldErrors[`cert_${index}_issueDate`]} />
              </div>
              <div>
                <Label className="block text-xs text-gray-600 mb-1 dark:text-white">
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
                  className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                    fieldErrors[`cert_${index}_expiryDate`]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage error={fieldErrors[`cert_${index}_expiryDate`]} />
              </div>
            </div>

            <div>
              <Input
                type="url"
                placeholder="Credential URL (e.g., https://coursera.org/verify/...)"
                value={cert.credentialUrl}
                onChange={(e) =>
                  updateCertification(index, "credentialUrl", e.target.value)
                }
                className={`w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white ${
                  fieldErrors[`cert_${index}_url`] ? "border-red-500" : ""
                }`}
              />
              <ErrorMessage error={fieldErrors[`cert_${index}_url`]} />
            </div>
          </div>
        ))}

        {formData.certifications.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
            No certifications added yet. Click "Add Certification" to highlight
            your credentials.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4 ">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isUpdating}
          className="flex-1 items-center gap-2 px-4 py-2  bg-primary text-white rounded-md hover:bg-primary/90 transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <div className="flex items-center justify-center gap-2">
              <SpinnerLoader />
              Updating...
            </div>
          ) : (
            "Update Profile"
          )}
        </button>
        <button
          onClick={() => {
            setFormData(handleForm());
            setFieldErrors({}); // Clear errors on cancel
            toast.info("Changes discarded");
          }}
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-red-600 hover:text-white transition font-medium dark:border-gray-600"
        >
          Cancel
        </button>
      </div>
      {updateError && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Failed to update profile. Please try again or contact support if the
            issue persists.
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateProfileUpdate;

import { ChangeEvent, useEffect, useState } from "react";
import { X, Plus, Trash2, Briefcase, Award, FolderGit2 } from "lucide-react";
import {
  useRemoveCertificateMutation,
  useRemoveProjectMutation,
  useRemoveSkillMutation,
  useRemoveWorkExperienceMutation,
  useUpdateProfileMutation,
} from "@/app/queries/profileApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

type Skill = {
  id: number;
  name: string;
};

interface CandidateProfileUpdateProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    candidateProfile: {
      location?: string;
      availability?: string;
      bio?: string;
      yearsExperience?: string | number;
      skills?: Skill[];
      headline?: string;
      resourceType?: string;
      availableIn?: string;
      englishProficiency?: string;
      hourlyRateMin?: number | string;
      hourlyRateMax?: number | string;
      workExperiences?: Array<{
        id: number | null;
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
        title: string;
        description: string;
        techStack: string[];
        projectUrl: string;
        isFeatured: boolean;
      }>;
      certifications?: Array<{
        id: number | null;
        name: string;
        issuedBy: string;
        issueDate: string;
        expiryDate?: string;
        credentialUrl: string;
      }>;
    };
  };
}

const CandidateProfileUpdate = ({
  data,
}: CandidateProfileUpdateProps): JSX.Element => {
  // api calls
  const [updateProfile, { isLoading: isUpdating, isError: updateError }] =
    useUpdateProfileMutation();
  const [removeSkill] = useRemoveSkillMutation();
  const [removeWorkExperience] = useRemoveWorkExperienceMutation();
  const [removeProject] = useRemoveProjectMutation();
  const [removeCertificate] = useRemoveCertificateMutation();

  const [skillInput, setSkillInput] = useState("");

  const skills =
    data?.candidateProfile?.skills?.map((skill) =>
      typeof skill === "string" ? skill : skill.name,
    ) || [];

  const workExperiences =
    data?.candidateProfile?.workExperiences?.map(
      ({
        id,
        companyName,
        role,
        employmentType,
        startDate,
        endDate,
        description,
        location,
      }) => ({
        id,
        companyName,
        role,
        employmentType,
        startDate,
        endDate,
        description,
        location,
      }),
    ) || [];

  const projects =
    data?.candidateProfile?.projects?.map(
      ({ id, title, description, techStack, projectUrl, isFeatured }) => ({
        id,
        title,
        description,
        techStack,
        projectUrl,
        isFeatured,
      }),
    ) || [];

  const certification =
    data?.candidateProfile?.certifications?.map(
      ({ id, name, issueDate, issuedBy, expiryDate, credentialUrl }) => ({
        id,
        name,
        issueDate,
        issuedBy,
        expiryDate,
        credentialUrl,
      }),
    ) || [];

  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    location: data?.candidateProfile.location || "",
    availability: data?.candidateProfile.availability || "",
    bio: data?.candidateProfile.bio || "",
    yearsExperience: data?.candidateProfile.yearsExperience ?? "",
    skills: skills,
    headline: data?.candidateProfile.headline || "",
    resourceType: data?.candidateProfile.resourceType || "",
    availableIn: data?.candidateProfile.availableIn || "",
    englishProficiency: data?.candidateProfile.englishProficiency || "",
    hourlyRateMin:
      data?.candidateProfile.hourlyRateMin == null ||
      data?.candidateProfile.hourlyRateMin === ""
        ? ""
        : Number(data?.candidateProfile.hourlyRateMin),
    hourlyRateMax:
      data?.candidateProfile.hourlyRateMax == null ||
      data?.candidateProfile.hourlyRateMax === ""
        ? ""
        : Number(data?.candidateProfile.hourlyRateMax),
    workExperiences: workExperiences || [],
    projects: projects || [],
    certifications: certification || [],
  });

  useEffect(() => {
    if (!data) return;
    setFormData({
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      location: data?.candidateProfile.location || "",
      availability: data?.candidateProfile.availability || "",
      bio: data?.candidateProfile.bio || "",
      yearsExperience: data?.candidateProfile.yearsExperience ?? "",
      skills: skills,
      headline: data?.candidateProfile.headline || "",
      resourceType: data?.candidateProfile.resourceType || "",
      availableIn: data?.candidateProfile.availableIn || "",
      englishProficiency: data?.candidateProfile.englishProficiency || "",
      hourlyRateMin:
        data?.candidateProfile.hourlyRateMin == null ||
        data?.candidateProfile.hourlyRateMin === ""
          ? ""
          : Number(data?.candidateProfile.hourlyRateMin),
      hourlyRateMax:
        data?.candidateProfile.hourlyRateMax == null ||
        data?.candidateProfile.hourlyRateMax === ""
          ? ""
          : Number(data?.candidateProfile.hourlyRateMax),
      workExperiences: workExperiences || [],
      projects: projects || [],
      certifications: certification || [],
    });
  }, [data]);

  const availabilityOptions = [
    "freelance",
    "full-time",
    "part-time",
    "contract",
  ];
  const resourceTypeOptions = [
    "Bench Resource",
    "Active Resource",
    "Available",
  ];
  const availableInOptions = ["Immediate", "15 Days", "30 Days"];
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

  const addSkill = () => {
    const name = skillInput.trim();
    if (
      name &&
      !formData.skills.some(
        (skill) => skill.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, name],
      }));
      setSkillInput("");
    }
  };

  const removeSkills = async (skillToRemove: string) => {
    // Guard clause: prevent removing the last skill
    if (formData.skills.length <= 1) {
      toast.warning("You must have at least one skill");
      return;
    }

    // Find the skill to remove
    const filteredSkill = data?.candidateProfile?.skills?.find(
      (skill) => skill.name.toLowerCase() === skillToRemove.toLowerCase(),
    );

    // Guard clause: skill not found
    if (filteredSkill == null || filteredSkill.id == null) {
      // Not persisted yet — remove locally
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter(
          (s) => s.toLowerCase() !== skillToRemove.toLowerCase(),
        ),
      }));
      return;
    }

    try {
      await removeSkill(Number(filteredSkill.id)).unwrap();
      toast.success("Skill removed successfully!");

      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter(
          (s) => s.toLowerCase() !== skillToRemove.toLowerCase(),
        ),
      }));
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to remove skill";
      toast.error(errorMessage);
    }
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        {
          id: null,
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
    setFormData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      ),
    }));
  };

  const removeWorkExperiences = async (id: number | null, index?: number) => {
    if (id == null) {
      if (index == null) return;
      setFormData((prev) => ({
        ...prev,
        workExperiences: prev.workExperiences.filter((_, i) => i !== index),
      }));
      return;
    }

    try {
      await removeWorkExperience(id).unwrap();
      toast.success("Work experience removed successfully!");

      setFormData((prev) => ({
        ...prev,
        workExperiences: prev.workExperiences.filter((exp) => exp.id !== id),
      }));
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to remove work experience";
      toast.error(errorMessage);
    }
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: null,
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
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj,
      ),
    }));
  };

  const removeProjects = async (id: number | null, index?: number) => {
    if (id == null) {
      if (index == null) return;
      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index),
      }));
      return;
    }

    try {
      await removeProject(id).unwrap();
      toast.success("Project removed successfully!");

      setFormData((prev) => ({
        ...prev,
        projects: prev.projects.filter((proj) => proj.id !== id),
      }));
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to remove project";
      toast.error(errorMessage);
    }
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: null,
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
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert,
      ),
    }));
  };

  const removeCertification = async (id: number | null, index?: number) => {
    if (id == null) {
      if (index == null) return;
      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((_, i) => i !== index),
      }));
      return;
    }

    try {
      await removeCertificate(id).unwrap();
      toast.success("Certificate removed successfully!");

      setFormData((prev) => ({
        ...prev,
        certifications: prev.certifications.filter((cert) => cert.id !== id),
      }));
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.message || "Failed to remove certificate";
      toast.error(errorMessage);
    }
  };

  const handleSubmit = () => {
    const cleanDate = (date: string | null | undefined) => {
      if (!date || date.trim() === "") return null;
      return date;
    };

    const payload = {
      ...formData,
      certifications: formData.certifications.map((cert) => ({
        ...cert,
        expiryDate: cleanDate(cert.expiryDate),
      })),
      projects: formData.projects.map((project) => ({
        ...project,
        techStack: Array.isArray(project.techStack)
          ? project.techStack
          : String(project.techStack ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
      })),
      workExperiences: formData.workExperiences.map((exp) => ({
        ...exp,
        description: Array.isArray(exp.description)
          ? exp.description.join("\n")
          : String(exp.description ?? ""),
      })),
    };
    updateProfile(payload)
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully!");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Failed to update profile");
      });
  };

  return (
    <div className="sm:p-8">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b dark:border-b-gray-600 pb-6 text-left dark:text-white">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                First Name
              </Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Last Name
              </Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pb-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
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
                placeholder="e.g., Senior Full Stack Developer"
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
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
                Years of Experience
              </Label>
              <Input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
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
                min="0"
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
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
                className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
              Short Bio
            </Label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white leading-6"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-6 text-left dark:border-b-gray-600 dark:text-white">
            Skills & Tech
          </h2>

          <div className="flex gap-2">
            <Input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              placeholder="Add a skill (e.g., TypeScript)"
              className="flex-1 px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
            />
            <Button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 text-white rounded-md transition"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.skills.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm"
              >
                {name}
                <button
                  type="button"
                  onClick={() => removeSkills(name)}
                  className="hover:text-teal-900 min-w-0 min-h-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
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
            key={index}
            className="p-4 border dark:border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-white">
                Experience #{index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeWorkExperiences(exp.id, index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Company Name"
                value={exp.companyName}
                onChange={(e) =>
                  updateWorkExperience(index, "companyName", e.target.value)
                }
                className="px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
              <Input
                type="text"
                placeholder="Role/Title"
                value={exp.role}
                onChange={(e) =>
                  updateWorkExperience(index, "role", e.target.value)
                }
                className="px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
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
                  Start Date
                </Label>
                <input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateWorkExperience(index, "startDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-500 bg-white"
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
            key={index}
            className="p-4 border dark:border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-white">
                Project #{index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeProjects(project.id, index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <Input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
            />

            <Textarea
              placeholder="Project Description"
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
              rows={2}
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
            />

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

            <Input
              type="url"
              placeholder="Project URL"
              value={project.projectUrl}
              onChange={(e) =>
                updateProject(index, "projectUrl", e.target.value)
              }
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
            />

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
            key={index}
            className="p-4 border dark:border-2 border-gray-200 rounded-lg space-y-3 bg-gray-50 dark:bg-slate-800 dark:border-slate-700"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-white">
                Certification #{index + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeCertification(cert.id, index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="text"
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) =>
                  updateCertification(index, "name", e.target.value)
                }
                className="px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
              <Input
                type="text"
                placeholder="Issued By"
                value={cert.issuedBy}
                onChange={(e) =>
                  updateCertification(index, "issuedBy", e.target.value)
                }
                className="px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="block text-xs text-gray-600 mb-1 dark:text-white">
                  Issue Date
                </Label>
                <input
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) =>
                    updateCertification(index, "issueDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
                />
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
                  className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
                />
              </div>
            </div>

            <Input
              type="url"
              placeholder="Credential URL"
              value={cert.credentialUrl}
              onChange={(e) =>
                updateCertification(index, "credentialUrl", e.target.value)
              }
              className="w-full px-3 py-2 border dark:border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-800 dark:border-slate-500 bg-white"
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4 ">
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="flex-1 items-center gap-2 px-4 py-2  bg-primary text-white rounded-md hover:bg-primary/90 transition text-base"
        >
          {isUpdating ? "Updating..." : "Update Profile"}
        </button>
        <button
          onClick={() => {
            setFormData({
              firstName: data?.firstName || "",
              lastName: data?.lastName || "",
              email: data?.email || "",
              location: data?.candidateProfile.location || "",
              availability: data?.candidateProfile.availability || "",
              bio: data?.candidateProfile.bio || "",
              yearsExperience: data?.candidateProfile.yearsExperience ?? "",
              skills: skills || [],
              headline: data?.candidateProfile.headline || "",
              resourceType: data?.candidateProfile.resourceType || "",
              availableIn: data?.candidateProfile.availableIn || "",
              englishProficiency:
                data?.candidateProfile.englishProficiency || "",
              hourlyRateMin:
                data?.candidateProfile.hourlyRateMin == null ||
                data?.candidateProfile.hourlyRateMin === ""
                  ? ""
                  : Number(data?.candidateProfile.hourlyRateMin),
              hourlyRateMax:
                data?.candidateProfile.hourlyRateMax == null ||
                data?.candidateProfile.hourlyRateMax === ""
                  ? ""
                  : Number(data?.candidateProfile.hourlyRateMax),
              workExperiences: workExperiences || [],
              projects: projects || [],
              certifications: certification || [],
            });
          }}
          type="button"
          className="px-6 py-3 border border-gray-300 rounded-md hover:bg-red-600 hover:text-white transition font-medium dark:border-gray-600"
        >
          Cancel
        </button>
      </div>
      {updateError && (
        <p className="text-red-600 text-sm mt-2">Failed to update profile</p>
      )}
    </div>
  );
};

export default CandidateProfileUpdate;

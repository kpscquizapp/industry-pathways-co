import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetCandidateProfileImageQuery,
  useGetProfileQuery,
} from "@/app/queries/profileApi";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Camera,
  Clock,
  MapPin,
  Briefcase,
  Globe,
  Banknote,
  Code,
  User,
} from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import type { JSX } from "react";

interface Certifications {
  candidateProfileId: number;
  createdAt: string;
  credentialUrl: string;
  expiryDate: string | null;
  id: number;
  issueDate: string;
  issuedBy: string;
  name: string;
  updatedAt: string;
}

interface Projects {
  candidateProfileId: number;
  createdAt: string;
  description: string;
  id: number;
  isFeatured: boolean;
  projectUrl: string;
  techStack: string[];
  title: string;
  updatedAt: string;
}

interface Resumes {
  fileSize: number;
  id: number;
  mimeType: string;
  isDefault: boolean;
  originalName: string;
  uploadedAt: string;
}

interface WorkExperiences {
  candidateProfileId: number;
  companyName: string;
  createdAt: string;
  description: string;
  employmentType: string;
  endDate: string;
  id: number;
  location: string;
  role: string;
  startDate: string;
  updatedAt: string;
}

interface CandidateProfile {
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
  availability: string;
  availableIn: string;
  availableToJoin: string;
  bio: string;
  candidateType: string;
  certifications: Certifications[];
  city: string;
  country: string;
  createdAt: string;
  currency: string;
  enableAiMatching: boolean;
  englishProficiency: string;
  expectedSalaryMax: string;
  expectedSalaryMin: string;
  headline: string;
  hourlyRateMax: number;
  hourlyRateMin: number;
  id: number;
  location: string;
  mobileNumber: string;
  preferredJobLocations: string[];
  preferredWorkType: string[];
  primaryJobRole: string;
  primarySkills: string[];
  projects: Projects[];
  resourceType: string;
  resume: Resumes[];
  scheduleAiInterview: boolean;
  secondarySkills: string[];
  skills: string[];
  takeSkillAssessment: boolean;
  updatedAt: string;
  userId: number;
  viewCount: number;
  workExperiences: WorkExperiences[];
  yearsExperience: number;
}
interface CandidateDetails {
  avatar: string;
  candidateProfile: CandidateProfile;
  email: string;
  firstName: string;
  id: number;
  language: string;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  lastName: string;
  lockedUntil: string | null;
  loginAttempts: number;
  role: string;
  status: string;
  timezone: string;
  updatedAt: string;
  uuid: string;
}

type QuickActions = {
  label: string;
  icon: React.ComponentType<{ className: string }>;
  color: string;
  bg: string;
  route: string;
};

const DashCard = ({
  children,
  className = "",
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}): JSX.Element => (
  <div
    className={`bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform duration-300 ${noPadding ? "" : "p-6"} ${className}`}
  >
    {children}
  </div>
);

const SkillChip = ({ label }: { label: string }): JSX.Element => (
  <span className="inline-flex items-center gap-1.5 bg-cyan-400/10 text-cyan-700 rounded-full px-3.5 py-1 text-[13px] font-medium border border-cyan-400/20 shadow-sm">
    {label}
  </span>
);

const isCurrentWorkExperience = (endDate?: string | null): boolean => {
  if (typeof endDate !== "string") return endDate == null;
  return endDate.trim().length === 0;
};

const getDateSortValue = (date?: string | null): number => {
  if (typeof date !== "string" || date.trim().length === 0) {
    return Number.NEGATIVE_INFINITY;
  }
  const timestamp: number = new Date(date).getTime();
  return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

const getSafeProjectUrl = (value?: string): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed: string = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
};

const ContractorProfile = (): JSX.Element => {
  const { token, userDetails } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const handleNav = useCallback(
    (path: string): void => navigate(path),
    [navigate],
  );

  const { data: response } = useGetProfileQuery(undefined, { skip: !token });

  const data: CandidateDetails | undefined = response?.data;
  const profile: CandidateProfile | undefined = data?.candidateProfile;
  const hasAvatar: boolean = !!data?.avatar;

  const { currentData: profileImage, isLoading: isLoadingImage } =
    useGetCandidateProfileImageQuery(
      hasAvatar ? (data?.id?.toString() ?? skipToken) : skipToken,
    );

  const workItems: WorkExperiences[] = useMemo(
    () =>
      Array.isArray(profile?.workExperiences)
        ? profile.workExperiences.filter(
            (item: WorkExperiences): item is WorkExperiences =>
              item != null && typeof item === "object",
          )
        : [],
    [profile?.workExperiences],
  );

  const projectItems: Projects[] = useMemo(
    () =>
      Array.isArray(profile?.projects)
        ? profile.projects.filter(
            (item: Projects): item is Projects =>
              item != null && typeof item === "object",
          )
        : [],
    [profile?.projects],
  );

  const certificationItems: Certifications[] = useMemo(
    () =>
      Array.isArray(profile?.certifications)
        ? profile.certifications.filter(
            (item: Certifications): item is Certifications =>
              item != null && typeof item === "object",
          )
        : [],
    [profile?.certifications],
  );

  const sortedWorkItems: WorkExperiences[] = useMemo(
    () =>
      [...workItems].sort((a, b) => {
        const aIsCurrent: boolean = isCurrentWorkExperience(a.endDate);
        const bIsCurrent: boolean = isCurrentWorkExperience(b.endDate);
        if (aIsCurrent !== bIsCurrent) return aIsCurrent ? -1 : 1;
        const aStart: number = getDateSortValue(a.startDate);
        const bStart: number = getDateSortValue(b.startDate);
        if (aStart !== bStart) return bStart - aStart;
        return (b.startDate ?? "").localeCompare(a.startDate ?? "");
      }),
    [workItems],
  );

  const renderProfileImage = (): JSX.Element => {
    if (isLoadingImage) {
      return (
        <div className="w-[72px] h-[72px] rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center absolute top-2 left-2">
          <SpinnerLoader />
        </div>
      );
    }
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt="Profile"
          className="w-[100px] h-[100px] rounded-full object-cover border-2 border-white absolute top-2 left-2 shadow-sm"
        />
      );
    }
    return (
      <div className="w-[100px] h-[100px] rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center absolute top-2 left-2 text-gray-400">
        <Camera className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 my-8 font-sans animate-in fade-in slide-in-from-bottom-3 duration-1000 font-inter">
      {/* Left Column (Profile Summary, Skills, Certs) */}
      <div className="flex flex-col gap-4">
        <DashCard className="text-center p-7">
          <div className="relative w-[113px] h-[100px] mx-auto mb-3.5">
            {renderProfileImage()}
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 mb-0.5">
            {data?.firstName || userDetails?.firstName}{" "}
            {data?.lastName || userDetails?.lastName}
          </h3>
          <p className="text-[13px] text-gray-500 mb-2.5">
            {profile?.primaryJobRole || "No primary job role specified"}
          </p>
          <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-green-50 text-green-600">
            {data?.role === "candidate" && (
              <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-green-50 text-green-600">
                CONTRACT RESOURCE
              </span>
            )}
          </span>

          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-3 text-left">
            {profile?.hourlyRateMin != null &&
              profile?.hourlyRateMax != null && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Banknote className="w-3.5 h-3.5" />
                    <span className="text-[13px] text-gray-500 font-medium">
                      Hourly Rate
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-gray-900">
                    {getCurrencySymbol(profile.currency)}
                    {profile.hourlyRateMin} -{" "}
                    {getCurrencySymbol(profile.currency)}
                    {profile.hourlyRateMax}/hr
                  </span>
                </div>
              )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[13px] text-gray-500 font-medium">
                  Availability
                </span>
              </div>
              <span className="text-[13px] font-semibold text-green-600 capitalize">
                {profile?.availableToJoin || "None"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-[13px] text-gray-500 font-medium">
                  Location
                </span>
              </div>
              <span className="text-[13px] font-semibold text-gray-900 max-w-[120px] truncate block">
                {profile?.location || "None"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="w-3.5 h-3.5" />
                <span className="text-[13px] text-gray-500 font-medium">
                  Experience
                </span>
              </div>
              <span className="text-[13px] font-semibold text-gray-900">
                {profile?.yearsExperience != null
                  ? `${profile.yearsExperience} Years`
                  : "None"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[13px] text-gray-500 font-medium">
                  English
                </span>
              </div>
              <span className="text-[13px] font-semibold text-gray-900">
                {profile?.englishProficiency || "None"}
              </span>
            </div>
          </div>
        </DashCard>

        <DashCard>
          <h4 className="text-[14px] font-bold text-gray-900 mb-3">
            Primary Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profile?.primarySkills) &&
            profile.primarySkills.length > 0 ? (
              profile.primarySkills.map(
                (skill: string, index: number): JSX.Element => {
                  const name: string = typeof skill === "string" && skill;
                  if (!name) return null;
                  return <SkillChip key={index} label={name} />;
                },
              )
            ) : (
              <span className="text-[13px] text-gray-500">
                No primary skills listed
              </span>
            )}
          </div>
          <h4 className="text-[14px] font-bold text-gray-900 mb-3 mt-5">
            Secondary Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profile?.secondarySkills) &&
            profile.secondarySkills.length > 0 ? (
              profile.secondarySkills.map(
                (skill: string, index: number): JSX.Element => {
                  const name: string = typeof skill === "string" && skill;
                  if (!name) return null;
                  return <SkillChip key={index} label={name} />;
                },
              )
            ) : (
              <span className="text-[13px] text-gray-500">
                No secondary skills listed
              </span>
            )}
          </div>
        </DashCard>

        <DashCard>
          <h4 className="text-[14px] font-bold text-gray-900 mb-3">
            Certifications
          </h4>
          <div className="space-y-3">
            {certificationItems.length ? (
              certificationItems.map(
                (cert: Certifications, index: number): JSX.Element => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center flex-shrink-0 text-[14px]">
                      🎓
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[13px] text-gray-900 break-words">
                        {cert.name}
                      </p>
                      <p className="text-[12px] text-gray-500">
                        {cert.issueDate}
                      </p>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                🎓 No Certifications
              </div>
            )}
          </div>
        </DashCard>
      </div>

      {/* Right Column (Quick Actions, About, Work, Projects, Activity) */}
      <div className="flex flex-col gap-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "Take Skill Test",
              icon: Code,
              color: "text-cyan-500",
              bg: "bg-cyan-50",
              route: "/contractor/tests",
            },
            // { label: "Start AI Interview", icon: Video, color: "text-cyan-500", bg: "bg-cyan-50", route: "/contractor/interviews" },
            {
              label: "Update Profile",
              icon: User,
              color: "text-cyan-500",
              bg: "bg-cyan-50",
              route: "/contractor/profile/update",
            },
          ].map((a: QuickActions, i: number) => (
            <DashCard
              key={i}
              className="cursor-pointer hover:bg-gray-50"
              noPadding
            >
              <div
                onClick={() => handleNav(a.route)}
                className="flex items-center gap-3 w-full h-full p-[18px]"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.bg} ${a.color}`}
                >
                  <a.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-gray-900">
                    {a.label}
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Quick action
                  </div>
                </div>
              </div>
            </DashCard>
          ))}
        </div>

        <DashCard>
          <h4 className="text-[16px] font-bold text-gray-900 mb-2">
            About Candidate
          </h4>
          <p className="text-[14px] text-gray-500 leading-relaxed break-words whitespace-pre-line">
            {profile?.bio ?? "No bio available."}
          </p>
        </DashCard>

        <DashCard>
          <h4 className="text-[16px] font-bold text-gray-900 mb-4">
            Work Experience
          </h4>
          <div className="space-y-6">
            {sortedWorkItems.length > 0 ? (
              sortedWorkItems.map(
                (entry: WorkExperiences, index: number): JSX.Element => {
                  const isCurrentRole: boolean = isCurrentWorkExperience(
                    entry.endDate,
                  );
                  return (
                    <div key={index} className="flex gap-4">
                      <div
                        className={`w-1 ${isCurrentRole ? "bg-[#4DD9E8]" : "bg-gray-200"} rounded-full flex-shrink-0`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[15px] text-gray-900 break-words">
                          {entry.role}
                        </h4>
                        <p className="text-[13px] font-semibold text-cyan-600 break-words">
                          {entry.companyName}
                        </p>
                        <p className="text-[12px] text-gray-500 mb-2">
                          {entry.startDate} -{" "}
                          {isCurrentRole ? "Present" : entry.endDate} •{" "}
                          {entry.location}
                        </p>
                        <div className="text-[13px] text-gray-600 space-y-1">
                          {(Array.isArray(entry.description)
                            ? entry.description
                            : entry.description
                              ? entry.description.split(/\r?\n/).filter(Boolean)
                              : []
                          ).map((bullet: string, bIndex: number) => (
                            <p
                              key={bIndex}
                              className="break-words leading-relaxed"
                            >
                              {bullet}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                },
              )
            ) : (
              <p className="text-[14px] text-gray-500">
                No work experience listed.
              </p>
            )}
          </div>
        </DashCard>

        <DashCard>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[16px] font-bold text-gray-900">
              Featured Projects
            </h4>
            {/* <Link to="/contractor/projects" className="text-[13px] text-cyan-600 hover:text-cyan-700 font-semibold no-underline">
              View Portfolio
            </Link> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projectItems.length > 0 ? (
              projectItems.map(
                (project: Projects, pIndex: number): JSX.Element => {
                  const safeUrl: string = getSafeProjectUrl(project.projectUrl);
                  return (
                    <div
                      key={pIndex}
                      className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="w-full h-24 bg-gray-50 rounded-lg flex items-center justify-center mb-4 border border-gray-100/50">
                        <div className="w-10 h-14 border-2 border-gray-200 rounded flex items-center justify-center text-xl bg-white shadow-sm">
                          {project.projectUrl ? "🌐" : "📂"}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-[14px] text-gray-900 break-words">
                          {project.title}
                        </h4>
                        {safeUrl && (
                          <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-cyan-600 font-semibold hover:underline bg-cyan-50 px-2 py-0.5 rounded-md min-h-0 min-w-0"
                          >
                            Link
                          </a>
                        )}
                      </div>
                      <p className="text-[12px] text-gray-500 break-words mb-2 font-medium">
                        {Array.isArray(project.techStack)
                          ? project.techStack.join(", ")
                          : project.techStack}
                      </p>
                      <p className="text-[13px] text-gray-600 break-words line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  );
                },
              )
            ) : (
              <p className="text-[14px] text-gray-500 col-span-2">
                No projects yet
              </p>
            )}
          </div>
        </DashCard>

        {/* <DashCard>
          <h4 className="text-[16px] font-bold text-gray-900 mb-4">Recent Activity</h4>
          <div className="flex flex-col">
            {ACTIVITY.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 py-3 ${i < ACTIVITY.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                <div className="flex-1">
                  <p className="text-[13px] text-gray-800 leading-relaxed font-medium">{a.text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DashCard> */}
      </div>
    </div>
  );
};

export default ContractorProfile;

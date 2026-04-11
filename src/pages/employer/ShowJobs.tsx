import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  useGetEmployerAllJobsQuery,
  useDeleteJobMutation,
  EMPLOYER_JOB_STATUS,
} from "@/app/queries/jobApi";
import type { Job, JobSkill } from "@/app/queries/aiShortlistApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import JobDetailsModal from "./JobDetailsModal";
import { toast } from "sonner";

const ACTIVE_STATUSES: ReadonlySet<string> = new Set([
  EMPLOYER_JOB_STATUS.PUBLISHED,
]);

const getStatusBadgeProps = (
  rawStatus: string | undefined,
): { label: string; className: string } => {
  const status = (rawStatus ?? "").toLowerCase().trim();
  if (status === EMPLOYER_JOB_STATUS.PUBLISHED) {
    return {
      label: "Active",
      className:
        "bg-[#edf8f1] text-[#16a34a] border-transparent",
    };
  }
  if (status === EMPLOYER_JOB_STATUS.DRAFT) {
    return {
      label: "Draft",
      className:
        "bg-[#fff6e0] text-[#d97706] border-transparent",
    };
  }
  if (status === EMPLOYER_JOB_STATUS.CLOSED) {
    return {
      label: "Closed",
      className:
        "bg-slate-100 text-slate-600 border-transparent",
    };
  }
  return {
    label: status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown",
    className: "bg-slate-100 text-slate-600 border-transparent",
  };
};

const formatTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Posted ${months} month${months > 1 ? "s" : ""} ago`;
};

const getSkillName = (skill: string | JobSkill): string =>
  typeof skill === "string" ? skill : skill.name ?? "";

const formatSalary = (min?: number | string, max?: number | string, currency?: string): string => {
  const lo = typeof min === "number" ? min : Number(min);
  const hi = typeof max === "number" ? max : Number(max);
  const sym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "INR" ? "₹" : "$";
  const fmt = (n: number) => {
    if (n >= 1000) return `${sym}${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
    return `${sym}${n}`;
  };
  if (Number.isFinite(lo) && lo > 0 && Number.isFinite(hi) && hi > 0)
    return `${fmt(lo)} - ${fmt(hi)}`;
  if (Number.isFinite(lo) && lo > 0) return `${fmt(lo)}+`;
  if (Number.isFinite(hi) && hi > 0) return `Up to ${fmt(hi)}`;
  return "";
};

const formatExperience = (min?: number | string, max?: number | string): string => {
  const lo = typeof min === "number" ? min : Number(min);
  const hi = typeof max === "number" ? max : Number(max);
  if (Number.isFinite(lo) && lo >= 0 && Number.isFinite(hi) && hi > 0)
    return `${lo}-${hi} yrs`;
  if (Number.isFinite(lo) && lo >= 0) return `${lo}+ yrs`;
  if (Number.isFinite(hi) && hi > 0) return `Up to ${hi} yrs`;
  return "";
};

const JobDescription = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formattedText = useMemo(() => {
    return description
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>/gi, "\n• ")
      .replace(/([^\n])([A-Z][^:\n]{2,30}:)/g, "$1\n$2") // Insert newline before headings like "Location:" if missing
      .replace(/<[^>]*>/g, "")
      .trim();
  }, [description]);

  const threshold = 180;
  const isLong = formattedText.length > threshold;

  return (
    <div className="mt-1">
      <div className="text-[14px] text-gray-500 leading-relaxed">
        {isExpanded ? (
          <div className="space-y-1.5 text-justify">
            {formattedText.split("\n").map((line, i) => {
              const match = line.match(/^([^:]+):/);
              if (match) {
                const header = match[1];
                const rest = line.slice(header.length + 1);
                return (
                  <div key={i}>
                    <span className="font-bold text-gray-700">{header}:</span>
                    {rest}
                  </div>
                );
              }
              return (
                <div key={i} className={line.startsWith("•") ? "pl-2" : ""}>
                  {line}
                </div>
              );
            })}
          </div>
        ) : (
          <p>
            {formattedText.slice(0, threshold)}
            {isLong && "..."}
          </p>
        )}
      </div>
      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-[#0ea5e9] font-bold text-[13px] mt-2 hover:text-[#0284c7] transition-colors focus:outline-none"
        >
          {isExpanded ? "show less" : "more"}
        </button>
      )}
    </div>
  );
};

const JobSkills = ({ skills }: { skills: string[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!skills || skills.length === 0) return null;

  const displaySkills = isExpanded ? skills : skills.slice(0, 6);
  const remainingCount = skills.length - 6;

  return (
    <div className="flex flex-wrap gap-2.5 pt-2">
      {displaySkills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center text-[12px] font-bold px-3.5 py-1.5 rounded-full bg-[#f0f9ff] text-[#0ea5e9] border-none"
        >
          {skill}
        </span>
      ))}
      {!isExpanded && remainingCount > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="inline-flex items-center text-[12px] font-bold px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none"
        >
          +{remainingCount} more
        </button>
      )}
      {isExpanded && remainingCount > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
          className="inline-flex items-center text-[12px] font-bold px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none"
        >
          show less
        </button>
      )}
    </div>
  );
};

const ShowJobs = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "draft">("active");
  const [deleteJob] = useDeleteJobMutation();

  const queryParams = {
    page: currentPage,
    limit: 10,
    status:
      activeTab === "active"
        ? EMPLOYER_JOB_STATUS.PUBLISHED
        : EMPLOYER_JOB_STATUS.DRAFT,
  };

  const {
    data: latestJobsData,
    currentData: jobsData,
    isLoading,
    isFetching,
    error,
  } = useGetEmployerAllJobsQuery(queryParams);

  const paginationSource = jobsData ?? latestJobsData;
  const isTransitionLoading = isFetching && !jobsData;

  let jobs: Job[] = [];
  let totalPages = 1;

  if (paginationSource) {
    if (paginationSource.data && Array.isArray(paginationSource.data)) {
      jobs = paginationSource.data;
    } else if (Array.isArray(paginationSource)) {
      jobs = paginationSource;
    }

    const serverTotalPages = paginationSource.pagination?.totalPages;
    if (typeof serverTotalPages === "number" && serverTotalPages >= 1) {
      totalPages = serverTotalPages;
    } else {
      const total = paginationSource.pagination?.total ?? 0;
      const appliedLimit =
        paginationSource.pagination?.limit ?? queryParams.limit;
      totalPages = total > 0 ? Math.ceil(total / appliedLimit) : 1;
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = String(job.status ?? "")
        .toLowerCase()
        .trim();
      return activeTab === "draft"
        ? status === EMPLOYER_JOB_STATUS.DRAFT
        : ACTIVE_STATUSES.has(status);
    });
  }, [jobs, activeTab]);

  const totalForCurrentTab =
    jobsData?.pagination?.total ??
    (isTransitionLoading ? undefined : filteredJobs.length);

  useEffect(() => {
    if (isFetching && !paginationSource) return;
    const maxPage = Math.max(1, totalPages);
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, totalPages, isFetching, paginationSource]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleEditJob = (jobId: string | number) => {
    navigate(
      `/hire-talent/post-job?jobId=${encodeURIComponent(String(jobId))}`,
    );
  };

  const handleViewProfiles = (jobId: string | number) => {
    navigate(
      `/hire-talent/ai-shortlists?jobId=${encodeURIComponent(String(jobId))}`,
    );
  };

  const handleDeleteJob = async (jobId: string | number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone.",
      )
    ) {
      return;
    }
    try {
      await deleteJob({ id: jobId }).unwrap();
      toast.success("Job deleted successfully!");
    } catch (error) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || "Failed to delete job");
    }
  };

  if (error && !jobsData) {
    return (
      <div className="min-h-screen bg-[#f2f5fa] px-4 sm:px-8 py-6 sm:py-8 font-sans">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              All Jobs
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage all available job postings
            </p>
          </div>
          <Card className="border border-border/50 rounded-2xl shadow-[var(--shadow-card)]">
            <CardContent className="p-8">
              <div className="text-center text-destructive">
                <p>Error loading jobs. Please try again later.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f5fa] px-4 sm:px-8 py-6 sm:py-8 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-7">
        {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          All Jobs
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isTransitionLoading ? (
            <>Loading {activeTab === "draft" ? "draft" : "active"} jobs…</>
          ) : (
            <>
              Page {currentPage} of {totalPages} •{" "}
              {totalForCurrentTab}{" "}
              {activeTab === "draft" ? "draft" : "active"} job
              {totalForCurrentTab !== 1 ? "s" : ""}
            </>
          )}
        </p>
      </div>

      {/* Tab Filter */}
      <div className="flex">
        <div className="inline-flex bg-[#f6f4f0] rounded-[14px] p-1.5">
          <button
            onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
            className={`px-10 py-2.5 text-[14px] font-bold rounded-xl transition-all duration-200 ${
              activeTab === "active"
                ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => { setActiveTab("draft"); setCurrentPage(1); }}
            className={`px-10 py-2.5 text-[14px] font-bold rounded-xl transition-all duration-200 ${
              activeTab === "draft"
                ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Job Cards */}
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-64">
          <SpinnerLoader className="w-8 h-8 text-[#00e5ff]" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="border border-border/50 rounded-2xl shadow-[var(--shadow-card)]">
          <CardContent className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-bold text-foreground">
              No {activeTab === "draft" ? "draft" : "active"} jobs found
            </p>
            <p className="text-muted-foreground mt-1.5 text-sm">
              {activeTab === "draft"
                ? "You have no draft job postings"
                : "There are no active job postings to display"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const { label: statusLabel, className: statusClass } =
              getStatusBadgeProps(job.status);
            const skills = (job.skills ?? [])
              .map(getSkillName)
              .filter(Boolean);
            const salary = formatSalary(
              job.salaryMin as number | undefined,
              job.salaryMax as number | undefined,
              job.currency as string | undefined,
            );
            const experience = formatExperience(
              job.minExperience as number | undefined,
              job.maxExperience as number | undefined,
            );
            const applicants = (job.applicantCount as number) ?? 0;
            const aiMatches = (job.aiMatchCount as number) ?? 0;
            const interviews = (job.interviewCount as number) ?? 0;
            const postedAgo = formatTimeAgo(job.createdAt);

            return (
              <Card
                key={job.id}
                className="bg-white border border-gray-200/80 rounded-[24px] shadow-none hover:shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all duration-300 overflow-hidden group mb-4"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
                    {/* Left: Job Details */}
                    <div className="flex-1 space-y-4 min-w-0 pr-0 md:pr-4">
                      {/* Title & Status */}
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          className="text-[19px] md:text-[21px] font-bold text-gray-900 tracking-tight cursor-pointer hover:text-[#0ea5e9] transition-colors truncate"
                          onClick={() => handleViewJob(job)}
                          title={job.title}
                        >
                          {job.title}
                        </h3>
                        <Badge
                          className={`text-[12px] font-bold px-3 py-1 rounded-full ${statusClass}`}
                        >
                          {statusLabel}
                        </Badge>
                      </div>

                      {/* Meta Row */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-medium text-gray-500">
                        {job.location && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {job.location}
                            {job.workMode && ` / ${(job.workMode as string).charAt(0).toUpperCase() + (job.workMode as string).slice(1)}`}
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            {job.employmentType}
                          </span>
                        )}
                        {salary && (
                          <span className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            {salary}
                          </span>
                        )}
                        {postedAgo && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {postedAgo}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {job.description && (
                         <JobDescription description={job.description} />
                      )}

                      {/* Skills */}
                      <JobSkills skills={skills} />
                    </div>

                    {/* Right: Stats & Actions */}
                    <div className="md:w-[280px] lg:w-[320px] shrink-0 flex flex-col pt-2 md:pt-0 self-stretch">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-[#faf7f0] p-3.5 rounded-2xl flex flex-col justify-center">
                          <span className="text-[11px] font-medium text-gray-500 mb-1">
                            Applicants
                          </span>
                          <span className="text-[20px] font-extrabold text-gray-900">
                            {applicants}
                          </span>
                        </div>
                        <div className="bg-[#faf7f0] p-3.5 rounded-2xl flex flex-col justify-center">
                          <span className="text-[11px] font-medium text-gray-500 mb-1">
                            AI Matches
                          </span>
                          <span className="text-[20px] font-extrabold text-gray-900">
                            {aiMatches}
                          </span>
                        </div>
                        <div className="bg-[#faf7f0] p-3.5 rounded-2xl flex flex-col justify-center">
                          <span className="text-[11px] font-medium text-gray-500 mb-1">
                            Interviews
                          </span>
                          <span className="text-[20px] font-extrabold text-gray-900">
                            {interviews}
                          </span>
                        </div>
                        <div className="bg-[#faf7f0] p-3.5 rounded-2xl flex flex-col justify-center">
                          <span className="text-[11px] font-medium text-gray-500 mb-1">
                            Experience
                          </span>
                          <span className="text-[15px] font-extrabold text-gray-900 mt-1">
                            {experience || "—"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditJob(job.id)}
                          className="h-9 px-4 text-xs font-semibold rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 shadow-none"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          className="h-9 px-4 text-xs font-semibold rounded-xl border-red-100 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 shadow-none"
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleViewProfiles(job.id)}
                          className="h-9 px-4 text-xs font-bold rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-none shadow-sm"
                        >
                          View Candidates
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-xl border-border font-semibold h-9 px-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="rounded-xl border-border font-semibold h-9 px-4"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      <JobDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        job={selectedJob}
      />
      </div>
    </div>
  );
};

export default ShowJobs;

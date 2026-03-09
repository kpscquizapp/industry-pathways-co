import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Eye,
  Users,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import {
  useGetEmployerAllJobsQuery,
  useDeleteJobMutation,
  EMPLOYER_JOB_STATUS,
} from "@/app/queries/jobApi";
import type { Job } from "@/app/queries/aiShortlistApi";
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
      className: "bg-green-500 hover:bg-green-600 text-white",
    };
  }
  if (status === EMPLOYER_JOB_STATUS.DRAFT) {
    return {
      label: "Draft",
      className: "bg-yellow-100 hover:bg-yellow-200 text-yellow-800",
    };
  }
  if (status === EMPLOYER_JOB_STATUS.CLOSED) {
    return {
      label: "Closed",
      className: "bg-gray-400 hover:bg-gray-500 text-white",
    };
  }
  return {
    label: status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown",
    className: "bg-slate-200 hover:bg-slate-300 text-slate-700",
  };
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

  // Backend response shape from GET /employers/jobs:
  // { success: boolean, message: string, data: Job[], pagination: { total, page, limit } }
  let jobs: Job[] = [];
  let totalPages = 1;

  if (paginationSource) {
    if (paginationSource.data && Array.isArray(paginationSource.data)) {
      jobs = paginationSource.data;
    } else if (Array.isArray(paginationSource)) {
      // Fallback: raw array response (unlikely but defensive)
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

  // Server already filters by status via queryParams.status; keep a defensive
  // client-side filter in case a stale cache page mixes statuses.

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

  // Use server-reported total (already filtered by status) for accurate counts.
  const totalForCurrentTab =
    jobsData?.pagination?.total ??
    (isTransitionLoading ? undefined : filteredJobs.length);

  // Clamp currentPage so it never exceeds totalPages after data changes.
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Manage all available job postings
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-destructive">
              <p>Error loading jobs. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
          <p className="text-muted-foreground mt-2">
            {isTransitionLoading ? (
              <>Loading {activeTab === "draft" ? "draft" : "active"} jobs…</>
            ) : (
              <>
                Page {currentPage} of {totalPages} • {totalForCurrentTab}{" "}
                {activeTab === "draft" ? "draft" : "active"} job
                {totalForCurrentTab !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as "active" | "draft");
          setCurrentPage(1);
        }}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center h-64">
              <SpinnerLoader className="w-8 h-8 text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">
                No {activeTab === "draft" ? "draft" : "active"} jobs found
              </p>
              <p className="text-muted-foreground mt-1">
                {activeTab === "draft"
                  ? "You have no draft job postings"
                  : "There are no active job postings to display"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden lg:table-cell text-center">
                    Openings
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[180px] text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job, index) => (
                  <TableRow key={job.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {(currentPage - 1) *
                        (jobsData?.pagination?.limit ?? queryParams.limit) +
                        index +
                        1}
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-sm truncate max-w-[200px]">
                        {job.title}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {job.category || "N/A"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {job.employmentType || "N/A"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center text-sm">
                      {job.numberOfOpenings || 0}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const { label, className } = getStatusBadgeProps(
                          job.status,
                        );
                        return (
                          <Badge className={`whitespace-nowrap ${className}`}>
                            {label}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View job details"
                          aria-label={`View details for ${job.title || "job"}`}
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleViewJob(job)}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit job"
                          aria-label={`Edit ${job.title || "job"}`}
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleEditJob(job.id)}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete job"
                          aria-label={`Delete ${job.title || "job"}`}
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View matching profiles"
                          aria-label={`View matching profiles for ${job.title || "job"}`}
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleViewProfiles(job.id)}
                        >
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
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
  );
};

export default ShowJobs;

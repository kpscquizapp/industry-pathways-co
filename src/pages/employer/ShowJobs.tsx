import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useShowAllJobsQuery,
  useDeleteJobMutation,
} from "@/app/queries/jobApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import JobDetailsModal from "./JobDetailsModal";
import { toast } from "sonner";

const ShowJobs = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteJob] = useDeleteJobMutation();

  const queryParams = {
    page: currentPage,
    limit: 10,
  };

  const { data: jobsData, isLoading, error } = useShowAllJobsQuery(queryParams);

  // Handle different response structures
  let jobs: any[] = [];
  let totalPages = 1;

  if (jobsData) {
    if (Array.isArray(jobsData)) {
      jobs = jobsData;
    } else if (jobsData.data?.jobs && Array.isArray(jobsData.data.jobs)) {
      jobs = jobsData.data.jobs;
    } else if (jobsData.data && Array.isArray(jobsData.data)) {
      jobs = jobsData.data;
    } else if (jobsData.jobs && Array.isArray(jobsData.jobs)) {
      jobs = jobsData.jobs;
    }
  }

  // Extract totalPages from multiple possible response shapes
  // Check in order: jobsData.totalPages, jobsData.meta.totalPages, jobsData.data.totalPages, jobsData.data.meta.totalPages
  if (jobsData) {
    totalPages =
      jobsData.totalPages ||
      jobsData.meta?.totalPages ||
      jobsData.data?.totalPages ||
      jobsData.data?.meta?.totalPages ||
      jobsData.jobs?.totalPages ||
      jobsData.jobs?.meta?.totalPages ||
      1;
  }

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

  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleEditJob = (jobId: string | number) => {
    navigate(`/hire-talent/post-job?jobId=${jobId}`);
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

  if (error) {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Page {currentPage} of {totalPages} • {jobs.length} jobs on this page
        </p>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <SpinnerLoader className="w-8 h-8 text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">No jobs found</p>
                <p className="text-muted-foreground mt-1">
                  There are no job postings to display at this time
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job: any) => {
            const initials = (job.title || "J")
              .split(" ")
              .slice(0, 2)
              .map((word: string) => word[0])
              .join("")
              .toUpperCase();

            return (
              <Card
                key={job.id}
                className="hover:shadow-md transition-shadow border border-border bg-white"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/10">
                      <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {job.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {job.companyName || job.category || "General"}
                      </p>
                    </div>

                    {/* Job Category */}
                    <div className="hidden sm:flex flex-col items-center text-xs gap-0.5 min-w-fit">
                      <span className="text-muted-foreground text-[10px] uppercase font-medium">
                        Category
                      </span>
                      <span className="text-foreground font-semibold whitespace-nowrap">
                        {job.category || "N/A"}
                      </span>
                    </div>

                    {/* Employment Type */}
                    <div className="hidden md:flex flex-col items-center text-xs gap-0.5 min-w-fit">
                      <span className="text-muted-foreground text-[10px] uppercase font-medium">
                        Employment Type
                      </span>
                      <span className="text-foreground font-semibold">
                        {job.employmentType || "N/A"}
                      </span>
                    </div>

                    {/* Number of Openings */}
                    <div className="hidden lg:flex flex-col items-center text-xs gap-0.5 min-w-fit">
                      <span className="text-muted-foreground text-[10px] uppercase font-medium">
                        Openings
                      </span>
                      <span className="text-foreground font-semibold">
                        {job.numberOfOpenings || 0}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <Badge
                        className={`whitespace-nowrap ${
                          job.status === "published"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : job.status === "closed"
                              ? "bg-gray-400 hover:bg-gray-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-foreground"
                        }`}
                      >
                        {job.status === "published"
                          ? "Active"
                          : job.status === "closed"
                            ? "Closed"
                            : "Draft"}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="View job details"
                        className="hover:bg-muted"
                        onClick={() => handleViewJob(job)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit job"
                        className="hover:bg-muted"
                        onClick={() => handleEditJob(job.id)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete job"
                        className="hover:bg-muted"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Download job posting (Coming soon)"
                        className="hover:bg-muted opacity-50 cursor-not-allowed"
                        disabled
                        aria-label="Download job posting - Feature coming soon"
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {jobs.length > 0 && (
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

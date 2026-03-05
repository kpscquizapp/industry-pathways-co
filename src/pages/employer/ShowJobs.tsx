import React, { useState, useMemo } from "react";
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
} from "@/app/queries/jobApi";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import JobDetailsModal from "./JobDetailsModal";
import { toast } from "sonner";

const ShowJobs = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "draft">("active");
  const [deleteJob] = useDeleteJobMutation();

  const queryParams = {
    page: currentPage,
    limit: 10,
  };

  const {
    data: jobsData,
    isLoading,
    error,
  } = useGetEmployerAllJobsQuery(queryParams);

  // Backend response shape from GET /employers/jobs:
  // { success: boolean, message: string, data: Job[], pagination: { total, page, limit } }
  let jobs: any[] = [];
  let totalPages = 1;

  if (jobsData) {
    if (jobsData.data && Array.isArray(jobsData.data)) {
      jobs = jobsData.data;
    } else if (Array.isArray(jobsData)) {
      // Fallback: raw array response (unlikely but defensive)
      jobs = jobsData;
    }

    const total = jobsData.pagination?.total ?? 0;
    const limit = queryParams.limit;
    totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  }

  // Filter jobs by active tab
  const filteredJobs = useMemo(() => {
    if (activeTab === "draft") {
      return jobs.filter((job: any) => job.status === "draft");
    }
    return jobs.filter(
      (job: any) => job.status === "published" || job.status === "active",
    );
  }, [jobs, activeTab]);

  const activeCount = useMemo(
    () =>
      jobs.filter((j: any) => j.status === "published" || j.status === "active")
        .length,
    [jobs],
  );
  const draftCount = useMemo(
    () => jobs.filter((j: any) => j.status === "draft").length,
    [jobs],
  );

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

  const handleViewProfiles = (jobId: string | number) => {
    navigate(`/hire-talent/ai-shortlists?jobId=${jobId}`);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Jobs</h1>
          <p className="text-muted-foreground mt-2">
            Page {currentPage} of {totalPages} • {filteredJobs.length}{" "}
            {activeTab === "draft" ? "draft" : "active"} job
            {filteredJobs.length !== 1 ? "s" : ""} on this page
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
          <TabsTrigger value="active">
            Active{!isLoading && ` (${activeCount})`}
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft{!isLoading && ` (${draftCount})`}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Jobs Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
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
                {filteredJobs.map((job: any, index: number) => (
                  <TableRow key={job.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-muted-foreground">
                      {(currentPage - 1) * queryParams.limit + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate max-w-[200px]">
                          {job.title}
                        </p>
                        {/* <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {job.companyName || job.category || "General"}
                        </p> */}
                      </div>
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
                      <Badge
                        className={`whitespace-nowrap ${
                          job.status === "published" || job.status === "active"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : job.status === "closed"
                              ? "bg-gray-400 hover:bg-gray-500 text-white"
                              : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {job.status === "published" || job.status === "active"
                          ? "Active"
                          : job.status === "closed"
                            ? "Closed"
                            : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View job details"
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleViewJob(job)}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit job"
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleEditJob(job.id)}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete job"
                          className="h-8 w-8 hover:bg-muted"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View matching profiles"
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

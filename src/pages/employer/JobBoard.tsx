import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  Users,
  ClipboardCheck,
  Brain,
  UserCheck,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Pause,
  XCircle,
  ArrowUpDown,
  Filter,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetDashboardJobsQuery,
  useGetJobsQuery,
} from "@/app/queries/jobApi";

const JobBoard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const { data: jobs, isLoading: jobsLoading } = useGetJobsQuery("");
  const { data: Dashboard, isLoading: DashboardLoading } =
    useGetDashboardJobsQuery("");

  const stats = [
    {
      label: "Active Jobs",
      value: Dashboard?.data?.openJobs ?? 0,
      icon: Briefcase,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Candidates in Pipeline",
      value: Dashboard?.data?.candidatesInPipeline ?? 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Interviews Scheduled",
      value: Dashboard?.data?.interviewsScheduled ?? 0,
      icon: ClipboardCheck,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Offers Extended",
      value: Dashboard?.data?.offersExtended ?? 0,
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "AI Screened",
      value: Dashboard?.data?.aiScreened ?? 0,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
    },
  ];

  const mapApiJobToUiJob = (job: any) => {
    const employmentTypeMap: Record<string, string> = {
      "full-time": "Permanent",
      permanent: "Permanent",
      contract: "Contract",
      internship: "Internship",
      freelance: "Freelance",
    };
    const statusMap: Record<string, string> = {
      published: "Live",
      draft: "Draft",
      paused: "Paused",
      closed: "Closed",
    };
    return {
      id: job.id,
      title: job.title,
      employmentType:
        employmentTypeMap[job.employmentType] || job.employmentType,

      skills: job.skills?.map((s: any) => s.name) || [],

      applicants: job.applicantCount ?? 0, // backend not sending yet
      status: statusMap[job.status] || "Closed",

      postedDate: job.createdAt,
    };
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Live: "bg-green-100 text-green-700 border-green-200",
      Draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Closed: "bg-red-100 text-red-700 border-red-200",
      Paused: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return styles[status as keyof typeof styles] || styles.Draft;
  };

  const getTypeBadge = (type: string) => {
    return type === "Permanent"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-orange-50 text-orange-700 border-orange-200";
  };

  const apiJobs = jobs?.data?.jobs || [];

  const mappedJobs = apiJobs.map(mapApiJobToUiJob);

  const filteredJobs = mappedJobs
    .filter((job: any) => {
      const matchesSearch = (job.title ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || job.status.toLowerCase() === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        (job.employmentType ?? "").toLowerCase() === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a: any, b: any) => {
      if (sortBy === "date") {
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      }
      if (sortBy === "applicants") {
        return b.applicants - a.applicants;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Job Board</h1>
          <p className="text-muted-foreground">
            Manage your job postings and track hiring progress
          </p>
        </div>
        <Button
          onClick={() => navigate("/employer-dashboard/create-job")}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-lg", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters & Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="permanent">Permanent</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Posted Date</SelectItem>
                <SelectItem value="applicants">Applicants</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Job Title</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Skills Required</TableHead>
                <TableHead className="font-semibold text-center">
                  Applicants
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Posted</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobsLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              )}
              {filteredJobs.map((job: any) => (
                <TableRow key={job.id} className="hover:bg-muted/30">
                  <TableCell>
                    <button
                      onClick={() =>
                        navigate(`/employer-dashboard/job/${job.id}`)
                      }
                      className="font-medium text-primary hover:underline text-left"
                    >
                      {job.title}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getTypeBadge(job.employmentType)}
                    >
                      {job.employmentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      onClick={() =>
                        navigate(`/employer-dashboard/job/${job.id}/candidates`)
                      }
                      className="font-semibold text-primary hover:underline"
                    >
                      {job.applicants}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusBadge(job.status)}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/employer-dashboard/job/${job.id}`)
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`/employer-dashboard/edit-job/${job.id}`)
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Close
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!jobsLoading && filteredJobs.length === 0 && (
            <div className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-1">No jobs found</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters or create a new job posting.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobBoard;

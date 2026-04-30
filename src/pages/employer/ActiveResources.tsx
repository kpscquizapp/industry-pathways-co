import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  CheckCircle2,
  XCircle,
  Filter,
  Clock,
  AlertCircle,
  FileQuestion,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import {
  useGetBenchResourcesQuery,
  useDeleteBenchResourceMutation,
  usePermanentDeleteBenchResourceMutation,
} from "@/app/queries/benchApi";
import CandidateProfileModal, {
  CandidateProfile,
} from "@/components/employer/candidates/CandidateProfileModal";

const ActiveResources = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkills, setFilterSkills] = useState("");
  const [deploymentPreference, setDeploymentPreference] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [isActive, setIsActive] = useState<boolean | string>("true");

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    filterSkills,
    deploymentPreference,
    minExperience,
    maxExperience,
    minRate,
    maxRate,
    availableFrom,
    isActive,
  ]);

  type BenchResource = {
    id: number;
    resourceName: string;
    currentRole: string;
    hourlyRate: number;
    availableFrom?: string | null;
    deploymentPreference?: string | string[] | null;
    totalExperience: number;
    isActive: boolean;
    technicalSkills?: string[];
    professionalSummary?: string;
    requireNonSolicitation?: boolean;
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterSkills("");
    setDeploymentPreference("");
    setMinExperience("");
    setMaxExperience("");
    setMinRate("");
    setMaxRate("");
    setAvailableFrom("");
    setIsActive("true");
  };

  const [selectedResource, setSelectedResource] =
    useState<BenchResource | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Mapper function to convert BenchResource to CandidateProfile
  const mapResourceToCandidateProfile = (
    resource: BenchResource,
  ): CandidateProfile => {
    // Parse and format deployment preference
    const formatDeploymentPreference = (): string => {
      if (!resource.deploymentPreference) return "Not specified";

      let prefs: string[] = [];

      // Handle array or JSON string
      if (Array.isArray(resource.deploymentPreference)) {
        prefs = resource.deploymentPreference;
      } else if (typeof resource.deploymentPreference === "string") {
        try {
          const parsed = JSON.parse(resource.deploymentPreference);
          prefs = Array.isArray(parsed)
            ? parsed
            : [resource.deploymentPreference];
        } catch {
          prefs = [resource.deploymentPreference];
        }
      }

      // Format with proper capitalization
      return prefs
        .map((pref) => {
          const lower = pref.toLowerCase();
          if (lower === "onsite") return "On-site";
          if (lower === "remote") return "Remote";
          if (lower === "hybrid") return "Hybrid";
          return pref.charAt(0).toUpperCase() + pref.slice(1);
        })
        .join(", ");
    };

    return {
      id: resource.id,
      name: resource.resourceName,
      role: resource.currentRole,
      hourlyRate: {
        min: resource.hourlyRate,
        max: resource.hourlyRate,
      },
      availability: resource.availableFrom
        ? new Date(resource.availableFrom).toLocaleDateString()
        : "Immediate",
      location: formatDeploymentPreference(),
      experience: `${Number(resource.totalExperience)} years`,
      type: "bench",
      requireNonSolicitation: resource.requireNonSolicitation || false,
      skills: resource.technicalSkills || [],
      about: resource.professionalSummary || "",
    };
  };

  const queryParams = {
    page,
    limit,
    search: searchQuery || undefined,
    skills: filterSkills || undefined,
    deploymentPreference: deploymentPreference || undefined,
    minExperience: minExperience || undefined,
    maxExperience: maxExperience || undefined,
    minRate: minRate || undefined,
    maxRate: maxRate || undefined,
    availableFrom: availableFrom || undefined,
    isActive: isActive === "all" ? undefined : isActive === "true",
  };

  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBenchResourcesQuery(queryParams);
  const resources = apiData?.data ?? [
    { id: 1, resourceName: "Rahul Verma", employeeId: "EMP-824", currentRole: "Senior Backend Developer", technicalSkills: ["Node.js", "AWS", "MongoDB"], totalExperience: 7, hourlyRate: 50, isActive: true },
    { id: 2, resourceName: "Sarah Chen", employeeId: "EMP-912", currentRole: "UI/UX Designer", technicalSkills: ["Figma", "Prototyping", "User Research"], totalExperience: 5, hourlyRate: 45, isActive: true },
  ]
  const pagination = apiData?.pagination || {
    total: 0,
    page: 1,
    totalPages: 6,
    limit: 10,
  };
  const [deleteBenchResource] = useDeleteBenchResourceMutation();
  const [permanentDeleteBenchResource] = usePermanentDeleteBenchResourceMutation();

  const handleViewResource = (resource: any) => {
    setSelectedResource(resource);
    setIsDetailOpen(true);
  };

  const handleDeleteResource = async (id: number | string) => {
    try {
      await deleteBenchResource(id).unwrap();
      toast.success("Resource removed successfully");
      // refetch(); // Not needed if tags are correctly set in RTK Query
    } catch (error) {
      toast.error("Failed to remove resource");
      console.error("Failed to delete resource:", error);
    }
  };

  const handlePermanentDeleteResource = async (id: number | string) => {
    try {
      await permanentDeleteBenchResource(id).unwrap();
      toast.success("Resource permanently deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to permanently delete resource");
      console.error("Failed to permanently delete resource:", error);
    }
  };

  const handleEditResource = (id: number) => {
    navigate(`/bench-dashboard/post-bench-resource?edit=${id}`);
  };

  const activeCount = resources.filter((r: any) => r.isActive).length;
  const inactiveCount = resources.filter((r: any) => !r.isActive).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Active Resources
            </h1>
            <p className="text-slate-500">
              Manage and track your published bench talent, monitor their availability, and handle requests.
            </p>
          </div>
          <Button
            onClick={() => navigate("/bench-dashboard/post-bench-resource")}
            className="h-10 px-4 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium shrink-0"
          >
            + Add Resource
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Resources</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {pagination.total}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shadow-sm">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active on Bench</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {activeCount}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-md bg-green-100/60 flex items-center justify-center shadow-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border bg-slate-50 shadow-sm rounded-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Currently Contracted</p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {pagination.page} / {pagination.totalPages}
                  </p>
                </div>

                <div className="h-9 w-9 rounded-md bg-amber-50 flex items-center justify-center shadow-sm">
                  <Briefcase className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Advanced Filters */}
        <Card className="border border-slate-200 shadow-sm rounded-xl bg-white">
          <CardContent className="p-6 space-y-4">
            {/* Search */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, employee ID, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none w-full"
                />
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Skills */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Skills</p>
                <div className="relative">
                  <Input
                    placeholder="Select skills..."
                    value={filterSkills}
                    onChange={(e) => setFilterSkills(e.target.value)}
                    className="h-10 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Experience (Years)</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    className="h-10 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxExperience}
                    onChange={(e) => setMaxExperience(e.target.value)}
                    className="h-10 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Hourly Rate ($)</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minRate}
                    onChange={(e) => setMinRate(e.target.value)}
                    className="h-10 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxRate}
                    onChange={(e) => setMaxRate(e.target.value)}
                    className="h-10 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              {/* Availability Date */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Availability Date</p>
                <div className="relative">
                  <Input
                    type="date"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="h-12 px-4 py-2.5 rounded-xl bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#4DD9E8] focus-visible:ring-[#4DD9E8] focus-visible:ring-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Status + Deployment + Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              {/* Status */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Status</p>
                <select
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none rounded-xl text-sm text-slate-600"
                >
                  <option value="all">All Statuses</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Deployment Type */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500">Deployment Type</p>
                <select
                  value={deploymentPreference}
                  onChange={(e) => setDeploymentPreference(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#4DD9E8] outline-none rounded-xl text-sm text-slate-600"
                >
                  <option value="">All Preferences</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex flex-wrap justify-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-sm text-slate-500 hover:bg-[#1e293b] h-10 px-4"
                >
                  ✕ Clear All Filters
                </Button>
                {/* <Button
          variant="outline"
          size="sm"
          className="text-sm h-10 px-4 rounded-xl hover:bg-[#1e293b]"
        >
          ⊞ More Filters
        </Button> */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Table */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-20 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading resources...</p>
              </div>
            ) : isError ? (
              <div className="p-6">
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-700 font-semibold ml-2">
                    Failed to load resources
                  </AlertTitle>
                  <AlertDescription className="text-red-600 mt-2 ml-2">
                    <div className="flex flex-col gap-3">
                      <p>
                        {
                          "There was an error loading the resources. Please try again later."
                        }
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetch()}
                          className="w-fit border-red-200 hover:bg-red-600 text-red-700 gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Try Again
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearAllFilters}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="overflow-x-auto"><Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wide">
                      Resource Name & Role
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wide">
                      Top Skills
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wide">
                      Exp.
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wide">
                      Rate
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wide">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wide text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource: any) => (
                    <TableRow
                      key={resource.id}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => handleViewResource(resource)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {resource.resourceName} {resource.employeeId ? `(${resource.employeeId})` : ""}
                          </p>
                          <p className="text-sm text-slate-500">
                            {resource.currentRole}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {resource.technicalSkills
                            ?.slice(0, 2)
                            .map((skill: string) => (
                              <Badge
                                key={skill}
                                className="bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-normal"
                              >
                                {skill}
                              </Badge>
                            ))}
                          {resource.technicalSkills?.length > 2 && (
                            <Badge className="bg-slate-100 text-slate-600 text-xs font-normal">
                              +{resource.technicalSkills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {Number(resource.totalExperience)} Yrs
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-800">
                          ${resource.hourlyRate}/hr
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${resource.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                        >
                          {resource.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:bg-transparent hover:text-sky-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewResource(resource);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-sky-500 hover:bg-sky-50 active:bg-sky-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditResource(resource.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <div onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-sky-500 hover:bg-sky-50 active:bg-sky-50"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {resource.isActive ? (
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteResource(resource.id);
                                    }}
                                  >
                                    Remove
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handlePermanentDeleteResource(resource.id);
                                    }}
                                  >
                                    Delete Permanently
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table></div>
            )}

            {/* Pagination Controls */}
            {!isLoading && !isError && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/30">
                <div className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {(page - 1) * limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-700">
                    {Math.min(page * limit, pagination.total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">
                    {pagination.total}
                  </span>{" "}
                  resources
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg h-8"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg ${page === p ? "" : "text-slate-600"}`}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === pagination.totalPages}
                    onClick={() =>
                      setPage((p) => Math.min(pagination.totalPages, p + 1))
                    }
                    className="rounded-lg h-8"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && !isError && resources.length === 0 && (
              <div className="p-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FileQuestion className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  No resources found
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-6">
                  We couldn't find any resources matching your current filters.
                  Try adjusting your search criteria.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-sm text-slate-500 hover:bg-[#1e293b] hover:text-white h-10 px-4 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Detail Modal */}
        {selectedResource && (
          <CandidateProfileModal
            open={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            candidate={mapResourceToCandidateProfile(selectedResource)}
            onScheduleInterview={(candidate) => {
              toast.info(`Scheduling interview with ${candidate.name}`);
            }}
            onShortlist={(candidate) => {
              toast.success(`${candidate.name} added to shortlist`);
            }}
            onSkillTest={(candidate) => {
              toast.info(`Initiating skill test for ${candidate.name}`);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ActiveResources;

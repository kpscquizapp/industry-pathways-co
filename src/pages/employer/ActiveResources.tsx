import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetBenchResourcesQuery, useDeleteBenchResourceMutation } from "@/app/queries/benchApi";
import CandidateProfileModal, { CandidateProfile } from "@/components/employer/candidates/CandidateProfileModal";

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
  
  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Mapper function to convert BenchResource to CandidateProfile
  const mapResourceToCandidateProfile = (resource: any): CandidateProfile => ({
    id: resource.id,
    name: resource.resourceName,
    role: resource.currentRole,
    hourlyRate: { 
      min: resource.hourlyRate, 
      max: resource.hourlyRate 
    },
    availability: resource.availableFrom ? new Date(resource.availableFrom).toLocaleDateString() : "Immediate",
    location: resource.deploymentPreference || "Remote",
    experience: `${resource.totalExperience} years`,
    type: 'bench',
    skills: resource.technicalSkills || [],
    about: resource.professionalSummary || "",
  });

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

  const { data: apiData, isLoading, isError, refetch } = useGetBenchResourcesQuery(queryParams);
  const resources = apiData?.data || [];
  const pagination = apiData?.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 };

  const [deleteBenchResource] = useDeleteBenchResourceMutation();

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

  const handleEditResource = (id: number) => {
    navigate(`/employer-dashboard/post-bench-resource?edit=${id}`);
  };

  const activeCount = resources.filter((r: any) => r.isActive).length;
  const inactiveCount = resources.filter((r: any) => !r.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Active Resources</h1>
            <p className="text-slate-500">Manage your bench talent and assignments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Resources</p>
                  <p className="text-2xl font-bold text-slate-800">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active</p>
                  <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Page</p>
                  <p className="text-2xl font-bold text-amber-600">{pagination.page} / {pagination.totalPages}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Advanced Filters */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search name, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl border-slate-200"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Skills (react, node...)"
                  value={filterSkills}
                  onChange={(e) => setFilterSkills(e.target.value)}
                  className="pl-9 h-10 rounded-xl border-slate-200"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Min Exp"
                  type="number"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
                <Input
                  placeholder="Max Exp"
                  type="number"
                  value={maxExperience}
                  onChange={(e) => setMaxExperience(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Min Rate"
                  type="number"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
                <Input
                  placeholder="Max Rate"
                  type="number"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  className="h-10 rounded-xl border-slate-200"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Status:</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={isActive === "true" ? "default" : "outline"}
                    onClick={() => setIsActive("true")}
                    className="rounded-lg h-8 px-3 text-xs"
                  >
                    Active
                  </Button>
                  <Button
                    size="sm"
                    variant={isActive === "false" ? "default" : "outline"}
                    onClick={() => setIsActive("false")}
                    className="rounded-lg h-8 px-3 text-xs"
                  >
                    Inactive
                  </Button>
                  <Button
                    size="sm"
                    variant={isActive === "all" ? "default" : "outline"}
                    onClick={() => setIsActive("all")}
                    className="rounded-lg h-8 px-3 text-xs"
                  >
                    All
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Preference:</span>
                <select
                  value={deploymentPreference}
                  onChange={(e) => setDeploymentPreference(e.target.value)}
                  className="h-8 rounded-lg border-slate-200 text-xs px-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Available Before:</span>
                <Input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="h-8 rounded-lg border-slate-200 text-xs px-2 w-32"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterSkills("");
                  setDeploymentPreference("");
                  setMinExperience("");
                  setMaxExperience("");
                  setMinRate("");
                  setMaxRate("");
                  setAvailableFrom("");
                  setIsActive("true");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 font-medium ml-auto"
              >
                Clear all filters
              </Button>
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
              <div className="p-20 text-center">
                <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-slate-500">Error loading resources. Please try again.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Resource</TableHead>
                    <TableHead className="font-semibold text-slate-700">Skills</TableHead>
                    <TableHead className="font-semibold text-slate-700">Experience</TableHead>
                    <TableHead className="font-semibold text-slate-700">Rate</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource: any) => (
                  <TableRow
                    key={resource.id}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    onClick={() => handleViewResource(resource)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {resource.resourceName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{resource.resourceName}</p>
                          <p className="text-sm text-slate-500">{resource.currentRole}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {resource.technicalSkills?.slice(0, 2).map((skill: string) => (
                          <Badge
                            key={skill}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {resource.technicalSkills?.length > 2 && (
                          <Badge className="bg-slate-100 text-slate-600 text-xs">
                            +{resource.technicalSkills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{resource.totalExperience} years</TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-800">
                        {resource.hourlyRate}
                      </span>
                      <span className="text-slate-500">/hr</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          resource.isActive
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {resource.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewResource(resource); }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditResource(resource.id); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); handleDeleteResource(resource.id); }}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            )}
            
            {/* Pagination Controls */}
            {!isLoading && !isError && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/30">
                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-700">{(page - 1) * limit + 1}</span> to{" "}
                  <span className="font-medium text-slate-700">
                    {Math.min(page * limit, pagination.total)}
                  </span>{" "}
                  of <span className="font-medium text-slate-700">{pagination.total}</span> resources
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
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
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
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="rounded-lg h-8"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && resources.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No resources found</p>
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
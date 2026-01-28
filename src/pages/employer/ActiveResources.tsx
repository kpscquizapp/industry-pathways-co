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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Calendar,
  Building2,
  User,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

// Mock data for resources
const mockResources = [
  {
    id: "1",
    name: "John D.",
    role: "Senior Java Developer",
    skills: ["Java Spring Boot", "Microservices", "Kubernetes", "PostgreSQL"],
    experience: "8-10 years",
    rate: 75,
    currency: "USD",
    status: "assigned",
    availableFrom: "2024-01-15",
    locationPreference: ["Remote", "Hybrid"],
    summary: "Experienced Java developer with expertise in building scalable microservices architecture. Led multiple enterprise projects with 99.9% uptime.",
    assignment: {
      clientName: "TechCorp Inc.",
      projectName: "Cloud Migration Platform",
      billingRate: 95,
      startDate: "2024-02-01",
      endDate: "2024-08-31",
      hoursPerWeek: 40,
      totalBilled: 28500,
    },
  },
  {
    id: "2",
    name: "Sarah M.",
    role: "React Frontend Developer",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    experience: "5-8 years",
    rate: 65,
    currency: "USD",
    status: "available",
    availableFrom: "2024-01-10",
    locationPreference: ["Remote"],
    summary: "Frontend specialist with a passion for creating beautiful, accessible user interfaces. Strong focus on performance optimization.",
    assignment: null,
  },
  {
    id: "3",
    name: "Mike R.",
    role: "DevOps Engineer",
    skills: ["AWS", "Docker", "Terraform", "CI/CD", "Python"],
    experience: "5-8 years",
    rate: 80,
    currency: "USD",
    status: "assigned",
    availableFrom: "2024-01-20",
    locationPreference: ["Remote", "On-site"],
    summary: "DevOps expert specializing in cloud infrastructure and automation. Reduced deployment time by 80% in previous engagements.",
    assignment: {
      clientName: "FinanceHub LLC",
      projectName: "Infrastructure Modernization",
      billingRate: 100,
      startDate: "2024-01-25",
      endDate: "2024-06-30",
      hoursPerWeek: 40,
      totalBilled: 16000,
    },
  },
  {
    id: "4",
    name: "Emily K.",
    role: "Data Scientist",
    skills: ["Python", "TensorFlow", "SQL", "Machine Learning"],
    experience: "3-5 years",
    rate: 70,
    currency: "USD",
    status: "available",
    availableFrom: "2024-02-01",
    locationPreference: ["Hybrid"],
    summary: "Data scientist with expertise in building predictive models and deriving actionable insights from complex datasets.",
    assignment: null,
  },
];

const ActiveResources = () => {
  const [resources, setResources] = useState(mockResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<typeof mockResources[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "assigned" | "available">("all");

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesFilter =
      filterStatus === "all" || resource.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewResource = (resource: typeof mockResources[0]) => {
    setSelectedResource(resource);
    setIsDetailOpen(true);
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
    toast.success("Resource removed successfully");
  };

  const handleEditResource = (id: string) => {
    toast.info("Edit functionality coming soon");
  };

  const assignedCount = resources.filter((r) => r.status === "assigned").length;
  const availableCount = resources.filter((r) => r.status === "available").length;

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
                  <p className="text-2xl font-bold text-slate-800">{resources.length}</p>
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
                  <p className="text-sm text-slate-500">Assigned</p>
                  <p className="text-2xl font-bold text-emerald-600">{assignedCount}</p>
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
                  <p className="text-sm text-slate-500">Available</p>
                  <p className="text-2xl font-bold text-amber-600">{availableCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by name, role, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-slate-200"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                  className="rounded-xl"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "assigned" ? "default" : "outline"}
                  onClick={() => setFilterStatus("assigned")}
                  className="rounded-xl"
                >
                  Assigned
                </Button>
                <Button
                  variant={filterStatus === "available" ? "default" : "outline"}
                  onClick={() => setFilterStatus("available")}
                  className="rounded-xl"
                >
                  Available
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Table */}
        <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-0">
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
                {filteredResources.map((resource) => (
                  <TableRow
                    key={resource.id}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    onClick={() => handleViewResource(resource)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {resource.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{resource.name}</p>
                          <p className="text-sm text-slate-500">{resource.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {resource.skills.slice(0, 2).map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {resource.skills.length > 2 && (
                          <Badge className="bg-slate-100 text-slate-600 text-xs">
                            +{resource.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{resource.experience}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-slate-800">
                        ${resource.rate}
                      </span>
                      <span className="text-slate-500">/hr</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          resource.status === "assigned"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {resource.status === "assigned" ? "Assigned" : "Available"}
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
            {filteredResources.length === 0 && (
              <div className="p-12 text-center">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No resources found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resource Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedResource && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      {selectedResource.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{selectedResource.name}</h2>
                      <p className="text-slate-500 font-normal">{selectedResource.role}</p>
                    </div>
                    <Badge
                      className={`ml-auto ${
                        selectedResource.status === "assigned"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {selectedResource.status === "assigned" ? "Assigned" : "Available"}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Resource Info */}
                  <Card className="border border-slate-200 rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        Resource Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600">{selectedResource.summary}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Briefcase className="h-4 w-4 text-slate-400" />
                          <span>{selectedResource.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span>${selectedResource.rate}/hr ({selectedResource.currency})</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>Available: {selectedResource.availableFrom}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{selectedResource.locationPreference.join(", ")}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedResource.skills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assignment Info (if assigned) */}
                  {selectedResource.assignment && (
                    <Card className="border border-emerald-200 bg-emerald-50/50 rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                          <Building2 className="h-5 w-5 text-emerald-600" />
                          Assignment Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-slate-500">Client</p>
                            <p className="font-semibold text-slate-800">
                              {selectedResource.assignment.clientName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Project</p>
                            <p className="font-semibold text-slate-800">
                              {selectedResource.assignment.projectName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Start Date</p>
                            <p className="font-semibold text-slate-800">
                              {selectedResource.assignment.startDate}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">End Date</p>
                            <p className="font-semibold text-slate-800">
                              {selectedResource.assignment.endDate}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-emerald-200 pt-4">
                          <p className="text-sm font-medium text-emerald-700 mb-3">Billing Information</p>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                              <p className="text-2xl font-bold text-emerald-600">
                                ${selectedResource.assignment.billingRate}
                              </p>
                              <p className="text-xs text-slate-500">Billing Rate/hr</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                              <p className="text-2xl font-bold text-slate-800">
                                {selectedResource.assignment.hoursPerWeek}
                              </p>
                              <p className="text-xs text-slate-500">Hours/Week</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center border border-emerald-200">
                              <p className="text-2xl font-bold text-blue-600">
                                ${selectedResource.assignment.totalBilled.toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-500">Total Billed</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Not Assigned Info */}
                  {!selectedResource.assignment && (
                    <Card className="border border-amber-200 bg-amber-50/50 rounded-xl">
                      <CardContent className="p-6 text-center">
                        <Clock className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                        <p className="font-semibold text-slate-800 mb-1">Currently Available</p>
                        <p className="text-sm text-slate-500">
                          This resource is not assigned to any project and is ready for new opportunities.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailOpen(false)}
                      className="rounded-xl"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => handleEditResource(selectedResource.id)}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Resource
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ActiveResources;
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Clock,
  FileText,
  Zap,
  Heart,
  X,
} from "lucide-react";

interface Job {
  id: number | string;
  title: string;
  description?: string;
  companyName?: string;
  status?: string;
  role?: string;
  employmentType?: string;
  location?: string;
  state?: string;
  salaryMin?: number | string;
  salaryMax?: number | string;
  postedAt?: string;
  numberOfOpenings?: number;
  category?: string;
  experienceLevel?: string;
  skills?: Array<{ name: string }>;
  qualifications?: string[];
  responsibilities?: string[];
  educationQualification?: string;
  languagesKnown?: string;
  workMode?: string;
  duration?: number | string;
  durationUnit?: string;
  healthInsurance?: boolean;
  esops?: boolean;
  performanceBonus?: boolean;
  remoteAllowance?: boolean;
  enableAIMatching?: boolean;
  autoScreenCandidates?: boolean;
  enableSkillAssessment?: boolean;
  scheduleAIInterview?: boolean;
  applicationDeadline?: string;
  createdAt?: string;
}

interface JobDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  open,
  onOpenChange,
  job,
}) => {
  if (!job) return null;

  const getStatusBadgeStyle = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "published":
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const displaySalary = (
    min: number | string | undefined,
    max: number | string | undefined,
  ) => {
    const parsedMin = parseFloat(String(min));
    const parsedMax = parseFloat(String(max));
    const minFinite = Number.isFinite(parsedMin);
    const maxFinite = Number.isFinite(parsedMax);

    if (minFinite && maxFinite) {
      return `$${parsedMin.toLocaleString()} - $${parsedMax.toLocaleString()}`;
    } else if (minFinite) {
      return `$${parsedMin.toLocaleString()}+`;
    } else if (maxFinite) {
      return `Up to $${parsedMax.toLocaleString()}`;
    }
    return "Not Disclosed";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-2xl font-bold">
              {job.title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {job.companyName || "Company"} • ID: {job.id}
            </p>
          </div>
          <Badge className={getStatusBadgeStyle(job.status)}>
            {job.status === "published" || job.status === "active"
              ? "Active"
              : job.status === "closed"
                ? "Closed"
                : job.status || "Draft"}
          </Badge>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Employment Type</p>
                <p className="font-medium">{job.employmentType || "N/A"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">
                  {job.location || "N/A"}
                  {job.state ? `, ${job.state}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Salary Range</p>
                <p className="font-medium">
                  {displaySalary(job.salaryMin, job.salaryMax)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Openings</p>
                <p className="font-medium">{job.numberOfOpenings || 1}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {job.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          {/* Job Category & Role */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Category & Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium">{job.category || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <p className="font-medium">{job.role || job.title || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Experience & Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Experience & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Experience Level
                </p>
                <p className="font-medium">
                  {job.experienceLevel || "Not specified"}
                </p>
              </div>

              {job.skills && job.skills?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((item: any, idx: number) => {
                      const skillLabel =
                        typeof item === "string" ? item : item?.name || "";
                      return (
                        <Badge key={`${skillLabel}-${idx}`} variant="default">
                          {skillLabel}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {job.educationQualification && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Education
                  </p>
                  <p className="font-medium">{job.educationQualification}</p>
                </div>
              )}

              {job.languagesKnown && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Languages
                  </p>
                  <p className="font-medium">{job.languagesKnown}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Mode & Duration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Work Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {job.workMode && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Work Mode
                  </p>
                  <p className="font-medium">{job.workMode}</p>
                </div>
              )}
              {job.duration && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium">
                    {job.duration} {job.durationUnit}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Perks & Benefits */}
          {(job.healthInsurance ||
            job.esops ||
            job.performanceBonus ||
            job.remoteAllowance) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Perks & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {job.healthInsurance && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Health Insurance
                    </div>
                  )}
                  {job.esops && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      ESOPs
                    </div>
                  )}
                  {job.performanceBonus && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Performance Bonus
                    </div>
                  )}
                  {job.remoteAllowance && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Remote Allowance
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI & Screening Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI & Screening Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI Matching</span>
                <Badge variant={job.enableAIMatching ? "default" : "outline"}>
                  {job.enableAIMatching ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Auto Screen Candidates</span>
                <Badge
                  variant={job.autoScreenCandidates ? "default" : "outline"}
                >
                  {job.autoScreenCandidates ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Skill Assessment</span>
                <Badge
                  variant={job.enableSkillAssessment ? "default" : "outline"}
                >
                  {job.enableSkillAssessment ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Schedule AI Interview</span>
                <Badge
                  variant={job.scheduleAIInterview ? "default" : "outline"}
                >
                  {job.scheduleAIInterview ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {job.applicationDeadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Application Deadline
                  </p>
                  <p className="font-medium">
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>
              </div>
            )}
            {job.createdAt && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Posted On</p>
                  <p className="font-medium">{formatDate(job.createdAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;

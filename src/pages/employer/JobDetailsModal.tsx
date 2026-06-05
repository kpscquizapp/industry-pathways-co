import React, { useMemo } from "react";
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
  numberOfOpenings?: number;
  category?: string;
  experienceLevel?: string;
  minExperience?: number | null;
  maxExperience?: number | null;
  skills?: Array<string | { name: string }>;
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

const JobDescription = ({ description }: { description: string }) => {
  const formattedText = useMemo(() => {
    return description
      .replace(/<\/p>/gi, "\n")
      .replace(/<br\s*\/?\>/gi, "\n")
      .replace(/([^\n])([A-Z][^:\n]{2,30}:)/g, "$1\n$2")
      .replace(/<[^>]*>/g, "")
      .trim();
  }, [description]);

  return (
    <div className="mt-1">
      <div className="text-[14px] sm:text-base text-gray-700 leading-relaxed">
        <div className="space-y-1.5 text-justify">
          {formattedText.split("\n").map((line, i) => {
            const match = line.match(/^([^:]+):/);
            if (match) {
              const header = match[1];
              const rest = line.slice(header.length + 1);
              return (
                <div key={i}>
                  <span className="font-bold text-gray-800">{header}:</span>
                  {rest}
                </div>
              );
            }
            return (
              <div key={i} className={line.startsWith("•") ? "pl-2" : ""}>
                <span className="text-sm sm:text-base">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  open,
  onOpenChange,
  job,
}) => {
  if (!job) return null;

  const getExperienceLevelFromYears = (
    min?: number | null,
    max?: number | null,
    experienceLevel?: string,
  ) => {
    if (min === undefined || min === null) {
      return experienceLevel?.trim() || "Not specified";
    }

    if (min === 0 && max === 2) return "Junior (0-2 Years)";
    if (min === 3 && max === 5) return "Mid Level (3-5 Years)";
    if (min === 6 && max === 9) return "Mid Senior (6-9 Years)";
    if (min === 10 && max === null) return "Senior (10+ Years)";
    if (min === 10 && max === undefined) return "Senior (10+ Years)";
    if (min === 15 && (max === null || max === undefined))
      return "Lead/Principal (15+ Years)";

    // Fallback to displaying the range
    if (max === null || max === undefined) return `${min}+ Years`;
    return `${min}-${max} Years`;
  };

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
    const date = new Date(dateString);
    // Check if the date is valid
    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }
    return date.toLocaleDateString("en-US", {
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
      <DialogContent className="w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto px-4 sm:px-6 md:px-8">
        <DialogHeader className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-lg sm:text-2xl md:text-3xl font-bold">
              {job.title}
            </DialogTitle>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-left">
              {job.companyName || "Company"} • ID: {job.id}
            </p>
            <div
              className={`${getStatusBadgeStyle(job.status)} flex-start text-left mt-2 w-fit px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize`}
            >
              {job.status === "published" || job.status === "active"
                ? "Active"
                : job.status === "closed"
                  ? "Closed"
                  : job.status || "Draft"}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Employment Type
                </p>
                <p className="font-medium text-sm sm:text-base">
                  {job.employmentType || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Location
                </p>
                <p className="font-medium text-sm sm:text-base">
                  {job.location || "N/A"}
                  {job.state ? `, ${job.state}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Salary Range
                </p>
                <p className="font-medium text-sm sm:text-base">
                  {displaySalary(job.salaryMin, job.salaryMax)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Openings
                </p>
                <p className="font-medium text-sm sm:text-base">
                  {job.numberOfOpenings ?? 1}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              {job.description ? (
                <JobDescription description={job.description} />
              ) : (
                <p className="text-sm text-foreground">
                  No description provided
                </p>
              )}
            </CardContent>
          </Card>

          {/* Job Category & Role */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Category & Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm sm:text-base">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium capitalize">
                  {job.category || "N/A"}
                </p>
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
            <CardContent className="space-y-4 text-sm sm:text-base">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Experience Level
                </p>
                <p className="font-medium">
                  {getExperienceLevelFromYears(
                    job.minExperience,
                    job.maxExperience,
                    job.experienceLevel,
                  )}
                </p>
              </div>

              {job.skills && job.skills?.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Required Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(
                      (item: string | { name: string }, idx: number) => {
                        const skillLabel =
                          typeof item === "string" ? item : item?.name || "";
                        return (
                          <Badge key={`${skillLabel}-${idx}`} variant="default">
                            {skillLabel}
                          </Badge>
                        );
                      },
                    )}
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
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          {/* <Card>
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
          </Card> */}

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
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

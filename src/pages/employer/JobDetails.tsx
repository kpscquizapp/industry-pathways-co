import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  ClipboardCheck,
  Brain,
  Edit,
  Pause,
  XCircle,
  Calendar,
  CheckCircle2,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetJobsByIdQuery } from "@/app/queries/jobApi";

const employmentTypeMap: Record<string, string> = {
  "full-time": "Permanent",
  permanent: "Permanent",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
};

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const numericJobId = Number(jobId);
  const isInvalidJobId = !jobId || Number.isNaN(numericJobId);

  const { data, isLoading, isError } = useGetJobsByIdQuery(
    { id: numericJobId },
    { skip: isInvalidJobId },
  );

  if (isInvalidJobId) {
    return <div className="p-6">Invalid job ID</div>;
  }
  const apiJob = data?.data?.[0];

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError || !apiJob) return <div className="p-6">Job not found</div>;

  const statusMap: Record<string, string> = {
    published: "Live",
    draft: "Draft",
    paused: "Paused",
    closed: "Closed",
  };

  const jobData = {
    title: apiJob.title,
    description: apiJob.description,

    status: statusMap[apiJob.status] || "Draft",

    employmentType:
      employmentTypeMap[apiJob.employmentType] || apiJob.employmentType,

    experienceLevel: apiJob.experienceLevel || "Not specified",
    workMode: apiJob.workMode || "Not specified",
    location: apiJob.workLocation || "Not specified",
    salaryRange:
      apiJob.salaryMin && apiJob.salaryMax
        ? `${apiJob.currency} ${apiJob.salaryMin} - ${apiJob.salaryMax}`
        : "Not Disclosed",

    postedDate: apiJob.createdAt,

    applicants: Number(apiJob.applicationCount || 0),

    skills: apiJob.skills?.map((s: { name: string }) => s.name) || [],

    niceToHaveSkills:
      apiJob.niceToHaveSkills?.map((s: { name: string }) => s.name) || [],
    skillTestEnabled: apiJob.enableSkillAssessment,
    skillTestType: apiJob.testType,
    skillTestDifficulty: apiJob.difficultyLevel,
    skillTestDuration: apiJob.timeLimit,
    aiInterviewEnabled: apiJob.scheduleAIInterviews,
    aiInterviewType: apiJob.interviewType,
    aiInterviewEvaluation: apiJob.aiEvaluationCriteria,
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

  const stats = [
    {
      label: "Total Applicants",
      value: jobData.applicants,
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "In Skill Test",
      value: 0,
      icon: ClipboardCheck,
      color: "text-amber-600 bg-amber-100",
    },
    {
      label: "In AI Interview",
      value: 0,
      icon: Brain,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Shortlisted",
      value: 0,
      icon: CheckCircle2,
      color: "text-green-600 bg-green-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/employer-dashboard/job-board")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                {jobData.title}
              </h1>
              <Badge
                variant="outline"
                className={getStatusBadge(jobData.status)}
              >
                {jobData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">Job ID: {jobId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/employer-dashboard/edit-job/${jobId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
          <Button variant="outline" className="text-destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                navigate(`/employer-dashboard/job/${jobId}/candidates`)
              }
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Candidates Button */}
      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary/90"
        onClick={() => navigate(`/employer-dashboard/job/${jobId}/candidates`)}
      >
        <Users className="h-5 w-5 mr-2" />
        View All Candidates ({jobData.applicants})
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Job Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h4>
              <p className="text-sm">{jobData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{jobData.employmentType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{jobData.experienceLevel}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{jobData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{jobData.salaryRange}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {jobData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Nice to Have
              </h4>
              <div className="flex flex-wrap gap-2">
                {jobData.niceToHaveSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Posted on{" "}
              {jobData.postedDate
                ? new Date(jobData.postedDate).toLocaleDateString()
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* Screening Settings */}
        <div className="space-y-6">
          {/* Skill Test Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-amber-600" />
                Skill Test
              </CardTitle>
              <Badge
                className={
                  jobData.skillTestEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {jobData.skillTestEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobData.skillTestEnabled ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Test Type</span>
                    <span className="font-medium">
                      {jobData.skillTestType || "Not configured"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty</span>
                    <span className="font-medium">
                      {jobData.skillTestDifficulty || "Not configured"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {jobData.skillTestDuration || "Not configured"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Test
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Skill test is not enabled for this job.
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Interview Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Interview
              </CardTitle>
              <Badge
                className={
                  jobData.aiInterviewEnabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {jobData.aiInterviewEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobData.aiInterviewEnabled ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Interview Type
                    </span>
                    <span className="font-medium">
                      {jobData.aiInterviewType || "Not configured"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Evaluation</span>
                    <span className="font-medium">
                      {jobData.aiInterviewEvaluation?.length
                        ? jobData.aiInterviewEvaluation.join(", ")
                        : "Not specified"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Interview
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  AI Interview is not enabled for this job.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;

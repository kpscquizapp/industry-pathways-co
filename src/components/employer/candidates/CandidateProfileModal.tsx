import React from "react";
import {
  X,
  Download,
  DollarSign,
  Clock,
  MapPin,
  Briefcase,
  Globe,
  Award,
  Star,
  ExternalLink,
  FileText,
  Smartphone,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useDownloadBenchResumeMutation } from "@/app/queries/benchApi";
import { toast } from "sonner";

export interface CandidateProfile {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  matchScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  hourlyRate: { min: number; max: number };
  availability: string;
  location: string;
  experience: string;
  englishLevel?: string;
  type: "individual" | "bench";
  company?: string;
  skills: string[];
  certifications?: { name: string; issuer: string; year: string }[];
  about?: string;
  workExperience?: {
    role: string;
    company: string;
    companyColor?: string;
    period: string;
    location: string;
    highlights: string[];
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string[];
    icon: "smartphone" | "shopping";
  }[];
}

interface CandidateProfileModalProps {
  candidate: CandidateProfile | null;
  open: boolean;
  onClose: () => void;
  onScheduleInterview?: (candidate: CandidateProfile) => void;
  onShortlist?: (candidate: CandidateProfile) => void;
  onSkillTest?: (candidate: CandidateProfile) => void;
}

const ScoreCircle = ({
  score,
  size = 64,
}: {
  score: number;
  size?: number;
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-foreground">{score}</span>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score }: { label: string; score: number }) => (
  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{score}/10</span>
  </div>
);

const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  candidate,
  open,
  onClose,
  onScheduleInterview,
  onShortlist,
  onSkillTest,
}) => {
  if (!candidate) return null;

  const [downloadResume] = useDownloadBenchResumeMutation();

  const handleDownload = async (id) => {
    if (!candidate) return;

    try {
      await downloadResume(id).unwrap();
      toast.success("Resume downloaded successfully.");
    } catch (error) {
      toast.error("Failed to download resume.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-screen h-screen border-none rounded-none overflow-y-auto p-0 gap-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar */}
          <div className="lg:w-80 bg-card border-r border-border p-6 flex-shrink-0">
            {/* Profile Header */}
            <div className="text-center mb-6">
              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-background shadow-lg">
                <AvatarImage src={candidate.avatar} />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-foreground">
                {candidate.name}
              </h2>
              <p className="text-muted-foreground">{candidate.role}</p>

              <div className="flex items-center justify-center gap-2 mt-3">
                {candidate.type === "bench" && (
                  <Badge className="bg-primary/10 text-primary border-0">
                    BENCH RESOURCE
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              {onScheduleInterview && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  onClick={() => onScheduleInterview(candidate)}
                >
                  Book Interview
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={() => handleDownload(candidate?.id)}
              >
                <Download className="h-4 w-4 mr-2" />
              </Button>
            </div>

            {/* Quick Info */}
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Hourly Rate</span>
                </div>
                <span className="font-semibold text-primary">
                  ${candidate.hourlyRate.min} - ${candidate.hourlyRate.max} / hr
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Availability</span>
                </div>
                <span className="font-semibold text-primary">
                  {candidate.availability}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <span className="font-medium text-foreground">
                  {candidate.location}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span>Experience</span>
                </div>
                <span className="font-medium text-foreground">
                  {candidate.experience}
                </span>
              </div>
              {candidate.englishLevel && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {candidate.englishLevel}
                  </span>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h3 className="font-semibold text-foreground mb-3">
                Skills & Tech
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-muted text-muted-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {candidate.certifications &&
              candidate.certifications.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {candidate.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          <Award className="h-4 w-4 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {cert.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Issued {cert.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6">
            <Tabs defaultValue="overview">
              <TabsList className="bg-muted/50 rounded-xl p-1 mb-6">
                <TabsTrigger
                  value="overview"
                  className="rounded-lg px-6 data-[state=active]:bg-background"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="resume"
                  className="rounded-lg px-6 data-[state=active]:bg-background"
                >
                  Resume
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* AI Matching Score */}
                {candidate.matchScore !== undefined && (
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <ScoreCircle score={candidate.matchScore} />
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              AI Matching Score
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Based on your project requirements for "Senior
                              Mobile Developer".
                            </p>
                          </div>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                          View Detailed Report
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {candidate.technicalScore !== undefined && (
                          <ScoreBar
                            label="Technical Skill"
                            score={candidate.technicalScore}
                          />
                        )}
                        {candidate.communicationScore !== undefined && (
                          <ScoreBar
                            label="Communication"
                            score={candidate.communicationScore}
                          />
                        )}
                        {candidate.problemSolvingScore !== undefined && (
                          <ScoreBar
                            label="Problem Solving"
                            score={candidate.problemSolvingScore}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* About */}
                {candidate.about && (
                  <Card className="border-border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-foreground">
                        About Candidate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {candidate.about}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Work Experience */}
                {candidate.workExperience &&
                  candidate.workExperience.length > 0 && (
                    <Card className="border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-foreground">
                          Work Experience
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {candidate.workExperience.map((exp, idx) => (
                          <div
                            key={idx}
                            className="relative pl-6 border-l-2 border-muted"
                          >
                            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary" />
                            <div className="mb-1">
                              <h4 className="font-semibold text-foreground">
                                {exp.role}
                              </h4>
                              <p className="text-primary font-medium">
                                {exp.company}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {exp.period} • {exp.location}
                              </p>
                            </div>
                            <ul className="mt-2 space-y-1">
                              {exp.highlights.map((highlight, hIdx) => (
                                <li
                                  key={hIdx}
                                  className="text-sm text-muted-foreground flex items-start gap-2"
                                >
                                  <span className="text-muted-foreground">
                                    -
                                  </span>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                {/* Featured Projects */}
                {candidate.projects && candidate.projects.length > 0 && (
                  <Card className="border-border">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="text-lg text-foreground">
                        Featured Projects
                      </CardTitle>
                      <Button
                        variant="link"
                        className="text-primary p-0 h-auto"
                      >
                        View Portfolio
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {candidate.projects.map((project, idx) => (
                          <div key={idx} className="bg-muted/30 rounded-xl p-4">
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                              {project.icon === "smartphone" ? (
                                <Smartphone className="h-6 w-6 text-muted-foreground" />
                              ) : (
                                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground">
                              {project.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {project.technologies.join(", ")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects">
                <Card className="border-border">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Detailed project portfolio coming soon...
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessment">
                <Card className="border-border">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    Assessment reports will appear here after skill tests are
                    completed.
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resume">
                <Card className="border-border">
                  <CardContent className="p-6">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => handleDownload(candidate?.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Resume
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Bottom Action Bar */}
        {/* <div className="sticky bottom-0 bg-card border-t border-border p-4 flex items-center justify-end gap-3">
          {onSkillTest && (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => onSkillTest(candidate)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Schedule Skill Test
            </Button>
          )}
          {onShortlist && (
            <Button
              variant="outline"
              className="rounded-xl text-primary border-primary hover:bg-primary/10"
              onClick={() => onShortlist(candidate)}
            >
              <Star className="h-4 w-4 mr-2" />
              Shortlist
            </Button>
          )}
          {onScheduleInterview && (
            <Button
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onScheduleInterview(candidate)}
            >
              Book Interview
            </Button>
          )}
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfileModal;

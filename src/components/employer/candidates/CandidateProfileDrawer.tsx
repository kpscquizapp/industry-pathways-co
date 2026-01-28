import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  Calendar, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Star,
  UserCheck,
  UserX,
  Sparkles,
  FileText,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import { Candidate } from './CandidateCard';
import { cn } from '@/lib/utils';

interface CandidateProfileDrawerProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  onScheduleInterview: (candidate: Candidate) => void;
  onShortlist: (candidate: Candidate) => void;
  onReject: (candidate: Candidate) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-500';
};

const getScoreRingColor = (score: number) => {
  if (score >= 80) return 'stroke-green-500';
  if (score >= 60) return 'stroke-amber-500';
  return 'stroke-red-500';
};

const CircularProgress = ({ score, size = 100 }: { score: number; size?: number }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-500", getScoreRingColor(score))}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-2xl font-bold", getScoreColor(score))}>{score}%</span>
        <span className="text-xs text-muted-foreground">AI Score</span>
      </div>
    </div>
  );
};

const CandidateProfileDrawer: React.FC<CandidateProfileDrawerProps> = ({
  candidate,
  open,
  onClose,
  onScheduleInterview,
  onShortlist,
  onReject,
}) => {
  if (!candidate) return null;

  const mockExperience = [
    { role: 'Senior Software Engineer', company: 'Tech Corp', duration: '2021 - Present', description: 'Led development of microservices architecture' },
    { role: 'Software Engineer', company: 'StartupXYZ', duration: '2019 - 2021', description: 'Full-stack development with React and Node.js' },
    { role: 'Junior Developer', company: 'Agency Inc', duration: '2017 - 2019', description: 'Frontend development and UI/UX implementation' },
  ];

  const mockEducation = [
    { degree: "Master's in Computer Science", school: 'Warsaw University of Technology', year: '2017' },
    { degree: "Bachelor's in Software Engineering", school: 'University of Warsaw', year: '2015' },
  ];

  const aiInsights = [
    { title: 'Strong Technical Background', description: 'Demonstrated expertise in React, TypeScript, and cloud technologies', positive: true },
    { title: 'Leadership Potential', description: 'Has led teams of 3-5 developers in previous roles', positive: true },
    { title: 'Communication Skills', description: 'Clear and concise in written applications', positive: true },
    { title: 'Experience Gap', description: 'Limited experience with our specific tech stack (GraphQL)', positive: false },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">{candidate.name}</SheetTitle>
              <p className="text-muted-foreground">{candidate.currentRole}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {candidate.experience}
                </span>
              </div>
            </div>
            <CircularProgress score={candidate.aiScore} />
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Score Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Score Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Skills Match</span>
                    <span className={getScoreColor(candidate.skillsMatch)}>{candidate.skillsMatch}%</span>
                  </div>
                  <Progress value={candidate.skillsMatch} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Experience Match</span>
                    <span className={getScoreColor(candidate.experienceMatch)}>{candidate.experienceMatch}%</span>
                  </div>
                  <Progress value={candidate.experienceMatch} className="h-2" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Culture Fit</span>
                    <span className={getScoreColor(candidate.cultureFit)}>{candidate.cultureFit}%</span>
                  </div>
                  <Progress value={candidate.cultureFit} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.name.toLowerCase().replace(' ', '.')}@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+48 123 456 789</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="space-y-4">
            {/* Experience */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockExperience.map((exp, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-muted">
                    <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary" />
                    <h4 className="font-medium">{exp.role}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                    <p className="text-sm mt-1">{exp.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockEducation.map((edu, index) => (
                  <div key={index}>
                    <h4 className="font-medium">{edu.degree}</h4>
                    <p className="text-sm text-muted-foreground">{edu.school} • {edu.year}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Full Resume
            </Button>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "p-3 rounded-lg border",
                      insight.positive ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {insight.positive ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-600 mt-0.5" />
                      )}
                      <div>
                        <h4 className={cn(
                          "font-medium text-sm",
                          insight.positive ? "text-green-800" : "text-amber-800"
                        )}>
                          {insight.title}
                        </h4>
                        <p className={cn(
                          "text-sm mt-0.5",
                          insight.positive ? "text-green-700" : "text-amber-700"
                        )}>
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Star className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Strong Hire</h4>
                    <p className="text-sm text-green-700">Highly recommended for this position</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Interview Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => onScheduleInterview(candidate)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Schedule AI Interview
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Human Interview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Candidate Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => onShortlist(candidate)}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Add to Shortlist
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => onReject(candidate)}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Reject Candidate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Add Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-background border-t pt-4 mt-6 -mx-6 px-6 pb-2">
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            onClick={() => onScheduleInterview(candidate)}
          >
            <Video className="h-4 w-4 mr-2" />
            Schedule AI Interview
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CandidateProfileDrawer;

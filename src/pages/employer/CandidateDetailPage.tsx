import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Download,
  Clock,
  DollarSign,
  Globe,
  MapPin,
  Briefcase,
  Sparkles,
  Video,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Brain,
  Code,
  MessageSquare,
  Target,
  Award,
  FileText,
  Play,
} from 'lucide-react';

// Mock candidate data
const mockCandidate = {
  id: 1,
  name: 'Amit Sharma',
  title: 'Senior React Native Developer',
  email: 'amit.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: '',
  profileType: 'bench',
  matchPercentage: 98,
  topMatch: true,
  hourlyRate: '$25 - $35',
  availability: 'Immediate',
  location: 'Bangalore, India',
  experience: '5.5 Years',
  language: 'Professional',
  skills: [
    'React Native',
    'TypeScript',
    'Redux',
    'Node.js',
    'GraphQL',
    'Jest',
    'Firebase',
  ],
  certifications: [
    { name: 'Meta React Native', issueDate: 'Issued 2023' },
    { name: 'AWS Certified Dev', issueDate: 'Issued 2022' },
  ],
  about:
    'Senior React Native Developer with over 5 years of experience building high-performance mobile applications for both iOS and Android. Proven track record of delivering scalable solutions for FinTech and E-commerce domains. Currently on bench at Infosys and available for immediate contract deployment.\n\nProficient in TypeScript, Redux Toolkit, and integrating native modules. Experienced in working with agile teams and mentoring junior developers.',
  workHistory: [
    {
      role: 'Senior Systems Engineer',
      company: 'Infosys Ltd.',
      period: 'Jan 2022 - Present',
      location: 'Bangalore',
      bullets: [
        'Led the mobile development team for a major US banking client app.',
        'Optimized app startup time by 40% using Hermes engine.',
        'Managed a team of 5 developers and handled code reviews.',
      ],
    },
    {
      role: 'Software Developer',
      company: 'TechMahindra',
      period: 'Jun 2019 - Dec 2021',
      location: 'Hyderabad',
      bullets: [
        'Developed cross-platform mobile apps for retail customers.',
        'Integrated payment gateways and third-party analytics tools.',
        'Worked closely with UX designers to implement pixel-perfect UI.',
      ],
    },
  ],
  projects: [
    {
      name: 'FinPay Wallet App',
      tech: 'React Native, Redux, Node.js',
      icon: 'wallet',
    },
    {
      name: 'ShopEase E-commerce',
      tech: 'React Native, Firebase, Stripe',
      icon: 'shopping',
    },
  ],
  aiScores: { technical: 9.5, communication: 8.8, problemSolving: 9.2 },
  skillTestStatus: 'Not Started',
  aiInterviewStatus: 'Pending',
  appliedDate: '2024-01-15',
  status: 'new',
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-500';
};

const CandidateDetailPage: React.FC = () => {
  const { jobId, candidateId } = useParams();
  const navigate = useNavigate();
  const [skillTestModalOpen, setSkillTestModalOpen] = useState(false);
  const [aiInterviewModalOpen, setAiInterviewModalOpen] = useState(false);

  // Skill test form state
  const [testConfig, setTestConfig] = useState({
    testType: 'coding',
    difficulty: 'intermediate',
    duration: '60',
    deadline: '',
    autoReject: true,
    minScore: '70',
  });

  // AI Interview form state
  const [interviewConfig, setInterviewConfig] = useState({
    interviewType: 'technical',
    duration: '30',
    evaluateCommunication: true,
    evaluateProblemSolving: true,
    evaluateTechnical: true,
    autoAdvance: true,
    minScore: '75',
  });

  const handleSendSkillTest = () => {
    toast.success(`Skill test invitation sent to ${mockCandidate.name}`, {
      description: `${testConfig.testType} test • ${testConfig.difficulty} level • ${testConfig.duration} mins`,
    });
    setSkillTestModalOpen(false);
  };

  const handleSendAIInterview = () => {
    toast.success(`AI Interview invitation sent to ${mockCandidate.name}`, {
      description: `${interviewConfig.interviewType} interview • ${interviewConfig.duration} mins`,
    });
    setAiInterviewModalOpen(false);
  };

  const handleShortlist = () => {
    toast.success(`${mockCandidate.name} has been shortlisted`);
  };

  const handleReject = () => {
    toast.info(`${mockCandidate.name} has been rejected`);
  };

  const handleMoveToHumanInterview = () => {
    toast.success(`${mockCandidate.name} moved to human interview stage`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/employer-dashboard/job/${jobId}/candidates`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Candidate Profile</h1>
          <p className="text-sm text-muted-foreground">
            Viewing candidate for Job ID: {jobId}
          </p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Profile Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Avatar className="w-28 h-28 mx-auto mb-4 shadow-xl ring-4 ring-background">
                <AvatarImage src={mockCandidate.avatar} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {mockCandidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mb-1">{mockCandidate.name}</h2>
              <p className="text-muted-foreground text-sm mb-3 font-medium">
                {mockCandidate.title}
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-bold text-xs">
                  {mockCandidate.profileType === 'bench' ? 'BENCH RESOURCE' : 'CONTRACT RESOURCE'}
                </Badge>
                {mockCandidate.topMatch && (
                  <Badge className="bg-blue-100 font-bold text-blue-700 hover:bg-blue-100 text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Top 5% Match
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 my-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => setAiInterviewModalOpen(true)}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Schedule AI Interview
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSkillTestModalOpen(true)}
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Assign Skill Test
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-1"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="border-t pt-6 space-y-3 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Hourly Rate
                  </span>
                  <span className="font-semibold">{mockCandidate.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Availability
                  </span>
                  <span className="font-semibold text-green-600">{mockCandidate.availability}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </span>
                  <span className="font-semibold">{mockCandidate.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Experience
                  </span>
                  <span className="font-semibold">{mockCandidate.experience}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    English
                  </span>
                  <span className="font-semibold">{mockCandidate.language}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">Skills & Tech</h3>
              <div className="flex flex-wrap gap-2">
                {mockCandidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-muted text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications Card */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">Certifications</h3>
              <div className="space-y-3">
                {mockCandidate.certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cert.name}</p>
                      <p className="text-xs text-muted-foreground">{cert.issueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="w-full justify-start bg-muted/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="assessment">Assessment Report</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* AI Matching Score Card */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(mockCandidate.matchPercentage / 100) * 213.6} 213.6`}
                            strokeLinecap="round"
                            className="text-primary"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {mockCandidate.matchPercentage}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">AI Matching Score</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on your project requirements for "{mockCandidate.title}".
                        </p>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      View Detailed Report
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1 font-medium">Technical Skill</p>
                      <p className="text-2xl font-bold">{mockCandidate.aiScores.technical}/10</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1 font-medium">Communication</p>
                      <p className="text-2xl font-bold">{mockCandidate.aiScores.communication}/10</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1 font-medium">Problem Solving</p>
                      <p className="text-2xl font-bold">{mockCandidate.aiScores.problemSolving}/10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Status */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Assessment Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <ClipboardCheck className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">Skill Test</p>
                          <p className="text-sm text-muted-foreground">{mockCandidate.skillTestStatus}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSkillTestModalOpen(true)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Send Test
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">AI Interview</p>
                          <p className="text-sm text-muted-foreground">{mockCandidate.aiInterviewStatus}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAiInterviewModalOpen(true)}
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About Candidate */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-3">About Candidate</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {mockCandidate.about}
                  </p>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Work Experience</h3>
                  <div className="space-y-6">
                    {mockCandidate.workHistory.map((job, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-primary/20">
                        <div className="absolute left-0 top-0 w-3 h-3 bg-primary rounded-full -translate-x-[7px]" />
                        <div className="mb-1">
                          <h4 className="font-semibold">{job.role}</h4>
                          <p className="text-sm text-primary font-medium">{job.company}</p>
                          <p className="text-xs text-muted-foreground">
                            {job.period} • {job.location}
                          </p>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {job.bullets.map((bullet, bIndex) => (
                            <li key={bIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Decision Actions */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Decision Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={handleShortlist}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Shortlist Candidate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleMoveToHumanInterview}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Move to Human Interview
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={handleReject}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Featured Projects</h3>
                    <Button variant="link" className="text-primary">
                      View Portfolio
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockCandidate.projects.map((project, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-xs text-muted-foreground">{project.tech}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center py-12">
                  <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No Assessment Completed Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Send a skill test or schedule an AI interview to generate assessment reports.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setSkillTestModalOpen(true)}>
                      <ClipboardCheck className="h-4 w-4 mr-2" />
                      Assign Skill Test
                    </Button>
                    <Button variant="outline" onClick={() => setAiInterviewModalOpen(true)}>
                      <Video className="h-4 w-4 mr-2" />
                      Schedule AI Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume" className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Resume</h3>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <div className="aspect-[8.5/11] bg-muted/30 rounded-lg border flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Resume Preview</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Skill Test Modal */}
      <Dialog open={skillTestModalOpen} onOpenChange={setSkillTestModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Skill Test</DialogTitle>
            <DialogDescription>
              Configure and send a skill test invitation to {mockCandidate.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select
                value={testConfig.testType}
                onValueChange={(value) => setTestConfig({ ...testConfig, testType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coding">Coding Challenge</SelectItem>
                  <SelectItem value="mcq">MCQ Assessment</SelectItem>
                  <SelectItem value="system-design">System Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty Level</Label>
                <Select
                  value={testConfig.difficulty}
                  onValueChange={(value) => setTestConfig({ ...testConfig, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (mins)</Label>
                <Select
                  value={testConfig.duration}
                  onValueChange={(value) => setTestConfig({ ...testConfig, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={testConfig.deadline}
                onChange={(e) => setTestConfig({ ...testConfig, deadline: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoReject"
                checked={testConfig.autoReject}
                onCheckedChange={(checked) => setTestConfig({ ...testConfig, autoReject: !!checked })}
              />
              <Label htmlFor="autoReject" className="text-sm font-normal">
                Auto-reject below minimum score
              </Label>
            </div>
            {testConfig.autoReject && (
              <div className="space-y-2">
                <Label>Minimum Score (%)</Label>
                <Input
                  type="number"
                  value={testConfig.minScore}
                  onChange={(e) => setTestConfig({ ...testConfig, minScore: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillTestModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendSkillTest}>
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Send Test Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Interview Modal */}
      <Dialog open={aiInterviewModalOpen} onOpenChange={setAiInterviewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule AI Interview</DialogTitle>
            <DialogDescription>
              Configure and schedule an AI-powered interview for {mockCandidate.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Interview Type</Label>
              <Select
                value={interviewConfig.interviewType}
                onValueChange={(value) => setInterviewConfig({ ...interviewConfig, interviewType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duration (mins)</Label>
              <Select
                value={interviewConfig.duration}
                onValueChange={(value) => setInterviewConfig({ ...interviewConfig, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Evaluation Criteria</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evalComm"
                    checked={interviewConfig.evaluateCommunication}
                    onCheckedChange={(checked) =>
                      setInterviewConfig({ ...interviewConfig, evaluateCommunication: !!checked })
                    }
                  />
                  <Label htmlFor="evalComm" className="text-sm font-normal flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Communication
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evalProblem"
                    checked={interviewConfig.evaluateProblemSolving}
                    onCheckedChange={(checked) =>
                      setInterviewConfig({ ...interviewConfig, evaluateProblemSolving: !!checked })
                    }
                  />
                  <Label htmlFor="evalProblem" className="text-sm font-normal flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    Problem Solving
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evalTech"
                    checked={interviewConfig.evaluateTechnical}
                    onCheckedChange={(checked) =>
                      setInterviewConfig({ ...interviewConfig, evaluateTechnical: !!checked })
                    }
                  />
                  <Label htmlFor="evalTech" className="text-sm font-normal flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    Technical Depth
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoAdvance"
                checked={interviewConfig.autoAdvance}
                onCheckedChange={(checked) =>
                  setInterviewConfig({ ...interviewConfig, autoAdvance: !!checked })
                }
              />
              <Label htmlFor="autoAdvance" className="text-sm font-normal">
                Auto-advance candidates meeting minimum score
              </Label>
            </div>
            {interviewConfig.autoAdvance && (
              <div className="space-y-2">
                <Label>Minimum Score (%)</Label>
                <Input
                  type="number"
                  value={interviewConfig.minScore}
                  onChange={(e) => setInterviewConfig({ ...interviewConfig, minScore: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendAIInterview}>
              <Video className="h-4 w-4 mr-2" />
              Send Interview Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateDetailPage;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Users,
  Brain,
  ClipboardCheck,
  Star,
  MoreHorizontal,
  Eye,
  FileText,
  Play,
  Video,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Briefcase,
  MapPin,
  GraduationCap,
  Award,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock candidate data
const mockCandidates = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    avatar: '',
    matchScore: 92,
    skillsMatch: 88,
    status: 'Applied',
    skillTestStatus: 'Passed',
    skillTestScore: 85,
    aiInterviewStatus: 'Completed',
    aiInterviewScore: 88,
    appliedDate: '2024-01-14',
    experience: '5 years',
    location: 'Bangalore',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    education: 'B.Tech in Computer Science',
    strengths: ['Strong problem-solving', 'Excellent communication', 'Team player'],
    weaknesses: ['Limited experience with cloud services'],
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.c@email.com',
    avatar: '',
    matchScore: 87,
    skillsMatch: 92,
    status: 'Shortlisted',
    skillTestStatus: 'Passed',
    skillTestScore: 90,
    aiInterviewStatus: 'Pending',
    aiInterviewScore: null,
    appliedDate: '2024-01-13',
    experience: '7 years',
    location: 'Mumbai',
    skills: ['React', 'Vue.js', 'Python', 'AWS'],
    education: 'M.Tech in Software Engineering',
    strengths: ['Deep technical expertise', 'Leadership qualities'],
    weaknesses: ['Could improve on frontend animations'],
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.d@email.com',
    avatar: '',
    matchScore: 78,
    skillsMatch: 75,
    status: 'Applied',
    skillTestStatus: 'Not Started',
    skillTestScore: null,
    aiInterviewStatus: 'Not Started',
    aiInterviewScore: null,
    appliedDate: '2024-01-12',
    experience: '3 years',
    location: 'Delhi',
    skills: ['JavaScript', 'React', 'CSS', 'HTML'],
    education: 'B.Sc in Information Technology',
    strengths: ['Fast learner', 'Creative problem solver'],
    weaknesses: ['Limited backend experience'],
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.k@email.com',
    avatar: '',
    matchScore: 95,
    skillsMatch: 94,
    status: 'In Review',
    skillTestStatus: 'Passed',
    skillTestScore: 95,
    aiInterviewStatus: 'Completed',
    aiInterviewScore: 92,
    appliedDate: '2024-01-11',
    experience: '8 years',
    location: 'Hyderabad',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
    education: 'B.Tech in Computer Science',
    strengths: ['Exceptional technical skills', 'Great communicator', 'Mentorship experience'],
    weaknesses: ['None identified'],
  },
  {
    id: 5,
    name: 'Anna Smith',
    email: 'anna.s@email.com',
    avatar: '',
    matchScore: 65,
    skillsMatch: 60,
    status: 'Rejected',
    skillTestStatus: 'Failed',
    skillTestScore: 42,
    aiInterviewStatus: 'Not Started',
    aiInterviewScore: null,
    appliedDate: '2024-01-10',
    experience: '2 years',
    location: 'Chennai',
    skills: ['HTML', 'CSS', 'JavaScript'],
    education: 'B.Sc in Computer Science',
    strengths: ['Eager to learn'],
    weaknesses: ['Lacks required technical depth'],
  },
];

const AppliedCandidates = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [skillMatchFilter, setSkillMatchFilter] = useState('all');
  const [testStatusFilter, setTestStatusFilter] = useState('all');
  const [interviewStatusFilter, setInterviewStatusFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [candidateForAction, setCandidateForAction] = useState<typeof mockCandidates[0] | null>(null);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Applied': 'bg-blue-100 text-blue-700',
      'Shortlisted': 'bg-green-100 text-green-700',
      'In Review': 'bg-yellow-100 text-yellow-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Hired': 'bg-primary/10 text-primary',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const getTestStatusBadge = (status: string) => {
    const styles: Record<string, { class: string; icon: React.ReactNode }> = {
      'Passed': { class: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
      'Failed': { class: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
      'Not Started': { class: 'bg-gray-100 text-gray-600', icon: <Clock className="h-3 w-3" /> },
      'In Progress': { class: 'bg-yellow-100 text-yellow-700', icon: <Clock className="h-3 w-3" /> },
      'Pending': { class: 'bg-orange-100 text-orange-700', icon: <Clock className="h-3 w-3" /> },
      'Completed': { class: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    };
    return styles[status] || styles['Not Started'];
  };

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillMatchFilter === 'all' || 
                         (skillMatchFilter === 'high' && candidate.skillsMatch >= 80) ||
                         (skillMatchFilter === 'medium' && candidate.skillsMatch >= 50 && candidate.skillsMatch < 80) ||
                         (skillMatchFilter === 'low' && candidate.skillsMatch < 50);
    const matchesTest = testStatusFilter === 'all' || candidate.skillTestStatus.toLowerCase().replace(' ', '-') === testStatusFilter;
    const matchesInterview = interviewStatusFilter === 'all' || candidate.aiInterviewStatus.toLowerCase().replace(' ', '-') === interviewStatusFilter;
    return matchesSearch && matchesSkill && matchesTest && matchesInterview;
  });

  const handleSendTestInvite = (candidate: typeof mockCandidates[0]) => {
    setCandidateForAction(candidate);
    setShowTestModal(true);
  };

  const handleSendInterviewInvite = (candidate: typeof mockCandidates[0]) => {
    setCandidateForAction(candidate);
    setShowInterviewModal(true);
  };

  const confirmSendTest = () => {
    toast.success(`Skill test invite sent to ${candidateForAction?.name}`);
    setShowTestModal(false);
    setCandidateForAction(null);
  };

  const confirmSendInterview = () => {
    toast.success(`AI interview invite sent to ${candidateForAction?.name}`);
    setShowInterviewModal(false);
    setCandidateForAction(null);
  };

  const handleShortlist = (candidate: typeof mockCandidates[0]) => {
    toast.success(`${candidate.name} has been shortlisted`);
  };

  const handleReject = (candidate: typeof mockCandidates[0]) => {
    toast.success(`${candidate.name} has been rejected`);
  };

  const handleMoveToHumanInterview = (candidate: typeof mockCandidates[0]) => {
    toast.success(`${candidate.name} moved to human interview stage`);
  };

  const stats = [
    { label: 'Total Applicants', value: mockCandidates.length, icon: Users, color: 'text-blue-600' },
    { label: 'High Match (>80%)', value: mockCandidates.filter(c => c.matchScore >= 80).length, icon: Star, color: 'text-yellow-600' },
    { label: 'Test Passed', value: mockCandidates.filter(c => c.skillTestStatus === 'Passed').length, icon: ClipboardCheck, color: 'text-green-600' },
    { label: 'Interview Done', value: mockCandidates.filter(c => c.aiInterviewStatus === 'Completed').length, icon: Brain, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/employer-dashboard/job-board')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Senior Frontend Developer</h1>
          <p className="text-muted-foreground">Applied Candidates • Job ID: {jobId}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={cn("h-8 w-8", stat.color)} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={skillMatchFilter} onValueChange={setSkillMatchFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Skill Match" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="high">High (≥80%)</SelectItem>
                <SelectItem value="medium">Medium (50-79%)</SelectItem>
                <SelectItem value="low">Low (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={testStatusFilter} onValueChange={setTestStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Test Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tests</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
            <Select value={interviewStatusFilter} onValueChange={setInterviewStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Interview Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Interviews</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Candidate</TableHead>
                <TableHead className="font-semibold text-center">Match Score</TableHead>
                <TableHead className="font-semibold text-center">Skills Match</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Skill Test</TableHead>
                <TableHead className="font-semibold">AI Interview</TableHead>
                <TableHead className="font-semibold">Applied</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => {
                const testStatus = getTestStatusBadge(candidate.skillTestStatus);
                const interviewStatus = getTestStatusBadge(candidate.aiInterviewStatus);
                
                return (
                  <TableRow key={candidate.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <button 
                            onClick={() => setSelectedCandidate(candidate)}
                            className="font-medium text-primary hover:underline"
                          >
                            {candidate.name}
                          </button>
                          <p className="text-xs text-muted-foreground">{candidate.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-lg">{candidate.matchScore}%</span>
                        <Progress value={candidate.matchScore} className="w-16 h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "font-medium",
                        candidate.skillsMatch >= 80 ? "text-green-600" : 
                        candidate.skillsMatch >= 50 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {candidate.skillsMatch}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(candidate.status)}>{candidate.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1", testStatus.class)}>
                        {testStatus.icon}
                        {candidate.skillTestStatus}
                        {candidate.skillTestScore && ` (${candidate.skillTestScore}%)`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1", interviewStatus.class)}>
                        {interviewStatus.icon}
                        {candidate.aiInterviewStatus}
                        {candidate.aiInterviewScore && ` (${candidate.aiInterviewScore}%)`}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSelectedCandidate(candidate)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Resume
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleSendTestInvite(candidate)}>
                            <Play className="h-4 w-4 mr-2" />
                            Send Skill Test
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendInterviewInvite(candidate)}>
                            <Video className="h-4 w-4 mr-2" />
                            Send AI Interview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleShortlist(candidate)}>
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Shortlist
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMoveToHumanInterview(candidate)}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Move to Human Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(candidate)} className="text-destructive">
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {filteredCandidates.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-lg mb-1">No candidates found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Detail Sheet */}
      <Sheet open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCandidate && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                      {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">{selectedCandidate.name}</SheetTitle>
                    <p className="text-muted-foreground text-sm">{selectedCandidate.email}</p>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 py-4">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCandidate.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCandidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCandidate.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Applied {new Date(selectedCandidate.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                    <p className="text-2xl font-bold text-primary">{selectedCandidate.matchScore}%</p>
                    <Progress value={selectedCandidate.matchScore} className="mt-2" />
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Skills Match</p>
                    <p className="text-2xl font-bold">{selectedCandidate.skillsMatch}%</p>
                    <Progress value={selectedCandidate.skillsMatch} className="mt-2" />
                  </Card>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {/* Test Results */}
                {selectedCandidate.skillTestScore && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4" />
                      Skill Test Results
                    </h4>
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Score</span>
                        <span className="font-semibold">{selectedCandidate.skillTestScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.skillTestScore} />
                      <Badge className={cn("mt-2", getTestStatusBadge(selectedCandidate.skillTestStatus).class)}>
                        {selectedCandidate.skillTestStatus}
                      </Badge>
                    </Card>
                  </div>
                )}

                {/* AI Interview Results */}
                {selectedCandidate.aiInterviewScore && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Interview Summary
                    </h4>
                    <Card className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Score</span>
                        <span className="font-semibold text-primary">{selectedCandidate.aiInterviewScore}%</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Strengths</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {selectedCandidate.strengths.map((s, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-600 mb-1">Areas for Improvement</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {selectedCandidate.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <MessageSquare className="h-3 w-3 text-orange-500" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/employer-dashboard/interview-results/${selectedCandidate.id}`)}
                      >
                        View Full Interview
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Card>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button onClick={() => handleShortlist(selectedCandidate)}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Shortlist Candidate
                  </Button>
                  <Button variant="outline" onClick={() => handleMoveToHumanInterview(selectedCandidate)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Move to Human Interview
                  </Button>
                  <Button variant="outline" className="text-destructive" onClick={() => handleReject(selectedCandidate)}>
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Send Test Modal */}
      <Dialog open={showTestModal} onOpenChange={setShowTestModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-600" />
              Assign Skill Test
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground text-sm">
              Assign a skill test to <strong>{candidateForAction?.name}</strong>
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Test Type</label>
                <Select defaultValue="coding">
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coding">Coding Challenge</SelectItem>
                    <SelectItem value="mcq">MCQ Assessment</SelectItem>
                    <SelectItem value="system-design">System Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Difficulty Level</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Time Limit</label>
                <Select defaultValue="60">
                  <SelectTrigger>
                    <SelectValue placeholder="Select time limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Deadline</label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue placeholder="Select deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Auto-Reject Below Score</label>
                <Select defaultValue="50">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No auto-reject</SelectItem>
                    <SelectItem value="40">40%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="60">60%</SelectItem>
                    <SelectItem value="70">70%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestModal(false)}>Cancel</Button>
            <Button onClick={confirmSendTest} className="bg-primary">
              <Play className="h-4 w-4 mr-2" />
              Send Test Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Interview Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Assign AI Interview
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground text-sm">
              Assign an AI interview to <strong>{candidateForAction?.name}</strong>
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Interview Type</label>
                <Select defaultValue="mixed">
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Only</SelectItem>
                    <SelectItem value="behavioral">Behavioral Only</SelectItem>
                    <SelectItem value="mixed">Technical + Behavioral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Evaluation Criteria</label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    Communication Skills
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    Problem Solving
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    Technical Depth
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Leadership Qualities
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Deadline</label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue placeholder="Select deadline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="10">10 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Auto-Advance Rule</label>
                <Select defaultValue="80">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Manual review only</SelectItem>
                    <SelectItem value="70">Auto-advance if score ≥ 70%</SelectItem>
                    <SelectItem value="80">Auto-advance if score ≥ 80%</SelectItem>
                    <SelectItem value="90">Auto-advance if score ≥ 90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewModal(false)}>Cancel</Button>
            <Button onClick={confirmSendInterview} className="bg-primary">
              <Video className="h-4 w-4 mr-2" />
              Send Interview Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppliedCandidates;

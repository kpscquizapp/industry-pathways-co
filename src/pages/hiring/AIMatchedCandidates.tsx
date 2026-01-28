import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Brain,
  Search,
  Filter,
  Sparkles,
  CheckCircle2,
  ClipboardCheck,
  Video,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Star,
  Download,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AIMatchedCandidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      role: 'Senior React Developer',
      matchedJob: 'Senior React Developer',
      aiScore: 94,
      experience: '8 years',
      education: 'MS Computer Science, Stanford',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
      skillScores: { React: 95, TypeScript: 92, 'Node.js': 88, GraphQL: 85, AWS: 80 },
      status: 'New Match',
      highlights: ['Led team of 5 developers', 'Built 3 production apps', 'Open source contributor'],
      resumeUrl: '#'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      role: 'Full Stack Engineer',
      matchedJob: 'Senior React Developer',
      aiScore: 91,
      experience: '6 years',
      education: 'BS Computer Science, MIT',
      skills: ['Python', 'React', 'AWS', 'Docker', 'PostgreSQL'],
      skillScores: { Python: 94, React: 90, AWS: 88, Docker: 85, PostgreSQL: 82 },
      status: 'Skill Test Scheduled',
      highlights: ['AWS certified', 'Full stack experience', 'Agile methodology'],
      resumeUrl: '#'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      location: 'New York, NY',
      role: 'Frontend Developer',
      matchedJob: 'UX Designer',
      aiScore: 88,
      experience: '5 years',
      education: 'BFA Design, Parsons',
      skills: ['Vue.js', 'CSS', 'JavaScript', 'Figma', 'Design Systems'],
      skillScores: { 'Vue.js': 90, CSS: 92, JavaScript: 88, Figma: 95, 'Design Systems': 87 },
      status: 'Interview Completed',
      highlights: ['Design system expert', 'User research experience', 'Accessibility specialist'],
      resumeUrl: '#'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      role: 'Backend Developer',
      matchedJob: 'DevOps Engineer',
      aiScore: 85,
      experience: '7 years',
      education: 'MS Software Engineering, UT Austin',
      skills: ['Java', 'Spring', 'PostgreSQL', 'Kubernetes', 'Terraform'],
      skillScores: { Java: 92, Spring: 90, PostgreSQL: 88, Kubernetes: 82, Terraform: 78 },
      status: 'New Match',
      highlights: ['Microservices architect', 'CI/CD pipeline expert', 'Performance optimization'],
      resumeUrl: '#'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.wang@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      role: 'Data Scientist',
      matchedJob: 'Data Scientist',
      aiScore: 92,
      experience: '4 years',
      education: 'PhD Statistics, Harvard',
      skills: ['Python', 'TensorFlow', 'SQL', 'Machine Learning', 'Statistics'],
      skillScores: { Python: 95, TensorFlow: 90, SQL: 88, 'Machine Learning': 94, Statistics: 96 },
      status: 'Skill Test Scheduled',
      highlights: ['Published researcher', 'ML model deployment', 'A/B testing expert'],
      resumeUrl: '#'
    }
  ];

  const jobs = ['Senior React Developer', 'UX Designer', 'DevOps Engineer', 'Data Scientist', 'Product Manager'];

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJob = jobFilter === 'all' || c.matchedJob === jobFilter;
    return matchesSearch && matchesJob;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New Match': return 'bg-blue-100 text-blue-700';
      case 'Skill Test Scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'Interview Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleScheduleTest = (candidate: any) => {
    toast.success(`Skill test scheduled for ${candidate.name}`);
  };

  const handleScheduleInterview = (candidate: any) => {
    toast.success(`AI interview scheduled for ${candidate.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <Brain className="h-7 w-7 text-purple-500" />
          AI Matched Candidates
        </h1>
        <p className="text-muted-foreground mt-1">
          Candidates automatically matched to your job postings based on skills and experience
        </p>
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
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Briefcase className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job} value={job}>{job}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {candidate.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    <span className={cn("font-bold text-2xl", getScoreColor(candidate.aiScore))}>
                      {candidate.aiScore}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">AI Match Score</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Matched to: <strong>{candidate.matchedJob}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.education}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.slice(0, 4).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                  {candidate.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{candidate.skills.length - 4}</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                    onClick={() => handleScheduleTest(candidate)}
                  >
                    <ClipboardCheck className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => handleScheduleInterview(candidate)}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Interview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {selectedCandidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-xl">{selectedCandidate.name}</h2>
                    <p className="text-sm text-muted-foreground font-normal">{selectedCandidate.role}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-5 w-5 text-yellow-500" />
                      <span className={cn("font-bold text-2xl", getScoreColor(selectedCandidate.aiScore))}>
                        {selectedCandidate.aiScore}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">AI Match</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Contact Info */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCandidate.location}</span>
                  </div>
                </div>

                {/* Skill Scores */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Skill Assessment Scores
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedCandidate.skillScores).map(([skill, score]) => (
                      <div key={skill} className="flex items-center gap-4">
                        <span className="w-32 text-sm">{skill}</span>
                        <Progress value={score as number} className="flex-1 h-2" />
                        <span className={cn("text-sm font-semibold w-12", getScoreColor(score as number))}>
                          {String(score)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {selectedCandidate.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600"
                    onClick={() => handleScheduleTest(selectedCandidate)}
                  >
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Schedule Skill Test
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500"
                    onClick={() => handleScheduleInterview(selectedCandidate)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Schedule AI Interview
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIMatchedCandidates;

import React, { useState } from 'react';
import { 
  RefreshCw, 
  Filter, 
  Download,
  Eye,
  UserCheck,
  X,
  Search,
  Sparkles,
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const candidates = [
  { 
    id: 1, 
    name: 'Sarah Chen', 
    role: 'Senior React Developer', 
    matchScore: 94, 
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    experience: '7 years',
    availability: 'Immediate',
    type: 'individual',
    stage: 'matched'
  },
  { 
    id: 2, 
    name: 'Alex Kumar', 
    role: 'Full Stack Engineer', 
    matchScore: 91, 
    skills: ['React', 'Python', 'AWS', 'PostgreSQL'],
    experience: '5 years',
    availability: '2 weeks',
    type: 'individual',
    stage: 'shortlisted'
  },
  { 
    id: 3, 
    name: 'Maria Silva', 
    role: 'React Native Specialist', 
    matchScore: 89, 
    skills: ['React Native', 'JavaScript', 'Redux', 'Firebase'],
    experience: '6 years',
    availability: 'Immediate',
    type: 'bench',
    company: 'TechBench Inc.',
    stage: 'matched'
  },
  { 
    id: 4, 
    name: 'James Wilson', 
    role: 'Frontend Architect', 
    matchScore: 87, 
    skills: ['React', 'Vue', 'TypeScript', 'Webpack'],
    experience: '8 years',
    availability: '1 week',
    type: 'individual',
    stage: 'matched'
  },
  { 
    id: 5, 
    name: 'Priya Sharma', 
    role: 'Senior Developer', 
    matchScore: 85, 
    skills: ['React', 'Angular', 'Node.js', 'MongoDB'],
    experience: '5 years',
    availability: 'Immediate',
    type: 'bench',
    company: 'GlobalStaff Solutions',
    stage: 'shortlisted'
  },
];

const EmployerAIShortlists = () => {
  const [selectedJob, setSelectedJob] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredCandidates = candidates.filter(c => {
    if (activeTab === 'matched') return c.stage === 'matched';
    if (activeTab === 'shortlisted') return c.stage === 'shortlisted';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-green-400/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-green-400 flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">12 New AI Matches</h2>
                <p className="text-muted-foreground">For your active job postings</p>
              </div>
            </div>
            <Button className="rounded-xl">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Matches
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-[200px] rounded-xl">
            <SelectValue placeholder="Filter by job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="react">Senior React Developer</SelectItem>
            <SelectItem value="python">Python Data Engineer</SelectItem>
            <SelectItem value="devops">DevOps Specialist</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="rounded-xl">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>

        <Button variant="outline" className="rounded-xl">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stages Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="all" className="rounded-lg px-6">All ({candidates.length})</TabsTrigger>
          <TabsTrigger value="matched" className="rounded-lg px-6">Matched ({candidates.filter(c => c.stage === 'matched').length})</TabsTrigger>
          <TabsTrigger value="shortlisted" className="rounded-lg px-6">Shortlisted ({candidates.filter(c => c.stage === 'shortlisted').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-start">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-[280px]">
                      <Avatar className="h-14 w-14 bg-gradient-to-br from-primary/30 to-green-400/30">
                        <AvatarFallback className="text-lg font-semibold text-primary">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          {candidate.type === 'bench' ? (
                            <Badge variant="secondary" className="text-xs">
                              <Building2 className="h-3 w-3 mr-1" />
                              Bench
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <User className="h-3 w-3 mr-1" />
                              Individual
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{candidate.role}</p>
                        {candidate.type === 'bench' && (
                          <p className="text-xs text-muted-foreground mt-0.5">via {candidate.company}</p>
                        )}
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-center min-w-[100px]">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-muted/30"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={`${(candidate.matchScore / 100) * 176} 176`}
                            className="text-primary"
                          />
                        </svg>
                        <span className="absolute text-sm font-bold text-primary">{candidate.matchScore}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">AI Match</p>
                    </div>

                    {/* Skills */}
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-xs text-muted-foreground mb-2">Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {candidate.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-[120px]">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-medium text-sm">{candidate.experience}</p>
                      <p className="text-xs text-muted-foreground mt-2">Availability</p>
                      <p className="font-medium text-sm text-green-600">{candidate.availability}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button size="sm" className="rounded-lg">
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      {candidate.stage === 'matched' ? (
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Shortlist
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="rounded-lg text-green-600 border-green-600 hover:bg-green-50">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Skill Test
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerAIShortlists;

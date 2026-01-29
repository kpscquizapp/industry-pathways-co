import React, { useState } from 'react';
import { 
  RefreshCw, 
  Filter, 
  Download,
  Eye,
  UserCheck,
  Search,
  Sparkles,
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import CandidateProfileModal, { CandidateProfile } from '@/components/employer/candidates/CandidateProfileModal';

const candidatesData: CandidateProfile[] = [
  { 
    id: 1, 
    name: 'Amit Sharma', 
    role: 'Senior React Native Developer', 
    matchScore: 98, 
    technicalScore: 9.5,
    communicationScore: 8.8,
    problemSolvingScore: 9.2,
    skills: ['React Native', 'TypeScript', 'Redux', 'Node.js', 'GraphQL', 'Jest', 'Firebase'],
    experience: '5.5 Years',
    availability: 'Immediate',
    type: 'bench',
    company: 'Infosys Ltd.',
    hourlyRate: { min: 25, max: 35 },
    location: 'Bangalore, India',
    englishLevel: 'Professional',
    certifications: [
      { name: 'Meta React Native', issuer: 'Meta', year: '2023' },
      { name: 'AWS Certified Dev', issuer: 'Amazon', year: '2022' }
    ],
    about: 'Senior React Native Developer with over 5 years of experience building high-performance mobile applications for both iOS and Android. Proven track record of delivering scalable solutions for FinTech and E-commerce domains. Currently on bench at Infosys and available for immediate contract deployment.\n\nProficient in TypeScript, Redux Toolkit, and integrating native modules. Experienced in working with agile teams and mentoring junior developers.',
    workExperience: [
      {
        role: 'Senior Systems Engineer',
        company: 'Infosys Ltd.',
        period: 'Jan 2022 - Present',
        location: 'Bangalore',
        highlights: [
          'Led the mobile development team for a major US banking client app.',
          'Optimized app startup time by 40% using Hermes engine.',
          'Managed a team of 5 developers and handled code reviews.'
        ]
      },
      {
        role: 'Software Developer',
        company: 'TechMahindra',
        period: 'Jun 2019 - Dec 2021',
        location: 'Hyderabad',
        highlights: [
          'Developed cross-platform mobile apps for retail customers.',
          'Integrated payment gateways and third-party analytics tools.',
          'Worked closely with UX designers to implement pixel-perfect UI.'
        ]
      }
    ],
    projects: [
      { name: 'FinPay Wallet App', description: 'Mobile wallet application', technologies: ['React Native', 'Redux', 'Node.js'], icon: 'smartphone' },
      { name: 'ShopEase E-commerce', description: 'E-commerce mobile app', technologies: ['React Native', 'Firebase', 'Stripe'], icon: 'shopping' }
    ]
  },
  { 
    id: 2, 
    name: 'Sarah Chen', 
    role: 'Senior React Developer', 
    matchScore: 94, 
    technicalScore: 9.2,
    communicationScore: 9.0,
    problemSolvingScore: 8.8,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker'],
    experience: '7 years',
    availability: 'Immediate',
    type: 'individual',
    hourlyRate: { min: 40, max: 55 },
    location: 'San Francisco, USA',
    englishLevel: 'Native',
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023' }
    ],
    about: 'Passionate React developer with 7 years of experience building scalable web applications. Expert in modern React patterns, state management, and performance optimization.',
    workExperience: [
      {
        role: 'Senior Frontend Engineer',
        company: 'Tech Startup Inc.',
        period: 'Mar 2020 - Present',
        location: 'San Francisco',
        highlights: [
          'Led frontend architecture for a SaaS platform serving 100k+ users.',
          'Implemented micro-frontend architecture reducing build times by 60%.',
          'Mentored 4 junior developers.'
        ]
      }
    ],
    projects: [
      { name: 'SaaS Dashboard', description: 'Analytics dashboard', technologies: ['React', 'TypeScript', 'D3.js'], icon: 'smartphone' }
    ]
  },
  { 
    id: 3, 
    name: 'Alex Kumar', 
    role: 'Full Stack Engineer', 
    matchScore: 91, 
    technicalScore: 8.9,
    communicationScore: 8.5,
    problemSolvingScore: 9.0,
    skills: ['React', 'Python', 'AWS', 'PostgreSQL', 'Django', 'Redis'],
    experience: '5 years',
    availability: '2 weeks',
    type: 'individual',
    hourlyRate: { min: 35, max: 45 },
    location: 'London, UK',
    englishLevel: 'Professional',
    certifications: [
      { name: 'Google Cloud Professional', issuer: 'Google', year: '2022' }
    ],
    about: 'Full stack engineer with expertise in React and Python. Strong background in building RESTful APIs and cloud infrastructure.',
    workExperience: [
      {
        role: 'Full Stack Developer',
        company: 'FinTech Solutions',
        period: 'Aug 2019 - Present',
        location: 'London',
        highlights: [
          'Built and maintained payment processing systems.',
          'Reduced API response times by 45% through optimization.',
          'Implemented CI/CD pipelines using GitHub Actions.'
        ]
      }
    ],
    projects: [
      { name: 'Payment Gateway', description: 'Payment processing system', technologies: ['React', 'Python', 'PostgreSQL'], icon: 'shopping' }
    ]
  },
  { 
    id: 4, 
    name: 'Maria Silva', 
    role: 'React Native Specialist', 
    matchScore: 89, 
    technicalScore: 8.7,
    communicationScore: 9.1,
    problemSolvingScore: 8.5,
    skills: ['React Native', 'JavaScript', 'Redux', 'Firebase', 'iOS', 'Android'],
    experience: '6 years',
    availability: 'Immediate',
    type: 'bench',
    company: 'TechBench Inc.',
    hourlyRate: { min: 30, max: 40 },
    location: 'São Paulo, Brazil',
    englishLevel: 'Professional',
    certifications: [
      { name: 'React Native Certification', issuer: 'Meta', year: '2023' }
    ],
    about: 'Mobile development specialist with 6 years of experience in React Native. Passionate about creating smooth, performant mobile experiences.',
    workExperience: [
      {
        role: 'Mobile Developer',
        company: 'TechBench Inc.',
        period: 'Feb 2018 - Present',
        location: 'São Paulo',
        highlights: [
          'Developed 15+ mobile applications for various clients.',
          'Specialized in performance optimization and native module integration.',
          'Conducted technical interviews for new hires.'
        ]
      }
    ],
    projects: [
      { name: 'Delivery App', description: 'Food delivery platform', technologies: ['React Native', 'Firebase', 'Maps'], icon: 'smartphone' }
    ]
  },
  { 
    id: 5, 
    name: 'James Wilson', 
    role: 'Frontend Architect', 
    matchScore: 87, 
    technicalScore: 9.4,
    communicationScore: 8.2,
    problemSolvingScore: 9.1,
    skills: ['React', 'Vue', 'TypeScript', 'Webpack', 'Micro-frontends', 'Performance'],
    experience: '8 years',
    availability: '1 week',
    type: 'individual',
    hourlyRate: { min: 50, max: 70 },
    location: 'Toronto, Canada',
    englishLevel: 'Native',
    certifications: [
      { name: 'Web Performance Expert', issuer: 'Google', year: '2023' }
    ],
    about: 'Frontend architect with deep expertise in building large-scale web applications. Focused on performance, scalability, and developer experience.',
    workExperience: [
      {
        role: 'Lead Frontend Architect',
        company: 'Enterprise Corp.',
        period: 'Jan 2019 - Present',
        location: 'Toronto',
        highlights: [
          'Designed micro-frontend architecture for a team of 30 developers.',
          'Reduced bundle size by 65% through code splitting strategies.',
          'Established frontend best practices and coding standards.'
        ]
      }
    ],
    projects: [
      { name: 'Enterprise Portal', description: 'Large-scale web application', technologies: ['React', 'TypeScript', 'Webpack'], icon: 'smartphone' }
    ]
  },
];

const EmployerAIShortlists = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);

  const candidates = candidatesData.map(c => ({
    ...c,
    stage: shortlistedIds.includes(c.id) ? 'shortlisted' : 'matched'
  }));

  const filteredCandidates = candidates.filter(c => {
    if (activeTab === 'matched') return c.stage === 'matched';
    if (activeTab === 'shortlisted') return c.stage === 'shortlisted';
    return true;
  });

  const handleViewProfile = (candidate: CandidateProfile) => {
    setSelectedCandidate(candidate);
    setShowProfileModal(true);
  };

  const handleShortlist = (candidate: CandidateProfile) => {
    if (!shortlistedIds.includes(candidate.id)) {
      setShortlistedIds([...shortlistedIds, candidate.id]);
      toast.success(`${candidate.name} added to shortlist!`);
    }
    setShowProfileModal(false);
  };

  const handleScheduleInterview = (candidate: CandidateProfile) => {
    toast.success(`Interview scheduled with ${candidate.name}!`);
    setShowProfileModal(false);
    navigate('/employer/ai-interviews');
  };

  const handleSkillTest = (candidate: CandidateProfile) => {
    toast.success(`Skill test scheduled for ${candidate.name}!`);
    setShowProfileModal(false);
    navigate('/employer/skill-tests');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{candidates.length} AI Matched Candidates</h2>
                <p className="text-muted-foreground">For your active job postings</p>
              </div>
            </div>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
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
                      <Avatar className="h-14 w-14 bg-primary/10">
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
                        {candidate.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{candidate.skills.length - 4}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-[120px]">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="font-medium text-sm">{candidate.experience}</p>
                      <p className="text-xs text-muted-foreground mt-2">Availability</p>
                      <p className="font-medium text-sm text-primary">{candidate.availability}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <Button size="sm" className="rounded-lg" onClick={() => handleViewProfile(candidate)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      {candidate.stage === 'matched' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-lg"
                          onClick={() => handleShortlist(candidate)}
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Shortlist
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-lg text-primary border-primary hover:bg-primary/10"
                          onClick={() => handleSkillTest(candidate)}
                        >
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

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        candidate={selectedCandidate}
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onScheduleInterview={handleScheduleInterview}
        onShortlist={handleShortlist}
        onSkillTest={handleSkillTest}
      />
    </div>
  );
};

export default EmployerAIShortlists;

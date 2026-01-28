import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Users, 
  Sparkles, 
  TrendingUp,
  Pause,
  Play,
  MoreHorizontal,
  Download
} from 'lucide-react';
import CandidateCard, { Candidate } from '@/components/employer/candidates/CandidateCard';
import CandidateFilters from '@/components/employer/candidates/CandidateFilters';
import CandidateProfileDrawer from '@/components/employer/candidates/CandidateProfileDrawer';
import AIInterviewModal from '@/components/employer/candidates/AIInterviewModal';
import { toast } from 'sonner';

// Mock candidates data
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: 'Anna Kowalska',
    avatar: '',
    currentRole: 'Senior Software Engineer',
    experience: '6 years',
    location: 'Warsaw, Poland',
    aiScore: 92,
    skillsMatch: 95,
    experienceMatch: 88,
    cultureFit: 90,
    tags: ['Leadership', 'Fast Learner', 'Team Player'],
    status: 'new',
    interviewStatus: undefined,
    appliedDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Piotr Nowak',
    avatar: '',
    currentRole: 'Full Stack Developer',
    experience: '4 years',
    location: 'Krakow, Poland',
    aiScore: 85,
    skillsMatch: 82,
    experienceMatch: 88,
    cultureFit: 85,
    tags: ['Creative', 'Problem Solver'],
    status: 'reviewed',
    interviewStatus: 'pending',
    appliedDate: '2024-01-14',
  },
  {
    id: 3,
    name: 'Maria Wiśniewska',
    avatar: '',
    currentRole: 'Frontend Developer',
    experience: '3 years',
    location: 'Remote',
    aiScore: 78,
    skillsMatch: 80,
    experienceMatch: 72,
    cultureFit: 82,
    tags: ['Detail-oriented', 'UI Expert'],
    status: 'interviewed',
    interviewStatus: 'completed',
    appliedDate: '2024-01-13',
  },
  {
    id: 4,
    name: 'Jan Kowalczyk',
    avatar: '',
    currentRole: 'Backend Developer',
    experience: '5 years',
    location: 'Wroclaw, Poland',
    aiScore: 88,
    skillsMatch: 90,
    experienceMatch: 85,
    cultureFit: 88,
    tags: ['System Design', 'Mentoring'],
    status: 'shortlisted',
    interviewStatus: 'results_available',
    appliedDate: '2024-01-12',
  },
  {
    id: 5,
    name: 'Katarzyna Zielińska',
    avatar: '',
    currentRole: 'DevOps Engineer',
    experience: '7 years',
    location: 'Berlin, Germany',
    aiScore: 72,
    skillsMatch: 68,
    experienceMatch: 78,
    cultureFit: 70,
    tags: ['Cloud Expert', 'Automation'],
    status: 'new',
    interviewStatus: undefined,
    appliedDate: '2024-01-11',
  },
  {
    id: 6,
    name: 'Tomasz Lewandowski',
    avatar: '',
    currentRole: 'Tech Lead',
    experience: '8 years',
    location: 'Warsaw, Poland',
    aiScore: 95,
    skillsMatch: 92,
    experienceMatch: 98,
    cultureFit: 94,
    tags: ['Leadership', 'Architecture', 'Mentoring'],
    status: 'new',
    interviewStatus: undefined,
    appliedDate: '2024-01-10',
  },
];

const defaultFilters = {
  aiScoreMin: 0,
  skillsMatchMin: 0,
  experienceRange: [0, 20] as [number, number],
  location: 'any',
  availability: 'any',
  education: 'any',
  assessmentStatus: [] as string[],
  status: [] as string[],
};

const JobCandidates: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('ai_score');
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState<Candidate | null>(null);
  const [jobStatus, setJobStatus] = useState<'active' | 'paused'>('active');

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let result = mockCandidates.filter(candidate => {
      // Search filter
      if (searchQuery && !candidate.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // AI Score filter
      if (candidate.aiScore < filters.aiScoreMin) return false;
      // Skills Match filter
      if (candidate.skillsMatch < filters.skillsMatchMin) return false;
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(candidate.status)) {
        return false;
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'ai_score':
          return b.aiScore - a.aiScore;
        case 'skills_match':
          return b.skillsMatch - a.skillsMatch;
        case 'experience':
          return parseInt(b.experience) - parseInt(a.experience);
        case 'recent':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, filters, sortBy]);

  const handleSelectCandidate = (candidate: Candidate) => {
    // Navigate to full-page candidate profile
    navigate(`/employer-dashboard/job/${jobId}/candidate/${candidate.id}`);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setInterviewCandidate(candidate);
    setInterviewModalOpen(true);
  };

  const handleShortlist = (candidate: Candidate) => {
    toast.success(`${candidate.name} added to shortlist`);
  };

  const handleReject = (candidate: Candidate) => {
    toast.info(`${candidate.name} moved to rejected`);
  };

  const handleInterviewComplete = (candidate: Candidate, settings: any) => {
    console.log('Interview scheduled:', candidate, settings);
  };

  const averageAIScore = Math.round(
    mockCandidates.reduce((sum, c) => sum + c.aiScore, 0) / mockCandidates.length
  );

  const highMatchCount = mockCandidates.filter(c => c.aiScore >= 80).length;

  return (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">Senior React Developer</h1>
            <Badge 
              variant="outline" 
              className={jobStatus === 'active' 
                ? 'bg-green-100 text-green-700 border-green-200' 
                : 'bg-amber-100 text-amber-700 border-amber-200'
              }
            >
              {jobStatus === 'active' ? 'Active' : 'Paused'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Posted 5 days ago • {mockCandidates.length} applicants
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setJobStatus(jobStatus === 'active' ? 'paused' : 'active')}
          >
            {jobStatus === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause Job
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Activate Job
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockCandidates.length}</p>
              <p className="text-sm text-muted-foreground">Total Applicants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{highMatchCount}</p>
              <p className="text-sm text-muted-foreground">High Match (80%+)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{averageAIScore}%</p>
              <p className="text-sm text-muted-foreground">Avg. AI Match</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <CandidateFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
            totalCandidates={mockCandidates.length}
            filteredCount={filteredCandidates.length}
          />
        </div>

        {/* Candidates List */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ai_score">AI Score</SelectItem>
                      <SelectItem value="skills_match">Skills Match</SelectItem>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                  <ToggleGroup 
                    type="single" 
                    value={viewMode} 
                    onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}
                  >
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Grid/List */}
          {filteredCandidates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No candidates found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" 
              : "space-y-3"
            }>
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onSelect={handleSelectCandidate}
                  onScheduleInterview={handleScheduleInterview}
                  onShortlist={handleShortlist}
                  onReject={handleReject}
                  isSelected={selectedCandidate?.id === candidate.id}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Profile Drawer */}
      <CandidateProfileDrawer
        candidate={selectedCandidate}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onScheduleInterview={handleScheduleInterview}
        onShortlist={handleShortlist}
        onReject={handleReject}
      />

      {/* AI Interview Modal */}
      <AIInterviewModal
        candidate={interviewCandidate}
        open={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        onComplete={handleInterviewComplete}
      />
    </div>
  );
};

export default JobCandidates;

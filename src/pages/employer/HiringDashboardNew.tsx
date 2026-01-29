import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileCheck, 
  Video,
  ChevronRight,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const activeJobs = [
  { id: 1, title: 'Senior React Developer', candidates: 45, shortlisted: 12, interviewed: 5, status: 'active' },
  { id: 2, title: 'Python Data Engineer', candidates: 32, shortlisted: 8, interviewed: 3, status: 'active' },
  { id: 3, title: 'DevOps Specialist', candidates: 28, shortlisted: 6, interviewed: 2, status: 'reviewing' },
];

const topCandidates = [
  { id: 1, name: 'Sarah Chen', role: 'React Developer', match: 94, testScore: 92, interviewScore: 95 },
  { id: 2, name: 'Alex Kumar', role: 'React Developer', match: 91, testScore: 88, interviewScore: null },
  { id: 3, name: 'Maria Silva', role: 'React Developer', match: 89, testScore: 90, interviewScore: null },
];

const HiringDashboardNew = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Find Your Next Great Hire 🚀</h2>
            <p className="text-primary-foreground/80">AI has shortlisted 12 new candidates matching your open roles.</p>
          </div>
          <Button variant="secondary" className="bg-background text-foreground hover:bg-background/90" asChild>
            <Link to="/employer/post-job">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">142</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">26</p>
                <p className="text-sm text-muted-foreground">AI Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Interviews Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Jobs */}
        <div className="lg:col-span-2">
          <Card className="border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Active Jobs</CardTitle>
              <Link to="/employer/post-job" className="text-sm text-primary hover:underline flex items-center gap-1">
                Post Job <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {job.candidates} candidates • Posted 3 days ago
                      </p>
                    </div>
                    <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                      {job.status}
                    </Badge>
                  </div>
                  
                  {/* Pipeline Progress */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-lg font-bold text-foreground">{job.candidates}</p>
                      <p className="text-xs text-muted-foreground">Applied</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-lg font-bold text-primary">{job.shortlisted}</p>
                      <p className="text-xs text-muted-foreground">AI Shortlisted</p>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{job.interviewed}</p>
                      <p className="text-xs text-muted-foreground">Interviewed</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 rounded-lg">View Shortlist</Button>
                    <Button size="sm" variant="outline" className="rounded-lg">Manage</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Candidates */}
        <div>
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                Top AI Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCandidates.map((candidate, index) => (
                <div key={candidate.id} className="p-4 border border-border rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-sm">{candidate.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{candidate.match}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <p className="text-sm font-bold">{candidate.testScore}</p>
                      <p className="text-xs text-muted-foreground">Test Score</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      {candidate.interviewScore ? (
                        <>
                          <p className="text-sm font-bold text-primary">{candidate.interviewScore}</p>
                          <p className="text-xs text-muted-foreground">Interview</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-orange-500">—</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </>
                      )}
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="w-full rounded-lg">
                    View Profile
                  </Button>
                </div>
              ))}

              <Link to="/employer/shortlists" className="block text-center text-sm text-primary hover:underline pt-2">
                View All Candidates →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HiringDashboardNew;

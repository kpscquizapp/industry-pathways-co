import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Brain,
  ClipboardCheck,
  Video,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  FileSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';

const HiringDashboard = () => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: 'Active Jobs',
      value: '12',
      change: '+3 this week',
      icon: Briefcase,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      title: 'AI Matched Candidates',
      value: '156',
      change: '24 new matches',
      icon: Brain,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10'
    },
    {
      title: 'Skill Tests Scheduled',
      value: '28',
      change: '8 completed today',
      icon: ClipboardCheck,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      title: 'AI Interviews',
      value: '15',
      change: '5 pending review',
      icon: Video,
      gradient: 'from-orange-500 to-amber-500',
      bgGradient: 'from-orange-500/10 to-amber-500/10'
    }
  ];

  const matchedCandidates = [
    { name: 'Sarah Johnson', role: 'Senior React Developer', score: 94, skills: ['React', 'TypeScript', 'Node.js'], status: 'New Match' },
    { name: 'Michael Chen', role: 'Full Stack Engineer', score: 91, skills: ['Python', 'React', 'AWS'], status: 'Test Scheduled' },
    { name: 'Emily Rodriguez', role: 'Frontend Developer', score: 88, skills: ['Vue.js', 'CSS', 'JavaScript'], status: 'Interview Done' },
    { name: 'David Kim', role: 'Backend Developer', score: 85, skills: ['Java', 'Spring', 'PostgreSQL'], status: 'New Match' },
  ];

  const activeJobs = [
    { title: 'Senior React Developer', applicants: 45, matched: 12, status: 'Active', posted: '2 days ago' },
    { title: 'Product Manager', applicants: 38, matched: 8, status: 'Active', posted: '5 days ago' },
    { title: 'DevOps Engineer', applicants: 22, matched: 6, status: 'Active', posted: '1 week ago' },
  ];

  const upcomingTests = [
    { candidate: 'John Smith', job: 'Senior React Developer', type: 'Coding Test', time: 'Today, 2:00 PM' },
    { candidate: 'Lisa Wang', job: 'Product Manager', type: 'MCQ Assessment', time: 'Today, 4:30 PM' },
    { candidate: 'Alex Turner', job: 'DevOps Engineer', type: 'System Design', time: 'Tomorrow, 10:00 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Hiring Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your hiring pipeline with AI-powered insights
          </p>
        </div>
        <Button 
          onClick={() => navigate('/hiring-dashboard/jobs')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="border-0 shadow-lg overflow-hidden">
              <CardContent className={cn("p-6 bg-gradient-to-br", kpi.bgGradient)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      {kpi.change}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", kpi.gradient)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Matched Candidates */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Matched Candidates
              <Badge className="ml-2 bg-purple-100 text-purple-700">Live</Badge>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/hiring-dashboard/ai-candidates')}
              className="text-indigo-600 hover:text-indigo-700"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matchedCandidates.map((candidate, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      <div className="flex gap-1 mt-1">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold text-lg">{candidate.score}%</span>
                    </div>
                    <Badge variant={candidate.status === 'New Match' ? 'default' : 'secondary'} className="text-xs">
                      {candidate.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Tests */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardCheck className="h-5 w-5 text-green-500" />
                Upcoming Skill Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTests.map((test, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">{test.candidate}</p>
                    <p className="text-xs text-muted-foreground">{test.job}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">{test.type}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {test.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/hiring-dashboard/skill-tests')}
              >
                Schedule New Test
              </Button>
            </CardContent>
          </Card>

          {/* Active Jobs Summary */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Active Job Postings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeJobs.map((job, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50">
                    <p className="font-medium text-sm">{job.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applicants} applied
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="h-3 w-3 text-purple-500" />
                        {job.matched} matched
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/hiring-dashboard/jobs')}
              >
                View All Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hiring Funnel */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-500" />
            Hiring Funnel Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { stage: 'Applications', count: 245, color: 'from-blue-500 to-cyan-500' },
              { stage: 'AI Screened', count: 156, color: 'from-purple-500 to-pink-500' },
              { stage: 'Skill Tests', count: 78, color: 'from-green-500 to-emerald-500' },
              { stage: 'AI Interviews', count: 34, color: 'from-orange-500 to-amber-500' },
              { stage: 'Offers Sent', count: 12, color: 'from-indigo-500 to-purple-500' },
            ].map((stage, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-muted/50">
                <div className={cn("w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-gradient-to-br shadow-lg mb-3", stage.color)}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <p className="text-2xl font-bold">{stage.count}</p>
                <p className="text-xs text-muted-foreground">{stage.stage}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HiringDashboard;

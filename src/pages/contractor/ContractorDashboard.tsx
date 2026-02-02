import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  FileCheck, 
  Video, 
  Star,
  ChevronRight,
  Sparkles,
  Target,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import SpinnerLoader from '@/components/loader/SpinnerLoader';

const recommendedJobs = [
  { id: 1, title: 'Senior React Developer', company: 'TechCorp', match: 94, duration: '6 months', testRequired: true },
  { id: 2, title: 'Full Stack Engineer', company: 'InnovateLab', match: 89, duration: '3 months', testRequired: false },
  { id: 3, title: 'Frontend Specialist', company: 'DataFlow', match: 87, duration: '12 months', testRequired: true },
];

const ContractorDashboard = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <SpinnerLoader className="w-10 h-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">Personalizing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-green-400 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h2>
            <p className="text-white/80">You have 3 new job matches waiting for you.</p>
          </div>
          <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
            View All Matches
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">87</p>
                <p className="text-sm text-muted-foreground">Skill Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">92</p>
                <p className="text-sm text-muted-foreground">Interview Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Tests Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recommended Jobs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Recommended Jobs
              </CardTitle>
              <Link to="/contractor/jobs" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.duration}
                        </span>
                        {job.testRequired && (
                          <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full">
                            Test Required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full border-4 border-primary flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{job.match}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Match</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 rounded-lg">Apply Now</Button>
                    {job.testRequired && (
                      <Button size="sm" variant="outline" className="rounded-lg">Take Test</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Skill Gap Insights */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Skill Gap Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>React.js</span>
                  <span className="text-primary font-medium">Expert</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>TypeScript</span>
                  <span className="text-primary font-medium">Advanced</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Node.js</span>
                  <span className="text-orange-500 font-medium">Intermediate</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>AWS</span>
                  <span className="text-red-500 font-medium">Needs Work</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Improve your AWS skills to unlock 15+ more job matches
                </p>
                <Button variant="outline" size="sm" className="w-full rounded-lg">
                  Take AWS Assessment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interview Feedback */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-primary" />
                Latest Interview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-green-400 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">92</span>
                </div>
                <p className="font-semibold">Great Performance!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Strong technical depth & communication
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">94</p>
                  <p className="text-xs text-muted-foreground">Technical</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">90</p>
                  <p className="text-xs text-muted-foreground">Communication</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary">91</p>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;

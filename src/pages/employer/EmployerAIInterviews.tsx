import React, { useState } from 'react';
import { 
  Calendar, 
  Video,
  Play,
  Eye,
  Star,
  MessageSquare,
  BarChart3,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const scheduledInterviews = [
  { 
    id: 1, 
    candidate: 'Sarah Chen', 
    job: 'Senior React Developer',
    scheduledAt: '2025-02-01 10:00 AM',
    testScore: 92,
    status: 'scheduled'
  },
  { 
    id: 2, 
    candidate: 'Alex Kumar', 
    job: 'Senior React Developer',
    scheduledAt: '2025-02-02 2:00 PM',
    testScore: 88,
    status: 'scheduled'
  },
];

const completedInterviews = [
  { 
    id: 3, 
    candidate: 'Maria Silva', 
    job: 'React Native Specialist',
    completedAt: '2025-01-25',
    scores: {
      communication: 90,
      technical: 95,
      problemSolving: 88,
      overall: 91
    },
    recommendation: 'strongly_recommend',
    duration: '32 min'
  },
  { 
    id: 4, 
    candidate: 'James Wilson', 
    job: 'Frontend Architect',
    completedAt: '2025-01-24',
    scores: {
      communication: 85,
      technical: 78,
      problemSolving: 82,
      overall: 82
    },
    recommendation: 'recommend',
    duration: '28 min'
  },
  { 
    id: 5, 
    candidate: 'Priya Sharma', 
    job: 'Senior Developer',
    completedAt: '2025-01-23',
    scores: {
      communication: 70,
      technical: 55,
      problemSolving: 60,
      overall: 62
    },
    recommendation: 'not_recommend',
    duration: '25 min'
  },
];

const getRecommendationBadge = (recommendation: string) => {
  switch (recommendation) {
    case 'strongly_recommend':
      return <Badge className="bg-green-500 text-white">Strongly Recommend</Badge>;
    case 'recommend':
      return <Badge className="bg-blue-500 text-white">Recommend</Badge>;
    case 'not_recommend':
      return <Badge variant="destructive">Not Recommended</Badge>;
    default:
      return <Badge variant="secondary">Pending</Badge>;
  }
};

const EmployerAIInterviews = () => {
  const [activeTab, setActiveTab] = useState('scheduled');

  return (
    <div className="space-y-6">
      {/* Prerequisite Notice */}
      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">AI Interviews require completed Skill Tests</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Candidates must pass the skill assessment before scheduling an AI interview.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">AI Interviews</h2>
        <Button className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="scheduled" className="rounded-lg px-6">Scheduled</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-6">Completed</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg px-6">Analytics</TabsTrigger>
        </TabsList>

        {/* Scheduled */}
        <TabsContent value="scheduled" className="mt-6">
          <div className="space-y-4">
            {scheduledInterviews.map((interview) => (
              <Card key={interview.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-center">
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-primary/30 to-green-400/30">
                      <AvatarFallback className="font-semibold text-primary">
                        {interview.candidate.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-semibold">{interview.candidate}</h3>
                      <p className="text-sm text-muted-foreground">{interview.job}</p>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <p className="text-xs text-muted-foreground">Skill Test</p>
                      <p className="font-bold text-green-600">{interview.testScore}%</p>
                    </div>

                    <div className="text-center min-w-[150px]">
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                      <p className="font-medium text-sm">{interview.scheduledAt}</p>
                    </div>

                    <Badge variant="secondary">Scheduled</Badge>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        Reschedule
                      </Button>
                      <Button size="sm" className="rounded-lg">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {completedInterviews.map((interview) => (
              <Card key={interview.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-start">
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-primary/30 to-green-400/30">
                      <AvatarFallback className="font-semibold text-primary">
                        {interview.candidate.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{interview.candidate}</h3>
                        {getRecommendationBadge(interview.recommendation)}
                      </div>
                      <p className="text-sm text-muted-foreground">{interview.job}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{interview.completedAt}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {interview.duration}
                        </span>
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className="text-center min-w-[100px]">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-muted/30"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="35"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={`${(interview.scores.overall / 100) * 220} 220`}
                            className={interview.scores.overall >= 75 ? 'text-green-500' : interview.scores.overall >= 60 ? 'text-amber-500' : 'text-destructive'}
                          />
                        </svg>
                        <span className={`absolute text-lg font-bold ${interview.scores.overall >= 75 ? 'text-green-500' : interview.scores.overall >= 60 ? 'text-amber-500' : 'text-destructive'}`}>
                          {interview.scores.overall}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Overall</p>
                    </div>

                    {/* Score Breakdown */}
                    <div className="flex-1 min-w-[250px]">
                      <p className="text-xs text-muted-foreground mb-2">Score Breakdown</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs w-28">Communication</span>
                          <Progress value={interview.scores.communication} className="flex-1 h-2" />
                          <span className="text-xs font-medium w-8">{interview.scores.communication}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs w-28">Technical</span>
                          <Progress value={interview.scores.technical} className="flex-1 h-2" />
                          <span className="text-xs font-medium w-8">{interview.scores.technical}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs w-28">Problem Solving</span>
                          <Progress value={interview.scores.problemSolving} className="flex-1 h-2" />
                          <span className="text-xs font-medium w-8">{interview.scores.problemSolving}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Play className="h-4 w-4 mr-1" />
                        Watch Replay
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Eye className="h-4 w-4 mr-1" />
                        Full Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Interview Analytics</h3>
                <p className="text-muted-foreground">View aggregated interview performance data and trends</p>
                <Button className="mt-4 rounded-xl">View Full Analytics</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerAIInterviews;

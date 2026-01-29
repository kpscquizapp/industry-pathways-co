import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Play,
  Eye,
  Users,
  FileText,
  BarChart3,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const scheduledTests = [
  { 
    id: 1, 
    candidate: 'Sarah Chen', 
    job: 'Senior React Developer',
    areas: ['React', 'TypeScript', 'System Design'],
    duration: 90,
    deadline: '2025-02-01',
    status: 'pending'
  },
  { 
    id: 2, 
    candidate: 'Alex Kumar', 
    job: 'Senior React Developer',
    areas: ['React', 'Node.js', 'API Design'],
    duration: 60,
    deadline: '2025-02-02',
    status: 'in_progress'
  },
];

const completedTests = [
  { 
    id: 3, 
    candidate: 'Maria Silva', 
    job: 'React Native Specialist',
    areas: ['React Native', 'JavaScript', 'Mobile UI'],
    duration: 60,
    score: 92,
    passed: true,
    completedAt: '2025-01-25',
    breakdown: { 'React Native': 95, 'JavaScript': 90, 'Mobile UI': 88 }
  },
  { 
    id: 4, 
    candidate: 'James Wilson', 
    job: 'Frontend Architect',
    areas: ['React', 'Performance', 'Architecture'],
    duration: 90,
    score: 78,
    passed: true,
    completedAt: '2025-01-24',
    breakdown: { 'React': 85, 'Performance': 72, 'Architecture': 75 }
  },
  { 
    id: 5, 
    candidate: 'Priya Sharma', 
    job: 'Senior Developer',
    areas: ['React', 'Angular', 'Testing'],
    duration: 60,
    score: 45,
    passed: false,
    completedAt: '2025-01-23',
    breakdown: { 'React': 60, 'Angular': 35, 'Testing': 40 }
  },
];

const EmployerSkillTests = () => {
  const [activeTab, setActiveTab] = useState('scheduled');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
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
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Passed</p>
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
                <p className="text-2xl font-bold">82%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">Skill Assessments</h2>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Bulk Tests
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="scheduled" className="rounded-lg px-6">Scheduled</TabsTrigger>
          <TabsTrigger value="results" className="rounded-lg px-6">Results</TabsTrigger>
          <TabsTrigger value="library" className="rounded-lg px-6">Test Library</TabsTrigger>
        </TabsList>

        {/* Scheduled Tests */}
        <TabsContent value="scheduled" className="mt-6">
          <div className="space-y-4">
            {scheduledTests.map((test) => (
              <Card key={test.id} className="border border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-center">
                    <Avatar className="h-12 w-12 bg-primary/10">
                      <AvatarFallback className="font-semibold text-primary">
                        {test.candidate.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-semibold">{test.candidate}</h3>
                      <p className="text-sm text-muted-foreground">{test.job}</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-xs text-muted-foreground mb-1">Test Areas</p>
                      <div className="flex flex-wrap gap-1">
                        {test.areas.map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">{area}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{test.duration} min</span>
                      </div>
                    </div>

                    <div className="text-center min-w-[100px]">
                      <p className="text-xs text-muted-foreground">Deadline</p>
                      <p className="font-medium text-sm">{test.deadline}</p>
                    </div>

                    <Badge variant={test.status === 'in_progress' ? 'default' : 'secondary'}>
                      {test.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>

                    <Button variant="outline" size="sm" className="rounded-lg">
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Results */}
        <TabsContent value="results" className="mt-6">
          <div className="space-y-4">
            {completedTests.map((test) => (
              <Card key={test.id} className="border border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-start">
                    <Avatar className="h-12 w-12 bg-primary/10">
                      <AvatarFallback className="font-semibold text-primary">
                        {test.candidate.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{test.candidate}</h3>
                        {test.passed ? (
                          <Badge className="bg-green-500 text-white">Passed</Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{test.job}</p>
                      <p className="text-xs text-muted-foreground mt-1">Completed: {test.completedAt}</p>
                    </div>

                    {/* Score Circle */}
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
                            strokeDasharray={`${(test.score / 100) * 220} 220`}
                            className={test.passed ? 'text-green-500' : 'text-destructive'}
                          />
                        </svg>
                        <span className={`absolute text-lg font-bold ${test.passed ? 'text-green-500' : 'text-destructive'}`}>
                          {test.score}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
                    </div>

                    {/* Breakdown */}
                    <div className="flex-1 min-w-[250px]">
                      <p className="text-xs text-muted-foreground mb-2">Score Breakdown</p>
                      <div className="space-y-2">
                        {Object.entries(test.breakdown).map(([skill, score]) => (
                          <div key={skill} className="flex items-center gap-3">
                            <span className="text-xs w-24 truncate">{skill}</span>
                            <Progress value={score} className="flex-1 h-2" />
                            <span className="text-xs font-medium w-8">{score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Library */}
        <TabsContent value="library" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {['React Fundamentals', 'TypeScript Advanced', 'Node.js Backend', 'System Design', 'SQL & Databases', 'API Design'].map((testName) => (
              <Card key={testName} className="hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{testName}</h3>
                      <p className="text-sm text-muted-foreground">60 minutes • 25 questions</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">Auto-graded</Badge>
                        <Badge variant="outline" className="text-xs">Intermediate</Badge>
                      </div>
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

export default EmployerSkillTests;

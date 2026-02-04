import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileCheck, 
  Clock, 
  Award, 
  PlayCircle, 
  CheckCircle2, 
  Lock,
  TrendingUp,
  Target
} from 'lucide-react';

interface SkillTest {
  id: string;
  name: string;
  category: string;
  duration: string;
  questions: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'available' | 'in-progress' | 'completed' | 'locked';
  score?: number;
  completedAt?: string;
}

const mockTests: SkillTest[] = [
  {
    id: '1',
    name: 'React.js Fundamentals',
    category: 'Frontend',
    duration: '45 min',
    questions: 30,
    difficulty: 'Intermediate',
    status: 'completed',
    score: 85,
    completedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'TypeScript Essentials',
    category: 'Frontend',
    duration: '30 min',
    questions: 25,
    difficulty: 'Intermediate',
    status: 'completed',
    score: 92,
    completedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Node.js Backend Development',
    category: 'Backend',
    duration: '60 min',
    questions: 40,
    difficulty: 'Advanced',
    status: 'available'
  },
  {
    id: '4',
    name: 'SQL & Database Design',
    category: 'Database',
    duration: '45 min',
    questions: 35,
    difficulty: 'Intermediate',
    status: 'available'
  },
  {
    id: '5',
    name: 'System Design Basics',
    category: 'Architecture',
    duration: '60 min',
    questions: 20,
    difficulty: 'Advanced',
    status: 'locked'
  },
  {
    id: '6',
    name: 'REST API Design',
    category: 'Backend',
    duration: '30 min',
    questions: 25,
    difficulty: 'Beginner',
    status: 'in-progress'
  }
];

const ContractorSkillTests = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'completed'>('all');

  const completedTests = mockTests.filter(t => t.status === 'completed');
  const averageScore = completedTests.length > 0 
    ? Math.round(completedTests.reduce((sum, t) => sum + (t.score || 0), 0) / completedTests.length)
    : 0;

  const filteredTests = mockTests.filter(test => {
    if (activeTab === 'all') return true;
    if (activeTab === 'available') return test.status === 'available' || test.status === 'in-progress';
    if (activeTab === 'completed') return test.status === 'completed';
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'locked': return <Lock className="h-5 w-5 text-muted-foreground" />;
      default: return <PlayCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Skill Tests</h1>
        <p className="text-muted-foreground">Validate your skills and stand out to employers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedTests.length}</p>
                <p className="text-sm text-muted-foreground">Tests Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Target className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockTests.filter(t => t.status === 'available').length}</p>
                <p className="text-sm text-muted-foreground">Available Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">Top 15%</p>
                <p className="text-sm text-muted-foreground">Your Ranking</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(['all', 'available', 'completed'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab === 'all' ? 'All Tests' : tab}
          </Button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTests.map((test) => (
          <Card key={test.id} className={test.status === 'locked' ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <CardDescription>{test.category}</CardDescription>
                </div>
                {getStatusIcon(test.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                  {test.difficulty}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {test.duration}
                </Badge>
                <Badge variant="outline">
                  {test.questions} Questions
                </Badge>
              </div>

              {test.status === 'completed' && test.score && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score</span>
                    <span className="font-semibold">{test.score}%</span>
                  </div>
                  <Progress value={test.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Completed on {test.completedAt}
                  </p>
                </div>
              )}

              {test.status === 'in-progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              )}

              <Button 
                className="w-full" 
                disabled={test.status === 'locked'}
                variant={test.status === 'completed' ? 'outline' : 'default'}
              >
                {test.status === 'completed' && 'Retake Test'}
                {test.status === 'in-progress' && 'Continue Test'}
                {test.status === 'available' && 'Start Test'}
                {test.status === 'locked' && 'Unlock Test'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContractorSkillTests;

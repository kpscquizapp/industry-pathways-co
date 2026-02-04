import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Clock, 
  Calendar,
  PlayCircle, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Mic,
  Brain,
  Star
} from 'lucide-react';

interface AIInterview {
  id: string;
  jobTitle: string;
  company: string;
  type: 'Technical' | 'Behavioral' | 'Mixed';
  duration: string;
  status: 'scheduled' | 'ready' | 'completed' | 'expired';
  scheduledFor?: string;
  completedAt?: string;
  scores?: {
    overall: number;
    communication: number;
    technical: number;
    clarity: number;
  };
  feedback?: string;
}

const mockInterviews: AIInterview[] = [
  {
    id: '1',
    jobTitle: 'Senior React Developer',
    company: 'TechCorp Solutions',
    type: 'Technical',
    duration: '30 min',
    status: 'completed',
    completedAt: '2024-01-20',
    scores: {
      overall: 88,
      communication: 85,
      technical: 92,
      clarity: 87
    },
    feedback: 'Strong technical knowledge with excellent problem-solving skills. Consider providing more detailed explanations for complex concepts.'
  },
  {
    id: '2',
    jobTitle: 'Full Stack Engineer',
    company: 'InnovateLab Inc.',
    type: 'Mixed',
    duration: '45 min',
    status: 'ready',
    scheduledFor: 'Available Now'
  },
  {
    id: '3',
    jobTitle: 'Frontend Developer',
    company: 'Digital Dynamics',
    type: 'Behavioral',
    duration: '20 min',
    status: 'scheduled',
    scheduledFor: '2024-02-05 10:00 AM'
  },
  {
    id: '4',
    jobTitle: 'Node.js Developer',
    company: 'CloudFirst Tech',
    type: 'Technical',
    duration: '30 min',
    status: 'completed',
    completedAt: '2024-01-10',
    scores: {
      overall: 75,
      communication: 78,
      technical: 72,
      clarity: 75
    },
    feedback: 'Good understanding of Node.js fundamentals. Recommend practicing async patterns and error handling approaches.'
  },
  {
    id: '5',
    jobTitle: 'Backend Developer',
    company: 'DataFlow Systems',
    type: 'Technical',
    duration: '30 min',
    status: 'expired'
  }
];

const ContractorAIInterviews = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [selectedInterview, setSelectedInterview] = useState<AIInterview | null>(null);

  const completedInterviews = mockInterviews.filter(i => i.status === 'completed');
  const averageScore = completedInterviews.length > 0
    ? Math.round(completedInterviews.reduce((sum, i) => sum + (i.scores?.overall || 0), 0) / completedInterviews.length)
    : 0;

  const filteredInterviews = mockInterviews.filter(interview => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return interview.status === 'ready' || interview.status === 'scheduled';
    if (activeTab === 'completed') return interview.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case 'ready':
        return <Badge className="bg-primary/10 text-primary">Ready to Start</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Scheduled</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-muted-foreground">Expired</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Technical': return <Brain className="h-4 w-4" />;
      case 'Behavioral': return <MessageSquare className="h-4 w-4" />;
      default: return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Interviews</h1>
        <p className="text-muted-foreground">Practice and complete AI-powered interviews for job opportunities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedInterviews.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{averageScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockInterviews.filter(i => i.status === 'scheduled').length}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <PlayCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockInterviews.filter(i => i.status === 'ready').length}</p>
                <p className="text-sm text-muted-foreground">Ready Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {(['all', 'upcoming', 'completed'] as const).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="capitalize"
          >
            {tab === 'all' ? 'All Interviews' : tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interviews List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredInterviews.map((interview) => (
            <Card 
              key={interview.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedInterview?.id === interview.id ? 'ring-2 ring-primary' : ''
              } ${interview.status === 'expired' ? 'opacity-60' : ''}`}
              onClick={() => setSelectedInterview(interview)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{interview.jobTitle}</h3>
                      {getStatusBadge(interview.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{interview.company}</p>
                  </div>
                  {interview.status === 'completed' && interview.scores && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{interview.scores.overall}%</p>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getTypeIcon(interview.type)}
                    {interview.type}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {interview.duration}
                  </Badge>
                  {interview.scheduledFor && interview.status !== 'completed' && (
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {interview.scheduledFor}
                    </Badge>
                  )}
                </div>

                {interview.status !== 'expired' && interview.status !== 'completed' && (
                  <Button 
                    className="w-full mt-4" 
                    variant={interview.status === 'ready' ? 'default' : 'outline'}
                  >
                    {interview.status === 'ready' ? 'Start Interview' : 'View Details'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interview Details Panel */}
        <div className="space-y-4">
          {selectedInterview?.status === 'completed' && selectedInterview.scores ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Results</CardTitle>
                <CardDescription>{selectedInterview.jobTitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary">{selectedInterview.scores.overall}%</p>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Mic className="h-4 w-4" /> Communication
                      </span>
                      <span className="font-medium">{selectedInterview.scores.communication}%</span>
                    </div>
                    <Progress value={selectedInterview.scores.communication} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Brain className="h-4 w-4" /> Technical
                      </span>
                      <span className="font-medium">{selectedInterview.scores.technical}%</span>
                    </div>
                    <Progress value={selectedInterview.scores.technical} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> Clarity
                      </span>
                      <span className="font-medium">{selectedInterview.scores.clarity}%</span>
                    </div>
                    <Progress value={selectedInterview.scores.clarity} className="h-2" />
                  </div>
                </div>

                {selectedInterview.feedback && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">AI Feedback</p>
                    <p className="text-sm text-muted-foreground">{selectedInterview.feedback}</p>
                  </div>
                )}

                <Button variant="outline" className="w-full mt-2">
                  View Full Report
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Video className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Good Lighting</p>
                    <p className="text-xs text-muted-foreground">Ensure your face is well-lit and clearly visible</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mic className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Clear Audio</p>
                    <p className="text-xs text-muted-foreground">Use headphones and find a quiet space</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Think Aloud</p>
                    <p className="text-xs text-muted-foreground">Explain your thought process as you answer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorAIInterviews;

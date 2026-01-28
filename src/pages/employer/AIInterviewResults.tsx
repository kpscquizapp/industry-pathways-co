import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Star,
  TrendingUp,
  MessageSquare,
  Brain,
  Award,
  Clock,
  Video,
  UserCheck,
  UserX,
  Calendar,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-500';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-amber-100';
  return 'bg-red-100';
};

const CircularProgress = ({ score, size = 120 }: { score: number; size?: number }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn(
            "transition-all duration-500",
            score >= 80 ? "stroke-green-500" : score >= 60 ? "stroke-amber-500" : "stroke-red-500"
          )}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-bold", getScoreColor(score))}>{score}</span>
        <span className="text-sm text-muted-foreground">Overall</span>
      </div>
    </div>
  );
};

const AIInterviewResults: React.FC = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  // Mock data
  const candidate = {
    id: 1,
    name: 'Anna Kowalska',
    role: 'Senior Software Engineer',
    location: 'Warsaw, Poland',
    interviewDate: '2024-01-18',
    duration: '28 minutes',
  };

  const scores = {
    overall: 87,
    communication: 92,
    technical: 85,
    problemSolving: 88,
    cultureFit: 82,
    leadership: 78,
  };

  const sentimentAnalysis = {
    positive: 72,
    neutral: 22,
    negative: 6,
  };

  const keyMoments = [
    { 
      time: '2:34', 
      type: 'strength' as const, 
      title: 'Strong technical explanation', 
      description: 'Clearly articulated microservices architecture approach' 
    },
    { 
      time: '8:15', 
      type: 'strength' as const, 
      title: 'Problem-solving skills', 
      description: 'Demonstrated systematic approach to debugging' 
    },
    { 
      time: '12:45', 
      type: 'neutral' as const, 
      title: 'Team collaboration', 
      description: 'Mentioned experience with agile methodologies' 
    },
    { 
      time: '18:20', 
      type: 'concern' as const, 
      title: 'Limited cloud experience', 
      description: 'Less familiar with AWS services than expected' 
    },
    { 
      time: '24:10', 
      type: 'strength' as const, 
      title: 'Leadership potential', 
      description: 'Shared effective team mentoring examples' 
    },
  ];

  const interviewQuestions = [
    {
      question: 'Tell me about your experience with React and TypeScript.',
      answer: 'I have been working with React for over 5 years, starting from class components and transitioning to hooks. TypeScript has been integral to my workflow for the past 3 years, helping catch bugs early and improve code documentation.',
      score: 90,
      sentiment: 'positive',
    },
    {
      question: 'How do you approach debugging a complex issue in production?',
      answer: 'I follow a systematic approach: first reproducing the issue, then checking logs and monitoring tools, isolating the problem area, and creating a hypothesis to test. I also believe in documenting the resolution for future reference.',
      score: 92,
      sentiment: 'positive',
    },
    {
      question: 'Describe a challenging project and how you handled it.',
      answer: 'We had to migrate a legacy monolith to microservices under tight deadlines. I led the technical planning, created a phased migration strategy, and ensured zero downtime through feature flags and gradual rollouts.',
      score: 88,
      sentiment: 'positive',
    },
    {
      question: 'What experience do you have with cloud infrastructure?',
      answer: 'I have used basic AWS services like EC2 and S3, but most of my experience has been with application development rather than infrastructure. I am eager to expand my cloud knowledge.',
      score: 68,
      sentiment: 'neutral',
    },
  ];

  const recommendation = {
    status: 'strong_hire' as 'strong_hire' | 'consider' | 'reject',
    confidence: 89,
    summary: 'Anna demonstrates strong technical skills, excellent communication abilities, and promising leadership potential. While cloud infrastructure experience is limited, her learning aptitude and solid foundation make her a strong candidate for the Senior React Developer role.',
  };

  const getRecommendationStyle = (status: string) => {
    switch (status) {
      case 'strong_hire':
        return { icon: Star, color: 'text-green-600', bg: 'bg-green-100', label: 'Strong Hire' };
      case 'consider':
        return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Consider' };
      case 'reject':
        return { icon: UserX, color: 'text-red-600', bg: 'bg-red-100', label: 'Not Recommended' };
      default:
        return { icon: Star, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Pending' };
    }
  };

  const recStyle = getRecommendationStyle(recommendation.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">AI Interview Results</h1>
          <p className="text-muted-foreground">Completed on {candidate.interviewDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Candidate Info & Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidate Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                  {candidate.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">{candidate.name}</h2>
                <p className="text-muted-foreground">{candidate.role}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interview Type</span>
                <span className="font-medium flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  AI Video
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{candidate.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{candidate.interviewDate}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <Button variant="outline" className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Watch Recording
            </Button>
          </CardContent>
        </Card>

        {/* Overall Score */}
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <CircularProgress score={scores.overall} />
            <h3 className="font-semibold mt-4 mb-2">Interview Score</h3>
            <Badge className={cn("text-sm", getScoreBgColor(scores.overall), getScoreColor(scores.overall))}>
              {scores.overall >= 80 ? 'Excellent' : scores.overall >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className={cn("border-2", recommendation.status === 'strong_hire' ? 'border-green-200' : 'border-amber-200')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", recStyle.bg)}>
                <recStyle.icon className={cn("h-6 w-6", recStyle.color)} />
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", recStyle.color)}>{recStyle.label}</h3>
                <p className="text-sm text-muted-foreground">{recommendation.confidence}% confidence</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{recommendation.summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { label: 'Communication', score: scores.communication, icon: MessageSquare },
              { label: 'Technical Skills', score: scores.technical, icon: Brain },
              { label: 'Problem Solving', score: scores.problemSolving, icon: TrendingUp },
              { label: 'Culture Fit', score: scores.cultureFit, icon: UserCheck },
              { label: 'Leadership', score: scores.leadership, icon: Award },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className={cn(
                  "h-16 w-16 rounded-full mx-auto mb-3 flex items-center justify-center",
                  getScoreBgColor(item.score)
                )}>
                  <span className={cn("text-xl font-bold", getScoreColor(item.score))}>
                    {item.score}
                  </span>
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="moments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="moments">Key Moments</TabsTrigger>
          <TabsTrigger value="questions">Q&A Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="moments">
          <Card>
            <CardHeader>
              <CardTitle>Key Interview Moments</CardTitle>
              <CardDescription>Notable highlights from the interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyMoments.map((moment, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border",
                      moment.type === 'strength' && "bg-green-50 border-green-200",
                      moment.type === 'neutral' && "bg-blue-50 border-blue-200",
                      moment.type === 'concern' && "bg-amber-50 border-amber-200"
                    )}
                  >
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                      moment.type === 'strength' && "bg-green-100",
                      moment.type === 'neutral' && "bg-blue-100",
                      moment.type === 'concern' && "bg-amber-100"
                    )}>
                      {moment.type === 'strength' && <ThumbsUp className="h-4 w-4 text-green-600" />}
                      {moment.type === 'neutral' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                      {moment.type === 'concern' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {moment.time}
                        </Badge>
                        <h4 className="font-medium">{moment.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{moment.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Question & Answer Analysis</CardTitle>
              <CardDescription>Detailed breakdown of interview responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {interviewQuestions.map((qa, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Q{index + 1}</Badge>
                      <h4 className="font-medium">{qa.question}</h4>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      getScoreBgColor(qa.score),
                      getScoreColor(qa.score)
                    )}>
                      {qa.score}/100
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground italic">"{qa.answer}"</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
              <CardDescription>Emotional tone throughout the interview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl">
                  <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-green-600">{sentimentAnalysis.positive}%</p>
                  <p className="text-sm text-green-700">Positive</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-blue-600">{sentimentAnalysis.neutral}%</p>
                  <p className="text-sm text-blue-700">Neutral</p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-xl">
                  <ThumbsDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-red-600">{sentimentAnalysis.negative}%</p>
                  <p className="text-sm text-red-700">Negative</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <UserCheck className="h-4 w-4 mr-2" />
              Add to Shortlist
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Human Interview
            </Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <UserX className="h-4 w-4 mr-2" />
              Reject Candidate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInterviewResults;

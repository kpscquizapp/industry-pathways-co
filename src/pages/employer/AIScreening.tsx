import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bot,
  FileText,
  Video,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Download,
  Sparkles,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Play
} from 'lucide-react';

const AIScreening = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const candidates = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Senior Frontend Developer',
      aiScore: 92,
      status: 'recommended',
      resumeMatch: 95,
      skillMatch: 88,
      experienceMatch: 90,
      avatar: '',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      experience: '6 years',
      currentCompany: 'TCS',
      insights: [
        { type: 'strength', text: 'Strong React experience with 4+ years' },
        { type: 'strength', text: 'Led team of 5 developers' },
        { type: 'warning', text: 'Limited cloud infrastructure experience' },
      ]
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      role: 'Senior Frontend Developer',
      aiScore: 78,
      status: 'review',
      resumeMatch: 80,
      skillMatch: 75,
      experienceMatch: 82,
      avatar: '',
      skills: ['React', 'JavaScript', 'CSS', 'Redux'],
      experience: '5 years',
      currentCompany: 'Infosys',
      insights: [
        { type: 'strength', text: 'Good problem-solving skills' },
        { type: 'warning', text: 'TypeScript experience is limited' },
        { type: 'warning', text: 'No leadership experience' },
      ]
    },
    {
      id: 3,
      name: 'Amit Patel',
      role: 'Senior Frontend Developer',
      aiScore: 45,
      status: 'rejected',
      resumeMatch: 50,
      skillMatch: 40,
      experienceMatch: 45,
      avatar: '',
      skills: ['Angular', 'Java', 'Spring Boot'],
      experience: '4 years',
      currentCompany: 'Wipro',
      insights: [
        { type: 'warning', text: 'Skill set does not match requirements' },
        { type: 'warning', text: 'No React experience' },
        { type: 'weakness', text: 'Experience level below requirements' },
      ]
    },
  ];

  const stats = [
    { label: 'Total Screened', value: '156', icon: FileText, color: 'bg-blue-500' },
    { label: 'Recommended', value: '45', icon: ThumbsUp, color: 'bg-green-500' },
    { label: 'Under Review', value: '32', icon: Eye, color: 'bg-yellow-500' },
    { label: 'Rejected', value: '79', icon: ThumbsDown, color: 'bg-red-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return 'bg-green-100 text-green-700 border-green-200';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Bot className="h-7 w-7 text-teal-500" />
            AI Screening
          </h1>
          <p className="text-neutral-600">AI-powered candidate screening and assessment</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Sparkles className="h-4 w-4 mr-2" />
          Screen New Batch
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resume" className="space-y-4">
        <TabsList className="bg-neutral-100 p-1">
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume Screening
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Screening
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Assessment Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Candidates List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-semibold text-navy-800">Candidates</h3>
              {candidates.map((candidate) => (
                <Card 
                  key={candidate.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCandidate === candidate.id ? 'ring-2 ring-teal-500' : ''
                  }`}
                  onClick={() => setSelectedCandidate(candidate.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-navy-800 text-white">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy-800 truncate">{candidate.name}</p>
                        <p className="text-xs text-neutral-500">{candidate.currentCompany}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xl font-bold ${getScoreColor(candidate.aiScore)}`}>
                          {candidate.aiScore}
                        </span>
                        <Badge className={`ml-2 ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Candidate Details */}
            <div className="lg:col-span-2">
              {selectedCandidate ? (
                <Card>
                  <CardContent className="p-6">
                    {(() => {
                      const candidate = candidates.find(c => c.id === selectedCandidate);
                      if (!candidate) return null;

                      return (
                        <div className="space-y-6">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-navy-800 text-white text-xl">
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h2 className="text-xl font-bold text-navy-900">{candidate.name}</h2>
                                <p className="text-neutral-600">{candidate.role}</p>
                                <p className="text-sm text-neutral-500">{candidate.experience} • {candidate.currentCompany}</p>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">{candidate.aiScore}</span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-1">AI Score</p>
                            </div>
                          </div>

                          {/* Score Breakdown */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="p-3 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-neutral-500 mb-1">Resume Match</p>
                              <Progress value={candidate.resumeMatch} className="h-2" />
                              <p className="text-sm font-semibold text-right mt-1">{candidate.resumeMatch}%</p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-neutral-500 mb-1">Skill Match</p>
                              <Progress value={candidate.skillMatch} className="h-2" />
                              <p className="text-sm font-semibold text-right mt-1">{candidate.skillMatch}%</p>
                            </div>
                            <div className="p-3 bg-neutral-50 rounded-lg">
                              <p className="text-xs text-neutral-500 mb-1">Experience Match</p>
                              <Progress value={candidate.experienceMatch} className="h-2" />
                              <p className="text-sm font-semibold text-right mt-1">{candidate.experienceMatch}%</p>
                            </div>
                          </div>

                          {/* Skills */}
                          <div>
                            <h4 className="font-medium text-navy-800 mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.map((skill) => (
                                <Badge key={skill} className="bg-teal-100 text-teal-700">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* AI Insights */}
                          <div>
                            <h4 className="font-medium text-navy-800 mb-3 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-teal-500" />
                              AI Insights
                            </h4>
                            <div className="space-y-2">
                              {candidate.insights.map((insight, index) => (
                                <div 
                                  key={index}
                                  className={`flex items-start gap-2 p-3 rounded-lg ${
                                    insight.type === 'strength' ? 'bg-green-50' :
                                    insight.type === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
                                  }`}
                                >
                                  {insight.type === 'strength' ? (
                                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                  ) : insight.type === 'warning' ? (
                                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                  )}
                                  <span className="text-sm">{insight.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Shortlist
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              View Resume
                            </Button>
                            <Button variant="outline" className="flex-1 text-red-600 hover:bg-red-50">
                              <ThumbsDown className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center p-12">
                    <Bot className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">Select a candidate to view AI screening details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Video Screening</h3>
              <p className="text-neutral-600 mb-4">AI-powered video interview analysis coming soon</p>
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                View Demo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardContent className="p-12 text-center">
              <ClipboardCheck className="h-16 w-16 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-navy-800 mb-2">Assessment Results</h3>
              <p className="text-neutral-600 mb-4">View and analyze skill assessment results</p>
              <Button variant="outline">
                View Assessments
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIScreening;

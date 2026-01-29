import React, { useState } from 'react';
import { 
  Calendar, 
  Video,
  Play,
  Users,
  CalendarClock,
  ChevronRight,
  Search,
  CheckCircle2,
  Star,
  MessageSquare,
  BarChart3,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Candidate {
  id: number;
  name: string;
  role: string;
  matchScore: number;
  testScore: number;
  status: 'ready' | 'scheduled' | 'completed';
  interviewDate?: string;
  scores?: {
    communication: number;
    technical: number;
    problemSolving: number;
    overall: number;
  };
  recommendation?: 'strongly_recommend' | 'recommend' | 'not_recommend';
  duration?: string;
}

const candidatesData: Candidate[] = [
  { id: 1, name: 'Amit Sharma', role: 'Senior React Native Developer', matchScore: 98, testScore: 92, status: 'ready' },
  { id: 2, name: 'Sarah Chen', role: 'Senior React Developer', matchScore: 94, testScore: 88, status: 'scheduled', interviewDate: '2025-02-01 10:00 AM' },
  { id: 3, name: 'Maria Silva', role: 'React Native Specialist', matchScore: 89, testScore: 92, status: 'completed', 
    scores: { communication: 90, technical: 95, problemSolving: 88, overall: 91 }, 
    recommendation: 'strongly_recommend', duration: '32 min' },
  { id: 4, name: 'James Wilson', role: 'Frontend Architect', matchScore: 87, testScore: 85, status: 'completed',
    scores: { communication: 85, technical: 78, problemSolving: 82, overall: 82 },
    recommendation: 'recommend', duration: '28 min' },
  { id: 5, name: 'Alex Kumar', role: 'Full Stack Engineer', matchScore: 91, testScore: 78, status: 'ready' },
];

const getRecommendationBadge = (recommendation?: string) => {
  switch (recommendation) {
    case 'strongly_recommend':
      return <Badge className="bg-primary text-primary-foreground">Strongly Recommend</Badge>;
    case 'recommend':
      return <Badge className="bg-blue-500 text-white">Recommend</Badge>;
    case 'not_recommend':
      return <Badge variant="destructive">Not Recommended</Badge>;
    default:
      return null;
  }
};

const EmployerAIInterviews = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(candidatesData);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isReschedule, setIsReschedule] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    duration: '30',
    interviewType: 'technical'
  });

  const readyCandidates = candidates.filter(c => c.status === 'ready');
  const scheduledCandidates = candidates.filter(c => c.status === 'scheduled');
  const completedCandidates = candidates.filter(c => c.status === 'completed');

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsReschedule(candidate.status === 'scheduled');
    setShowScheduleModal(true);
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidate) return;
    
    const updatedCandidates = candidates.map(c => 
      c.id === selectedCandidate.id 
        ? { ...c, status: 'scheduled' as const, interviewDate: `${scheduleData.date} ${scheduleData.time}` }
        : c
    );
    setCandidates(updatedCandidates);
    setShowScheduleModal(false);
    setSelectedCandidate(null);
    toast.success(isReschedule ? 'Interview rescheduled successfully!' : 'AI Interview scheduled successfully!');
  };

  const filteredCandidates = (list: Candidate[]) => 
    list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header Section - Dark Navy */}
      <div className="bg-[hsl(222,47%,11%)] rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Interviews</h1>
            <p className="text-white/70">Schedule and review AI-powered interviews</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{readyCandidates.length}</p>
              <p className="text-xs text-white/60">Ready</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{scheduledCandidates.length}</p>
              <p className="text-xs text-white/60">Scheduled</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{completedCandidates.length}</p>
              <p className="text-xs text-white/60">Completed</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input 
            placeholder="Search candidates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
          />
        </div>
      </div>

      {/* Step 1: Choose Candidate */}
      <Card className="border-2 border-[hsl(222,47%,11%)]/10">
        <CardHeader className="bg-[hsl(222,47%,11%)] text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">1</div>
            <CardTitle className="text-lg">Choose Candidate (Passed Skill Test)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredCandidates(readyCandidates).length > 0 ? (
            <div className="grid gap-3">
              {filteredCandidates(readyCandidates).map((candidate) => (
                <div 
                  key={candidate.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-[hsl(222,47%,11%)]/30 hover:bg-muted/50 transition-all cursor-pointer group"
                  onClick={() => handleSelectCandidate(candidate)}
                >
                  <Avatar className="h-12 w-12 bg-[hsl(222,47%,11%)]/10">
                    <AvatarFallback className="font-semibold text-[hsl(222,47%,11%)]">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-lg font-bold text-[hsl(222,47%,11%)]">{candidate.matchScore}%</p>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-lg font-bold text-primary">{candidate.testScore}%</p>
                    <p className="text-xs text-muted-foreground">Test Score</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Test Passed</Badge>
                  <Button 
                    className="bg-[hsl(222,47%,11%)] hover:bg-[hsl(222,47%,18%)] text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Initiate Interview
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No candidates ready for interview</p>
              <p className="text-sm">Candidates must pass skill tests first</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Interviews */}
      {scheduledCandidates.length > 0 && (
        <Card className="border-2 border-amber-500/20">
          <CardHeader className="bg-amber-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5" />
              <CardTitle className="text-lg">Scheduled Interviews</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-3">
              {filteredCandidates(scheduledCandidates).map((candidate) => (
                <div 
                  key={candidate.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50/50"
                >
                  <Avatar className="h-12 w-12 bg-amber-100">
                    <AvatarFallback className="font-semibold text-amber-700">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                  </div>
                  <div className="flex items-center gap-2 text-amber-700">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{candidate.interviewDate}</span>
                  </div>
                  <Badge className="bg-amber-500">Upcoming</Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg border-amber-500 text-amber-700 hover:bg-amber-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCandidate(candidate);
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      className="rounded-lg bg-[hsl(222,47%,11%)] hover:bg-[hsl(222,47%,18%)] text-white"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Interviews */}
      {completedCandidates.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <CardTitle className="text-lg">Completed Interviews</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              {filteredCandidates(completedCandidates).map((candidate) => (
                <div 
                  key={candidate.id}
                  className="p-4 rounded-xl border border-primary/20 bg-primary/5"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12 bg-primary/10">
                      <AvatarFallback className="font-semibold text-primary">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{candidate.name}</h3>
                        {getRecommendationBadge(candidate.recommendation)}
                      </div>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{candidate.duration}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="transparent"
                            className="text-muted/30"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="transparent"
                            strokeDasharray={`${((candidate.scores?.overall || 0) / 100) * 163} 163`}
                            className="text-primary"
                          />
                        </svg>
                        <span className="absolute text-sm font-bold text-primary">
                          {candidate.scores?.overall}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Overall</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-lg text-primary border-primary hover:bg-primary/10"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Watch Replay
                    </Button>
                  </div>

                  {/* Score Breakdown */}
                  {candidate.scores && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Communication</span>
                            <span className="font-medium">{candidate.scores.communication}</span>
                          </div>
                          <Progress value={candidate.scores.communication} className="h-1.5" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Technical</span>
                            <span className="font-medium">{candidate.scores.technical}</span>
                          </div>
                          <Progress value={candidate.scores.technical} className="h-1.5" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Problem Solving</span>
                            <span className="font-medium">{candidate.scores.problemSolving}</span>
                          </div>
                          <Progress value={candidate.scores.problemSolving} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(222,47%,11%)] flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              {isReschedule ? 'Reschedule AI Interview' : 'Schedule AI Interview'}
            </DialogTitle>
          </DialogHeader>

          {selectedCandidate && (
            <div className="space-y-6">
              {/* Selected Candidate */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(222,47%,11%)]/5 border border-[hsl(222,47%,11%)]/10">
                <Avatar className="h-12 w-12 bg-[hsl(222,47%,11%)]/10">
                  <AvatarFallback className="font-semibold text-[hsl(222,47%,11%)]">
                    {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedCandidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCandidate.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{selectedCandidate.testScore}%</p>
                  <p className="text-xs text-muted-foreground">Test Score</p>
                </div>
              </div>

              {/* Schedule Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Date</Label>
                    <Input 
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Time</Label>
                    <Input 
                      type="time"
                      value={scheduleData.time}
                      onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Interview Duration</Label>
                  <Select value={scheduleData.duration} onValueChange={(v) => setScheduleData({...scheduleData, duration: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Interview Focus</Label>
                  <Select value={scheduleData.interviewType} onValueChange={(v) => setScheduleData({...scheduleData, interviewType: v})}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Deep Dive</SelectItem>
                      <SelectItem value="behavioral">Behavioral Assessment</SelectItem>
                      <SelectItem value="system">System Design</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 rounded-xl bg-[hsl(222,47%,11%)] hover:bg-[hsl(222,47%,18%)] text-white"
                  onClick={handleScheduleInterview}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isReschedule ? 'Reschedule' : 'Initiate Interview'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerAIInterviews;

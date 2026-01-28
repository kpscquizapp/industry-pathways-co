import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Video,
  Search,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  MessageSquare,
  Code,
  Users,
  Play,
  Eye,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AIInterviews = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [newInterview, setNewInterview] = useState({
    candidate: '',
    job: '',
    interviewType: 'technical',
    date: '',
    time: ''
  });

  const interviews = [
    {
      id: 1,
      candidate: 'Sarah Johnson',
      job: 'Senior React Developer',
      interviewType: 'Technical',
      interviewIcon: Code,
      date: '2024-01-22',
      time: '3:00 PM',
      duration: '45 mins',
      status: 'Scheduled',
      scores: null
    },
    {
      id: 2,
      candidate: 'Michael Chen',
      job: 'Full Stack Engineer',
      interviewType: 'Behavioral',
      interviewIcon: MessageSquare,
      date: '2024-01-23',
      time: '11:00 AM',
      duration: '30 mins',
      status: 'Scheduled',
      scores: null
    },
    {
      id: 3,
      candidate: 'Emily Rodriguez',
      job: 'UX Designer',
      interviewType: 'Mixed',
      interviewIcon: Brain,
      date: '2024-01-20',
      time: '2:00 PM',
      duration: '60 mins',
      status: 'Completed',
      scores: {
        technical: 88,
        communication: 92,
        problemSolving: 85,
        culturalFit: 90,
        overall: 89
      },
      recommendation: 'Strong Hire'
    },
    {
      id: 4,
      candidate: 'David Kim',
      job: 'DevOps Engineer',
      interviewType: 'Technical',
      interviewIcon: Code,
      date: '2024-01-19',
      time: '10:00 AM',
      duration: '45 mins',
      status: 'Completed',
      scores: {
        technical: 75,
        communication: 80,
        problemSolving: 72,
        culturalFit: 85,
        overall: 78
      },
      recommendation: 'Consider'
    },
    {
      id: 5,
      candidate: 'Lisa Wang',
      job: 'Data Scientist',
      interviewType: 'Mixed',
      interviewIcon: Brain,
      date: '2024-01-18',
      time: '4:00 PM',
      duration: '60 mins',
      status: 'Completed',
      scores: {
        technical: 95,
        communication: 88,
        problemSolving: 92,
        culturalFit: 85,
        overall: 90
      },
      recommendation: 'Strong Hire'
    },
    {
      id: 6,
      candidate: 'Alex Turner',
      job: 'Product Manager',
      interviewType: 'Behavioral',
      interviewIcon: MessageSquare,
      date: '2024-01-17',
      time: '1:00 PM',
      duration: '30 mins',
      status: 'Completed',
      scores: {
        technical: 65,
        communication: 70,
        problemSolving: 68,
        culturalFit: 72,
        overall: 69
      },
      recommendation: 'No Hire'
    }
  ];

  const candidates = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Wang'];
  const jobs = ['Senior React Developer', 'Full Stack Engineer', 'UX Designer', 'DevOps Engineer', 'Data Scientist'];

  const stats = [
    { label: 'Scheduled', value: 2, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { label: 'Completed', value: 18, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
    { label: 'Avg Score', value: '82%', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { label: 'Hire Rate', value: '45%', icon: ThumbsUp, color: 'from-purple-500 to-pink-500' },
  ];

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          interview.job.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || interview.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || interview.interviewType.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Hire': return 'bg-green-100 text-green-700';
      case 'Consider': return 'bg-yellow-100 text-yellow-700';
      case 'No Hire': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleScheduleInterview = () => {
    toast.success('AI interview scheduled successfully!');
    setIsScheduleDialogOpen(false);
    setNewInterview({ candidate: '', job: '', interviewType: 'technical', date: '', time: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Video className="h-7 w-7 text-orange-500" />
            AI Interviews
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and review AI-powered candidate interviews
          </p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule AI Interview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Candidate</Label>
                <Select value={newInterview.candidate} onValueChange={(v) => setNewInterview({...newInterview, candidate: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Position</Label>
                <Select value={newInterview.job} onValueChange={(v) => setNewInterview({...newInterview, job: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map(j => (
                      <SelectItem key={j} value={j}>{j}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select value={newInterview.interviewType} onValueChange={(v) => setNewInterview({...newInterview, interviewType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Technical (45 mins)
                      </div>
                    </SelectItem>
                    <SelectItem value="behavioral">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Behavioral (30 mins)
                      </div>
                    </SelectItem>
                    <SelectItem value="mixed">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Mixed (60 mins)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({...newInterview, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({...newInterview, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleScheduleInterview}
                  className="bg-gradient-to-r from-orange-500 to-amber-500"
                >
                  Schedule Interview
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-xl bg-gradient-to-br", stat.color)}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by candidate or job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="behavioral">Behavioral</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Candidate</TableHead>
                <TableHead className="font-semibold">Job Position</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Schedule</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Overall Score</TableHead>
                <TableHead className="font-semibold">Recommendation</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterviews.map((interview) => {
                const InterviewIcon = interview.interviewIcon;
                return (
                  <TableRow key={interview.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{interview.candidate}</TableCell>
                    <TableCell className="text-muted-foreground">{interview.job}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <InterviewIcon className="h-4 w-4 text-muted-foreground" />
                        {interview.interviewType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(interview.date).toLocaleDateString()}
                        <Clock className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                        {interview.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(interview.status)}>{interview.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {interview.scores ? (
                        <span className={cn(
                          "font-bold",
                          interview.scores.overall >= 80 ? "text-green-600" : 
                          interview.scores.overall >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {interview.scores.overall}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {interview.recommendation ? (
                        <Badge className={getRecommendationBadge(interview.recommendation)}>
                          {interview.recommendation}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {interview.status === 'Completed' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedInterview(interview)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Results
                        </Button>
                      ) : interview.status === 'Scheduled' ? (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interview Results Dialog */}
      <Dialog open={!!selectedInterview} onOpenChange={() => setSelectedInterview(null)}>
        <DialogContent className="max-w-2xl">
          {selectedInterview && selectedInterview.scores && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Video className="h-6 w-6 text-orange-500" />
                  AI Interview Results
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                  <div>
                    <h3 className="font-semibold">{selectedInterview.candidate}</h3>
                    <p className="text-sm text-muted-foreground">{selectedInterview.job}</p>
                  </div>
                  <Badge className={cn("text-lg px-4 py-1", getRecommendationBadge(selectedInterview.recommendation))}>
                    {selectedInterview.recommendation}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Score Breakdown</h4>
                  <div className="space-y-4">
                    {Object.entries(selectedInterview.scores).filter(([key]) => key !== 'overall').map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4">
                        <span className="w-36 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <Progress value={value as number} className="flex-1 h-3" />
                        <span className={cn(
                          "text-sm font-semibold w-12",
                          (value as number) >= 80 ? "text-green-600" : 
                          (value as number) >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                        {String(value)}%
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <span className="w-36 text-sm font-semibold">Overall Score</span>
                      <Progress value={selectedInterview.scores.overall} className="flex-1 h-4" />
                      <span className={cn(
                        "text-lg font-bold w-12",
                        selectedInterview.scores.overall >= 80 ? "text-green-600" : 
                        selectedInterview.scores.overall >= 60 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {selectedInterview.scores.overall}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedInterview(null)}>
                    Close
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Move to Next Round
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIInterviews;

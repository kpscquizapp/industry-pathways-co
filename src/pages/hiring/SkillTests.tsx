import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
  ClipboardCheck,
  Search,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Code,
  FileQuestion,
  Layers,
  Play,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SkillTests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    candidate: '',
    job: '',
    testType: 'coding',
    date: '',
    time: ''
  });

  const scheduledTests = [
    {
      id: 1,
      candidate: 'John Smith',
      job: 'Senior React Developer',
      testType: 'Coding Test',
      testIcon: Code,
      date: '2024-01-22',
      time: '2:00 PM',
      duration: '90 mins',
      status: 'Scheduled',
      score: null
    },
    {
      id: 2,
      candidate: 'Lisa Wang',
      job: 'Product Manager',
      testType: 'MCQ Assessment',
      testIcon: FileQuestion,
      date: '2024-01-22',
      time: '4:30 PM',
      duration: '45 mins',
      status: 'Scheduled',
      score: null
    },
    {
      id: 3,
      candidate: 'Alex Turner',
      job: 'DevOps Engineer',
      testType: 'System Design',
      testIcon: Layers,
      date: '2024-01-23',
      time: '10:00 AM',
      duration: '60 mins',
      status: 'Scheduled',
      score: null
    },
    {
      id: 4,
      candidate: 'Sarah Johnson',
      job: 'Senior React Developer',
      testType: 'Coding Test',
      testIcon: Code,
      date: '2024-01-20',
      time: '11:00 AM',
      duration: '90 mins',
      status: 'Completed',
      score: 92
    },
    {
      id: 5,
      candidate: 'Michael Chen',
      job: 'Full Stack Engineer',
      testType: 'Coding Test',
      testIcon: Code,
      date: '2024-01-19',
      time: '3:00 PM',
      duration: '90 mins',
      status: 'Completed',
      score: 88
    },
    {
      id: 6,
      candidate: 'Emily Rodriguez',
      job: 'UX Designer',
      testType: 'MCQ Assessment',
      testIcon: FileQuestion,
      date: '2024-01-18',
      time: '2:00 PM',
      duration: '45 mins',
      status: 'Completed',
      score: 95
    },
    {
      id: 7,
      candidate: 'David Park',
      job: 'Backend Developer',
      testType: 'System Design',
      testIcon: Layers,
      date: '2024-01-17',
      time: '10:00 AM',
      duration: '60 mins',
      status: 'Expired',
      score: null
    }
  ];

  const candidates = ['John Smith', 'Lisa Wang', 'Alex Turner', 'Sarah Johnson', 'Michael Chen'];
  const jobs = ['Senior React Developer', 'Product Manager', 'DevOps Engineer', 'UX Designer'];

  const stats = [
    { label: 'Scheduled', value: 3, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
    { label: 'Completed', value: 15, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
    { label: 'Avg Score', value: '82%', icon: ClipboardCheck, color: 'from-purple-500 to-pink-500' },
    { label: 'Pass Rate', value: '76%', icon: Play, color: 'from-orange-500 to-amber-500' },
  ];

  const filteredTests = scheduledTests.filter(test => {
    const matchesSearch = test.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.job.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleScheduleTest = () => {
    toast.success('Skill test scheduled successfully!');
    setIsScheduleDialogOpen(false);
    setNewTest({ candidate: '', job: '', testType: 'coding', date: '', time: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <ClipboardCheck className="h-7 w-7 text-green-500" />
            Skill Tests
          </h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage automated skill assessments for candidates
          </p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule New Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Skill Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Candidate</Label>
                <Select value={newTest.candidate} onValueChange={(v) => setNewTest({...newTest, candidate: v})}>
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
                <Select value={newTest.job} onValueChange={(v) => setNewTest({...newTest, job: v})}>
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
                <Label>Test Type</Label>
                <Select value={newTest.testType} onValueChange={(v) => setNewTest({...newTest, testType: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coding">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Coding Test (90 mins)
                      </div>
                    </SelectItem>
                    <SelectItem value="mcq">
                      <div className="flex items-center gap-2">
                        <FileQuestion className="h-4 w-4" />
                        MCQ Assessment (45 mins)
                      </div>
                    </SelectItem>
                    <SelectItem value="system-design">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        System Design (60 mins)
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
                    value={newTest.date}
                    onChange={(e) => setNewTest({...newTest, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    type="time"
                    value={newTest.time}
                    onChange={(e) => setNewTest({...newTest, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleScheduleTest}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  Schedule Test
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
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tests Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Candidate</TableHead>
                <TableHead className="font-semibold">Job Position</TableHead>
                <TableHead className="font-semibold">Test Type</TableHead>
                <TableHead className="font-semibold">Schedule</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-center">Score</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.map((test) => {
                const TestIcon = test.testIcon;
                return (
                  <TableRow key={test.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{test.candidate}</TableCell>
                    <TableCell className="text-muted-foreground">{test.job}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TestIcon className="h-4 w-4 text-muted-foreground" />
                        {test.testType}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(test.date).toLocaleDateString()}
                        <Clock className="h-3.5 w-3.5 text-muted-foreground ml-2" />
                        {test.time}
                      </div>
                    </TableCell>
                    <TableCell>{test.duration}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(test.status)}>{test.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {test.score !== null ? (
                        <span className={cn(
                          "font-bold",
                          test.score >= 80 ? "text-green-600" : test.score >= 60 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {test.score}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {test.status === 'Completed' ? (
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Results
                        </Button>
                      ) : test.status === 'Scheduled' ? (
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
    </div>
  );
};

export default SkillTests;

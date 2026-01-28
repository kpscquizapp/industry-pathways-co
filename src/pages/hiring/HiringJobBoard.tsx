import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase,
  Users,
  Brain,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Pause,
  XCircle,
  ArrowUpDown,
  Filter,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const HiringJobBoard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    description: '',
    skills: ''
  });

  const jobs = [
    { 
      id: 1, 
      title: 'Senior React Developer', 
      department: 'Engineering', 
      location: 'Remote', 
      type: 'Full-time',
      applicants: 45, 
      aiMatched: 12,
      skillTestsScheduled: 8,
      interviewsCompleted: 3,
      status: 'Active', 
      posted: '2024-01-15' 
    },
    { 
      id: 2, 
      title: 'Product Manager', 
      department: 'Product', 
      location: 'New York', 
      type: 'Full-time',
      applicants: 38, 
      aiMatched: 8,
      skillTestsScheduled: 5,
      interviewsCompleted: 2,
      status: 'Active', 
      posted: '2024-01-12' 
    },
    { 
      id: 3, 
      title: 'DevOps Engineer', 
      department: 'Infrastructure', 
      location: 'San Francisco', 
      type: 'Contract',
      applicants: 22, 
      aiMatched: 6,
      skillTestsScheduled: 4,
      interviewsCompleted: 1,
      status: 'Active', 
      posted: '2024-01-10' 
    },
    { 
      id: 4, 
      title: 'UX Designer', 
      department: 'Design', 
      location: 'Remote', 
      type: 'Full-time',
      applicants: 56, 
      aiMatched: 15,
      skillTestsScheduled: 6,
      interviewsCompleted: 4,
      status: 'Active', 
      posted: '2024-01-08' 
    },
    { 
      id: 5, 
      title: 'Data Scientist', 
      department: 'Analytics', 
      location: 'Boston', 
      type: 'Full-time',
      applicants: 33, 
      aiMatched: 9,
      skillTestsScheduled: 3,
      interviewsCompleted: 0,
      status: 'Paused', 
      posted: '2024-01-05' 
    },
  ];

  const stats = [
    { label: 'Active Jobs', value: 12, icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Applicants', value: 194, icon: Users, color: 'from-green-500 to-emerald-500' },
    { label: 'AI Matched', value: 50, icon: Brain, color: 'from-purple-500 to-pink-500' },
    { label: 'Interviews Done', value: 10, icon: Video, color: 'from-orange-500 to-amber-500' },
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateJob = () => {
    toast.success('Job posted successfully!');
    setIsCreateDialogOpen(false);
    setNewJob({ title: '', department: '', location: '', type: 'full-time', description: '', skills: '' });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-100 text-green-700 border-green-200',
      Paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Closed: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status as keyof typeof styles] || styles.Paused;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Job Board
          </h1>
          <p className="text-muted-foreground">Manage your job postings and track candidates</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Job Posting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input 
                    placeholder="e.g., Senior React Developer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    placeholder="e.g., Engineering"
                    value={newJob.department}
                    onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="e.g., Remote, New York"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employment Type</Label>
                  <Select value={newJob.type} onValueChange={(v) => setNewJob({...newJob, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Required Skills (comma separated)</Label>
                <Input 
                  placeholder="e.g., React, TypeScript, Node.js"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea 
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={5}
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleCreateJob}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  Post Job
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
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Job Title</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold text-center">Applicants</TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Brain className="h-4 w-4 text-purple-500" />
                    AI Matched
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <ClipboardCheck className="h-4 w-4 text-green-500" />
                    Tests
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Video className="h-4 w-4 text-orange-500" />
                    Interviews
                  </div>
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <button className="font-medium text-indigo-600 hover:underline text-left">
                        {job.title}
                      </button>
                      <p className="text-xs text-muted-foreground">{job.department} • {job.type}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{job.location}</TableCell>
                  <TableCell className="text-center font-semibold">{job.applicants}</TableCell>
                  <TableCell className="text-center">
                    <button 
                      className="font-semibold text-purple-600 hover:underline"
                      onClick={() => navigate('/hiring-dashboard/ai-candidates')}
                    >
                      {job.aiMatched}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <button 
                      className="font-semibold text-green-600 hover:underline"
                      onClick={() => navigate('/hiring-dashboard/skill-tests')}
                    >
                      {job.skillTestsScheduled}
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <button 
                      className="font-semibold text-orange-600 hover:underline"
                      onClick={() => navigate('/hiring-dashboard/interviews')}
                    >
                      {job.interviewsCompleted}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(job.status)}>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => navigate('/hiring-dashboard/ai-candidates')}>
                          <Brain className="h-4 w-4 mr-2 text-purple-500" />
                          View AI Matches
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/hiring-dashboard/skill-tests')}>
                          <ClipboardCheck className="h-4 w-4 mr-2 text-green-500" />
                          Schedule Skill Test
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/hiring-dashboard/interviews')}>
                          <Video className="h-4 w-4 mr-2 text-orange-500" />
                          Schedule Interview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Job
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Close Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HiringJobBoard;

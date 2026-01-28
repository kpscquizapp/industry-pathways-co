import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Briefcase,
  MapPin,
  Users,
  Clock,
  Eye,
  Bot,
  Share2,
  MoreVertical,
  Search,
  Plus,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HireFullTime = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Bangalore',
      type: 'Full-time',
      applicants: 45,
      newApplicants: 12,
      aiScreened: 38,
      recommended: 8,
      status: 'Active',
      postedDate: '5 days ago',
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'Mumbai',
      type: 'Full-time',
      applicants: 32,
      newApplicants: 5,
      aiScreened: 28,
      recommended: 5,
      status: 'Active',
      postedDate: '1 week ago',
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      applicants: 28,
      newApplicants: 3,
      aiScreened: 20,
      recommended: 4,
      status: 'Active',
      postedDate: '2 weeks ago',
    },
    {
      id: 4,
      title: 'UX Designer',
      department: 'Design',
      location: 'Pune',
      type: 'Full-time',
      applicants: 18,
      newApplicants: 0,
      aiScreened: 15,
      recommended: 3,
      status: 'Paused',
      postedDate: '3 weeks ago',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Hire Full-Time</h1>
          <p className="text-neutral-600">Manage your full-time job postings and candidates</p>
        </div>
        <Link to="/employer/post-job">
          <Button className="bg-navy-800 hover:bg-navy-900">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
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

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-navy-900">{job.title}</h3>
                    <Badge 
                      className={job.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {job.status}
                    </Badge>
                    {job.recommended > 0 && (
                      <Badge className="bg-teal-100 text-teal-700 border border-teal-200">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {job.recommended} AI Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {job.postedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <Users className="h-5 w-5 text-neutral-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-navy-900">{job.applicants}</p>
                  <p className="text-xs text-neutral-500">Total Applicants</p>
                  {job.newApplicants > 0 && (
                    <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">
                      +{job.newApplicants} new
                    </Badge>
                  )}
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <Bot className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-navy-900">{job.aiScreened}</p>
                  <p className="text-xs text-neutral-500">AI Screened</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-navy-900">{job.recommended}</p>
                  <p className="text-xs text-neutral-500">Recommended</p>
                </div>
                <div className="flex flex-col gap-2 justify-center">
                  <Link to="/employer/ai-screening">
                    <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                      <Eye className="h-4 w-4 mr-1" />
                      View Candidates
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HireFullTime;

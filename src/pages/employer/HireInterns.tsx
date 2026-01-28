import React from 'react';
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
  GraduationCap,
  MapPin,
  Clock,
  Calendar,
  Users,
  Search,
  Plus,
  Eye,
  Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HireInterns = () => {
  const internships = [
    {
      id: 1,
      title: 'Frontend Development Intern',
      department: 'Engineering',
      location: 'Bangalore',
      duration: '6 months',
      stipend: '₹25,000/month',
      applicants: 89,
      status: 'Active',
      startDate: 'Jan 2024',
      skills: ['React', 'JavaScript', 'HTML/CSS'],
    },
    {
      id: 2,
      title: 'Data Science Intern',
      department: 'Analytics',
      location: 'Remote',
      duration: '3 months',
      stipend: '₹20,000/month',
      applicants: 156,
      status: 'Active',
      startDate: 'Feb 2024',
      skills: ['Python', 'ML', 'SQL'],
    },
    {
      id: 3,
      title: 'Product Design Intern',
      department: 'Design',
      location: 'Mumbai',
      duration: '4 months',
      stipend: '₹18,000/month',
      applicants: 45,
      status: 'Closing Soon',
      startDate: 'Jan 2024',
      skills: ['Figma', 'UI/UX', 'Prototyping'],
    },
  ];

  const availabilityData = [
    { month: 'Jan', available: 45 },
    { month: 'Feb', available: 62 },
    { month: 'Mar', available: 78 },
    { month: 'Apr', available: 55 },
    { month: 'May', available: 90 },
    { month: 'Jun', available: 120 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-purple-600" />
            Hire Interns
          </h1>
          <p className="text-neutral-600">Find and hire talented interns for your team</p>
        </div>
        <Link to="/employer/post-job">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Post Internship
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
                <Input placeholder="Search internships..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="3">3 months</SelectItem>
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Start Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan">January 2024</SelectItem>
                <SelectItem value="feb">February 2024</SelectItem>
                <SelectItem value="mar">March 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Internships List */}
        <div className="lg:col-span-2 space-y-4">
          {internships.map((internship) => (
            <Card key={internship.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-navy-900">{internship.title}</h3>
                      <Badge 
                        className={internship.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                        }
                      >
                        {internship.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {internship.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {internship.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {internship.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Starts {internship.startDate}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{internship.stipend}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {internship.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-purple-50 text-purple-700">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-neutral-500" />
                    <span className="font-semibold text-navy-900">{internship.applicants}</span>
                    <span className="text-sm text-neutral-500">applications</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Link to="/employer/ai-screening">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View Applicants
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Availability Heatmap */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Availability Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600 mb-4">
                Student availability for upcoming months
              </p>
              <div className="space-y-2">
                {availabilityData.map((data) => (
                  <div key={data.month} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-neutral-600">{data.month}</span>
                    <div className="flex-1 bg-neutral-100 rounded-full h-6 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(data.available, 100)}%` }}
                      >
                        <span className="text-xs text-white font-medium">{data.available}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <GraduationCap className="h-8 w-8 text-purple-600 mb-2" />
              <h4 className="font-semibold text-purple-800 mb-1">Campus Connect</h4>
              <p className="text-sm text-purple-700 mb-3">
                Partner with 100+ colleges for direct intern recruitment
              </p>
              <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HireInterns;

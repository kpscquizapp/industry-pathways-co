import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Globe,
  MapPin,
  Star,
  Clock,
  DollarSign,
  Search,
  Filter,
  Send,
  Bookmark,
  Sparkles,
  TrendingUp,
  Users,
  Briefcase
} from 'lucide-react';

const TalentMarketplace = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const talents = [
    {
      id: 1,
      name: 'Ananya Krishnan',
      title: 'ML Engineer',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS'],
      experience: '5 years',
      location: 'Bangalore',
      rate: '₹4,000/hour',
      availability: 'Immediate',
      matchScore: 94,
      rating: 4.9,
      type: 'Freelancer',
    },
    {
      id: 2,
      name: 'Rohan Mehta',
      title: 'Backend Developer',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka'],
      experience: '6 years',
      location: 'Mumbai',
      rate: '₹3,200/hour',
      availability: '1 week',
      matchScore: 88,
      rating: 4.8,
      type: 'Bench Resource',
    },
    {
      id: 3,
      name: 'Kavitha Sundaram',
      title: 'Product Designer',
      skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'],
      experience: '4 years',
      location: 'Chennai',
      rate: '₹2,500/hour',
      availability: 'Immediate',
      matchScore: 91,
      rating: 4.9,
      type: 'Freelancer',
    },
    {
      id: 4,
      name: 'Aditya Sharma',
      title: 'Cloud Architect',
      skills: ['AWS', 'Azure', 'Terraform', 'Kubernetes'],
      experience: '8 years',
      location: 'Delhi NCR',
      rate: '₹5,500/hour',
      availability: '2 weeks',
      matchScore: 85,
      rating: 4.7,
      type: 'Freelancer',
    },
    {
      id: 5,
      name: 'Meera Patel',
      title: 'Data Scientist',
      skills: ['Python', 'SQL', 'Tableau', 'Machine Learning'],
      experience: '4 years',
      location: 'Pune',
      rate: '₹3,000/hour',
      availability: 'Immediate',
      matchScore: 89,
      rating: 4.8,
      type: 'Bench Resource',
    },
    {
      id: 6,
      name: 'Sanjay Verma',
      title: 'Mobile Developer',
      skills: ['React Native', 'iOS', 'Android', 'Flutter'],
      experience: '5 years',
      location: 'Hyderabad',
      rate: '₹3,500/hour',
      availability: 'Immediate',
      matchScore: 92,
      rating: 4.9,
      type: 'Freelancer',
    },
  ];

  const stats = [
    { label: 'Active Talent', value: '5,200+', icon: Users, color: 'bg-blue-500' },
    { label: 'Avg. Response Time', value: '2 hours', icon: Clock, color: 'bg-green-500' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Active Projects', value: '320', icon: Briefcase, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Globe className="h-7 w-7 text-blue-600" />
            Talent Marketplace
          </h1>
          <p className="text-neutral-600">Access our curated pool of verified professionals</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs text-neutral-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input placeholder="Search by skill, role, or name..." className="pl-10" />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All India</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="1week">Within 1 week</SelectItem>
                <SelectItem value="2weeks">Within 2 weeks</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2000">Under ₹2,000/hr</SelectItem>
                <SelectItem value="2000-4000">₹2,000-4,000/hr</SelectItem>
                <SelectItem value="4000+">₹4,000+/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talents.map((talent) => (
          <Card key={talent.id} className="hover:shadow-lg transition-all group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {talent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-navy-900">{talent.name}</h3>
                    <p className="text-sm text-neutral-600">{talent.title}</p>
                  </div>
                </div>
                <Badge 
                  className={talent.type === 'Freelancer' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                  }
                >
                  {talent.type}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {talent.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  {talent.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {talent.experience}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {talent.skills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {talent.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{talent.skills.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="font-bold text-navy-900">{talent.rate}</p>
                  <p className={`text-xs ${talent.availability === 'Immediate' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {talent.availability === 'Immediate' ? '✓ Available Now' : `Available in ${talent.availability}`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-semibold text-teal-600">{talent.matchScore}%</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="sm" className="flex-1 bg-teal-600 hover:bg-teal-700">
                  <Send className="h-3 w-3 mr-1" />
                  Invite
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Bookmark className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Talent
        </Button>
      </div>
    </div>
  );
};

export default TalentMarketplace;

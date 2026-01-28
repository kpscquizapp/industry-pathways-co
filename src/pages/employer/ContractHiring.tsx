import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Clock,
  MapPin,
  DollarSign,
  Star,
  Zap,
  Filter,
  Search,
  Send,
  Bookmark,
  CheckCircle
} from 'lucide-react';

const ContractHiring = () => {
  const [duration, setDuration] = useState([3]);
  const [budget, setBudget] = useState([50000]);

  const talents = [
    {
      id: 1,
      name: 'Vikram Singh',
      title: 'Senior React Developer',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      experience: '7 years',
      location: 'Bangalore',
      rate: '₹3,500/hour',
      matchScore: 96,
      available: true,
      rating: 4.9,
      completedProjects: 23,
    },
    {
      id: 2,
      name: 'Sneha Reddy',
      title: 'Full Stack Developer',
      skills: ['Python', 'Django', 'React', 'PostgreSQL'],
      experience: '5 years',
      location: 'Hyderabad',
      rate: '₹2,800/hour',
      matchScore: 89,
      available: true,
      rating: 4.8,
      completedProjects: 15,
    },
    {
      id: 3,
      name: 'Arjun Nair',
      title: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      experience: '6 years',
      location: 'Remote',
      rate: '₹3,200/hour',
      matchScore: 85,
      available: false,
      availableIn: '2 weeks',
      rating: 4.7,
      completedProjects: 18,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <Clock className="h-7 w-7 text-orange-500" />
            Short-Term Contract Hiring
          </h1>
          <p className="text-neutral-600">Find available contractors for your projects</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Send className="h-4 w-4 mr-2" />
          Post Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Skills</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input placeholder="React, Python..." className="pl-10" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Duration: {duration[0]} months</label>
              <Slider
                value={duration}
                onValueChange={setDuration}
                min={1}
                max={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>1 month</span>
                <span>12 months</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Budget: ₹{budget[0].toLocaleString()}/month</label>
              <Slider
                value={budget}
                onValueChange={setBudget}
                min={20000}
                max={200000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>₹20K</span>
                <span>₹2L</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="space-y-2">
                {['Remote', 'Bangalore', 'Mumbai', 'Delhi NCR'].map((loc) => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                    <span className="text-sm">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" defaultChecked />
                <span className="text-sm font-medium flex items-center gap-1">
                  <Zap className="h-4 w-4 text-green-500" />
                  Available Immediately
                </span>
              </label>
            </div>

            <Button variant="outline" className="w-full">
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Talent List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-navy-900">{talents.length}</span> contractors available
            </p>
            <select className="text-sm border rounded-lg px-3 py-2">
              <option>Best Match</option>
              <option>Lowest Rate</option>
              <option>Highest Rated</option>
            </select>
          </div>

          {talents.map((talent) => (
            <Card key={talent.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex-shrink-0">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-navy-800 text-white text-xl">
                        {talent.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-navy-900">{talent.name}</h3>
                          {talent.available && (
                            <Badge className="bg-green-100 text-green-700 border border-green-200">
                              <Zap className="h-3 w-3 mr-1" />
                              Available Now
                            </Badge>
                          )}
                          {!talent.available && (
                            <Badge className="bg-yellow-100 text-yellow-700">
                              Available in {talent.availableIn}
                            </Badge>
                          )}
                        </div>
                        <p className="text-neutral-600">{talent.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-orange-500 font-bold text-xl">
                          {talent.matchScore}%
                        </div>
                        <p className="text-xs text-neutral-500">Match Score</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-neutral-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {talent.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {talent.experience}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {talent.rating} ({talent.completedProjects} projects)
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-navy-800">
                        <DollarSign className="h-4 w-4" />
                        {talent.rate}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {talent.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-orange-50 text-orange-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Send className="h-4 w-4 mr-2" />
                        Quick Invite
                      </Button>
                      <Button variant="outline">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save to Pipeline
                      </Button>
                      <Button variant="ghost">View Profile</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractHiring;

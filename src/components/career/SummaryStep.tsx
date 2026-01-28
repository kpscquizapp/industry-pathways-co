import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Briefcase, TrendingUp, GraduationCap, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SummaryStepProps {
  careerPath: string;
  isExperienced: boolean;
}

const SummaryStep = ({ careerPath, isExperienced }: SummaryStepProps) => {
  const navigate = useNavigate();

  const roadmap = [
    {
      stage: 'Beginner',
      duration: '0-6 months',
      skills: ['Core fundamentals', 'Basic tools', 'First projects'],
      salary: '₹3-6 LPA'
    },
    {
      stage: 'Junior',
      duration: '6-18 months',
      skills: ['Framework expertise', 'API development', 'Database design'],
      salary: '₹6-10 LPA'
    },
    {
      stage: 'Mid-Level',
      duration: '18-36 months',
      skills: ['Architecture', 'System design', 'Team collaboration'],
      salary: '₹10-18 LPA'
    },
    {
      stage: 'Senior',
      duration: '3+ years',
      skills: ['Leadership', 'Microservices', 'Cloud expertise'],
      salary: '₹18-35 LPA'
    }
  ];

  const handleSearchJobs = () => {
    navigate(`/jobs?query=${encodeURIComponent(careerPath)}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          Your Complete Career Roadmap
        </h2>
        <p className="text-lg text-neutral-600">
          {careerPath} - {isExperienced ? 'Experienced' : 'Fresher'} Track
        </p>
      </div>

      {/* Timeline Roadmap */}
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-neutral-900 mb-6">Career Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.map((stage, index) => (
            <Card key={index} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${
                index === 0 ? 'from-green-500 to-green-600' :
                index === 1 ? 'from-blue-500 to-blue-600' :
                index === 2 ? 'from-purple-500 to-purple-600' :
                'from-teal-500 to-teal-600'
              }`}></div>
              <CardHeader className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{stage.stage}</CardTitle>
                  <Badge variant="outline">{stage.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Skills:</h4>
                    <ul className="space-y-1">
                      {stage.skills.map((skill, i) => (
                        <li key={i} className="text-sm text-neutral-600 flex items-start gap-1">
                          <span className="text-teal-600 mt-1">•</span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-teal-600 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      {stage.salary}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Job Opportunities */}
      <Card className="mb-8 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Briefcase className="h-6 w-6 text-teal-600" />
            Job Openings in Your Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Bangalore</h4>
              <p className="text-2xl font-bold text-teal-600">1,234+</p>
              <p className="text-sm text-neutral-600">Active openings</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Hyderabad</h4>
              <p className="text-2xl font-bold text-teal-600">856+</p>
              <p className="text-sm text-neutral-600">Active openings</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Pune</h4>
              <p className="text-2xl font-bold text-teal-600">642+</p>
              <p className="text-sm text-neutral-600">Active openings</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
              onClick={handleSearchJobs}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Search {careerPath} Jobs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          size="lg"
          variant="outline"
          className="px-8"
        >
          <Download className="h-5 w-5 mr-2" />
          Download as PDF
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="px-8"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share Roadmap
        </Button>
        <Button
          size="lg"
          className="px-8 bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
        >
          <GraduationCap className="h-5 w-5 mr-2" />
          Start Learning Now
        </Button>
      </div>
    </div>
  );
};

export default SummaryStep;

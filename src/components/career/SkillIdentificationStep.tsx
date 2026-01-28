import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp } from 'lucide-react';

interface SkillIdentificationStepProps {
  selectedSkill: string;
  setSelectedSkill: (value: string) => void;
  selectedCareerPath: string;
  setSelectedCareerPath: (value: string) => void;
  onNext: () => void;
}

const careerPathsData: Record<string, string[]> = {
  'Java': ['Java Developer', 'Automation Tester (SDET)', 'Android Developer', 'Big Data Developer', 'Enterprise Architect'],
  'Python': ['Python Developer', 'Data Scientist', 'Machine Learning Engineer', 'Backend Developer', 'DevOps Engineer'],
  'JavaScript': ['Frontend Developer', 'Full Stack Developer', 'React Developer', 'Node.js Developer', 'Web Developer'],
  'DevOps': ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer', 'Platform Engineer'],
  'AWS': ['Cloud Engineer', 'Cloud Architect', 'DevOps Engineer', 'Solutions Architect'],
  'React': ['React Developer', 'Frontend Developer', 'Full Stack Developer', 'UI Engineer'],
  'Data': ['Data Analyst', 'Data Engineer', 'Data Scientist', 'Business Intelligence Analyst'],
  '.NET': ['.NET Developer', 'Full Stack .NET Developer', 'Azure Developer', 'Enterprise Developer'],
};

const SkillIdentificationStep = ({
  selectedSkill,
  setSelectedSkill,
  selectedCareerPath,
  setSelectedCareerPath,
  onNext
}: SkillIdentificationStepProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const suggestedPaths = selectedSkill ? careerPathsData[selectedSkill] || [] : [];

  const handleSkillSearch = (term: string) => {
    setSearchTerm(term);
    const matchedSkill = Object.keys(careerPathsData).find(
      skill => skill.toLowerCase().includes(term.toLowerCase())
    );
    if (matchedSkill) {
      setSelectedSkill(matchedSkill);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          Select your skills
        </h2>
        <p className="text-lg text-neutral-600">
          Type a skill to discover matching career paths
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Type a skill... (e.g., Java, DevOps, AWS)"
            value={searchTerm}
            onChange={(e) => handleSkillSearch(e.target.value)}
            className="pl-12 py-6 text-lg"
          />
        </div>
        
        {/* Popular Skills */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <span className="text-sm text-neutral-500 mr-2">Popular:</span>
          {Object.keys(careerPathsData).slice(0, 6).map((skill) => (
            <Badge
              key={skill}
              variant="outline"
              className="cursor-pointer hover:bg-teal-100 hover:border-teal-600"
              onClick={() => {
                setSearchTerm(skill);
                setSelectedSkill(skill);
              }}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Suggested Career Paths */}
      {suggestedPaths.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-teal-600" />
            Suggested Career Paths
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {suggestedPaths.map((path) => (
              <Card
                key={path}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedCareerPath === path
                    ? 'ring-2 ring-teal-600 bg-teal-50'
                    : ''
                }`}
                onClick={() => setSelectedCareerPath(path)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{path}</CardTitle>
                  <CardDescription>Click to explore this career</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">High Demand</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedCareerPath && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={onNext}
            size="lg"
            className="px-12 py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
          >
            Explore {selectedCareerPath}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SkillIdentificationStep;

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, DollarSign, Briefcase, CheckCircle2 } from 'lucide-react';

interface CertificationStepProps {
  careerPath: string;
  onNext: () => void;
}

const certificationData: Record<string, any> = {
  'Java Developer': {
    mustHave: [
      { name: 'Java OCAJP', description: 'Oracle Certified Associate Java Programmer', value: 'High' },
      { name: 'Spring Professional', description: 'Spring Framework Certification', value: 'High' }
    ],
    goodToHave: [
      { name: 'AWS Cloud Practitioner', description: 'Basic AWS knowledge', value: 'Medium' },
      { name: 'Microservices Certification', description: 'Vendor-neutral microservices', value: 'Medium' }
    ],
    salaryRange: '₹6-15 LPA',
    demandLevel: 'Very High in Indian IT market',
    jobRoles: ['Java Developer', 'Backend Developer', 'Full Stack Developer', 'Software Engineer']
  }
};

const CertificationStep = ({ careerPath, onNext }: CertificationStepProps) => {
  const data = certificationData[careerPath] || certificationData['Java Developer'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          Certification Roadmap for {careerPath}
        </h2>
        <p className="text-lg text-neutral-600">
          To become job-ready, you will need these certifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Must-Have Certifications */}
        <Card className="border-2 border-teal-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle2 className="h-6 w-6 text-teal-600" />
              Must-Have Certifications
            </CardTitle>
            <CardDescription>Essential for getting hired</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.mustHave.map((cert: any, index: number) => (
              <div key={index} className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{cert.name}</h4>
                  <Badge className="bg-teal-600">{cert.value}</Badge>
                </div>
                <p className="text-sm text-neutral-600">{cert.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Good-to-Have Certifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-6 w-6 text-blue-600" />
              Good-to-Have Certifications
            </CardTitle>
            <CardDescription>Competitive advantage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.goodToHave.map((cert: any, index: number) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{cert.name}</h4>
                  <Badge variant="secondary">{cert.value}</Badge>
                </div>
                <p className="text-sm text-neutral-600">{cert.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Industry Demand Indicator */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-teal-600" />
            Industry Demand Indicator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
              <TrendingUp className="h-10 w-10 text-teal-600 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-2">Market Demand</h4>
              <p className="text-neutral-700">{data.demandLevel}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <DollarSign className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-2">Salary Range</h4>
              <p className="text-2xl font-bold text-green-600">{data.salaryRange}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Briefcase className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-2">Job Roles</h4>
              <p className="text-sm text-neutral-700">{data.jobRoles.length}+ roles</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-3">Job Roles You Can Apply For:</h4>
            <div className="flex flex-wrap gap-2">
              {data.jobRoles.map((role: string, index: number) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          size="lg"
          className="px-12 py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
        >
          View Complete Roadmap
        </Button>
      </div>
    </div>
  );
};

export default CertificationStep;

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from 'lucide-react';

interface ExperienceCheckStepProps {
  isExperienced: boolean | null;
  setIsExperienced: (value: boolean) => void;
  onNext: () => void;
}

const ExperienceCheckStep = ({ isExperienced, setIsExperienced, onNext }: ExperienceCheckStepProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-neutral-900 mb-4">
          Are you an experienced IT professional?
        </h2>
        <p className="text-lg text-neutral-600">
          This helps us personalize your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yes - Experienced */}
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
            isExperienced === true
              ? 'ring-4 ring-teal-600 shadow-2xl scale-105'
              : 'hover:scale-102'
          }`}
          onClick={() => setIsExperienced(true)}
        >
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">✅ Yes</h3>
            <p className="text-neutral-600 text-lg">
              I have professional experience in IT
            </p>
          </CardContent>
        </Card>

        {/* No - Fresher */}
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
            isExperienced === false
              ? 'ring-4 ring-teal-600 shadow-2xl scale-105'
              : 'hover:scale-102'
          }`}
          onClick={() => setIsExperienced(false)}
        >
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">❌ No</h3>
            <p className="text-neutral-600 text-lg">
              I'm new to the IT field
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-10">
        <Button
          onClick={onNext}
          disabled={isExperienced === null}
          size="lg"
          className="px-12 py-6 text-lg bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900"
        >
          Continue to Next Step
        </Button>
      </div>
    </div>
  );
};

export default ExperienceCheckStep;

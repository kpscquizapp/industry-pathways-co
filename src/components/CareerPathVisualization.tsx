import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from 'lucide-react';
import ExperienceCheckStep from './career/ExperienceCheckStep';
import SkillIdentificationStep from './career/SkillIdentificationStep';
import CareerPathDetailsStep from './career/CareerPathDetailsStep';
import LearningModeStep from './career/LearningModeStep';
import PlatformSuggestionsStep from './career/PlatformSuggestionsStep';
import CertificationStep from './career/CertificationStep';
import SummaryStep from './career/SummaryStep';

const CareerPathVisualization = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isExperienced, setIsExperienced] = useState<boolean | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedCareerPath, setSelectedCareerPath] = useState<string>('');
  const [learningMode, setLearningMode] = useState<'online' | 'offline' | null>(null);

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-neutral-800">Career Path Discovery</h1>
            <span className="text-sm text-neutral-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Back Button */}
        {currentStep > 1 && (
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}

        {/* Step Content */}
        <div className="animate-in fade-in duration-500">
          {currentStep === 1 && (
            <ExperienceCheckStep
              isExperienced={isExperienced}
              setIsExperienced={setIsExperienced}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <SkillIdentificationStep
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
              selectedCareerPath={selectedCareerPath}
              setSelectedCareerPath={setSelectedCareerPath}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 3 && (
            <CareerPathDetailsStep
              careerPath={selectedCareerPath}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 4 && (
            <LearningModeStep
              learningMode={learningMode}
              setLearningMode={setLearningMode}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 5 && (
            <PlatformSuggestionsStep
              learningMode={learningMode!}
              careerPath={selectedCareerPath}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 6 && (
            <CertificationStep
              careerPath={selectedCareerPath}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 7 && (
            <SummaryStep
              careerPath={selectedCareerPath}
              isExperienced={isExperienced!}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPathVisualization;


import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ExperienceStepProps {
  experience: 'experienced' | 'fresher';
  setExperience: (value: 'experienced' | 'fresher') => void;
  onNext: () => void;
}

const ExperienceStep = ({ experience, setExperience, onNext }: ExperienceStepProps) => {
  const { translations } = useLanguage();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 animate-in fade-in duration-300">
      <h2 className="text-2xl font-semibold text-neutral-800 mb-6">
        {translations.areYouExperienced}
      </h2>

      <RadioGroup 
        value={experience} 
        onValueChange={(value) => setExperience(value as 'experienced' | 'fresher')}
        className="space-y-4"
      >
        <div className={`flex items-start p-4 border rounded-lg ${experience === 'experienced' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200'}`}>
          <RadioGroupItem value="experienced" id="experienced" className="mt-1" />
          <div className="ml-3">
            <Label htmlFor="experienced" className="text-base font-medium">
              {translations.yes}
            </Label>
            <p className="text-sm text-gray-500">
              {translations.haveExperience}
            </p>
          </div>
        </div>
        
        <div className={`flex items-start p-4 border rounded-lg ${experience === 'fresher' ? 'border-teal-500 bg-teal-50/50' : 'border-gray-200'}`}>
          <RadioGroupItem value="fresher" id="fresher" className="mt-1" />
          <div className="ml-3">
            <Label htmlFor="fresher" className="text-base font-medium">
              {translations.no}
            </Label>
            <p className="text-sm text-gray-500">
              {translations.newToField}
            </p>
          </div>
        </div>
      </RadioGroup>

      <Button 
        onClick={onNext} 
        disabled={!experience}
        className="mt-8 w-full md:w-auto"
      >
        {translations.nextStep}
      </Button>
    </div>
  );
};

export default ExperienceStep;

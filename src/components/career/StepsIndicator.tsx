
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepsIndicatorProps {
  currentStep: number;
  steps: { id: number; label: string }[];
}

const StepsIndicator = ({ currentStep, steps }: StepsIndicatorProps) => {
  return (
    <div className="flex items-center justify-center w-full my-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step circle */}
          <div className="relative">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                currentStep > index 
                  ? "bg-teal-500 text-white" 
                  : currentStep === index 
                    ? "bg-teal-500 text-white" 
                    : "bg-gray-100 text-gray-400"
              )}
            >
              {currentStep > index ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-600">
              {step.label}
            </span>
          </div>
          
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div 
              className={cn(
                "h-1 w-24 mx-2",
                currentStep > index ? "bg-teal-500" : "bg-gray-200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepsIndicator;

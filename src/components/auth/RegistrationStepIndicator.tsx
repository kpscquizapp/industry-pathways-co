import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
}

interface RegistrationStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string }[];
}

const RegistrationStepIndicator: React.FC<RegistrationStepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  const totalSteps = steps.length;
  return (
    <div className="mb-10 w-full px-1">
      <div className="flex items-center justify-start mb-8 gap-x-2 sm:gap-x-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center">
             <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                currentStep >= idx + 1
                  ? "bg-[#4DD9E8] text-white shadow-lg shadow-[#4DD9E8]/20"
                  : "bg-slate-100 dark:bg-white/5 text-slate-400"
              )}
            >
              {currentStep > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span
              className={cn(
                "stepper-label text-[10px] sm:text-[11px] font-bold tracking-widest transition-colors duration-300 text-[#080b20]",
                currentStep === idx + 1
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400"
              )}
            >
              {step.title}
            </span>
            
         </div>
          {idx < steps.length - 1 && (
            <div className="w-6 sm:w-12 h-[1px] bg-slate-200 mx-2" />
          )}
          </div>
        ))}
      
      </div>
      
      {/* Progress Bar */}

    </div>
  );
};

export default RegistrationStepIndicator;

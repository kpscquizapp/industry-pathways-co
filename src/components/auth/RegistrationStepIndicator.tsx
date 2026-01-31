import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
}

interface RegistrationStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

const RegistrationStepIndicator: React.FC<RegistrationStepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="mb-10 w-full px-1">
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-none gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                currentStep >= idx + 1
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-slate-100 dark:bg-white/5 text-slate-400"
              )}
            >
              {currentStep > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span
              className={cn(
                "text-[10px] font-black uppercase tracking-tighter text-center whitespace-nowrap",
                currentStep === idx + 1
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400"
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default RegistrationStepIndicator;

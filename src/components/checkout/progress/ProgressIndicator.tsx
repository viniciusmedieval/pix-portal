
import React from 'react';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description?: string }[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-2 mb-4" />
      
      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep - 1;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mb-2
                ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}
                transition-colors duration-200
              `}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 max-w-[100px] text-center">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;

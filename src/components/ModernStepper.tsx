import React from 'react';
import { Check } from 'lucide-react';

interface StepperStep {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
}

interface TopbarStepperProps {
  steps: StepperStep[];
  title?: string;
  compact?: boolean;
  onStepClick?: (stepId: number) => void;
}

// Legacy component for backward compatibility
interface ModernStepperProps {
  steps: StepperStep[];
  title?: string;
}

export const TopbarStepper: React.FC<TopbarStepperProps> = ({ steps, title = "Process", compact = false, onStepClick }) => {
  if (!steps.length) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Process Title */}
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
        <span className={`font-medium text-foreground ${compact ? 'text-xs' : 'text-sm'}`}>{title}</span>
      </div>
    
      {/* Steps */}
      <div className="flex items-center space-x-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center space-x-2">
              {/* Step Number/Check */}
              <div 
                className={`
                  relative rounded-full flex items-center justify-center font-bold transition-all duration-200 glaze-enhanced
                  ${compact ? 'w-5 h-5 text-xs' : 'w-6 h-6 text-sm'}
                  ${step.status === 'completed' ? 
                    'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm cursor-pointer hover:from-emerald-600 hover:to-emerald-700' : 
                    step.status === 'active' ? 
                    'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm ring-1 ring-primary/20 cursor-pointer' : 
                    'bg-muted/50 text-muted-foreground border border-border/50'}
                `}
                onClick={() => {
                  if (step.status === 'completed' || step.status === 'active') {
                    onStepClick?.(step.id);
                  }
                }}
              >
                {step.status === 'completed' ? 
                  <Check className={compact ? "w-2.5 h-2.5" : "w-3 h-3"} /> : 
                  <span className="font-bold">{step.id}</span>
                }
                {step.status === 'active' && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full animate-pulse"></div>
                )}
              </div>
              
              {/* Step Title - Always visible, better spacing */}
              <span 
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  step.status === 'active' ? 'text-foreground cursor-pointer' : 
                  step.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300' : 'text-muted-foreground'
                }`}
                onClick={() => {
                  if (step.status === 'completed' || step.status === 'active') {
                    onStepClick?.(step.id);
                  }
                }}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-px mx-3 transition-all duration-300 ${
                compact ? 'w-6' : 'w-8'
              } ${
                steps[index + 1].status === 'completed' || step.status === 'completed' ? 
                'bg-gradient-to-r from-emerald-500 to-emerald-600' : 
                step.status === 'active' ? 
                'bg-gradient-to-r from-primary/50 to-transparent' :
                'bg-border/50'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Legacy export for backward compatibility
export const ModernStepper: React.FC<ModernStepperProps> = ({ steps, title = "Process" }) => {
  console.warn("ModernStepper is deprecated. Please use useStepperContext hook to integrate with the topbar stepper.");
  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-border py-3 px-6 shadow-sm glaze-subtle">
      <div className="max-w-4xl mx-auto">
        <TopbarStepper steps={steps} title={title} compact={false} />
      </div>
    </div>
  );
};
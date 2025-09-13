import { useEffect } from 'react';
import { useStepperContext } from '@/contexts/StepperContext';

interface StepperStep {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
}

interface UseStepperOptions {
  steps: StepperStep[];
  title: string;
  initialStep?: number;
}

export const useStepper = ({ steps, title, initialStep = 1 }: UseStepperOptions) => {
  const { 
    setSteps, 
    setTitle, 
    setShowStepper, 
    setCurrentStep, 
    currentStep,
    nextStep,
    prevStep,
    updateStepStatus
  } = useStepperContext();

  useEffect(() => {
    // Initialize stepper
    setSteps(steps);
    setTitle(title);
    setCurrentStep(initialStep);
    setShowStepper(true);

    // Set initial active step
    const updatedSteps = steps.map(step => ({
      ...step,
      status: step.id < initialStep ? 'completed' as const : 
              step.id === initialStep ? 'active' as const : 'pending' as const
    }));
    setSteps(updatedSteps);

    // Cleanup on unmount
    return () => {
      setShowStepper(false);
    };
  }, [steps, title, initialStep, setSteps, setTitle, setCurrentStep, setShowStepper]);

  const goToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= steps.length) {
      // Update all step statuses based on the target step
      const updatedSteps = steps.map(step => ({
        ...step,
        status: step.id < stepId ? 'completed' as const : 
                step.id === stepId ? 'active' as const : 'pending' as const
      }));
      setSteps(updatedSteps);
      setCurrentStep(stepId);
    }
  };

  const markStepCompleted = (stepId: number) => {
    updateStepStatus(stepId, 'completed');
  };

  const markStepActive = (stepId: number) => {
    updateStepStatus(stepId, 'active');
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    markStepCompleted,
    markStepActive,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === steps.length,
  };
};
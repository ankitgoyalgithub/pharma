import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StepperStep {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
}

interface StepperContextType {
  steps: StepperStep[];
  currentStep: number;
  title: string;
  showStepper: boolean;
  onStepClick?: (stepId: number) => void;
  setSteps: (steps: StepperStep[]) => void;
  setCurrentStep: (step: number) => void;
  setTitle: (title: string) => void;
  setShowStepper: (show: boolean) => void;
  setOnStepClick: (handler: (stepId: number) => void) => void;
  updateStepStatus: (stepId: number, status: 'completed' | 'active' | 'pending') => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (context === undefined) {
    // Return default values instead of throwing error
    return {
      steps: [],
      currentStep: 1,
      title: '',
      showStepper: false,
      onStepClick: undefined,
      setSteps: () => {},
      setCurrentStep: () => {},
      setTitle: () => {},
      setShowStepper: () => {},
      setOnStepClick: () => {},
      updateStepStatus: () => {},
      nextStep: () => {},
      prevStep: () => {},
    };
  }
  return context;
};

interface StepperProviderProps {
  children: ReactNode;
}

export const StepperProvider: React.FC<StepperProviderProps> = ({ children }) => {
  const [steps, setSteps] = useState<StepperStep[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [showStepper, setShowStepper] = useState(false);
  const [onStepClick, setOnStepClick] = useState<((stepId: number) => void) | undefined>(undefined);

  const updateStepStatus = (stepId: number, status: 'completed' | 'active' | 'pending') => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      // Mark current as completed
      updateStepStatus(currentStep, 'completed');
      // Mark next as active
      updateStepStatus(currentStep + 1, 'active');
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      // Mark current as pending
      updateStepStatus(currentStep, 'pending');
      // Mark previous as active
      updateStepStatus(currentStep - 1, 'active');
      setCurrentStep(currentStep - 1);
    }
  };

  const value: StepperContextType = {
    steps,
    currentStep,
    title,
    showStepper,
    onStepClick,
    setSteps,
    setCurrentStep,
    setTitle,
    setShowStepper,
    setOnStepClick,
    updateStepStatus,
    nextStep,
    prevStep,
  };

  return (
    <StepperContext.Provider value={value}>
      {children}
    </StepperContext.Provider>
  );
};

import { useState, useEffect } from 'react';

export const useOneCheckoutState = (config: any) => {
  const [visitors, setVisitors] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'personal-info' | 'payment-method' | 'confirm'>('personal-info');
  
  // Set up random visitor count
  useEffect(() => {
    const showVisitorCounter = config?.numero_aleatorio_visitas !== false;
    if (showVisitorCounter) {
      setVisitors(Math.floor(Math.random() * (150 - 80) + 80));
    }
  }, [config?.numero_aleatorio_visitas]);
  
  return {
    visitors,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting
  };
};

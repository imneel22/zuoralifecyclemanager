import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OnboardingType = 'billing' | 'revenue';

interface OnboardingContextType {
  onboardingType: OnboardingType;
  setOnboardingType: (type: OnboardingType) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [onboardingType, setOnboardingType] = useState<OnboardingType>('billing');

  return (
    <OnboardingContext.Provider value={{ onboardingType, setOnboardingType }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

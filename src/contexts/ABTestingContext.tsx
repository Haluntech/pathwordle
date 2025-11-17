import React, { createContext, useContext, ReactNode } from 'react';
import { useABTesting } from '../hooks/useABTesting';

interface ABTestingContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  activeTests: any[];
  userAssignments: any[];
  getVariation: (testId: string) => any;
  trackTestEvent: (testId: string, eventName: string, value?: number, properties?: any) => void;
  getTestStatistics: (testId: string) => any;
  resetTestData: () => void;
  totalActiveTests: number;
  totalUserAssignments: number;
}

const ABTestingContext = createContext<ABTestingContextType | undefined>(undefined);

export const ABTestingProvider: React.FC<{
  children: ReactNode;
  userId?: string;
  config?: any;
}> = ({ children, userId, config }) => {
  const abTesting = useABTesting({ userId, config });

  return (
    <ABTestingContext.Provider value={abTesting}>
      {children}
    </ABTestingContext.Provider>
  );
};

export const useABTestingContext = () => {
  const context = useContext(ABTestingContext);
  if (context === undefined) {
    throw new Error('useABTestingContext must be used within an ABTestingProvider');
  }
  return context;
};

export default ABTestingContext;
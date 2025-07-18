
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { initialSchoolData, mockUsers } from '@/lib/mock-data';
import { useAuth } from './auth-context';

// Re-exporting types for components to use
export type { SchoolProfile, Student, Teacher, Role } from './auth-context';

interface SchoolDataContextType {
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  const value = {
    isLoading,
  };

  return (
    <SchoolDataContext.Provider value={value}>
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (context === undefined) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { teachersData } from '@/lib/mock-data';

interface SchoolDataContextType {
  subjects: string[];
  addSubject: (subject: string) => void;
  examBoards: string[];
  addExamBoard: (board: string) => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialSubjects = [...new Set(teachersData.map(t => t.subject))].sort();
const initialExamBoards = ['Internal', 'Cambridge', 'IB', 'State Board'];

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const [subjects, setSubjects] = useState<string[]>(initialSubjects);
  const [examBoards, setExamBoards] = useState<string[]>(initialExamBoards);

  const addSubject = (subject: string) => {
    if (!subjects.includes(subject)) {
      setSubjects(prev => [...prev, subject].sort());
    }
  };

  const addExamBoard = (board: string) => {
    if (!examBoards.includes(board)) {
      setExamBoards(prev => [...prev, board].sort());
    }
  };

  return (
    <SchoolDataContext.Provider value={{ subjects, addSubject, examBoards, addExamBoard }}>
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

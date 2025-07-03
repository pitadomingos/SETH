'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { schoolData } from '@/lib/mock-data';
import { useAuth } from './auth-context';

// Re-defining interfaces here for clarity, though they are also in mock-data
interface SchoolProfile {
  name: string;
  head: string;
  address: string;
  phone: string;
  email: string;
  motto: string;
}

interface SchoolDataContextType {
  schoolProfile: SchoolProfile | null;
  studentsData: any[];
  teachersData: any[];
  classesData: any[];
  admissionsData: any[];
  examsData: any[];
  financeData: any[];
  assetsData: any[];
  assignments: any[];
  grades: any[];
  attendance: any[];
  events: any[];
  courses: { teacher: any[], student: any[] };
  subjects: string[];
  addSubject: (subject: string) => void;
  examBoards: string[];
  addExamBoard: (board: string) => void;
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialExamBoards = ['Internal', 'Cambridge', 'IB', 'State Board', 'Advanced Placement'];

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentSchoolData, setCurrentSchoolData] = useState<any>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>(initialExamBoards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.schoolId && schoolData[user.schoolId]) {
      const data = schoolData[user.schoolId];
      setCurrentSchoolData(data);
      const initialSubjects = [...new Set(data.teachers.map(t => t.subject))].sort();
      setSubjects(initialSubjects);
      setIsLoading(false);
    } else {
        setIsLoading(true);
    }
  }, [user]);

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
  
  const value = {
    schoolProfile: currentSchoolData?.profile || null,
    studentsData: currentSchoolData?.students || [],
    teachersData: currentSchoolData?.teachers || [],
    classesData: currentSchoolData?.classes || [],
    admissionsData: currentSchoolData?.admissions || [],
    examsData: currentSchoolData?.exams || [],
    financeData: currentSchoolData?.finance || [],
    assetsData: currentSchoolData?.assets || [],
    assignments: currentSchoolData?.assignments || [],
    grades: currentSchoolData?.grades || [],
    attendance: currentSchoolData?.attendance || [],
    events: currentSchoolData?.events || [],
    courses: currentSchoolData?.courses || { teacher: [], student: [] },
    subjects,
    addSubject,
    examBoards,
    addExamBoard,
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

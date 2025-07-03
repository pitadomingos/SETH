
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { schoolData } from '@/lib/mock-data';
import { useAuth } from './auth-context';

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
  allSchoolData: typeof schoolData | null;
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
  const { user, role } = useAuth();
  const [currentSchoolData, setCurrentSchoolData] = useState<any>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>(initialExamBoards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (role === 'GlobalAdmin') {
        setCurrentSchoolData(null);
        setIsLoading(false);
    } else if (role === 'Parent' && user?.childrenIds) {
      const childrenIds = user.childrenIds;
      
      const allStudents: any[] = [];
      const allGrades: any[] = [];
      const allAttendance: any[] = [];
      const allFinance: any[] = [];
      const allEvents: any[] = [];
      const schoolIdsOfChildren = new Set<string>();

      for (const schoolId in schoolData) {
        const school = schoolData[schoolId];

        const studentsInSchool = school.students
          .filter(s => childrenIds.includes(s.id))
          .map(s => ({ ...s, schoolName: school.profile.name, schoolId: school.profile.id }));

        if (studentsInSchool.length > 0) {
            schoolIdsOfChildren.add(schoolId);
        }

        allStudents.push(...studentsInSchool);
        allGrades.push(...school.grades.filter(g => childrenIds.includes(g.studentId)));
        allAttendance.push(...school.attendance.filter(a => childrenIds.includes(a.studentId)));
        allFinance.push(...school.finance.filter(f => childrenIds.includes(f.studentId)));
      }

      schoolIdsOfChildren.forEach(schoolId => {
          const school = schoolData[schoolId];
          const schoolEventsWithSchoolName = school.events.map(event => ({
              ...event,
              schoolName: school.profile.name
          }));
          allEvents.push(...schoolEventsWithSchoolName);
      });

      const parentViewData = {
          profile: null,
          students: allStudents,
          grades: allGrades,
          attendance: allAttendance,
          finance: allFinance,
          events: allEvents,
          teachers: [], classes: [], admissions: [], exams: [],
          assets: [], assignments: [],
          courses: { teacher: [], student: [] }
      };
      
      setCurrentSchoolData(parentViewData);
      setSubjects([]);
      setIsLoading(false);
    } else if (user?.schoolId && schoolData[user.schoolId]) {
      const data = schoolData[user.schoolId];
      setCurrentSchoolData(data);
      if(data.teachers) {
          const initialSubjects = [...new Set(data.teachers.map(t => t.subject))].sort();
          setSubjects(initialSubjects);
      }
      setIsLoading(false);
    } else {
        setCurrentSchoolData(null);
        setIsLoading(false);
    }
  }, [user, role]);

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
    allSchoolData: role === 'GlobalAdmin' ? schoolData : null,
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

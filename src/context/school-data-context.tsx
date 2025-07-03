
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { schoolData, FinanceRecord as InitialFinanceRecord } from '@/lib/mock-data';
import { useAuth } from './auth-context';

export type FinanceRecord = InitialFinanceRecord;

interface SchoolProfile {
  name: string;
  head: string;
  address: string;
  phone: string;
  email: string;
  motto: string;
}

interface NewFeeData {
    studentId: string;
    description: string;
    totalAmount: number;
    dueDate: string;
}

interface SchoolDataContextType {
  schoolProfile: SchoolProfile | null;
  allSchoolData: typeof schoolData | null;
  studentsData: any[];
  teachersData: any[];
  classesData: any[];
  admissionsData: any[];
  examsData: any[];
  financeData: FinanceRecord[];
  recordPayment: (feeId: string, amount: number) => void;
  addFee: (data: NewFeeData) => void;
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
  feeDescriptions: string[];
  addFeeDescription: (description: string) => void;
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialExamBoards = ['Internal', 'Cambridge', 'IB', 'State Board', 'Advanced Placement'];

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role } = useAuth();
  const [currentSchoolData, setCurrentSchoolData] = useState<any>(null);
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>(initialExamBoards);
  const [feeDescriptions, setFeeDescriptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let schoolId: string | undefined;

    if (role === 'GlobalAdmin') {
      setCurrentSchoolData(null);
      setFinanceData([]);
      setIsLoading(false);
      return;
    }
    
    if (role === 'Parent' && user?.childrenIds) {
      const childrenIds = user.childrenIds;
      
      const allStudents: any[] = [];
      const allGrades: any[] = [];
      const allAttendance: any[] = [];
      const allFinance: any[] = [];
      const allEvents: any[] = [];
      const schoolIdsOfChildren = new Set<string>();

      for (const schoolIdKey in schoolData) {
        const school = schoolData[schoolIdKey];

        const studentsInSchool = school.students
          .filter(s => childrenIds.includes(s.id))
          .map(s => ({ ...s, schoolName: school.profile.name, schoolId: school.profile.id }));

        if (studentsInSchool.length > 0) {
            schoolIdsOfChildren.add(schoolIdKey);
            allStudents.push(...studentsInSchool);
        }

        allGrades.push(...school.grades.filter(g => childrenIds.includes(g.studentId)));
        allAttendance.push(...school.attendance.filter(a => childrenIds.includes(a.studentId)));
        allFinance.push(...school.finance.filter(f => childrenIds.includes(f.studentId)));
      }

      schoolIdsOfChildren.forEach(sId => {
          const school = schoolData[sId];
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
          events: allEvents,
          teachers: [], classes: [], admissions: [], exams: [],
          assets: [], assignments: [],
          courses: { teacher: [], student: [] }
      };
      
      setCurrentSchoolData(parentViewData);
      setFinanceData(allFinance);
      setSubjects([]);
      setFeeDescriptions([]);
      setIsLoading(false);
    } else if (user?.schoolId && schoolData[user.schoolId]) {
      schoolId = user.schoolId;
      const data = schoolData[schoolId];
      setCurrentSchoolData(data);
      setFinanceData(data.finance || []);
      if(data.teachers) {
          const initialSubjects = [...new Set(data.teachers.map(t => t.subject))].sort();
          setSubjects(initialSubjects);
      }
      setFeeDescriptions(data.feeDescriptions || []);
      setIsLoading(false);
    } else {
        setCurrentSchoolData(null);
        setFinanceData([]);
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
  
  const addFeeDescription = (description: string) => {
    if (!feeDescriptions.includes(description)) {
      setFeeDescriptions(prev => [...prev, description].sort());
    }
  };

  const recordPayment = (feeId: string, amount: number) => {
    setFinanceData(prevData =>
      prevData.map(fee => {
        if (fee.id === feeId) {
          const newAmountPaid = Math.min(fee.totalAmount, fee.amountPaid + amount);
          return { ...fee, amountPaid: newAmountPaid };
        }
        return fee;
      })
    );
  };

  const addFee = (data: NewFeeData) => {
    const student = currentSchoolData?.students?.find(s => s.id === data.studentId);
    if (!student) return;

    const newFee: FinanceRecord = {
        id: `FEE${Date.now()}`,
        studentId: data.studentId,
        studentName: student.name,
        description: data.description,
        totalAmount: data.totalAmount,
        amountPaid: 0,
        dueDate: data.dueDate,
    };

    setFinanceData(prev => [newFee, ...prev]);
  };
  
  const value = {
    schoolProfile: currentSchoolData?.profile || null,
    allSchoolData: role === 'GlobalAdmin' ? schoolData : null,
    studentsData: currentSchoolData?.students || [],
    teachersData: currentSchoolData?.teachers || [],
    classesData: currentSchoolData?.classes || [],
    admissionsData: currentSchoolData?.admissions || [],
    examsData: currentSchoolData?.exams || [],
    financeData,
    recordPayment,
    addFee,
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
    feeDescriptions,
    addFeeDescription,
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

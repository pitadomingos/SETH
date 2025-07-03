
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { schoolData, FinanceRecord as InitialFinanceRecord, Grade as InitialGrade } from '@/lib/mock-data';
import { useAuth } from './auth-context';

export type FinanceRecord = InitialFinanceRecord;
export type Grade = InitialGrade;

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

interface NewGradeData {
    studentId: string;
    subject: string;
    grade: string;
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
  grades: Grade[];
  addGrade: (data: NewGradeData) => void;
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
  const [grades, setGrades] = useState<Grade[]>([]);
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
      setGrades([]);
      setIsLoading(false);
      return;
    }
    
    if (role === 'Parent' && user?.email) {
      const parentEmail = user.email;
      
      const allStudents: any[] = [];
      const allGrades: Grade[] = [];
      const allAttendance: any[] = [];
      const allFinance: any[] = [];
      const allEvents: any[] = [];
      const schoolIdsOfChildren = new Set<string>();
      const childrenIds = new Set<string>();

      for (const schoolIdKey in schoolData) {
        const school = schoolData[schoolIdKey];

        const childrenInSchool = school.students
          .filter(s => s.parentEmail === parentEmail)
          .map(s => ({ ...s, schoolName: school.profile.name, schoolId: school.profile.id }));

        if (childrenInSchool.length > 0) {
            schoolIdsOfChildren.add(schoolIdKey);
            childrenInSchool.forEach(child => {
                allStudents.push(child);
                childrenIds.add(child.id);
            });
        }
      }

      for (const schoolIdKey in schoolData) {
        const school = schoolData[schoolIdKey];
        allGrades.push(...school.grades.filter(g => childrenIds.has(g.studentId)));
        allAttendance.push(...school.attendance.filter(a => childrenIds.has(a.studentId)));
        allFinance.push(...school.finance.filter(f => childrenIds.has(f.studentId)));
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
          attendance: allAttendance,
          events: allEvents,
          teachers: [], classes: [], admissions: [], exams: [],
          assets: [], assignments: [],
          courses: { teacher: [], student: [] }
      };
      
      setCurrentSchoolData(parentViewData);
      setFinanceData(allFinance);
      setGrades(allGrades);
      setSubjects([]);
      setFeeDescriptions([]);
      setIsLoading(false);
    } else if (user?.schoolId && schoolData[user.schoolId]) {
      schoolId = user.schoolId;
      const data = schoolData[schoolId];
      setCurrentSchoolData(data);
      setFinanceData(data.finance || []);
      setGrades(data.grades || []);
      if(data.teachers) {
          const initialSubjects = [...new Set(data.teachers.map(t => t.subject))].sort();
          setSubjects(initialSubjects);
      }
      setFeeDescriptions(data.feeDescriptions || []);
      setIsLoading(false);
    } else {
        setCurrentSchoolData(null);
        setFinanceData([]);
        setGrades([]);
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

  const addGrade = (data: NewGradeData) => {
    const newGrade: Grade = {
      studentId: data.studentId,
      subject: data.subject,
      grade: data.grade as Grade['grade'],
      date: new Date(),
    };
    setGrades(prev => [newGrade, ...prev]);
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
    grades,
    addGrade,
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

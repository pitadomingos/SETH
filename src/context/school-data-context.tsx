

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { schoolData, FinanceRecord as InitialFinanceRecord, Grade as InitialGrade, Student, Teacher, Class, Admission, Asset, SchoolProfile as InitialSchoolProfile, Expense, Team, Competition, SchoolEvent } from '@/lib/mock-data';
import { useAuth } from './auth-context';
import { format } from 'date-fns';

export type FinanceRecord = InitialFinanceRecord;
export type Grade = InitialGrade;
export type SchoolProfile = InitialSchoolProfile;
export type { Team, Competition };

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

interface NewExpenseData {
    description: string;
    category: string;
    amount: number;
    date: string;
    proofUrl: string;
}

interface NewTeamData {
    name: string;
    coach: string;
    icon: string;
}

interface NewCompetitionData {
    title: string;
    ourTeamId: string;
    opponent: string;
    date: Date;
    time: string;
    location: string;
}

interface NewEventData {
  title: string;
  date: Date;
  location: string;
  organizer: string;
  audience: string;
  type: string;
}

interface SchoolDataContextType {
  schoolProfile: SchoolProfile | null;
  updateSchoolProfile: (data: Partial<SchoolProfile>) => void;
  allSchoolData: typeof schoolData | null;
  studentsData: Student[];
  addStudent: (student: Omit<Student, 'id' | 'status'>) => void;
  teachersData: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'status'>) => void;
  classesData: Class[];
  addClass: (classData: Omit<Class, 'id'>) => void;
  admissionsData: Admission[];
  updateApplicationStatus: (id: string, status: Admission['status']) => void;
  examsData: Exam[];
  financeData: FinanceRecord[];
  recordPayment: (feeId: string, amount: number) => void;
  addFee: (data: NewFeeData) => void;
  assetsData: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  assignments: any[];
  grades: Grade[];
  addGrade: (data: NewGradeData) => void;
  attendance: any[];
  events: SchoolEvent[];
  addEvent: (data: NewEventData) => void;
  courses: { teacher: any[], student: any[] };
  subjects: string[];
  addSubject: (subject: string) => void;
  examBoards: string[];
  addExamBoard: (board: string) => void;
  feeDescriptions: string[];
  addFeeDescription: (description: string) => void;
  expenseCategories: string[];
  expensesData: Expense[];
  addExpense: (data: NewExpenseData) => void;
  teamsData: Team[];
  addTeam: (data: NewTeamData) => void;
  addPlayerToTeam: (teamId: string, studentId: string) => void;
  removePlayerFromTeam: (teamId: string, studentId: string) => void;
  competitionsData: Competition[];
  addCompetition: (data: NewCompetitionData) => void;
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialExamBoards = ['Internal', 'Cambridge', 'IB', 'State Board', 'Advanced Placement'];

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role } = useAuth();
  const [currentSchoolData, setCurrentSchoolData] = useState<any>(null);

  // Make data that can be modified stateful
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>(initialExamBoards);
  const [feeDescriptions, setFeeDescriptions] = useState<string[]>([]);
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [classesData, setClassesData] = useState<Class[]>([]);
  const [admissionsData, setAdmissionsData] = useState<Admission[]>([]);
  const [assetsData, setAssetsData] = useState<Asset[]>([]);
  const [expensesData, setExpensesData] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [teamsData, setTeamsData] = useState<Team[]>([]);
  const [competitionsData, setCompetitionsData] = useState<Competition[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let schoolId: string | undefined;

    if (role === 'GlobalAdmin') {
      setCurrentSchoolData(null);
      setSchoolProfile(null);
      setIsLoading(false);
      return;
    }
    
    if (role === 'Parent' && user?.email) {
       const parentEmail = user.email;
      
      const allStudents: any[] = [];
      const allGrades: Grade[] = [];
      const allAttendance: any[] = [];
      const allFinance: any[] = [];
      const allEvents: SchoolEvent[] = [];
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
          const schoolEventsWithSchoolName = school.events.map(event => ({ ...event, schoolName: school.profile.name }));
          allEvents.push(...schoolEventsWithSchoolName);
      });
      
      const parentViewData = {
          profile: null, students: allStudents, attendance: allAttendance, events: allEvents,
          teachers: [], classes: [], admissions: [], exams: [], assets: [], assignments: [],
          courses: { teacher: [], student: [] }, expenses: [], teams: [], competitions: [],
      };
      setCurrentSchoolData(parentViewData);
      setSchoolProfile(null);
      setStudentsData(allStudents);
      setFinanceData(allFinance);
      setGrades(allGrades);
      setEvents(allEvents);
      setIsLoading(false);
    } else if (user?.schoolId && schoolData[user.schoolId]) {
      schoolId = user.schoolId;
      const data = schoolData[schoolId];
      setCurrentSchoolData(data);
      setSchoolProfile(data.profile);
      setStudentsData(data.students || []);
      setTeachersData(data.teachers || []);
      setClassesData(data.classes || []);
      setAdmissionsData(data.admissions || []);
      setAssetsData(data.assets || []);
      setFinanceData(data.finance || []);
      setGrades(data.grades || []);
      setExpensesData(data.expenses || []);
      setExpenseCategories(data.expenseCategories || []);
      setTeamsData(data.teams || []);
      setCompetitionsData(data.competitions || []);
      setEvents(data.events || []);
      if(data.teachers) {
          const initialSubjects = [...new Set(data.teachers.map(t => t.subject))].sort();
          setSubjects(initialSubjects);
      }
      setFeeDescriptions(data.feeDescriptions || []);
      setIsLoading(false);
    } else {
        setCurrentSchoolData(null);
        setSchoolProfile(null);
        setIsLoading(false);
    }
  }, [user, role]);

  const updateSchoolProfile = (data: Partial<SchoolProfile>) => {
    setSchoolProfile(prev => prev ? { ...prev, ...data } : null);
  };
  
  const addSubject = (subject: string) => !subjects.includes(subject) && setSubjects(prev => [...prev, subject].sort());
  const addExamBoard = (board: string) => !examBoards.includes(board) && setExamBoards(prev => [...prev, board].sort());
  const addFeeDescription = (desc: string) => !feeDescriptions.includes(desc) && setFeeDescriptions(prev => [...prev, desc].sort());
  
  const recordPayment = (feeId: string, amount: number) => {
    setFinanceData(prev => prev.map(fee => fee.id === feeId ? { ...fee, amountPaid: Math.min(fee.totalAmount, fee.amountPaid + amount) } : fee));
  };
  
  const addFee = (data: NewFeeData) => {
    const student = studentsData.find(s => s.id === data.studentId);
    if (!student) return;
    const newFee: FinanceRecord = { id: `FEE${Date.now()}`, studentId: data.studentId, studentName: student.name, description: data.description, totalAmount: data.totalAmount, amountPaid: 0, dueDate: data.dueDate };
    setFinanceData(prev => [newFee, ...prev]);
  };
  
  const addGrade = (data: NewGradeData) => {
    const newGrade: Grade = { studentId: data.studentId, subject: data.subject, grade: data.grade as Grade['grade'], date: new Date() };
    setGrades(prev => [newGrade, ...prev]);
  };

  const addStudent = (studentData: Omit<Student, 'id'| 'gpa' | 'status'>) => {
    const newStudent: Student = { id: `S${Date.now()}`, ...studentData, status: 'Active' };
    setStudentsData(prev => [newStudent, ...prev]);
  };
  
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'status'>) => {
    const newTeacher: Teacher = { id: `T${Date.now()}`, ...teacherData, status: 'Active' };
    setTeachersData(prev => [newTeacher, ...prev]);
  };

  const addClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = { id: `C${Date.now()}`, ...classData };
    setClassesData(prev => [newClass, ...prev]);
  }

  const addAsset = (assetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { id: `ASSET${Date.now()}`, ...assetData };
    setAssetsData(prev => [newAsset, ...prev]);
  }

  const addExpense = (data: NewExpenseData) => {
    const newExpense: Expense = {
        id: `EXP${Date.now()}`,
        ...data,
    };
    setExpensesData(prev => [newExpense, ...prev]);
  }

  const addTeam = (data: NewTeamData) => {
    const newTeam: Team = {
      id: `TEAM${Date.now()}`,
      playerIds: [],
      ...data,
    };
    setTeamsData(prev => [newTeam, ...prev]);
  };

  const addCompetition = (data: NewCompetitionData) => {
    const newCompetition: Competition = {
        id: `COMP${Date.now()}`,
        ...data,
    };
    setCompetitionsData(prev => [...prev, newCompetition].sort((a,b) => a.date.getTime() - b.date.getTime()));
  };

  const addEvent = (data: NewEventData) => {
    const newEvent: SchoolEvent = {
        id: `EVT${Date.now()}`,
        ...data,
    };
    setEvents(prev => [...prev, newEvent].sort((a,b) => a.date.getTime() - b.date.getTime()));
  };

  const addPlayerToTeam = (teamId: string, studentId: string) => {
    setTeamsData(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, playerIds: [...team.playerIds, studentId] } 
        : team
    ));
  };

  const removePlayerFromTeam = (teamId: string, studentId: string) => {
    setTeamsData(prev => prev.map(team => 
      team.id === teamId 
        ? { ...team, playerIds: team.playerIds.filter(id => id !== studentId) } 
        : team
    ));
  };

  const updateApplicationStatus = (id: string, status: Admission['status']) => {
    setAdmissionsData(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const value = {
    schoolProfile,
    updateSchoolProfile,
    allSchoolData: role === 'GlobalAdmin' ? schoolData : null,
    studentsData, addStudent,
    teachersData, addTeacher,
    classesData, addClass,
    admissionsData, updateApplicationStatus,
    examsData: currentSchoolData?.exams || [],
    financeData, recordPayment, addFee,
    assetsData, addAsset,
    assignments: currentSchoolData?.assignments || [],
    grades, addGrade,
    attendance: currentSchoolData?.attendance || [],
    events,
    addEvent,
    courses: currentSchoolData?.courses || { teacher: [], student: [] },
    subjects, addSubject,
    examBoards, addExamBoard,
    feeDescriptions, addFeeDescription,
    expenseCategories,
    expensesData,
    addExpense,
    teamsData,
    addTeam,
    addPlayerToTeam,
    removePlayerFromTeam,
    competitionsData,
    addCompetition,
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

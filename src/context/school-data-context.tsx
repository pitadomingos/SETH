
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { initialSchoolData, SchoolData, Student, Teacher, Class, Course, Syllabus, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, SchoolProfile, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, mockUsers, UserProfile, SyllabusTopic, BehavioralAssessment } from '@/lib/mock-data';
import { useAuth, User } from './auth-context';
import type { Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';

export type { SchoolData, SchoolProfile, Student, Teacher, Class, Course, SyllabusTopic, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, BehavioralAssessment } from '@/lib/mock-data';

interface SchoolDataContextType {
    // --- Data States ---
    allSchoolData: Record<string, SchoolData> | null;
    allStudents: Student[];
    schoolProfile: SchoolProfile | null;
    studentsData: Student[];
    teachersData: Teacher[];
    classesData: Class[];
    coursesData: Course[];
    syllabi: Syllabus[];
    admissionsData: Admission[];
    financeData: FinanceRecord[];
    assetsData: any[];
    examsData: Exam[];
    grades: Grade[];
    attendance: Attendance[];
    events: Event[];
    expensesData: Expense[];
    teamsData: Team[];
    competitionsData: Competition[];
    kioskMedia: KioskMedia[];
    activityLogs: ActivityLog[];
    messages: Message[];
    savedReports: SavedReport[];
    schoolGroups: Record<string, string[]>;
    parentStatusOverrides: Record<string, 'Active' | 'Suspended'>;
    deployedTests: DeployedTest[];
    savedTests: SavedTest[];
    awardsAnnounced: boolean;
    
    // --- Dropdown Data ---
    subjects: string[];
    examBoards: string[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];
    terms: any[];
    holidays: any[];

    // --- Loading State ---
    isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, schoolId: authSchoolId } = useAuth();
  const [data, setData] = useState<Record<string, SchoolData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [awardsAnnounced, setAwardsAnnounced] = useState(false);
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});

  useEffect(() => {
    const fetchSchoolData = async () => {
        setIsLoading(true);
        try {
            const existingData = await getSchoolsFromFirestore();
            if (Object.keys(existingData).length === 0) {
                await seedInitialData();
                const seededData = await getSchoolsFromFirestore();
                setData(seededData);
                setAwardsAnnounced(seededData['northwood']?.profile.awards && seededData['northwood'].profile.awards.length > 0);
            } else {
                setData(existingData);
                setAwardsAnnounced(existingData['northwood']?.profile.awards && existingData['northwood'].profile.awards.length > 0);
            }
        } catch (error) {
            console.error("Failed to fetch or seed school data.", error);
            setData(initialSchoolData); // Fallback to local mock
            setAwardsAnnounced(initialSchoolData['northwood']?.profile.awards && initialSchoolData['northwood'].profile.awards.length > 0);
        } finally {
            setIsLoading(false);
        }
    };

    fetchSchoolData();
  }, []);
  
  const currentSchoolId = useMemo(() => {
    if (role === 'GlobalAdmin') return null;
    return authSchoolId;
  }, [authSchoolId, role]);

  const schoolData = useMemo(() => {
    if (!data || !currentSchoolId) return null;
    return data[currentSchoolId];
  }, [currentSchoolId, data]);

  const allStudents = useMemo(() => {
    if (!data) return [];
    return Object.values(data).flatMap(d => d.students.map(s => ({...s, schoolName: d.profile.name, schoolId: d.profile.id })));
  }, [data]);

  const studentsData = useMemo(() => {
    if (!user || !role || !allStudents.length) return [];
    if (role === 'Parent') {
        return allStudents.filter(student => student.parentEmail === user.email);
    }
    if (!schoolData) return [];
    return schoolData.students;
  }, [role, user, schoolData, allStudents]);

  const schoolGroups = useMemo(() => {
    return data?.['northwood']?.schoolGroups || {};
  }, [data]);

  const value: SchoolDataContextType = {
    isLoading,
    allSchoolData: data,
    allStudents,
    schoolProfile: schoolData?.profile || null,
    studentsData,
    teachersData: schoolData?.teachers || [],
    classesData: schoolData?.classes || [],
    coursesData: schoolData?.courses || [],
    subjects: useMemo(() => {
        if (!schoolData) return [];
        return [...new Set(schoolData.courses.map(c => c.subject))]
    }, [schoolData]),
    syllabi: schoolData?.syllabi || [],
    admissionsData: schoolData?.admissions || [],
    financeData: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
            const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
            return Object.values(data).flatMap(d => d.finance.filter(f => parentStudentIds.includes(f.studentId)));
        }
        return schoolData?.finance || [];
    }, [schoolData, data, role, user, allStudents]),
    assetsData: schoolData?.assets || [],
    examsData: schoolData?.exams || [],
    grades: useMemo(() => {
        if (!data) return [];
        if (role === 'Parent') {
          const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
          return Object.values(data).flatMap(d => d.grades.filter(g => parentStudentIds.includes(g.studentId)));
        }
        return schoolData?.grades || [];
    }, [schoolData, data, role, user, allStudents]),
    attendance: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
            const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
            return Object.values(data).flatMap(d => d.attendance.filter(a => parentStudentIds.includes(a.studentId)));
        }
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.attendance);
        return schoolData?.attendance || [];
    }, [schoolData, data, role, user, allStudents]),
    events: useMemo(() => {
        if (!data) return [];
        if (role === 'Parent' || role === 'Student') {
            return Object.values(data).flatMap(d => d.events.map(e => ({...e, schoolName: d.profile.name})));
        }
        if (role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.events);
        return schoolData?.events || [];
    }, [schoolData, data, role]),
    expensesData: useMemo(() => {
        if(!data) return [];
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.expenses);
        return schoolData?.expenses || [];
    }, [schoolData, data, role]),
    teamsData: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
            const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
            return Object.values(data).flatMap(d => d.teams.filter(t => t.playerIds.some(pId => parentStudentIds.includes(pId))));
        }
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.teams);
        return schoolData?.teams || [];
    }, [schoolData, data, role, user, allStudents]),
    competitionsData: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
             const parentTeamIds = Object.values(data).flatMap(d => d.teams.filter(t => t.playerIds.some(pId => allStudents.filter(s => s.parentEmail === user.email).map(s => s.id).includes(pId)))).map(t => t.id);
            return Object.values(data).flatMap(d => d.competitions.filter(c => parentTeamIds.includes(c.ourTeamId)));
        }
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.competitions);
        return schoolData?.competitions || [];
    }, [schoolData, data, role, user, allStudents]),
    kioskMedia: schoolData?.kioskMedia || [],
    activityLogs: useMemo(() => {
        if (!data) return [];
        if (role === 'GlobalAdmin') {
            return Object.values(data).flatMap(d => d.activityLogs);
        }
        return schoolData?.activityLogs || [];
    }, [schoolData, data, role]),
    messages: useMemo(() => {
      if (!user || !data) return [];
      if (role === 'GlobalAdmin') {
          return data['northwood']?.messages || [];
      }
      if (schoolData) {
        return schoolData.messages;
      }
      return [];
    }, [schoolData, data, user, role]),
    savedReports: schoolData?.savedReports || [],
    schoolGroups,
    parentStatusOverrides,
    deployedTests: schoolData?.deployedTests || [],
    savedTests: schoolData?.savedTests || [],
    awardsAnnounced,
    examBoards: schoolData?.examBoards || [],
    feeDescriptions: schoolData?.feeDescriptions || [],
    audiences: schoolData?.audiences || [],
    expenseCategories: schoolData?.expenseCategories || [],
    terms: schoolData?.terms || [],
    holidays: schoolData?.holidays || [],
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

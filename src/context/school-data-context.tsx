
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { useAuth, User, Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';
import { getDocs, collection, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';


// --- DATA STRUCTURES ---

export interface UserProfile {
    user: User;
    password: string;
}

export interface Subscription {
    status: 'Paid' | 'Overdue';
    amount: number;
    dueDate: string;
}

export interface SchoolProfile {
    id: string;
    name: string;
    head: string;
    address: string;
    phone: string;
    email: string;
    motto: string;
    tier: 'Starter' | 'Pro' | 'Premium';
    logoUrl: string;
    certificateTemplateUrl: string;
    transcriptTemplateUrl: string;
    gradingSystem: '20-Point' | 'Letter' | 'GPA';
    currency: 'USD' | 'ZAR' | 'MZN' | 'BWP' | 'NAD' | 'ZMW' | 'MWK' | 'AOA' | 'TZS' | 'ZWL';
    status: 'Active' | 'Suspended' | 'Inactive';
    schoolLevel: 'Primary' | 'Secondary' | 'Full';
    gradeCapacity: Record<string, number>;
    kioskConfig: {
      showDashboard: boolean;
      showLeaderboard: boolean;
      showTeacherLeaderboard: boolean;
      showAllSchools: boolean;
      showAttendance: boolean;
      showAcademics: boolean;
      showAwards: boolean;
      showPerformers: boolean;
      showAwardWinner: boolean;
      showShowcase: boolean;
    };
    subscription: Subscription;
    awards?: Array<{
        year: number;
        schoolOfTheYear: string;
        teacherOfTheYear: string;
        studentOfTheYear: string;
    }>;
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];
    examBoards: string[];
    schoolGroups: Record<string, string[]>;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    sex: 'Male' | 'Female';
    dateOfBirth: string;
    grade: string;
    class: string;
    parentName: string;
    parentEmail: string;
    status: 'Active' | 'Inactive' | 'Transferred';
    behavioralAssessments: BehavioralAssessment[];
    schoolId?: string;
    schoolName?: string;
}

export interface Teacher {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    sex: 'Male' | 'Female';
    subject: string;
    experience: string;
    qualifications: string;
    status: 'Active' | 'Inactive' | 'Transferred';
}

export interface Class {
    id: string;
    name: string;
    grade: string;
    teacher: string;
    students: number;
    room: string;
    headOfClassId?: string;
}

export interface Course {
    id: string;
    subject: string;
    teacherId: string;
    classId: string;
    schedule: Array<{ day: string, startTime: string, endTime: string, room: string }>;
}

export interface SyllabusTopic {
    id: string;
    week: number;
    topic: string;
    subtopics: string[];
}
export interface Syllabus {
    id: string;
    subject: string;
    grade: string;
    topics: SyllabusTopic[];
}

export interface Admission {
    id: string;
    type: 'New' | 'Transfer';
    name: string;
    date: any;
    appliedFor: string;
    parentName: string;
    parentEmail: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    dateOfBirth: string;
    sex: 'Male' | 'Female';
    formerSchool: string;
    gradesSummary?: string;
    idUrl?: string;
    reportUrl?: string;
    photoUrl?: string;
    studentIdToTransfer?: string;
    fromSchoolId?: string;
    reasonForTransfer?: string;
    transferGrade?: string;
}

export interface FinanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    description: string;
    totalAmount: number;
    amountPaid: number;
    dueDate: string;
    status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
}

export interface Exam {
    id: string;
    title: string;
    subject: string;
    grade: string;
    board: string;
    date: any;
    time: string;
    duration: string;
    room: string;
    invigilator: string;
}

export interface Grade {
    id: string;
    studentId: string;
    subject: string;
    grade: string;
    date: any;
    type: 'Coursework' | 'Test' | 'Exam';
    description: string;
    teacherId: string;
}

export interface Attendance {
    id: string;
    studentId: string;
    date: any;
    status: 'Present' | 'Late' | 'Absent' | 'Sick';
    courseId: string;
}

export interface Event {
    id: string;
    title: string;
    date: any;
    location: string;
    organizer: string;
    audience: string;
    type: 'Academic' | 'Sports' | 'Cultural' | 'Meeting' | 'Holiday';
    schoolName: string;
}

export interface Expense {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    proofUrl: string;
    type: 'Income' | 'Expense';
}

export interface Team {
    id: string;
    name: string;
    icon: string;
    coach: string;
    playerIds: string[];
}

export interface Competition {
    id: string;
    title: string;
    ourTeamId: string;
    opponent: string;
    date: any;
    time: string;
    location: string;
    result?: {
        ourScore: number;
        opponentScore: number;
        outcome: 'Win' | 'Loss' | 'Draw';
    };
}

export interface BehavioralAssessment {
    id: string;
    teacherId: string;
    studentId: string;
    date: Date;
    respect: number;
    participation: number;
    socialSkills: number;
    conduct: number;
    comment?: string;
}

export interface KioskMedia {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  createdAt: Date;
}

export interface ActivityLog {
    id: string;
    timestamp: any;
    schoolId: string;
    user: string;
    role: Role;
    action: string;
    details: string;
}

export interface Message {
    id: string;
    senderUsername: string;
    senderName: string;
    senderRole: string;
    recipientUsername: string;
    recipientName: string;
    recipientRole: string;
    subject: string;
    body: string;
    timestamp: Date;
    status: 'Pending' | 'Resolved';
    attachmentUrl?: string;
    attachmentName?: string;
}

export interface SavedReport {
    id: string;
    type: 'School-Wide' | 'Class' | 'Struggling Students' | 'Teacher Performance';
    title: string;
    date: Date;
    generatedBy: string;
    content: any;
}

export interface SavedTest {
    id: string;
    teacherId: string;
    subject: string;
    topic: string;
    grade: string;
    questions: Array<{
        question: string;
        options: string[];
        correctAnswer: string;
    }>;
    createdAt: Date;
}

export interface DeployedTest {
    id: string;
    testId: string;
    classId: string;
    deadline: any;
    submissions: Array<{
        studentId: string;
        score: number;
        submittedAt: Date;
    }>;
}

export interface SchoolData {
    profile: SchoolProfile;
    students: Student[];
    teachers: Teacher[];
    classes: Class[];
    courses: Course[];
    syllabi: Syllabus[];
    admissions: Admission[];
    finance: FinanceRecord[];
    assets: any[];
    exams: Exam[];
    grades: Grade[];
    attendance: Attendance[];
    events: Event[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];
    expenses: Expense[];
    teams: Team[];
    competitions: Competition[];
    terms: any[];
    holidays: any[];
    kioskMedia: KioskMedia[];
    activityLogs: ActivityLog[];
    messages: Message[];
    savedReports: SavedReport[];
    examBoards: string[];
    deployedTests: DeployedTest[];
    lessonPlans: any[];
    savedTests: SavedTest[];
    schoolGroups: Record<string, string[]>;
}

export interface NewMessageData {
    recipientUsername: string;
    subject: string;
    body: string;
    attachmentUrl?: string;
    attachmentName?: string;
    senderName?: string;
    senderRole?: string;
}

export interface NewAdmissionData {
  type: 'New' | 'Transfer';
  schoolId: string;
  name: string;
  dateOfBirth: string;
  sex: 'Male' | 'Female';
  appliedFor: string;
  formerSchool: string;
  gradesSummary?: string;
  idUrl?: string;
  reportUrl?: string;
  photoUrl?: string;
  studentIdToTransfer?: string;
  fromSchoolId?: string;
  reasonForTransfer?: string;
  transferGrade?: string;
}

export interface NewSchoolData {
    name: string;
    head: string;
    address: string;
    phone: string;
    email: string;
    motto?: string;
    tier: 'Starter' | 'Pro' | 'Premium';
}

/**
 * Provides comprehensive school data management for the application.
 * This context is responsible for fetching all necessary data from Firestore,
 * and then "slicing" or filtering that data based on the authenticated user's role and school affiliation.
 * This ensures that each component receives only the data it is authorized to see.
 */
interface SchoolDataContextType {
    /** All school data from Firestore, keyed by school ID. Only populated for GlobalAdmin or for initial data slicing. */
    allSchoolData: Record<string, SchoolData> | null;
    /** A record of parent accounts that have been manually suspended by a Global Admin. */
    parentStatusOverrides: Record<string, 'Active' | 'Suspended'>;
    /** A boolean flag indicating if the system-wide annual awards have been announced. */
    awardsAnnounced: boolean;
    /** A flag indicating if the initial data fetch from Firestore is complete. */
    isLoading: boolean;
    /** The profile of the currently logged-in user's school. Null for GlobalAdmin. */
    schoolProfile: SchoolProfile | null;
    /** An array of students relevant to the current user's role (e.g., a single school's students for an Admin, or a parent's children). */
    studentsData: Student[];
    /** An array of teachers relevant to the current user's role. */
    teachersData: Teacher[];
    /** An array of classes relevant to the current user's role. */
    classesData: Class[];
    coursesData: Course[];
    syllabi: Syllabus[];
    admissionsData: Admission[];
    /** An array of financial records relevant to the current user's role. */
    financeData: FinanceRecord[];
    assetsData: any[];
    examsData: Exam[];
    /** An array of grades relevant to the current user's role. */
    grades: Grade[];
    /** An array of attendance records relevant to the current user's role. */
    attendance: Attendance[];
    /** An array of events relevant to the current user's role. */
    events: Event[];
    expensesData: Expense[];
    teamsData: Team[];
    competitionsData: Competition[];
    kioskMedia: KioskMedia[];
    activityLogs: ActivityLog[];
    messages: Message[];
    savedReports: SavedReport[];
    deployedTests: DeployedTest[];
    savedTests: SavedTest[];
    subjects: string[];
    examBoards: string[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];
    terms: any[];
    holidays: any[];
    /** A record of school groups for Premium Admins. */
    schoolGroups: Record<string, string[]>;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, schoolId: authSchoolId } = useAuth();
  const [data, setData] = useState<Record<string, SchoolData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchoolData = async () => {
        setIsLoading(true);
        try {
            const schoolsCollection = collection(db, 'schools');
            const schoolsSnapshot = await getDocs(schoolsCollection);
            if (schoolsSnapshot.empty) {
                console.log("No schools found, seeding initial data...");
                await seedInitialData();
            }
            const schoolData = await getSchoolsFromFirestore();
            setData(schoolData);
        } catch (error) {
            console.error("Failed to fetch or seed school data.", error);
            setData(null); 
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
  
  // The single source of truth for the CURRENT school's data.
  // It's null if the user is a GlobalAdmin or if data hasn't loaded.
  const schoolData = useMemo(() => {
    if (!data || !currentSchoolId) return null;
    return data[currentSchoolId];
  }, [currentSchoolId, data]);

  // --- Sliced Data Selectors ---
  // These memos correctly slice the data based on the user's role and school affiliation.

  const studentsData = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.students?.map(s => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id })) ?? []);
    if (role === 'Parent' && user?.email) return Object.values(data || {}).flatMap(d => d.students?.map(s => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id })) ?? []).filter(s => s.parentEmail === user.email);
    return schoolData?.students ?? [];
  }, [data, role, user, schoolData]);
  
  const teachersData = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.teachers ?? []);
    return schoolData?.teachers ?? [];
  }, [data, role, schoolData]);

  const classesData = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.classes ?? []);
    return schoolData?.classes ?? [];
  }, [data, role, schoolData]);

  const financeData = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.finance ?? []);
    if (role === 'Parent' && user?.email) {
        const parentStudentIds = Object.values(data || {}).flatMap(d => d.students?.filter(s => s.parentEmail === user.email).map(s => s.id) ?? []);
        return Object.values(data || {}).flatMap(d => d.finance?.filter(f => parentStudentIds.includes(f.studentId)) ?? []);
    }
    return schoolData?.finance ?? [];
  }, [data, role, user, schoolData]);
  
  const grades = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.grades ?? []);
    if (role === 'Parent' && user?.email) {
        const parentStudentIds = Object.values(data || {}).flatMap(d => d.students?.filter(s => s.parentEmail === user.email).map(s => s.id) ?? []);
        return Object.values(data || {}).flatMap(d => d.grades?.filter(g => parentStudentIds.includes(g.studentId)) ?? []);
    }
    return schoolData?.grades ?? [];
  }, [data, role, user, schoolData]);
  
  const attendance = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.attendance ?? []);
    if (role === 'Parent' && user?.email) {
      const parentStudentIds = Object.values(data || {}).flatMap(d => d.students?.filter(s => s.parentEmail === user.email).map(s => s.id) ?? []);
      return Object.values(data || {}).flatMap(d => d.attendance?.filter(a => parentStudentIds.includes(a.studentId)) ?? []);
    }
    return schoolData?.attendance ?? [];
  }, [data, role, user, schoolData]);
  
  const events = useMemo(() => {
    if (!role) return [];
    if (role === 'GlobalAdmin') return Object.values(data || {}).flatMap(d => d.events?.map(e => ({...e, schoolName: d.profile.name})) ?? []);
    // Parents and Students see events from all schools for now
    if (role === 'Parent' || role === 'Student') return Object.values(data || {}).flatMap(d => d.events?.map(e => ({...e, schoolName: d.profile.name})) ?? []);
    return schoolData?.events ?? [];
  }, [schoolData, data, role]);

  // --- Aggregated/Derived Data ---

  const schoolGroups = useMemo(() => {
    if (!data) return {};
    const schoolWithGroups = Object.values(data).find(d => d.profile?.schoolGroups && Object.keys(d.profile.schoolGroups).length > 0);
    return schoolWithGroups?.profile.schoolGroups || {};
  }, [data]);
  
  const awardsAnnounced = useMemo(() => {
    if (!data) return false;
    // Check if any school has an awards array with at least one entry.
    const schoolWithAwards = Object.values(data).find(d => d.profile?.awards && d.profile.awards.length > 0);
    return !!schoolWithAwards;
  }, [data]);
  
  const parentStatusOverrides = {}; // This is a placeholder as the logic for this is not fully implemented

  const value: SchoolDataContextType = {
    isLoading,
    allSchoolData: data,
    parentStatusOverrides,
    awardsAnnounced,
    schoolGroups,
    schoolProfile: schoolData?.profile ?? null,
    studentsData,
    teachersData,
    classesData,
    financeData,
    grades,
    attendance,
    events,
    coursesData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.courses ?? []) : schoolData?.courses ?? [],
    syllabi: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.syllabi ?? []) : schoolData?.syllabi ?? [],
    admissionsData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.admissions ?? []) : schoolData?.admissions ?? [],
    assetsData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.assets ?? []) : schoolData?.assets ?? [],
    examsData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.exams ?? []) : schoolData?.exams ?? [],
    expensesData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.expenses ?? []) : schoolData?.expenses ?? [],
    teamsData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.teams ?? []) : schoolData?.teams ?? [],
    competitionsData: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.competitions ?? []) : schoolData?.competitions ?? [],
    kioskMedia: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.kioskMedia ?? []) : schoolData?.kioskMedia ?? [],
    activityLogs: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.activityLogs ?? []) : schoolData?.activityLogs ?? [],
    messages: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.messages ?? []) : schoolData?.messages ?? [],
    savedReports: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.savedReports ?? []) : schoolData?.savedReports ?? [],
    deployedTests: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.deployedTests ?? []) : schoolData?.deployedTests ?? [],
    savedTests: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.savedTests ?? []) : schoolData?.savedTests ?? [],
    terms: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.terms ?? []) : schoolData?.terms ?? [],
    holidays: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.holidays ?? []) : schoolData?.holidays ?? [],
    lessonPlans: role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.lessonPlans ?? []) : schoolData?.lessonPlans ?? [],
    
    // Dropdown Data - these are usually specific to a school context
    subjects: useMemo(() => {
        const source = (role === 'GlobalAdmin' ? Object.values(data || {}).flatMap(d => d.courses ?? []) : schoolData?.courses) ?? [];
        return [...new Set(source.map(c => c.subject))]
    }, [data, role, schoolData]),
    examBoards: schoolData?.profile?.examBoards ?? (schoolData?.examBoards as any) ?? [],
    feeDescriptions: schoolData?.profile?.feeDescriptions ?? (schoolData?.feeDescriptions as any) ?? [],
    audiences: schoolData?.profile?.audiences ?? (schoolData?.audiences as any) ?? [],
    expenseCategories: schoolData?.profile?.expenseCategories ?? (schoolData?.expenseCategories as any) ?? [],
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
    

    

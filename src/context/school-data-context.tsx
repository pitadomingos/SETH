'use client';
import React, {
  createContext, useContext, useState, ReactNode, useEffect, useMemo,
} from 'react';
import { useAuth, User, Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// ---- Types (unchanged from your file; shortened here to focus on the provider) ----
export interface Subscription { status: 'Paid'|'Overdue'; amount: number; dueDate: string; }
export interface SchoolProfile {
  id: string; name: string; head: string; address: string; phone: string; email: string; motto: string;
  tier: 'Starter'|'Pro'|'Premium';
  logoUrl: string; certificateTemplateUrl: string; transcriptTemplateUrl: string;
  gradingSystem: '20-Point'|'Letter'|'GPA';
  currency: 'USD'|'ZAR'|'MZN'|'BWP'|'NAD'|'ZMW'|'MWK'|'AOA'|'TZS'|'ZWL';
  status: 'Active'|'Suspended'|'Inactive';
  schoolLevel: 'Primary'|'Secondary'|'Full';
  gradeCapacity: Record<string, number>;
  kioskConfig: {
    showDashboard: boolean; showLeaderboard: boolean; showTeacherLeaderboard: boolean; showAllSchools: boolean;
    showAttendance: boolean; showAcademics: boolean; showAwards: boolean; showPerformers: boolean;
    showAwardWinner: boolean; showShowcase: boolean;
  };
  subscription: Subscription;
  awards?: Array<{ year: number; schoolOfTheYear: string; teacherOfTheYear: string; studentOfTheYear: string; }>;
  feeDescriptions: string[];
  audiences: string[];
  expenseCategories: string[];
  examBoards: string[];
  schoolGroups: Record<string, string[]>;
}
export interface Student { id: string; name: string; email: string; phone: string; address: string;
  sex: 'Male'|'Female'; dateOfBirth: string; grade: string; class: string; parentName: string; parentEmail: string;
  status: 'Active'|'Inactive'|'Transferred'; behavioralAssessments: any[]; schoolId?: string; schoolName?: string; }
export interface Teacher { id: string; name: string; email: string; phone: string; address: string;
  sex: 'Male'|'Female'; subject: string; experience: string; qualifications: string;
  status: 'Active'|'Inactive'|'Transferred'; schoolName?: string; schoolId?: string;}
export interface Class { id: string; name: string; grade: string; teacher: string; students: number; room: string; headOfClassId?: string; }
export interface Course { id: string; subject: string; teacherId: string; classId: string; schedule: Array<{day: string; startTime: string; endTime: string; room: string;}>; }
export interface FinanceRecord { id: string; studentId: string; studentName: string; description: string; totalAmount: number; amountPaid: number; dueDate: string; status: 'Paid'|'Partially Paid'|'Pending'|'Overdue'; }
export interface Exam { id: string; title: string; subject: string; grade: string; board: string; date: any; time: string; duration: string; room: string; invigilator: string; }
export interface Grade { id: string; studentId: string; subject: string; grade: string; date: any; type: 'Coursework'|'Test'|'Exam'; description: string; teacherId: string; }
export interface Attendance { id: string; studentId: string; date: any; status: 'Present'|'Late'|'Absent'|'Sick'; courseId: string; }
export interface Event { id: string; title: string; date: any; location: string; organizer: string; audience: string; type: 'Academic'|'Sports'|'Cultural'|'Meeting'|'Holiday'; schoolName?: string; }
export interface Expense { id: string; description: string; category: string; amount: number; date: string; proofUrl: string; type: 'Income'|'Expense'; }
export interface Team { id: string; name: string; icon: string; coach: string; playerIds: string[]; }
export interface Competition { id: string; title: string; ourTeamId: string; opponent: string; date: any; time: string; location: string; result?: { ourScore: number; opponentScore: number; outcome: 'Win'|'Loss'|'Draw'; }; }
export interface KioskMedia { id: string; title: string; description: string; type: 'image'|'video'; url: string; createdAt: Date; }
export interface ActivityLog { id: string; timestamp: any; schoolId: string; user: string; role: Role; action: string; details: string; }
export interface Message { id: string; senderUsername: string; senderName: string; senderRole: string; recipientUsername: string; recipientName: string; recipientRole: string; subject: string; body: string; timestamp: Date; status: 'Pending'|'Resolved'; attachmentUrl?: string; attachmentName?: string; }
export interface SavedReport { id: string; type: 'School-Wide'|'Class'|'Struggling Students'|'Teacher Performance'; title: string; date: Date; generatedBy: string; content: any; }
export interface SavedTest { id: string; teacherId: string; subject: string; topic: string; grade: string; questions: Array<{ question: string; options: string[]; correctAnswer: string; }>; createdAt: Date; }
export interface DeployedTest { id: string; testId: string; classId: string; deadline: any; submissions: Array<{ studentId: string; score: number; submittedAt: Date; }>; }
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
export interface NewMessageData {
    recipientUsername: string;
    subject: string;
    body: string;
    attachmentUrl?: string;
    attachmentName?: string;
}
export interface NewSchoolData {
  name: string;
  head: string;
  address: string;
  phone: string;
  email: string;
  motto?: string;
  tier: 'Starter'|'Pro'|'Premium';
}

export interface SchoolData {
  profile: SchoolProfile;
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  courses: Course[];
  syllabi: any[];
  admissions: any[];
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

interface SchoolDataContextType {
  allSchoolData: Record<string, SchoolData> | null;
  parentStatusOverrides: Record<string, 'Active' | 'Suspended'>;
  awardsAnnounced: boolean;
  isLoading: boolean;
  usedFallback: boolean;

  schoolProfile: SchoolProfile | null;

  studentsData: Student[];
  teachersData: Teacher[];
  classesData: Class[];
  coursesData: Course[];
  syllabi: any[];
  admissionsData: any[];
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
  deployedTests: DeployedTest[];
  savedTests: SavedTest[];

  subjects: string[];
  examBoards: string[];
  feeDescriptions: string[];
  audiences: string[];
  expenseCategories: string[];
  terms: any[];
  holidays: any[];
  lessonPlans: any[];

  schoolGroups: Record<string, string[]>;
  addMessage: (messageData: NewMessageData) => void;
  updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => void;
  updateSchoolProfile: (profileData: Partial<SchoolProfile>, schoolId?: string) => Promise<boolean>;
  removeSchool: (schoolId: string) => void;
  addSchool: (schoolData: SchoolData) => void;
  updateParentStatus: (email: string, status: 'Active' | 'Suspended') => void;
  announceAwards: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, schoolId: authSchoolId } = useAuth();
  const [data, setData] = useState<Record<string, SchoolData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- Robust Firestore bootstrap (idempotent seeding) ----------
  useEffect(() => {
    let cancelled = false;
    const fetchSchoolData = async () => {
      setIsLoading(true);
      try {
        const schoolsCollection = collection(db, 'schools');
        const schoolsSnapshot = await getDocs(schoolsCollection);
        if (schoolsSnapshot.empty) {
          console.log('[SchoolData] No schools found, seeding initial data...');
          await seedInitialData();
        }
        const schoolData = await getSchoolsFromFirestore();
        if (!cancelled) setData(schoolData);
      } catch (error) {
        console.error(
          '[SchoolData] Failed to fetch or seed school data.', error
        );
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSchoolData();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setTimeout(() => console.log('--- Delayed allSchoolData Log:', data), 150);
  }, []);

  // ---------- Derived IDs & source-of-truth for current school ----------
  const [usedFallback, setUsedFallback] = useState(false);

  const currentSchoolId = useMemo(() => {
    if (role === 'GlobalAdmin') {
      setUsedFallback(false);
      return null;
    }

    if (authSchoolId) {
      setUsedFallback(false);
      return authSchoolId;
    }

    const fallbackId = Object.keys(data || {})[0] || null;
    if (fallbackId) {
      setUsedFallback(true);
    }
    return fallbackId;
  }, [authSchoolId, role, data]);


  const schoolData = useMemo(() => {
    if (!data || !currentSchoolId) return null;
    return data[currentSchoolId] ?? null;
  }, [currentSchoolId, data]);

  const aggregate = <T,>(selector: (d: SchoolData) => T[] | undefined): T[] => {
    if (!data) return [];
    return Object.values(data).flatMap(d => selector(d) ?? []);
  };

  const uniq = <T,>(arr: T[]): T[] => [...new Set(arr)];

  const schoolGroups = useMemo(() => {
    if (!data) return {};
    console.log('--- schoolGroups Memo - Data:', data);
    console.log('--- schoolGroups Memo - Role:', role);
    const schoolWithGroups = Object.values(data).find(
      (d) => d.profile?.schoolGroups && Object.keys(d.profile.schoolGroups).length > 0
    );
    return schoolWithGroups?.profile.schoolGroups ?? {};
  }, [data]);

  const awardsAnnounced = useMemo(() => {
    if (!data) return false;
    console.log('--- awardsAnnounced Memo - Data:', data);
    console.log('--- awardsAnnounced Memo - Role:', role);
    const schoolWithAwards = Object.values(data).find((d) => (d.profile?.awards?.length ?? 0) > 0);
    return !!schoolWithAwards;
  }, [data]);

  const studentsData = useMemo(() => {
    console.log('--- studentsData Memo - Data:', data);
    console.log('--- studentsData Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') {
      return aggregate(d => d.students?.map(s => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id })));
    }
    if (role === 'Parent' && user) {
      return aggregate(d => d.students?.filter(s => s.parentEmail === user.email).map(s => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id })));
    }
    if (role === 'Student' && user) {
      return schoolData?.students?.filter(s => s.email === user.email).map(s => ({ ...s, schoolName: schoolData.profile.name, schoolId: schoolData.profile.id })) ?? [];
    }
    return schoolData?.students?.map(s => ({ ...s, schoolName: schoolData.profile.name, schoolId: schoolData.profile.id })) ?? [];
  }, [data, role, user, schoolData]);

  const teachersData = useMemo(() => {
    console.log('--- teachersData Memo - Data:', data);
    console.log('--- teachersData Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') {
      return aggregate(d => d.teachers?.map(t => ({ ...t, schoolName: d.profile.name, schoolId: d.profile.id })));
    }
    return schoolData?.teachers?.map(t => ({ ...t, schoolName: schoolData.profile.name, schoolId: schoolData.profile.id })) ?? [];
  }, [data, role, schoolData]);

  const classesData = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.classes) : schoolData?.classes) ?? [], [data, role, schoolData]);
  const coursesData = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.courses) : schoolData?.courses) ?? [], [data, role, schoolData]);
  const admissionsData = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.admissions) : schoolData?.admissions) ?? [], [data, role, schoolData]);
  const assetsData = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.assets) : schoolData?.assets) ?? [], [data, role, schoolData]);
  const examsData = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.exams) : schoolData?.exams) ?? [], [data, role, schoolData]);
  const expensesData = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.expenses) : schoolData?.expenses) ?? [], [data, role, schoolData]);
  const kioskMedia = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.kioskMedia) : schoolData?.kioskMedia) ?? [], [data, role, schoolData]);
  const activityLogs = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.activityLogs) : schoolData?.activityLogs) ?? [], [data, role, schoolData]);
  const savedReports = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.savedReports) : schoolData?.savedReports) ?? [], [data, role, schoolData]);
  const deployedTests = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.deployedTests) : schoolData?.deployedTests) ?? [], [data, role, schoolData]);
  const savedTests = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.savedTests) : schoolData?.savedTests) ?? [], [data, role, schoolData]);
  const terms = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.terms) : schoolData?.terms) ?? [], [data, role, schoolData]);
  const holidays = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.holidays) : schoolData?.holidays) ?? [], [data, role, schoolData]);
  const lessonPlans = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.lessonPlans) : schoolData?.lessonPlans) ?? [], [data, role, schoolData]);
  const syllabi = useMemo(() => (role === 'GlobalAdmin' ? aggregate(d => d.syllabi) : schoolData?.syllabi) ?? [], [data, role, schoolData]);

  const financeData = useMemo(() => {
    console.log('--- financeData Memo - Data:', data);
    console.log('--- financeData Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.finance);
    if (role === 'Parent' && studentsData.length > 0) {
      const studentIds = studentsData.map(s => s.id);
      return aggregate(d => d.finance?.filter(f => studentIds.includes(f.studentId)));
    }
    return schoolData?.finance ?? [];
  }, [data, role, schoolData, studentsData]);

  const grades = useMemo(() => {
    console.log('--- grades Memo - Data:', data);
    console.log('--- grades Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.grades);
    if (role === 'Parent' && studentsData.length > 0) {
      const studentIds = studentsData.map(s => s.id);
      return aggregate(d => d.grades?.filter(g => studentIds.includes(g.studentId)));
    }
    return schoolData?.grades ?? [];
  }, [data, role, schoolData, studentsData]);

  const attendance = useMemo(() => {
    console.log('--- attendance Memo - Data:', data);
    console.log('--- attendance Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.attendance);
    if (role === 'Parent' && studentsData.length > 0) {
      const studentIds = studentsData.map(s => s.id);
      return aggregate(d => d.attendance?.filter(a => studentIds.includes(a.studentId)));
    }
    return schoolData?.attendance ?? [];
  }, [data, role, schoolData, studentsData]);

  const events = useMemo(() => {
    console.log('--- events Memo - Data:', data);
    console.log('--- events Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.events?.map(e => ({ ...e, schoolName: d.profile.name })));
    if (role === 'Parent' && studentsData.length > 0) {
      const schoolIds = uniq(studentsData.map(s => s.schoolId).filter(Boolean) as string[]);
      return aggregate(d => schoolIds.includes(d.profile.id) ? d.events?.map(e => ({ ...e, schoolName: d.profile.name })) : []);
    }
    return schoolData?.events?.map(e => ({ ...e, schoolName: schoolData.profile.name })) ?? [];
  }, [data, role, schoolData, studentsData]);

  const teamsData = useMemo(() => {
    console.log('--- teamsData Memo - Data:', data);
    console.log('--- teamsData Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.teams);
    if (role === 'Parent' && studentsData.length > 0) {
      const studentIds = studentsData.map(s => s.id);
      return aggregate(d => d.teams?.filter(t => t.playerIds.some(pId => studentIds.includes(pId))));
    }
    return schoolData?.teams ?? [];
  }, [data, role, schoolData, studentsData]);

  const competitionsData = useMemo(() => {
    console.log('--- competitionsData Memo - Data:', data);
    console.log('--- competitionsData Memo - Role:', role);
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.competitions);
    if (role === 'Parent' && teamsData.length > 0) {
      const teamIds = teamsData.map(t => t.id);
      return aggregate(d => d.competitions?.filter(c => teamIds.includes(c.ourTeamId)));
    }
    return schoolData?.competitions ?? [];
  }, [data, role, schoolData, teamsData]);

  const messages = useMemo(() => {
    console.log('--- messages Memo - Data:', data);
    console.log('--- messages Memo - Role:', role);
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return aggregate(d => d.messages);
    return schoolData?.messages?.filter(m => m.recipientUsername === user.email || m.senderUsername === user.email) ?? [];
  }, [data, role, user, schoolData]);

  const subjects = useMemo(() => (role === 'GlobalAdmin' ? uniq(aggregate(d => d.courses).map(c => c.subject)) : uniq((schoolData?.courses ?? []).map(c => c.subject))), [data, role, schoolData]);
  const examBoards = useMemo(() => (role === 'GlobalAdmin' ? uniq(aggregate(d => d.profile?.examBoards)) : (schoolData?.profile.examBoards ?? [])), [data, role, schoolData]);
  const feeDescriptions = useMemo(() => (role === 'GlobalAdmin' ? uniq(aggregate(d => d.profile?.feeDescriptions)) : (schoolData?.profile.feeDescriptions ?? [])), [data, role, schoolData]);
  const audiences = useMemo(() => (role === 'GlobalAdmin' ? uniq(aggregate(d => d.profile?.audiences)) : (schoolData?.profile.audiences ?? [])), [data, role, schoolData]);
  const expenseCategories = useMemo(() => (role === 'GlobalAdmin' ? uniq(aggregate(d => d.profile?.expenseCategories)) : (schoolData?.profile.expenseCategories ?? [])), [data, role, schoolData]);
  

  // ---------- Final value ----------
  const value: SchoolDataContextType = {
    isLoading,
    allSchoolData: data,
    parentStatusOverrides: {},
    awardsAnnounced,
    schoolGroups,
    schoolProfile: schoolData?.profile ?? null,
    usedFallback,

    studentsData, teachersData, classesData, financeData, assetsData, examsData, grades, attendance,
    events, expensesData, teamsData, competitionsData, kioskMedia, activityLogs, messages, savedReports,
    deployedTests, savedTests, coursesData, syllabi, admissionsData,

    subjects, examBoards, feeDescriptions, audiences, expenseCategories, terms, holidays, lessonPlans,

    addMessage: (messageData: NewMessageData) => console.log('addMessage', messageData),
    updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => console.log('updateSchoolStatus', schoolId, status),
    updateSchoolProfile: async (profileData: Partial<SchoolProfile>, schoolId?: string) => { console.log('updateSchoolProfile', schoolId, profileData); return true; },
    removeSchool: (schoolId: string) => console.log('removeSchool', schoolId),
    addSchool: (schoolData: SchoolData) => console.log('addSchool', schoolData),
    updateParentStatus: (email: string, status: 'Active' | 'Suspended') => console.log('updateParentStatus', email, status),
    announceAwards: () => console.log('announceAwards'),
  };

  return <SchoolDataContext.Provider value={value}>{children}</SchoolDataContext.Provider>;
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (context === undefined) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};

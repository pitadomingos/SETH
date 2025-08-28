
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
        console.error('[SchoolData] Failed to fetch or seed school data.', error);
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchSchoolData();
    return () => { cancelled = true; };
  }, []);

  // ---------- Derived IDs & source-of-truth for current school ----------
  const currentSchoolId = useMemo(() => (role === 'GlobalAdmin' ? null : authSchoolId), [authSchoolId, role]);

  const schoolData = useMemo(() => {
    if (!data || !currentSchoolId) return null;
    return data[currentSchoolId] ?? null;
  }, [currentSchoolId, data]);

  // ---------- Utilities ----------
  const getAggregatedSchoolData = <T,>(selector: (d: SchoolData) => T[] | undefined): T[] => {
    if (role === 'GlobalAdmin') {
      return Object.values(data || {}).flatMap(d => selector(d) ?? []);
    }
    return schoolData ? selector(schoolData) ?? [] : [];
  };

  const getUnionSchoolData = <T,>(selector: (d: SchoolData) => T[] | undefined): T[] => {
      if (role === 'GlobalAdmin') {
        const allItems = Object.values(data || {}).flatMap(d => selector(d) ?? []);
        return [...new Set(allItems)];
      }
      return schoolData ? selector(schoolData) ?? [] : [];
  };


  // ---------- High-level cross-tenant meta ----------
  const schoolGroups = useMemo(() => {
    if (!data) return {};
    const schoolWithGroups = Object.values(data).find(
      (d) => d.profile?.schoolGroups && Object.keys(d.profile.schoolGroups).length > 0
    );
    return schoolWithGroups?.profile.schoolGroups ?? {};
  }, [data]);

  const awardsAnnounced = useMemo(() => {
    if (!data) return false;
    const schoolWithAwards = Object.values(data).find((d) => (d.profile?.awards?.length ?? 0) > 0);
    return !!schoolWithAwards;
  }, [data]);

  // ---------- Role-aware slices (robust, null-safe, minimal guards) ----------
  const studentsData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') {
      return Object.values(data).flatMap((d) =>
        d.students?.map((s) => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id })) ?? []
      );
    }
    if (role === 'Parent' && user) {
      return Object.values(data).flatMap((d) =>
        (d.students ?? [])
          .map((s) => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id }))
          .filter((s) => s.parentEmail === user.email)
      );
    }
    return schoolData?.students ?? [];
  }, [data, role, user, schoolData]);

  const teachersData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') {
       return Object.values(data).flatMap((d) =>
        d.teachers?.map((t) => ({ ...t, schoolName: d.profile.name, schoolId: d.profile.id })) ?? []
      );
    }
    return schoolData?.teachers ?? [];
  }, [data, role, schoolData]);
  
  const financeData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.finance);
    if (role === 'Parent' && user) {
      const parentStudentIds = studentsData.map((s) => s.id);
      return Object.values(data || {}).flatMap((d) => d.finance?.filter((f) => parentStudentIds.includes(f.studentId)) ?? []);
    }
    return schoolData?.finance ?? [];
  }, [data, role, user, schoolData, studentsData]);

  const grades = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.grades);
    if (role === 'Parent' && user) {
      const parentStudentIds = studentsData.map((s) => s.id);
      return Object.values(data || {}).flatMap((d) => d.grades?.filter((g) => parentStudentIds.includes(g.studentId)) ?? []);
    }
    return schoolData?.grades ?? [];
  }, [data, role, user, schoolData, studentsData]);
  
  const attendance = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.attendance);
    if (role === 'Parent' && user) {
      const parentStudentIds = studentsData.map((s) => s.id);
      return Object.values(data || {}).flatMap((d) => d.attendance?.filter((a) => parentStudentIds.includes(a.studentId)) ?? []);
    }
    return schoolData?.attendance ?? [];
  }, [data, role, user, schoolData, studentsData]);

  const events = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'Parent' || role === 'Student') {
      return Object.values(data || {}).flatMap((d) => d.events?.map((e) => ({ ...e, schoolName: d.profile.name })) ?? []);
    }
    return getAggregatedSchoolData(d => d.events?.map(e => ({...e, schoolName: d.profile.name})));
  }, [data, role, schoolData]);

  const teamsData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'Parent' && user) {
      const parentStudentIds = studentsData.map((s) => s.id);
      return Object.values(data || {}).flatMap((d) => d.teams?.filter((t) => t.playerIds.some((pId) => parentStudentIds.includes(pId))) ?? []);
    }
    return getAggregatedSchoolData(d => d.teams);
  }, [data, role, user, schoolData, studentsData]);

  const competitionsData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'Parent' && user) {
      const parentTeamIds = teamsData.map((t) => t.id);
      return Object.values(data || {}).flatMap((d) => d.competitions?.filter((c) => parentTeamIds.includes(c.ourTeamId)) ?? []);
    }
    return getAggregatedSchoolData(d => d.competitions);
  }, [data, role, user, schoolData, teamsData]);

  const classesData = useMemo(() => getAggregatedSchoolData(d => d.classes), [data, role, schoolData]);
  const coursesData = useMemo(() => getAggregatedSchoolData(d => d.courses), [data, role, schoolData]);
  const syllabi = useMemo(() => getAggregatedSchoolData(d => d.syllabi), [data, role, schoolData]);
  const admissionsData = useMemo(() => getAggregatedSchoolData(d => d.admissions), [data, role, schoolData]);
  const assetsData = useMemo(() => getAggregatedSchoolData(d => d.assets), [data, role, schoolData]);
  const examsData = useMemo(() => getAggregatedSchoolData(d => d.exams), [data, role, schoolData]);
  const expensesData = useMemo(() => getAggregatedSchoolData(d => d.expenses), [data, role, schoolData]);
  const kioskMedia = useMemo(() => getAggregatedSchoolData(d => d.kioskMedia), [data, role, schoolData]);
  const activityLogs = useMemo(() => getAggregatedSchoolData(d => d.activityLogs), [data, role, schoolData]);
  const messages = useMemo(() => getAggregatedSchoolData(d => d.messages), [data, role, schoolData]);
  const savedReports = useMemo(() => getAggregatedSchoolData(d => d.savedReports), [data, role, schoolData]);
  const deployedTests = useMemo(() => getAggregatedSchoolData(d => d.deployedTests), [data, role, schoolData]);
  const savedTests = useMemo(() => getAggregatedSchoolData(d => d.savedTests), [data, role, schoolData]);
  const terms = useMemo(() => getAggregatedSchoolData(d => d.terms), [data, role, schoolData]);
  const holidays = useMemo(() => getAggregatedSchoolData(d => d.holidays), [data, role, schoolData]);
  const lessonPlans = useMemo(() => getAggregatedSchoolData(d => d.lessonPlans), [data, role, schoolData]);

  // ---------- Dropdown unions (GA) with profile/top-level fallbacks ----------
  const subjects = useMemo(() => {
    return getUnionSchoolData(d => d.courses?.map(c => c.subject));
  }, [data, role, schoolData]);

  const examBoards = useMemo(() => {
    return getUnionSchoolData(d => d.profile?.examBoards ?? d.examBoards);
  }, [data, role, schoolData]);

  const feeDescriptions = useMemo(() => {
    return getUnionSchoolData(d => d.profile?.feeDescriptions ?? d.feeDescriptions);
  }, [data, role, schoolData]);

  const audiences = useMemo(() => {
    return getUnionSchoolData(d => d.profile?.audiences ?? d.audiences);
  }, [data, role, schoolData]);

  const expenseCategories = useMemo(() => {
    return getUnionSchoolData(d => d.profile?.expenseCategories ?? d.expenseCategories);
  }, [data, role, schoolData]);

  // ---------- Final value ----------
  const value: SchoolDataContextType = {
    isLoading,
    allSchoolData: data,
    parentStatusOverrides: {}, // still a placeholder
    awardsAnnounced,
    schoolGroups,
    schoolProfile: schoolData?.profile ?? null,

    studentsData,
    teachersData,
    classesData,
    financeData,
    assetsData,
    examsData,
    grades,
    attendance,

    events,
    expensesData,
    teamsData,
    competitionsData,
    kioskMedia,
    activityLogs,
    messages,

    savedReports,
    deployedTests,
    savedTests,
    coursesData,
    syllabi,
    admissionsData,

    subjects,
    examBoards,
    feeDescriptions,
    audiences,
    expenseCategories,
    terms,
    holidays,
    lessonPlans,
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

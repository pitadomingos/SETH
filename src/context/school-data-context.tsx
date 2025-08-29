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

    // ✅ fallback: if no schoolId in auth, use the first available school from Firestore
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

  // ---------- Helper functions for aggregation (can be kept or inlined) ----------
  // These helpers are good for general aggregation, but specific role logic will override/filter them.
  const getAggregatedSchoolData = <T,>(selector: (d: SchoolData) => T[] | undefined): T[] => {
    if (!data) return [];
    return Object.values(data).flatMap(d => selector(d) ?? []);
  };

  const getUnionSchoolData = <T,>(selector: (d: SchoolData) => T[] | undefined): T[] => {
      if (!data) return [];
      const allItems = Object.values(data).flatMap(d => selector(d) ?? []);
      return [...new Set(allItems)];
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

  // ---------- Role-aware slices (robust, null-safe, with explicit role logic) ----------

  // **Students Data**
  const studentsData = useMemo(() => {
    if (!data || !role || !user) return []; // user is essential for Parent/Student roles

    if (role === 'GlobalAdmin') {
      return Object.values(data).flatMap((d) =>
        d.students?.map((s) => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id })) ?? []
      );
    }

    if (role === 'Parent') {
      // Parents see their children across all schools
      return Object.values(data).flatMap((d) =>
        (d.students ?? [])
          .filter((s) => s.parentEmail === user.email)
          .map((s) => ({ ...s, schoolName: d.profile.name, schoolId: d.profile.id }))
      );
    }

    if (role === 'Student') {
      // A student sees only themselves from their authenticated school
      return schoolData?.students?.filter((s) => s.email === user.email)
        .map((s) => ({ ...s, schoolName: schoolData.profile.name, schoolId: schoolData.profile.id })) ?? [];
    }

    // Default for SchoolAdmin, Teacher, Kiosk (current school only)
    return schoolData?.students?.map((s) => ({ ...s, schoolName: schoolData.profile.name, schoolId: schoolData.profile.id })) ?? [];
  }, [data, role, user, schoolData]);


  // **Teachers Data**
  const teachersData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') {
       return Object.values(data).flatMap((d) =>
        d.teachers?.map((t) => ({ ...t, schoolName: d.profile.name, schoolId: d.profile.id })) ?? []
      );
    }
    // No specific cross-school aggregation for Parents/Students for teachers, they see current school's teachers
    // unless they are also a teacher in another school, which auth-context handles.
    return schoolData?.teachers?.map((t) => ({ ...t, schoolName: schoolData.profile.name, schoolId: schoolData.profile.id })) ?? [];
  }, [data, role, schoolData]);
  
  // **Finance Data**
  const financeData = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.finance);
    if (role === 'Parent') {
      const parentStudentIds = studentsData.map((s) => s.id);
      // Parents see finance records for their children across all schools
      return Object.values(data).flatMap((d) => d.finance?.filter((f) => parentStudentIds.includes(f.studentId)) ?? []);
    }
    if (role === 'Student') {
      // Student sees their own finance records from their current school
      return schoolData?.finance?.filter((f) => f.studentId === studentsData[0]?.id) ?? []; // Assuming first student in studentsData is the current user if role is Student
    }
    return schoolData?.finance ?? []; // SchoolAdmin, Teacher, Kiosk
  }, [data, role, user, schoolData, studentsData]);

  // **Grades Data**
  const grades = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.grades);
    if (role === 'Parent') {
      const parentStudentIds = studentsData.map((s) => s.id);
      // Parents see grades for their children across all schools
      return Object.values(data).flatMap((d) => d.grades?.filter((g) => parentStudentIds.includes(g.studentId)) ?? []);
    }
    if (role === 'Student') {
      // Student sees their own grades from their current school
      return schoolData?.grades?.filter((g) => g.studentId === studentsData[0]?.id) ?? [];
    }
    return schoolData?.grades ?? []; // SchoolAdmin, Teacher, Kiosk
  }, [data, role, user, schoolData, studentsData]);
  
  // **Attendance Data**
  const attendance = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.attendance);
    if (role === 'Parent') {
      const parentStudentIds = studentsData.map((s) => s.id);
      // Parents see attendance for their children across all schools
      return Object.values(data).flatMap((d) => d.attendance?.filter((a) => parentStudentIds.includes(a.studentId)) ?? []);
    }
    if (role === 'Student') {
      // Student sees their own attendance from their current school
      return schoolData?.attendance?.filter((a) => a.studentId === studentsData[0]?.id) ?? [];
    }
    return schoolData?.attendance ?? []; // SchoolAdmin, Teacher, Kiosk
  }, [data, role, user, schoolData, studentsData]);

  // **Events Data**
  const events = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') {
      // GlobalAdmin sees all events from all schools
      return getAggregatedSchoolData(d => d.events?.map(e => ({...e, schoolName: d.profile.name})));
    }
    if (role === 'Parent') {
      // Parents see events from all schools that their children attend, or public events.
      const parentSchoolIds = [...new Set(studentsData.map(s => s.schoolId))].filter(Boolean) as string[];
      return Object.values(data)
        .filter(d => parentSchoolIds.includes(d.profile.id))
        .flatMap((d) => d.events?.map((e) => ({ ...e, schoolName: d.profile.name })) ?? []);
    }
    if (role === 'Student') {
      // Students see events from their own school, possibly filtered by audience (e.g., their grade/class)
      return schoolData?.events?.map(e => ({...e, schoolName: schoolData.profile.name})) ?? [];
    }
    // Default for SchoolAdmin, Teacher, Kiosk (current school only)
    return schoolData?.events?.map(e => ({...e, schoolName: schoolData.profile.name})) ?? [];
  }, [data, role, user, schoolData, studentsData]);

  // **Teams Data**
  const teamsData = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.teams);
    if (role === 'Parent') {
      const parentStudentIds = studentsData.map((s) => s.id);
      // Parents see teams that their children are part of, across all schools
      return Object.values(data).flatMap((d) => d.teams?.filter((t) => t.playerIds.some((pId) => parentStudentIds.includes(pId))) ?? []);
    }
    if (role === 'Student') {
      // Student sees teams they are part of, from their current school
      const currentStudentId = studentsData[0]?.id;
      return schoolData?.teams?.filter((t) => t.playerIds.includes(currentStudentId)) ?? [];
    }
    return schoolData?.teams ?? []; // SchoolAdmin, Teacher, Kiosk
  }, [data, role, user, schoolData, studentsData]);

  // **Competitions Data**
  const competitionsData = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.competitions);
    if (role === 'Parent') {
      const parentTeamIds = teamsData.map((t) => t.id);
      // Parents see competitions involving their children's teams, across all schools
      return Object.values(data).flatMap((d) => d.competitions?.filter((c) => parentTeamIds.includes(c.ourTeamId)) ?? []);
    }
    if (role === 'Student') {
      // Student sees competitions their teams are part of, from their current school
      const studentTeamIds = teamsData.map(t => t.id); // teamsData is already filtered for the student
      return schoolData?.competitions?.filter(c => studentTeamIds.includes(c.ourTeamId)) ?? [];
    }
    return schoolData?.competitions ?? []; // SchoolAdmin, Teacher, Kiosk
  }, [data, role, user, schoolData, teamsData]);


  // **General School-Specific Data (Classes, Courses, Exams, etc.)**
  // These typically should remain scoped to the `currentSchoolId` for non-GlobalAdmin roles.
  // The `getAggregatedSchoolData` helper now just gets ALL data, and we wrap it with role logic.
  const classesData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.classes);
    // Student/Parent/Teacher only see classes from their current school.
    return schoolData?.classes ?? [];
  }, [data, role, schoolData]);

  const coursesData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.courses);
    return schoolData?.courses ?? [];
  }, [data, role, schoolData]);

  const syllabi = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.syllabi);
    return schoolData?.syllabi ?? [];
  }, [data, role, schoolData]);

  const admissionsData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.admissions);
    return schoolData?.admissions ?? [];
  }, [data, role, schoolData]);

  const assetsData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.assets);
    return schoolData?.assets ?? [];
  }, [data, role, schoolData]);

  const examsData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.exams);
    return schoolData?.exams ?? [];
  }, [data, role, schoolData]);

  const expensesData = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.expenses);
    return schoolData?.expenses ?? [];
  }, [data, role, schoolData]);

  const kioskMedia = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.kioskMedia);
    return schoolData?.kioskMedia ?? [];
  }, [data, role, schoolData]);

  const activityLogs = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.activityLogs);
    return schoolData?.activityLogs ?? [];
  }, [data, role, schoolData]);

  const messages = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.messages);
    // Messages are usually recipient-specific, so filter by user email/ID
    return schoolData?.messages?.filter(m => m.recipientUsername === user.email || m.senderUsername === user.email) ?? [];
  }, [data, role, user, schoolData]);

  const savedReports = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.savedReports);
    // Saved reports are usually for school admins/teachers, scoped to current school
    return schoolData?.savedReports ?? [];
  }, [data, role, schoolData]);

  const deployedTests = useMemo(() => {
    if (!data || !role || !user) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.deployedTests);
    if (role === 'Student') {
      const currentStudentId = studentsData[0]?.id;
      return schoolData?.deployedTests?.filter(dt => dt.submissions.some(s => s.studentId === currentStudentId)) ?? [];
    }
    return schoolData?.deployedTests ?? [];
  }, [data, role, user, schoolData, studentsData]);

  const savedTests = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.savedTests);
    return schoolData?.savedTests ?? [];
  }, [data, role, schoolData]);

  const terms = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.terms);
    return schoolData?.terms ?? [];
  }, [data, role, schoolData]);

  const holidays = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.holidays);
    return schoolData?.holidays ?? [];
  }, [data, role, schoolData]);

  const lessonPlans = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getAggregatedSchoolData(d => d.lessonPlans);
    return schoolData?.lessonPlans ?? [];
  }, [data, role, schoolData]);


  // ---------- Dropdown unions (GA) with profile/top-level fallbacks ----------
  const subjects = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getUnionSchoolData(d => d.courses?.map(c => c.subject));
    return [...new Set(schoolData?.courses?.map(c => c.subject) ?? [])];
  }, [data, role, schoolData]);

  const examBoards = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getUnionSchoolData(d => d.profile?.examBoards ?? d.examBoards);
    return [...new Set(schoolData?.profile?.examBoards ?? schoolData?.examBoards ?? [])];
  }, [data, role, schoolData]);

  const feeDescriptions = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getUnionSchoolData(d => d.profile?.feeDescriptions ?? d.feeDescriptions);
    return [...new Set(schoolData?.profile?.feeDescriptions ?? schoolData?.feeDescriptions ?? [])];
  }, [data, role, schoolData]);

  const audiences = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getUnionSchoolData(d => d.profile?.audiences ?? d.audiences);
    return [...new Set(schoolData?.profile?.audiences ?? schoolData?.audiences ?? [])];
  }, [data, role, schoolData]);

  const expenseCategories = useMemo(() => {
    if (!data || !role) return [];
    if (role === 'GlobalAdmin') return getUnionSchoolData(d => d.profile?.expenseCategories ?? d.expenseCategories);
    return [...new Set(schoolData?.profile?.expenseCategories ?? schoolData?.expenseCategories ?? [])];
  }, [data, role, schoolData]);

  // ---------- Final value ----------
  const value: SchoolDataContextType = {
    isLoading,
    allSchoolData: data,
    parentStatusOverrides: {}, // still a placeholder
    awardsAnnounced,
    schoolGroups,
    schoolProfile: schoolData?.profile ?? null,
    usedFallback,

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

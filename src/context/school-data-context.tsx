
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { 
    schoolData as initialSchoolData, 
    schoolGroups as initialSchoolGroups,
    FinanceRecord as InitialFinanceRecord, 
    Grade as InitialGrade, 
    Student, 
    Teacher, 
    Class as InitialClass, 
    Admission, 
    Asset, 
    SchoolProfile as InitialSchoolProfile, 
    Expense, 
    Team, 
    Competition as InitialCompetition,
    SchoolEvent,
    AcademicTerm,
    Holiday,
    Course as InitialCourse,
    LessonPlan,
    Syllabus as InitialSyllabus,
    SyllabusTopic,
    SavedTest,
    DeployedTest,
    ActivityLog,
    Message,
    Attendance,
    BehavioralAssessment as InitialBehavioralAssessment,
    SavedReport as InitialSavedReport,
    AwardConfig as InitialAwardConfig,
    KioskMedia,
    mockUsers
} from '@/lib/mock-data';
import { type User, type Role, useAuth } from './auth-context';
import { CreateLessonPlanOutput } from '@/ai/flows/create-lesson-plan';
import { GenerateTestOutput } from '@/ai/flows/generate-test';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';


export type FinanceRecord = InitialFinanceRecord;
export type Grade = InitialGrade;
export type SchoolProfile = InitialSchoolProfile;
export type Class = InitialClass;
export type Course = InitialCourse;
export type Competition = InitialCompetition;
export type SavedReport = InitialSavedReport;
export type AwardConfig = InitialAwardConfig;
export type BehavioralAssessment = InitialBehavioralAssessment;
export type Syllabus = InitialSyllabus;
export type { Team, Admission, Student, ActivityLog, Message, Teacher, Attendance, Holiday, KioskMedia };

interface NewClassData { name: string; grade: string; teacher: string; students: number; room: string; }
interface NewFeeData { studentId: string; description: string; totalAmount: number; dueDate: string; }
interface NewGradeData { studentId: string; subject: string; grade: string; }
interface NewExpenseData { description: string; category: string; amount: number; date: string; proofUrl: string; }
interface NewTeamData { name: string; coach: string; icon: string; }
interface NewCompetitionData { title: string; ourTeamId: string; opponent: string; date: Date; time: string; location: string; }
interface NewEventData { title: string; date: Date; location: string; organizer: string; audience: string; type: string; }
interface NewTermData { name: string; startDate: Date; endDate: Date; }
interface NewHolidayData { name: string; date: Date; }
export interface NewCourseData { subject: string; teacherId: string; classId: string; schedule: Array<{ day: string; startTime: string; endTime: string; room: string; }>; }
export interface NewLessonPlanData { className: string; subject: string; weeklySyllabus: string; weeklyPlan: CreateLessonPlanOutput['weeklyPlan']; }
export interface NewSavedTest extends GenerateTestOutput { subject: string; topic: string; gradeLevel: string; }
export interface NewAdmissionData {
  schoolId: string;
  name: string;
  dateOfBirth: string;
  appliedFor: string;
  sex: 'Male' | 'Female';
  formerSchool: string;
  gradesSummary: string;
}
export interface NewDeployedTestData { testId: string; classId: string; deadline: Date; }
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
    tier: 'Starter' | 'Pro' | 'Premium';
}
export interface NewBehavioralAssessmentData {
    studentId: string;
    teacherId: string;
    respect: number;
    participation: number;
    socialSkills: number;
    conduct: number;
    comment?: string;
}
export interface NewSyllabusData { subject: string; grade: string; }


interface SchoolDataContextType {
  schoolProfile: SchoolProfile | null;
  updateSchoolProfile: (data: Partial<SchoolProfile>, schoolId?: string) => void;
  allSchoolData: typeof initialSchoolData | null;
  schoolGroups: typeof initialSchoolGroups | null;
  addSchool: (data: NewSchoolData, groupId?: string) => Promise<void>;
  updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => void;
  studentsData: Student[];
  addStudentFromAdmission: (admission: Admission) => void;
  updateStudentStatus: (schoolId: string, studentId: string, status: Student['status']) => void;
  addBehavioralAssessment: (data: NewBehavioralAssessmentData) => void;
  teachersData: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'status'>) => void;
  updateTeacher: (teacherId: string, data: Partial<Omit<Teacher, 'id' | 'status'>>) => void;
  updateTeacherStatus: (schoolId: string, teacherId: string, status: Teacher['status']) => void;
  classesData: Class[];
  addClass: (classData: NewClassData) => void;
  admissionsData: Admission[];
  addAdmission: (data: NewAdmissionData) => void;
  updateApplicationStatus: (id: string, status: Admission['status']) => void;
  examsData: any[];
  financeData: FinanceRecord[];
  recordPayment: (feeId: string, amount: number) => void;
  addFee: (data: NewFeeData) => void;
  assetsData: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  assignments: any[];
  grades: Grade[];
  addGrade: (data: NewGradeData) => void;
  attendance: Attendance[];
  addLessonAttendance: (courseId: string, date: string, attendanceData: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => void;
  events: SchoolEvent[];
  addEvent: (data: NewEventData) => void;
  announceAwards: () => void;
  awardConfig: AwardConfig | null;
  updateAwardConfig: (config: AwardConfig) => void;
  coursesData: Course[];
  addCourse: (data: NewCourseData) => void;
  syllabi: Syllabus[];
  addSyllabus: (data: NewSyllabusData) => void;
  updateSyllabusTopic: (subject: string, grade: string, topic: SyllabusTopic) => void;
  deleteSyllabusTopic: (subject: string, grade: string, topicId: string) => void;
  subjects: string[];
  addSubject: (subject: string) => void;
  examBoards: string[];
  addExamBoard: (board: string) => void;
  deleteExamBoard: (board: string) => void;
  feeDescriptions: string[];
  addFeeDescription: (description: string) => void;
  deleteFeeDescription: (description: string) => void;
  audiences: string[];
  addAudience: (audience: string) => void;
  deleteAudience: (audience: string) => void;
  expenseCategories: string[];
  expensesData: Expense[];
  addExpense: (data: NewExpenseData) => void;
  teamsData: Team[];
  addTeam: (data: NewTeamData) => void;
  deleteTeam: (teamId: string) => void;
  addPlayerToTeam: (teamId: string, studentId: string) => void;
  removePlayerFromTeam: (teamId: string, studentId: string) => void;
  competitionsData: Competition[];
  addCompetition: (data: NewCompetitionData) => void;
  addCompetitionResult: (competitionId: string, scores: { ourScore: number, opponentScore: number }) => void;
  terms: AcademicTerm[];
  addTerm: (data: NewTermData) => void;
  holidays: Holiday[];
  addHoliday: (data: NewHolidayData) => void;
  lessonPlans: LessonPlan[];
  addLessonPlan: (data: NewLessonPlanData) => void;
  savedTests: SavedTest[];
  addSavedTest: (data: NewSavedTest) => void;
  deleteSavedTest: (testId: string) => void;
  deployedTests: DeployedTest[];
  addDeployedTest: (data: NewDeployedTestData) => void;
  activityLogs: ActivityLog[];
  messages: Message[];
  addMessage: (data: NewMessageData) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  parentStatusOverrides: Record<string, 'Active' | 'Suspended'>;
  updateParentStatus: (email: string, status: 'Active' | 'Suspended') => void;
  savedReports: SavedReport[];
  addSavedReport: (report: Omit<SavedReport, 'id' | 'generatedAt'>) => void;
  kioskMedia: KioskMedia[];
  addKioskMedia: (media: Omit<KioskMedia, 'id' | 'createdAt'>) => void;
  removeKioskMedia: (mediaId: string) => void;
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialAwardConfig: AwardConfig = {
    topSchool: [
        { description: '$5,000 Technology Grant', hasCertificate: true },
        { description: '$2,500 Library Fund', hasCertificate: true },
        { description: 'Set of 20 New Laptops', hasCertificate: true },
    ],
    topStudent: [
        { description: 'Full Scholarship for Next Year', hasCertificate: true },
        { description: 'New MacBook Pro', hasCertificate: true },
        { description: 'Summer Internship Opportunity', hasCertificate: true },
    ],
    topTeacher: [
        { description: '$1,000 Professional Development Grant', hasCertificate: true },
        { description: 'All-Expenses Paid Conference Trip', hasCertificate: true },
        { description: 'Classroom Technology Upgrade', hasCertificate: true },
    ],
};

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { user, role } = useAuth();

  const [allSchoolData, setAllSchoolData] = useState<typeof initialSchoolData | null>(null);
  const [schoolGroups, setSchoolGroups] = useState(() => JSON.parse(JSON.stringify(initialSchoolGroups)));
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>(['Internal', 'Cambridge', 'IB', 'State Board', 'Advanced Placement']);
  const [feeDescriptions, setFeeDescriptions] = useState<string[]>([]);
  const [audiences, setAudiences] = useState<string[]>([]);
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
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [deployedTests, setDeployedTests] = useState<DeployedTest[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [kioskMedia, setKioskMedia] = useState<KioskMedia[]>([]);
  const [awardConfig, setAwardConfig] = useState<AwardConfig>(() => JSON.parse(JSON.stringify(initialAwardConfig)));
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading data from a persistent source like a database
    // For the prototype, we load directly from the mock file
    // The JSON stringify/parse is a deep copy to prevent mutations from affecting the original object
    setAllSchoolData(JSON.parse(JSON.stringify(initialSchoolData)));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // This effect runs whenever the logged-in user or the full dataset changes.
    // It's responsible for slicing the data to only what the current user should see.
    if (!user || !allSchoolData) {
      return;
    }
    
    setIsLoading(true);
    try {
        const schoolId = user?.schoolId;
        const isPremiumAdmin = role === 'Admin' && schoolId && Object.values(schoolGroups).some(g => g.includes(schoolId));

        if (role === 'GlobalAdmin') {
          // Global Admins see data from all schools or their group, so we set their specific slices.
          setSchoolProfile(null); 
          setActivityLogs(Object.values(allSchoolData).flatMap(s => s.activityLogs.map(log => ({ ...log, timestamp: new Date(log.timestamp) }))));
          setMessages(Object.values(allSchoolData).flatMap(s => s.messages.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }))));
        } else if (role === 'Parent' && user?.email) {
          // Parents see data aggregated from all schools their children attend.
          const parentEmail = user.email;
          const childrenSchools = new Set<string>();
          const relevantStudents = Object.values(allSchoolData).flatMap(school => 
              school.students.filter(s => s.parentEmail === parentEmail)
              .map(s => {
                  childrenSchools.add(school.profile.id);
                  return { ...s, schoolName: school.profile.name, schoolId: school.profile.id };
              })
          );
      
          const schoolIdsArray = Array.from(childrenSchools);
          const relevantData = schoolIdsArray.reduce((acc, currentSchoolId) => {
              const school = allSchoolData[currentSchoolId];
              if (!school) return acc;
              // Aggregate data from each relevant school
              acc.grades.push(...school.grades.map(g => ({ ...g, date: new Date(g.date) })));
              acc.attendance.push(...school.attendance.map(a => ({...a})));
              acc.finance.push(...school.finance);
              acc.events.push(...school.events.map(e => ({ ...e, schoolName: school.profile.name, date: new Date(e.date) })));
              acc.teams.push(...school.teams);
              acc.competitions.push(...school.competitions.map(c => ({ ...c, date: new Date(c.date) })));
              acc.messages.push(...school.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
              acc.teachers.push(...school.teachers);
              acc.classes.push(...school.classes);
              acc.courses.push(...school.courses);
              return acc;
          }, { grades: [] as Grade[], attendance: [] as Attendance[], finance: [] as FinanceRecord[], events: [] as SchoolEvent[], teams: [] as Team[], competitions: [] as Competition[], messages: [] as Message[], teachers: [] as Teacher[], classes: [] as Class[], courses: [] as Course[] });
      
          setStudentsData(relevantStudents.map(s => ({...s, behavioralAssessments: s.behavioralAssessments.map(b => ({...b, date: new Date(b.date)}))})));
          setGrades(relevantData.grades);
          setAttendance(relevantData.attendance);
          setFinanceData(relevantData.finance);
          setEvents(relevantData.events);
          setTeamsData(relevantData.teams);
          setCompetitionsData(relevantData.competitions);
          setMessages(relevantData.messages);
          setTeachersData(relevantData.teachers);
          setClassesData(relevantData.classes);
          setCoursesData(relevantData.courses);
          
          // Set profile to the first child's school for context, can be enhanced later
          if (relevantStudents.length > 0 && schoolIdsArray.length > 0 && allSchoolData[schoolIdsArray[0]]) {
            setSchoolProfile(allSchoolData[schoolIdsArray[0]].profile);
          } else {
            setSchoolProfile(null);
          }
        } else if (schoolId && allSchoolData[schoolId]) {
          // Regular users (Admin, Teacher, Student) and Premium Admins for their own school context
          const data = allSchoolData[schoolId];
          setSchoolProfile(data.profile);
          setStudentsData(data.students.map(s => ({ ...s, behavioralAssessments: s.behavioralAssessments.map(b => ({ ...b, date: new Date(b.date) })) })));
          setTeachersData(data.teachers);
          setClassesData(data.classes);
          setCoursesData(data.courses);
          setAdmissionsData(data.admissions);
          setFinanceData(data.finance);
          setGrades(data.grades.map(g => ({ ...g, date: new Date(g.date) })));
          setAttendance(data.attendance);
          setExpensesData(data.expenses);
          setExpenseCategories(data.expenseCategories);
          setTeamsData(data.teams);
          setCompetitionsData(data.competitions.map(c => ({...c, date: new Date(c.date)})));
          setEvents(data.events.map(e => ({...e, date: new Date(e.date)})));
          setTerms(data.terms.map(t => ({...t, startDate: new Date(t.startDate), endDate: new Date(t.endDate)})));
          setHolidays(data.holidays.map(h => ({...h, date: new Date(h.date)})));
          setLessonPlans(data.lessonPlans.map(lp => ({...lp, createdAt: new Date(lp.createdAt)})));
          setSyllabi(data.syllabi);
          setSavedTests(data.savedTests.map(st => ({...st, createdAt: new Date(st.createdAt)})));
          setDeployedTests(data.deployedTests.map(dt => ({...dt, createdAt: new Date(dt.createdAt), deadline: new Date(dt.deadline), submissions: dt.submissions.map(s => ({ ...s, submittedAt: new Date(s.submittedAt) })) })));
          setActivityLogs(data.activityLogs.map(log => ({...log, timestamp: new Date(log.timestamp)})));
          setMessages(data.messages.map(msg => ({...msg, timestamp: new Date(msg.timestamp)})));
          setSavedReports(data.savedReports.map(r => ({...r, generatedAt: new Date(r.generatedAt)})));
          setSubjects([...new Set(data.teachers.map(t => t.subject))].sort());
          setFeeDescriptions(data.feeDescriptions);
          setAudiences(data.audiences);
          setKioskMedia(data.kioskMedia.map(km => ({...km, createdAt: new Date(km.createdAt)})));
        } else if (isPremiumAdmin && schoolId && allSchoolData[schoolId]) {
          // Special handling for premium admin dashboard, loading their own school's profile
          const data = allSchoolData[schoolId];
          setSchoolProfile(data.profile);
        } else {
          // If no school ID is found, reset to empty state.
          setSchoolProfile(null);
        }
    } catch (e) {
        console.error("Error slicing school data for user:", e);
    } finally {
        setIsLoading(false);
    }
  }, [user, role, allSchoolData, schoolGroups]);


  const addSchool = async (data: NewSchoolData, groupId?: string) => {
    const schoolId = data.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
    
    const newSchoolProfile: SchoolProfile = {
      id: schoolId,
      ...data,
      tier: groupId ? 'Premium' : data.tier,
      logoUrl: 'https://placehold.co/100x100.png',
      gradingSystem: '20-Point',
      currency: 'USD',
      status: 'Active',
      gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
      kioskConfig: { showDashboard: true, showLeaderboard: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
    };

    const newSchoolData = {
      profile: newSchoolProfile,
      students: [], teachers: [], classes: [], courses: [], lessonPlans: [], syllabi: [],
      savedTests: [], deployedTests: [], admissions: [], exams: [],
      finance: [], assets: [], assignments: [], grades: [], attendance: [],
      events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'],
      audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
      expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
      expenses: [], teams: [], competitions: [], terms: [], holidays: [],
      kioskMedia: [],
      activityLogs: [{
        id: `LOG${schoolId}${Date.now()}`,
        timestamp: new Date().toISOString(),
        schoolId: schoolId,
        user: user?.name || 'System Admin',
        role: role || 'GlobalAdmin',
        action: 'Create',
        details: `Provisioned new school: ${data.name}.`
      }],
      messages: [], savedReports: [],
    };

    setAllSchoolData(prev => ({
      ...prev,
      [schoolId]: newSchoolData,
    }));

    if (groupId) {
      setSchoolGroups(prev => {
        const newGroups = { ...prev };
        if (newGroups[groupId]) {
          newGroups[groupId] = [...newGroups[groupId], schoolId];
        } else {
          newGroups[groupId] = [schoolId];
        }
        return newGroups;
      });
    }
    
    toast({
      title: 'School Created!',
      description: `School "${data.name}" has been added.`,
    });
  };

  const updateSchoolStatus = (schoolId: string, status: SchoolProfile['status']) => {
    setAllSchoolData(prevData => {
      const newData = { ...prevData };
      if (newData[schoolId]) {
        newData[schoolId] = {
          ...newData[schoolId],
          profile: {
            ...newData[schoolId].profile,
            status: status,
          },
        };
      }
      return newData;
    });
  };

  const updateParentStatus = (email: string, status: 'Active' | 'Suspended') => {
    setParentStatusOverrides(prev => ({ ...prev, [email]: status }));
    toast({ title: 'Parent Status Updated', description: `Status for ${email} has been set to ${status}.` });
  };
  
  const updateStudentStatus = (schoolId: string, studentId: string, status: Student['status']) => {
    const studentName = allSchoolData[schoolId]?.students.find(s => s.id === studentId)?.name || 'Unknown Student';
    const schoolName = allSchoolData[schoolId]?.profile.name || 'Unknown School';
    
    const logEntry: ActivityLog = {
      id: `LOGG${Date.now()}`,
      timestamp: new Date().toISOString(),
      schoolId: schoolId,
      user: user?.name || 'Global Admin',
      role: role || 'GlobalAdmin',
      action: 'Update',
      details: `Changed status of student ${studentName} at ${schoolName} to ${status}.`
    };

    setAllSchoolData(prevData => {
        const newData = { ...prevData };
        if (newData[schoolId]) {
            newData[schoolId] = {
                ...newData[schoolId],
                students: newData[schoolId].students.map(s => s.id === studentId ? { ...s, status } : s),
                activityLogs: [logEntry, ...newData[schoolId].activityLogs]
            };
        }
        return newData;
    });
    toast({ title: 'Student Status Updated' });
  };

  const updateTeacherStatus = (schoolId: string, teacherId: string, status: Teacher['status']) => {
    const teacherName = allSchoolData[schoolId]?.teachers.find(t => t.id === teacherId)?.name || 'Unknown Teacher';
    const schoolName = allSchoolData[schoolId]?.profile.name || 'Unknown School';

    const logEntry: ActivityLog = {
      id: `LOGG${Date.now()}`,
      timestamp: new Date().toISOString(),
      schoolId: schoolId,
      user: user?.name || 'Global Admin',
      role: role || 'GlobalAdmin',
      action: 'Update',
      details: `Changed status of teacher ${teacherName} at ${schoolName} to ${status}.`
    };

    setAllSchoolData(prevData => {
        const newData = { ...prevData };
        if (newData[schoolId]) {
            newData[schoolId] = {
                ...newData[schoolId],
                teachers: newData[schoolId].teachers.map(t => t.id === teacherId ? { ...t, status } : t),
                activityLogs: [logEntry, ...newData[schoolId].activityLogs]
            };
        }
        return newData;
    });
    toast({ title: 'Teacher Status Updated' });
  };

  const updateSchoolProfile = (data: Partial<SchoolProfile>, schoolIdToUpdate?: string) => {
    const targetSchoolId = schoolIdToUpdate || user?.schoolId;

    if (targetSchoolId) {
        setAllSchoolData(prevAllData => {
            const newAllData = { ...prevAllData };
            if (newAllData[targetSchoolId]) {
                const currentProfile = newAllData[targetSchoolId].profile;
                newAllData[targetSchoolId].profile = { ...currentProfile, ...data };
            }
            return newAllData;
        });
    }

    if (!schoolIdToUpdate) {
        setSchoolProfile(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const addSubject = (subject: string) => !subjects.includes(subject) && setSubjects(prev => [...prev, subject].sort());
  const addExamBoard = (board: string) => !examBoards.includes(board) && setExamBoards(prev => [...prev, board].sort());
  const deleteExamBoard = (board: string) => {
    if (board === 'Internal') {
      toast({
        variant: 'destructive',
        title: 'Action Denied',
        description: 'The "Internal" exam board cannot be deleted.',
      });
      return;
    }
    setExamBoards(prev => prev.filter(b => b !== board));
    toast({
      title: 'Exam Board Deleted',
      description: `"${board}" has been removed.`,
    });
  };

  const addFeeDescription = (desc: string) => !feeDescriptions.includes(desc) && setFeeDescriptions(prev => [...prev, desc].sort());
  const deleteFeeDescription = (desc: string) => {
    setFeeDescriptions(prev => prev.filter(d => d !== desc));
    toast({
      title: 'Description Deleted',
      description: `"${desc}" has been removed.`,
    });
  };

  const addAudience = (audience: string) => !audiences.includes(audience) && setAudiences(prev => [...prev, audience].sort());
  const deleteAudience = (audience: string) => {
    setAudiences(prev => prev.filter(a => a !== audience));
    toast({
      title: 'Audience Deleted',
      description: `"${audience}" has been removed.`,
    });
  };
  
  const recordPayment = (feeId: string, amount: number) => { setFinanceData(prev => prev.map(fee => fee.id === feeId ? { ...fee, amountPaid: Math.min(fee.totalAmount, fee.amountPaid + amount) } : fee)); };
  
  const addFee = (data: NewFeeData) => {
    const student = studentsData.find(s => s.id === data.studentId);
    if (!student) return;
    const newFee: FinanceRecord = { id: `FEE${Date.now()}`, studentId: data.studentId, studentName: student.name, description: data.description, totalAmount: data.totalAmount, amountPaid: 0, dueDate: data.dueDate };
    setFinanceData(prev => [newFee, ...prev]);
  };
  
  const addGrade = (data: NewGradeData) => {
    const newGrade: Grade = { studentId: data.studentId, subject: data.subject, grade: data.grade as Grade['grade'], date: new Date().toISOString() };
    setGrades(prev => [newGrade, ...prev]);
  };

  const addStudentFromAdmission = (admission: Admission) => {
    const schoolId = user?.schoolId;
    if (!schoolId) return;

    const newStudent: Student = {
        id: `S${Date.now()}`,
        name: admission.name,
        grade: admission.appliedFor.replace('Grade ', ''),
        sex: admission.sex,
        class: 'Unassigned',
        email: `${admission.name.split(' ').join('.').toLowerCase()}@edumanage.com`,
        phone: 'N/A',
        address: 'N/A',
        parentName: admission.parentName,
        parentEmail: admission.parentEmail,
        dateOfBirth: admission.dateOfBirth,
        status: 'Active',
        behavioralAssessments: [],
    };
    
    setAllSchoolData(prevAllData => {
        const newAllData = { ...prevAllData };
        if (newAllData[schoolId]) {
          newAllData[schoolId].students.push(newStudent);
        } else {
          console.error(`School with id ${schoolId} not found`);
        }
        return newAllData;
    });
  };
  
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'status'>) => {
    const newTeacher: Teacher = { id: `T${Date.now()}`, ...teacherData, status: 'Active' };
    setTeachersData(prev => [newTeacher, ...prev]);
  };
  
  const updateTeacher = (teacherId: string, data: Partial<Omit<Teacher, 'id' | 'status'>>) => {
    setTeachersData(prev => prev.map(t => t.id === teacherId ? { ...t, ...data } : t));
    toast({ title: "Teacher Updated", description: "The teacher's information has been saved." });
  };

  const addClass = (classData: NewClassData) => {
    const newClass: Class = { id: `C${Date.now()}`, ...classData };
    setClassesData(prev => [newClass, ...prev]);
  }

  const addAsset = (assetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = { id: `ASSET${Date.now()}`, ...assetData };
    setAssetsData(prev => [newAsset, ...prev]);
  }

  const addExpense = (data: NewExpenseData) => {
    const newExpense: Expense = { id: `EXP${Date.now()}`, ...data, };
    setExpensesData(prev => [newExpense, ...prev]);
  }

  const addTeam = (data: NewTeamData) => {
    const newTeam: Team = { id: `TEAM${Date.now()}`, playerIds: [], ...data, };
    setTeamsData(prev => [newTeam, ...prev]);
  };

  const deleteTeam = (teamId: string) => {
    setTeamsData(prev => prev.filter(t => t.id !== teamId));
    setCompetitionsData(prev => prev.filter(c => c.ourTeamId !== teamId));
    toast({
      title: "Team Deleted",
      description: "The team and its scheduled competitions have been removed.",
    });
  };

  const addPlayerToTeam = (teamId: string, studentId: string) => { setTeamsData(prev => prev.map(team => team.id === teamId ? { ...team, playerIds: [...team.playerIds, studentId] } : team)); };
  const removePlayerFromTeam = (teamId: string, studentId: string) => { setTeamsData(prev => prev.map(team => team.id === teamId ? { ...team, playerIds: team.playerIds.filter(id => id !== studentId) } : team)); };

  const addCompetition = (data: NewCompetitionData) => {
    const newCompetition: Competition = { id: `COMP${Date.now()}`, date: data.date.toISOString(), ...data, };
    setCompetitionsData(prev => [...prev, newCompetition].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const addCompetitionResult = (competitionId: string, scores: { ourScore: number; opponentScore: number; }) => {
    const outcome = scores.ourScore > scores.opponentScore ? 'Win' : scores.ourScore < scores.opponentScore ? 'Loss' : 'Draw';
    const result = { ...scores, outcome };
    setCompetitionsData(prev =>
      prev.map(c => c.id === competitionId ? { ...c, result } : c)
    );
    toast({ title: 'Result Recorded', description: 'The competition result has been saved.' });
  };

  const addEvent = (data: NewEventData) => {
    const newEvent: SchoolEvent = { id: `EVT${Date.now()}`, date: data.date.toISOString(), ...data, };
    setEvents(prev => [...prev, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  const announceAwards = () => {
    const awardEvent: Omit<NewEventData, 'date'> = {
        title: `EduManage Excellence Awards Announced!`,
        location: 'Online',
        organizer: 'EduManage Platform',
        audience: 'Whole School Community',
        type: 'Academic',
    };
  
    setAllSchoolData(prevAllData => {
        const newAllData = JSON.parse(JSON.stringify(prevAllData));
        Object.keys(newAllData).forEach(schoolId => {
            const school = newAllData[schoolId];
            const newSchoolEvent = {
                ...awardEvent,
                id: `EVT${Date.now()}-${schoolId}`,
                date: new Date().toISOString(),
            };
            school.events = [...school.events, newSchoolEvent];
        });
        return newAllData;
    });

    setActivityLogs(prev => {
        const logEntry: ActivityLog = {
            id: `LOGG${Date.now()}`,
            timestamp: new Date().toISOString(),
            schoolId: 'global',
            user: user?.name || 'Global Admin',
            role: role || 'GlobalAdmin',
            action: 'Update',
            details: 'Announced winners for the EduManage Excellence Awards.'
        };
        return [logEntry, ...prev];
    });
  };
  
  const updateAwardConfig = (config: AwardConfig) => {
    setAwardConfig(config);
    toast({ title: "Award prizes have been updated." });
  };


  const addTerm = (data: NewTermData) => {
    const newTerm: AcademicTerm = { id: `TERM${Date.now()}`, startDate: data.startDate.toISOString(), endDate: data.endDate.toISOString(), name: data.name };
    setTerms(prev => [...prev, newTerm].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
  }

  const addHoliday = (data: NewHolidayData) => {
    const newHoliday: Holiday = { id: `HOL${Date.now()}`, date: data.date.toISOString(), name: data.name };
    setHolidays(prev => [...prev, newHoliday].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }

  const addCourse = (data: NewCourseData) => {
    const newCourse: Course = { id: `CRS${Date.now()}`, ...data };
    setCoursesData(prev => [newCourse, ...prev]);
  };

  const addLessonPlan = (data: NewLessonPlanData) => {
    const newPlan: LessonPlan = {
        id: `LP${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...data,
    };
    setLessonPlans(prev => [newPlan, ...prev]);
  };

  const addSyllabus = (data: NewSyllabusData) => {
    const newSyllabus: Syllabus = { ...data, topics: [] };
    setSyllabi(prev => [...prev, newSyllabus]);
    toast({ title: 'Syllabus Created', description: `A new syllabus for ${data.subject} - Grade ${data.grade} is ready.` });
  };
  
  const updateSyllabusTopic = (subject: string, grade: string, topic: SyllabusTopic) => {
    setSyllabi(prevSyllabi =>
      prevSyllabi.map(syllabus => {
        if (syllabus.subject === subject && syllabus.grade === grade) {
          const topicIndex = syllabus.topics.findIndex(t => t.id === topic.id);
          const newTopics = [...syllabus.topics];
          if (topicIndex > -1) {
            newTopics[topicIndex] = topic;
          } else {
            newTopics.push(topic);
          }
          return { ...syllabus, topics: newTopics };
        }
        return syllabus;
      })
    );
    toast({ title: 'Syllabus Updated', description: `Topic "${topic.topic}" has been saved.` });
  };
  
  const deleteSyllabusTopic = (subject: string, grade: string, topicId: string) => {
    setSyllabi(prevSyllabi =>
      prevSyllabi.map(syllabus => {
        if (syllabus.subject === subject && syllabus.grade === grade) {
          return { ...syllabus, topics: syllabus.topics.filter(t => t.id !== topicId) };
        }
        return syllabus;
      })
    );
    toast({ title: 'Topic Deleted' });
  };

  const addSavedTest = (data: NewSavedTest) => {
    const newTest: SavedTest = {
      id: `TEST${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setSavedTests(prev => [newTest, ...prev]);
  };

  const deleteSavedTest = (testId: string) => {
    setSavedTests(prev => prev.filter(t => t.id !== testId));
    setDeployedTests(prev => prev.filter(dt => dt.testId !== testId));
    toast({
      title: "Test Deleted",
      description: "The test and its deployments have been removed.",
    });
  };

  const addDeployedTest = (data: NewDeployedTestData) => {
    const newTest: DeployedTest = {
        id: `DTEST${Date.now()}`,
        createdAt: new Date().toISOString(),
        deadline: data.deadline.toISOString(),
        submissions: [],
        ...data,
    };
    setDeployedTests(prev => [newTest, ...prev]);
  };
  
  const addAdmission = (data: NewAdmissionData) => {
    if (!user) return;

    const newAdmission: Admission = {
        id: `ADM${Date.now()}`,
        name: data.name,
        dateOfBirth: format(data.dateOfBirth, 'yyyy-MM-dd'),
        sex: data.sex,
        appliedFor: data.appliedFor,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        formerSchool: data.formerSchool,
        grades: data.gradesSummary || 'N/A',
        parentName: user.name,
        parentEmail: user.email,
    };

    setAllSchoolData(prevAllData => {
        const newAllData = { ...prevAllData };
        if (newAllData[data.schoolId]) {
          newAllData[data.schoolId] = {
            ...newAllData[data.schoolId],
            admissions: [newAdmission, ...newAllData[data.schoolId].admissions]
          };
        } else {
          console.error(`School with id ${data.schoolId} not found`);
        }
        return newAllData;
    });
  };

  const updateApplicationStatus = (id: string, status: Admission['status']) => { setAdmissionsData(prev => prev.map(app => app.id === id ? { ...app, status } : app)); };
  
  const addMessage = (data: NewMessageData) => {
    if (!user || !role) return;

    const allUsers = Object.values(allSchoolData).flatMap(s => [...s.teachers, ...s.students]).concat(Object.values(allSchoolData).flatMap(s => s.students.map(st => ({...st, email: st.parentEmail, name: st.parentName, role: 'Parent'}))));
    const allAdmins = Object.values(allSchoolData).map(s => ({...s.profile, role: 'Admin', email: s.profile.email, name: s.profile.head}));

    const developerUser = { name: 'Developer', email: 'developer@edumanage.com', role: 'GlobalAdmin' };
    
    const allPossibleRecipients = [...allUsers, ...allAdmins, developerUser];

    const recipient = allPossibleRecipients.find(u => u.email === data.recipientUsername);
    if (!recipient) {
      toast({ variant: 'destructive', title: 'Recipient not found' });
      return;
    }

    const schoolIdForMessage = (recipient as any).schoolId || user.schoolId || 'global';
    
    const newMessage: Message = {
      id: `MSG${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString(),
      schoolId: schoolIdForMessage,
      senderUsername: user.email!,
      senderName: user.name!,
      senderRole: role,
      recipientUsername: data.recipientUsername,
      recipientName: recipient.name,
      recipientRole: (recipient as any).role as Role,
      subject: data.subject,
      body: data.body,
      isRead: false,
      status: 'Pending',
      attachmentUrl: data.attachmentUrl,
      attachmentName: data.attachmentName,
    };
    
    setAllSchoolData(prevAllData => {
      const newAllData = { ...prevAllData };
      if (newAllData[schoolIdForMessage]) {
          newAllData[schoolIdForMessage].messages.push(newMessage);
      }
      return newAllData;
    });

    toast({ title: 'Message Sent!' });
  };


  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setAllSchoolData(prevAllData => {
        const newAllData = { ...prevAllData };
        
        for (const schoolId in newAllData) {
            const school = newAllData[schoolId];
            const msgIndex = school.messages.findIndex(m => m.id === messageId);
            if (msgIndex > -1) {
                const newMessages = [...school.messages];
                newMessages[msgIndex] = { ...newMessages[msgIndex], status: status };
                newAllData[schoolId] = { ...school, messages: newMessages };
                break; 
            }
        }
        
        return newAllData;
    });

    toast({ title: `Message marked as ${status}` });
  };

  const addLessonAttendance = (courseId: string, date: string, attendanceData: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => {
    const schoolId = user?.schoolId;
    if (!schoolId) return;

    setAllSchoolData(prevAllData => {
      const newAllData = { ...prevAllData };
      const schoolData = { ...newAllData[schoolId] };

      const otherAttendance = schoolData.attendance.filter(
        rec => !(rec.courseId === courseId && rec.date === date)
      );

      const newRecords: Attendance[] = Object.entries(attendanceData).map(([studentId, status]) => ({
        id: `ATT${Date.now()}${studentId}`,
        studentId,
        courseId,
        date,
        status,
      }));
      
      schoolData.attendance = [...otherAttendance, ...newRecords];
      newAllData[schoolId] = schoolData;
      return newAllData;
    });
  };

  const addSavedReport = (report: Omit<SavedReport, 'id' | 'generatedAt'>) => {
    const newReport: SavedReport = {
      id: `REP${Date.now()}`,
      generatedAt: new Date().toISOString(),
      ...report,
    };
    setSavedReports(prev => [newReport, ...prev]);
  };
  
  const addKioskMedia = (media: Omit<KioskMedia, 'id' | 'createdAt'>) => {
    const schoolId = user?.schoolId;
    if (!schoolId) return;
    const newMedia: KioskMedia = {
      id: `K${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...media,
    };
    setKioskMedia(prev => [newMedia, ...prev]);
  };

  const removeKioskMedia = (mediaId: string) => {
    setKioskMedia(prev => prev.filter(m => m.id !== mediaId));
  };
  
  const addBehavioralAssessment = (data: NewBehavioralAssessmentData) => {
    const schoolId = user?.schoolId;
    if (!schoolId) return;

    const newAssessment: BehavioralAssessment = {
        id: `BEH${Date.now()}`,
        date: new Date().toISOString(),
        ...data
    };
    
    setAllSchoolData(prevAllData => {
      const newAllData = { ...prevAllData };
      if (newAllData[schoolId]) {
        const studentIndex = newAllData[schoolId].students.findIndex(s => s.id === data.studentId);
        if (studentIndex > -1) {
          newAllData[schoolId].students[studentIndex].behavioralAssessments.push(newAssessment);
        }
      }
      return newAllData;
    });
  };

  const value = {
    schoolProfile, updateSchoolProfile,
    allSchoolData, schoolGroups, addSchool, updateSchoolStatus,
    studentsData, addStudentFromAdmission, updateStudentStatus, addBehavioralAssessment,
    teachersData, addTeacher, updateTeacher, updateTeacherStatus,
    classesData, addClass,
    coursesData, addCourse,
    admissionsData, addAdmission, updateApplicationStatus,
    examsData: [],
    financeData, recordPayment, addFee,
    assetsData, addAsset,
    assignments: [],
    grades, addGrade,
    attendance, addLessonAttendance,
    events, addEvent, announceAwards, awardConfig, updateAwardConfig,
    syllabi, addSyllabus, updateSyllabusTopic, deleteSyllabusTopic,
    subjects, addSubject,
    examBoards, addExamBoard, deleteExamBoard,
    feeDescriptions, addFeeDescription, deleteFeeDescription,
    audiences, addAudience, deleteAudience,
    expenseCategories,
    expensesData, addExpense,
    teamsData, addTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam,
    competitionsData, addCompetition, addCompetitionResult,
    terms, addTerm,
    holidays, addHoliday,
    lessonPlans, addLessonPlan,
    savedTests, addSavedTest, deleteSavedTest,
    deployedTests, addDeployedTest,
    activityLogs,
    messages,
    addMessage,
    updateMessageStatus,
    parentStatusOverrides,
    updateParentStatus,
    savedReports,
    addSavedReport,
    kioskMedia, addKioskMedia, removeKioskMedia,
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

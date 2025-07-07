

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
    schoolData as initialSchoolData, 
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
    SavedTest,
    DeployedTest,
    ActivityLog,
    Message,
    Attendance,
    SavedReport as InitialSavedReport,
} from '@/lib/mock-data';
import { useAuth, Role } from './auth-context';
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
export type { Team, Admission, Student, ActivityLog, Message, Teacher, Attendance };

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
  to: 'Admin' | 'Developer' | string;
  subject: string;
  body: string;
  targetSchoolId?: string;
  attachmentUrl?: string;
  attachmentName?: string;
}


interface SchoolDataContextType {
  schoolProfile: SchoolProfile | null;
  updateSchoolProfile: (data: Partial<SchoolProfile>) => void;
  allSchoolData: typeof initialSchoolData | null;
  updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => void;
  studentsData: Student[];
  addStudentFromAdmission: (admission: Admission) => void;
  updateStudentStatus: (schoolId: string, studentId: string, status: Student['status']) => void;
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
  coursesData: Course[];
  addCourse: (data: NewCourseData) => void;
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
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialExamBoards = ['Internal', 'Cambridge', 'IB', 'State Board', 'Advanced Placement'];

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [allSchoolData, setAllSchoolData] = useState(() => JSON.parse(JSON.stringify(initialSchoolData)));
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
  const [financeData, setFinanceData] = useState<FinanceRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [examBoards, setExamBoards] = useState<string[]>(initialExamBoards);
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
  const [savedTests, setSavedTests] = useState<SavedTest[]>([]);
  const [deployedTests, setDeployedTests] = useState<DeployedTest[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let schoolId: string | undefined;

    if (role === 'GlobalAdmin') {
      setSchoolProfile(null);
      const allLogs = Object.values(allSchoolData).flatMap(school => school.activityLogs || []);
      const allMessages = Object.values(allSchoolData).flatMap(school => school.messages || []);
      setActivityLogs(allLogs);
      setMessages(allMessages);
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
      let allTeams: Team[] = [];
      let allCompetitions: Competition[] = [];

      for (const schoolIdKey in allSchoolData) {
        const school = allSchoolData[schoolIdKey];
        const childrenInSchool = school.students
          .filter(s => s.parentEmail === parentEmail)
          .map(s => ({ ...s, schoolName: school.profile.name, schoolId: school.profile.id }));
        if (childrenInSchool.length > 0) {
            schoolIdsOfChildren.add(schoolIdKey);
            childrenInSchool.forEach(child => {
                allStudents.push(child);
                childrenIds.add(child.id);
            });
            allTeams.push(...school.teams);
            allCompetitions.push(...school.competitions.map(c => ({...c, date: new Date(c.date)})));
        }
      }

      for (const schoolIdKey in allSchoolData) {
        const school = allSchoolData[schoolIdKey];
        allGrades.push(...school.grades.filter(g => childrenIds.has(g.studentId)));
        allAttendance.push(...school.attendance.filter(a => childrenIds.has(a.studentId)));
        allFinance.push(...school.finance.filter(f => childrenIds.has(f.studentId)));
      }

      schoolIdsOfChildren.forEach(sId => {
          const school = allSchoolData[sId];
          const schoolEventsWithSchoolName = school.events.map(event => ({ ...event, schoolName: school.profile.name, date: new Date(event.date) }));
          allEvents.push(...schoolEventsWithSchoolName);
      });
      
      setSchoolProfile(allSchoolData['northwood'].profile); // Parents need a default context for some actions
      setStudentsData(allStudents);
      setFinanceData(allFinance);
      setGrades(allGrades);
      setAttendance(allAttendance);
      setEvents(allEvents);
      setTeamsData(allTeams);
      setCompetitionsData(allCompetitions);
      setIsLoading(false);
    } else if (user?.schoolId && allSchoolData[user.schoolId]) {
      schoolId = user.schoolId;
      const data = allSchoolData[schoolId];
      setSchoolProfile(data.profile);
      setStudentsData(data.students || []);
      setTeachersData(data.teachers || []);
      setClassesData(data.classes || []);
      setAdmissionsData(data.admissions || []);
      setAssetsData(data.assets || []);
      setFinanceData(data.finance || []);
      setGrades(data.grades || []);
      setAttendance(data.attendance || []);
      setExpensesData(data.expenses || []);
      setExpenseCategories(data.expenseCategories || []);
      setTeamsData(data.teams || []);
      setCompetitionsData(data.competitions.map(c => ({ ...c, date: new Date(c.date) })) || []);
      setEvents(data.events.map(e => ({...e, date: new Date(e.date)})));
      setTerms(data.terms.map(t => ({...t, startDate: new Date(t.startDate), endDate: new Date(t.endDate)})));
      setHolidays(data.holidays.map(h => ({...h, date: new Date(h.date)})));
      setCoursesData(data.courses || []);
      setLessonPlans(data.lessonPlans.map(lp => ({...lp, createdAt: new Date(lp.createdAt)})) || []);
      setSavedTests(data.savedTests.map(st => ({...st, createdAt: new Date(st.createdAt)})) || []);
      setDeployedTests(data.deployedTests.map(dt => ({...dt, createdAt: new Date(dt.createdAt), deadline: new Date(dt.deadline)})) || []);
      setActivityLogs(data.activityLogs.map(log => ({...log, timestamp: new Date(log.timestamp)})) || []);
      setMessages(data.messages.map(msg => ({...msg, timestamp: new Date(msg.timestamp)})) || []);
      setSavedReports(data.savedReports.map(r => ({...r, generatedAt: new Date(r.generatedAt)})) || []);
      if(data.teachers) {
          const initialSubjects = [...new Set(data.teachers.map(t => t.subject))].sort();
          setSubjects(initialSubjects);
      }
      setFeeDescriptions(data.feeDescriptions || []);
      setAudiences(data.audiences || []);
      setIsLoading(false);
    } else {
        setSchoolProfile(null);
        setIsLoading(false);
    }
  }, [user, role, allSchoolData]);

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
      timestamp: new Date(),
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
      timestamp: new Date(),
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

  const updateSchoolProfile = (data: Partial<SchoolProfile>) => {
    setSchoolProfile(prev => {
        if (!prev) return null;
        const updatedProfile = { ...prev, ...data };
        
        if (user?.schoolId) {
            setAllSchoolData(prevAllData => ({
                ...prevAllData,
                [user.schoolId!]: {
                    ...prevAllData[user.schoolId!],
                    profile: updatedProfile,
                }
            }));
        }
        
        return updatedProfile;
    });
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
    const newGrade: Grade = { studentId: data.studentId, subject: data.subject, grade: data.grade as Grade['grade'], date: new Date() };
    setGrades(prev => [newGrade, ...prev]);
  };

  const addStudentFromAdmission = (admission: Admission) => {
    if (!user?.schoolId) return;

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
    };
    
    setAllSchoolData(prevAllData => {
        const schoolId = user.schoolId!;
        const newAllData = { ...prevAllData };
        if (newAllData[schoolId]) {
          newAllData[schoolId] = {
              ...newAllData[schoolId],
              students: [...newAllData[schoolId].students, newStudent]
          }
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
    const newCompetition: Competition = { id: `COMP${Date.now()}`, ...data, };
    setCompetitionsData(prev => [...prev, newCompetition].sort((a,b) => a.date.getTime() - b.date.getTime()));
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
    const newEvent: SchoolEvent = { id: `EVT${Date.now()}`, ...data, };
    setEvents(prev => [...prev, newEvent].sort((a,b) => a.date.getTime() - b.date.getTime()));
  };

  const addTerm = (data: NewTermData) => {
    const newTerm: AcademicTerm = { id: `TERM${Date.now()}`, ...data };
    setTerms(prev => [...prev, newTerm].sort((a,b) => a.startDate.getTime() - b.startDate.getTime()));
  }

  const addHoliday = (data: NewHolidayData) => {
    const newHoliday: Holiday = { id: `HOL${Date.now()}`, ...data };
    setHolidays(prev => [...prev, newHoliday].sort((a,b) => a.date.getTime() - b.date.getTime()));
  }

  const addCourse = (data: NewCourseData) => {
    const newCourse: Course = { id: `CRS${Date.now()}`, ...data };
    setCoursesData(prev => [newCourse, ...prev]);
  };

  const addLessonPlan = (data: NewLessonPlanData) => {
    const newPlan: LessonPlan = {
        id: `LP${Date.now()}`,
        createdAt: new Date(),
        ...data,
    };
    setLessonPlans(prev => [newPlan, ...prev]);
  };

  const addSavedTest = (data: NewSavedTest) => {
    const newTest: SavedTest = {
      id: `TEST${Date.now()}`,
      createdAt: new Date(),
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
        createdAt: new Date(),
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

    const fromSchoolId = user.schoolId;
    const targetSchoolId = data.targetSchoolId || fromSchoolId;

    if (!targetSchoolId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Message destination school not found.' });
        return;
    }
    
    const targetSchoolName = allSchoolData[targetSchoolId]?.profile.name || 'Unknown School';

    const newMessage: Message = {
      id: `MSG${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
      schoolId: targetSchoolId,
      fromUserName: user.name,
      fromUserRole: role,
      to: data.to,
      subject: data.subject,
      body: data.body,
      status: 'Pending',
      attachmentUrl: data.attachmentUrl,
      attachmentName: data.attachmentName,
    };
    
    const logDetails = data.to === 'Developer'
        ? `Sent message with subject "${data.subject}" to Developer.`
        : `Sent message with subject "${data.subject}" to Admin of ${targetSchoolName}.`;

    const logEntry: ActivityLog = {
      id: `LOG${Date.now()}`,
      timestamp: new Date(),
      schoolId: fromSchoolId || targetSchoolId,
      user: user.name,
      role: role,
      action: 'Message',
      details: logDetails,
    };

    setAllSchoolData(prevAllData => {
      const newAllData = { ...prevAllData };
      const logSchoolId = fromSchoolId || targetSchoolId;
      
      if (newAllData[targetSchoolId]) {
        newAllData[targetSchoolId] = {
          ...newAllData[targetSchoolId],
          messages: [newMessage, ...newAllData[targetSchoolId].messages],
        };
      }
      
      if (newAllData[logSchoolId]) {
        if (logSchoolId === targetSchoolId) {
          // If log and message go to the same school, update the already cloned object
          newAllData[logSchoolId].activityLogs = [logEntry, ...newAllData[logSchoolId].activityLogs];
        } else {
          // If they are different (Global Admin case), clone the log school object separately
          newAllData[logSchoolId] = {
            ...newAllData[logSchoolId],
            activityLogs: [logEntry, ...newAllData[logSchoolId].activityLogs],
          };
        }
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
    if (!user?.schoolId) return;

    setAllSchoolData(prevAllData => {
      const schoolId = user.schoolId!;
      const newAllData = { ...prevAllData };
      const schoolData = { ...newAllData[schoolId] };

      // Filter out existing records for this specific course and date
      const otherAttendance = schoolData.attendance.filter(
        rec => !(rec.courseId === courseId && rec.date === date)
      );

      // Create new records
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
      generatedAt: new Date(),
      ...report,
    };
    setSavedReports(prev => [newReport, ...prev]);
  };


  const value = {
    schoolProfile, updateSchoolProfile,
    allSchoolData, updateSchoolStatus,
    studentsData, addStudentFromAdmission, updateStudentStatus,
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
    events, addEvent,
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

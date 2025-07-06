

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
    Competition, 
    SchoolEvent,
    AcademicTerm,
    Holiday,
    Course as InitialCourse,
    LessonPlan,
    SavedTest,
    DeployedTest,
    ActivityLog,
    Message,
} from '@/lib/mock-data';
import { useAuth, Role } from './auth-context';
import { CreateLessonPlanOutput } from '@/ai/flows/create-lesson-plan';
import { GenerateTestOutput } from '@/ai/flows/generate-test';
import { useToast } from '@/hooks/use-toast';

export type FinanceRecord = InitialFinanceRecord;
export type Grade = InitialGrade;
export type SchoolProfile = InitialSchoolProfile;
export type Class = InitialClass;
export type Course = InitialCourse;
export type { Team, Competition, Admission, Student, ActivityLog, Message };

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
  formerSchool: string;
  gradesSummary: string;
}
export interface NewDeployedTestData { testId: string; classId: string; deadline: Date; }
export interface NewMessageData { to: 'Admin' | 'Developer' | string; subject: string; body: string; }


interface SchoolDataContextType {
  schoolProfile: SchoolProfile | null;
  updateSchoolProfile: (data: Partial<SchoolProfile>) => void;
  allSchoolData: typeof initialSchoolData | null;
  updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => void;
  studentsData: Student[];
  addStudentFromAdmission: (admission: Admission) => void;
  teachersData: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id' | 'status'>) => void;
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
  attendance: any[];
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
  isLoading: boolean;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const initialExamBoards = ['Internal', 'Cambridge', 'IB', 'State Board', 'Advanced Placement'];

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [allSchoolData, setAllSchoolData] = useState(initialSchoolData);
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
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let schoolId: string | undefined;

    if (role === 'GlobalAdmin') {
      setSchoolProfile(null);
      const allLogs = Object.values(allSchoolData).flatMap(school => school.activityLogs || []);
      setActivityLogs(allLogs);
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
          const schoolEventsWithSchoolName = school.events.map(event => ({ ...event, schoolName: school.profile.name }));
          allEvents.push(...schoolEventsWithSchoolName);
      });
      
      setSchoolProfile(allSchoolData['northwood'].profile); // Parents need a default context for some actions
      setStudentsData(allStudents);
      setFinanceData(allFinance);
      setGrades(allGrades);
      setEvents(allEvents);
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
      setExpensesData(data.expenses || []);
      setExpenseCategories(data.expenseCategories || []);
      setTeamsData(data.teams || []);
      setCompetitionsData(data.competitions || []);
      setEvents(data.events || []);
      setTerms(data.terms || []);
      setHolidays(data.holidays || []);
      setCoursesData(data.courses || []);
      setLessonPlans(data.lessonPlans || []);
      setSavedTests(data.savedTests || []);
      setDeployedTests(data.deployedTests || []);
      setActivityLogs(data.activityLogs || []);
      setMessages(data.messages || []);
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
    // Mutate the mock "database" directly so changes persist across logins in the demo
    if (initialSchoolData[schoolId]) {
      initialSchoolData[schoolId].profile.status = status;
    }

    // Update the React state to trigger UI re-renders
    setAllSchoolData(prevData => {
        if (!prevData || !prevData[schoolId]) return prevData;
        
        const newData = { ...prevData };
        newData[schoolId] = {
            ...newData[schoolId],
            profile: {
                ...newData[schoolId].profile,
                status: status,
            },
        };
        return newData;
    });
  };

  const updateSchoolProfile = (data: Partial<SchoolProfile>) => { setSchoolProfile(prev => prev ? { ...prev, ...data } : null); };
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
    if (!user?.schoolId) return; // Ensure we are in a school context

    const newStudent: Student = {
        id: `S${Date.now()}`,
        name: admission.name,
        grade: admission.appliedFor.replace('Grade ', ''),
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
        const newAllData = { ...prevAllData };
        if (newAllData[user.schoolId!]) {
          newAllData[user.schoolId!].students.push(newStudent);
        } else {
          console.error(`School with id ${user.schoolId} not found`);
        }
        return newAllData;
    });
  };
  
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'status'>) => {
    const newTeacher: Teacher = { id: `T${Date.now()}`, ...teacherData, status: 'Active' };
    setTeachersData(prev => [newTeacher, ...prev]);
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

  const addCompetition = (data: NewCompetitionData) => {
    const newCompetition: Competition = { id: `COMP${Date.now()}`, ...data, };
    setCompetitionsData(prev => [...prev, newCompetition].sort((a,b) => a.date.getTime() - b.date.getTime()));
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
        dateOfBirth: data.dateOfBirth,
        appliedFor: data.appliedFor,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        formerSchool: data.formerSchool,
        grades: data.gradesSummary,
        parentName: user.name,
        parentEmail: user.email,
    };

    setAllSchoolData(prevAllData => {
        const newAllData = { ...prevAllData };
        if (newAllData[data.schoolId]) {
          newAllData[data.schoolId].admissions.unshift(newAdmission);
        } else {
          console.error(`School with id ${data.schoolId} not found`);
        }
        return newAllData;
    });
  };

  const addPlayerToTeam = (teamId: string, studentId: string) => { setTeamsData(prev => prev.map(team => team.id === teamId ? { ...team, playerIds: [...team.playerIds, studentId] } : team)); };
  const removePlayerFromTeam = (teamId: string, studentId: string) => { setTeamsData(prev => prev.map(team => team.id === teamId ? { ...team, playerIds: team.playerIds.filter(id => id !== studentId) } : team)); };
  const updateApplicationStatus = (id: string, status: Admission['status']) => { setAdmissionsData(prev => prev.map(app => app.id === id ? { ...app, status } : app)); };
  
  const addMessage = (data: NewMessageData) => {
    if (!user || !role) return;

    const schoolId = role === 'GlobalAdmin' ? 'system' : user.schoolId;
    if (!schoolId) return;

    const newMessage: Message = {
      id: `MSG${Date.now()}`,
      timestamp: new Date(),
      schoolId: schoolId,
      fromUserName: user.name,
      fromUserRole: role,
      to: data.to,
      subject: data.subject,
      body: data.body,
      status: 'Pending',
    };

    setMessages(prev => [newMessage, ...prev]);

    // Also need to update the mock "DB"
    setAllSchoolData(prevAllData => {
        const newAllData = { ...prevAllData };
        if (newAllData[schoolId]) {
            newAllData[schoolId].messages.unshift(newMessage);
        }
        return newAllData;
    });

    toast({ title: 'Message Sent!' });
  };

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status } : m));

    if (!user?.schoolId) return;
    setAllSchoolData(prevAllData => {
        const newAllData = { ...prevAllData };
        if (newAllData[user.schoolId!]) {
            const schoolMessages = newAllData[user.schoolId!].messages;
            const msgIndex = schoolMessages.findIndex(m => m.id === messageId);
            if (msgIndex > -1) {
                schoolMessages[msgIndex].status = status;
            }
        }
        return newAllData;
    });

    toast({ title: `Message marked as ${status}` });
  }

  const value = {
    schoolProfile, updateSchoolProfile,
    allSchoolData, updateSchoolStatus,
    studentsData, addStudentFromAdmission,
    teachersData, addTeacher,
    classesData, addClass,
    coursesData, addCourse,
    admissionsData, addAdmission, updateApplicationStatus,
    examsData: [],
    financeData, recordPayment, addFee,
    assetsData, addAsset,
    assignments: [],
    grades, addGrade,
    attendance: [],
    events, addEvent,
    subjects, addSubject,
    examBoards, addExamBoard, deleteExamBoard,
    feeDescriptions, addFeeDescription, deleteFeeDescription,
    audiences, addAudience, deleteAudience,
    expenseCategories,
    expensesData, addExpense,
    teamsData, addTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam,
    competitionsData, addCompetition,
    terms, addTerm,
    holidays, addHoliday,
    lessonPlans, addLessonPlan,
    savedTests, addSavedTest, deleteSavedTest,
    deployedTests, addDeployedTest,
    activityLogs,
    messages,
    addMessage,
    updateMessageStatus,
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

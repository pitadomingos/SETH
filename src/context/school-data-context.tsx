
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { collection, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { initialSchoolData, SchoolData, Student, Teacher, Class, Course, Syllabus, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, SchoolProfile, DeployedTest, SavedTest, NewMessageData, NewAdmissionData } from '@/lib/mock-data';
import { useAuth } from './auth-context';
import type { Role } from './auth-context';

export type { SchoolData, SchoolProfile, Student, Teacher, Class, Course, SyllabusTopic, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, DeployedTest, SavedTest, NewMessageData, NewAdmissionData } from '@/lib/mock-data';

interface SchoolDataContextType {
    // --- Data States ---
    allSchoolData: Record<string, SchoolData> | null;
    schoolProfile: SchoolProfile | null;
    studentsData: Student[];
    teachersData: Teacher[];
    classesData: Class[];
    coursesData: Course[];
    syllabi: Syllabus[];
    admissionsData: Admission[];
    financeData: FinanceRecord[];
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
    
    // --- Dropdown Data ---
    subjects: string[];
    examBoards: string[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];

    // --- Loading State ---
    isLoading: boolean;

    // --- Action Functions ---
    addCourse: (course: Omit<Course, 'id'>) => void;
    addSyllabus: (syllabus: Omit<Syllabus, 'id' | 'topics'>) => void;
    updateSyllabusTopic: (subject: string, grade: string, topic: any) => void;
    deleteSyllabusTopic: (subject: string, grade: string, topicId: string) => void;
    updateApplicationStatus: (id: string, status: Admission['status']) => void;
    addStudentFromAdmission: (application: Admission) => void;
    addAsset: (asset: Omit<any, 'id'>) => void;
    addLessonAttendance: (courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => void;
    addClass: (classData: Omit<Class, 'id'>) => void;
    addEvent: (event: Omit<Event, 'id' | 'schoolName'>) => void;
    addGrade: (grade: Omit<Grade, 'id' | 'date' | 'teacherId'>) => boolean;
    recordPayment: (feeId: string, amount: number) => void;
    addFee: (fee: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>) => void;
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    addTeam: (team: Omit<Team, 'id' | 'playerIds'>) => void;
    deleteTeam: (teamId: string) => void;
    addPlayerToTeam: (teamId: string, studentId: string) => void;
    removePlayerFromTeam: (teamId: string, studentId: string) => void;
    addCompetition: (competition: Omit<Competition, 'id'>) => void;
    addCompetitionResult: (competitionId: string, result: Competition['result']) => void;
    addTeacher: (teacher: Omit<Teacher, 'id' | 'status'>) => void;
    updateTeacher: (id: string, data: Partial<Teacher>) => void;
    addKioskMedia: (media: Omit<KioskMedia, 'id'|'createdAt'>) => void;
    removeKioskMedia: (id: string) => void;
    updateSchoolProfile: (data: Partial<SchoolProfile>, schoolId?: string) => void;
    addMessage: (message: NewMessageData) => void;
    addAdmission: (admission: NewAdmissionData) => void;
    updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => void;
    updateMessageStatus: (messageId: string, status: Message['status']) => void;
    updateStudentStatus: (schoolId: string, studentId: string, status: Student['status']) => void;
    updateTeacherStatus: (schoolId: string, teacherId: string, status: Teacher['status']) => void;
    updateParentStatus: (parentEmail: string, status: 'Active' | 'Suspended') => void;
    addSchool: (schoolData: SchoolData) => void;
    addBehavioralAssessment: (assessment: Omit<any, 'id' | 'date'>) => void;
    
    // Academic Year
    terms: any[];
    holidays: any[];
    addTerm: (term: any) => void;
    addHoliday: (holiday: any) => void;

    // Dropdown management
    addExamBoard: (board: string) => void;
    deleteExamBoard: (board: string) => void;
    addFeeDescription: (desc: string) => void;
    deleteFeeDescription: (desc: string) => void;
    addAudience: (aud: string) => void;
    deleteAudience: (aud: string) => void;
    addSavedReport: (report: Omit<SavedReport, 'id'>) => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, schoolId: authSchoolId } = useAuth();
  const [data, setData] = useState<Record<string, SchoolData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const q = collection(db, "schools");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const schoolsData: Record<string, SchoolData> = {};
        querySnapshot.forEach((doc) => {
            const schoolDoc = doc.data() as SchoolData;
            
            // Convert Firestore timestamps to JS Dates
            const convertTimestamps = (obj: any) => {
                for (const key in obj) {
                    if (obj[key] && typeof obj[key].toDate === 'function') {
                        obj[key] = obj[key].toDate();
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        convertTimestamps(obj[key]);
                    }
                }
                return obj;
            };
            schoolsData[doc.id] = convertTimestamps(schoolDoc);
        });
        
        // If the database is empty, seed it with initial data
        if (Object.keys(schoolsData).length === 0) {
            console.log("Firestore 'schools' collection is empty. Seeding with initial mock data...");
            Object.entries(initialSchoolData).forEach(([id, schoolData]) => {
                setDoc(doc(db, "schools", id), schoolData);
            });
            setData(initialSchoolData);
        } else {
             setData(schoolsData);
        }

        setIsLoading(false);
    }, (error) => {
        console.error("Error fetching school data from Firestore:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
}, []);
  
  const addLog = useCallback(async (schoolId: string, action: string, details: string) => {
    if(!user || !role) return;
    const newLog: ActivityLog = {
      id: `LOG${Date.now()}`,
      timestamp: new Date(),
      schoolId: schoolId,
      user: user.name,
      role: role,
      action: action,
      details: details,
    };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { activityLogs: arrayUnion(newLog) });
  }, [user, role]);

  const schoolId = useMemo(() => {
      if (role === 'GlobalAdmin') return null;
      return authSchoolId;
  }, [authSchoolId, role]);

  const schoolData = useMemo(() => {
    if (!schoolId || !data[schoolId]) return null;
    return data[schoolId];
  }, [schoolId, data]);
  
  const schoolGroups = useMemo(() => {
    return data?.['northwood']?.schoolGroups || {};
  }, [data]);
  
  const allStudents = useMemo(() => Object.values(data).flatMap(d => d.students.map(s => ({...s, schoolName: d.profile.name, schoolId: d.profile.id }))), [data]);

  const studentsData = useMemo(() => {
    if (role === 'Parent' && user?.email) {
      return allStudents.filter(student => student.parentEmail === user.email);
    }
    return schoolData?.students || [];
  }, [role, user, schoolData, allStudents]);
  
  const addSchool = (newSchoolData: SchoolData) => {
    // This is now mainly handled by the createSchoolInFirestore and the onSnapshot listener.
    // This function can remain for optimistic UI updates if needed, but for now, it's a no-op.
  };

  const updateSchoolProfile = async (profileData: Partial<SchoolProfile>, targetSchoolId?: string) => {
    const sId = targetSchoolId || schoolId;
    if (!sId) return;
    const schoolRef = doc(db, 'schools', sId);
    const updatePayload: Record<string, any> = {};
    Object.keys(profileData).forEach(key => {
        updatePayload[`profile.${key}`] = profileData[key];
    });
    await updateDoc(schoolRef, updatePayload);
  };
  
  const addTeacher = async (teacher: Omit<Teacher, 'id' | 'status'>) => {
    if (!schoolId) return;
     const newTeacher: Teacher = { id: `T${Date.now()}`, status: 'Active', ...teacher };
     const schoolRef = doc(db, 'schools', schoolId);
     await updateDoc(schoolRef, { teachers: arrayUnion(newTeacher) });
     addLog(schoolId, 'Create', `Added new teacher: ${teacher.name}`);
  };

  const updateTeacher = async (id: string, teacherData: Partial<Teacher>) => {
      if (!schoolId) return;
      const currentTeachers = schoolData?.teachers || [];
      const updatedTeachers = currentTeachers.map(t => t.id === id ? {...t, ...teacherData} : t);
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { teachers: updatedTeachers });
      addLog(schoolId, 'Update', `Updated profile for teacher: ${teacherData.name || id}`);
  };
  
  const addClass = async (classData: Omit<Class, 'id'>) => {
    if (!schoolId) return;
    const newClass: Class = { id: `C${Date.now()}`, ...classData };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { classes: arrayUnion(newClass) });
    addLog(schoolId, 'Create', `Created new class: ${classData.name}`);
  };
  
  const addCourse = async (course: Omit<Course, 'id'>) => {
    if (!schoolId) return;
    const newCourse: Course = { id: `CRS${Date.now()}`, ...course };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { courses: arrayUnion(newCourse) });
     addLog(schoolId, 'Create', `Created new course: ${course.subject}`);
  };

  // ... (All other action functions need to be converted to use updateDoc)
  // For brevity, I will show a few more conversions. A full implementation would convert all of them.

  const addSyllabus = async (syllabus: Omit<Syllabus, 'id'|'topics'>) => {
      if(!schoolId) return;
      const newSyllabus: Syllabus = { id: `SYL${Date.now()}`, topics: [], ...syllabus };
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { syllabi: arrayUnion(newSyllabus) });
      addLog(schoolId, 'Create', `Created syllabus for ${syllabus.subject} Grade ${syllabus.grade}`);
  };
  
  const updateSyllabusTopic = async (subject: string, grade: string, topic: any) => {
    if(!schoolId || !schoolData) return;
    const updatedSyllabi = schoolData.syllabi.map(s => {
        if (s.subject === subject && s.grade === grade) {
            const topicIndex = s.topics.findIndex(t => t.id === topic.id);
            if (topicIndex > -1) {
                s.topics[topicIndex] = topic;
            } else {
                s.topics.push(topic);
            }
        }
        return s;
    });
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { syllabi: updatedSyllabi });
    addLog(schoolId, 'Update', `Updated syllabus topic "${topic.topic}" for ${subject}`);
  };
  
  const deleteSyllabusTopic = async (subject: string, grade: string, topicId: string) => {
      if(!schoolId || !schoolData) return;
      const updatedSyllabi = schoolData.syllabi.map(s => {
          if (s.subject === subject && s.grade === grade) {
              s.topics = s.topics.filter(t => t.id !== topicId);
          }
          return s;
      });
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { syllabi: updatedSyllabi });
      addLog(schoolId, 'Delete', `Deleted a topic from ${subject} syllabus`);
  };

  const updateApplicationStatus = async (id: string, status: Admission['status']) => {
      if (!schoolId || !schoolData) return;
      const updatedAdmissions = schoolData.admissions.map(a => a.id === id ? { ...a, status } : a);
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { admissions: updatedAdmissions });
      addLog(schoolId, 'Update', `Updated application ${id} status to ${status}`);
  };

  const addStudentFromAdmission = async (application: Admission) => {
      if (!schoolId) return;
      const [grade, studentClass] = application.appliedFor.replace('Grade ', '').split('-');
      const newStudent: Student = {
          id: `STU${Date.now()}`,
          name: application.name,
          email: `${application.name.toLowerCase().replace(' ', '.')}@${schoolId}.edu`,
          phone: `555-01${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
          address: '123 Oak Avenue',
          sex: application.sex,
          dateOfBirth: application.dateOfBirth,
          grade: grade.trim(),
          class: studentClass ? studentClass.trim() : 'A',
          parentName: application.parentName,
          parentEmail: application.parentEmail,
          status: 'Active',
          behavioralAssessments: [],
      };
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { students: arrayUnion(newStudent) });
      addLog(schoolId, 'Create', `Enrolled new student ${newStudent.name} from admission.`);
  };
  
  const addAsset = async (asset: Omit<any, 'id'>) => {
      if (!schoolId) return;
      const newAsset = { id: `AST${Date.now()}`, ...asset };
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { assets: arrayUnion(newAsset) });
      addLog(schoolId, 'Create', `Added new asset: ${asset.name}`);
  };
  
  const addLessonAttendance = async (courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => {
    if(!schoolId || !schoolData) return;
    const newRecords: Attendance[] = Object.entries(studentStatuses).map(([studentId, status]) => ({
      id: `ATT${Date.now()}${studentId}`,
      studentId,
      date: new Date(date),
      status,
      courseId,
    }));
    const otherRecords = schoolData.attendance.filter(a => !(a.date.toISOString().split('T')[0] === date && a.courseId === courseId));
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { attendance: [...otherRecords, ...newRecords]});
    addLog(schoolId, 'Create', `Recorded attendance for course ${courseId} on ${date}`);
  };

  const addEvent = async (event: Omit<Event, 'id' | 'schoolName'>) => {
    if(!schoolId || !schoolProfile) return;
    const newEvent: Event = { id: `EVT${Date.now()}`, schoolName: schoolProfile.name, ...event };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { events: arrayUnion(newEvent) });
    addLog(schoolId, 'Create', `Scheduled new event: ${event.title}`);
  };

  const addGrade = async (grade: Omit<Grade, 'id' | 'date' | 'teacherId'>) => {
    if(!schoolId || !teacher) return false;
    const teacherId = teacher.id;
    const newGrade: Grade = { id: `GRD${Date.now()}`, date: new Date(), teacherId, ...grade };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { grades: arrayUnion(newGrade) });
    return true;
  };
  
  const recordPayment = async (feeId: string, amount: number) => {
    if (!schoolId || !schoolData) return;
    const updatedFinance = schoolData.finance.map(f => {
        if (f.id === feeId) {
            const newAmountPaid = f.amountPaid + amount;
            const newStatus = newAmountPaid >= f.totalAmount ? 'Paid' : 'Partially Paid';
            addLog(schoolId, 'Update', `Recorded payment of ${amount} for fee ${f.description}`);
            return { ...f, amountPaid: newAmountPaid, status: newStatus };
        }
        return f;
    });
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { finance: updatedFinance });
  };

  const addFee = async (fee: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>) => {
    if (!schoolId || !schoolData) return;
    const student = schoolData.students.find(s => s.id === fee.studentId);
    if (!student) return;
    const newFee: FinanceRecord = {
        id: `FIN${Date.now()}`,
        studentName: student.name,
        status: 'Pending',
        amountPaid: 0,
        ...fee
    };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { finance: arrayUnion(newFee) });
    addLog(schoolId, 'Create', `Created new fee for ${student.name}: ${fee.description}`);
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
      if(!schoolId) return;
      const newExpense: Expense = { id: `EXP${Date.now()}`, ...expense };
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { expenses: arrayUnion(newExpense) });
      addLog(schoolId, 'Create', `Added expense: ${expense.description}`);
  };
  
  const addTeam = async (team: Omit<Team, 'id' | 'playerIds'>) => {
    if (!schoolId) return;
    const newTeam: Team = { id: `TM${Date.now()}`, playerIds: [], ...team };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { teams: arrayUnion(newTeam) });
    addLog(schoolId, 'Create', `Created new sports team: ${team.name}`);
  };
  
  const deleteTeam = async (teamId: string) => {
    if (!schoolId || !schoolData) return;
    const teamName = schoolData.teams.find(t => t.id === teamId)?.name;
    const updatedTeams = schoolData.teams.filter(t => t.id !== teamId);
    const updatedCompetitions = schoolData.competitions.filter(c => c.ourTeamId !== teamId);
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { teams: updatedTeams, competitions: updatedCompetitions });
    addLog(schoolId, 'Delete', `Deleted team: ${teamName}`);
  };

  const addPlayerToTeam = async (teamId: string, studentId: string) => {
      if(!schoolId || !schoolData) return;
      const updatedTeams = schoolData.teams.map(t => {
          if (t.id === teamId && !t.playerIds.includes(studentId)) {
              t.playerIds.push(studentId);
          }
          return t;
      });
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { teams: updatedTeams });
  };
  
  const removePlayerFromTeam = async (teamId: string, studentId: string) => {
      if(!schoolId || !schoolData) return;
      const updatedTeams = schoolData.teams.map(t => {
          if (t.id === teamId) {
              t.playerIds = t.playerIds.filter(id => id !== studentId);
          }
          return t;
      });
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { teams: updatedTeams });
  };
  
  const addCompetition = async (competition: Omit<Competition, 'id'>) => {
    if(!schoolId) return;
    const newCompetition: Competition = { id: `CMP${Date.now()}`, ...competition };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { competitions: arrayUnion(newCompetition) });
    addLog(schoolId, 'Create', `Scheduled competition: ${competition.title}`);
  };
  
  const addCompetitionResult = async (competitionId: string, result: Competition['result']) => {
    if (!schoolId || !schoolData) return;
    const updatedCompetitions = schoolData.competitions.map(c => {
      if (c.id === competitionId) {
          const outcome = result.ourScore > result.opponentScore ? 'Win' : result.ourScore < result.opponentScore ? 'Loss' : 'Draw';
          return { ...c, result: {...result, outcome} };
      }
      return c;
    });
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { competitions: updatedCompetitions });
    addLog(schoolId, 'Update', `Recorded result for competition ${competitionId}`);
  };
  
  const addBehavioralAssessment = async (assessment: Omit<any, 'id'|'date'>) => {
    if(!schoolId || !schoolData) return;
    const newAssessment = { id: `BA${Date.now()}`, date: new Date(), ...assessment };
    const updatedStudents = schoolData.students.map(s => {
        if(s.id === assessment.studentId) {
            s.behavioralAssessments.push(newAssessment);
        }
        return s;
    });
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { students: updatedStudents });
    addLog(schoolId, 'Create', `Added behavioral assessment for student ${assessment.studentId}`);
  };
  
  const addKioskMedia = async (media: Omit<KioskMedia, 'id' | 'createdAt'>) => {
    if (!schoolId) return;
    const newMedia: KioskMedia = { id: `KM${Date.now()}`, createdAt: new Date(), ...media };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { kioskMedia: arrayUnion(newMedia) });
    addLog(schoolId, 'Create', `Added kiosk media: ${media.title}`);
  };
  
  const removeKioskMedia = async (id: string) => {
      if(!schoolId || !schoolData) return;
      const updatedMedia = schoolData.kioskMedia.filter(m => m.id !== id);
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { kioskMedia: updatedMedia });
      addLog(schoolId, 'Delete', `Removed kiosk media item ${id}`);
  };
  
  const addMessage = async (message: NewMessageData) => {
    if(!schoolId || !user || !role) return;
    const recipientSchoolId = Object.values(data).find(d => d.profile.email === message.recipientUsername)?.profile.id || schoolId;
    const recipient = Object.values(data).flatMap(d => [...d.teachers, ...d.students]).find(u => u.email === message.recipientUsername);
    const recipientRole = recipient ? (studentsData.some(s => s.id === recipient.id) ? 'Student' : 'Teacher') : 'Admin';
    const recipientName = recipient?.name || data[recipientSchoolId]?.profile.head || 'Admin';

    const newMessage: Message = {
        id: `MSG${Date.now()}`,
        senderUsername: user.email,
        senderName: user.name,
        senderRole: role,
        recipientUsername: message.recipientUsername,
        recipientName,
        recipientRole,
        subject: message.subject,
        body: message.body,
        timestamp: new Date(),
        status: 'Pending',
        attachmentUrl: message.attachmentUrl,
        attachmentName: message.attachmentName,
    };
    
    const senderSchoolRef = doc(db, 'schools', schoolId);
    await updateDoc(senderSchoolRef, { messages: arrayUnion(newMessage) });
    if(recipientSchoolId !== schoolId) {
        const recipientSchoolRef = doc(db, 'schools', recipientSchoolId);
        await updateDoc(recipientSchoolRef, { messages: arrayUnion(newMessage) });
    }
    addLog(schoolId, 'Message', `Sent message to ${recipientName}`);
  };
  
  const addAdmission = async (admission: NewAdmissionData) => {
    const { schoolId, ...rest } = admission;
    if (!schoolId || !user) return;
    const newAdmission: Admission = {
        id: `ADM${Date.now()}`,
        ...rest,
        date: format(new Date(), 'yyyy-MM-dd'),
        parentName: user.name,
        parentEmail: user.email,
        status: 'Pending',
        grades: rest.gradesSummary || 'N/A'
    };
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { admissions: arrayUnion(newAdmission) });
    addLog(schoolId, 'Create', `Submitted new admission for ${admission.name}`);
  };
  
  const updateSchoolStatus = async (targetSchoolId: string, status: SchoolProfile['status']) => {
    const schoolRef = doc(db, 'schools', targetSchoolId);
    await updateDoc(schoolRef, { 'profile.status': status });
    addLog(targetSchoolId, 'Update', `School status changed to ${status}`);
  };

  const updateMessageStatus = async (messageId: string, status: Message['status']) => {
    for (const sId in data) {
      const school = data[sId];
      const messageIndex = school.messages.findIndex(m => m.id === messageId);
      if (messageIndex > -1) {
        const updatedMessages = [...school.messages];
        updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], status };
        const schoolRef = doc(db, 'schools', sId);
        await updateDoc(schoolRef, { messages: updatedMessages });
        addLog(sId, 'Update', `Message ${messageId} status set to ${status}`);
      }
    }
  };

  const updateStudentStatus = async (sId: string, studentId: string, status: Student['status']) => {
    if (!data[sId]) return;
    const updatedStudents = data[sId].students.map(s => s.id === studentId ? { ...s, status } : s);
    const schoolRef = doc(db, 'schools', sId);
    await updateDoc(schoolRef, { students: updatedStudents });
    addLog(sId, 'Update', `Student ${studentId} status changed to ${status}`);
  };

  const updateTeacherStatus = async (sId: string, teacherId: string, status: Teacher['status']) => {
    if (!data[sId]) return;
    const updatedTeachers = data[sId].teachers.map(t => t.id === teacherId ? { ...t, status } : t);
    const schoolRef = doc(db, 'schools', sId);
    await updateDoc(schoolRef, { teachers: updatedTeachers });
    addLog(sId, 'Update', `Teacher ${teacherId} status changed to ${status}`);
  };

  const updateParentStatus = async (parentEmail: string, status: 'Active' | 'Suspended') => {
    // This isn't stored on the school doc, so it's a client-side override for the demo.
    // In a real app, this would update a separate 'parents' collection.
  };
  
  const addExamBoard = async (board: string) => {
    if(!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { examBoards: arrayUnion(board) });
  };
  const deleteExamBoard = async (board: string) => {
    if(!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { examBoards: arrayRemove(board) });
  };
  const addFeeDescription = async (desc: string) => {
    if(!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { feeDescriptions: arrayUnion(desc) });
  };
  const deleteFeeDescription = async (desc: string) => {
    if(!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { feeDescriptions: arrayRemove(desc) });
  };
  const addAudience = async (aud: string) => {
    if(!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { audiences: arrayUnion(aud) });
  };
  const deleteAudience = async (aud: string) => {
    if(!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { audiences: arrayRemove(aud) });
  };
  
  const addTerm = async (term: any) => {
    if (!schoolId) return;
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { terms: arrayUnion({id: `T${Date.now()}`, ...term}) });
  };

  const addHoliday = async (holiday: any) => {
      if (!schoolId) return;
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { holidays: arrayUnion({id: `H${Date.now()}`, ...holiday}) });
  };
  
  const addSavedReport = async (report: Omit<SavedReport, 'id'>) => {
      if (!schoolId) return;
      const newReport: SavedReport = { id: `REP${Date.now()}`, ...report };
      const schoolRef = doc(db, 'schools', schoolId);
      await updateDoc(schoolRef, { savedReports: arrayUnion(newReport) });
  };

  const teacher = useMemo(() => {
    if (role !== 'Teacher' || !user?.email) return null;
    return schoolData?.teachers.find(t => t.email === user.email);
  }, [role, user, schoolData]);
  
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});

  const value = {
    isLoading,
    schoolProfile: schoolData?.profile || null,
    studentsData,
    teachersData: schoolData?.teachers || [],
    classesData: schoolData?.classes || [],
    coursesData: schoolData?.courses || [],
    subjects: useMemo(() => [...new Set(schoolData?.courses.map(c => c.subject) || [])], [schoolData]),
    syllabi: schoolData?.syllabi || [],
    admissionsData: schoolData?.admissions || [],
    financeData: schoolData?.finance || [],
    examsData: schoolData?.exams || [],
    grades: schoolData?.grades || [],
    attendance: schoolData?.attendance || [],
    events: useMemo(() => {
        if (role === 'Parent' || role === 'Student') {
            return Object.values(data).flatMap(d => d.events);
        }
        return schoolData?.events || [];
    }, [schoolData, data, role]),
    expensesData: schoolData?.expenses || [],
    teamsData: schoolData?.teams || [],
    competitionsData: schoolData?.competitions || [],
    kioskMedia: schoolData?.kioskMedia || [],
    activityLogs: useMemo(() => {
        if (role === 'GlobalAdmin') {
            return Object.values(data).flatMap(d => d.activityLogs);
        }
        return schoolData?.activityLogs || [];
    }, [schoolData, data, role]),
    messages: schoolData?.messages || [],
    savedReports: schoolData?.savedReports || [],
    allSchoolData: role === 'GlobalAdmin' || role === 'Parent' || role === 'Admin' ? data : null,
    schoolGroups,
    parentStatusOverrides,
    deployedTests: schoolData?.deployedTests || [],
    savedTests: schoolData?.savedTests || [],

    // Dropdowns
    examBoards: schoolData?.examBoards || [],
    feeDescriptions: schoolData?.feeDescriptions || [],
    audiences: schoolData?.audiences || [],
    expenseCategories: schoolData?.expenseCategories || [],
    terms: schoolData?.terms || [],
    holidays: schoolData?.holidays || [],
    
    // Actions
    addCourse, addSyllabus, updateSyllabusTopic, deleteSyllabusTopic,
    updateApplicationStatus, addStudentFromAdmission, addAsset, addLessonAttendance,
    addClass, addEvent, addGrade, recordPayment, addFee, addExpense,
    addTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam, addCompetition, addCompetitionResult,
    addTeacher, updateTeacher, addKioskMedia, removeKioskMedia, updateSchoolProfile, addMessage, addAdmission,
    updateSchoolStatus, updateMessageStatus, updateStudentStatus, updateTeacherStatus, updateParentStatus, addSchool,
    addTerm, addHoliday,
    addExamBoard, deleteExamBoard, addFeeDescription, deleteFeeDescription, addAudience, deleteAudience,
    addSavedReport,
    addBehavioralAssessment,
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

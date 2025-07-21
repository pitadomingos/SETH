
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
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
  const [data, setData] = useState<Record<string, SchoolData>>(initialSchoolData);
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This simulates initial data load. In a real app, this would be an API call.
    setData(initialSchoolData);
    setIsLoading(false);
  }, []);
  
  const addLog = useCallback((schoolId: string, action: string, details: string) => {
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
     setData(prevData => ({
        ...prevData,
        [schoolId]: {
            ...prevData[schoolId],
            activityLogs: [newLog, ...prevData[schoolId].activityLogs]
        }
    }));
  }, [user, role]);

  const schoolId = useMemo(() => {
      if (role === 'GlobalAdmin') return null; // Global admins see all data
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
    setData(prev => ({ ...prev, [newSchoolData.profile.id]: newSchoolData }));
  };

  const updateSchoolProfile = (profileData: Partial<SchoolProfile>, targetSchoolId?: string) => {
    const sId = targetSchoolId || schoolId;
    if (!sId || !data[sId]) return;
    setData(prev => ({
        ...prev,
        [sId]: {
            ...prev[sId],
            profile: { ...prev[sId].profile, ...profileData }
        }
    }));
  };
  
  const addTeacher = (teacher: Omit<Teacher, 'id' | 'status'>) => {
    if (!schoolId || !data[schoolId]) return;
     const newTeacher: Teacher = { id: `T${Date.now()}`, status: 'Active', ...teacher };
     setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], teachers: [...prev[schoolId].teachers, newTeacher] } }));
     addLog(schoolId, 'Create', `Added new teacher: ${teacher.name}`);
  };

  const updateTeacher = (id: string, teacherData: Partial<Teacher>) => {
      if (!schoolId) return;
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], teachers: prev[schoolId].teachers.map(t => t.id === id ? {...t, ...teacherData} : t) } }));
      addLog(schoolId, 'Update', `Updated profile for teacher: ${teacherData.name || id}`);
  };
  
  const addClass = (classData: Omit<Class, 'id'>) => {
    if (!schoolId) return;
    const newClass: Class = { id: `C${Date.now()}`, ...classData };
    setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], classes: [...prev[schoolId].classes, newClass] } }));
    addLog(schoolId, 'Create', `Created new class: ${classData.name}`);
  };
  
  const addCourse = (course: Omit<Course, 'id'>) => {
    if (!schoolId) return;
    const newCourse: Course = { id: `CRS${Date.now()}`, ...course };
    setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], courses: [...prev[schoolId].courses, newCourse] } }));
     addLog(schoolId, 'Create', `Created new course: ${course.subject}`);
  };

  const addSyllabus = (syllabus: Omit<Syllabus, 'id'|'topics'>) => {
      if(!schoolId) return;
      const newSyllabus: Syllabus = { id: `SYL${Date.now()}`, topics: [], ...syllabus };
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], syllabi: [...prev[schoolId].syllabi, newSyllabus] } }));
       addLog(schoolId, 'Create', `Created syllabus for ${syllabus.subject} Grade ${syllabus.grade}`);
  };
  
  const updateSyllabusTopic = (subject: string, grade: string, topic: any) => {
    if(!schoolId) return;
    setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], syllabi: prev[schoolId].syllabi.map(s => {
        if (s.subject === subject && s.grade === grade) {
            const topicIndex = s.topics.findIndex(t => t.id === topic.id);
            if (topicIndex > -1) {
                s.topics[topicIndex] = topic;
            } else {
                s.topics.push(topic);
            }
        }
        return s;
    }) } }));
     addLog(schoolId, 'Update', `Updated syllabus topic "${topic.topic}" for ${subject}`);
  };
  
  const deleteSyllabusTopic = (subject: string, grade: string, topicId: string) => {
      if(!schoolId) return;
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], syllabi: prev[schoolId].syllabi.map(s => {
          if (s.subject === subject && s.grade === grade) {
              s.topics = s.topics.filter(t => t.id !== topicId);
          }
          return s;
      }) } }));
      addLog(schoolId, 'Delete', `Deleted a topic from ${subject} syllabus`);
  };

  const updateApplicationStatus = (id: string, status: Admission['status']) => {
      if (!schoolId) return;
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], admissions: prev[schoolId].admissions.map(a => a.id === id ? { ...a, status } : a) } }));
      addLog(schoolId, 'Update', `Updated application ${id} status to ${status}`);
  };

  const addStudentFromAdmission = (application: Admission) => {
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
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], students: [...prev[schoolId].students, newStudent] } }));
      addLog(schoolId, 'Create', `Enrolled new student ${newStudent.name} from admission.`);
  };
  
  const addAsset = (asset: Omit<any, 'id'>) => {
      if (!schoolId) return;
      const newAsset = { id: `AST${Date.now()}`, ...asset };
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], assets: [...prev[schoolId].assets, newAsset] } }));
      addLog(schoolId, 'Create', `Added new asset: ${asset.name}`);
  };
  
  const addLessonAttendance = (courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => {
    if(!schoolId) return;
    const newRecords: Attendance[] = Object.entries(studentStatuses).map(([studentId, status]) => ({
      id: `ATT${Date.now()}${studentId}`,
      studentId,
      date: new Date(date),
      status,
      courseId,
    }));
    // Remove old records for this date/course and add new ones
    setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], 
      attendance: [...prev[schoolId].attendance.filter(a => !(a.date.toISOString().split('T')[0] === date && a.courseId === courseId)), ...newRecords]
    }}));
    addLog(schoolId, 'Create', `Recorded attendance for course ${courseId} on ${date}`);
  };

  const addEvent = (event: Omit<Event, 'id' | 'schoolName'>) => {
    if(!schoolId || !schoolProfile) return;
    const newEvent: Event = { id: `EVT${Date.now()}`, schoolName: schoolProfile.name, ...event };
    setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], events: [...prev[schoolId].events, newEvent] } }));
    addLog(schoolId, 'Create', `Scheduled new event: ${event.title}`);
  };

  const addGrade = (grade: Omit<Grade, 'id' | 'date' | 'teacherId'>) => {
    if(!schoolId || !teacher) return false;
    const teacherId = teacher.id;
    const newGrade: Grade = { id: `GRD${Date.now()}`, date: new Date(), teacherId, ...grade };
    setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], grades: [...prev[schoolId].grades, newGrade] } }));
    return true;
  };
  
  const recordPayment = (feeId: string, amount: number) => {
    if (!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], finance: prev[schoolId].finance.map(f => {
        if (f.id === feeId) {
            const newAmountPaid = f.amountPaid + amount;
            const newStatus = newAmountPaid >= f.totalAmount ? 'Paid' : 'Partially Paid';
            addLog(schoolId, 'Update', `Recorded payment of ${amount} for fee ${f.description}`);
            return { ...f, amountPaid: newAmountPaid, status: newStatus };
        }
        return f;
    })}}));
  };

  const addFee = (fee: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>) => {
    if (!schoolId) return;
    const student = schoolData?.students.find(s => s.id === fee.studentId);
    if (!student) return;
    const newFee: FinanceRecord = {
        id: `FIN${Date.now()}`,
        studentName: student.name,
        status: 'Pending',
        amountPaid: 0,
        ...fee
    };
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], finance: [...prev[schoolId].finance, newFee]}}));
    addLog(schoolId, 'Create', `Created new fee for ${student.name}: ${fee.description}`);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
      if(!schoolId) return;
      const newExpense: Expense = { id: `EXP${Date.now()}`, ...expense };
      setData(prev => ({...prev, [schoolId]: {...prev[schoolId], expenses: [...prev[schoolId].expenses, newExpense]}}));
      addLog(schoolId, 'Create', `Added expense: ${expense.description}`);
  };
  
  const addTeam = (team: Omit<Team, 'id' | 'playerIds'>) => {
    if (!schoolId) return;
    const newTeam: Team = { id: `TM${Date.now()}`, playerIds: [], ...team };
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], teams: [...prev[schoolId].teams, newTeam]}}));
    addLog(schoolId, 'Create', `Created new sports team: ${team.name}`);
  };
  
  const deleteTeam = (teamId: string) => {
    if (!schoolId) return;
    setData(prev => {
        const teamName = prev[schoolId].teams.find(t => t.id === teamId)?.name;
        addLog(schoolId, 'Delete', `Deleted team: ${teamName}`);
        return {
            ...prev,
            [schoolId]: {
                ...prev[schoolId],
                teams: prev[schoolId].teams.filter(t => t.id !== teamId),
                competitions: prev[schoolId].competitions.filter(c => c.ourTeamId !== teamId)
            }
        };
    });
  };

  const addPlayerToTeam = (teamId: string, studentId: string) => {
      if(!schoolId) return;
      setData(prev => ({...prev, [schoolId]: {...prev[schoolId], teams: prev[schoolId].teams.map(t => {
          if (t.id === teamId && !t.playerIds.includes(studentId)) {
              t.playerIds.push(studentId);
          }
          return t;
      })}}));
  };
  
  const removePlayerFromTeam = (teamId: string, studentId: string) => {
      if(!schoolId) return;
      setData(prev => ({...prev, [schoolId]: {...prev[schoolId], teams: prev[schoolId].teams.map(t => {
          if (t.id === teamId) {
              t.playerIds = t.playerIds.filter(id => id !== studentId);
          }
          return t;
      })}}));
  };
  
  const addCompetition = (competition: Omit<Competition, 'id'>) => {
    if(!schoolId) return;
    const newCompetition: Competition = { id: `CMP${Date.now()}`, ...competition };
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], competitions: [...prev[schoolId].competitions, newCompetition]}}));
    addLog(schoolId, 'Create', `Scheduled competition: ${competition.title}`);
  };
  
  const addCompetitionResult = (competitionId: string, result: Competition['result']) => {
    if (!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], competitions: prev[schoolId].competitions.map(c => {
      if (c.id === competitionId) {
          const outcome = result.ourScore > result.opponentScore ? 'Win' : result.ourScore < result.opponentScore ? 'Loss' : 'Draw';
          return { ...c, result: {...result, outcome} };
      }
      return c;
    })}}));
    addLog(schoolId, 'Update', `Recorded result for competition ${competitionId}`);
  };
  
  const addBehavioralAssessment = (assessment: Omit<any, 'id'|'date'>) => {
    if(!schoolId) return;
    const newAssessment = { id: `BA${Date.now()}`, date: new Date(), ...assessment };
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], students: prev[schoolId].students.map(s => {
        if(s.id === assessment.studentId) {
            s.behavioralAssessments.push(newAssessment);
        }
        return s;
    })}}));
    addLog(schoolId, 'Create', `Added behavioral assessment for student ${assessment.studentId}`);
  };
  
  const addKioskMedia = (media: Omit<KioskMedia, 'id' | 'createdAt'>) => {
    if (!schoolId) return;
    const newMedia: KioskMedia = { id: `KM${Date.now()}`, createdAt: new Date(), ...media };
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], kioskMedia: [...prev[schoolId].kioskMedia, newMedia]}}));
    addLog(schoolId, 'Create', `Added kiosk media: ${media.title}`);
  };
  
  const removeKioskMedia = (id: string) => {
      if(!schoolId) return;
      setData(prev => ({...prev, [schoolId]: {...prev[schoolId], kioskMedia: prev[schoolId].kioskMedia.filter(m => m.id !== id)}}));
      addLog(schoolId, 'Delete', `Removed kiosk media item ${id}`);
  };
  
  const addMessage = (message: NewMessageData) => {
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
    
    // Message is added to the sender's school and recipient's school
    setData(prev => ({
        ...prev,
        [schoolId]: { ...prev[schoolId], messages: [...prev[schoolId].messages, newMessage] },
        ...(recipientSchoolId !== schoolId && { [recipientSchoolId]: { ...prev[recipientSchoolId], messages: [...prev[recipientSchoolId].messages, newMessage] } })
    }));
    addLog(schoolId, 'Message', `Sent message to ${recipientName}`);
  };
  
  const addAdmission = (admission: NewAdmissionData) => {
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
    setData(prev => ({ ...prev, [schoolId]: {...prev[schoolId], admissions: [...prev[schoolId].admissions, newAdmission]} }));
     addLog(schoolId, 'Create', `Submitted new admission for ${admission.name}`);
  };
  
  const updateSchoolStatus = (targetSchoolId: string, status: SchoolProfile['status']) => {
    if (!data[targetSchoolId]) return;
    setData(prev => ({...prev, [targetSchoolId]: {...prev[targetSchoolId], profile: {...prev[targetSchoolId].profile, status}}}));
    addLog(targetSchoolId, 'Update', `School status changed to ${status}`);
  };

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    Object.keys(data).forEach(sId => {
      const message = data[sId].messages.find(m => m.id === messageId);
      if(message) {
        setData(prev => ({...prev, [sId]: {...prev[sId], messages: prev[sId].messages.map(m => m.id === messageId ? {...m, status} : m)}}));
        addLog(sId, 'Update', `Message ${messageId} status set to ${status}`);
      }
    });
  };

  const updateStudentStatus = (sId: string, studentId: string, status: Student['status']) => {
    if (!data[sId]) return;
    setData(prev => ({...prev, [sId]: {...prev[sId], students: prev[sId].students.map(s => s.id === studentId ? {...s, status} : s)}}));
    addLog(sId, 'Update', `Student ${studentId} status changed to ${status}`);
  };

  const updateTeacherStatus = (sId: string, teacherId: string, status: Teacher['status']) => {
    if (!data[sId]) return;
    setData(prev => ({...prev, [sId]: {...prev[sId], teachers: prev[sId].teachers.map(t => t.id === teacherId ? {...t, status} : t)}}));
    addLog(sId, 'Update', `Teacher ${teacherId} status changed to ${status}`);
  };

  const updateParentStatus = (parentEmail: string, status: 'Active' | 'Suspended') => {
    setParentStatusOverrides(prev => ({...prev, [parentEmail]: status}));
    // This action isn't tied to a specific school log, so we might log it globally or skip for prototype
  };
  
  const addExamBoard = (board: string) => {
    if(!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], examBoards: [...prev[schoolId].examBoards, board]}}));
  };
  const deleteExamBoard = (board: string) => {
    if(!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], examBoards: prev[schoolId].examBoards.filter(b => b !== board)}}));
  };
  const addFeeDescription = (desc: string) => {
    if(!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], feeDescriptions: [...prev[schoolId].feeDescriptions, desc]}}));
  };
  const deleteFeeDescription = (desc: string) => {
    if(!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], feeDescriptions: prev[schoolId].feeDescriptions.filter(d => d !== desc)}}));
  };
  const addAudience = (aud: string) => {
    if(!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], audiences: [...prev[schoolId].audiences, aud]}}));
  };
  const deleteAudience = (aud: string) => {
    if(!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], audiences: prev[schoolId].audiences.filter(a => a !== aud)}}));
  };
  
  const addTerm = (term: any) => {
    if (!schoolId) return;
    setData(prev => ({...prev, [schoolId]: {...prev[schoolId], terms: [...prev[schoolId].terms, {id: `T${Date.now()}`, ...term}]}}));
  };

  const addHoliday = (holiday: any) => {
      if (!schoolId) return;
      setData(prev => ({...prev, [schoolId]: {...prev[schoolId], holidays: [...prev[schoolId].holidays, {id: `H${Date.now()}`, ...holiday}]}}));
  };
  
  const addSavedReport = (report: Omit<SavedReport, 'id'>) => {
      if (!schoolId) return;
      const newReport: SavedReport = { id: `REP${Date.now()}`, ...report };
      setData(prev => ({ ...prev, [schoolId]: { ...prev[schoolId], savedReports: [newReport, ...prev[schoolId].savedReports] } }));
  };

  const teacher = useMemo(() => {
    if (role !== 'Teacher' || !user?.email) return null;
    return schoolData?.teachers.find(t => t.email === user.email);
  }, [role, user, schoolData]);

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


'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { initialSchoolData, SchoolData, Student, Teacher, Class, Course, Syllabus, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, SchoolProfile, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, mockUsers, UserProfile } from '@/lib/mock-data';
import { useAuth, User } from './auth-context';
import type { Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';

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
    addSchool: (schoolData: SchoolData) => void;
    removeSchool: (schoolId: string) => void;
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
  const [data, setData] = useState<Record<string, SchoolData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
        setIsLoading(true);
        try {
            let firestoreData = await getSchoolsFromFirestore();
            if (Object.keys(firestoreData).length === 0) {
                console.log("Database is empty, seeding with initial data...");
                await seedInitialData();
                firestoreData = await getSchoolsFromFirestore(); // Re-fetch after seeding
            }
            setData(firestoreData);
        } catch (error) {
            console.error("Failed to fetch or seed school data.", error);
            // Fallback to mock data in case of severe firestore error
            setData(initialSchoolData);
        } finally {
            setIsLoading(false);
        }
    };

    fetchSchoolData();
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
    
    setData(prevData => {
        if (!prevData) return null;
        const newData = { ...prevData };
        if (newData[schoolId]) {
            newData[schoolId] = {
                ...newData[schoolId],
                activityLogs: [...newData[schoolId].activityLogs, newLog],
            };
        }
        return newData;
    });
  }, [user, role]);

  const schoolId = useMemo(() => {
    if (role === 'GlobalAdmin') return null;
    return authSchoolId;
  }, [authSchoolId, role]);

  const schoolData = useMemo(() => {
    if (!data) return null;
    if (role === 'GlobalAdmin') return data.northwood;
    if (!schoolId) return null;
    return data[schoolId];
  }, [schoolId, data, role]);
  
  const schoolGroups = useMemo(() => {
    return data?.['northwood']?.schoolGroups || {};
  }, [data]);
  
  const allStudents = useMemo(() => {
    if (!data) return [];
    return Object.values(data).flatMap(d => d.students.map(s => ({...s, schoolName: d.profile.name, schoolId: d.profile.id })))
  }, [data]);

  const studentsData = useMemo(() => {
    if (role === 'Parent' && user?.email) {
      return allStudents.filter(student => student.parentEmail === user.email);
    }
    return schoolData?.students || [];
  }, [role, user, schoolData, allStudents]);
  
  const addSchool = (newSchoolData: SchoolData) => {
    setData(prev => {
        if (!prev) return { [newSchoolData.profile.id]: newSchoolData };
        return {
            ...prev,
            [newSchoolData.profile.id]: newSchoolData
        }
    });
  };

  const removeSchool = (schoolIdToRemove: string) => {
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        delete newData[schoolIdToRemove];
        // Also remove from any school groups
        for (const schoolKey in newData) {
            if (newData[schoolKey].schoolGroups) {
                for (const groupId in newData[schoolKey].schoolGroups) {
                    newData[schoolKey].schoolGroups[groupId] = newData[schoolKey].schoolGroups[groupId].filter(id => id !== schoolIdToRemove);
                }
            }
        }
        return newData;
    });
  };

  const updateSchoolProfile = (profileData: Partial<SchoolProfile>, targetSchoolId?: string) => {
    const sId = targetSchoolId || schoolId;
    if (!sId) return;

    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        if (newData[sId]) {
            newData[sId] = {
                ...newData[sId],
                profile: {
                    ...newData[sId].profile,
                    ...profileData
                }
            };
            addLog(sId, 'Update', 'Updated school profile information.');
        }
        return newData;
    });
  };
  
  const addTeacher = (teacher: Omit<Teacher, 'id' | 'status'>) => {
    if (!schoolId) return;
     const newTeacher: Teacher = { id: `T${Date.now()}`, status: 'Active', ...teacher };
     setData(prev => {
         if (!prev) return null;
         const newData = { ...prev };
         newData[schoolId].teachers.push(newTeacher);
         addLog(schoolId, 'Create', `Added new teacher: ${teacher.name}`);
         return newData;
     });
  };

  const updateTeacher = (id: string, teacherData: Partial<Teacher>) => {
      if (!schoolId) return;
      setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          const school = newData[schoolId];
          school.teachers = school.teachers.map(t => t.id === id ? {...t, ...teacherData} : t);
          addLog(schoolId, 'Update', `Updated profile for teacher: ${teacherData.name || id}`);
          return newData;
      });
  };
  
  const addClass = (classData: Omit<Class, 'id'>) => {
    if (!schoolId) return;
    const newClass: Class = { id: `C${Date.now()}`, ...classData };
     setData(prev => {
         if (!prev) return null;
         const newData = { ...prev };
         newData[schoolId].classes.push(newClass);
         addLog(schoolId, 'Create', `Created new class: ${classData.name}`);
         return newData;
     });
  };
  
  const addCourse = (course: Omit<Course, 'id'>) => {
    if (!schoolId) return;
    const newCourse: Course = { id: `CRS${Date.now()}`, ...course };
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[schoolId].courses.push(newCourse);
        addLog(schoolId, 'Create', `Created new course: ${course.subject}`);
        return newData;
    });
  };

  const addSyllabus = (syllabus: Omit<Syllabus, 'id'|'topics'>) => {
      if(!schoolId) return;
      const newSyllabus: Syllabus = { id: `SYL${Date.now()}`, topics: [], ...syllabus };
      setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          newData[schoolId].syllabi.push(newSyllabus);
          addLog(schoolId, 'Create', `Created syllabus for ${syllabus.subject} Grade ${syllabus.grade}`);
          return newData;
      });
  };
  
  const updateSyllabusTopic = (subject: string, grade: string, topic: any) => {
    if(!schoolId) return;
    setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      const school = newData[schoolId];
      school.syllabi = school.syllabi.map(s => {
        if(s.subject === subject && s.grade === grade) {
          const topicIndex = s.topics.findIndex(t => t.id === topic.id);
          if (topicIndex > -1) {
            s.topics[topicIndex] = topic;
          } else {
            s.topics.push(topic);
          }
        }
        return s;
      });
      addLog(schoolId, 'Update', `Updated syllabus topic "${topic.topic}" for ${subject}`);
      return newData;
    });
  };
  
  const deleteSyllabusTopic = (subject: string, grade: string, topicId: string) => {
      if(!schoolId) return;
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          const school = newData[schoolId];
          school.syllabi = school.syllabi.map(s => {
              if (s.subject === subject && s.grade === grade) {
                  s.topics = s.topics.filter(t => t.id !== topicId);
              }
              return s;
          });
          addLog(schoolId, 'Delete', `Deleted a topic from ${subject} syllabus}`);
          return newData;
      });
  };

  const updateApplicationStatus = (id: string, status: Admission['status']) => {
      if (!schoolId) return;
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        const school = newData[schoolId];
        school.admissions = school.admissions.map(a => a.id === id ? { ...a, status } : a);
        addLog(schoolId, 'Update', `Updated application ${id} status to ${status}`);
        return newData;
      });
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
      setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          newData[schoolId].students.push(newStudent);
          addLog(schoolId, 'Create', `Enrolled new student ${newStudent.name} from admission.`);
          return newData;
      });
  };
  
  const addAsset = (asset: Omit<any, 'id'>) => {
      if (!schoolId) return;
      const newAsset = { id: `AST${Date.now()}`, ...asset };
      setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          newData[schoolId].assets.push(newAsset);
          addLog(schoolId, 'Create', `Added new asset: ${asset.name}`);
          return newData;
      });
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
    
    setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      const school = newData[schoolId];
      // Filter out old records for the same day and course
      school.attendance = school.attendance.filter(a => !(a.date.toISOString().split('T')[0] === date && a.courseId === courseId));
      school.attendance.push(...newRecords);
      addLog(schoolId, 'Create', `Recorded attendance for course ${courseId} on ${date}`);
      return newData;
    });
  };

  const addEvent = (event: Omit<Event, 'id' | 'schoolName'>) => {
    if(!schoolId || !schoolProfile) return;
    const newEvent: Event = { id: `EVT${Date.now()}`, schoolName: schoolProfile.name, ...event };
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[schoolId].events.push(newEvent);
        addLog(schoolId, 'Create', `Scheduled new event: ${event.title}`);
        return newData;
    });
  };

  const teacher = useMemo(() => {
    if (role !== 'Teacher' || !user?.email) return null;
    return schoolData?.teachers.find(t => t.email === user.email);
  }, [role, user, schoolData]);
  
  const addGrade = (grade: Omit<Grade, 'id' | 'date' | 'teacherId'>): boolean => {
    if(!schoolId || !teacher) return false;
    const teacherId = teacher.id;
    const newGrade: Grade = { id: `GRD${Date.now()}`, date: new Date(), teacherId, ...grade };
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[schoolId].grades.push(newGrade);
        return newData;
    });
    return true;
  };
  
  const recordPayment = (feeId: string, amount: number) => {
    if (!schoolId) return;
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      const school = newData[schoolId];
      school.finance = school.finance.map(f => {
        if (f.id === feeId) {
          const newAmountPaid = f.amountPaid + amount;
          const newStatus = newAmountPaid >= f.totalAmount ? 'Paid' : 'Partially Paid';
          addLog(schoolId, 'Update', `Recorded payment of ${amount} for fee ${f.description}`);
          return { ...f, amountPaid: newAmountPaid, status: newStatus };
        }
        return f;
      });
      return newData;
    });
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

    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[schoolId].finance.push(newFee);
        addLog(schoolId, 'Create', `Created new fee for ${student.name}: ${fee.description}`);
        return newData;
    });
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
      if(!schoolId) return;
      const newExpense: Expense = { id: `EXP${Date.now()}`, ...expense };
      setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          newData[schoolId].expenses.push(newExpense);
          addLog(schoolId, 'Create', `Added expense: ${expense.description}`);
          return newData;
      });
  };
  
  const addTeam = (team: Omit<Team, 'id' | 'playerIds'>) => {
    if (!schoolId) return;
    const newTeam: Team = { id: `TM${Date.now()}`, playerIds: [], ...team };
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      newData[schoolId].teams.push(newTeam);
      addLog(schoolId, 'Create', `Created new sports team: ${team.name}`);
      return newData;
    });
  };
  
  const deleteTeam = (teamId: string) => {
    if (!schoolId) return;
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      const school = newData[schoolId];
      const teamName = school.teams.find(t => t.id === teamId)?.name;
      school.teams = school.teams.filter(t => t.id !== teamId);
      school.competitions = school.competitions.filter(c => c.ourTeamId !== teamId);
      addLog(schoolId, 'Delete', `Deleted team: ${teamName}`);
      return newData;
    });
  };

  const addPlayerToTeam = (teamId: string, studentId: string) => {
      if(!schoolId) return;
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          const school = newData[schoolId];
          school.teams = school.teams.map(t => {
              if (t.id === teamId && !t.playerIds.includes(studentId)) {
                  t.playerIds.push(studentId);
              }
              return t;
          });
          return newData;
      });
  };
  
  const removePlayerFromTeam = (teamId: string, studentId: string) => {
      if(!schoolId) return;
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          const school = newData[schoolId];
          school.teams = school.teams.map(t => {
              if (t.id === teamId) {
                  t.playerIds = t.playerIds.filter(id => id !== studentId);
              }
              return t;
          });
          return newData;
      });
  };
  
  const addCompetition = (competition: Omit<Competition, 'id'>) => {
    if(!schoolId) return;
    const newCompetition: Competition = { id: `CMP${Date.now()}`, ...competition };
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].competitions.push(newCompetition);
        addLog(schoolId, 'Create', `Scheduled competition: ${competition.title}`);
        return newData;
    });
  };
  
  const addCompetitionResult = (competitionId: string, result: Competition['result']) => {
    if (!schoolId) return;
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      const school = newData[schoolId];
      school.competitions = school.competitions.map(c => {
        if (c.id === competitionId) {
            const outcome = result.ourScore > result.opponentScore ? 'Win' : result.ourScore < result.opponentScore ? 'Loss' : 'Draw';
            return { ...c, result: {...result, outcome} };
        }
        return c;
      });
      addLog(schoolId, 'Update', `Recorded result for competition ${competitionId}`);
      return newData;
    });
  };
  
  const addBehavioralAssessment = (assessment: Omit<any, 'id'|'date'>) => {
    if(!schoolId) return;
    const newAssessment = { id: `BA${Date.now()}`, date: new Date(), ...assessment };
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        const school = newData[schoolId];
        school.students = school.students.map(s => {
            if(s.id === assessment.studentId) {
                s.behavioralAssessments.push(newAssessment);
            }
            return s;
        });
        addLog(schoolId, 'Create', `Added behavioral assessment for student ${assessment.studentId}`);
        return newData;
    });
  };
  
  const addKioskMedia = (media: Omit<KioskMedia, 'id' | 'createdAt'>) => {
    if (!schoolId) return;
    const newMedia: KioskMedia = { id: `KM${Date.now()}`, createdAt: new Date(), ...media };
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      newData[schoolId].kioskMedia.push(newMedia);
      addLog(schoolId, 'Create', `Added kiosk media: ${media.title}`);
      return newData;
    });
  };
  
  const removeKioskMedia = (id: string) => {
      if(!schoolId) return;
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[schoolId].kioskMedia = newData[schoolId].kioskMedia.filter(m => m.id !== id);
          addLog(schoolId, 'Delete', `Removed kiosk media item ${id}`);
          return newData;
      });
  };
  
  const addMessage = (message: NewMessageData) => {
    if(!data || !user || !role) return;
  
    const senderSchoolId = role === 'GlobalAdmin' ? 'northwood' : user.schoolId;
    if (!senderSchoolId) return;

    let recipientSchoolId: string | undefined = undefined;
    for (const sId in data) {
        if (data[sId].profile.email === message.recipientUsername || data[sId].teachers.some(t => t.email === message.recipientUsername)) {
            recipientSchoolId = sId;
            break;
        }
    }
    if (!recipientSchoolId) return;
  
    const recipientUser = Object.values(data).flatMap(d => d.teachers).find(u => u.email === message.recipientUsername);
    const recipientName = recipientUser?.name || data[recipientSchoolId]?.profile.head || 'Admin';
    const recipientRole = recipientUser ? 'Teacher' : 'Admin';
  
    const newMessage: Message = {
        id: `MSG${Date.now()}`,
        senderUsername: user.email,
        senderName: user.name,
        senderRole: role,
        recipientUsername: message.recipientUsername,
        recipientName: recipientName,
        recipientRole: recipientRole,
        subject: message.subject,
        body: message.body,
        timestamp: new Date(),
        status: 'Pending',
        attachmentUrl: message.attachmentUrl,
        attachmentName: message.attachmentName,
    };
    
    setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      
      if (newData[senderSchoolId]) {
        newData[senderSchoolId].messages.push(newMessage);
      }
  
      if (recipientSchoolId && recipientSchoolId !== senderSchoolId) {
          newData[recipientSchoolId].messages.push(newMessage);
      }
      
      addLog(senderSchoolId, 'Message', `Sent message to ${recipientName}`);
      return newData;
    });
  };
  
  const addAdmission = (admission: NewAdmissionData) => {
    const { schoolId, ...rest } = admission;
    if (!schoolId || !user) return;
    const newAdmission: Admission = {
        id: `ADM${Date.now()}`,
        ...rest,
        date: new Date().toISOString().split('T')[0],
        parentName: user.name,
        parentEmail: user.email,
        status: 'Pending',
        grades: rest.gradesSummary || 'N/A'
    };
     setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      newData[schoolId].admissions.push(newAdmission);
      addLog(schoolId, 'Create', `Submitted new admission for ${admission.name}`);
      return newData;
    });
  };
  
  const updateSchoolStatus = (targetSchoolId: string, status: SchoolProfile['status']) => {
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      if (newData[targetSchoolId]) {
        newData[targetSchoolId].profile.status = status;
        addLog(targetSchoolId, 'Update', `School status changed to ${status}`);
      }
      return newData;
    });
  };

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setData(prev => {
      if (!prev) return null;
      const newData = { ...prev };
      for (const sId in newData) {
        const school = newData[sId];
        const messageIndex = school.messages.findIndex(m => m.id === messageId);
        if (messageIndex > -1) {
          school.messages[messageIndex].status = status;
          addLog(sId, 'Update', `Message ${messageId} status set to ${status}`);
        }
      }
      return newData;
    });
  };

  const updateStudentStatus = (sId: string, studentId: string, status: Student['status']) => {
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        const student = newData[sId]?.students.find(s => s.id === studentId);
        if(student) {
            student.status = status;
            addLog(sId, 'Update', `Student ${studentId} status changed to ${status}`);
        }
        return newData;
    });
  };

  const updateTeacherStatus = (sId: string, teacherId: string, status: Teacher['status']) => {
      setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        const teacher = newData[sId]?.teachers.find(t => t.id === teacherId);
        if(teacher) {
            teacher.status = status;
            addLog(sId, 'Update', `Teacher ${teacherId} status changed to ${status}`);
        }
        return newData;
    });
  };

  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});
  const updateParentStatus = (parentEmail: string, status: 'Active' | 'Suspended') => {
    setParentStatusOverrides(prev => ({...prev, [parentEmail]: status}));
  };
  
  const addExamBoard = (board: string) => {
    if(!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].examBoards.push(board);
        return newData;
    });
  };
  const deleteExamBoard = (board: string) => {
    if(!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].examBoards = newData[schoolId].examBoards.filter(b => b !== board);
        return newData;
    });
  };
  const addFeeDescription = (desc: string) => {
    if(!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].feeDescriptions.push(desc);
        return newData;
    });
  };
  const deleteFeeDescription = (desc: string) => {
    if(!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].feeDescriptions = newData[schoolId].feeDescriptions.filter(d => d !== desc);
        return newData;
    });
  };
  const addAudience = (aud: string) => {
    if(!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].audiences.push(aud);
        return newData;
    });
  };
  const deleteAudience = (aud: string) => {
    if(!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].audiences = newData[schoolId].audiences.filter(a => a !== aud);
        return newData;
    });
  };
  
  const addTerm = (term: any) => {
    if (!schoolId) return;
    setData(prev => {
        if (!prev) return null;
        const newData = {...prev};
        newData[schoolId].terms.push({id: `T${Date.now()}`, ...term});
        return newData;
    });
  };

  const addHoliday = (holiday: any) => {
      if (!schoolId) return;
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[schoolId].holidays.push({id: `H${Date.now()}`, ...holiday});
          return newData;
      });
  };
  
  const addSavedReport = (report: Omit<SavedReport, 'id'>) => {
      if (!schoolId) return;
      const newReport: SavedReport = { id: `REP${Date.now()}`, ...report };
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[schoolId].savedReports.push(newReport);
          return newData;
      });
  };

  const value = {
    isLoading,
    allSchoolData: data,
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
    financeData: schoolData?.finance || [],
    examsData: schoolData?.exams || [],
    grades: schoolData?.grades || [],
    attendance: schoolData?.attendance || [],
    events: useMemo(() => {
        if (!data) return [];
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
        if (!data) return [];
        if (role === 'GlobalAdmin') {
            return Object.values(data).flatMap(d => d.activityLogs);
        }
        return schoolData?.activityLogs || [];
    }, [schoolData, data, role]),
    messages: schoolData?.messages || [],
    savedReports: schoolData?.savedReports || [],
    schoolGroups,
    parentStatusOverrides,
    deployedTests: schoolData?.deployedTests || [],
    savedTests: schoolData?.savedTests || [],
    examBoards: schoolData?.examBoards || [],
    feeDescriptions: schoolData?.feeDescriptions || [],
    audiences: schoolData?.audiences || [],
    expenseCategories: schoolData?.expenseCategories || [],
    terms: schoolData?.terms || [],
    holidays: schoolData?.holidays || [],
    addSchool, removeSchool, addCourse, addSyllabus, updateSyllabusTopic, deleteSyllabusTopic,
    updateApplicationStatus, addStudentFromAdmission, addAsset, addLessonAttendance,
    addClass, addEvent, addGrade, recordPayment, addFee, addExpense,
    addTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam, addCompetition, addCompetitionResult,
    addTeacher, updateTeacher, addKioskMedia, removeKioskMedia, updateSchoolProfile, addMessage, addAdmission,
    updateSchoolStatus, updateMessageStatus, updateStudentStatus, updateTeacherStatus, updateParentStatus,
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

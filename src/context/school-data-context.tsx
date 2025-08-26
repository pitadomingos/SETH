
'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { initialSchoolData, SchoolData, Student, Teacher, Class, Course, Syllabus, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, SchoolProfile, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, mockUsers, UserProfile, SyllabusTopic, BehavioralAssessment } from '@/lib/mock-data';
import { useAuth, User } from './auth-context';
import type { Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';
import { getGpaFromNumeric } from '@/lib/utils';
import { updateSchoolProfileAction } from '@/app/actions/update-school-action';
import { addTeacherAction, updateTeacherAction, deleteTeacherAction, addClassAction, updateClassAction, deleteClassAction, updateSyllabusTopicAction, deleteSyllabusTopicAction, addSyllabusAction, addCourseAction, updateCourseAction, deleteCourseAction, addFeeAction, recordPaymentAction, addExpenseAction, addTeamAction, deleteTeamAction, addPlayerToTeamAction, removePlayerFromTeamAction, addCompetitionAction, addCompetitionResultAction, updateAdmissionStatusAction, addStudentFromAdmissionAction, addAssetAction, addKioskMediaAction, removeKioskMediaAction, addBehavioralAssessmentAction, addGradeAction, addLessonAttendanceAction, addTestSubmissionAction } from '@/app/actions/school-actions';
import { addTermAction, addHolidayAction, addExamBoardAction, deleteExamBoardAction, addFeeDescriptionAction, deleteFeeDescriptionAction, addAudienceAction, deleteAudienceAction } from '@/app/actions/academic-year-actions';
import { sendMessageAction } from '@/app/actions/messaging-actions';


export type { SchoolData, SchoolProfile, Student, Teacher, Class, Course, SyllabusTopic, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, BehavioralAssessment } from '@/lib/mock-data';

interface SchoolDataContextType {
    // --- Data States ---
    allSchoolData: Record<string, SchoolData> | null;
    allStudents: Student[];
    schoolProfile: SchoolProfile | null;
    studentsData: Student[];
    teachersData: Teacher[];
    classesData: Class[];
    coursesData: Course[];
    syllabi: Syllabus[];
    admissionsData: Admission[];
    financeData: FinanceRecord[];
    assetsData: any[];
    exams: Exam[];
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
    awardsAnnounced: boolean;
    
    // --- Dropdown Data ---
    subjects: string[];
    examBoards: string[];
    feeDescriptions: string[];
    audiences: string[];
    expenseCategories: string[];

    // --- Loading State ---
    isLoading: boolean;

    // --- Action Functions ---
    announceAwards: () => void;
    addSchool: (schoolData: SchoolData) => void;
    removeSchool: (schoolId: string) => void;
    addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
    addSyllabus: (syllabus: Omit<Syllabus, 'id' | 'topics'>) => Promise<void>;
    updateSyllabusTopic: (subject: string, grade: string, topic: any) => Promise<void>;
    deleteSyllabusTopic: (subject: string, grade: string, topicId: string) => Promise<void>;
    updateApplicationStatus: (id: string, status: Admission['status']) => Promise<void>;
    addStudentFromAdmission: (application: Admission) => Promise<void>;
    addAsset: (asset: Omit<any, 'id'>) => Promise<{success: boolean, error?: string}>;
    addLessonAttendance: (courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => Promise<void>;
    addClass: (classData: Omit<Class, 'id'>) => Promise<void>;
    updateClass: (id: string, data: Partial<Class>) => Promise<void>;
    deleteClass: (id: string) => Promise<void>;
    addEvent: (event: Omit<Event, 'id' | 'schoolName'>) => void;
    addGrade: (grade: Omit<Grade, 'id' | 'date' | 'teacherId'>) => Promise<boolean>;
    addTestSubmission: (testId: string, studentId: string, score: number) => Promise<void>;
    recordPayment: (feeId: string, amount: number) => Promise<void>;
    addFee: (fee: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>) => Promise<void>;
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    addTeam: (team: Omit<Team, 'id' | 'playerIds'>) => Promise<void>;
    deleteTeam: (teamId: string) => Promise<void>;
    addPlayerToTeam: (teamId: string, studentId: string) => Promise<void>;
    removePlayerFromTeam: (teamId: string, studentId: string) => Promise<void>;
    addCompetition: (competition: Omit<Competition, 'id'>) => Promise<void>;
    addCompetitionResult: (competitionId: string, result: Competition['result']) => Promise<void>;
    addTeacher: (teacher: Omit<Teacher, 'id' | 'status'>) => Promise<void>;
    updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
    deleteTeacher: (id: string) => Promise<void>;
    addKioskMedia: (media: Omit<KioskMedia, 'id'|'createdAt'>) => Promise<void>;
    removeKioskMedia: (id: string) => Promise<void>;
    updateSchoolProfile: (data: Partial<SchoolProfile>, schoolId?: string) => Promise<boolean>;
    addMessage: (message: NewMessageData) => Promise<void>;
    addAdmission: (admission: NewAdmissionData) => void;
    updateSchoolStatus: (schoolId: string, status: SchoolProfile['status']) => void;
    updateMessageStatus: (messageId: string, status: Message['status']) => void;
    updateStudentStatus: (schoolId: string, studentId: string, status: Student['status']) => void;
    updateTeacherStatus: (schoolId: string, teacherId: string, status: Teacher['status']) => void;
    updateParentStatus: (parentEmail: string, status: 'Active' | 'Suspended') => void;
    addBehavioralAssessment: (assessment: Omit<any, 'id' | 'date'>) => Promise<void>;
    
    // Academic Year
    terms: any[];
    holidays: any[];
    addTerm: (term: any) => Promise<void>;
    addHoliday: (holiday: any) => Promise<void>;

    // Dropdown management
    addExamBoard: (board: string) => Promise<void>;
    deleteExamBoard: (board: string) => Promise<void>;
    addFeeDescription: (desc: string) => Promise<void>;
    deleteFeeDescription: (desc: string) => Promise<void>;
    addAudience: (aud: string) => Promise<void>;
    deleteAudience: (aud: string) => Promise<void>;
    addSavedReport: (report: Omit<SavedReport, 'id'>) => void;
    addDeployedTest: (test: Omit<DeployedTest, 'id' | 'submissions'>) => void;
    addSavedTest: (test: Omit<SavedTest, 'id' | 'createdAt'>) => void;
    deleteSavedTest: (testId: string) => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, schoolId: authSchoolId } = useAuth();
  const [data, setData] = useState<Record<string, SchoolData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [awardsAnnounced, setAwardsAnnounced] = useState(false);
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});

  useEffect(() => {
    const fetchSchoolData = async () => {
        setIsLoading(true);
        try {
            await seedInitialData(); // Always seed the database on startup
            const firestoreData = await getSchoolsFromFirestore();
            
            setData(firestoreData);
            setAwardsAnnounced(firestoreData['northwood']?.profile.awards && firestoreData['northwood'].profile.awards.length > 0);
        } catch (error) {
            console.error("Failed to fetch or seed school data.", error);
            setData(initialSchoolData);
            setAwardsAnnounced(initialSchoolData['northwood']?.profile.awards && initialSchoolData['northwood'].profile.awards.length > 0);
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

  const schoolData = useMemo(() => {
    if (!data || !currentSchoolId) return null;
    return data[currentSchoolId];
  }, [currentSchoolId, data]);

  const allStudents = useMemo(() => {
    if (!data) return [];
    return Object.values(data).flatMap(d => d.students.map(s => ({...s, schoolName: d.profile.name, schoolId: d.profile.id })));
  }, [data]);

  const studentsData = useMemo(() => {
    if (!user || !role || !allStudents.length) return [];
    if (role === 'Parent') {
        return allStudents.filter(student => student.parentEmail === user.email);
    }
    if (!schoolData) return [];
    return schoolData.students;
  }, [role, user, schoolData, allStudents]);

  const schoolGroups = useMemo(() => {
    return data?.['northwood']?.schoolGroups || {};
  }, [data]);
  
  const addLog = useCallback((schoolIdForLog: string, action: string, details: string) => {
    if(!user || !role) return;
    const newLog: ActivityLog = {
      id: `LOG${Date.now()}`,
      timestamp: new Date(),
      schoolId: schoolIdForLog,
      user: user.name,
      role: role,
      action: action,
      details: details,
    };
    
    setData(prevData => {
        if (!prevData) return null;
        const newData = { ...prevData };
        // For Global Admins, log to the "system" (northwood) school to avoid cluttering other schools' logs
        const targetSchoolId = role === 'GlobalAdmin' ? 'northwood' : schoolIdForLog;
        if (newData[targetSchoolId]) {
            newData[targetSchoolId] = {
                ...newData[targetSchoolId],
                activityLogs: [newLog, ...newData[targetSchoolId].activityLogs],
            };
        }
        return newData;
    });
  }, [user, role]);

  const announceAwards = async () => {
    if (!data) return;

    // --- Calculate Winners ---
    const schoolOfTheYear = Object.values(data).map(school => {
        const avgGpa = school.grades.length > 0 ? school.grades.reduce((acc, g) => acc + getGpaFromNumeric(parseFloat(g.grade)), 0) / school.grades.length : 0;
        const collectionRate = school.finance.length > 0 ? school.finance.reduce((acc, f) => acc + f.amountPaid, 0) / school.finance.reduce((acc, f) => acc + f.totalAmount, 0) : 1;
        return { ...school.profile, score: (avgGpa * 0.6) + (collectionRate * 0.4) };
    }).sort((a, b) => b.score - a.score)[0];

    const teacherOfTheYear = Object.values(data).flatMap(school => school.teachers.map(teacher => {
        const teacherCourses = school.courses.filter(c => c.teacherId === teacher.id);
        const studentIds = new Set<string>();
        teacherCourses.forEach(course => {
            const classInfo = school.classes.find(c => c.id === course.classId);
            if (classInfo) {
              school.students.filter(s => s.grade === classInfo.grade && s.class === classInfo.name.split('-')[1].trim()).forEach(s => studentIds.add(s.id));
            }
        });
        const teacherGrades = school.grades.filter(g => studentIds.has(g.studentId) && g.subject === teacher.subject).map(g => parseFloat(g.grade));
        const avgStudentGrade = teacherGrades.length > 0 ? teacherGrades.reduce((sum, g) => sum + g, 0) / teacherGrades.length : 0;
        return { ...teacher, avgStudentGrade };
    })).sort((a, b) => b.avgStudentGrade - a.avgStudentGrade)[0];

    const studentOfTheYear = Object.values(data).flatMap(school => school.students.map(student => {
        const studentGrades = school.grades.filter(g => g.studentId === student.id);
        const avgGrade = studentGrades.length > 0 ? studentGrades.reduce((acc, g) => acc + parseFloat(g.grade), 0) / studentGrades.length : 0;
        return { ...student, avgGrade };
    })).sort((a, b) => b.avgGrade - a.avgGrade)[0];

    const newAwardsRecord = {
        year: new Date().getFullYear(),
        schoolOfTheYear: schoolOfTheYear.id,
        teacherOfTheYear: teacherOfTheYear.id,
        studentOfTheYear: studentOfTheYear.id,
    };
    
    // --- Update State ---
    setAwardsAnnounced(true);
    await updateSchoolProfile({ awards: [...(data['northwood'].profile.awards || []), newAwardsRecord] }, 'northwood');

    addLog('northwood', 'Announcement', 'Annual awards have been announced network-wide.');
  };
  
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

  const updateSchoolProfile = async (profileData: Partial<SchoolProfile>, targetSchoolId?: string): Promise<boolean> => {
    const sId = targetSchoolId || currentSchoolId;
    if (!sId) return false;

    const result = await updateSchoolProfileAction(sId, profileData);

    if (result.success) {
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
      return true;
    }
    return false;
  };
  
  const addTeacher = async (teacher: Omit<Teacher, 'id' | 'status'>) => {
    if (!currentSchoolId) return;
    const result = await addTeacherAction(currentSchoolId, teacher);
    if(result.success && result.teacher) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].teachers.push(result.teacher!);
            return newData;
        });
        addLog(currentSchoolId, 'Create', `Added new teacher: ${teacher.name}`);
    }
  };

  const updateTeacher = async (id: string, teacherData: Partial<Teacher>) => {
      if (!currentSchoolId) return;
      const result = await updateTeacherAction(currentSchoolId, id, teacherData);
      if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            const school = newData[currentSchoolId];
            school.teachers = school.teachers.map(t => t.id === id ? {...t, ...teacherData} : t);
            return newData;
        });
        addLog(currentSchoolId, 'Update', `Updated profile for teacher: ${teacherData.name || id}`);
      }
  };

  const deleteTeacher = async (teacherId: string) => {
    if (!currentSchoolId) return;
    const teacherName = data?.[currentSchoolId]?.teachers.find(t => t.id === teacherId)?.name || 'Unknown';
    const result = await deleteTeacherAction(currentSchoolId, teacherId);
    if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].teachers = newData[currentSchoolId].teachers.filter(t => t.id !== teacherId);
            return newData;
        });
        addLog(currentSchoolId, 'Delete', `Deleted teacher: ${teacherName}`);
    }
  };
  
  const addClass = async (classData: Omit<Class, 'id'>) => {
    if (!currentSchoolId) return;
    const result = await addClassAction(currentSchoolId, classData);
    if(result.success && result.class) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].classes.push(result.class!);
            return newData;
        });
        addLog(currentSchoolId, 'Create', `Created new class: ${classData.name}`);
    }
  };

   const updateClass = async (id: string, classData: Partial<Class>) => {
    if (!currentSchoolId) return;
    const result = await updateClassAction(currentSchoolId, id, classData);
    if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].classes = newData[currentSchoolId].classes.map(c => c.id === id ? { ...c, ...classData } : c);
            return newData;
        });
        addLog(currentSchoolId, 'Update', `Updated class: ${classData.name || id}`);
    }
  };

  const deleteClass = async (id: string) => {
    if (!currentSchoolId) return;
    const className = data?.[currentSchoolId]?.classes.find(c => c.id === id)?.name || 'Unknown';
    const result = await deleteClassAction(currentSchoolId, id);
    if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].classes = newData[currentSchoolId].classes.filter(c => c.id !== id);
            newData[currentSchoolId].courses = newData[currentSchoolId].courses.filter(c => c.classId !== id);
            return newData;
        });
        addLog(currentSchoolId, 'Delete', `Deleted class: ${className}`);
    }
  };
  
  const addCourse = async (course: Omit<Course, 'id'>) => {
    if (!currentSchoolId) return;
    const result = await addCourseAction(currentSchoolId, course);
    if (result.success && result.course) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].courses.push(result.course!);
            addLog(currentSchoolId, 'Create', `Created new course: ${course.subject}`);
            return newData;
        });
    }
  };

  const addSyllabus = async (syllabus: Omit<Syllabus, 'id'|'topics'>) => {
      if(!currentSchoolId) return;
      const result = await addSyllabusAction(currentSchoolId, syllabus);
      if(result.success && result.syllabus) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].syllabi.push(result.syllabus!);
            addLog(currentSchoolId, 'Create', `Created syllabus for ${syllabus.subject} Grade ${syllabus.grade}`);
            return newData;
        });
      }
  };
  
  const updateSyllabusTopic = async (subject: string, grade: string, topic: SyllabusTopic) => {
    if(!currentSchoolId) return;
    const result = await updateSyllabusTopicAction(currentSchoolId, subject, grade, topic);
    if (result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            const school = newData[currentSchoolId];
            const syllabusIndex = school.syllabi.findIndex(s => s.subject === subject && s.grade === grade);

            if (syllabusIndex > -1) {
                const topicIndex = school.syllabi[syllabusIndex].topics.findIndex(t => t.id === topic.id);
                if (topicIndex > -1) {
                    // Update existing topic
                    school.syllabi[syllabusIndex].topics[topicIndex] = topic;
                } else {
                    // Add new topic
                    school.syllabi[syllabusIndex].topics.push(topic);
                }
            }
            return newData;
        });
        addLog(currentSchoolId, 'Update', `Updated syllabus topic "${topic.topic}" for ${subject}`);
    }
  };
  
  const deleteSyllabusTopic = async (subject: string, grade: string, topicId: string) => {
      if(!currentSchoolId) return;
      const result = await deleteSyllabusTopicAction(currentSchoolId, subject, grade, topicId);
      if (result.success) {
          setData(prev => {
              if (!prev) return null;
              const newData = {...prev};
              const school = newData[currentSchoolId];
              const syllabusIndex = school.syllabi.findIndex(s => s.subject === subject && s.grade === grade);
              if (syllabusIndex > -1) {
                  school.syllabi[syllabusIndex].topics = school.syllabi[syllabusIndex].topics.filter(t => t.id !== topicId);
              }
              return newData;
          });
          addLog(currentSchoolId, 'Delete', `Deleted a topic from ${subject} syllabus}`);
      }
  };

  const updateApplicationStatus = async (id: string, status: Admission['status']) => {
      if (!currentSchoolId) return;
      const result = await updateAdmissionStatusAction(currentSchoolId, id, status);
      if (result.success) {
        setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          const school = newData[currentSchoolId];
          school.admissions = school.admissions.map(a => a.id === id ? { ...a, status } : a);
          addLog(currentSchoolId, 'Update', `Updated application ${id} status to ${status}`);
          return newData;
        });
      }
  };

  const addStudentFromAdmission = async (application: Admission) => {
      if (!currentSchoolId) return;
      const result = await addStudentFromAdmissionAction(currentSchoolId, application);
      if (result.success && result.newStudent) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].students.push(result.newStudent!);
            addLog(currentSchoolId, 'Create', `Enrolled new student ${result.newStudent.name} from admission.`);
            return newData;
        });
      }
  };
  
  const addAsset = async (asset: Omit<any, 'id'>) => {
      const targetSchoolId = role === 'GlobalAdmin' ? 'northwood' : currentSchoolId;
      if (!targetSchoolId) return { success: false, error: 'School ID not found.'};
      
      const result = await addAssetAction(targetSchoolId, asset);
      
      if (result.success && result.asset) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[targetSchoolId].assets.push(result.asset!);
            addLog(targetSchoolId, 'Create', `Added new asset: ${asset.name}`);
            return newData;
        });
        return { success: true };
      }
      return { success: false, error: result.error };
  };
  
  const addLessonAttendance = async (courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => {
    if(!currentSchoolId) return;
    const result = await addLessonAttendanceAction(currentSchoolId, courseId, date, studentStatuses);
    if(result.success) {
        const newRecords: Attendance[] = Object.entries(studentStatuses).map(([studentId, status]) => ({
            id: `ATT${Date.now()}${studentId}`, studentId, date: new Date(date), status, courseId,
        }));
        
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            const school = newData[currentSchoolId];
            school.attendance = school.attendance.filter(a => !(new Date(a.date).toISOString().split('T')[0] === date && a.courseId === courseId));
            school.attendance.push(...newRecords);
            addLog(currentSchoolId, 'Create', `Recorded attendance for course ${courseId} on ${date}`);
            return newData;
        });
    }
  };

  const addEvent = (event: Omit<Event, 'id' | 'schoolName'>) => {
    if(!currentSchoolId || !schoolProfile) return;
    const newEvent: Event = { id: `EVT${Date.now()}`, schoolName: schoolProfile.name, ...event };
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[currentSchoolId].events.push(newEvent);
        addLog(currentSchoolId, 'Create', `Scheduled new event: ${event.title}`);
        return newData;
    });
  };

  const teacher = useMemo(() => {
    if (role !== 'Teacher' || !user?.email || !schoolData) return null;
    return schoolData.teachers.find(t => t.email === user.email);
  }, [role, user, schoolData]);
  
  const addGrade = async (grade: Omit<Grade, 'id' | 'date'>): Promise<boolean> => {
    if(!currentSchoolId || !teacher) return false;
    const result = await addGradeAction(currentSchoolId, {...grade, teacherId: teacher.id });
    if(result.success && result.grade) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].grades.push(result.grade!);
            return newData;
        });
        return true;
    }
    return false;
  };
  
  const addTestSubmission = async (testId: string, studentId: string, score: number) => {
    if (!currentSchoolId) return;
    const result = await addTestSubmissionAction(currentSchoolId, testId, studentId, score);
    if (result.success) {
        setData(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            const school = newData[currentSchoolId];
            const testIndex = school.deployedTests.findIndex(t => t.id === testId);
            if (testIndex > -1) {
                school.deployedTests[testIndex].submissions.push({
                    studentId,
                    score,
                    submittedAt: new Date(),
                });
            }
            addLog(currentSchoolId, 'Create', `Student ${studentId} submitted test ${testId}`);
            return newData;
        });
    }
  };

  const recordPayment = async (feeId: string, amount: number) => {
    if (!currentSchoolId) return;
    const result = await recordPaymentAction(currentSchoolId, feeId, amount);
    if (result.success && result.fee) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            const school = newData[currentSchoolId];
            school.finance = school.finance.map(f => f.id === feeId ? result.fee! : f);
            addLog(currentSchoolId, 'Update', `Recorded payment of ${amount} for fee ${result.fee.description}`);
            return newData;
        });
    }
  };

  const addFee = async (fee: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>) => {
    if (!currentSchoolId || !schoolData) return;
    const student = schoolData.students.find(s => s.id === fee.studentId);
    if (!student) return;

    const result = await addFeeAction(currentSchoolId, fee, student.name);

    if (result.success && result.fee) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[currentSchoolId].finance.push(result.fee!);
            addLog(currentSchoolId, 'Create', `Created new fee for ${student.name}: ${fee.description}`);
            return newData;
        });
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const targetSchoolId = role === 'GlobalAdmin' ? 'northwood' : currentSchoolId;
    if(!targetSchoolId) return;
    const result = await addExpenseAction(targetSchoolId, expense);
    if(result.success && result.expense) {
        setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          newData[targetSchoolId].expenses.push(result.expense!);
          addLog(targetSchoolId, 'Create', `Added expense: ${expense.description}`);
          return newData;
      });
    }
  };
  
  const addTeam = async (team: Omit<Team, 'id' | 'playerIds'>) => {
    if (!currentSchoolId) return;
    const result = await addTeamAction(currentSchoolId, team);
    if (result.success && result.team) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[currentSchoolId].teams.push(result.team!);
        addLog(currentSchoolId, 'Create', `Created new sports team: ${team.name}`);
        return newData;
      });
    }
  };
  
  const deleteTeam = async (teamId: string) => {
    if (!currentSchoolId) return;
    const result = await deleteTeamAction(currentSchoolId, teamId);
    if (result.success) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        const school = newData[currentSchoolId];
        const teamName = school.teams.find(t => t.id === teamId)?.name;
        school.teams = school.teams.filter(t => t.id !== teamId);
        school.competitions = school.competitions.filter(c => c.ourTeamId !== teamId);
        addLog(currentSchoolId, 'Delete', `Deleted team: ${teamName}`);
        return newData;
      });
    }
  };

  const addPlayerToTeam = async (teamId: string, studentId: string) => {
      if(!currentSchoolId) return;
      const result = await addPlayerToTeamAction(currentSchoolId, teamId, studentId);
      if (result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            const school = newData[currentSchoolId];
            school.teams = school.teams.map(t => {
                if (t.id === teamId && !t.playerIds.includes(studentId)) {
                    return { ...t, playerIds: [...t.playerIds, studentId] };
                }
                return t;
            });
            return newData;
        });
      }
  };
  
  const removePlayerFromTeam = async (teamId: string, studentId: string) => {
      if(!currentSchoolId) return;
      const result = await removePlayerFromTeamAction(currentSchoolId, teamId, studentId);
      if (result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            const school = newData[currentSchoolId];
            school.teams = school.teams.map(t => {
                if (t.id === teamId) {
                    return { ...t, playerIds: t.playerIds.filter(id => id !== studentId) };
                }
                return t;
            });
            return newData;
        });
      }
  };
  
  const addCompetition = async (competition: Omit<Competition, 'id'>) => {
    if(!currentSchoolId) return;
    const result = await addCompetitionAction(currentSchoolId, competition);
    if (result.success && result.competition) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].competitions.push(result.competition!);
          addLog(currentSchoolId, 'Create', `Scheduled competition: ${competition.title}`);
          return newData;
      });
    }
  };
  
  const addCompetitionResult = async (competitionId: string, result: Competition['result']) => {
    if (!currentSchoolId) return;
    const actionResult = await addCompetitionResultAction(currentSchoolId, competitionId, result);
    if (actionResult.success && actionResult.competition) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        const school = newData[currentSchoolId];
        school.competitions = school.competitions.map(c => c.id === competitionId ? actionResult.competition! : c);
        addLog(currentSchoolId, 'Update', `Recorded result for competition ${competitionId}`);
        return newData;
      });
    }
  };
  
  const addBehavioralAssessment = async (assessment: Omit<any, 'id'|'date'>) => {
    if(!currentSchoolId) return;
    const result = await addBehavioralAssessmentAction(currentSchoolId, assessment);
    if(result.success && result.assessment) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            const school = newData[currentSchoolId];
            school.students = school.students.map(s => {
                if(s.id === assessment.studentId) {
                    if(!s.behavioralAssessments) s.behavioralAssessments = [];
                    s.behavioralAssessments.push(result.assessment!);
                }
                return s;
            });
            addLog(currentSchoolId, 'Create', `Added behavioral assessment for student ${assessment.studentId}`);
            return newData;
        });
    }
  };
  
  const addKioskMedia = async (media: Omit<KioskMedia, 'id' | 'createdAt'>) => {
    if (!currentSchoolId) return;
    const result = await addKioskMediaAction(currentSchoolId, media);
    if (result.success && result.media) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[currentSchoolId].kioskMedia.push(result.media!);
        addLog(currentSchoolId, 'Create', `Added kiosk media: ${media.title}`);
        return newData;
      });
    }
  };
  
  const removeKioskMedia = async (id: string) => {
      if(!currentSchoolId) return;
      const result = await removeKioskMediaAction(currentSchoolId, id);
      if (result.success) {
          setData(prev => {
              if (!prev) return null;
              const newData = {...prev};
              newData[currentSchoolId].kioskMedia = newData[currentSchoolId].kioskMedia.filter(m => m.id !== id);
              addLog(currentSchoolId, 'Delete', `Removed kiosk media item ${id}`);
              return newData;
          });
      }
  };
  
  const addMessage = async (messageData: NewMessageData) => {
    if (!data || !user || !role) return;

    const senderSchoolId = role === 'GlobalAdmin' ? 'northwood' : user.schoolId;
    if (!senderSchoolId) return;

    let recipientSchoolId: string | undefined = undefined;
    for (const sId in data) {
      const school = data[sId];
      if (school.profile.email === messageData.recipientUsername || school.teachers.some(t => t.email === messageData.recipientUsername) || school.students.some(s => s.parentEmail === messageData.recipientUsername)) {
        recipientSchoolId = sId;
        break;
      }
    }
    
    if (!recipientSchoolId) {
        const parentUser = Object.values(mockUsers).find(u => u.user.email === messageData.recipientUsername && u.user.role === 'Parent');
        if (parentUser) {
            const student = allStudents.find(s => s.parentEmail === parentUser.user.email);
            if (student) {
                recipientSchoolId = student.schoolId;
            }
        }
    }
    
    if (!recipientSchoolId) return;

    const recipient = mockUsers[messageData.recipientUsername] || Object.values(mockUsers).find(u => u.user.email === messageData.recipientUsername);


    const result = await sendMessageAction(senderSchoolId, recipientSchoolId, { ...messageData, senderName: user.name, senderRole: role });
    if (result.success && result.message) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        
        if (newData[senderSchoolId]) {
          newData[senderSchoolId].messages.push(result.message!);
        }

        if (recipientSchoolId && recipientSchoolId !== senderSchoolId) {
          newData[recipientSchoolId].messages.push(result.message!);
        }
        
        addLog(senderSchoolId, 'Message', `Sent message to ${result.message.recipientName}`);
        return newData;
      });
    }
  };
  
  const addAdmission = (admission: NewAdmissionData) => {
    const { schoolId, ...rest } = admission;
    if (!schoolId || !user) return;
    const newAdmission: Admission = {
        id: `ADM${Date.now()}${Math.floor(Math.random() * 1000)}`,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        parentName: user.name,
        parentEmail: user.email,
        grades: rest.gradesSummary || 'N/A',
        ...rest,
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
  
  const updateParentStatus = (parentEmail: string, status: 'Active' | 'Suspended') => {
    setParentStatusOverrides(prev => ({...prev, [parentEmail]: status}));
  };
  
  const addExamBoard = async (board: string) => {
    if(!currentSchoolId) return;
    const result = await addExamBoardAction(currentSchoolId, board);
    if(result.success && result.board) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].examBoards.push(result.board!);
          return newData;
      });
    }
  };
  const deleteExamBoard = async (board: string) => {
    if(!currentSchoolId) return;
    const result = await deleteExamBoardAction(currentSchoolId, board);
    if(result.success) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].examBoards = newData[currentSchoolId].examBoards.filter(b => b !== board);
          return newData;
      });
    }
  };
  const addFeeDescription = async (desc: string) => {
    if(!currentSchoolId) return;
    const result = await addFeeDescriptionAction(currentSchoolId, desc);
    if(result.success && result.description) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].feeDescriptions.push(result.description!);
          return newData;
      });
    }
  };
  const deleteFeeDescription = async (desc: string) => {
    if(!currentSchoolId) return;
    const result = await deleteFeeDescriptionAction(currentSchoolId, desc);
    if (result.success) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].feeDescriptions = newData[currentSchoolId].feeDescriptions.filter(d => d !== desc);
          return newData;
      });
    }
  };
  const addAudience = async (aud: string) => {
    if(!currentSchoolId) return;
    const result = await addAudienceAction(currentSchoolId, aud);
    if(result.success && result.audience) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].audiences.push(result.audience!);
          return newData;
      });
    }
  };
  const deleteAudience = async (aud: string) => {
    if(!currentSchoolId) return;
    const result = await deleteAudienceAction(currentSchoolId, aud);
    if(result.success) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].audiences = newData[currentSchoolId].audiences.filter(a => a !== aud);
          return newData;
      });
    }
  };
  
  const addTerm = async (term: any) => {
    if (!currentSchoolId) return;
    const result = await addTermAction(currentSchoolId, term);
    if (result.success && result.term) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            newData[currentSchoolId].terms.push(result.term!);
            return newData;
        });
    }
  };

  const addHoliday = async (holiday: any) => {
      if (!currentSchoolId) return;
      const result = await addHolidayAction(currentSchoolId, holiday);
      if (result.success && result.holiday) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            newData[currentSchoolId].holidays.push(result.holiday!);
            return newData;
        });
      }
  };
  
  const addSavedReport = (report: Omit<SavedReport, 'id'>) => {
      if (!currentSchoolId) return;
      const newReport: SavedReport = { id: `REP${Date.now()}`, ...report };
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[currentSchoolId].savedReports.push(newReport);
          return newData;
      });
  };

  const addDeployedTest = (test: Omit<DeployedTest, 'id' | 'submissions'>) => {
    if(!currentSchoolId) return;
    const newTest: DeployedTest = {
      id: `DT${Date.now()}`,
      submissions: [],
      ...test,
    };
     setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      newData[currentSchoolId].deployedTests.push(newTest);
      return newData;
    });
  }

  const addSavedTest = (test: Omit<SavedTest, 'id' | 'createdAt'>) => {
    if(!currentSchoolId) return;
    const newTest: SavedTest = {
      id: `ST${Date.now()}`,
      createdAt: new Date(),
      ...test,
    };
    setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      newData[currentSchoolId].savedTests.push(newTest);
      return newData;
    });
  };
  
  const deleteSavedTest = (testId: string) => {
    if(!currentSchoolId) return;
    setData(prev => {
      if (!prev) return null;
      const newData = {...prev};
      newData[currentSchoolId].savedTests = newData[currentSchoolId].savedTests.filter(t => t.id !== testId);
      // Also remove deployments of this test
      newData[currentSchoolId].deployedTests = newData[currentSchoolId].deployedTests.filter(t => t.testId !== testId);
      return newData;
    });
  }
  

  const value: SchoolDataContextType = {
    isLoading,
    allSchoolData: data,
    allStudents,
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
    financeData: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
            const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
            return Object.values(data).flatMap(d => d.finance.filter(f => parentStudentIds.includes(f.studentId)));
        }
        return schoolData?.finance || [];
    }, [schoolData, data, role, user, allStudents]),
    assetsData: schoolData?.assets || [],
    exams: schoolData?.exams || [],
    grades: useMemo(() => {
        if (!data) return [];
        if (role === 'Parent') {
          const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
          return Object.values(data).flatMap(d => d.grades.filter(g => parentStudentIds.includes(g.studentId)));
        }
        return schoolData?.grades || [];
    }, [schoolData, data, role, user, allStudents]),
    attendance: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
            const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
            return Object.values(data).flatMap(d => d.attendance.filter(a => parentStudentIds.includes(a.studentId)));
        }
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.attendance);
        return schoolData?.attendance || [];
    }, [schoolData, data, role, user, allStudents]),
    events: useMemo(() => {
        if (!data) return [];
        if (role === 'Parent' || role === 'Student') {
            return Object.values(data).flatMap(d => d.events.map(e => ({...e, schoolName: d.profile.name})));
        }
        if (role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.events);
        return schoolData?.events || [];
    }, [schoolData, data, role]),
    expensesData: useMemo(() => {
        if(!data) return [];
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.expenses);
        return schoolData?.expenses || [];
    }, [schoolData, data, role]),
    teamsData: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
            const parentStudentIds = allStudents.filter(s => s.parentEmail === user.email).map(s => s.id);
            return Object.values(data).flatMap(d => d.teams.filter(t => t.playerIds.some(pId => parentStudentIds.includes(pId))));
        }
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.teams);
        return schoolData?.teams || [];
    }, [schoolData, data, role, user, allStudents]),
    competitionsData: useMemo(() => {
        if (!data || !user) return [];
        if (role === 'Parent') {
             const parentTeamIds = Object.values(data).flatMap(d => d.teams.filter(t => t.playerIds.some(pId => allStudents.filter(s => s.parentEmail === user.email).map(s => s.id).includes(pId)))).map(t => t.id);
            return Object.values(data).flatMap(d => d.competitions.filter(c => parentTeamIds.includes(c.ourTeamId)));
        }
        if(role === 'GlobalAdmin') return Object.values(data).flatMap(d => d.competitions);
        return schoolData?.competitions || [];
    }, [schoolData, data, role, user, allStudents]),
    kioskMedia: schoolData?.kioskMedia || [],
    activityLogs: useMemo(() => {
        if (!data) return [];
        if (role === 'GlobalAdmin') {
            return Object.values(data).flatMap(d => d.activityLogs);
        }
        return schoolData?.activityLogs || [];
    }, [schoolData, data, role]),
    messages: useMemo(() => {
      if (!user || !data) return [];
      const userIdentifier = user.email;
      if (role === 'GlobalAdmin') {
          return data['northwood']?.messages || [];
      }
      if (schoolData) {
        return schoolData.messages;
      }
      return [];
    }, [schoolData, data, user, role]),
    savedReports: schoolData?.savedReports || [],
    schoolGroups,
    parentStatusOverrides,
    deployedTests: schoolData?.deployedTests || [],
    savedTests: schoolData?.savedTests || [],
    awardsAnnounced,
    examBoards: schoolData?.examBoards || [],
    feeDescriptions: schoolData?.feeDescriptions || [],
    audiences: schoolData?.audiences || [],
    expenseCategories: schoolData?.expenseCategories || [],
    terms: schoolData?.terms || [],
    holidays: schoolData?.holidays || [],
    announceAwards,
    addSchool, removeSchool, addCourse, addSyllabus, updateSyllabusTopic, deleteSyllabusTopic,
    updateApplicationStatus, addStudentFromAdmission, addAsset, addLessonAttendance,
    addClass, updateClass, deleteClass, addEvent, addGrade, addTestSubmission, recordPayment, addFee, addExpense,
    addTeam, deleteTeam, addPlayerToTeam, removePlayerFromTeam, addCompetition, addCompetitionResult,
    addTeacher, updateTeacher, deleteTeacher, addKioskMedia, removeKioskMedia, updateSchoolProfile, addMessage, addAdmission,
    updateSchoolStatus, updateMessageStatus, updateStudentStatus, updateTeacherStatus, updateParentStatus,
    addTerm, addHoliday,
    addSavedReport,
    addBehavioralAssessment,
    addExamBoard, deleteExamBoard, addFeeDescription, deleteFeeDescription, addAudience, deleteAudience,
    addDeployedTest, addSavedTest, deleteSavedTest,
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

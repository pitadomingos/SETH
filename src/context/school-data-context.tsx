'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { initialSchoolData, SchoolData, Student, Teacher, Class, Course, Syllabus, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, SchoolProfile, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, mockUsers, UserProfile, SyllabusTopic } from '@/lib/mock-data';
import { useAuth, User } from './auth-context';
import type { Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';
import { getGpaFromNumeric } from '@/lib/utils';
import { updateSchoolProfileAction } from '@/app/actions/update-school-action';
import { addTeacherAction, updateTeacherAction, deleteTeacherAction, addClassAction, updateClassAction, deleteClassAction, updateSyllabusTopicAction, deleteSyllabusTopicAction, addSyllabusAction, addCourseAction, updateCourseAction, deleteCourseFromFirestore, addFeeAction, recordPaymentAction, addExpenseAction, addTeamAction, deleteTeamAction, addPlayerToTeamAction, removePlayerFromTeamAction, addCompetitionAction, addCompetitionResultAction } from '@/app/actions/school-actions';


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
    updateApplicationStatus: (id: string, status: Admission['status']) => void;
    addStudentFromAdmission: (application: Admission) => void;
    addAsset: (asset: Omit<any, 'id'>) => void;
    addLessonAttendance: (courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>) => void;
    addClass: (classData: Omit<Class, 'id'>) => Promise<void>;
    updateClass: (id: string, data: Partial<Class>) => Promise<void>;
    deleteClass: (id: string) => Promise<void>;
    addEvent: (event: Omit<Event, 'id' | 'schoolName'>) => void;
    addGrade: (grade: Omit<Grade, 'id' | 'date' | 'teacherId'>) => boolean;
    addTestSubmission: (testId: string, studentId: string, score: number) => void;
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
    addKioskMedia: (media: Omit<KioskMedia, 'id'|'createdAt'>) => void;
    removeKioskMedia: (id: string) => void;
    updateSchoolProfile: (data: Partial<SchoolProfile>, schoolId?: string) => Promise<boolean>;
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
  const [awardsAnnounced, setAwardsAnnounced] = useState(false);

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
            setAwardsAnnounced(firestoreData['northwood']?.profile.awards && firestoreData['northwood'].profile.awards.length > 0);
        } catch (error) {
            console.error("Failed to fetch or seed school data.", error);
            // Fallback to mock data in case of severe firestore error
            setData(initialSchoolData);
            setAwardsAnnounced(initialSchoolData['northwood']?.profile.awards && initialSchoolData['northwood'].profile.awards.length > 0);
        } finally {
            setIsLoading(false);
        }
    };

    fetchSchoolData();
  }, []);

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

  const updateSchoolProfile = async (profileData: Partial<SchoolProfile>, targetSchoolId?: string): Promise<boolean> => {
    const sId = targetSchoolId || schoolId;
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
    if (!schoolId) return;
    const result = await addTeacherAction(schoolId, teacher);
    if(result.success && result.teacher) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].teachers.push(result.teacher!);
            return newData;
        });
        addLog(schoolId, 'Create', `Added new teacher: ${teacher.name}`);
    }
  };

  const updateTeacher = async (id: string, teacherData: Partial<Teacher>) => {
      if (!schoolId) return;
      const result = await updateTeacherAction(schoolId, id, teacherData);
      if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            const school = newData[schoolId];
            school.teachers = school.teachers.map(t => t.id === id ? {...t, ...teacherData} : t);
            return newData;
        });
        addLog(schoolId, 'Update', `Updated profile for teacher: ${teacherData.name || id}`);
      }
  };

  const deleteTeacher = async (teacherId: string) => {
    if (!schoolId) return;
    const teacherName = data?.[schoolId]?.teachers.find(t => t.id === teacherId)?.name || 'Unknown';
    const result = await deleteTeacherAction(schoolId, teacherId);
    if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].teachers = newData[schoolId].teachers.filter(t => t.id !== teacherId);
            return newData;
        });
        addLog(schoolId, 'Delete', `Deleted teacher: ${teacherName}`);
    }
  };
  
  const addClass = async (classData: Omit<Class, 'id'>) => {
    if (!schoolId) return;
    const result = await addClassAction(schoolId, classData);
    if(result.success && result.class) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].classes.push(result.class!);
            return newData;
        });
        addLog(schoolId, 'Create', `Created new class: ${classData.name}`);
    }
  };

   const updateClass = async (id: string, classData: Partial<Class>) => {
    if (!schoolId) return;
    const result = await updateClassAction(schoolId, id, classData);
    if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].classes = newData[schoolId].classes.map(c => c.id === id ? { ...c, ...classData } : c);
            return newData;
        });
        addLog(schoolId, 'Update', `Updated class: ${classData.name || id}`);
    }
  };

  const deleteClass = async (id: string) => {
    if (!schoolId) return;
    const className = data?.[schoolId]?.classes.find(c => c.id === id)?.name || 'Unknown';
    const result = await deleteClassAction(schoolId, id);
    if(result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].classes = newData[schoolId].classes.filter(c => c.id !== id);
            newData[schoolId].courses = newData[schoolId].courses.filter(c => c.classId !== id);
            return newData;
        });
        addLog(schoolId, 'Delete', `Deleted class: ${className}`);
    }
  };
  
  const addCourse = async (course: Omit<Course, 'id'>) => {
    if (!schoolId) return;
    const result = await addCourseAction(schoolId, course);
    if (result.success && result.course) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].courses.push(result.course!);
            addLog(schoolId, 'Create', `Created new course: ${course.subject}`);
            return newData;
        });
    }
  };

  const addSyllabus = async (syllabus: Omit<Syllabus, 'id'|'topics'>) => {
      if(!schoolId) return;
      const result = await addSyllabusAction(schoolId, syllabus);
      if(result.success && result.syllabus) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].syllabi.push(result.syllabus!);
            addLog(schoolId, 'Create', `Created syllabus for ${syllabus.subject} Grade ${syllabus.grade}`);
            return newData;
        });
      }
  };
  
  const updateSyllabusTopic = async (subject: string, grade: string, topic: SyllabusTopic) => {
    if(!schoolId) return;
    const result = await updateSyllabusTopicAction(schoolId, subject, grade, topic);
    if (result.success) {
        setData(prev => {
            if (!prev) return null;
            const newData = {...prev};
            const school = newData[schoolId];
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
        addLog(schoolId, 'Update', `Updated syllabus topic "${topic.topic}" for ${subject}`);
    }
  };
  
  const deleteSyllabusTopic = async (subject: string, grade: string, topicId: string) => {
      if(!schoolId) return;
      const result = await deleteSyllabusTopicAction(schoolId, subject, grade, topicId);
      if (result.success) {
          setData(prev => {
              if (!prev) return null;
              const newData = {...prev};
              const school = newData[schoolId];
              const syllabusIndex = school.syllabi.findIndex(s => s.subject === subject && s.grade === grade);
              if (syllabusIndex > -1) {
                  school.syllabi[syllabusIndex].topics = school.syllabi[syllabusIndex].topics.filter(t => t.id !== topicId);
              }
              return newData;
          });
          addLog(schoolId, 'Delete', `Deleted a topic from ${subject} syllabus}`);
      }
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
  
  const addTestSubmission = (testId: string, studentId: string, score: number) => {
    if (!schoolId) return;
    setData(prevData => {
        if (!prevData) return null;
        const newData = { ...prevData };
        const school = newData[schoolId];
        const testIndex = school.deployedTests.findIndex(t => t.id === testId);
        if (testIndex > -1) {
            school.deployedTests[testIndex].submissions.push({
                studentId,
                score,
                submittedAt: new Date(),
            });
        }
        addLog(schoolId, 'Create', `Student ${studentId} submitted test ${testId}`);
        return newData;
    });
  };

  const recordPayment = async (feeId: string, amount: number) => {
    if (!schoolId) return;
    const result = await recordPaymentAction(schoolId, feeId, amount);
    if (result.success && result.fee) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            const school = newData[schoolId];
            school.finance = school.finance.map(f => f.id === feeId ? result.fee! : f);
            addLog(schoolId, 'Update', `Recorded payment of ${amount} for fee ${result.fee.description}`);
            return newData;
        });
    }
  };

  const addFee = async (fee: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>) => {
    if (!schoolId) return;
    const student = schoolData?.students.find(s => s.id === fee.studentId);
    if (!student) return;

    const result = await addFeeAction(schoolId, fee, student.name);

    if (result.success && result.fee) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].finance.push(result.fee!);
            addLog(schoolId, 'Create', `Created new fee for ${student.name}: ${fee.description}`);
            return newData;
        });
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if(!schoolId) return;
    const result = await addExpenseAction(schoolId, expense);
    if(result.success && result.expense) {
        setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          newData[schoolId].expenses.push(result.expense!);
          addLog(schoolId, 'Create', `Added expense: ${expense.description}`);
          return newData;
      });
    }
  };
  
  const addTeam = async (team: Omit<Team, 'id' | 'playerIds'>) => {
    if (!schoolId) return;
    const result = await addTeamAction(schoolId, team);
    if (result.success && result.team) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        newData[schoolId].teams.push(result.team!);
        addLog(schoolId, 'Create', `Created new sports team: ${team.name}`);
        return newData;
      });
    }
  };
  
  const deleteTeam = async (teamId: string) => {
    if (!schoolId) return;
    const result = await deleteTeamAction(schoolId, teamId);
    if (result.success) {
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
    }
  };

  const addPlayerToTeam = async (teamId: string, studentId: string) => {
      if(!schoolId) return;
      const result = await addPlayerToTeamAction(schoolId, teamId, studentId);
      if (result.success) {
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
      }
  };
  
  const removePlayerFromTeam = async (teamId: string, studentId: string) => {
      if(!schoolId) return;
      const result = await removePlayerFromTeamAction(schoolId, teamId, studentId);
      if (result.success) {
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
      }
  };
  
  const addCompetition = async (competition: Omit<Competition, 'id'>) => {
    if(!schoolId) return;
    const result = await addCompetitionAction(schoolId, competition);
    if (result.success && result.competition) {
      setData(prev => {
          if (!prev) return null;
          const newData = {...prev};
          newData[schoolId].competitions.push(result.competition!);
          addLog(schoolId, 'Create', `Scheduled competition: ${competition.title}`);
          return newData;
      });
    }
  };
  
  const addCompetitionResult = async (competitionId: string, result: Competition['result']) => {
    if (!schoolId) return;
    const actionResult = await addCompetitionResultAction(schoolId, competitionId, result);
    if (actionResult.success && actionResult.competition) {
      setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        const school = newData[schoolId];
        school.competitions = school.competitions.map(c => c.id === competitionId ? actionResult.competition! : c);
        addLog(schoolId, 'Update', `Recorded result for competition ${competitionId}`);
        return newData;
      });
    }
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

  const value: SchoolDataContextType = {
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



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
import { createAdmissionAction } from '@/app/actions/admission-actions';

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
    addSchool: (newSchoolData: NewSchoolData, groupId?: string) => Promise<{ school: SchoolData, adminUser: { username: string, profile: UserProfile }} | null>;
    removeSchool: (schoolId: string) => void;
    
    addAdmission: (admissionData: NewAdmissionData) => Promise<boolean>;
    // All other action calls are now handled by server actions
    // and state is updated via revalidation, so they are removed from context.
    updateParentStatus: (parentEmail: string, status: 'Active' | 'Suspended') => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, role, schoolId: authSchoolId, addUser } = useAuth();
  const [data, setData] = useState<Record<string, SchoolData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [awardsAnnounced, setAwardsAnnounced] = useState(false);
  const [parentStatusOverrides, setParentStatusOverrides] = useState<Record<string, 'Active' | 'Suspended'>>({});

  useEffect(() => {
    const fetchSchoolData = async () => {
        setIsLoading(true);
        try {
            // Check if data exists. If not, seed it.
            const existingData = await getSchoolsFromFirestore();
            if (Object.keys(existingData).length === 0) {
                await seedInitialData();
                const seededData = await getSchoolsFromFirestore();
                setData(seededData);
                setAwardsAnnounced(seededData['northwood']?.profile.awards && seededData['northwood'].profile.awards.length > 0);
            } else {
                setData(existingData);
                setAwardsAnnounced(existingData['northwood']?.profile.awards && existingData['northwood'].profile.awards.length > 0);
            }
        } catch (error) {
            console.error("Failed to fetch or seed school data.", error);
            setData(initialSchoolData); // Fallback to local mock
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
  
  const addSchool = useCallback(async (newSchoolData: NewSchoolData, groupId?: string) => {
    const result = await createSchool(newSchoolData, groupId);
    if (result) {
        setData(prev => ({...prev, [result.school.profile.id]: result.school }));
        addUser(result.adminUser.username, result.adminUser.profile);
    }
    return result;
  }, [addUser]);

  const removeSchool = (schoolIdToRemove: string) => {
    setData(prev => {
        if (!prev) return null;
        const newData = { ...prev };
        delete newData[schoolIdToRemove];
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
    
    setAwardsAnnounced(true);
    await updateSchoolProfileAction('northwood', { awards: [...(data['northwood'].profile.awards || []), newAwardsRecord] });
  };
  
  const updateParentStatus = (parentEmail: string, status: 'Active' | 'Suspended') => {
    setParentStatusOverrides(prev => ({...prev, [parentEmail]: status}));
  };
  
  const addAdmission = useCallback(async (admissionData: NewAdmissionData) => {
    if (!user) return false;
    const result = await createAdmissionAction(admissionData.schoolId, admissionData, user.name, user.email);
    return result.success;
  }, [user]);

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
    awardsAnnounced: false,
    examBoards: schoolData?.examBoards || [],
    feeDescriptions: schoolData?.feeDescriptions || [],
    audiences: schoolData?.audiences || [],
    expenseCategories: schoolData?.expenseCategories || [],
    terms: schoolData?.terms || [],
    holidays: schoolData?.holidays || [],
    addSchool, removeSchool,
    addAdmission,
    updateParentStatus,
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

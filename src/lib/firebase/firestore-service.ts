import { doc, setDoc, updateDoc, collection, getDocs, writeBatch, serverTimestamp, Timestamp, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from './config';
import { type SchoolData, type NewSchoolData, type SchoolProfile, type UserProfile, initialSchoolData, mockUsers, Teacher, Class, SyllabusTopic, Course, FinanceRecord, Expense, Team, Competition, Admission, Student, Message, NewMessageData } from '@/lib/mock-data';
import { sendEmail } from '@/lib/email-service';

// --- Email Simulation ---
async function sendWelcomeEmail(adminUser: { username: string, profile: UserProfile }, schoolName: string): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const emailHtml = `
        <p>Dear ${adminUser.profile.user.name},</p>
        <p>Welcome to EduDesk!</p>
        <p>Your new account for <strong>${schoolName}</strong> has been created. You can log in using the following temporary credentials:</p>
        <ul>
            <li><strong>App Link:</strong> <a href="${appUrl}">${appUrl}</a></li>
            <li><strong>Username:</strong> ${adminUser.username}</li>
            <li><strong>Password:</strong> ${adminUser.profile.password}</li>
        </ul>
        <p>We recommend that you change your password upon your first login.</p>
        <br/>
        <p>Best regards,</p>
        <p>The EduDesk Team</p>
    `;

    await sendEmail({
        to: adminUser.profile.user.email,
        subject: `Welcome to EduDesk - Your Admin Account for ${schoolName}`,
        html: emailHtml,
    });
}


export async function getSchoolsFromFirestore(): Promise<Record<string, SchoolData>> {
    const schoolsCollection = collection(db, 'schools');
    const schoolSnapshot = await getDocs(schoolsCollection);
    const schoolList = schoolSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data() as SchoolData;
        return acc;
    }, {} as Record<string, SchoolData>);
    return schoolList;
}

export async function getUsersFromFirestore(): Promise<Record<string, UserProfile>> {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    if (userSnapshot.empty) {
        return {};
    }
    const userList = userSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data() as UserProfile;
        return acc;
    }, {} as Record<string, UserProfile>);
    return userList;
}

export async function seedInitialData(): Promise<void> {
    const batch = writeBatch(db);
    
    // Seed schools
    Object.entries(initialSchoolData).forEach(([schoolId, schoolData]) => {
        const schoolRef = doc(db, 'schools', schoolId);
        
        const dataWithServerTimestamps = {
            ...schoolData,
            activityLogs: schoolData.activityLogs.map(log => ({...log, timestamp: serverTimestamp()})),
        };

        batch.set(schoolRef, dataWithServerTimestamps);
    });

    // Seed users
    Object.entries(mockUsers).forEach(([username, userProfile]) => {
        const userRef = doc(db, 'users', username);
        batch.set(userRef, userProfile);
    });

    await batch.commit();
}


export async function createSchoolInFirestore(data: NewSchoolData, groupId?: string): Promise<{ school: SchoolData, adminUser: { username: string, profile: UserProfile } }> {
    const schoolId = data.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);

    const newSchoolProfile: SchoolProfile = {
        id: schoolId,
        ...data,
        tier: groupId ? 'Premium' : data.tier,
        logoUrl: 'https://placehold.co/100x100.png',
        certificateTemplateUrl: 'https://placehold.co/800x600.png',
        transcriptTemplateUrl: 'https://placehold.co/600x800.png',
        gradingSystem: '20-Point',
        currency: 'USD',
        status: 'Active',
        schoolLevel: 'Full',
        gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
        kioskConfig: { showDashboard: true, showLeaderboard: true, showTeacherLeaderboard: true, showAllSchools: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
    };
    
    const adminUsername = data.email.split('@')[0];
    const adminUser: UserProfile = {
      user: {
        username: adminUsername,
        name: data.head,
        role: 'Admin',
        email: data.email,
        schoolId: schoolId,
      },
      password: 'password' // Default password for new admins in the prototype
    };

    const newSchoolData: SchoolData = {
        profile: newSchoolProfile,
        students: [], teachers: [], classes: [], courses: [], syllabi: [],
        admissions: [], exams: [],
        finance: [], assets: [], grades: [], attendance: [],
        events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'],
        audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
        expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
        expenses: [], teams: [], competitions: [], terms: [], holidays: [],
        kioskMedia: [],
        activityLogs: [{
            id: `LOG${schoolId}${Date.now()}`,
            timestamp: new Date(),
            schoolId: schoolId,
            user: 'System Admin',
            role: 'GlobalAdmin',
            action: 'Create',
            details: `Provisioned new school: ${data.name}.`
        }],
        messages: [], savedReports: [],
        examBoards: ['Internal', 'Cambridge', 'IEB'],
        deployedTests: [],
        lessonPlans: [],
        savedTests: [],
        schoolGroups: {},
    };

    const dataForFirestore = {
        ...newSchoolData,
        activityLogs: newSchoolData.activityLogs.map(log => ({
            ...log,
            timestamp: Timestamp.fromDate(log.timestamp) 
        }))
    };
    
    const schoolDocRef = doc(db, 'schools', schoolId);
    const userDocRef = doc(db, 'users', adminUsername);

    const batch = writeBatch(db);
    batch.set(schoolDocRef, dataForFirestore);
    batch.set(userDocRef, adminUser);
    
    if (groupId) {
       console.log(`School ${schoolId} associated with group ${groupId}.`);
       const groupRef = doc(db, 'schools', 'miniarte');
       batch.update(groupRef, {
           [`schoolGroups.${groupId}`]: [...(initialSchoolData.miniarte.schoolGroups[groupId] || []), schoolId]
       });
    }

    await batch.commit();
    await sendWelcomeEmail({ username: adminUsername, profile: adminUser }, data.name);
    
    console.log(`Successfully created school data and admin user in Firestore: ${schoolId}.`);

    return { school: newSchoolData, adminUser: { username: adminUsername, profile: adminUser } };
}


export async function updateSchoolInFirestore(schoolId: string, data: Partial<SchoolProfile>): Promise<boolean> {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    
    const updateData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        updateData[`profile.${key}`] = data[key];
      }
    }
    
    await updateDoc(schoolRef, updateData);
    
    console.log(`Successfully updated school profile in Firestore: ${schoolId}`);
    return true;
  } catch (error) {
    console.error("Error updating school profile in Firestore:", error);
    return false;
  }
}

// --- Teacher CRUD ---

export async function addTeacherToFirestore(schoolId: string, teacherData: Omit<Teacher, 'id' | 'status'>): Promise<Teacher> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newTeacher: Teacher = {
        id: `T${Date.now()}`,
        status: 'Active',
        ...teacherData
    };
    await updateDoc(schoolRef, {
        teachers: arrayUnion(newTeacher)
    });
    return newTeacher;
}

export async function updateTeacherInFirestore(schoolId: string, teacherId: string, teacherData: Partial<Teacher>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedTeachers = schoolData.teachers.map(t => t.id === teacherId ? { ...t, ...teacherData } : t);
    await updateDoc(schoolRef, { teachers: updatedTeachers });
}

export async function deleteTeacherFromFirestore(schoolId: string, teacherId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const teacherToDelete = schoolData.teachers.find(t => t.id === teacherId);
    if (teacherToDelete) {
        await updateDoc(schoolRef, {
            teachers: arrayRemove(teacherToDelete)
        });
    }
}

// --- Class CRUD ---

export async function addClassToFirestore(schoolId: string, classData: Omit<Class, 'id'>): Promise<Class> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newClass: Class = {
        id: `C${Date.now()}`,
        ...classData
    };
    await updateDoc(schoolRef, {
        classes: arrayUnion(newClass)
    });
    return newClass;
}

export async function updateClassInFirestore(schoolId: string, classId: string, classData: Partial<Class>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedClasses = schoolData.classes.map(c => c.id === classId ? { ...c, ...classData } : c);
    await updateDoc(schoolRef, { classes: updatedClasses });
}

export async function deleteClassFromFirestore(schoolId: string, classId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;

    const batch = writeBatch(db);
    
    // Remove the class
    const classToDelete = schoolData.classes.find(c => c.id === classId);
    if(classToDelete) {
        const remainingClasses = schoolData.classes.filter(c => c.id !== classId);
        batch.update(schoolRef, { classes: remainingClasses });
    }

    // Remove associated courses
    const remainingCourses = schoolData.courses.filter(c => c.classId !== classId);
    batch.update(schoolRef, { courses: remainingCourses });
    
    await batch.commit();
}

// --- Syllabus CRUD ---
export async function addSyllabusToFirestore(schoolId: string, syllabusData: Omit<any, 'id' | 'topics'>): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newSyllabus = {
        id: `SYL${Date.now()}`,
        topics: [],
        ...syllabusData
    };
    await updateDoc(schoolRef, {
        syllabi: arrayUnion(newSyllabus)
    });
    return newSyllabus;
}

export async function updateSyllabusTopicInFirestore(schoolId: string, subject: string, grade: string, topic: SyllabusTopic): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolDoc = await getDoc(schoolRef);
    const schoolData = schoolDoc.data() as SchoolData;
    
    const updatedSyllabi = schoolData.syllabi.map(s => {
        if (s.subject === subject && s.grade === grade) {
            const topicIndex = s.topics.findIndex(t => t.id === topic.id);
            if (topicIndex > -1) {
                // Update existing topic
                s.topics[topicIndex] = topic;
            } else {
                // Add new topic
                s.topics.push(topic);
            }
        }
        return s;
    });

    await updateDoc(schoolRef, { syllabi: updatedSyllabi });
}

export async function deleteSyllabusTopicFromFirestore(schoolId: string, subject: string, grade: string, topicId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolDoc = await getDoc(schoolRef);
    const schoolData = schoolDoc.data() as SchoolData;

    const updatedSyllabi = schoolData.syllabi.map(s => {
        if (s.subject === subject && s.grade === grade) {
            s.topics = s.topics.filter(t => t.id !== topicId);
        }
        return s;
    });

    await updateDoc(schoolRef, { syllabi: updatedSyllabi });
}

// --- Course CRUD ---
export async function addCourseToFirestore(schoolId: string, courseData: Omit<Course, 'id'>): Promise<Course> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newCourse: Course = {
        id: `CRS${Date.now()}`,
        ...courseData
    };
    await updateDoc(schoolRef, {
        courses: arrayUnion(newCourse)
    });
    return newCourse;
}

export async function updateCourseInFirestore(schoolId: string, courseId: string, courseData: Partial<Course>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedCourses = schoolData.courses.map(c => c.id === courseId ? { ...c, ...courseData } : c);
    await updateDoc(schoolRef, { courses: updatedCourses });
}

export async function deleteCourseFromFirestore(schoolId: string, courseId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const courseToDelete = schoolData.courses.find(c => c.id === courseId);
    if (courseToDelete) {
        await updateDoc(schoolRef, {
            courses: arrayRemove(courseToDelete)
        });
    }
}

// --- Finance CRUD ---

export async function addFeeToFirestore(schoolId: string, feeData: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>, studentName: string): Promise<FinanceRecord> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newFee: FinanceRecord = {
        id: `FIN${Date.now()}`,
        studentName: studentName,
        status: 'Pending',
        amountPaid: 0,
        ...feeData
    };
    await updateDoc(schoolRef, {
        finance: arrayUnion(newFee)
    });
    return newFee;
}

export async function recordPaymentInFirestore(schoolId: string, feeId: string, amount: number): Promise<FinanceRecord | null> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolDoc = await getDoc(schoolRef);
    if (!schoolDoc.exists()) return null;

    const schoolData = schoolDoc.data() as SchoolData;
    let updatedFee: FinanceRecord | undefined;

    const updatedFinance = schoolData.finance.map(f => {
        if (f.id === feeId) {
            const newAmountPaid = f.amountPaid + amount;
            const status = newAmountPaid >= f.totalAmount ? 'Paid' : 'Partially Paid';
            updatedFee = { ...f, amountPaid: newAmountPaid, status };
            return updatedFee;
        }
        return f;
    });

    await updateDoc(schoolRef, { finance: updatedFinance });
    return updatedFee || null;
}

export async function addExpenseToFirestore(schoolId: string, expenseData: Omit<Expense, 'id'>): Promise<Expense> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newExpense: Expense = {
        id: `EXP${Date.now()}`,
        ...expenseData
    };
    await updateDoc(schoolRef, {
        expenses: arrayUnion(newExpense)
    });
    return newExpense;
}

// --- Sports CRUD ---
export async function addTeamToFirestore(schoolId: string, teamData: Omit<Team, 'id' | 'playerIds'>): Promise<Team> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newTeam: Team = {
        id: `TM${Date.now()}`,
        playerIds: [],
        ...teamData
    };
    await updateDoc(schoolRef, {
        teams: arrayUnion(newTeam)
    });
    return newTeam;
}

export async function deleteTeamFromFirestore(schoolId: string, teamId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;

    const teamToDelete = schoolData.teams.find(t => t.id === teamId);
    if (teamToDelete) {
        const batch = writeBatch(db);
        // Remove team
        batch.update(schoolRef, { teams: arrayRemove(teamToDelete) });
        // Remove associated competitions
        const remainingCompetitions = schoolData.competitions.filter(c => c.ourTeamId !== teamId);
        batch.update(schoolRef, { competitions: remainingCompetitions });
        await batch.commit();
    }
}

export async function addPlayerToTeamInFirestore(schoolId: string, teamId: string, studentId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedTeams = schoolData.teams.map(t => {
        if (t.id === teamId && !t.playerIds.includes(studentId)) {
            return { ...t, playerIds: [...t.playerIds, studentId] };
        }
        return t;
    });
    await updateDoc(schoolRef, { teams: updatedTeams });
}

export async function removePlayerFromTeamInFirestore(schoolId: string, teamId: string, studentId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedTeams = schoolData.teams.map(t => {
        if (t.id === teamId) {
            return { ...t, playerIds: t.playerIds.filter(id => id !== studentId) };
        }
        return t;
    });
    await updateDoc(schoolRef, { teams: updatedTeams });
}

export async function addCompetitionToFirestore(schoolId: string, competitionData: Omit<Competition, 'id'>): Promise<Competition> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newCompetition: Competition = {
        id: `CMP${Date.now()}`,
        ...competitionData,
        date: Timestamp.fromDate(competitionData.date),
    };
    await updateDoc(schoolRef, {
        competitions: arrayUnion(newCompetition)
    });
    return { ...newCompetition, date: competitionData.date }; // return with JS Date
}

export async function addCompetitionResultInFirestore(schoolId: string, competitionId: string, result: Competition['result']): Promise<Competition | null> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;

    let updatedCompetition: Competition | undefined;
    const updatedCompetitions = schoolData.competitions.map(c => {
        if (c.id === competitionId) {
            const outcome = result.ourScore > result.opponentScore ? 'Win' : result.ourScore < result.opponentScore ? 'Loss' : 'Draw';
            updatedCompetition = { ...c, result: { ...result, outcome } };
            return updatedCompetition;
        }
        return c;
    });

    if (updatedCompetition) {
        await updateDoc(schoolRef, { competitions: updatedCompetitions });
        return { ...updatedCompetition, date: (updatedCompetition.date as any).toDate() }; // Convert back to JS Date
    }
    return null;
}

// --- Admission CRUD ---
export async function updateAdmissionStatusInFirestore(schoolId: string, admissionId: string, status: Admission['status']): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    if (!schoolSnapshot.exists()) return;

    const schoolData = schoolSnapshot.data() as SchoolData;
    const updatedAdmissions = schoolData.admissions.map(a => a.id === admissionId ? { ...a, status } : a);

    await updateDoc(schoolRef, { admissions: updatedAdmissions });
}

export async function addStudentFromAdmissionInFirestore(schoolId: string, application: Admission): Promise<Student> {
    const schoolRef = doc(db, 'schools', schoolId);
    const [grade, studentClass] = application.appliedFor.replace('Grade ', '').split('-');

    const newStudent: Student = {
        id: `STU${Date.now()}`,
        name: application.name,
        email: `${application.name.toLowerCase().replace(/\s+/g, '.')}@${schoolId}.edu`,
        phone: `555-01${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
        address: '123 Oak Avenue, Maputo',
        sex: application.sex,
        dateOfBirth: application.dateOfBirth,
        grade: grade.trim(),
        class: studentClass ? studentClass.trim() : 'A',
        parentName: application.parentName,
        parentEmail: application.parentEmail,
        status: 'Active',
        behavioralAssessments: [],
    };

    await updateDoc(schoolRef, {
        students: arrayUnion(newStudent)
    });

    return newStudent;
}

// --- Messaging CRUD ---
export async function sendMessageInFirestore(senderSchoolId: string, recipientSchoolId: string, messageData: NewMessageData): Promise<Message> {
    const senderSchoolRef = doc(db, 'schools', senderSchoolId);
    const recipientSchoolRef = doc(db, 'schools', recipientSchoolId);
  
    const newMessage: Message = {
      id: `MSG${Date.now()}`,
      ...messageData,
      timestamp: new Date(),
      status: 'Pending',
    };
  
    const batch = writeBatch(db);
  
    // Add to sender's message list
    batch.update(senderSchoolRef, {
      messages: arrayUnion(newMessage)
    });
  
    // Add to recipient's message list if they are in a different school
    if (senderSchoolId !== recipientSchoolId) {
      batch.update(recipientSchoolRef, {
        messages: arrayUnion(newMessage)
      });
    }
  
    await batch.commit();
    return newMessage;
  }
    

```
  <change>
    <file>/src/context/school-data-context.tsx</file>
    <content><![CDATA['use client';
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { initialSchoolData, SchoolData, Student, Teacher, Class, Course, Syllabus, Admission, FinanceRecord, Exam, Grade, Attendance, Event, Expense, Team, Competition, KioskMedia, ActivityLog, Message, SavedReport, SchoolProfile, DeployedTest, SavedTest, NewMessageData, NewAdmissionData, mockUsers, UserProfile, SyllabusTopic } from '@/lib/mock-data';
import { useAuth, User } from './auth-context';
import type { Role } from './auth-context';
import { getSchoolsFromFirestore, seedInitialData } from '@/lib/firebase/firestore-service';
import { getGpaFromNumeric } from '@/lib/utils';
import { updateSchoolProfileAction } from '@/app/actions/update-school-action';
import { addTeacherAction, updateTeacherAction, deleteTeacherAction, addClassAction, updateClassAction, deleteClassAction, updateSyllabusTopicAction, deleteSyllabusTopicAction, addSyllabusAction, addCourseAction, updateCourseAction, deleteCourseFromFirestore, addFeeAction, recordPaymentAction, addExpenseAction, addTeamAction, deleteTeamAction, addPlayerToTeamAction, removePlayerFromTeamAction, addCompetitionAction, addCompetitionResultAction, updateAdmissionStatusAction, addStudentFromAdmissionAction } from '@/app/actions/school-actions';
import { sendMessageAction } from '@/app/actions/messaging-actions';


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
    updateApplicationStatus: (id: string, status: Admission['status']) => Promise<void>;
    addStudentFromAdmission: (application: Admission) => Promise<void>;
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
    addMessage: (message: NewMessageData) => Promise<void>;
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

  const updateApplicationStatus = async (id: string, status: Admission['status']) => {
      if (!schoolId) return;
      const result = await updateAdmissionStatusAction(schoolId, id, status);
      if (result.success) {
        setData(prev => {
          if (!prev) return null;
          const newData = { ...prev };
          const school = newData[schoolId];
          school.admissions = school.admissions.map(a => a.id === id ? { ...a, status } : a);
          addLog(schoolId, 'Update', `Updated application ${id} status to ${status}`);
          return newData;
        });
      }
  };

  const addStudentFromAdmission = async (application: Admission) => {
      if (!schoolId) return;
      const result = await addStudentFromAdmissionAction(schoolId, application);
      if (result.success && result.newStudent) {
        setData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            newData[schoolId].students.push(result.newStudent!);
            addLog(schoolId, 'Create', `Enrolled new student ${result.newStudent.name} from admission.`);
            return newData;
        });
      }
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
  
  const addMessage = async (messageData: NewMessageData) => {
    if (!data || !user || !role) return;

    const senderSchoolId = role === 'GlobalAdmin' ? 'northwood' : user.schoolId;
    if (!senderSchoolId) return;

    let recipientSchoolId: string | undefined = undefined;
    for (const sId in data) {
      const school = data[sId];
      if (school.profile.email === messageData.recipientUsername || school.teachers.some(t => t.email === messageData.recipientUsername)) {
        recipientSchoolId = sId;
        break;
      }
    }
    if (!recipientSchoolId) return;

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

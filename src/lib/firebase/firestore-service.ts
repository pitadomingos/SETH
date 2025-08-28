
'use client';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  writeBatch,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  collectionGroup,
  query,
  where,
  addDoc,
  deleteDoc,
  runTransaction,
} from 'firebase/firestore';
import { db } from './config';
import type { SchoolData, NewSchoolData, SchoolProfile, UserProfile, Teacher, Class, Syllabus, SyllabusTopic, Course, FinanceRecord, Expense, Team, Competition, Admission, Student, Message, NewMessageData, KioskMedia, BehavioralAssessment, Grade, DeployedTest, SavedTest, Role } from '@/context/school-data-context';

// --- Data Seeding (RUNS ONLY ONCE) ---

export async function seedInitialData(): Promise<void> {
    const mockUsers: Record<string, UserProfile> = {
        developer: { user: { username: 'developer', name: 'Dev Admin', role: 'GlobalAdmin', email: 'dev@edudmanage.com' }, password: 'password' },
        admin1: { user: { username: 'admin1', name: 'Amelia Costa', role: 'Admin', email: 'amelia.costa@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        admin3: { user: { username: 'admin3', name: 'Carlos Pereira', role: 'Admin', email: 'carlos.pereira@miniarte.edu', schoolId: 'miniarte' }, password: 'password' },
        admin_miniarte_matola: { user: { username: 'admin_miniarte_matola', name: 'Isabel Rocha', role: 'Admin', email: 'isabel.rocha@miniarte.edu', schoolId: 'miniarte_matola' }, password: 'password' },
        admin_miniarte_beira: { user: { username: 'admin_miniarte_beira', name: 'Pedro Gonçalves', role: 'Admin', email: 'pedro.goncalves@miniarte.edu', schoolId: 'miniarte_beira' }, password: 'password' },
        admin_logix: { user: { username: 'admin_logix', name: 'Ricardo Jorge', role: 'Admin', email: 'ricardo.jorge@logix.edu', schoolId: 'logixsystems' }, password: 'password' },
        admin_plc: { user: { username: 'admin_plc', name: 'Beatriz Lima', role: 'Admin', email: 'beatriz.lima@plc.edu', schoolId: 'plc' }, password: 'password' },
        admin_trial: { user: { username: 'admin_trial', name: 'Sofia Mendes', role: 'Admin', email: 'sofia.mendes@trialschool.edu', schoolId: 'trialschool' }, password: 'password' },
        teacher1: { user: { username: 'teacher1', name: 'Sérgio Almeida', role: 'Teacher', email: 'sergio.almeida@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        teacher_logix: { user: { username: 'teacher_logix', name: 'Jorge Dias', role: 'Teacher', email: 'jorge.dias@logix.edu', schoolId: 'logixsystems' }, password: 'password' },
        student1: { user: { username: 'student1', name: 'Miguel Santos', role: 'Student', email: 'miguel.santos@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        ines_pereira: { user: { username: 'ines_pereira', name: 'Inês Pereira', role: 'Student', email: 'ines.pereira@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        tiago_rodrigues: { user: { username: 'tiago_rodrigues', name: 'Tiago Rodrigues', role: 'Student', email: 'tiago.rodrigues@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        lucia_santos: { user: { username: 'lucia_santos', name: 'Lucia Santos', role: 'Student', email: 'lucia.santos@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        pedro_santos: { user: { username: 'pedro_santos', name: 'Pedro Santos', role: 'Student', email: 'pedro.santos@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        julio_silva: { user: { username: 'julio_silva', name: 'Julio Silva', role: 'Student', email: 'julio.silva@miniarte.edu', schoolId: 'miniarte_matola' }, password: 'password' },
        mariana_lopes: { user: { username: 'mariana_lopes', name: 'Mariana Lopes', role: 'Student', email: 'mariana.lopes@miniarte.edu', schoolId: 'miniarte_beira' }, password: 'password' },
        laura_moreira: { user: { username: 'laura_moreira', name: 'Laura Moreira', role: 'Student', email: 'laura.moreira@logix.edu', schoolId: 'logixsystems' }, password: 'password' },
        daniela_fernandes: { user: { username: 'daniela_fernandes', name: 'Daniela Fernandes', role: 'Student', email: 'daniela.fernandes@plc.edu', schoolId: 'plc' }, password: 'password' },
        andre_ramos: { user: { username: 'andre_ramos', name: 'Andre Ramos', role: 'Student', email: 'andre.ramos@trialschool.edu', schoolId: 'trialschool' }, password: 'password' },
        parent1: { user: { username: 'parent1', name: 'Ana Santos', role: 'Parent', email: 'ana.santos@email.com' }, password: 'password' },
        parent_pereira: { user: { username: 'parent_pereira', name: 'João Pereira', role: 'Parent', email: 'joao.pereira@email.com' }, password: 'password' },
        parent_rodrigues: { user: { username: 'parent_rodrigues', name: 'Carla Rodrigues', role: 'Parent', email: 'carla.rodrigues@email.com' }, password: 'password' },
        parent_silva: { user: { username: 'parent_silva', name: 'Fernanda Silva', role: 'Parent', email: 'fernanda.silva@email.com' }, password: 'password' },
        parent_lopes: { user: { username: 'parent_lopes', name: 'Sérgio Lopes', role: 'Parent', email: 'sergio.lopes@email.com' }, password: 'password' },
        parent_moreira: { user: { username: 'parent_moreira', name: 'Joana Moreira', role: 'Parent', email: 'joana.moreira@email.com' }, password: 'password' },
        parent_fernandes: { user: { username: 'parent_fernandes', name: 'Rui Fernandes', role: 'Parent', email: 'rui.fernandes@email.com' }, password: 'password' },
        parent_ramos: { user: { username: 'parent_ramos', name: 'Paula Ramos', role: 'Parent', email: 'paula.ramos@email.com' }, password: 'password' },
        acdean1: { user: { username: 'acdean1', name: 'Helena Gomes', role: 'AcademicDean', email: 'helena.gomes@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        admissions1: { user: { username: 'admissions1', name: 'Marco Abreu', role: 'AdmissionsOfficer', email: 'marco.abreu@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        finance1: { user: { username: 'finance1', name: 'Fátima Ribeiro', role: 'FinanceOfficer', email: 'fatima.ribeiro@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        counselor1: { user: { username: 'counselor1', name: 'David Melo', role: 'Counselor', email: 'david.melo@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        sports1: { user: { username: 'sports1', name: 'Vasco Nunes', role: 'SportsDirector', email: 'vasco.nunes@northwood.edu', schoolId: 'northwood' }, password: 'password' },
        itadmin1: { user: { username: 'itadmin1', name: 'Juliana Barros', role: 'ITAdmin', email: 'juliana.barros@northwood.edu', schoolId: 'northwood' }, password: 'password' },
    };
    const { initialSchoolData } = await import('@/lib/initial-seed-data');

    const batch = writeBatch(db);

    // Seed schools and their subcollections
    for (const [schoolId, schoolData] of Object.entries(initialSchoolData)) {
      const { students, teachers, classes, courses, syllabi, admissions, finance, assets, exams, grades, attendance, events, expenses, teams, competitions, terms, holidays, kioskMedia, activityLogs, messages, savedReports, deployedTests, savedTests, ...rest } = schoolData;
      
      const schoolRef = doc(db, 'schools', schoolId);
      batch.set(schoolRef, rest); // Sets the profile and other top-level fields
      
      // Seed subcollections
      students.forEach(item => batch.set(doc(db, 'schools', schoolId, 'students', item.id), item));
      teachers.forEach(item => batch.set(doc(db, 'schools', schoolId, 'teachers', item.id), item));
      classes.forEach(item => batch.set(doc(db, 'schools', schoolId, 'classes', item.id), item));
      courses.forEach(item => batch.set(doc(db, 'schools', schoolId, 'courses', item.id), item));
      syllabi.forEach(item => batch.set(doc(db, 'schools', schoolId, 'syllabi', item.id), item));
      admissions.forEach(item => batch.set(doc(db, 'schools', schoolId, 'admissions', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      finance.forEach(item => batch.set(doc(db, 'schools', schoolId, 'finance', item.id), item));
      assets.forEach(item => batch.set(doc(db, 'schools', schoolId, 'assets', item.id), item));
      exams.forEach(item => batch.set(doc(db, 'schools', schoolId, 'exams', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      grades.forEach(item => batch.set(doc(db, 'schools', schoolId, 'grades', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      attendance.forEach(item => batch.set(doc(db, 'schools', schoolId, 'attendance', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      events.forEach(item => batch.set(doc(db, 'schools', schoolId, 'events', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      expenses.forEach(item => batch.set(doc(db, 'schools', schoolId, 'expenses', item.id), item));
      teams.forEach(item => batch.set(doc(db, 'schools', schoolId, 'teams', item.id), item));
      competitions.forEach(item => batch.set(doc(db, 'schools', schoolId, 'competitions', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      terms.forEach(item => batch.set(doc(db, 'schools', schoolId, 'terms', item.id), {...item, startDate: Timestamp.fromDate(new Date(item.startDate)), endDate: Timestamp.fromDate(new Date(item.endDate))}));
      holidays.forEach(item => batch.set(doc(db, 'schools', schoolId, 'holidays', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      kioskMedia.forEach(item => batch.set(doc(db, 'schools', schoolId, 'kioskMedia', item.id), {...item, createdAt: Timestamp.fromDate(new Date(item.createdAt))}));
      activityLogs.forEach(item => batch.set(doc(db, 'schools', schoolId, 'activityLogs', item.id), {...item, timestamp: serverTimestamp()}));
      messages.forEach(item => batch.set(doc(db, 'schools', schoolId, 'messages', item.id), {...item, timestamp: Timestamp.fromDate(new Date(item.timestamp))}));
      savedReports.forEach(item => batch.set(doc(db, 'schools', schoolId, 'savedReports', item.id), {...item, date: Timestamp.fromDate(new Date(item.date))}));
      deployedTests.forEach(item => batch.set(doc(db, 'schools', schoolId, 'deployedTests', item.id), {...item, deadline: Timestamp.fromDate(new Date(item.deadline))}));
      savedTests.forEach(item => batch.set(doc(db, 'schools', schoolId, 'savedTests', item.id), {...item, createdAt: Timestamp.fromDate(new Date(item.createdAt))}));
    }

    // Seed users
    Object.entries(mockUsers).forEach(([username, userProfile]) => {
        const userRef = doc(db, 'users', username);
        batch.set(userRef, userProfile);
    });

    await batch.commit();
    console.log("Database seeded successfully.");
}

async function getSubcollection<T>(schoolId: string, collectionName: string): Promise<T[]> {
  const snapshot = await getDocs(collection(db, 'schools', schoolId, collectionName));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

// --- Data Fetching ---
export async function getSchoolsFromFirestore(): Promise<Record<string, SchoolData>> {
  const schoolsSnapshot = await getDocs(collection(db, 'schools'));
  if (schoolsSnapshot.empty) {
    return {};
  }

  const schoolDataPromises = schoolsSnapshot.docs.map(async (schoolDoc) => {
    const schoolId = schoolDoc.id;
    const profile = { id: schoolId, ...schoolDoc.data() } as SchoolProfile;

    // Parallel fetch for all subcollections
    const [
      students, teachers, classes, courses, syllabi, admissions, finance,
      assets, exams, grades, attendance, events, expenses, teams, competitions,
      terms, holidays, kioskMedia, activityLogs, messages, savedReports,
      deployedTests, savedTests
    ] = await Promise.all([
      getSubcollection<Student>(schoolId, 'students'),
      getSubcollection<Teacher>(schoolId, 'teachers'),
      getSubcollection<Class>(schoolId, 'classes'),
      getSubcollection<Course>(schoolId, 'courses'),
      getSubcollection<Syllabus>(schoolId, 'syllabi'),
      getSubcollection<Admission>(schoolId, 'admissions'),
      getSubcollection<FinanceRecord>(schoolId, 'finance'),
      getSubcollection<any>(schoolId, 'assets'),
      getSubcollection<Exam>(schoolId, 'exams'),
      getSubcollection<Grade>(schoolId, 'grades'),
      getSubcollection<Attendance>(schoolId, 'attendance'),
      getSubcollection<Event>(schoolId, 'events'),
      getSubcollection<Expense>(schoolId, 'expenses'),
      getSubcollection<Team>(schoolId, 'teams'),
      getSubcollection<Competition>(schoolId, 'competitions'),
      getSubcollection<any>(schoolId, 'terms'),
      getSubcollection<any>(schoolId, 'holidays'),
      getSubcollection<KioskMedia>(schoolId, 'kioskMedia'),
      getSubcollection<ActivityLog>(schoolId, 'activityLogs'),
      getSubcollection<Message>(schoolId, 'messages'),
      getSubcollection<SavedReport>(schoolId, 'savedReports'),
      getSubcollection<DeployedTest>(schoolId, 'deployedTests'),
      getSubcollection<SavedTest>(schoolId, 'savedTests'),
    ]);

    return {
      [schoolId]: {
        profile, students, teachers, classes, courses, syllabi, admissions, finance,
        assets, exams, grades, attendance, events, expenses, teams, competitions,
        terms, holidays, kioskMedia, activityLogs, messages, savedReports, deployedTests,
        savedTests,
        feeDescriptions: profile.feeDescriptions || [],
        audiences: profile.audiences || [],
        expenseCategories: profile.expenseCategories || [],
        examBoards: profile.examBoards || [],
        schoolGroups: profile.schoolGroups || {},
      }
    };
  });

  const allSchoolDataArray = await Promise.all(schoolDataPromises);
  return Object.assign({}, ...allSchoolDataArray);
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

// --- Data Writing ---

export async function createSchoolInFirestore(data: NewSchoolData, groupId?: string): Promise<{ school: SchoolData, adminProfile: UserProfile, adminUsername: string }> {
    const batch = writeBatch(db);
    const schoolId = data.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || `school${Date.now()}`;
    const schoolRef = doc(db, 'schools', schoolId);

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
        subscription: { status: 'Paid', amount: 300, dueDate: '2025-01-01' },
        awards: [],
        feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'],
        audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
        expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
        examBoards: ['Internal', 'Cambridge', 'IEB'],
        schoolGroups: {},
    };

    const adminUsername = data.email.split('@')[0].replace(/[^a-z0-9]/gi, '');
    const adminProfile: UserProfile = {
        user: { username: adminUsername, name: data.head, role: 'Admin', email: data.email, schoolId: schoolId },
        password: 'password'
    };

    const newSchoolData: SchoolData = {
        profile: newSchoolProfile,
        students: [], teachers: [], classes: [], courses: [], syllabi: [],
        admissions: [], exams: [], finance: [], assets: [], grades: [], attendance: [],
        events: [], expenses: [], teams: [], competitions: [], terms: [], holidays: [],
        kioskMedia: [], activityLogs: [], messages: [], savedReports: [],
        deployedTests: [], lessonPlans: [], savedTests: [],
        feeDescriptions: newSchoolProfile.feeDescriptions,
        audiences: newSchoolProfile.audiences,
        expenseCategories: newSchoolProfile.expenseCategories,
        examBoards: newSchoolProfile.examBoards,
        schoolGroups: newSchoolProfile.schoolGroups,
    };

    batch.set(schoolRef, { profile: newSchoolProfile });

    const userDocRef = doc(db, 'users', adminUsername);
    batch.set(userDocRef, adminProfile);
    
    if (groupId) {
        const groupHolderSchoolId = 'miniarte'; // Hardcoded group holder
        const groupRef = doc(db, 'schools', groupHolderSchoolId);
        batch.update(groupRef, { [`profile.schoolGroups.${groupId}`]: arrayUnion(schoolId) });
    }

    await batch.commit();
    return { school: newSchoolData, adminProfile, adminUsername };
}

export async function createUserInFirestore(username: string, profile: UserProfile): Promise<void> {
    const userDocRef = doc(db, 'users', username);
    await setDoc(userDocRef, profile);
}

export async function updateSchoolInFirestore(schoolId: string, data: Partial<SchoolProfile>): Promise<boolean> {
    try {
        const schoolRef = doc(db, 'schools', schoolId);
        const updateData: Record<string, any> = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) {
                updateData[`profile.${key}`] = data[key];
            }
        }
        if (Object.keys(updateData).length === 0) return true;
        await updateDoc(schoolRef, updateData);
        return true;
    } catch (error) {
        console.error("Error updating school profile in Firestore:", error);
        return false;
    }
}

// Generic add/delete functions for subcollections
async function addToSubcollection<T extends { id: string }>(schoolId: string, collectionName: string, item: Omit<T, 'id'>): Promise<T> {
  const collectionRef = collection(db, 'schools', schoolId, collectionName);
  const docRef = await addDoc(collectionRef, item);
  return { id: docRef.id, ...item } as T;
}

async function deleteFromSubcollection(schoolId: string, collectionName: string, itemId: string): Promise<void> {
    await deleteDoc(doc(db, 'schools', schoolId, collectionName, itemId));
}

// --- Teacher CRUD ---
export async function addTeacherToFirestore(schoolId: string, teacherData: Omit<Teacher, 'id' | 'status'>): Promise<Teacher> {
    const newTeacherData = { status: 'Active' as const, ...teacherData };
    return addToSubcollection<Teacher>(schoolId, 'teachers', newTeacherData);
}

export async function updateTeacherInFirestore(schoolId: string, teacherId: string, teacherData: Partial<Teacher>): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId, 'teachers', teacherId), teacherData);
}

export async function deleteTeacherFromFirestore(schoolId: string, teacherId: string): Promise<void> {
    await deleteFromSubcollection(schoolId, 'teachers', teacherId);
}

// --- Class CRUD ---
export async function addClassToFirestore(schoolId: string, classData: Omit<Class, 'id'>): Promise<Class> {
    return addToSubcollection<Class>(schoolId, 'classes', classData);
}

export async function updateClassInFirestore(schoolId: string, classId: string, classData: Partial<Class>): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId, 'classes', classId), classData);
}

export async function deleteClassFromFirestore(schoolId: string, classId: string): Promise<void> {
    await deleteFromSubcollection(schoolId, 'classes', classId);
}

// --- Course CRUD ---
export async function addCourseToFirestore(schoolId: string, courseData: Omit<Course, 'id'>): Promise<Course> {
    return addToSubcollection<Course>(schoolId, 'courses', courseData);
}

export async function updateCourseInFirestore(schoolId: string, courseId: string, courseData: Partial<Course>): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId, 'courses', courseId), courseData);
}

export async function deleteCourseFromFirestore(schoolId: string, courseId: string): Promise<void> {
    await deleteFromSubcollection(schoolId, 'courses', courseId);
}

// --- Syllabus CRUD ---
export async function addSyllabusToFirestore(schoolId: string, syllabusData: Omit<Syllabus, 'id' | 'topics'>): Promise<Syllabus> {
    const newSyllabusData = { topics: [], ...syllabusData };
    return addToSubcollection<Syllabus>(schoolId, 'syllabi', newSyllabusData);
}

export async function updateSyllabusTopicInFirestore(schoolId: string, syllabusId: string, topic: SyllabusTopic): Promise<void> {
    const syllabusRef = doc(db, 'schools', schoolId, 'syllabi', syllabusId);
    const syllabusSnapshot = await getDoc(syllabusRef);
    if (!syllabusSnapshot.exists()) return;
    const syllabusData = syllabusSnapshot.data() as Syllabus;
    const topicIndex = syllabusData.topics.findIndex(t => t.id === topic.id);
    if (topicIndex > -1) {
        syllabusData.topics[topicIndex] = topic;
    } else {
        syllabusData.topics.push(topic);
    }
    await updateDoc(syllabusRef, { topics: syllabusData.topics });
}

export async function deleteSyllabusTopicFromFirestore(schoolId: string, syllabusId: string, topicId: string): Promise<void> {
    const syllabusRef = doc(db, 'schools', schoolId, 'syllabi', syllabusId);
    const syllabusSnapshot = await getDoc(syllabusRef);
    if (!syllabusSnapshot.exists()) return;
    const syllabusData = syllabusSnapshot.data() as Syllabus;
    const updatedTopics = syllabusData.topics.filter(t => t.id !== topicId);
    await updateDoc(syllabusRef, { topics: updatedTopics });
}

// --- Finance CRUD ---
export async function addFeeToFirestore(schoolId: string, feeData: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>, studentName: string): Promise<FinanceRecord> {
    const newFeeData = { studentName, status: 'Pending' as const, amountPaid: 0, ...feeData };
    return addToSubcollection<FinanceRecord>(schoolId, 'finance', newFeeData);
}

export async function recordPaymentInFirestore(schoolId: string, feeId: string, amount: number): Promise<FinanceRecord | null> {
    const feeRef = doc(db, 'schools', schoolId, 'finance', feeId);
    const feeSnapshot = await getDoc(feeRef);
    if (!feeSnapshot.exists()) return null;
    const feeData = feeSnapshot.data() as FinanceRecord;
    const newAmountPaid = feeData.amountPaid + amount;
    const status = newAmountPaid >= feeData.totalAmount ? 'Paid' : 'Partially Paid';
    await updateDoc(feeRef, { amountPaid: newAmountPaid, status });
    return { ...feeData, id: feeId, amountPaid: newAmountPaid, status };
}

export async function addExpenseToFirestore(schoolId: string, expenseData: Omit<Expense, 'id'>): Promise<Expense> {
    return addToSubcollection<Expense>(schoolId, 'expenses', expenseData);
}

// --- Sports CRUD ---
export async function addTeamToFirestore(schoolId: string, teamData: Omit<Team, 'id' | 'playerIds'>): Promise<Team> {
    const newTeamData = { playerIds: [], ...teamData };
    return addToSubcollection<Team>(schoolId, 'teams', newTeamData);
}

export async function deleteTeamFromFirestore(schoolId: string, teamId: string): Promise<void> {
    await deleteFromSubcollection(schoolId, 'teams', teamId);
}

export async function addPlayerToTeamInFirestore(schoolId: string, teamId: string, studentId: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId, 'teams', teamId), { playerIds: arrayUnion(studentId) });
}

export async function removePlayerFromTeamInFirestore(schoolId: string, teamId: string, studentId: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId, 'teams', teamId), { playerIds: arrayRemove(studentId) });
}

export async function addCompetitionToFirestore(schoolId: string, competitionData: Omit<Competition, 'id' | 'date'> & { date: Date }): Promise<Competition> {
    const newCompetitionData = { ...competitionData, date: Timestamp.fromDate(competitionData.date) };
    const addedDoc = await addDoc(collection(db, 'schools', schoolId, 'competitions'), newCompetitionData);
    return { id: addedDoc.id, ...competitionData };
}

export async function addCompetitionResultInFirestore(schoolId: string, competitionId: string, result: Competition['result']): Promise<Competition | null> {
    const competitionRef = doc(db, 'schools', schoolId, 'competitions', competitionId);
    const outcome = result.ourScore > result.opponentScore ? 'Win' : result.ourScore < result.opponentScore ? 'Loss' : 'Draw';
    const finalResult = { ...result, outcome };
    await updateDoc(competitionRef, { result: finalResult });
    const updatedDoc = await getDoc(competitionRef);
    return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } as Competition : null;
}

// --- Admission CRUD ---
export async function addAdmissionToFirestore(schoolId: string, admissionData: NewAdmissionData, parentName: string, parentEmail: string): Promise<Admission> {
    const newAdmissionData = { status: 'Pending' as const, parentName, parentEmail, date: Timestamp.now(), ...admissionData };
    return addToSubcollection<Admission>(schoolId, 'admissions', newAdmissionData as any);
}

export async function updateAdmissionStatusInFirestore(schoolId: string, admissionId: string, status: Admission['status']): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId, 'admissions', admissionId), { status });
}

export async function addStudentFromAdmissionInFirestore(schoolId: string, application: Admission): Promise<Student> {
    return await runTransaction(db, async (transaction) => {
        const gradeParts = application.appliedFor.replace('Grade ', '').split('-');
        const grade = gradeParts[0]?.trim() || '1';
        const studentClass = gradeParts[1]?.trim() || 'A';

        const newStudentData: Omit<Student, 'id'> = {
            name: application.name,
            email: `${application.name.toLowerCase().replace(/\s+/g, '.')}@${schoolId}.edu`,
            phone: `555-01${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
            address: '123 Oak Avenue, Maputo',
            sex: application.sex,
            dateOfBirth: application.dateOfBirth,
            grade,
            class: studentClass,
            parentName: application.parentName,
            parentEmail: application.parentEmail,
            status: 'Active',
            behavioralAssessments: [],
        };
        
        const newStudentRef = doc(collection(db, 'schools', schoolId, 'students'));
        transaction.set(newStudentRef, newStudentData);

        if (application.type === 'Transfer' && application.fromSchoolId && application.studentIdToTransfer) {
            const studentToTransferRef = doc(db, 'schools', application.fromSchoolId, 'students', application.studentIdToTransfer);
            transaction.update(studentToTransferRef, { status: 'Transferred' });
        }
        
        return { id: newStudentRef.id, ...newStudentData };
    });
}


// --- Other CRUD operations ---
export async function addAssetToFirestore(schoolId: string, assetData: Omit<any, 'id'>): Promise<any> {
    return addToSubcollection<any>(schoolId, 'assets', assetData);
}

export async function addKioskMediaToFirestore(schoolId: string, mediaData: Omit<KioskMedia, 'id' | 'createdAt'>): Promise<KioskMedia> {
    const newMediaData = { ...mediaData, createdAt: Timestamp.now() };
    return addToSubcollection<KioskMedia>(schoolId, 'kioskMedia', newMediaData as any);
}

export async function removeKioskMediaFromFirestore(schoolId: string, mediaId: string): Promise<void> {
    await deleteFromSubcollection(schoolId, 'kioskMedia', mediaId);
}

export async function addBehavioralAssessmentToFirestore(schoolId: string, assessmentData: Omit<BehavioralAssessment, 'id' | 'date'>): Promise<BehavioralAssessment> {
    const newAssessmentData = { ...assessmentData, date: Timestamp.now() };
    const studentRef = doc(db, 'schools', schoolId, 'students', assessmentData.studentId);
    await updateDoc(studentRef, { behavioralAssessments: arrayUnion(newAssessmentData) });
    return { id: `BA${Date.now()}`, ...newAssessmentData, date: new Date() };
}

export async function addGradeToFirestore(schoolId: string, gradeData: Omit<Grade, 'id'|'date'>): Promise<Grade> {
    const newGradeData = { ...gradeData, date: Timestamp.now() };
    return addToSubcollection<Grade>(schoolId, 'grades', newGradeData as any);
}

export async function addLessonAttendanceToFirestore(schoolId: string, courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>): Promise<void> {
    const batch = writeBatch(db);
    const attendanceDate = new Date(date);
    for (const [studentId, status] of Object.entries(studentStatuses)) {
        const attendanceRef = collection(db, 'schools', schoolId, 'attendance');
        batch.set(doc(attendanceRef), { studentId, date: Timestamp.fromDate(attendanceDate), status, courseId });
    }
    await batch.commit();
}

export async function addTestSubmissionToFirestore(schoolId: string, deployedTestId: string, studentId: string, score: number): Promise<void> {
    const submission = { studentId, score, submittedAt: Timestamp.now() };
    await updateDoc(doc(db, 'schools', schoolId, 'deployedTests', deployedTestId), {
        submissions: arrayUnion(submission)
    });
}

// Academic Year Settings
export async function addTermToFirestore(schoolId: string, termData: any): Promise<any> {
    return addToSubcollection<any>(schoolId, 'terms', { ...termData, startDate: Timestamp.fromDate(termData.startDate), endDate: Timestamp.fromDate(termData.endDate) });
}

export async function addHolidayToFirestore(schoolId: string, holidayData: any): Promise<any> {
    return addToSubcollection<any>(schoolId, 'holidays', { ...holidayData, date: Timestamp.fromDate(holidayData.date) });
}

export async function addExamBoardToFirestore(schoolId: string, boardName: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), { 'profile.examBoards': arrayUnion(boardName) });
}

export async function deleteExamBoardFromFirestore(schoolId: string, boardName: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), { 'profile.examBoards': arrayRemove(boardName) });
}

export async function addFeeDescriptionToFirestore(schoolId: string, desc: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), { 'profile.feeDescriptions': arrayUnion(desc) });
}

export async function deleteFeeDescriptionFromFirestore(schoolId: string, desc: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), { 'profile.feeDescriptions': arrayRemove(desc) });
}

export async function addAudienceToFirestore(schoolId: string, aud: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), { 'profile.audiences': arrayUnion(aud) });
}

export async function deleteAudienceFromFirestore(schoolId: string, aud: string): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), { 'profile.audiences': arrayRemove(aud) });
}

// Messaging
export async function sendMessageInFirestore(senderSchoolId: string, recipientSchoolId: string, messageData: NewMessageData): Promise<Message> {
    const collectionRef = collection(db, 'schools', recipientSchoolId, 'messages');
    const newMessage = { ...messageData, timestamp: Timestamp.now(), status: 'Pending' };
    const docRef = await addDoc(collectionRef, newMessage);
    return { id: docRef.id, ...newMessage, timestamp: new Date() } as Message;
}

    


import { doc, setDoc, updateDoc, collection, getDocs, writeBatch, serverTimestamp, Timestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './config';
import { type SchoolData, type NewSchoolData, type SchoolProfile, type UserProfile, initialSchoolData, mockUsers, Teacher, Class } from '@/lib/mock-data';
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

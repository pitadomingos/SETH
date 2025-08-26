
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
        subscription: { status: 'Paid', amount: 300, dueDate: '2025-01-01' },
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

export async function addAdmissionToFirestore(schoolId: string, admissionData: NewAdmissionData, parentName: string, parentEmail: string): Promise<Admission> {
    const newAdmission: Admission = {
        id: `ADM${Date.now()}${Math.random().toString(36).substring(2, 9)}`,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        parentName: parentName,
        parentEmail: parentEmail,
        grades: admissionData.gradesSummary || 'N/A',
        ...admissionData,
        // Ensure optional fields are handled
        name: admissionData.name!,
        dateOfBirth: admissionData.dateOfBirth!,
        sex: admissionData.sex!,
        appliedFor: admissionData.appliedFor!,
        formerSchool: admissionData.formerSchool!,
    };
    
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { admissions: arrayUnion(newAdmission) });
    return newAdmission;
}


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
      // @ts-ignore
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

// --- Asset CRUD ---
export async function addAssetToFirestore(schoolId: string, assetData: Omit<any, 'id'>): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newAsset = {
        id: `ASSET${Date.now()}`,
        ...assetData
    };
    await updateDoc(schoolRef, {
        assets: arrayUnion(newAsset)
    });
    return newAsset;
}

// Kiosk Media
export async function addKioskMediaToFirestore(schoolId: string, mediaData: Omit<any, 'id' | 'createdAt'>): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newMedia = {
        id: `MEDIA${Date.now()}`,
        createdAt: Timestamp.now(),
        ...mediaData
    };
    await updateDoc(schoolRef, { kioskMedia: arrayUnion(newMedia) });
    return { ...newMedia, createdAt: newMedia.createdAt.toDate() };
}

export async function removeKioskMediaFromFirestore(schoolId: string, mediaId: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const mediaToRemove = schoolData.kioskMedia.find(m => m.id === mediaId);
    if (mediaToRemove) {
        await updateDoc(schoolRef, {
            kioskMedia: arrayRemove(mediaToRemove)
        });
    }
}

// Behavioral Assessment
export async function addBehavioralAssessmentToFirestore(schoolId: string, assessmentData: Omit<any, 'id' | 'date'>): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;
    const newAssessment = {
        id: `BA${Date.now()}`,
        date: Timestamp.now(),
        ...assessmentData
    };
    const updatedStudents = schoolData.students.map(s => {
        if(s.id === assessmentData.studentId) {
            if(!s.behavioralAssessments) s.behavioralAssessments = [];
            s.behavioralAssessments.push(newAssessment);
        }
        return s;
    });
    await updateDoc(schoolRef, { students: updatedStudents });
    return { ...newAssessment, date: newAssessment.date.toDate() };
}

// Grade
export async function addGradeToFirestore(schoolId: string, gradeData: Omit<any, 'id'|'date'>): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newGrade = {
        id: `GR${Date.now()}`,
        date: Timestamp.now(),
        ...gradeData
    };
    await updateDoc(schoolRef, { grades: arrayUnion(newGrade) });
    return { ...newGrade, date: newGrade.date.toDate() };
}

// Attendance
export async function addLessonAttendanceToFirestore(schoolId: string, courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;

    const attendanceDate = new Date(date);
    const newRecords = Object.entries(studentStatuses).map(([studentId, status]) => ({
        id: `ATT${Date.now()}${studentId}`,
        studentId,
        date: Timestamp.fromDate(attendanceDate),
        status,
        courseId,
    }));

    // Remove any existing records for this specific lesson (date + course)
    const filteredAttendance = schoolData.attendance.filter(a => {
        const recordDateStr = (a.date as any).toDate().toISOString().split('T')[0];
        return !(recordDateStr === date && a.courseId === courseId);
    });

    const updatedAttendance = [...filteredAttendance, ...newRecords];
    await updateDoc(schoolRef, { attendance: updatedAttendance });
}

// Test Submission
export async function addTestSubmissionToFirestore(schoolId: string, deployedTestId: string, studentId: string, score: number): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    const schoolSnapshot = await getDoc(schoolRef);
    const schoolData = schoolSnapshot.data() as SchoolData;

    const submission = {
        studentId,
        score,
        submittedAt: Timestamp.now()
    };
    
    const updatedTests = schoolData.deployedTests.map(t => {
        if(t.id === deployedTestId) {
            return {...t, submissions: [...t.submissions, submission]};
        }
        return t;
    });
    
    await updateDoc(schoolRef, { deployedTests: updatedTests });
}


// --- Academic Year Settings ---

export async function addTermToFirestore(schoolId: string, termData: any): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newTerm = {
        id: `TERM${Date.now()}`,
        ...termData,
        startDate: Timestamp.fromDate(termData.startDate),
        endDate: Timestamp.fromDate(termData.endDate),
    };
    await updateDoc(schoolRef, { terms: arrayUnion(newTerm) });
    return { ...newTerm, startDate: newTerm.startDate.toDate(), endDate: newTerm.endDate.toDate() };
}

export async function addHolidayToFirestore(schoolId: string, holidayData: any): Promise<any> {
    const schoolRef = doc(db, 'schools', schoolId);
    const newHoliday = {
        id: `HOL${Date.now()}`,
        ...holidayData,
        date: Timestamp.fromDate(holidayData.date)
    };
    await updateDoc(schoolRef, { holidays: arrayUnion(newHoliday) });
    return { ...newHoliday, date: newHoliday.date.toDate() };
}

// Dropdown List Management
export async function addExamBoardToFirestore(schoolId: string, boardName: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { examBoards: arrayUnion(boardName) });
}

export async function deleteExamBoardFromFirestore(schoolId: string, boardName: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { examBoards: arrayRemove(boardName) });
}

export async function addFeeDescriptionToFirestore(schoolId: string, desc: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { feeDescriptions: arrayUnion(desc) });
}

export async function deleteFeeDescriptionFromFirestore(schoolId: string, desc: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { feeDescriptions: arrayRemove(desc) });
}

export async function addAudienceToFirestore(schoolId: string, aud: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { audiences: arrayUnion(aud) });
}

export async function deleteAudienceFromFirestore(schoolId: string, aud: string): Promise<void> {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, { audiences: arrayRemove(aud) });
}

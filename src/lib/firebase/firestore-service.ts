
import { doc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './config';
import { type SchoolData, type NewSchoolData, type SchoolProfile, type UserProfile, mockUsers } from '@/lib/mock-data';

export async function getSchoolsFromFirestore(): Promise<Record<string, SchoolData>> {
    const schoolsCollection = collection(db, 'schools');
    const schoolSnapshot = await getDocs(schoolsCollection);
    const schoolList = schoolSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data() as SchoolData;
        return acc;
    }, {} as Record<string, SchoolData>);
    return schoolList;
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
    
    await setDoc(doc(db, 'schools', schoolId), newSchoolData);
    
    if (groupId) {
        // In a real app, you would update the school group document.
        // For the prototype, this logic is handled client-side.
        console.log(`School ${schoolId} associated with group ${groupId}.`);
    }
    
    console.log(`Successfully created school data in Firestore: ${schoolId}.`);

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

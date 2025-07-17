
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { type SchoolData, type NewSchoolData, type SchoolProfile } from '@/context/school-data-context';

export async function createSchoolInFirestore(data: NewSchoolData, groupId?: string): Promise<SchoolData> {
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
        gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
        kioskConfig: { showDashboard: true, showLeaderboard: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
        schoolLevel: 'Full'
    };
    
    // NOTE: In a real app, user creation would happen via Firebase Auth, not a mock object.
    const adminUser = {
      user: {
        username: data.email,
        name: data.head,
        role: 'Admin',
        email: data.email,
        schoolId: schoolId,
      },
      password: 'admin' // Default password for new admins in the prototype
    };

    const newSchoolData: SchoolData = {
        profile: newSchoolProfile,
        students: [], teachers: [], classes: [], courses: [], lessonPlans: [], syllabi: [],
        savedTests: [], deployedTests: [], admissions: [], exams: [],
        finance: [], assets: [], assignments: [], grades: [], attendance: [],
        events: [], feeDescriptions: ['Term Tuition', 'Lab Fees', 'Sports Uniform'],
        audiences: ['All Students', 'Parents', 'Teachers', 'Grades 9-12', 'Whole School Community', 'All Staff'],
        expenseCategories: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Academics'],
        expenses: [], teams: [], competitions: [], terms: [], holidays: [],
        kioskMedia: [],
        activityLogs: [{
            id: `LOG${schoolId}${Date.now()}`,
            timestamp: new Date().toISOString(),
            schoolId: schoolId,
            user: 'System Admin',
            role: 'GlobalAdmin',
            action: 'Create',
            details: `Provisioned new school: ${data.name}.`
        }],
        messages: [], savedReports: [],
    };
    
    // Write to the actual Firestore database
    await setDoc(doc(db, 'schools', schoolId), newSchoolData);
    
    console.log(`Successfully wrote school to Firestore: ${schoolId}.`);

    // In a real app, this would also write to the users collection.
    // For the prototype, we just return the data structure.
    return newSchoolData;
}


export async function updateSchoolInFirestore(schoolId: string, data: Partial<SchoolProfile>): Promise<boolean> {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    
    // Firestore's `updateDoc` requires dot notation for nested objects.
    // We create an object with dot notation keys from the partial data.
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

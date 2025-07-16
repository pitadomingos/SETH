
'use server';

import { SchoolData, NewSchoolData, SchoolProfile } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';

// This is a placeholder for a real database operation.
// In a real application, this would interact with Firebase/Firestore.
let schoolDataStore: Record<string, SchoolData> = {};
if (process.env.NODE_ENV === 'development') {
    // To simulate persistence across server action calls in dev mode, we can use a global variable.
    // In a real app, this would be a database.
    if (!global.schoolDataStore) {
        global.schoolDataStore = {}; // Initialize if it doesn't exist
    }
    schoolDataStore = global.schoolDataStore;
}


export async function createSchool(data: NewSchoolData, groupId?: string): Promise<SchoolData | null> {
    try {
        // In a real app, you would perform validation here (e.g., check if school name already exists)
        const schoolId = data.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
        
        const newSchoolProfile: SchoolProfile = {
            id: schoolId,
            ...data,
            tier: groupId ? 'Premium' : data.tier,
            logoUrl: 'https://placehold.co/100x100.png',
            gradingSystem: '20-Point',
            currency: 'USD',
            status: 'Active',
            gradeCapacity: { "1": 30, "2": 30, "3": 30, "4": 30, "5": 30, "6": 35, "7": 35, "8": 35, "9": 40, "10": 40, "11": 40, "12": 40 },
            kioskConfig: { showDashboard: true, showLeaderboard: true, showAttendance: false, showAcademics: false, showAwards: false, showPerformers: false, showAwardWinner: false, showShowcase: false },
            schoolLevel: 'Full'
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
                user: 'System Admin', // In a real app, you'd get the current user
                role: 'GlobalAdmin',
                action: 'Create',
                details: `Provisioned new school: ${data.name}.`
            }],
            messages: [], savedReports: [],
        };
        
        // This simulates saving to a database.
        schoolDataStore[schoolId] = newSchoolData;
        
        // Revalidate the path to update the UI for all users viewing this page.
        revalidatePath('/dashboard/global-admin/all-schools');
        
        return newSchoolData;
    } catch (error) {
        console.error("Failed to create school:", error);
        return null;
    }
}

// In the future, you would add more server actions here for:
// - getSchool(id) -> READ
// - updateSchool(id, data) -> UPDATE
// - deleteSchool(id) -> DELETE


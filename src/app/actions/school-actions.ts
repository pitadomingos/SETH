
'use server';

import { NewSchoolData, SchoolData, UserProfile, Teacher, Class, Syllabus, SyllabusTopic, Course, FinanceRecord, Expense, Team, Competition, Admission, Student, KioskMedia, BehavioralAssessment, Grade, AttendanceRecord, DeployedTest } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';
import { createSchoolInFirestore, addTeacherToFirestore, updateTeacherInFirestore, deleteTeacherFromFirestore, addClassToFirestore, updateClassInFirestore, deleteClassFromFirestore, updateSyllabusTopicInFirestore, deleteSyllabusTopicFromFirestore, addSyllabusToFirestore, addCourseToFirestore, updateCourseInFirestore, deleteCourseFromFirestore, addFeeToFirestore, recordPaymentInFirestore, addExpenseToFirestore, addTeamToFirestore, deleteTeamFromFirestore, addPlayerToTeamInFirestore, removePlayerFromTeamInFirestore, addCompetitionToFirestore, addCompetitionResultInFirestore, updateAdmissionStatusInFirestore, addStudentFromAdmissionInFirestore, addAssetToFirestore, addKioskMediaToFirestore, removeKioskMediaFromFirestore, addBehavioralAssessmentToFirestore, addGradeToFirestore, addLessonAttendanceToFirestore, addTestSubmissionToFirestore } from '@/lib/firebase/firestore-service';

// This is now just a wrapper for the Firestore service function
export async function createSchoolAction(data: NewSchoolData, groupId?: string): Promise<{ school: SchoolData, adminUser: { username: string, profile: UserProfile } } | null> {
    try {
        const result = await createSchoolInFirestore(data, groupId);
        revalidatePath('/dashboard/global-admin/all-schools');
        revalidatePath('/dashboard/manage-schools');
        return result;
    } catch (error) {
        console.error("Failed to create school:", error);
        return null;
    }
}

export async function addTeacherAction(schoolId: string, teacherData: Omit<Teacher, 'id' | 'status'>) {
    try {
        const newTeacher = await addTeacherToFirestore(schoolId, teacherData);
        revalidatePath('/dashboard/teachers');
        return { success: true, teacher: newTeacher };
    } catch(e) {
        console.error("Failed to add teacher", e);
        return { success: false, error: 'Server error adding teacher.' };
    }
}

export async function updateTeacherAction(schoolId: string, teacherId: string, teacherData: Partial<Teacher>) {
    try {
        await updateTeacherInFirestore(schoolId, teacherId, teacherData);
        revalidatePath('/dashboard/teachers');
        return { success: true };
    } catch(e) {
        console.error("Failed to update teacher", e);
        return { success: false, error: 'Server error updating teacher.' };
    }
}

export async function deleteTeacherAction(schoolId: string, teacherId: string) {
    try {
        await deleteTeacherFromFirestore(schoolId, teacherId);
        revalidatePath('/dashboard/teachers');
        return { success: true };
    } catch(e) {
        console.error("Failed to delete teacher", e);
        return { success: false, error: 'Server error deleting teacher.' };
    }
}

export async function addClassAction(schoolId: string, classData: Omit<Class, 'id'>) {
    try {
        const newClass = await addClassToFirestore(schoolId, classData);
        revalidatePath('/dashboard/classes');
        return { success: true, class: newClass };
    } catch(e) {
        console.error("Failed to add class", e);
        return { success: false, error: 'Server error adding class.' };
    }
}

export async function updateClassAction(schoolId: string, classId: string, classData: Partial<Class>) {
    try {
        await updateClassInFirestore(schoolId, classId, classData);
        revalidatePath('/dashboard/classes');
        return { success: true };
    } catch(e) {
        console.error("Failed to update class", e);
        return { success: false, error: 'Server error updating class.' };
    }
}

export async function deleteClassAction(schoolId: string, classId: string) {
    try {
        await deleteClassFromFirestore(schoolId, classId);
        revalidatePath('/dashboard/classes');
        return { success: true };
    } catch(e) {
        console.error("Failed to delete class", e);
        return { success: false, error: 'Server error deleting class.' };
    }
}

export async function updateSyllabusTopicAction(schoolId: string, subject: string, grade: string, topic: SyllabusTopic): Promise<{ success: boolean, error?: string }> {
    try {
        await updateSyllabusTopicInFirestore(schoolId, subject, grade, topic);
        revalidatePath('/dashboard/academics');
        return { success: true };
    } catch (e) {
        console.error("Failed to update syllabus topic:", e);
        return { success: false, error: 'Server error updating syllabus topic.' };
    }
}

export async function deleteSyllabusTopicAction(schoolId: string, subject: string, grade: string, topicId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await deleteSyllabusTopicFromFirestore(schoolId, subject, grade, topicId);
        revalidatePath('/dashboard/academics');
        return { success: true };
    } catch (e) {
        console.error("Failed to delete syllabus topic:", e);
        return { success: false, error: 'Server error deleting syllabus topic.' };
    }
}

export async function addSyllabusAction(schoolId: string, syllabusData: Omit<Syllabus, 'id' | 'topics'>): Promise<{ success: boolean, syllabus?: Syllabus, error?: string }> {
    try {
        const newSyllabus = await addSyllabusToFirestore(schoolId, syllabusData);
        revalidatePath('/dashboard/academics');
        return { success: true, syllabus: newSyllabus };
    } catch (e) {
        console.error("Failed to add syllabus:", e);
        return { success: false, error: 'Server error adding syllabus.' };
    }
}

export async function addCourseAction(schoolId: string, courseData: Omit<Course, 'id'>): Promise<{ success: boolean, course?: Course, error?: string }> {
    try {
        const newCourse = await addCourseToFirestore(schoolId, courseData);
        revalidatePath('/dashboard/academics');
        return { success: true, course: newCourse };
    } catch (e) {
        console.error("Failed to add course:", e);
        return { success: false, error: 'Server error adding course.' };
    }
}

export async function updateCourseAction(schoolId: string, courseId: string, courseData: Partial<Course>): Promise<{ success: boolean, error?: string }> {
    try {
        await updateCourseInFirestore(schoolId, courseId, courseData);
        revalidatePath('/dashboard/academics');
        return { success: true };
    } catch (e) {
        console.error("Failed to update course:", e);
        return { success: false, error: 'Server error updating course.' };
    }
}

export async function deleteCourseAction(schoolId: string, courseId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await deleteCourseFromFirestore(schoolId, courseId);
        revalidatePath('/dashboard/academics');
        return { success: true };
    } catch (e) {
        console.error("Failed to delete course:", e);
        return { success: false, error: 'Server error deleting course.' };
    }
}

export async function addFeeAction(schoolId: string, feeData: Omit<FinanceRecord, 'id' | 'studentName' | 'status' | 'amountPaid'>, studentName: string): Promise<{ success: boolean, fee?: FinanceRecord, error?: string }> {
    try {
        const newFee = await addFeeToFirestore(schoolId, feeData, studentName);
        revalidatePath('/dashboard/finance');
        return { success: true, fee: newFee };
    } catch (e) {
        console.error("Failed to add fee:", e);
        return { success: false, error: 'Server error adding fee.' };
    }
}

export async function recordPaymentAction(schoolId: string, feeId: string, amount: number): Promise<{ success: boolean, fee?: FinanceRecord, error?: string }> {
    try {
        const updatedFee = await recordPaymentInFirestore(schoolId, feeId, amount);
        if (updatedFee) {
            revalidatePath('/dashboard/finance');
            return { success: true, fee: updatedFee };
        }
        return { success: false, error: 'Fee not found.' };
    } catch (e) {
        console.error("Failed to record payment:", e);
        return { success: false, error: 'Server error recording payment.' };
    }
}

export async function addExpenseAction(schoolId: string, expenseData: Omit<Expense, 'id'>): Promise<{ success: boolean, expense?: Expense, error?: string }> {
    try {
        const newExpense = await addExpenseToFirestore(schoolId, expenseData);
        revalidatePath('/dashboard/finance');
        return { success: true, expense: newExpense };
    } catch (e) {
        console.error("Failed to add expense:", e);
        return { success: false, error: 'Server error adding expense.' };
    }
}


// Sports Actions
export async function addTeamAction(schoolId: string, teamData: Omit<Team, 'id' | 'playerIds'>): Promise<{ success: boolean, team?: Team, error?: string }> {
    try {
        const newTeam = await addTeamToFirestore(schoolId, teamData);
        revalidatePath('/dashboard/sports');
        return { success: true, team: newTeam };
    } catch (e) {
        console.error("Failed to add team:", e);
        return { success: false, error: 'Server error adding team.' };
    }
}

export async function deleteTeamAction(schoolId: string, teamId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await deleteTeamFromFirestore(schoolId, teamId);
        revalidatePath('/dashboard/sports');
        return { success: true };
    } catch (e) {
        console.error("Failed to delete team:", e);
        return { success: false, error: 'Server error deleting team.' };
    }
}

export async function addPlayerToTeamAction(schoolId: string, teamId: string, studentId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await addPlayerToTeamInFirestore(schoolId, teamId, studentId);
        revalidatePath('/dashboard/sports');
        return { success: true };
    } catch (e) {
        console.error("Failed to add player:", e);
        return { success: false, error: 'Server error adding player.' };
    }
}

export async function removePlayerFromTeamAction(schoolId: string, teamId: string, studentId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await removePlayerFromTeamInFirestore(schoolId, teamId, studentId);
        revalidatePath('/dashboard/sports');
        return { success: true };
    } catch (e) {
        console.error("Failed to remove player:", e);
        return { success: false, error: 'Server error removing player.' };
    }
}

export async function addCompetitionAction(schoolId: string, competitionData: Omit<Competition, 'id'>): Promise<{ success: boolean, competition?: Competition, error?: string }> {
    try {
        const newCompetition = await addCompetitionToFirestore(schoolId, competitionData);
        revalidatePath('/dashboard/sports');
        return { success: true, competition: newCompetition };
    } catch (e) {
        console.error("Failed to add competition:", e);
        return { success: false, error: 'Server error adding competition.' };
    }
}

export async function addCompetitionResultAction(schoolId: string, competitionId: string, result: Competition['result']): Promise<{ success: boolean, competition?: Competition, error?: string }> {
    try {
        const updatedCompetition = await addCompetitionResultInFirestore(schoolId, competitionId, result);
        if (updatedCompetition) {
            revalidatePath('/dashboard/sports');
            return { success: true, competition: updatedCompetition };
        }
        return { success: false, error: 'Competition not found.' };
    } catch (e) {
        console.error("Failed to add result:", e);
        return { success: false, error: 'Server error adding result.' };
    }
}

// Admission Actions
export async function updateAdmissionStatusAction(schoolId: string, admissionId: string, status: Admission['status']): Promise<{ success: boolean, error?: string }> {
    try {
        await updateAdmissionStatusInFirestore(schoolId, admissionId, status);
        revalidatePath('/dashboard/admissions');
        return { success: true };
    } catch (e) {
        console.error("Failed to update admission status:", e);
        return { success: false, error: 'Server error updating admission status.' };
    }
}

export async function addStudentFromAdmissionAction(schoolId: string, application: Admission): Promise<{ success: boolean, newStudent?: Student, error?: string }> {
    try {
        const newStudent = await addStudentFromAdmissionInFirestore(schoolId, application);
        revalidatePath('/dashboard/admissions');
        revalidatePath('/dashboard/students');
        return { success: true, newStudent };
    } catch (e) {
        console.error("Failed to enroll student from admission:", e);
        return { success: false, error: 'Server error enrolling student.' };
    }
}

// Asset Action
export async function addAssetAction(schoolId: string, assetData: Omit<any, 'id'>): Promise<{ success: boolean; asset?: any; error?: string }> {
    try {
        const newAsset = await addAssetToFirestore(schoolId, assetData);
        revalidatePath('/dashboard/assets');
        return { success: true, asset: newAsset };
    } catch (e) {
        console.error("Failed to add asset:", e);
        return { success: false, error: 'Server error adding asset.' };
    }
}

// Kiosk Media Actions
export async function addKioskMediaAction(schoolId: string, mediaData: Omit<KioskMedia, 'id' | 'createdAt'>): Promise<{ success: boolean, media?: KioskMedia, error?: string }> {
    try {
        const newMedia = await addKioskMediaToFirestore(schoolId, mediaData);
        revalidatePath('/dashboard/kiosk-showcase');
        return { success: true, media: newMedia };
    } catch (e) {
        console.error("Failed to add kiosk media:", e);
        return { success: false, error: 'Server error adding kiosk media.' };
    }
}

export async function removeKioskMediaAction(schoolId: string, mediaId: string): Promise<{ success: boolean, error?: string }> {
    try {
        await removeKioskMediaFromFirestore(schoolId, mediaId);
        revalidatePath('/dashboard/kiosk-showcase');
        return { success: true };
    } catch (e) {
        console.error("Failed to remove kiosk media:", e);
        return { success: false, error: 'Server error removing kiosk media.' };
    }
}
    
// Behavioral Assessment Action
export async function addBehavioralAssessmentAction(schoolId: string, assessmentData: Omit<BehavioralAssessment, 'id' | 'date'>): Promise<{ success: boolean, assessment?: BehavioralAssessment, error?: string }> {
    try {
        const newAssessment = await addBehavioralAssessmentToFirestore(schoolId, assessmentData);
        revalidatePath('/dashboard/behavioral');
        return { success: true, assessment: newAssessment };
    } catch (e) {
        console.error("Failed to add behavioral assessment:", e);
        return { success: false, error: 'Server error adding behavioral assessment.' };
    }
}

// Grade Action
export async function addGradeAction(schoolId: string, gradeData: Omit<Grade, 'id' | 'date'>): Promise<{ success: boolean, grade?: Grade, error?: string }> {
    try {
        const newGrade = await addGradeToFirestore(schoolId, gradeData);
        revalidatePath('/dashboard/grading');
        revalidatePath('/dashboard');
        return { success: true, grade: newGrade };
    } catch (e) {
        console.error("Failed to add grade:", e);
        return { success: false, error: 'Server error adding grade.' };
    }
}

// Attendance Action
export async function addLessonAttendanceAction(schoolId: string, courseId: string, date: string, studentStatuses: Record<string, 'Present' | 'Late' | 'Absent' | 'Sick'>): Promise<{ success: boolean, error?: string }> {
    try {
        await addLessonAttendanceToFirestore(schoolId, courseId, date, studentStatuses);
        revalidatePath('/dashboard/attendance');
        return { success: true };
    } catch (e) {
        console.error("Failed to record attendance:", e);
        return { success: false, error: 'Server error recording attendance.' };
    }
}

// Test Submission Action
export async function addTestSubmissionAction(schoolId: string, deployedTestId: string, studentId: string, score: number): Promise<{ success: boolean, error?: string }> {
    try {
        await addTestSubmissionToFirestore(schoolId, deployedTestId, studentId, score);
        revalidatePath(`/dashboard/test/${deployedTestId}`);
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        console.error("Failed to submit test:", e);
        return { success: false, error: 'Server error submitting test.' };
    }
}

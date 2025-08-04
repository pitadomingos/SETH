'use server';

import { NewSchoolData, SchoolData, UserProfile, Teacher, Class, Syllabus, SyllabusTopic, Course, FinanceRecord, Expense, Team, Competition } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';
import { createSchoolInFirestore, addTeacherToFirestore, updateTeacherInFirestore, deleteTeacherFromFirestore, addClassToFirestore, updateClassInFirestore, deleteClassFromFirestore, updateSyllabusTopicInFirestore, deleteSyllabusTopicFromFirestore, addSyllabusToFirestore, addCourseToFirestore, updateCourseInFirestore, deleteCourseFromFirestore, addFeeToFirestore, recordPaymentInFirestore, addExpenseToFirestore, addTeamToFirestore, deleteTeamFromFirestore, addPlayerToTeamInFirestore, removePlayerFromTeamInFirestore, addCompetitionToFirestore, addCompetitionResultInFirestore } from '@/lib/firebase/firestore-service';

export async function createSchool(data: NewSchoolData, groupId?: string): Promise<{ school: SchoolData, adminUser: { username: string, profile: UserProfile } } | null> {
    try {
        const { school, adminUser } = await createSchoolInFirestore(data, groupId);
        
        revalidatePath('/dashboard/global-admin/all-schools');
        revalidatePath('/dashboard/manage-schools');
        
        return { school, adminUser };
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
    

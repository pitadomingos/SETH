
'use server';

import { NewSchoolData, SchoolData, UserProfile, Teacher, Class, SyllabusTopic } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';
import { createSchoolInFirestore, addTeacherToFirestore, updateTeacherInFirestore, deleteTeacherFromFirestore, addClassToFirestore, updateClassInFirestore, deleteClassFromFirestore, updateSyllabusTopicInFirestore, deleteSyllabusTopicFromFirestore } from '@/lib/firebase/firestore-service';

export async function createSchool(data: NewSchoolData, groupId?: string): Promise<{ school: SchoolData, adminUser: { username: string, profile: UserProfile } } | null> {
    try {
        const { school, adminUser } = await createSchoolInFirestore(data, groupId);
        
        // This tells Next.js to re-fetch the data on the client for these paths.
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
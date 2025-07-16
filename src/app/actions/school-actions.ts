
'use server';

import { SchoolData, NewSchoolData } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';
import { createSchoolInFirestore } from '@/lib/firebase/firestore-service';

export async function createSchool(data: NewSchoolData, groupId?: string): Promise<SchoolData | null> {
    try {
        const newSchool = await createSchoolInFirestore(data, groupId);
        
        // Revalidate the path to update the UI for all users viewing this page.
        revalidatePath('/dashboard/global-admin/all-schools');
        revalidatePath('/dashboard/manage-schools');
        
        return newSchool;
    } catch (error) {
        console.error("Failed to create school:", error);
        // In a real app, you might want to return a more specific error object
        return null;
    }
}

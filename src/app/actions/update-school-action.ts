'use server';
import { SchoolProfile } from '@/context/school-data-context';
import { updateSchoolInFirestore } from '@/lib/firebase/firestore-service';
import { revalidatePath } from 'next/cache';

export async function updateSchoolProfileAction(schoolId: string, data: Partial<SchoolProfile>) {
    try {
        const success = await updateSchoolInFirestore(schoolId, data);
        if (success) {
            revalidatePath('/dashboard/settings');
            return { success: true };
        } else {
            return { success: false, error: "Failed to update school in Firestore." };
        }
    } catch (error) {
        console.error("Server action failed to update school profile:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}

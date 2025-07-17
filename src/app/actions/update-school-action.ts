
'use server';
import 'dotenv/config';
import { SchoolProfile } from '@/context/school-data-context';
import { updateSchoolInFirestore } from '@/lib/firebase/firestore-service';

export async function updateSchoolProfileAction(schoolId: string, data: Partial<SchoolProfile>) {
    try {
        const success = await updateSchoolInFirestore(schoolId, data);
        if (success) {
            // Revalidation is not strictly necessary with onSnapshot,
            // but can be useful for cache invalidation in some edge cases.
            // revalidatePath('/dashboard/school-profile');
            return { success: true };
        } else {
            return { success: false, error: "Failed to update school in Firestore." };
        }
    } catch (error) {
        console.error("Server action failed to update school profile:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}

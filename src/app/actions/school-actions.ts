
'use server';

import 'dotenv/config'; // Ensure environment variables are loaded for server actions
import { NewSchoolData, SchoolData } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';
import { createSchoolInFirestore } from '@/lib/firebase/firestore-service';

export async function createSchool(data: NewSchoolData, groupId?: string): Promise<SchoolData | null> {
    try {
        const newSchool = await createSchoolInFirestore(data, groupId);
        
        // This tells Next.js to re-fetch the data on the client for these paths.
        revalidatePath('/dashboard/global-admin/all-schools');
        revalidatePath('/dashboard/manage-schools');
        
        return newSchool;
    } catch (error) {
        console.error("Failed to create school:", error);
        return null;
    }
}

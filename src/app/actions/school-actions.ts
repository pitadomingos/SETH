
'use server';

import { NewSchoolData, SchoolData, UserProfile } from '@/context/school-data-context';
import { revalidatePath } from 'next/cache';
import { createSchoolInFirestore } from '@/lib/firebase/firestore-service';

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

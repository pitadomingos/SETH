'use server';

import { db } from '@/lib/firebase/config';
import { deleteDoc, doc, writeBatch, collection, query, where, getDocs } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function deleteSchoolAction(schoolId: string) {
    try {
        const batch = writeBatch(db);

        // 1. Delete the school document
        const schoolRef = doc(db, 'schools', schoolId);
        batch.delete(schoolRef);

        // 2. Find and delete the admin user for that school
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("user.schoolId", "==", schoolId), where("user.role", "==", "Admin"));
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((userDoc) => {
            batch.delete(userDoc.ref);
        });
        
        await batch.commit();

        revalidatePath('/dashboard/global-admin/all-schools');
        revalidatePath('/dashboard/manage-schools');
        
        return { success: true };

    } catch (error) {
        console.error("Failed to delete school:", error);
        return { success: false, error: "An unexpected server error occurred." };
    }
}

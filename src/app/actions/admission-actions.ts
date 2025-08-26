
'use server';

import { NewAdmissionData, Admission } from '@/context/school-data-context';
import { addAdmissionToFirestore } from '@/lib/firebase/firestore-service';
import { revalidatePath } from 'next/cache';

export async function createAdmissionAction(schoolId: string, admissionData: NewAdmissionData, parentName: string, parentEmail: string): Promise<{ success: boolean, admission?: Admission, error?: string }> {
    try {
        const newAdmission = await addAdmissionToFirestore(schoolId, admissionData, parentName, parentEmail);
        revalidatePath('/dashboard/admissions');
        revalidatePath('/dashboard');
        return { success: true, admission: newAdmission };
    } catch (e) {
        console.error("Failed to create admission:", e);
        return { success: false, error: 'Server error creating admission.' };
    }
}

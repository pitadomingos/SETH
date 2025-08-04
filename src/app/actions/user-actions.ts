'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { revalidatePath } from 'next/cache';

export async function updateUserProfileAction(
  username: string,
  data: { name?: string; phone?: string }
) {
  try {
    const userRef = doc(db, 'users', username);
    
    const updateData: Record<string, string> = {};
    if (data.name) updateData['user.name'] = data.name;
    if (data.phone) updateData['user.phone'] = data.phone;
    
    if (Object.keys(updateData).length === 0) {
        return { success: true }; // Nothing to update
    }

    await updateDoc(userRef, updateData);

    revalidatePath('/dashboard/profile');
    return { success: true, updatedData: data };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: 'Failed to update profile.' };
  }
}

'use server';

import { NewMessageData } from '@/context/school-data-context';
import { sendMessageInFirestore } from '@/lib/firebase/firestore-service';
import { revalidatePath } from 'next/cache';

export async function sendMessageAction(
  senderSchoolId: string,
  recipientSchoolId: string,
  messageData: NewMessageData
) {
  try {
    const newMessage = await sendMessageInFirestore(senderSchoolId, recipientSchoolId, messageData);
    if (newMessage) {
      // Revalidate paths for both sender and receiver's message boards
      revalidatePath('/dashboard/messaging');
      revalidatePath('/dashboard/global-admin/inbox');
      return { success: true, message: newMessage };
    }
    return { success: false, error: 'Failed to create message in Firestore.' };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}

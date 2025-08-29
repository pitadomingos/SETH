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

export async function sendMessageToGAAction(
  senderName: string,
  senderEmail: string,
  subject: string,
  body: string
) {
    const developerEmail = 'dev@edudmanage.com';
    const messageData: NewMessageData = {
        recipientUsername: developerEmail,
        subject: `[Public Inquiry] ${subject}`,
        body: `Message from: ${senderName} (${senderEmail})\n\n${body}`,
        senderName: senderName,
        senderRole: 'External Visitor',
    };
    try {
        const newMessage = await sendMessageInFirestore('public_site', 'northwood', messageData);
        if (newMessage) {
            revalidatePath('/dashboard/global-admin/inbox');
            return { success: true, message: 'Your message has been sent successfully.' };
        }
        return { success: false, error: 'Failed to create message in Firestore.' };
    } catch (error) {
        console.error('Error sending message to GA:', error);
        return { success: false, error: 'An unexpected server error occurred.' };
    }
}

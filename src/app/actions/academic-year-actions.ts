'use server';

import { addTermToFirestore, addHolidayToFirestore, addExamBoardToFirestore, deleteExamBoardFromFirestore, addFeeDescriptionToFirestore, deleteFeeDescriptionFromFirestore, addAudienceToFirestore, deleteAudienceFromFirestore } from '@/lib/firebase/firestore-service';
import { revalidatePath } from 'next/cache';

export async function addTermAction(schoolId: string, termData: any) {
  try {
    const newTerm = await addTermToFirestore(schoolId, termData);
    revalidatePath('/dashboard/settings');
    return { success: true, term: newTerm };
  } catch (e) {
    console.error("Failed to add term:", e);
    return { success: false, error: 'Server error adding term.' };
  }
}

export async function addHolidayAction(schoolId: string, holidayData: any) {
  try {
    const newHoliday = await addHolidayToFirestore(schoolId, holidayData);
    revalidatePath('/dashboard/settings');
    return { success: true, holiday: newHoliday };
  } catch (e) {
    console.error("Failed to add holiday:", e);
    return { success: false, error: 'Server error adding holiday.' };
  }
}

export async function addExamBoardAction(schoolId: string, boardName: string) {
    try {
        await addExamBoardToFirestore(schoolId, boardName);
        revalidatePath('/dashboard/settings');
        return { success: true, board: boardName };
    } catch (e) {
        console.error("Failed to add exam board:", e);
        return { success: false, error: 'Server error adding exam board.' };
    }
}

export async function deleteExamBoardAction(schoolId: string, boardName: string) {
    try {
        await deleteExamBoardFromFirestore(schoolId, boardName);
        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (e) {
        console.error("Failed to delete exam board:", e);
        return { success: false, error: 'Server error deleting exam board.' };
    }
}

export async function addFeeDescriptionAction(schoolId: string, desc: string) {
    try {
        await addFeeDescriptionToFirestore(schoolId, desc);
        revalidatePath('/dashboard/settings');
        return { success: true, description: desc };
    } catch (e) {
        console.error("Failed to add fee description:", e);
        return { success: false, error: 'Server error adding fee description.' };
    }
}

export async function deleteFeeDescriptionAction(schoolId: string, desc: string) {
    try {
        await deleteFeeDescriptionFromFirestore(schoolId, desc);
        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (e) {
        console.error("Failed to delete fee description:", e);
        return { success: false, error: 'Server error deleting fee description.' };
    }
}

export async function addAudienceAction(schoolId: string, aud: string) {
    try {
        await addAudienceToFirestore(schoolId, aud);
        revalidatePath('/dashboard/settings');
        return { success: true, audience: aud };
    } catch (e) {
        console.error("Failed to add audience:", e);
        return { success: false, error: 'Server error adding audience.' };
    }
}

export async function deleteAudienceAction(schoolId: string, aud: string) {
    try {
        await deleteAudienceFromFirestore(schoolId, aud);
        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (e) {
        console.error("Failed to delete audience:", e);
        return { success: false, error: 'Server error deleting audience.' };
    }
}

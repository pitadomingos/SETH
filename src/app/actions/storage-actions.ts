
'use server';

import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

export async function uploadProfilePicture(userId: string, dataUrl: string): Promise<string | null> {
    if (!userId || !dataUrl) {
        return null;
    }

    const storageRef = ref(storage, `profile-pictures/${userId}-${Date.now()}`);

    try {
        // 'data_url' is the format for base64 encoded strings with a data URL prefix
        const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
}


'use server';

import { ref, uploadString, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

export async function uploadProfilePicture(userId: string, dataUrl: string): Promise<string | null> {
    if (!userId || !dataUrl) {
        return null;
    }

    const storageRef = ref(storage, `profile-pictures/${userId}-${Date.now()}`);
    
    // Extract content type and base64 data from data URL
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        console.error("Invalid data URL format");
        return null;
    }
    
    const contentType = match[1];
    const base64Data = match[2];

    try {
        const snapshot = await uploadString(storageRef, base64Data, 'base64', {
            contentType: contentType
        });
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
}

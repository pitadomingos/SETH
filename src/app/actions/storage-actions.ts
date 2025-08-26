
'use server';

import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import { updateUserProfileAction } from './user-actions';
import { updateSchoolProfileAction } from './update-school-action';

async function uploadFile(path: string, dataUrl: string): Promise<string | null> {
    if (!path || !dataUrl) {
        return null;
    }

    const storageRef = ref(storage, path);
    
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
        console.error("Invalid data URL format");
        return null;
    }
    
    const contentType = match[1];
    const base64Data = match[2];

    try {
        const snapshot = await uploadString(storageRef, base64Data, 'base64', { contentType });
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File available at', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
}

export async function uploadProfilePicture(userId: string, dataUrl: string): Promise<string | null> {
    const path = `profile-pictures/${userId}-${Date.now()}`;
    const url = await uploadFile(path, dataUrl);
    if (url) {
        await updateUserProfileAction(userId, { profilePictureUrl: url });
    }
    return url;
}

export async function uploadSchoolAsset(schoolId: string, assetType: 'logo' | 'certificate' | 'transcript', dataUrl: string): Promise<string | null> {
    const path = `school-assets/${schoolId}/${assetType}-${Date.now()}`;
    const url = await uploadFile(path, dataUrl);
    if (url) {
        const updateData: any = {};
        if (assetType === 'logo') updateData.logoUrl = url;
        if (assetType === 'certificate') updateData.certificateTemplateUrl = url;
        if (assetType === 'transcript') updateData.transcriptTemplateUrl = url;
        
        await updateSchoolProfileAction(schoolId, updateData);
    }
    return url;
}

export async function uploadKioskMedia(schoolId: string, fileName: string, dataUrl: string): Promise<string | null> {
    const path = `kiosk-media/${schoolId}/${fileName}-${Date.now()}`;
    return await uploadFile(path, dataUrl);
}

export async function uploadApplicationDocument(schoolId: string, applicantName: string, docType: 'id' | 'report' | 'photo', dataUrl: string): Promise<string | null> {
    const safeApplicantName = applicantName.replace(/[^a-zA-Z0-9]/g, '_');
    const path = `applications/${schoolId}/${safeApplicantName}-${docType}-${Date.now()}`;
    return await uploadFile(path, dataUrl);
}

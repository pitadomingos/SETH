// src/lib/firebase/firestore-service.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore"; 
import { SchoolProfile } from '../mock-data';
import { firebaseConfig } from './config';

// A function to get the initialized Firestore instance
export const getDbInstance = () => {
  if (!firebaseConfig.projectId) {
    // This will be caught by the logic in the context provider
    console.error("Firebase project ID is not set. Cannot initialize Firestore.");
    return null;
  }
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  return getFirestore(app);
};

export async function addSchoolToFirestore(profile: SchoolProfile, schoolId: string, fullSchoolData: any) {
    const db = getDbInstance();
    if (!db) {
      throw new Error("Firestore is not initialized.");
    }
    try {
        const schoolRef = doc(db, "schools", schoolId);
        await setDoc(schoolRef, fullSchoolData);
        console.log("Document written with ID: ", schoolId);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

export async function getSchoolsFromFirestore() {
    const db = getDbInstance();
    if (!db) {
        console.warn("Firestore not available, returning empty object.");
        return {};
    }
    const schoolsCol = collection(db, "schools");
    const schoolSnapshot = await getDocs(schoolsCol);
    const schoolList = schoolSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
    }, {});
    return schoolList;
}

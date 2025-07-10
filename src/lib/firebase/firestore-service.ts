// src/lib/firebase/firestore-service.ts
import { db } from './config';
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; 
import { SchoolProfile } from '../mock-data';

export async function addSchoolToFirestore(profile: SchoolProfile, schoolId: string, fullSchoolData: any) {
    try {
        // Here we are denormalizing and storing the entire school object in one document.
        // For a large-scale production app, you would have separate collections for students, teachers, etc.
        // and link them by schoolId. This is a simplified approach for the prototype's backend transition.
        const schoolRef = doc(db, "schools", schoolId);
        await setDoc(schoolRef, fullSchoolData);
        console.log("Document written with ID: ", schoolId);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

export async function getSchoolsFromFirestore() {
    const schoolsCol = collection(db, "schools");
    const schoolSnapshot = await getDocs(schoolsCol);
    const schoolList = schoolSnapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
    }, {});
    return schoolList;
}

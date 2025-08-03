// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5kYAHqBTND_CTWo4nkaZthEoxUUm6PFI",
  authDomain: "edudesk-h9avj.firebaseapp.com",
  projectId: "edudesk-h9avj",
  storageBucket: "edudesk-h9avj.appspot.com",
  messagingSenderId: "220845288840",
  appId: "1:220845288840:web:205fbeb5e437379ea65e3d"
};

// Initialize Firebase
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const db = getFirestore(app, 'edudesk');
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, app };

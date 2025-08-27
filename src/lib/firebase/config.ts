
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Check if running in development environment and connect to emulators
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    console.log("Connected to Firebase Emulators.");
  } catch (e) {
    console.error("Error connecting to Firebase emulators. Please ensure they are running.", e);
  }
}

export { db, auth, storage, app };

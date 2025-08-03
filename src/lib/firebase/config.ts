
// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// =================================================================
// IMPORTANT: FIREBASE CONFIGURATION INSTRUCTIONS
// =================================================================
// 1. Go to your Firebase project console: https://console.firebase.google.com/
// 2. In your project settings, find the "SDK setup and configuration" section.
// 3. Select the "Config" option to get your web app's configuration snippet.
// 4. Uncomment the firebaseConfig object below and replace the placeholder
//    values with your actual project credentials.
// =================================================================

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_AUTH_DOMAIN",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_STORAGE_BUCKET",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app;
// @ts-ignore
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
} else {
    console.warn("Firebase config is not set. Using a mock setup. Please update src/lib/firebase/config.ts");
    // Provide a mock app if config is not set to avoid crashing the app
    app = getApps().length > 0 ? getApp() : initializeApp({projectId: 'mock-project'});
}


const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, app };

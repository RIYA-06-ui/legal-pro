import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvP2zCZ0-33ttDr0r8s7AkTiukWM4Hs3Y",
  authDomain: "legal-pro-b77e5.firebaseapp.com",
  projectId: "legal-pro-b77e5",
  storageBucket: "legal-pro-b77e5.firebasestorage.app",
  messagingSenderId: "409676279884",
  appId: "1:409676279884:web:c5a1159bcd50f54ba744e9",
  measurementId: "G-HD23BYQVEJ"
};
// Initialize Firebase with explicit config to prevent auto-detection
const app = initializeApp(firebaseConfig, "legalpro-app");

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Don't initialize analytics for now to avoid init.json issues
let analytics = null;

export { app, analytics, auth, db };

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "@/../firebase-applet-config.json";

// Prevent duplicate app initialization in dev HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: The app will break without this line
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export default app;

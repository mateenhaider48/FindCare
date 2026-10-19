import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Without an API key getAuth() throws at import time and takes the whole page
// down, so auth is initialised lazily and only where it is actually used.
export const firebaseConfigured = Boolean(firebaseConfig.apiKey);

let authInstance: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!firebaseConfigured) {
    throw Object.assign(
      new Error("Firebase is not configured: set NEXT_PUBLIC_FIREBASE_* in frontend/.env.local"),
      { code: "auth/not-configured" },
    );
  }
  if (!authInstance) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }
  return authInstance;
}

export const googleProvider = new GoogleAuthProvider();

import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

export const adminAuth = getAuth(adminApp);
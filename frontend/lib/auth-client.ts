"use client";

import { signOut as firebaseSignOut, type User } from "firebase/auth";
import { API_URL } from "@/lib/auth";
import { firebaseConfigured, getFirebaseAuth } from "@/lib/firebase";

/** Error with a Firebase-style `code`, so forms can map it to a message. */
function authError(code: string, message: string) {
  return Object.assign(new Error(message), { code });
}

/**
 * Exchanges a fresh Firebase sign-in for the backend's httpOnly session
 * cookie. If the backend refuses, the Firebase user is signed out again so
 * the two never disagree about who is logged in.
 */
export async function createSession(user: User) {
  const idToken = await user.getIdToken(true);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/session`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch {
    await firebaseSignOut(getFirebaseAuth()).catch(() => {});
    throw authError("session/backend-unreachable", "Server se connect nahi ho saka. Backend chal raha hai?");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    await firebaseSignOut(getFirebaseAuth()).catch(() => {});
    throw authError("session/rejected", data.detail || "Could not start your session. Please try again.");
  }
  return data.user as { id: number; name: string | null; email: string };
}

/** Ends the session on the backend and in Firebase. Never throws. */
export async function signOut() {
  await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  if (firebaseConfigured) await firebaseSignOut(getFirebaseAuth()).catch(() => {});
}

/** Maps Firebase / session errors to a message for the auth forms. */
export function authErrorMessage(error: unknown, fallback: string) {
  const code =
    typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/weak-password":
      return "Please choose a stronger password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase.";
    case "auth/not-configured":
      return "Firebase is not configured. Check frontend/.env.local.";
    case "session/backend-unreachable":
    case "session/rejected":
      return (error as Error).message;
    default:
      return fallback;
  }
}

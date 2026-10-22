import { cookies } from "next/headers";
import { API_URL, SESSION_COOKIE } from "@/lib/auth";

/**
 * Server-side GET to the backend that forwards the session cookie, so server
 * components can read the signed-in user's data. Returns null on any failure
 * (the caller decides how to render an empty/error state).
 */
export async function apiGet<T>(path: string): Promise<T | null> {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Cookie: `${SESSION_COOKIE}=${cookie}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export type Conversation = {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: number;
  conversation_id: number;
  role: "user" | "agent";
  content: string;
  created_at: string;
};

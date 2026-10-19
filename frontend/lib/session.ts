import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SIGN_OUT_ROUTE } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase-admin";

export type SessionUser = { uid: string; email?: string; name: string };

/** Verified user from the session cookie, or null if missing/expired/revoked. */
// Cached per request: the layout and the page both ask for the user.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const claims = await adminAuth.verifySessionCookie(cookie, true);
    return {
      uid: claims.uid,
      email: claims.email,
      name: (claims.name as string | undefined) || claims.email?.split("@")[0] || "Patient",
    };
  } catch {
    return null;
  }
});

/**
 * For protected pages. A missing or invalid cookie goes through the sign-out
 * route, which deletes the cookie first (server components cannot), so the
 * proxy does not bounce /login back here in a loop.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(SIGN_OUT_ROUTE);
  return user;
}

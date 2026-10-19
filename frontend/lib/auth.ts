// httpOnly session cookie set by the backend (/api/auth/session) after a
// Firebase sign-in. Shared by proxy.ts, server pages and the client helpers.
export const SESSION_COOKIE = "fc_session";

/** Clears a stale/invalid session cookie, then sends the user to /login. */
export const SIGN_OUT_ROUTE = "/auth/signout";

// Must be `localhost` (not 127.0.0.1): the session cookie is set on the
// backend's host and only reaches the frontend when both hosts match.
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");

  return next &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    next !== "/login" &&
    !next.startsWith("/login?")
      ? next
      : "/dashboard";
}

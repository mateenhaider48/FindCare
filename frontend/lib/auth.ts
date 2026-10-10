// Dummy auth: a plain cookie marks the user as signed in.
// Replace with real sessions when the backend auth is ready.
export const SESSION_COOKIE = "fc_session";

export function signIn(name = "Patient") {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(name)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function signOut() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

/** Where to go after signing in: the page the user was sent away from, or the dashboard. */
export function nextPath() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

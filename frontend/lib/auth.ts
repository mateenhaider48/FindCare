// Dummy auth: a plain cookie marks the user as signed in.
// Replace with real sessions when the backend auth is ready.
export const SESSION_COOKIE = "fc_session";


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
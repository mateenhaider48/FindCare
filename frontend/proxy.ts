import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

// Optimistic check for the dummy auth: app pages need the session cookie,
// and signed-in users skip the login/signup pages.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const signedIn = request.cookies.has(SESSION_COOKIE);
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!signedIn && !isAuthPage) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  if (signedIn && isAuthPage) return NextResponse.redirect(new URL("/dashboard", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/consultation/:path*", "/session/:path*", "/doctors/:path*", "/history/:path*", "/settings/:path*", "/login", "/signup"],
};

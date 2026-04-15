import { NextRequest, NextResponse } from "next/server";

/**
 * Protect /admin/* and /dashboard/* routes.
 * Better Auth stores session in the "better-auth.session_token" cookie.
 * We do a lightweight check here — the actual session validation happens
 * server-side in the page/layout server components.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for session cookie presence (lightweight — full validation in page)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ??
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};

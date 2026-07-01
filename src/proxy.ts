import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, VALID_SESSION_TOKEN } from "@/lib/auth-constants";

// Next.js 16 "proxy" (formerly middleware). Protects /admin — redirect
// unauthenticated users to /login.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token !== VALID_SESSION_TOKEN) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

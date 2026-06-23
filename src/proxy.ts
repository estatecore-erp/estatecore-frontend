import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const { pathname } = req.nextUrl;

  // allow public routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // already logged in → redirect away from auth pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    if (role === "client") {
      return NextResponse.redirect(new URL("/portal", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // not logged in → redirect to login
  if (!token && pathname !== "/login" && pathname !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // client tries to access dashboard
  if (token && role === "client" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

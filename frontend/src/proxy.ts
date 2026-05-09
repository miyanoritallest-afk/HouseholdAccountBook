import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/home", "/transactions", "/reports", "/categories"];
const authPaths = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("jwt_token")?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/transactions/:path*", "/reports/:path*", "/categories/:path*", "/login", "/signup"],
};

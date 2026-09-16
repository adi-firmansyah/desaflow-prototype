import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!sessionCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/buat-surat/:path*",
    "/data-warga/:path*",
    "/riwayat-surat/:path*",
    "/login",
  ],
};

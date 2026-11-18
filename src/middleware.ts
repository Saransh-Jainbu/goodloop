// OWNER: Saransh. Route protection by role.
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  const needs = pathname.startsWith("/admin")
    ? "ADMIN"
    : pathname.startsWith("/organiser")
      ? "ORGANISER"
      : pathname.startsWith("/me")
        ? "ANY"
        : null;

  if (!needs) return NextResponse.next();

  if (!user) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  if (needs !== "ANY" && user.role !== needs) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/organiser/:path*", "/me/:path*"],
};

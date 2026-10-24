// src/middleware.ts

import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_PANEL_ROLES, type Role } from "@/config/roles.config";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    process.env.AUTH_SECRET ||
    "dev-only-fallback-change-me",
);

function isAllowedRole(role: string): role is Role {
  return (ADMIN_PANEL_ROLES as readonly string[]).includes(role);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ۱. خواندن کوکی نشست ادمین
  const sessionToken = request.cookies.get("admin_session")?.value;

  let isLoggedIn = false;
  let userRole = "";

  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, ADMIN_JWT_SECRET);
      if (payload.type === "session" && typeof payload.role === "string") {
        isLoggedIn = true;
        userRole = payload.role;
      }
    } catch {
      isLoggedIn = false;
      userRole = "";
    }
  }

  // ۲. مدیریت صفحه ورود (چون مسیرت /login است، نه /admin/login)
  if (pathname === "/login") {
    if (isLoggedIn && userRole && isAllowedRole(userRole)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // ۳. محافظت از مسیرهای پنل ادمین (/admin و زیرشاخه‌های آن)
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!userRole || !isAllowedRole(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};

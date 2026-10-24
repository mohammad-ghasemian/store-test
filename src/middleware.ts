import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_PANEL_ROLES, type Role } from "@/config/roles.config";

// چک میکنه که نقش کاربر جزو لیست مجاز ادمین هست یا نه (برای جلوگیری از خطای any)
function isAllowedRole(role: string): role is Role {
  return (ADMIN_PANEL_ROLES as readonly string[]).includes(role);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // فعلا به صورت تستی - بعدا با سشن واقعی پروژه پر میشه
  const isLoggedIn = false;
  const userRole = "";

  // اگر ادمین قبلا لاگین کرده باشه، دیگه صفحه لاگین رو نبینه و بره تو پنل
  if (pathname === "/admin/login") {
    if (isLoggedIn && userRole && isAllowedRole(userRole)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // محافظت از مسیرهای پنل ادمین
  if (pathname.startsWith("/admin")) {
    // اگر لاگین نکرده بود، بفرستش صفحه ورود
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // اگر نقش کاربری مجوز نداشت، برگردون صفحه اصلی سایت
    if (!userRole || !isAllowedRole(userRole)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

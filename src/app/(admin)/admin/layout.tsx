import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  Users,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { verifyAdminToken } from "@/features/admin/lib/admin-tokens";

const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد اصلی", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Boxes },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/analytics", label: "گزارش‌ها و آمار", icon: BarChart3 },
  { href: "/admin/audit-logs", label: "گزارشات امنیتی", icon: ShieldAlert },
] as const;

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("__admin_session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const payload = await verifyAdminToken(sessionToken);
  if (!payload || payload.type !== "session") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      {/* سایدبار ثابت مدیریت */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 flex-col border-l border-neutral-200 bg-white md:flex dark:border-neutral-800 dark:bg-neutral-900">
        {/* برندینگ و هویت پنل */}
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-6 dark:border-neutral-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 font-bold text-white dark:bg-white dark:text-neutral-950">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">
              پنل مدیریت متمرکز
            </span>
            <span className="font-mono text-[10px] text-neutral-400">
              {String(payload.role ?? "")}
            </span>
          </div>
        </div>

        {/* لینک‌های ناوبری اصلی */}
        <nav className="flex-1 space-y-1.5 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* وضعیت حساب کاربری لاگین‌شده و دکمه خروج */}
        <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs font-medium text-neutral-700 dark:text-neutral-300">
              @{String(payload.username ?? "")}
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              فعال
            </span>
          </div>

          <form action="/api/admin/auth/logout" method="POST">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/50 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-950/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              <LogOut className="h-3.5 w-3.5" />
              خروج از سیستم
            </button>
          </form>
        </div>
      </aside>

      {/* بخش محتوا و بدنه صفحات */}
      <div className="flex flex-1 flex-col md:pr-64">
        {/* هدر بالایی برای ریسپانسیو و عنوان */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/80">
          <h2 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            داشبورد مدیریت سیستم
          </h2>
          <div className="text-xs text-neutral-500">
            سطح دسترسی:{" "}
            <span className="font-mono font-semibold">
              {String(payload.role ?? "")}
            </span>
          </div>
        </header>

        {/* بدنه رندر صفحات فرعی */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

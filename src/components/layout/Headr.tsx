import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MAIN_NAV_ITEMS } from "@/config/nav.config";
import {
  UserAuthCheck,
  UserAuthCheckSkeleton,
} from "@/features/user/components/server/user-auth-check";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl transition-colors dark:border-zinc-800/60 dark:bg-zinc-950/75">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-8">
          <MobileNav />

          <Link
            href="/"
            className="group flex items-center gap-2 font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-black text-white dark:bg-zinc-100 dark:text-zinc-900">
              X
            </span>
            <span className="text-sm font-semibold tracking-wide">STORE</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* اکشن‌های سبد خرید و اعتبارسنجی کاربر */}
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              ۰
            </span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* استریمینگ بررسی کاربر با نام شفاف */}
          <Suspense fallback={<UserAuthCheckSkeleton />}>
            <UserAuthCheck />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

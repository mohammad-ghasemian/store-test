import { ArrowLeft, ShoppingBag } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { MAIN_NAV_ITEMS } from "@/config/nav.config";
import { UserMenu } from "@/features/user/components/clients/user-menu";
import { auth } from "@/lib/auth";

export async function Header() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl transition-colors dark:border-zinc-800/60 dark:bg-zinc-950/75">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* برند، منوی موبایل و لینک‌های دسکتاپ */}
        <div className="flex items-center gap-2 sm:gap-8">
          {/* دکمه منوی موبایل (فقط در صفحات کوچک) */}
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

          {/* لینک‌های دسکتاپ */}
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

        {/* اکشن‌های سمت چپ (سبد خرید و اکانت) */}
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

          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button
              asChild
              size="sm"
              variant="default"
              className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium shadow-none"
            >
              <Link href="/sign-in">
                <span>ورود</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/features/auth/components/clients/auth-form";
import { OAuthButtons } from "@/features/auth/components/clients/oauth-buttons";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام | فروشگاه",
  description: "ورود به حساب کاربری با شماره موبایل یا حساب‌های اجتماعی",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* هدر صفحه */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            خوش آمدید
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            برای ورود یا ثبت‌نام، شماره موبایل یا اکانت اجتماعی خود را انتخاب
            کنید.
          </p>
        </div>

        {/* دکمه‌های ورود اجتماعی */}
        <OAuthButtons />

        <div className="relative flex items-center py-2">
          <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
          <span className="mx-4 shrink text-xs text-zinc-400 uppercase">
            یا با شماره موبایل
          </span>
          <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
        </div>

        {/* فرم یکپارچه ورود با شماره و OTP */}
        <AuthForm />

        {/* فوتر کوچک */}
        <p className="px-8 text-center text-xs text-zinc-400">
          با ورود به سایت، تمامی{" "}
          <Link
            href="/terms"
            className="underline hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            قوانین و مقررات
          </Link>{" "}
          را می‌پذیرید.
        </p>
      </div>
    </div>
  );
}

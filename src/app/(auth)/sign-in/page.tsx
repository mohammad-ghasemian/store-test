import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AuthForm } from "@/features/auth/components/clients/auth-form";
import { OAuthButtons } from "@/features/auth/components/clients/oauth-buttons";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام | فروشگاه",
  description: "ورود به حساب کاربری با شماره موبایل یا حساب‌های اجتماعی",
};

export default function SignInPage() {
  return (
    <main className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-zinc-950 px-4 py-8 sm:px-6">
      <Image
        src="/images/login.webp"
        alt="صفحه ورود"
        fill
        priority
        sizes="100vw"
        quality={75}
        className="-z-20 object-cover object-center"
      />

      <div className="absolute inset-0 -z-10 bg-black/35" />

      <div className="relative w-full max-w-90 space-y-5 overflow-hidden rounded-3xl border border-white/25 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl backdrop-saturate-150 sm:p-7">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent" />

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            خوش آمدید
          </h1>
          <p className="text-sm text-white/75">برای ادامه وارد حساب خود شوید</p>
        </div>

        <OAuthButtons />

        <div className="relative flex items-center py-1">
          <div className="grow border-t border-white/25" />
          <span className="mx-4 shrink text-xs text-white/75">
            یا با شماره موبایل
          </span>
          <div className="grow border-t border-white/25" />
        </div>

        <AuthForm />

        <p className="text-center text-xs leading-6 text-white/75">
          با ورود به سایت، تمامی{" "}
          <Link
            href="/terms"
            prefetch={false}
            className="text-white underline underline-offset-4 hover:text-white/80"
          >
            قوانین و مقررات
          </Link>{" "}
          را می‌پذیرید.
        </p>
      </div>
    </main>
  );
}

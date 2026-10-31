import { Activity, ShieldCheck, UserCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "میز کار مدیریت",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          خوش آمدید، همکار گرامی
        </h1>
        <p className="mt-1 text-xs text-neutral-500">
          وضعیت سرویس‌ها پایدار است و تمامی لایه‌های امنیتی MFA فعال می‌باشند.
        </p>
      </div>

      {/* کارت‌های خلاصه وضعیت */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              نشست جاری ادمین
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-3 font-mono text-2xl font-bold">2FA VERIFIED</div>
          <p className="mt-1 text-[11px] text-neutral-400">
            توکن امنیتی با استاندارد EdDSA/HMAC فعال است
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              وضعیت پایگاه‌داده
            </span>
            <Activity className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            متصل (Supabase)
          </div>
          <p className="mt-1 text-[11px] text-neutral-400">
            اتصال بدون تاخیر از طریق Prisma Pooler برقرار است
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              سطح دسترسی
            </span>
            <UserCheck className="h-4 w-4 text-neutral-500" />
          </div>
          <div className="mt-3 text-2xl font-bold">مدیریت کل</div>
          <p className="mt-1 text-[11px] text-neutral-400">
            دسترسی نامحدود به ماژول‌های پنل
          </p>
        </div>
      </div>
    </div>
  );
}

// src/app/admin/login/page.tsx
/* صفحه اختصاصی ورود امن کادر مدیریت */
import type { Metadata } from "next";
import { AdminLoginWizard } from "@/features/admin/components/clients/admin-login-wizard";

export const metadata: Metadata = {
  title: "ورود به درگاه مدیریت | سامانه اختصاصی",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-8 dark:bg-neutral-950">
      <AdminLoginWizard />
    </main>
  );
}

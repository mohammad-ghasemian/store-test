import type { Metadata } from "next";
import Image from "next/image";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-8">
      <Image
        src="/images/adminlog.webp"
        alt="Office Background"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="pointer-events-none object-cover object-center opacity-30 select-none"
      />

      <div className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <AdminLoginWizard />
      </div>
    </main>
  );
}

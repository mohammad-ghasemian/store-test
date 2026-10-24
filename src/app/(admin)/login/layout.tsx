import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | درگاه امن مدیریت",
    default: "ورود به درگاه مدیریت",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-neutral-100 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
      {children}
    </div>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/features/admin/components/server/headers/admin-header";
import { verifyAdminToken } from "@/features/admin/lib/admin-tokens";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const payload = await verifyAdminToken(sessionToken);
  if (!payload || payload.type !== "session") {
    redirect("/login");
  }

  return (
    <div lang="fa" dir="rtl" className="min-h-screen">
      <AdminHeader />

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

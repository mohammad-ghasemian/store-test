import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

  return <div>{children}</div>;
}

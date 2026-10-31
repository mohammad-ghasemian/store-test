import { ShieldCheck, Terminal } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { verifyAdminToken } from "@/features/admin/lib/admin-tokens";
import { AdminUserMenu } from "../../clients/header/admin-user-menu";
import { getRoleTheme } from "./header-role-config";

export async function AdminHeader() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  const payload = sessionToken ? await verifyAdminToken(sessionToken) : null;
  const role = payload?.type === "session" ? payload.role : undefined;
  const username = payload?.type === "session" ? payload.username : undefined;
  const theme = getRoleTheme(role);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 ${theme.headerBgClass} ${theme.glowBorderClass}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-semibold text-zinc-100 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-200 shadow-inner">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold tracking-tight">
                پنل مدیریت یکپارچه
              </span>
              <span className="text-[10px] text-zinc-500">
                Core Engine v2.4
              </span>
            </div>
          </Link>
          <div
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium sm:flex ${theme.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${theme.accentDot}`} />
            <span>{theme.title}</span>
          </div>
        </div>

        {/* وضعیت امنیتی 2FA و منوی کاربر */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 md:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-[11px]">2FA SECURED</span>
          </div>

          <div className="h-5 w-px bg-zinc-800/80" />
          <AdminUserMenu username={username} roleName={theme.title} />
        </div>
      </div>
    </header>
  );
}

"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { adminLogoutAction } from "../../../actions/logout.action";

export interface AdminUserMenuProps {
  username?: string;
  roleName: string;
}

export function AdminUserMenu({ username, roleName }: AdminUserMenuProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await adminLogoutAction();
    });
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden flex-col text-left text-xs sm:flex">
        <span className="font-mono font-medium text-zinc-200">
          {username ? `@${username}` : "مدیر سیستم"}
        </span>
        <span className="text-[10px] text-zinc-500">{roleName}</span>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        title="خروج از حساب مدیریت"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only">خروج</span>
      </button>
    </div>
  );
}

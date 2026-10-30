"use client";

import type { AdminRole } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

import { devQuickLoginAction } from "../../../actions/dev-quick-login.action";
import type { MfaState } from "./types";

const DEV_ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "CONTENT_MANAGER",
  "SUPPORT",
];

type DevQuickLoginProps = {
  onSuccess: (mfa: MfaState) => void;
};

export function DevQuickLogin({ onSuccess }: DevQuickLoginProps) {
  const [role, setRole] = useState<AdminRole>("SUPPORT");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await devQuickLoginAction(role);

      if (!result.success) {
        toast.error(result.error ?? "ورود سریع ناموفق بود.");
        return;
      }

      onSuccess(result);
    } catch {
      toast.error("خطای غیرمنتظره در ورود سریع لوکال.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/5 p-3 text-right">
      <label
        htmlFor="dev-role-select"
        className="block text-xs font-medium text-emerald-400"
      >
        تست سریع بر اساس نقش (مخصوص لوکال)
      </label>

      <div className="flex gap-2">
        <select
          id="dev-role-select"
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
          disabled={isLoading}
          className="min-w-0 flex-1 rounded-lg border border-emerald-500/30 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 transition-colors outline-none focus-visible:border-emerald-400"
        >
          {DEV_ROLES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "در حال ورود..." : "ورود سریع"}
        </button>
      </div>
    </div>
  );
}

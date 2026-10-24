// src/features/admin/actions/dev-quick-login.action.ts
"use server";

import type { AdminRole } from "@prisma/client";
import { prisma } from "@/config/prisma";
import { createPreAuthToken } from "../lib/admin-tokens";

const ROLE_USERNAMES: Record<AdminRole, string> = {
  SUPER_ADMIN: "x-admin",
  ADMIN: "tech-admin",
  CONTENT_MANAGER: "content-lead",
  SUPPORT: "support-agent",
};

type DevQuickLoginResult =
  | {
      success: true;
      preAuthToken: string;
      mode: "setup" | "verify";
      secret: string | null;
    }
  | {
      success: false;
      error: string;
    };

export async function devQuickLoginAction(
  role: AdminRole,
): Promise<DevQuickLoginResult> {
  if (process.env.NODE_ENV !== "development") {
    return { success: false, error: "این قابلیت غیرمجاز است." };
  }

  const username = ROLE_USERNAMES[role];
  const admin = await prisma.adminUser.findUnique({ where: { username } });

  if (!admin) {
    return {
      success: false,
      error: "حساب کاربری مورد نظر در دیتابیس یافت نشد.",
    };
  }

  const preAuthToken = await createPreAuthToken(admin.id);

  return {
    success: true,
    preAuthToken,
    mode: admin.mfaConfirmed ? "verify" : "setup",
    secret: admin.mfaSecret ?? null,
  };
}

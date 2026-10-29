"use server";

import { cookies } from "next/headers";
import * as otplib from "otplib";
import * as v from "valibot";

import { prisma } from "@/config/prisma";
import {
  createAdminToken,
  verifyPreAuthToken,
} from "@/features/admin/lib/admin-tokens";
import { MfaCodeSchema } from "../schemas/admin-auth.schema";

type Result = { success: true } | { success: false; error: string };

// تحمل ±۳۰ ثانیه برای اختلاف ساعت
otplib.authenticator.options = { window: 1 };

export async function verifyMfaAction(input: unknown): Promise<Result> {
  const parsed = v.safeParse(MfaCodeSchema, input);
  if (!parsed.success) {
    return { success: false, error: "کد وارد شده معتبر نیست." };
  }
  const { preAuthToken, code } = parsed.output;

  const adminId = await verifyPreAuthToken(preAuthToken);
  if (!adminId) {
    return { success: false, error: "نشست منقضی شده. دوباره وارد شوید." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!admin || !admin.mfaSecret) {
    return { success: false, error: "تنظیمات دومرحله‌ای ناقص است." };
  }

  const isCodeValid = otplib.authenticator.verify({
    token: code,
    secret: admin.mfaSecret,
  });
  if (!isCodeValid) {
    return { success: false, error: "کد ۶ رقمی اشتباه است." };
  }

  // اولین تایید موفق: فعال‌سازی MFA
  if (!admin.mfaConfirmed) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { mfaConfirmed: true },
    });
  }

  const sessionToken = await createAdminToken({
    adminId: admin.id,
    username: admin.username,
    role: admin.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return { success: true };
}

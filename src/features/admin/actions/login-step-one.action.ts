// src/features/admin/actions/login-step-one.action.ts
"use server";

import argon2 from "argon2";
import * as otplib from "otplib";
import * as v from "valibot";

import { prisma } from "@/config/prisma";
import { createPreAuthToken } from "../lib/admin-tokens";
import { AdminCredentialsSchema } from "../schemas/admin-auth.schema";

// حداقل تلاش‌های ناموفق قبل از قفل شدن حساب
const MAX_ATTEMPTS = 5;
// مدت قفل شدن حساب: ۱۵ دقیقه
const LOCK_MINUTES = 15;

// نوع خروجی: یا موفق (با دو حالت setup/verify) یا خطا
type Result =
  | {
      success: true;
      preAuthToken: string;
      mode: "setup" | "verify";
      otpauthUrl?: string; // فقط در حالت setup پر می‌شود
      secret?: string; // فقط در حالت setup پر می‌شود
    }
  | { success: false; error: string };

export async function loginStepOneAction(input: unknown): Promise<Result> {
  // ۱. اعتبارسنجی ورودی با valibot
  const parsed = v.safeParse(AdminCredentialsSchema, input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }
  const { username, password } = parsed.output;

  // ۲. پیدا کردن ادمین در دیتابیس
  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    console.log("🔴 DEBUG: Admin user not found in DB for:", username);
    // پیام مبهم عمداً: هکر نباید بفهمد کدام فیلد غلط بود
    return { success: false, error: "نام کاربری یا رمز عبور اشتباه است." };
  }

  // ۳. چک قفل موقت حساب (بعد از تلاش‌های ناموفق زیاد)
  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return {
      success: false,
      error: "حساب موقتاً قفل شده است. کمی بعد تلاش کنید.",
    };
  }

  // ۴. تطبیق هش پسورد با argon2
  const isPasswordValid = await argon2.verify(admin.passwordHash, password);
  console.log("🟡 DEBUG: Password valid check:", isPasswordValid);
  if (!isPasswordValid) {
    console.log("🔴 DEBUG: Argon2 password hash mismatch!");
    // یک تلاش ناموفق به شمارنده اضافه می‌شود
    const failedAttempts = admin.failedAttempts + 1;
    // اگر از حد مجاز گذشت، حساب موقتاً قفل می‌شود
    const shouldLock = failedAttempts >= MAX_ATTEMPTS;

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        failedAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCK_MINUTES * 60_000)
          : null,
      },
    });

    return { success: false, error: "نام کاربری یا رمز عبور اشتباه است." };
  }

  // ۵. پسورد درست بود → ریست شمارنده تلاش‌های ناموفق
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  // ۶. صدور توکن موقت برای ورود به مرحله دوم
  const preAuthToken = await createPreAuthToken(admin.id);

  // ۷. حالت نرمال: ادمین قبلاً Setup کرده → فقط فیلد کد، بدون هیچ secret‌ای
  if (admin.mfaConfirmed) {
    return { success: true, preAuthToken, mode: "verify" };
  }

  // ۸. حالت Setup (بار اول): تولید secret جدید و ذخیره در دیتابیس
  const mfaSecret = otplib.authenticator.generateSecret();
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { mfaSecret },
  });

  // ۹. ساخت لینک استاندارد otpauth:// برای نمایش به صورت QR
  const otpauthUrl = otplib.authenticator.keyuri(
    admin.username, // label: اسمی که کنار حساب در اپ نمایش داده می‌شود
    "MyShop", // issuer: اسم سرویس
    mfaSecret,
  );

  return {
    success: true,
    preAuthToken,
    mode: "setup",
    otpauthUrl,
    secret: mfaSecret,
  };
}

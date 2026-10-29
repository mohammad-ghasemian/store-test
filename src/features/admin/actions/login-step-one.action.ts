"use server";

import argon2 from "argon2";
import * as v from "valibot";

import { prisma } from "@/config/prisma";
import { type MfaPayload, resolveMfaPayload } from "../lib/admin-mfa";
import { createPreAuthToken } from "../lib/admin-tokens";
import { AdminCredentialsSchema } from "../schemas/admin-auth.schema";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

type Result =
  | ({ success: true; preAuthToken: string } & MfaPayload)
  | { success: false; error: string };

export async function loginStepOneAction(input: unknown): Promise<Result> {
  const parsed = v.safeParse(AdminCredentialsSchema, input);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }
  const { username, password } = parsed.output;

  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) {
    return { success: false, error: "نام کاربری یا رمز عبور اشتباه است." };
  }

  if (admin.lockedUntil && admin.lockedUntil > new Date()) {
    return {
      success: false,
      error: "حساب موقتاً قفل شده است. کمی بعد تلاش کنید.",
    };
  }

  const isPasswordValid = await argon2.verify(admin.passwordHash, password);
  if (!isPasswordValid) {
    const failedAttempts = admin.failedAttempts + 1;
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

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { failedAttempts: 0, lockedUntil: null },
  });

  const preAuthToken = await createPreAuthToken(admin.id);
  const mfa = await resolveMfaPayload(admin);

  return { success: true, preAuthToken, ...mfa };
}

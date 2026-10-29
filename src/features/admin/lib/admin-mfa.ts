import "server-only";

import * as otplib from "otplib";

import { prisma } from "@/config/prisma";

const ISSUER = "MyShop";

export type MfaPayload =
  | { mode: "verify" }
  | { mode: "setup"; secret: string; otpauthUrl: string };

// تعیین حالت setup/verify و ساخت سکرت در صورت نبود
export async function resolveMfaPayload(admin: {
  id: string;
  username: string;
  mfaConfirmed: boolean;
  mfaSecret: string | null;
}): Promise<MfaPayload> {
  if (admin.mfaConfirmed && admin.mfaSecret) {
    return { mode: "verify" };
  }

  // اگر سکرت قبلی تایید نشده بود، همان را نگه می‌داریم
  let secret = admin.mfaSecret;
  if (!secret) {
    secret = otplib.authenticator.generateSecret();
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { mfaSecret: secret, mfaConfirmed: false },
    });
  }

  return {
    mode: "setup",
    secret,
    otpauthUrl: otplib.authenticator.keyuri(admin.username, ISSUER, secret),
  };
}

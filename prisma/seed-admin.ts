/* ساخت سوپرادمین اولیه + QR برای ورود دو مرحله‌ای */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import * as otplib from "otplib";
import qrcode from "qrcode";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "*******";
  const role = "SUPER_ADMIN" as const;
  const fullName = "مدیر ارشد سامانه";
  const issuer = process.env.SEED_ISSUER ?? "MyShop";

  // ۱. بررسی ادمین تکراری
  const exists = await prisma.adminUser.findUnique({ where: { username } });
  if (exists) {
    console.log(`⚠️ ادمین با نام کاربری ${username} قبلاً ثبت شده است.`);
    await prisma.$disconnect();
    return;
  }

  // ۲. ساخت کلید اختصاصی TOTP
  const mfaSecret = otplib.authenticator.generateSecret(32);
  const otpauth = otplib.authenticator.keyuri(username, issuer, mfaSecret);

  // ۳. نمایش بارکد در کنسول
  console.log(
    "\n📲 این بارکد را با Google Authenticator یا اپ مشابه اسکن کنید:\n",
  );
  const qrString = await qrcode.toString(otpauth, {
    type: "terminal",
    small: true,
  });
  console.log(qrString);

  console.log("🔑 در صورت عدم اسکن، این کلید را دستی وارد کنید:");
  console.log(mfaSecret);

  // ۴. هش کردن پسورد با الگوریتم قدرتمند Argon2
  const passwordHash = await argon2.hash(password);

  // ۵. ایجاد سطر ادمین در دیتابیس
  const admin = await prisma.adminUser.create({
    data: {
      username,
      fullName, // فیلد اجباری اضافه شد
      role,
      passwordHash,
      mfaSecret,
      status: "ACTIVE",
      failedAttempts: 0,
      lockedUntil: null,
    },
  });

  console.log("\n✅ حساب مدیر ارشد با موفقیت ساخته شد:");
  console.log({ id: admin.id, username: admin.username, role: admin.role });
}

main()
  .catch((e) => {
    console.error("❌ خطا در اجرای سید:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

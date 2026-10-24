import { AdminRole, AdminStatus, PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const commonPassword = "12345Mm!";
  const passwordHash = await argon2.hash(commonPassword);

  const demoAdmins = [
    {
      username: "x-admin",
      fullName: "مدیر ارشد سیستم",
      role: AdminRole.SUPER_ADMIN,
    },
    {
      username: "tech-admin",
      fullName: "مدیر فنی",
      role: AdminRole.ADMIN,
    },
    {
      username: "content-lead",
      fullName: "مدیر محتوا",
      role: AdminRole.CONTENT_MANAGER,
    },
    {
      username: "support-agent",
      fullName: "کارشناس پشتیبانی",
      role: AdminRole.SUPPORT,
    },
  ];

  for (const admin of demoAdmins) {
    await prisma.adminUser.upsert({
      where: { username: admin.username },
      update: {
        passwordHash,
        fullName: admin.fullName,
        role: admin.role,
        mfaConfirmed: false,
        mfaSecret: null,
        failedAttempts: 0,
        lockedUntil: null,
        status: AdminStatus.ACTIVE,
      },
      create: {
        username: admin.username,
        fullName: admin.fullName,
        passwordHash,
        role: admin.role,
        status: AdminStatus.ACTIVE,
        isMfaEnabled: true,
        mfaConfirmed: false,
        mfaSecret: null,
      },
    });
  }

  console.log("✅ تمام اکانت‌های تستی با موفقیت در دیتابیس ثبت شدند.");
}

main()
  .catch((e) => {
    console.error("❌ خطای اجرای Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { AdminRole, AdminStatus, PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

interface SeedAdminItem {
  username: string;
  password: string;
  fullName: string;
  role: AdminRole;
}

interface HashedSeedAdmin {
  username: string;
  passwordHash: string;
  fullName: string;
  role: AdminRole;
}

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`❌ متغیر محیطی [${name}] در .env پیدا نشد یا خالی است!`);
  }

  return value.trim();
}

function readAdmin(
  usernameEnv: string,
  passwordEnv: string,
  fullName: string,
  role: AdminRole,
): SeedAdminItem {
  const username = requiredEnv(usernameEnv);
  const password = requiredEnv(passwordEnv);
  if (password.length < 8) {
    throw new Error(`❌ رمز عبور [${passwordEnv}] باید حداقل ۸ کاراکتر باشد.`);
  }

  return { username, password, fullName, role };
}

const rotateExistingPasswords = process.argv.includes("--rotate-existing");

async function main() {
  console.log("🚀 شروع فرایند خواندن و هش کردن اطلاعات ادمین‌ها...");

  const seedAdmins: SeedAdminItem[] = [
    readAdmin(
      "SEED_ADMIN_SUPER_USERNAME",
      "SEED_ADMIN_SUPER_PASSWORD",
      "مدیر ارشد سیستم",
      AdminRole.SUPER_ADMIN,
    ),
    readAdmin(
      "SEED_ADMIN_ADMIN_USERNAME",
      "SEED_ADMIN_ADMIN_PASSWORD",
      "مدیر فنی و امنیت",
      AdminRole.ADMIN,
    ),
    readAdmin(
      "SEED_ADMIN_CONTENT_USERNAME",
      "SEED_ADMIN_CONTENT_PASSWORD",
      "سرپرست تولید محتوا",
      AdminRole.CONTENT_MANAGER,
    ),
    readAdmin(
      "SEED_ADMIN_SUPPORT_USERNAME",
      "SEED_ADMIN_SUPPORT_PASSWORD",
      "کارشناس پشتیبانی و فروش",
      AdminRole.SUPPORT,
    ),
  ];

  const usernames = seedAdmins.map((a) => a.username.toLowerCase());
  if (new Set(usernames).size !== seedAdmins.length) {
    throw new Error("❌ نام‌های کاربری تعریف‌شده در .env یکتا نیستند!");
  }

  const hashedAdmins: HashedSeedAdmin[] = [];
  for (const admin of seedAdmins) {
    const passwordHash = await argon2.hash(admin.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    hashedAdmins.push({
      username: admin.username,
      passwordHash,
      fullName: admin.fullName,
      role: admin.role,
    });
  }

  console.log("📡 اتصال به دیتابیس و اعمال تراکنش...");

  await prisma.$transaction(async (tx) => {
    for (const admin of hashedAdmins) {
      const existingAdmin = await tx.adminUser.findUnique({
        where: { username: admin.username },
      });

      if (existingAdmin) {
        if (!rotateExistingPasswords) {
          console.log(
            `  ℹ️ کاربر [${admin.username}] از قبل وجود دارد (تغییری اعمال نشد).`,
          );
          continue;
        }
        await tx.adminUser.update({
          where: { username: admin.username },
          data: { passwordHash: admin.passwordHash },
        });

        console.log(`  🔐 رمز عبور کاربر [${admin.username}] به‌روزرسانی شد.`);
        continue;
      }

      // ساخت حساب جدید
      const savedAdmin = await tx.adminUser.create({
        data: {
          username: admin.username,
          fullName: admin.fullName,
          passwordHash: admin.passwordHash,
          role: admin.role,
          status: AdminStatus.ACTIVE,
          isMfaEnabled: true,
          mfaConfirmed: false,
          mfaSecret: null,
          failedAttempts: 0,
          lockedUntil: null,
        },
      });

      await tx.adminAuditLog.create({
        data: {
          adminId: savedAdmin.id,
          action: "SYSTEM_SEED_INITIALIZED",
          resource: `AdminUser:${savedAdmin.id}`,
          ipAddress: "127.0.0.1",
          userAgent: "prisma-seed-script",
        },
      });

      console.log(
        `  ✔️ حساب جدید [${admin.username}] با نقش [${admin.role}] ساخته شد.`,
      );
    }
  });

  console.log("✅ فرایند Seed با موفقیت پایان یافت.");
}

main()
  .catch((error: unknown) => {
    console.error("❌ خطا در اجرای اسکریپت Seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  await prisma.adminUser.upsert({
    where: { username: "x-admin" },
    update: {},
    create: {
      username: "x-admin",
      fullName: "مدیر ارشد سیستم",
      passwordHash: await argon2.hash(process.env.SEED_ADMIN_PASSWORD!),
      role: "SUPER_ADMIN",
    },
  });
  console.log(
    "✅ ادمین پایه آماده است (بدون MFA — در اولین لاگین Setup می‌شود)",
  );
}

main();

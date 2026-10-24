// src/features/admin/lib/admin-tokens.ts
import { jwtVerify, SignJWT } from "jose";

/**
 * برای امنیت: کلید امضای JWT را از ENV بگیر.
 * اگر موجود نبود، از AUTH_SECRET هم می‌توان گرفت. مقادیر fallback فقط برای توسعه است.
 */
const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ||
    process.env.AUTH_SECRET ||
    "dev-only-fallback-change-me",
);

type BaseClaims = {
  type: "preauth" | "session";
  sub: string; // adminId
  username?: string; // برای session خوب است
  role?: string; // برای session خوب است
};

// صدور توکن موقت مرحله اول (pre-auth) برای MFA
export async function createPreAuthToken(adminId: string) {
  return await new SignJWT(<BaseClaims>{ type: "preauth", sub: adminId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(ADMIN_JWT_SECRET);
}

// بررسی توکن pre-auth و برگرداندن adminId معتبر یا null
export async function verifyPreAuthToken(
  token: string,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.type !== "preauth" || typeof payload.sub !== "string") {
      return null;
    }
    return payload.sub;
  } catch {
    return null;
  }
}

// صدور توکن نشست ادمین (session) برای کوکی httpOnly
export async function createAdminToken(input: {
  adminId: string;
  username: string;
  role: string;
}) {
  const { adminId, username, role } = input;
  return await new SignJWT(<BaseClaims>{
    type: "session",
    sub: adminId,
    username,
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(ADMIN_JWT_SECRET);
}

// بررسی توکن نشست ادمین و برگرداندن payload یا null
export async function verifyAdminToken(token: string): Promise<{
  sub: string;
  username?: string;
  role?: string;
  type: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.type !== "session") return null;
    return {
      sub: String(payload.sub),
      username: payload.username ? String(payload.username) : undefined,
      role: payload.role ? String(payload.role) : undefined,
      type: String(payload.type),
    };
  } catch {
    return null;
  }
}

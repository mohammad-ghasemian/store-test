import type { AdminRole } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";

import { requireEnv } from "@/config/env.server";

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  requireEnv("ADMIN_JWT_SECRET"),
);

type PreAuthClaims = {
  type: "preauth";
  sub: string;
};

type SessionClaims = {
  type: "session";
  sub: string;
  username: string;
  role: AdminRole;
};

type Claims = PreAuthClaims | SessionClaims;

function getStringClaim(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isAdminRole(value: unknown): value is AdminRole {
  return (
    value === "SUPER_ADMIN" ||
    value === "ADMIN" ||
    value === "CONTENT_MANAGER" ||
    value === "SUPPORT"
  );
}

// توکن موقت قبل از MFA (۵ دقیقه)
export async function createPreAuthToken(adminId: string) {
  return await new SignJWT({
    type: "preauth",
    sub: adminId,
  } satisfies Claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(ADMIN_JWT_SECRET);
}

// خروجی: adminId یا null
export async function verifyPreAuthToken(
  token: string,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.type !== "preauth") return null;
    return getStringClaim(payload.sub);
  } catch {
    return null;
  }
}

// توکن نشست نهایی بعد از MFA
export async function createAdminToken(input: {
  adminId: string;
  username: string;
  role: AdminRole;
}) {
  const { adminId, username, role } = input;

  return await new SignJWT({
    type: "session",
    sub: adminId,
    username,
    role,
  } satisfies Claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<{
  sub: string;
  username: string;
  role: AdminRole;
  type: "session";
} | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    if (payload.type !== "session") return null;

    const sub = getStringClaim(payload.sub);
    const username = getStringClaim(payload.username);
    if (!sub || !username) return null;
    if (!isAdminRole(payload.role)) return null;

    return { sub, username, role: payload.role, type: "session" };
  } catch {
    return null;
  }
}

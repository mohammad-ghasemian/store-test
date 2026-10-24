// نقش‌های مجاز برای ورود به پنل ادمین
export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "CONTENT_MANAGER" | "SUPPORT";

// وضعیت اکانت ادمین برای مسائل امنیتی
export type AdminStatus = "ACTIVE" | "SUSPENDED" | "LOCKED";

// ساختار اطلاعات داخل سشن ادمین
export interface AdminSessionPayload {
  adminId: string;
  username: string;
  role: AdminRole;
  isMfaVerified: boolean;
}

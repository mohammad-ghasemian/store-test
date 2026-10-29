import * as v from "valibot";

// مرحله ۱: نام کاربری و رمز
export const AdminCredentialsSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3, "نام کاربری کوتاه است")),
  password: v.pipe(v.string(), v.minLength(8, "رمز عبور کوتاه است")),
});

// مرحله ۲: کد ۶ رقمی
export const MfaCodeSchema = v.object({
  preAuthToken: v.pipe(v.string(), v.minLength(10, "توکن نامعتبر است")),
  code: v.pipe(v.string(), v.regex(/^\d{6}$/, "کد باید ۶ رقم باشد")),
});

export type AdminCredentialsInput = v.InferOutput<
  typeof AdminCredentialsSchema
>;
export type MfaCodeInput = v.InferOutput<typeof MfaCodeSchema>;

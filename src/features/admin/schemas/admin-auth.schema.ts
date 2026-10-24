import * as v from "valibot";

// فرم مرحله یک: ورود با یوزرنیم و پسورد
export const AdminCredentialsSchema = v.object({
  username: v.pipe(v.string(), v.minLength(3, "نام کاربری کوتاه است")),
  password: v.pipe(v.string(), v.minLength(8, "رمز عبور کوتاه است")),
});

// فرم مرحله دو: کد ۶ رقمی + توکن موقت مرحله قبل
export const MfaCodeSchema = v.object({
  preAuthToken: v.pipe(v.string(), v.minLength(10)),
  // دقیقاً ۶ رقم عددی
  code: v.pipe(v.string(), v.regex(/^\d{6}$/, "کد باید ۶ رقم باشد")),
});

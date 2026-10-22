import * as v from "valibot";

export const IRAN_PHONE_REGEX = /^(?:0|\+98)?9\d{9}$/;

export const sendOtpSchema = v.object({
  phone: v.pipe(
    v.string("شماره موبایل الزامی است."),
    v.trim(),
    v.regex(
      IRAN_PHONE_REGEX,
      "شماره موبایل نامعتبر است. فرمت صحیح: 09123456789",
    ),
  ),
});

export const verifyOtpSchema = v.object({
  phone: v.pipe(
    v.string("شماره موبایل الزامی است."),
    v.trim(),
    v.regex(IRAN_PHONE_REGEX, "شماره موبایل نامعتبر است."),
  ),
  code: v.pipe(
    v.string("کد تایید الزامی است."),
    v.trim(),
    v.minLength(6, "کد تایید باید ۶ رقم باشد."),
    v.maxLength(6, "کد تایید باید ۶ رقم باشد."),
    v.regex(/^\d+$/, "کد تایید فقط باید شامل اعداد باشد."),
  ),
});

"use server";

import * as v from "valibot";
import { sendOtpSchema } from "@/features/auth/schemas/auth.schemas";
import { smsService } from "@/features/auth/service/sms.service";
import { normalizeIranPhone } from "@/features/auth/utils/phone";
import { auth } from "@/lib/auth";

export type ActionState = {
  success: boolean;
  message?: string;
  error?: string;
  devCode?: string;
};

export async function sendOtpAction(input: {
  phone: string;
}): Promise<ActionState> {
  const parsed = v.safeParse(sendOtpSchema, input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.issues[0]?.message || "شماره موبایل وارد شده نامعتبر است.",
    };
  }

  const phone = normalizeIranPhone(parsed.output.phone);

  try {
    await auth.api.sendPhoneNumberOTP({ body: { phoneNumber: phone } });

    return {
      success: true,
      message: "کد تایید با موفقیت ارسال شد.",
      devCode: smsService.getDevCode(phone),
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "خطا در ارسال کد تایید.",
    };
  }
}

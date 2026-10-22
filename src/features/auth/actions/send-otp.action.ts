"use server";

import { headers } from "next/headers";
import * as v from "valibot";
import { sendOtpSchema } from "@/features/auth/schemas/auth.schemas";
import { auth } from "@/lib/auth";

export type ActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function sendOtpAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const rawPhone = formData.get("phone");

  // ۱. اعتبارسنجی ورودی با Valibot
  const parsed = v.safeParse(sendOtpSchema, { phone: rawPhone });

  if (!parsed.success) {
    const issue = parsed.issues[0];
    return {
      success: false,
      error: issue?.message || "شماره موبایل وارد شده نامعتبر است.",
    };
  }

  const { phone } = parsed.output;

  try {
    await auth.api.sendPhoneNumberOTP({
      body: {
        phoneNumber: phone,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "کد تایید با موفقیت ارسال شد.",
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "خطا در ارسال کد تایید. لطفا مجدد تلاش کنید.",
    };
  }
}

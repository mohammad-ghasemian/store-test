"use server";

import { headers } from "next/headers";
import * as v from "valibot";
import { verifyOtpSchema } from "@/features/auth/schemas/auth.schemas";
import { auth } from "@/lib/auth";
import type { ActionState } from "./send-otp.action";

export async function verifyOtpAction(input: {
  phone: string;
  code: string;
}): Promise<ActionState> {
  const parsed = v.safeParse(verifyOtpSchema, input);

  if (!parsed.success) {
    const issue = parsed.issues[0];
    return {
      success: false,
      error: issue?.message || "اطلاعات وارد شده نامعتبر است.",
    };
  }

  const { phone, code } = parsed.output;

  try {
    await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber: phone,
        code: code,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "ورود با موفقیت انجام شد.",
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "کد تایید اشتباه یا منقضی شده است.",
    };
  }
}

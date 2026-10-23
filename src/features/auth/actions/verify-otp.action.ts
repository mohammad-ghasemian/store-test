"use server";

import { headers } from "next/headers";
import * as v from "valibot";
import { verifyOtpSchema } from "@/features/auth/schemas/auth.schemas";
import { normalizeIranPhone } from "@/features/auth/utils/phone";
import { auth } from "@/lib/auth";
import type { ActionState } from "./send-otp.action";

export async function verifyOtpAction(input: {
  phone: string;
  code: string;
}): Promise<ActionState> {
  const parsed = v.safeParse(verifyOtpSchema, input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.issues[0]?.message || "اطلاعات وارد شده نامعتبر است.",
    };
  }

  try {
    await auth.api.verifyPhoneNumber({
      body: {
        phoneNumber: normalizeIranPhone(parsed.output.phone),
        code: parsed.output.code,
      },
      headers: await headers(),
    });

    return { success: true, message: "ورود با موفقیت انجام شد." };
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "کد تایید اشتباه یا منقضی شده است.",
    };
  }
}

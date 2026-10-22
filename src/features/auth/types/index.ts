import type * as v from "valibot";
import type {
  sendOtpSchema,
  verifyOtpSchema,
} from "@/features/auth/schemas/auth.schemas";

export type SendOtpInput = v.InferInput<typeof sendOtpSchema>;
export type VerifyOtpInput = v.InferInput<typeof verifyOtpSchema>;

export type AuthStep = "ENTER_PHONE" | "ENTER_OTP";

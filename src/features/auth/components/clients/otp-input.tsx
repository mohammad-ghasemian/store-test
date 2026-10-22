"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type OtpInputProps = {
  name?: string;
  disabled?: boolean;
};

export function OtpInput({ name = "code", disabled = false }: OtpInputProps) {
  return (
    <InputOTP
      maxLength={6}
      name={name}
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
      dir="ltr"
      aria-label="کد تایید شش رقمی"
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

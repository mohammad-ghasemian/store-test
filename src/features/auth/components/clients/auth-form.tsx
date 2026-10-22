"use client";

import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { sendOtpAction, verifyOtpAction } from "@/features/auth/actions/index";
import { CountryCodeSelect } from "./country-code-select";

export function AuthForm() {
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ۱. ارسال شماره موبایل
  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const rawPhone = formData.get("phone") as string;
    const fullPhone = rawPhone.startsWith("0") ? rawPhone : `0${rawPhone}`;
    setPhone(fullPhone);

    setLoading(true);
    const result = await sendOtpAction({ phone: fullPhone });
    setLoading(false);

    if (result.success) {
      toast.success("کد تایید با موفقیت ارسال شد.");
      setStep("OTP");
    } else {
      toast.error(result.error || "خطا در ارسال کد تایید.");
    }
  }

  // ۲. تایید کد OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("لطفاً کد ۶ رقمی را به طور کامل وارد کنید.");
      return;
    }

    setLoading(true);
    const result = await verifyOtpAction({ phone, code: otp });
    setLoading(false);

    if (result.success) {
      toast.success("ورود با موفقیت انجام شد.");
      window.location.href = "/";
    } else {
      toast.error(result.error || "کد تایید نامعتبر است.");
    }
  }

  if (step === "OTP") {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="space-y-2 text-center">
          <p
            id="otp-description"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            کد تایید ارسال شده به شماره {phone} را وارد کنید
          </p>
          <div className="flex justify-center py-2">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={otp}
              onChange={(value) => setOtp(value)}
              aria-describedby="otp-description"
            >
              <InputOTPGroup dir="ltr">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || otp.length < 6}
        >
          {loading ? "در حال بررسی..." : "تایید و ورود"}
        </Button>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <button
            type="button"
            onClick={() => setStep("PHONE")}
            className="hover:underline"
          >
            ویرایش شماره موبایل
          </button>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              const res = await sendOtpAction({ phone });
              setLoading(false);
              if (res.success) toast.success("کد مجدداً ارسال شد.");
              else toast.error(res.error);
            }}
            className="text-primary hover:underline"
          >
            ارسال مجدد کد
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          شماره موبایل
        </label>
        <div className="flex gap-2" dir="ltr">
          <CountryCodeSelect />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="9123456789"
            required
            className="text-left"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "در حال ارسال کد..." : "ارسال کد تایید"}
      </Button>
    </form>
  );
}

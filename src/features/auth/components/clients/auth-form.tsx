// src/features/auth/components/clients/auth-form.tsx
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendOtpAction } from "@/features/auth/actions/send-otp.action";

// تابع دقیق نرمالایز کردن شماره موبایل ایران
export function normalizeIranPhone(input: string): string {
  // پاک کردن تمام کاراکترهای غیرعددی به جز +
  const cleaned = input.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+98")) {
    return cleaned;
  }
  if (cleaned.startsWith("0098")) {
    return "+" + cleaned.slice(2);
  }
  if (cleaned.startsWith("98")) {
    return "+" + cleaned;
  }
  if (cleaned.startsWith("0")) {
    return "+98" + cleaned.slice(1);
  }
  if (cleaned.length === 10 && cleaned.startsWith("9")) {
    return "+98" + cleaned;
  }
  return cleaned;
}

export function AuthForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [isPending, startTransition] = useTransition();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeIranPhone(phoneNumber);

    if (!/^(\+98|0)?9\d{9}$/.test(normalized)) {
      toast.error(
        "لطفاً یک شماره موبایل معتبر ایران وارد کنید (مثال: 09123456789)",
      );
      return;
    }

    startTransition(async () => {
      try {
        const result = await sendOtpAction({ phone: normalized });
        if (result.success) {
          toast.success("کد تایید ارسال شد.");
          setStep("OTP");
        } else {
          toast.error(result.error || "خطا در ارسال کد تایید");
        }
      } catch {
        toast.error("خطای سرور رخ داد.");
      }
    });
  };

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">شماره موبایل</Label>
        <div className="relative flex items-center">
          <span className="text-muted-foreground dir-ltr absolute right-3 font-mono text-xs">
            +98
          </span>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            placeholder="9123456789"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="pr-12 text-left font-mono"
            maxLength={11}
            disabled={isPending || step === "OTP"}
          />
        </div>
        <p className="text-muted-foreground text-[11px]">
          بدون صفر اول وارد کنید (مثال: ۹۱۲۳۴۵۶۷۸۹)
        </p>
      </div>

      {step === "PHONE" && (
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "در حال ارسال..." : "ارسال کد تایید"}
        </Button>
      )}
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { sendOtpAction } from "@/features/auth/actions/send-otp.action";
import { verifyOtpAction } from "@/features/auth/actions/verify-otp.action";

export function normalizeIranPhone(input: string): string {
  const cleaned = input.replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+98")) return cleaned;
  if (cleaned.startsWith("0098")) return "+" + cleaned.slice(2);
  if (cleaned.startsWith("98")) return "+" + cleaned;
  if (cleaned.startsWith("0")) return "+98" + cleaned.slice(1);
  if (cleaned.length === 10 && cleaned.startsWith("9")) return "+98" + cleaned;
  return cleaned;
}

export function AuthForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast.error("لطفاً کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    const normalized = normalizeIranPhone(phoneNumber);

    startTransition(async () => {
      try {
        const result = await verifyOtpAction({
          phone: normalized,
          code: otpCode,
        });
        if (result.success) {
          toast.success("ورود با موفقیت انجام شد!");
          router.push("/");
          router.refresh();
        } else {
          toast.error(result.error || "کد تایید نامعتبر است.");
        }
      } catch {
        toast.error("خطای سرور رخ داد.");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      {step === "PHONE" ? (
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
                className="h-11 pr-12 text-left font-mono text-base"
                maxLength={11}
                disabled={isPending}
              />
            </div>
            <p className="text-muted-foreground text-[11px]">
              بدون صفر اول وارد کنید (مثال: ۹۱۲۳۴۵۶۷۸۹)
            </p>
          </div>

          <Button
            type="submit"
            className="h-11 w-full text-base font-medium"
            disabled={isPending}
          >
            {isPending ? "در حال ارسال..." : "ارسال کد تایید"}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleVerifyOtp}
          className="flex flex-col items-center space-y-6"
        >
          <div className="space-y-2 text-center">
            <Label htmlFor="otp" className="text-base">
              کد تایید ۶ رقمی
            </Label>
            <p className="text-muted-foreground text-xs">
              کد ارسال شده به شماره{" "}
              <span className="font-mono">{phoneNumber}</span> را وارد کنید.
            </p>
          </div>
          <div dir="ltr" className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={(value) => setOtpCode(value)}
              disabled={isPending}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={0}
                  className="h-14 w-12 rounded-md border text-lg font-bold"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-12 rounded-md border text-lg font-bold"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-12 rounded-md border text-lg font-bold"
                />
                <InputOTPSlot
                  index={3}
                  className="h-14 w-12 rounded-md border text-lg font-bold"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-12 rounded-md border text-lg font-bold"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 w-12 rounded-md border text-lg font-bold"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-1/3"
              onClick={() => {
                setStep("PHONE");
                setOtpCode("");
              }}
              disabled={isPending}
            >
              ویرایش شماره
            </Button>
            <Button
              type="submit"
              className="h-11 w-2/3 font-medium"
              disabled={isPending || otpCode.length < 6}
            >
              {isPending ? "در حال بررسی..." : "تایید و ورود"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

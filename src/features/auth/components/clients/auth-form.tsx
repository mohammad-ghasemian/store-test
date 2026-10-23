"use client";

import { Check, Copy } from "lucide-react";
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
import { normalizeIranPhone } from "@/features/auth/utils/phone";

export function AuthForm() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [isPending, startTransition] = useTransition();
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeIranPhone(phoneNumber);

    if (!/^\+989\d{9}$/.test(normalized)) {
      toast.error("لطفاً یک شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
      return;
    }

    startTransition(async () => {
      const res = await sendOtpAction({ phone: normalized });

      if (!res.success) {
        toast.error(res.error || "خطا در ارسال کد تایید.");
        return;
      }

      toast.success("کد تایید با موفقیت ارسال شد.");
      setOtpCode("");
      setStep("OTP");
      setDevOtp(res.devCode ?? null);
    });
  };

  const handleCopyOtp = async () => {
    if (!devOtp) return;
    try {
      await navigator.clipboard.writeText(devOtp);
      setCopied(true);
      toast.success("کد تایید کپی شد!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("کپی انجام نشد.");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      toast.error("لطفاً کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    const normalized = normalizeIranPhone(phoneNumber);

    startTransition(async () => {
      const res = await verifyOtpAction({ phone: normalized, code: otpCode });

      if (!res.success) {
        toast.error(res.error || "کد تایید نامعتبر است یا منقضی شده.");
        return;
      }

      toast.success("ورود با موفقیت انجام شد.");
      router.replace("/");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      {step === "PHONE" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">شماره موبایل</Label>
            <Input
              id="phone"
              type="tel"
              dir="ltr"
              placeholder="09123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-11 text-left font-mono text-base"
              maxLength={14}
              disabled={isPending}
            />
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
            <Label htmlFor="otp" className="justify-center text-base">
              کد تایید ۶ رقمی
            </Label>
            <p className="text-muted-foreground text-xs">
              کد ارسال شده به{" "}
              <span className="font-mono" dir="ltr">
                {normalizeIranPhone(phoneNumber)}
              </span>{" "}
              را وارد کنید.
            </p>
          </div>

          {devOtp && (
            <div className="bg-muted/60 border-border flex w-full items-center justify-between rounded-lg border p-3 text-sm">
              <span className="text-muted-foreground text-xs">
                کد تست (Development):
              </span>
              <div className="flex items-center gap-2">
                <span className="text-primary font-mono font-bold tracking-widest">
                  {devOtp}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyOtp}
                  title="کپی کردن کد"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <div dir="ltr" className="flex justify-center">
            <InputOTP
              id="otp"
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              disabled={isPending}
              inputMode="numeric"
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-14 w-12 rounded-md border text-lg font-bold"
                  />
                ))}
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
                setDevOtp(null);
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

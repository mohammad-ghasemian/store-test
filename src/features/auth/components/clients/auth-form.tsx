"use client";

import { Check, Copy, LoaderCircle } from "lucide-react";
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

  const inputClassName =
    "h-11 border-white/25 bg-white/10 text-white placeholder:text-white/45 shadow-none backdrop-blur-sm transition-colors duration-200 focus-visible:border-white/50 focus-visible:ring-2 focus-visible:ring-white/25 disabled:opacity-50";

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalized = normalizeIranPhone(phoneNumber);

    if (!/^\+989\d{9}$/.test(normalized)) {
      toast.error("لطفاً یک شماره موبایل معتبر وارد کنید (مثال: 09123456789)");
      return;
    }

    startTransition(async () => {
      try {
        const res = await sendOtpAction({ phone: normalized });

        if (!res.success) {
          toast.error(res.error || "خطا در ارسال کد تایید.");
          return;
        }

        toast.success("کد تایید با موفقیت ارسال شد.");
        setOtpCode("");
        setStep("OTP");
        setDevOtp(res.devCode ?? null);
      } catch {
        toast.error("ارسال کد تایید با خطا مواجه شد.");
      }
    });
  };

  const handleCopyOtp = async () => {
    if (!devOtp) return;

    try {
      await navigator.clipboard.writeText(devOtp);
      setCopied(true);
      toast.success("کد تایید کپی شد.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("کپی انجام نشد.");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      toast.error("لطفاً کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    const normalized = normalizeIranPhone(phoneNumber);

    startTransition(async () => {
      try {
        const res = await verifyOtpAction({
          phone: normalized,
          code: otpCode,
        });

        if (!res.success) {
          toast.error(res.error || "کد تایید نامعتبر است یا منقضی شده.");
          return;
        }

        toast.success("ورود با موفقیت انجام شد.");
        router.replace("/store");
        router.refresh();
      } catch {
        toast.error("بررسی کد تایید با خطا مواجه شد.");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-5">
      {step === "PHONE" ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-white/85"
            >
              شماره موبایل
            </Label>

            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder="09123456789"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${inputClassName} text-left font-mono text-base`}
              maxLength={14}
              disabled={isPending}
              required
            />
          </div>

          <Button
            type="submit"
            className="group h-11 w-full border border-white/20 bg-white text-zinc-900 shadow-sm transition-colors duration-200 hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0 disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ارسال کد تایید
                <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                  ←
                </span>
              </span>
            )}
          </Button>
        </form>
      ) : (
        <form
          onSubmit={handleVerifyOtp}
          className="flex flex-col items-center space-y-5"
        >
          <div className="w-full space-y-2 text-center">
            <Label
              htmlFor="otp"
              className="justify-center text-base font-semibold text-white"
            >
              کد تایید ۶ رقمی
            </Label>

            <p className="text-xs leading-6 text-white/70">
              کد ارسال شده به{" "}
              <span className="font-mono text-white/90" dir="ltr">
                {normalizeIranPhone(phoneNumber)}
              </span>{" "}
              را وارد کنید.
            </p>
          </div>

          {devOtp && (
            <div
              dir="rtl"
              className="flex w-full items-center justify-between gap-3 rounded-xl border border-amber-200/25 bg-amber-100/10 p-3 text-sm text-white"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-xs text-white/65">کد تست (Development)</p>
                <span className="font-mono font-bold tracking-[0.2em]">
                  {devOtp}
                </span>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCopyOtp}
                aria-label="کپی کد تایید"
                className="group size-9 shrink-0 text-white/80 hover:bg-white/15 hover:text-white"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-300" />
                ) : (
                  <Copy className="size-4 transition-transform duration-200 group-hover:scale-110" />
                )}
              </Button>
            </div>
          )}

          <div dir="ltr" className="flex w-full justify-center">
            <InputOTP
              id="otp"
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              disabled={isPending}
              inputMode="numeric"
              autoComplete="one-time-code"
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="size-10 rounded-lg border border-white/25 bg-white/10 text-base font-bold text-white shadow-none backdrop-blur-sm transition-colors duration-200 data-[active=true]:border-white/60 data-[active=true]:bg-white/20 sm:size-11"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-1/3 border-white/25 bg-white/10 px-2 text-xs text-white backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white sm:text-sm"
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
              className="group h-11 w-2/3 bg-white font-medium text-zinc-900 transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0"
              disabled={isPending || otpCode.length !== 6}
            >
              {isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  در حال بررسی...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  تایید و ورود
                  <Check className="size-4 transition-transform duration-200 group-hover:scale-110" />
                </span>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

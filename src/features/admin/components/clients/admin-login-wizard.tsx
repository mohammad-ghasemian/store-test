"use client";

import type { AdminRole } from "@prisma/client";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { devQuickLoginAction } from "../../actions/dev-quick-login.action";
import { loginStepOneAction } from "../../actions/login-step-one.action";
import { verifyMfaAction } from "../../actions/verify-mfa.action";
import { MfaSetupCard } from "./mfa-setup-card";

const isDev = process.env.NODE_ENV === "development";

const DEV_ROLES: AdminRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "CONTENT_MANAGER",
  "SUPPORT",
];

type MfaState = {
  preAuthToken: string;
  mode: "setup" | "verify";
  secret?: string;
  otpauthUrl?: string;
};

export function AdminLoginWizard() {
  const [step, setStep] = useState<"step1" | "mfa">("step1");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isStepOneLoading, setIsStepOneLoading] = useState(false);

  const [otpCode, setOtpCode] = useState("");
  const [mfa, setMfa] = useState<MfaState | null>(null);
  const [isMfaLoading, setIsMfaLoading] = useState(false);

  const [selectedDevRole, setSelectedDevRole] = useState<AdminRole>("SUPPORT");
  const [isDevLoading, setIsDevLoading] = useState(false);
  const OTP_SLOT_KEYS = ["a", "b", "c", "d", "e", "f"] as const;
  // ورود به مرحله MFA بر اساس پاسخ سرور
  function enterMfaStep(res: MfaState) {
    setMfa(res);
    setOtpCode("");
    setStep("mfa");
    toast.info(
      res.mode === "setup"
        ? "ابتدا کد را در 2FAS Auth ثبت و سپس کد ۶ رقمی را وارد کنید."
        : "کد ۶ رقمی اپلیکیشن Authenticator را وارد کنید.",
    );
  }

  async function handleStepOne(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) return;

    setIsStepOneLoading(true);
    try {
      const res = await loginStepOneAction({ username, password });

      if (!res.success) {
        toast.error(res.error ?? "ورود ناموفق.");
        return;
      }

      enterMfaStep(res);
    } catch {
      toast.error("خطای غیرمنتظره در ورود.");
    } finally {
      setIsStepOneLoading(false);
    }
  }

  async function handleVerifyMfa(e: React.FormEvent) {
    e.preventDefault();

    if (!mfa) {
      toast.error("نشست منقضی شده. دوباره وارد شوید.");
      setStep("step1");
      return;
    }

    if (otpCode.length !== 6) {
      toast.error("کد ۶ رقمی معتبر نیست.");
      return;
    }

    setIsMfaLoading(true);
    try {
      const res = await verifyMfaAction({
        code: otpCode,
        preAuthToken: mfa.preAuthToken,
      });

      if (!res.success) {
        toast.error(res.error ?? "تایید دومرحله‌ای ناموفق بود.");
        return;
      }

      toast.success("ورود موفقیت‌آمیز؛ در حال انتقال به پنل...");
      window.location.replace("/admin");
    } catch {
      toast.error("خطای غیرمنتظره در تایید کد.");
    } finally {
      setIsMfaLoading(false);
    }
  }

  async function handleDevQuickLogin() {
    if (!isDev) return;

    setIsDevLoading(true);
    try {
      const res = await devQuickLoginAction(selectedDevRole);

      if (!res.success) {
        toast.error(res.error ?? "ورود سریع ناموفق بود.");
        return;
      }

      enterMfaStep(res);
    } catch {
      toast.error("Dev Quick Login failed.");
    } finally {
      setIsDevLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm py-10">
      {isDev && (
        <div className="mb-6 space-y-2 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 p-3 text-right">
          <label
            htmlFor="dev-role-select"
            className="block text-[11px] font-medium text-emerald-400"
          >
            تست سریع بر اساس نقش (مخصوص لوکال)
          </label>
          <div className="flex gap-2">
            <select
              id="dev-role-select"
              value={selectedDevRole}
              onChange={(e) => setSelectedDevRole(e.target.value as AdminRole)}
              className="w-full rounded-lg border border-emerald-500/30 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 outline-none"
            >
              {DEV_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleDevQuickLogin}
              disabled={isDevLoading}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {isDevLoading ? "در حال ورود..." : "ورود سریع"}
            </button>
          </div>
        </div>
      )}

      {step === "step1" && (
        <form onSubmit={handleStepOne} className="space-y-4 text-right">
          <div>
            <label
              htmlFor="username-input"
              className="mb-1 block text-xs font-medium text-zinc-300"
            >
              نام کاربری
            </label>
            <input
              id="username-input"
              type="text"
              inputMode="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
              placeholder="نام کاربری ادمین"
            />
          </div>

          <div>
            <label
              htmlFor="password-input"
              className="mb-1 block text-xs font-medium text-zinc-300"
            >
              گذرواژه
            </label>
            <input
              id="password-input"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isStepOneLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {isStepOneLoading ? <Spinner size="sm" /> : null}
            <span>ادامه</span>
          </button>
        </form>
      )}

      {step === "mfa" && mfa && (
        <form onSubmit={handleVerifyMfa} className="mt-6 space-y-4 text-right">
          {mfa.mode === "setup" && mfa.secret && mfa.otpauthUrl && (
            <MfaSetupCard secret={mfa.secret} otpauthUrl={mfa.otpauthUrl} />
          )}

          <div className="flex flex-col items-center gap-2">
            <span
              id="otp-label"
              className="text-center text-xs font-medium text-zinc-300"
            >
              {mfa.mode === "setup"
                ? "پس از ثبت در 2FAS، کد ۶ رقمی را وارد کنید"
                : "کد ۶ رقمی اپلیکیشن Authenticator"}
            </span>

            <div dir="ltr" className="my-2">
              <OTPInput
                aria-labelledby="otp-label"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otpCode}
                onChange={setOtpCode}
                containerClassName="flex justify-center"
                render={({ slots }) => (
                  <div className="group/slots flex items-center gap-2">
                    {slots.map((slot, idx) => (
                      <div
                        key={OTP_SLOT_KEYS[idx]}
                        className={`flex h-12 w-10 items-center justify-center rounded-lg border font-mono text-lg font-bold transition-all ${
                          slot.isActive
                            ? "border-emerald-500 ring-2 ring-emerald-500/20"
                            : "border-zinc-800 bg-zinc-900/50 text-zinc-100"
                        }`}
                      >
                        {slot.char}
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isMfaLoading || otpCode.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {isMfaLoading ? <Spinner size="sm" /> : null}
            <span>تایید کد</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default AdminLoginWizard;

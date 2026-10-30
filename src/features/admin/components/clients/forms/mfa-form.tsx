"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { verifyMfaAction } from "../../../actions/verify-mfa.action";
import { MfaSetupCard } from "../mfa-setup-card";
import { OtpCodeInput } from "./otp-code-input";
import type { MfaState } from "./types";

interface MfaFormProps {
  mfa: MfaState;
  onBack: () => void;
}

export function MfaForm({ mfa, onBack }: MfaFormProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitDisabled = code.trim().length !== 6 || isLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setIsLoading(true);

    try {
      const result = await verifyMfaAction({
        preAuthToken: mfa.preAuthToken,
        code: code.trim(),
      });

      if (!result.success) {
        toast.error(result.error ?? "کد وارد شده نامعتبر یا منقضی است.");
        setCode("");
        return;
      }

      toast.success("ورود موفقیت‌آمیز بود. در حال انتقال...");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("خطای سیستمی در اعتبارسنجی کد دومرحله‌ای.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      {mfa.mode === "setup" && mfa.secret && (
        <MfaSetupCard secret={mfa.secret} otpauthUrl={mfa.otpauthUrl ?? ""} />
      )}

      <div className="space-y-1">
        <span
          id="admin-otp-label"
          className="block text-center text-xs font-medium text-zinc-300"
        >
          کد ۶ رقمی اپلیکیشن تایید هویت را وارد کنید
        </span>
        <OtpCodeInput value={code} onChange={setCode} />
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Spinner size="sm" />}
          <span>تایید و ورود به پنل</span>
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full rounded-lg border border-zinc-800 bg-transparent px-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          بازگشت به ورود گذرواژه
        </button>
      </div>
    </form>
  );
}

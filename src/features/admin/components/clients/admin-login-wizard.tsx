"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CredentialsForm } from "./forms/credentials-form";
import { DevQuickLogin } from "./forms/dev-quick-login";
import { MfaForm } from "./forms/mfa-form";
import type { MfaState } from "./forms/types";

const isDev = process.env.NODE_ENV === "development";

export function AdminLoginWizard() {
  const [mfa, setMfa] = useState<MfaState | null>(null);

  function handleStepOneSuccess(result: MfaState) {
    if (result.mode === "setup" && (!result.secret || !result.otpauthUrl)) {
      toast.error("اطلاعات راه‌اندازی MFA ناقص است.");
      return;
    }

    setMfa(result);
    toast.info(
      result.mode === "setup"
        ? "حساب را در نرم‌افزار Authenticator اضافه و کد ۶ رقمی را وارد کنید."
        : "کد ۶ رقمی را وارد کنید.",
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm py-8">
      {mfa ? (
        <MfaForm mfa={mfa} onBack={() => setMfa(null)} />
      ) : (
        <div className="space-y-4">
          {isDev && <DevQuickLogin onSuccess={handleStepOneSuccess} />}
          <CredentialsForm onSuccess={handleStepOneSuccess} />
        </div>
      )}
    </div>
  );
}

export default AdminLoginWizard;

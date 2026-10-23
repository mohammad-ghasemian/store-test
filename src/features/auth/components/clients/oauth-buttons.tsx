"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GithubIcon } from "@/components/duplicate/icons/github-icon";
import { GoogleIcon } from "@/components/duplicate/icons/google-icon";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type OAuthProvider = "google" | "github";

export function OAuthButtons() {
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null,
  );

  async function handleOAuthSignIn(provider: OAuthProvider) {
    if (pendingProvider !== null) return;

    setPendingProvider(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        toast.error("ورود با حساب اجتماعی انجام نشد.");
        setPendingProvider(null);
      }
    } catch {
      toast.error("ارتباط با سرویس ورود برقرار نشد.");
      setPendingProvider(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        disabled={pendingProvider !== null}
        onClick={() => handleOAuthSignIn("google")}
        aria-label="ورود با گوگل"
        className="group relative h-11 w-full overflow-hidden rounded-xl border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative flex items-center justify-center gap-2">
          {pendingProvider === "google" ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          )}
          <span className="text-sm font-medium">Google</span>
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={pendingProvider !== null}
        onClick={() => handleOAuthSignIn("github")}
        aria-label="ورود با گیت‌هاب"
        className="group relative h-11 w-full overflow-hidden rounded-xl border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-white/40 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <span className="relative flex items-center justify-center gap-2">
          {pendingProvider === "github" ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <GithubIcon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          )}
          <span className="text-sm font-medium">GitHub</span>
        </span>
      </Button>
    </div>
  );
}

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
    setPendingProvider(provider);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });

    if (error) {
      toast.error("ورود با حساب اجتماعی انجام نشد.");
      setPendingProvider(null);
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button
        type="button"
        variant="outline"
        disabled={pendingProvider !== null}
        onClick={() => handleOAuthSignIn("google")}
      >
        {pendingProvider === "google" ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <GoogleIcon className="size-4 shrink-0" />
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={pendingProvider !== null}
        onClick={() => handleOAuthSignIn("github")}
      >
        {pendingProvider === "github" ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <GithubIcon className="size-4 shrink-0" />
        )}
      </Button>
    </div>
  );
}

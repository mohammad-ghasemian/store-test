import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

export async function AuthGuard({
  children,
  redirectTo = "/auth",
}: AuthGuardProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(redirectTo);
  }

  return children;
}

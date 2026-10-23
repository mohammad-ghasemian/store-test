import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

export async function AuthGuard({
  children,
  redirectTo = "/sign-in",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(redirectTo);
  return children;
}

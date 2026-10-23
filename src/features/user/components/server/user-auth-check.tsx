import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/features/user/components/clients/user-menu";
import { auth } from "@/lib/auth";

export async function UserAuthCheck() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (session?.user) {
    return <UserMenu user={session.user} />;
  }

  return (
    <Button
      asChild
      size="sm"
      variant="default"
      className="h-8 gap-1.5 rounded-full px-3 text-xs font-medium shadow-none"
    >
      <Link href="/sign-in">
        <span>ورود</span>
        <ArrowLeft className="h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}

export function UserAuthCheckSkeleton() {
  return (
    <div className="h-8 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
  );
}

"use client";

import {
  ChevronDown,
  Loader2,
  LogOut,
  ShoppingBag,
  User2,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/features/user/actions/sign-out.action";

interface UserMenuProps {
  user: {
    id: string;
    name?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const userIdentifier = user.name || user.phoneNumber || user.email || "کاربر";

  const handleSignOut = () => {
    startTransition(async () => {
      const res = await signOutAction();
      if (res.success) {
        toast.success("با موفقیت از حساب خارج شدید.");
        router.push("/");
        router.refresh();
      } else {
        toast.error(res.error || "خطا در خروج از حساب.");
      }
    });
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group flex h-9 items-center gap-2 rounded-full border-zinc-200/80 bg-zinc-50/50 px-2.5 py-1 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <Avatar className="h-6 w-6 border border-zinc-300 dark:border-zinc-700">
            <AvatarFallback className="bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              <User2 className="h-3.5 w-3.5" />
            </AvatarFallback>
          </Avatar>
          <span className="max-w-25 truncate text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {userIdentifier}
          </span>
          <ChevronDown className="h-3 w-3 text-zinc-400 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-zinc-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 rounded-2xl border-zinc-200/80 p-1.5 shadow-xl backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/95"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-2.5 py-2 font-normal">
          <div className="flex flex-col space-y-0.5">
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
              حساب کاربری فعال
            </span>
            <span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {userIdentifier}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800/80" />

        <DropdownMenuGroup className="space-y-0.5">
          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900 dark:text-zinc-300 dark:focus:bg-zinc-800/60 dark:focus:text-zinc-100"
          >
            <Link href="/profile">
              <UserCheck className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <span>پروفایل من</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-zinc-700 focus:bg-zinc-100 focus:text-zinc-900 dark:text-zinc-300 dark:focus:bg-zinc-800/60 dark:focus:text-zinc-100"
          >
            <Link href="/orders">
              <ShoppingBag className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <span>سفارشات من</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800/80" />

        <DropdownMenuItem
          disabled={isPending}
          onClick={handleSignOut}
          className="cursor-pointer gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/30 dark:focus:text-red-300"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export interface SignOutActionResult {
  success: boolean;
  error?: string;
}

export async function signOutAction(): Promise<SignOutActionResult> {
  try {
    const reqHeaders = await headers();

    await auth.api.signOut({
      headers: reqHeaders,
    });

    return { success: true };
  } catch (error) {
    console.error("SignOut Action Error:", error);
    return {
      success: false,
      error: "خطایی هنگام خروج از حساب رخ داد.",
    };
  }
}

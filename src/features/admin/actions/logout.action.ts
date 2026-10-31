"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogoutAction() {
  const cookiesStore = await cookies();
  cookiesStore.delete("admin_session");
  redirect("/login");
}

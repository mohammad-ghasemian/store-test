"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { loginStepOneAction } from "../../../actions/login-step-one.action";
import type { MfaState } from "./types";

type CredentialsFormProps = {
  onSuccess: (mfa: MfaState) => void;
};

export function CredentialsForm({ onSuccess }: CredentialsFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username || !password || isLoading) return;

    setIsLoading(true);

    try {
      // ارسال نام کاربری و پسورد به Server Action
      const result = await loginStepOneAction({ username, password });

      if (!result.success) {
        toast.error(result.error ?? "ورود ناموفق بود.");
        return;
      }
      setPassword("");
      onSuccess(result);
    } catch {
      toast.error("خطای غیرمنتظره در ورود به سیستم.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      {/* فیلد نام کاربری */}
      <div className="group/field space-y-1">
        <label
          htmlFor="admin-username"
          className="block text-xs font-medium text-zinc-300 transition-colors group-focus-within/field:text-emerald-400"
        >
          نام کاربری
        </label>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 transition-colors has-focus-visible:border-emerald-500">
          <input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام کاربری ادمین"
            className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* فیلد گذرواژه */}
      <div className="group/field space-y-1">
        <label
          htmlFor="admin-password"
          className="block text-xs font-medium text-zinc-300 transition-colors group-focus-within/field:text-emerald-400"
        >
          گذرواژه
        </label>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 transition-colors has-focus-visible:border-emerald-500">
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* دکمه ثبت فرم */}
      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading && <Spinner size="sm" />}
        <span>ادامه</span>
      </button>
    </form>
  );
}

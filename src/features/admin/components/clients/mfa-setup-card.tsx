"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toast } from "sonner";

// اصلاح اینترفیس: حذف موارد اضافه و اصلاح تایپ‌ها
interface MfaSetupCardProps {
  secret: string;
  otpauthUrl: string;
}

export function MfaSetupCard({ secret, otpauthUrl }: MfaSetupCardProps) {
  const [tab, setTab] = useState<"qr" | "manual">("qr");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      toast.success("کلید در کلیپ‌بورد کپی شد");
    } catch {
      toast.error("کپی انجام نشد.");
    }
  };

  const tabClass = (active: boolean) =>
    `rounded-md py-1.5 text-xs font-medium transition-colors ${
      active ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
    }`;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-zinc-900 p-1">
        <button
          type="button"
          onClick={() => setTab("qr")}
          className={tabClass(tab === "qr")}
        >
          اسکن QR Code
        </button>
        <button
          type="button"
          onClick={() => setTab("manual")}
          className={tabClass(tab === "manual")}
        >
          ورود دستی کلید
        </button>
      </div>

      {tab === "qr" ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-xs leading-5 text-zinc-400">
            در اپلیکیشن <b className="text-zinc-200">2FAS</b> گزینه
            <span dir="ltr" className="mx-1 font-mono">
              Scan QR
            </span>
            را بزنید و این بارکد را اسکن کنید:
          </p>
          <div className="rounded-lg bg-white p-2.5">
            <QRCodeSVG value={otpauthUrl} size={132} level="M" />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs leading-5 text-zinc-400">
            در اپلیکیشن، گزینه <b className="text-zinc-200">Manual Entry</b> را
            انتخاب و کلید زیر را وارد کنید:
          </p>
          <div className="flex items-center justify-between gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5">
            <code
              dir="ltr"
              className="font-mono text-sm break-all text-emerald-400"
            >
              {secret}
            </code>
            <button
              type="button"
              onClick={copyToClipboard}
              className="shrink-0 rounded-md border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-800"
            >
              کپی
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

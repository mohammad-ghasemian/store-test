"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function NetworkStatusMonitor() {
  useEffect(() => {
    // تابع هشدار قطعی اینترنت
    const triggerOffline = () => {
      toast.error("ارتباط شما با اینترنت قطع شد!", {
        id: "network-status-toast",
        description: "لطفاً کابل یا اتصال وای‌فای خود را بررسی کنید.",
        duration: Number.POSITIVE_INFINITY,
      });
    };

    // تابع هشدار وصل مجدد اینترنت
    const triggerOnline = () => {
      toast.dismiss("network-status-toast");
      toast.success("اتصال مجدد برقرار شد.", {
        description: "دسترسی شما به شبکه اینترنت پایدار است.",
        duration: 3500,
      });
    };

    // بررسی اولیه وضعیت هنگام لود
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      triggerOffline();
    }

    window.addEventListener("offline", triggerOffline);
    window.addEventListener("online", triggerOnline);

    return () => {
      window.removeEventListener("offline", triggerOffline);
      window.removeEventListener("online", triggerOnline);
    };
  }, []);

  return null;
}

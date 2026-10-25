"use client";

import { useEffect } from "react";
import { toast } from "sonner";

// کامپوننت پایشگر کلاینتی موقعیت جغرافیایی آی‌پی
export function VpnDetector() {
  useEffect(() => {
    // جلوگیری از اجرای مکرر در هر بار ناوبری کاربر
    const hasChecked = sessionStorage.getItem("vpn_check_done");
    if (hasChecked) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const checkIpOrigin = async () => {
      try {
        let countryCode: string | null = null;

        // تلاش اول: سرویس پرسرعت بدون تحریم ipwho.is
        try {
          const res = await fetch("https://ipwho.is/", {
            signal: controller.signal,
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.success) {
              countryCode = data.country_code;
            }
          }
        } catch {
          // در صورت بروز ارور، سرویس دوم فراخوانی می‌شود
        }

        // تلاش دوم: فال‌بک به اندپوینت کمکی در صورت عدم موفقیت تلاش اول
        if (!countryCode) {
          try {
            const fallbackRes = await fetch("https://ipapi.co/json/", {
              signal: controller.signal,
              cache: "no-store",
            });
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              countryCode = fallbackData?.country_code;
            }
          } catch {
            // هر دو اندپوینت در دسترس نبودند، بدون ایجاد اختلال رد می‌شویم
          }
        }

        // بررسی غیر ایرانی بودن آی‌پی
        if (countryCode && countryCode !== "IR") {
          toast.warning("فیلترشکن شما روشن است", {
            description: `کشور آی‌پی شما: ${countryCode}. پیشنهاد می‌شود برای سرعت و پایداری بالاتر، فیلترشکن را خاموش کنید.`,
            duration: 8000,
            position: "bottom-left",
          });
        }
      } finally {
        // علامت‌گذاری بررسی موفق جهت جلوگیری از تکرار در این نشست
        sessionStorage.setItem("vpn_check_done", "true");
        clearTimeout(timeoutId);
      }
    };

    checkIpOrigin();

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "قوانین و مقررات | فروشگاه",
  description: "قوانین و مقررات استفاده از خدمات و خرید از فروشگاه.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              قوانین و مقررات
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              آخرین به‌روزرسانی: آبان ۱۴۰۵
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/sign-in">
              <ArrowRight className="h-4 w-4" />
              بازگشت به ورود
            </Link>
          </Button>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              ۱. مقدمه و پذیرش قوانین
            </h2>
            <p>
              ورود به وب‌سایت فروشگاه و استفاده از خدمات آن به معنای آگاهی کامل و
              پذیرش شرایط و قوانین استفاده از خدمات ماست. لطفا پیش از ثبت سفارش
              یا ایجاد حساب کاربری، این مفاد را به دقت مطالعه فرمایید.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              ۲. حریم خصوصی کاربران
            </h2>
            <p>
              فروشگاه متعهد می‌شود که از اطلاعات شخصی و حریم خصوصی کاربران محافظت
              کرده و از آن صرفاً جهت ارائه خدمات بهتر، پردازش سفارش‌ها و ارتباطات
              درون‌سایت استفاده کند. اطلاعات تماس شما به هیچ عنوان در اختیار شخص
              ثالث قرار نخواهد گرفت.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              ۳. ثبت سفارش و خرید
            </h2>
            <p>
              تمامی سفارش‌های ثبت‌شده در سایت بر اساس موجودی انبار و قیمت‌های روز
              پردازش می‌شوند. در صورت بروز هرگونه مشکل در تامین کالا، مبلغ
              پرداخت‌شده در کوتاه‌ترین زمان ممکن به حساب کاربر بازگردانده خواهد
              شد.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              ۴. شرایط مرجوعی و بازگشت کالا
            </h2>
            <p>
              کاربران محترم می‌توانند تا ۷ روز پس از دریافت سفارش، در صورت وجود
              نقص فنی، مغایرت کالا یا عدم تطابق با مشخصات درج‌شده، درخواست مرجوعی
              خود را ثبت کنند مشروط بر اینکه کالا در شرایط اولیه و بسته‌بندی اصلی
              باشد.
            </p>
          </section>
        </div>

        <div className="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400 dark:border-zinc-800">
          تمامی حقوق محفوظ است © ۱۴۰۵
        </div>
      </div>
    </main>
  );
}

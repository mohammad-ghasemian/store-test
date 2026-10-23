import Link from "next/link";

export default function Home() {
  return (
    <main
      dir="rtl"
      className="group relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 py-16 text-zinc-900"
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-bold tracking-tight">
          X.
        </span>

        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            به فروشگاه X خوش آمدید
          </h1>

          <p className="mx-auto max-w-lg text-sm leading-8 text-zinc-500 sm:text-base">
            فروشگاه X با تنوع محصولات Y در خدمت شماست.
          </p>
        </div>

        <div className="mx-auto max-w-md border-y border-zinc-200 py-5">
          <p className="text-sm leading-8 text-zinc-500">
            فعالیت این فروشگاه با داشتن پروانه‌های مجاز فروش اینترنتی، از سال
            ۱۴۰۳ آغاز شده است.
          </p>
        </div>

        <Link
          href="/store"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900"
        >
          ورود به فروشگاه
        </Link>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 grid grid-cols-2"
      >
        <div className="origin-right overflow-hidden bg-zinc-950 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-0 motion-reduce:transition-none">
          <div className="flex h-full items-center justify-end">
            <span className="translate-x-1/2 text-4xl font-bold tracking-tight whitespace-nowrap text-white sm:text-6xl lg:text-8xl">
              خوش
            </span>
          </div>
        </div>
        <div className="absolute right-0 bottom-6 left-0 z-20 flex justify-center">
          <span className="rounded-full border border-white/15 bg-zinc-900/80 px-4 py-2 text-xs text-zinc-300 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0">
            لمس کنید یا نشانگر را روی صفحه ببرید
          </span>
        </div>
        <div className="origin-left overflow-hidden border-r border-white/10 bg-zinc-950 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-0 motion-reduce:transition-none">
          <div className="flex h-full items-center justify-start">
            <span className="-translate-x-1/2 text-4xl font-bold tracking-tight whitespace-nowrap text-white sm:text-6xl lg:text-8xl">
              آمدید
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

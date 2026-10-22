"use client";

import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { useEffect, useState } from "react";

// لیست دستی یا ایمن شده برای جلوگیری از تفاوت لوکال سرور و کلاینت
export function CountryCodeSelect() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // تا زمانی که در سرور یا اولین رندر کلاینت هستیم، یک مقدار ثابت برمی‌گردانیم تا mismatch رخ ندهد
  if (!isMounted) {
    return (
      <select
        disabled
        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-27.5 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="IR">ایران (+98)</option>
      </select>
    );
  }

  // بعد از مانت شدن در کلاینت، لیست کامل را رندر می‌کنیم
  const countries = getCountries().map((country) => ({
    code: country,
    dialCode: getCountryCallingCode(country),
  }));

  return (
    <select
      name="countryCode"
      defaultValue="IR"
      className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-27.5 rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {countries.map((item) => (
        <option key={item.code} value={item.code}>
          {item.code} (+{item.dialCode})
        </option>
      ))}
    </select>
  );
}

"use client";

import { OTPInput, REGEXP_ONLY_DIGITS, type SlotProps } from "input-otp";

type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <div
      data-active={isActive}
      className="flex h-12 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 font-mono text-lg font-bold text-zinc-100 transition-[border-color,box-shadow,background-color] data-[active=true]:border-emerald-500 data-[active=true]:bg-zinc-900 data-[active=true]:ring-2 data-[active=true]:ring-emerald-500/20"
    >
      {char}
      {hasFakeCaret && (
        <span className="animate-caret-blink h-4 w-0.5 bg-emerald-400" />
      )}
    </div>
  );
}

export function OtpCodeInput({ value, onChange }: OtpCodeInputProps) {
  return (
    <div dir="ltr" className="my-2">
      <OTPInput
        aria-labelledby="admin-otp-label"
        autoComplete="one-time-code"
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={value}
        onChange={onChange}
        containerClassName="flex justify-center"
        render={({ slots }) => (
          <div className="flex items-center gap-2">
            <Slot {...slots[0]} />
            <Slot {...slots[1]} />
            <Slot {...slots[2]} />
            <Slot {...slots[3]} />
            <Slot {...slots[4]} />
            <Slot {...slots[5]} />
          </div>
        )}
      />
    </div>
  );
}

export interface SendSmsResult {
  success: boolean;
  message: string;
}
const g = globalThis as unknown as { __devOtps?: Map<string, string> };
g.__devOtps = g.__devOtps ?? new Map<string, string>();
const devOtps = g.__devOtps;

export const smsService = {
  async sendOtp(phone: string, code: string): Promise<SendSmsResult> {
    if (process.env.NODE_ENV !== "production") {
      devOtps.set(phone, code);
      console.log(`[SMS SERVICE] OTP ${code} -> ${phone}`);
    }
    // TODO: اتصال به پنل پیامک واقعی
    return { success: true, message: "کد تایید با موفقیت ارسال شد." };
  },

  getDevCode(phone: string): string | undefined {
    if (process.env.NODE_ENV === "production") return undefined;
    return devOtps.get(phone);
  },
};

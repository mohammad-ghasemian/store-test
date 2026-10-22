export interface SendSmsResult {
  success: boolean;
  message: string;
  otpCode?: string;
}

export const smsService = {
  async sendOtp(phone: string, code: string): Promise<SendSmsResult> {
    console.log(`[SMS SERVICE] Sending OTP ${code} to phone ${phone}`);
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      message: "کد تایید با موفقیت ارسال شد.",
      otpCode: code,
    };
  },
};

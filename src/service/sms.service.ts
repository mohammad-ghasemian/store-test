export async function sendOtpSms(phoneNumber: string, code: string) {
  if (process.env.NODE_ENV === "production") {
    // TODO: اتصال به وب‌سرویس پیامکی در پروداکشن
    return;
  }
  console.log("\n========================================");
  console.log(`📱 [MOCK SMS SERVICE]`);
  console.log(`To: ${phoneNumber}`);
  console.log(`Your Verification Code is: >>> ${code} <<<`);
  console.log(`Expires in: 2 Minutes`);
  console.log("========================================\n");
}

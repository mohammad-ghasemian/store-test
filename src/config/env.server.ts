// اجباری کردن مقادیر سکرت در .env (امنیت بالا)
export function requireEnv(name: string): string {
  const secret_key = process.env[name];
  if (!secret_key) {
    throw new Error(`Missing required env: ${name}`);
  }
  return secret_key;
}

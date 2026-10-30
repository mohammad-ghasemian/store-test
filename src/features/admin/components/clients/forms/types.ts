//تایپ داده های برگشتی برای سرور
export type MfaState = {
  preAuthToken: string;
  mode: "setup" | "verify";
  secret?: string;
  otpauthUrl?: string;
};

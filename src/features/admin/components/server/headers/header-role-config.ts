// سطوح دسترسی مدیران در سامانه
export type AdminRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "SUPPORT"
  | string;

export interface RoleTheme {
  title: string;
  badgeClass: string;
  glowBorderClass: string;
  accentDot: string;
  headerBgClass: string;
}

export const ROLE_THEMES: Record<string, RoleTheme> = {
  SUPER_ADMIN: {
    title: "مدیر ارشد سیستم",
    badgeClass:
      "bg-rose-950/80 text-rose-100 border-rose-400/40 shadow-sm shadow-rose-950/50",
    glowBorderClass:
      "border-b-rose-400/40 shadow-[0_8px_30px_-6px_rgba(225,29,72,0.45)]",
    accentDot:
      "bg-rose-300 shadow-[0_0_10px_rgba(255,228,230,0.9)] animate-pulse",
    headerBgClass:
      "bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 text-rose-50",
  },
  ADMIN: {
    title: "مدیر سیستم",
    badgeClass:
      "bg-indigo-950/80 text-indigo-100 border-indigo-400/40 shadow-sm shadow-indigo-950/50",
    glowBorderClass:
      "border-b-indigo-400/40 shadow-[0_8px_30px_-6px_rgba(99,102,241,0.45)]",
    accentDot:
      "bg-indigo-300 shadow-[0_0_10px_rgba(224,231,255,0.9)] animate-pulse",
    headerBgClass:
      "bg-gradient-to-r from-slate-950 via-indigo-950 to-violet-900 text-indigo-50",
  },
  MANAGER: {
    title: "مدیر اجرایی",
    badgeClass:
      "bg-amber-950/80 text-amber-100 border-amber-400/40 shadow-sm shadow-amber-950/50",
    glowBorderClass:
      "border-b-amber-400/40 shadow-[0_8px_30px_-6px_rgba(245,158,11,0.45)]",
    accentDot:
      "bg-amber-300 shadow-[0_0_10px_rgba(254,243,199,0.9)] animate-pulse",
    headerBgClass:
      "bg-gradient-to-r from-stone-950 via-amber-950 to-orange-900 text-amber-50",
  },
  SUPPORT: {
    title: "پشتیبانی فنی",
    badgeClass:
      "bg-emerald-950/80 text-emerald-100 border-emerald-400/40 shadow-sm shadow-emerald-950/50",
    glowBorderClass:
      "border-b-emerald-400/40 shadow-[0_8px_30px_-6px_rgba(16,185,129,0.45)]",
    accentDot:
      "bg-emerald-300 shadow-[0_0_10px_rgba(209,250,229,0.9)] animate-pulse",
    headerBgClass:
      "bg-gradient-to-r from-teal-950 via-emerald-950 to-cyan-900 text-emerald-50",
  },
};

export function getRoleTheme(role?: string): RoleTheme {
  if (!role || !ROLE_THEMES[role]) {
    return {
      title: "کارشناس ادمین",
      badgeClass: "bg-blue-950/80 text-blue-100 border-blue-400/30",
      glowBorderClass:
        "border-b-blue-500/30 shadow-[0_6px_20px_-4px_rgba(59,130,246,0.3)]",
      accentDot: "bg-blue-300",
      headerBgClass:
        "bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-950 text-blue-50",
    };
  }
  return ROLE_THEMES[role];
}

import type { Role } from "@/config/roles.config";

export interface NavItem {
  title: string;
  href: string;
}

// نوبار مخصوص لندینگ
export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  {
    title: "فروشگاه",
    href: "/store",
  },
  {
    title: "تخفیف‌ها",
    href: "/offers",
  },
  {
    title: "درباره ما",
    href: "/about",
  },
] as const;

export interface AdminNavItem {
  title: string;
  href: string;
  icon: string;
  allowedRoles: Role[];
}

//منوی پنل مدیریت
export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    title: "داشبورد",
    href: "/admin",
    icon: "LayoutDashboard",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "SUPPORT"],
  },
  {
    title: "مدیریت محصولات",
    href: "/admin/products",
    icon: "Package",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER"],
  },
  {
    title: "مدیریت سفارش‌ها",
    href: "/admin/orders",
    icon: "ShoppingCart",
    allowedRoles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
  },
  {
    title: "مدیریت کاربران",
    href: "/admin/users",
    icon: "Users",
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    title: "تنظیمات سیستم",
    href: "/admin/settings",
    icon: "Settings",
    allowedRoles: ["SUPER_ADMIN", "ADMIN"],
  },
] as const;

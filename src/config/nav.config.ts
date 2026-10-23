export interface NavItem {
  title: string;
  href: string;
}

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

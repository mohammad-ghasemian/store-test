import { Header } from "@/components/layout/Headr";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {/* فوتر فروشگاه هم بعداً دقیقاً اینجا اضافه می‌شود */}
    </div>
  );
}

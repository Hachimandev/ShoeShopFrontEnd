"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Settings, Users, Box, UserCog, Truck, LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const linkActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    { name: "Thống kê", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/admin", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Nhà cung cấp", href: "/admin/suppliers", icon: Truck },
    { name: "Khách hàng", href: "/admin/customers", icon: Users },
    { name: "Nhân viên", href: "/admin/employees", icon: UserCog },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = linkActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-medium"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-gray-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";
import Link from "next/link";
import {
  ShoppingBag,
  User,
  LogOut,
  Settings,
  ShoppingCart,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart.context";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    username?: string;
    fullName?: string;
    role?: string;
  } | null>(null);
  const { cart } = useCart();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedRoles = localStorage.getItem("roles");

      setIsLoggedIn(!!token);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (storedRoles) {
          try {
            const rolesArray = JSON.parse(storedRoles);
            if (Array.isArray(rolesArray) && rolesArray.length > 0) {
              parsedUser.role = rolesArray[0];
            }
          } catch (e) {}
        }
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Lắng nghe sự kiện storage để cập nhật khi localStorage thay đổi (ví dụ từ tab khác hoặc cùng tab)
    window.addEventListener("storage", checkAuth);
    // Lắng nghe sự kiện custom "auth-change" để cập nhật ngay lập tức trong cùng tab
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  };

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <Link
        className="flex items-center justify-center font-bold text-2xl tracking-tighter"
        href="/"
      >
        <ShoppingBag className="mr-2 h-6 w-6" />
        <span>SHOE SHOP</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          className="text-base font-bold hover:text-primary transition-colors underline-offset-4"
          href="/products"
        >
          Product
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          New Arrivals
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="#"
        >
          Sales
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1 rounded-full hover:no-underline hover:shadow-lg transition-all"
          href="/ai-chat"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Chat</span>
        </Link>

        {/* Giỏ hàng */}
        <Link href="/cart" className="relative group p-2">
          <ShoppingCart className="h-6 w-6 group-hover:text-primary transition-colors" />
          {cart.totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-bold">
              {cart.totalItems}
            </Badge>
          )}
        </Link>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user?.username || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {(user?.fullName || user?.username || "U")
                      .substring(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    @{user?.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.role?.includes("ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="cursor-pointer w-full flex items-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="cursor-pointer w-full flex items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer w-full flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            variant="default"
            className="rounded-full px-6 font-bold"
          >
            <Link href="/auth/login">Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}

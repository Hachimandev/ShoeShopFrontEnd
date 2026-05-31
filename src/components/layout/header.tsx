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
          } catch (e) { }
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
    <header className="px-6 h-18 flex items-center border-b border-slate-100/80 sticky top-0 bg-white/75 backdrop-blur-xl z-50 transition-all duration-300">
      <Link
        className="flex items-center justify-center gap-2 group"
        href="/"
      >
        <div className="bg-primary text-white p-2 rounded-2xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
          SHOE SHOP
        </span>
      </Link>
      <nav className="ml-auto flex gap-6 sm:gap-8 items-center">
        <Link
          className="text-sm font-bold text-slate-600 hover:text-primary transition-all relative py-1 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all"
          href="/products"
        >
          Products
        </Link>
        <Link
          className="text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-primary to-indigo-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:shadow-primary/10 hover:scale-105 active:scale-95 transition-all duration-300"
          href="/ai-chat"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Chat</span>
        </Link>

        {/* Giỏ hàng */}
        <Link href="/cart" className="relative group p-2 rounded-full hover:bg-slate-50 transition-colors duration-200">
          <ShoppingCart className="h-5 w-5 text-slate-600 group-hover:text-primary transition-colors" />
          {cart.totalItems > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 flex items-center justify-center p-0 text-[9px] font-black bg-primary text-white border-2 border-white animate-pulse">
              {cart.totalItems}
            </Badge>
          )}
        </Link>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border border-slate-100 hover:scale-105 active:scale-95 transition-transform"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user?.username || "User"} />
                  <AvatarFallback className="bg-gradient-to-tr from-primary to-indigo-600 text-white font-black">
                    {(user?.fullName || user?.username || "U")
                      .substring(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 border border-slate-100/80 shadow-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-2.5 py-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-slate-800 leading-none">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs leading-none text-slate-400">
                    @{user?.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1.5" />
              {user?.role?.includes("ADMIN") && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="cursor-pointer w-full flex items-center px-2.5 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    <LayoutDashboard className="mr-2.5 h-4 w-4 text-slate-500" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="cursor-pointer w-full flex items-center px-2.5 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <User className="mr-2.5 h-4 w-4 text-slate-500" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer w-full flex items-center px-2.5 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <Settings className="mr-2.5 h-4 w-4 text-slate-500" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                className="text-rose-600 cursor-pointer focus:bg-rose-50 focus:text-rose-600 px-2.5 py-2 rounded-xl text-sm font-medium transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="mr-2.5 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            variant="default"
            className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
          >
            <Link href="/auth/login">Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}

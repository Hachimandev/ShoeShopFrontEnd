'use client';
import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <Link
        className="flex items-center justify-center font-bold text-2xl tracking-tighter"
        href="/"
      >
        <ShoppingBag className="mr-2 h-6 w-6" />
        <span>SHOESHOP</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/products"
        >
          Collection
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
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-muted-foreground hover:text-primary">
              <User className="h-5 w-5" />
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/auth/login"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}


"use client";

import Link from "next/link";
import { User, Package, Heart, LogOut, Camera, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ProfileNavKey = "profile" | "orders" | "wishlist" | "settings";

export interface ProfileCardProps {
  user: {
    username?: string;
    fullName?: string;
    role?: string;
  };
  onLogout: () => void;
  activeNav?: ProfileNavKey;
}

export function ProfileCard({
  user,
  onLogout,
  activeNav = "profile",
}: ProfileCardProps) {
  const displayName = user.fullName || user.username || "User";
  const initials = displayName.substring(0, 1).toUpperCase();

  return (
    <Card className="overflow-hidden border border-slate-100 dark:border-slate-850 shadow-xl bg-gradient-to-b from-primary/5 to-card dark:to-slate-900/40">
      <CardContent className="pt-10 pb-8 flex flex-col items-center">
        <div className="relative mb-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
            <AvatarImage src="" />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg border-2 border-white"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        <h2 className="text-2xl font-black tracking-tight">{displayName}</h2>
        <p className="text-muted-foreground font-medium mb-4">
          @{user.username}
        </p>

        <Badge
          variant="secondary"
          className="px-4 py-1 rounded-full font-bold uppercase tracking-wider"
        >
          {user.role || "Customer"}
        </Badge>
      </CardContent>

      <Separator />

      <CardContent className="p-0">
        <nav className="flex flex-col">
          <Link
            href="/profile"
            className={cn(
              "flex items-center gap-3 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40",
              activeNav === "profile"
                ? "border-l-4 border-primary font-bold text-primary"
                : "border-l-4 border-transparent font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
            )}
          >
            <User className="h-5 w-5" />
            Thông tin tài khoản
          </Link>
          <Link
            href="/profile/orders"
            className={cn(
              "flex items-center gap-3 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40",
              activeNav === "orders"
                ? "border-l-4 border-primary font-bold text-primary"
                : "border-l-4 border-transparent font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
            )}
          >
            <Package className="h-5 w-5" />
            Đơn hàng của tôi
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40",
              activeNav === "settings"
                ? "border-l-4 border-primary font-bold text-primary"
                : "border-l-4 border-transparent font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
            )}
          >
            <Settings className="h-5 w-5" />
            Cài đặt
          </Link>
          <span className="flex cursor-not-allowed items-center gap-3 px-6 py-4 font-medium text-slate-400 dark:text-slate-500">
            <Heart className="h-5 w-5" />
            Yêu thích
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-6 py-4 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-rose-600 font-medium"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </nav>
      </CardContent>
    </Card>
  );
}

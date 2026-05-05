"use client";

import { User, Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { UserInfo } from "@/types/auth";

interface ProfileHeaderProps {
  userInfo: UserInfo | null;
  onLogout: () => void;
}

export function ProfileHeader({ userInfo, onLogout }: ProfileHeaderProps) {
  if (!userInfo) return null;

  const fullName = userInfo.customer?.fullName || userInfo.username || "User";
  const initials = fullName.substring(0, 1).toUpperCase();

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-b from-blue-50 to-white">
      <CardContent className="pt-10 pb-8 flex flex-col items-center">
        <div className="relative mb-6">
          <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
            <AvatarImage src="" />
            <AvatarFallback className="text-4xl bg-blue-600 text-white">
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
        <h2 className="text-2xl font-black tracking-tight">{fullName}</h2>
        <p className="text-muted-foreground font-medium mb-4">
          @{userInfo.username}
        </p>
        <Badge
          variant="secondary"
          className="px-4 py-1 rounded-full font-bold uppercase tracking-wider"
        >
          {userInfo.roles?.[0] || "Customer"}
        </Badge>
      </CardContent>
      <Separator />
      <CardContent className="p-0">
        <nav className="flex flex-col">
          <Link href="/profile" className="w-full">
            <button className="w-full flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors text-blue-600 font-bold border-l-4 border-blue-600">
              <User className="h-5 w-5" />
              Profile Information
            </button>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-rose-50 transition-colors text-rose-600 font-medium"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </nav>
      </CardContent>
    </Card>
  );
}

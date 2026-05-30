"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profile/profile-card";
import { MyOrdersPanel } from "@/components/profile/my-orders-panel";

export default function ProfileOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username?: string;
    fullName?: string;
    role?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed?.username) {
        setUser(null);
        return;
      }
      setUser({
        username: parsed.username,
        fullName: parsed.fullName || parsed.username,
        role: parsed.role || "Customer",
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4">
        <p className="mb-4 text-center text-slate-600">
          Vui lòng đăng nhập để xem đơn hàng.
        </p>
        <Button onClick={() => router.push("/auth/login")}>Đăng nhập</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileCard
            user={user}
            onLogout={handleLogout}
            activeNav="orders"
          />
        </div>
        <div className="lg:col-span-2">
          <MyOrdersPanel />
        </div>
      </div>
    </div>
  );
}

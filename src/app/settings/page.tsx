"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Sun, Moon, Type, Bell, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProfileCard } from "@/components/profile/profile-card";
import { customerService } from "@/services/customer.service";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    role?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Password state
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPass, setIsChangingPass] = useState(false);

  // UI preferences state
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [primaryColor, setPrimaryColor] = useState<string>("indigo");

  // Notifications state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });

  // Language state
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  useEffect(() => {
    // Load user data
    const loadUserData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        try {
          const customerInfo = await customerService.getCustomer(username);
          const userData = {
            username: username,
            fullName: customerInfo.fullName || "User Profile",
            email: customerInfo.email || "Not provided",
            phone: customerInfo.phoneNumber || "Not provided",
            address: customerInfo.address || "Not provided",
            role: localStorage.getItem("roles")
              ? JSON.parse(localStorage.getItem("roles") || "[]")[0]
              : "Customer",
          };
          setUser(userData);
        } catch (err) {
          console.error("API error, fallback to local storage:", err);
          const localUser = localStorage.getItem("user");
          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Load preferences from localStorage
    if (typeof window !== "undefined") {
      const storedTheme = (localStorage.getItem("app-theme") || "light") as "light" | "dark";
      const storedFontSize = (localStorage.getItem("app-font-size") || "medium") as "small" | "medium" | "large";
      const storedPrimary = localStorage.getItem("app-primary-color") || "indigo";
      const storedLang = (localStorage.getItem("app-lang") || "vi") as "vi" | "en";

      setTheme(storedTheme);
      setFontSize(storedFontSize);
      setPrimaryColor(storedPrimary);
      setLanguage(storedLang);

      const storedNotifs = localStorage.getItem("app-notifications");
      if (storedNotifs) {
        try {
          setNotifications(JSON.parse(storedNotifs));
        } catch (e) { }
      }
    }

    loadUserData();
    window.addEventListener("auth-change", loadUserData);
    return () => window.removeEventListener("auth-change", loadUserData);
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push("/");
  };

  // Change password handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) {
      toast.error("Không tìm thấy thông tin tài khoản.");
      return;
    }

    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các thông tin mật khẩu.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }

    setIsChangingPass(true);
    try {
      await authService.changePassword(user.username, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success("Đổi mật khẩu thành công! Hệ thống sẽ đăng xuất sau 1.5 giây.");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });

      // Clear auth and redirect after 1.5s
      setTimeout(() => {
        authService.logout();
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.";
      toast.error(errMsg);
    } finally {
      setIsChangingPass(false);
    }
  };

  // Theme changer
  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("app-theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    toast.success(`Đã chuyển sang giao diện ${newTheme === "dark" ? "Tối" : "Sáng"}`);
  };

  // Font size changer
  const changeFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    localStorage.setItem("app-font-size", size);

    if (size === "small") {
      document.documentElement.style.fontSize = "14px";
    } else if (size === "large") {
      document.documentElement.style.fontSize = "18px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }
    toast.success(`Đã đổi cỡ chữ sang: ${size === "small" ? "Nhỏ" : size === "large" ? "Lớn" : "Trung bình"}`);
  };

  // Primary color theme changer
  const selectPrimaryColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("app-primary-color", color);
    toast.success(`Đã đổi tông màu chủ đạo sang: ${color.toUpperCase()}`);
  };

  // Language changer
  const changeLanguage = (lang: "vi" | "en") => {
    setLanguage(lang);
    localStorage.setItem("app-lang", lang);
    toast.success(`Đã đổi ngôn ngữ hiển thị sang: ${lang === "vi" ? "Tiếng Việt" : "English"}`);
  };

  // Notifications toggler
  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updated);
    localStorage.setItem("app-notifications", JSON.stringify(updated));
    toast.success("Đã cập nhật tùy chọn nhận thông báo.");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
        <p className="text-muted-foreground">Đang tải cài đặt...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Bạn chưa đăng nhập</h2>
        <Button onClick={() => router.push("/auth/login")}>Đi đến đăng nhập</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileCard
            user={user}
            onLogout={handleLogout}
            activeNav="settings"
          />
        </div>

        {/* Right Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h1 className="text-3xl font-black tracking-tight">Cài đặt tài khoản</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý mật khẩu bảo mật, tùy chỉnh giao diện hiển thị và nhận thông báo của bạn.
            </p>
          </div>

          {/* Theme & Display Settings */}
          <Card className="border-none shadow-lg dark:bg-slate-900/60 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                Giao diện & Hiển thị
              </CardTitle>
              <CardDescription>
                Tùy chỉnh tông màu nền sáng/tối và kích thước phông chữ hiển thị.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark/Light mode */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-50 dark:border-slate-800/80">
                <div>
                  <h4 className="font-semibold text-sm">Chế độ hiển thị</h4>
                  <p className="text-xs text-muted-foreground">Chọn giữa phông nền sáng hoặc tối.</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex items-center gap-2 rounded-xl"
                    onClick={() => toggleTheme("light")}
                  >
                    <Sun className="h-4 w-4" /> Sáng
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex items-center gap-2 rounded-xl"
                    onClick={() => toggleTheme("dark")}
                  >
                    <Moon className="h-4 w-4" /> Tối
                  </Button>
                </div>
              </div>

              {/* Font sizes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-50 dark:border-slate-800/80">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <Type className="h-4 w-4 text-slate-500" /> Kích thước chữ
                  </h4>
                  <p className="text-xs text-muted-foreground">Điều chỉnh kích thước phông chữ trên toàn trang web.</p>
                </div>
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => changeFontSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${fontSize === size
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                    >
                      {size === "small" ? "Nhỏ" : size === "large" ? "Lớn" : "Vừa"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Primary Colors */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div>
                  <h4 className="font-semibold text-sm">Tông màu chính</h4>
                  <p className="text-xs text-muted-foreground">Chọn màu sắc chủ đạo của các nút và đường viền chính.</p>
                </div>
                <div className="flex gap-2">
                  {[
                    { key: "indigo", color: "bg-indigo-600" },
                    { key: "blue", color: "bg-blue-600" },
                    { key: "emerald", color: "bg-emerald-600" },
                    { key: "rose", color: "bg-rose-600" },
                    { key: "violet", color: "bg-violet-600" },
                  ].map((colorObj) => (
                    <button
                      key={colorObj.key}
                      onClick={() => selectPrimaryColor(colorObj.key)}
                      className={`h-7 w-7 rounded-full transition-transform active:scale-90 ${colorObj.color} ${primaryColor === colorObj.key
                          ? "ring-4 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900"
                          : "hover:scale-110"
                        }`}
                      title={colorObj.key}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Settings */}
          <Card className="border-none shadow-lg dark:bg-slate-900/60 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                Mật khẩu & Bảo mật
              </CardTitle>
              <CardDescription>
                Thay đổi mật khẩu tài khoản của bạn. Sau khi đổi thành công, bạn cần đăng nhập lại.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Mật khẩu hiện tại
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-xl dark:bg-slate-800 dark:border-slate-700"
                    value={passwords.oldPassword}
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl dark:bg-slate-800 dark:border-slate-700"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      Xác nhận mật khẩu mới
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl dark:bg-slate-800 dark:border-slate-700"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isChangingPass} className="rounded-xl font-bold px-6 shadow-md">
                    {isChangingPass ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật mật khẩu"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Notifications & Language Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Card */}
            <Card className="border-none shadow-lg dark:bg-slate-900/60 dark:border dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-500" />
                  Cấu hình Thông báo
                </CardTitle>
                <CardDescription>Chọn cách thức và thời điểm nhận thông tin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Updates */}
                <div className="flex items-start justify-between gap-3 py-1">
                  <div>
                    <h5 className="text-sm font-semibold">Cập nhật đơn hàng</h5>
                    <p className="text-xs text-muted-foreground">Nhận email khi trạng thái đơn hàng thay đổi.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.orderUpdates}
                    onChange={() => toggleNotification("orderUpdates")}
                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-primary accent-primary"
                  />
                </div>

                {/* Promotions */}
                <div className="flex items-start justify-between gap-3 py-1 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                  <div>
                    <h5 className="text-sm font-semibold">Khuyến mãi & Tin tức</h5>
                    <p className="text-xs text-muted-foreground">Nhận tin nhắn về các chương trình ưu đãi mới.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.promotions}
                    onChange={() => toggleNotification("promotions")}
                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-primary accent-primary"
                  />
                </div>

                {/* Newsletter */}
                <div className="flex items-start justify-between gap-3 py-1 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                  <div>
                    <h5 className="text-sm font-semibold">Bản tin thời trang</h5>
                    <p className="text-xs text-muted-foreground">Xu hướng thời trang hàng tuần và cập nhật giày mới.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.newsletter}
                    onChange={() => toggleNotification("newsletter")}
                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-primary accent-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language Selection */}
            <Card className="border-none shadow-lg dark:bg-slate-900/60 dark:border dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Languages className="h-5 w-5 text-indigo-500" />
                  Ngôn ngữ hiển thị
                </CardTitle>
                <CardDescription>Thay đổi ngôn ngữ dịch thuật của giao diện.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button
                    variant={language === "vi" ? "default" : "outline"}
                    className="w-full justify-between rounded-xl px-4 py-5"
                    onClick={() => changeLanguage("vi")}
                  >
                    <span>Tiếng Việt</span>
                    {language === "vi" && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                  </Button>
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    className="w-full justify-between rounded-xl px-4 py-5"
                    onClick={() => changeLanguage("en")}
                  >
                    <span>English</span>
                    {language === "en" && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Sun, Moon, Type, Bell, Languages, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("ROLE_ADMIN");
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

  // Admin notification preferences
  const [adminNotifs, setAdminNotifs] = useState({
    newOrders: true,
    outOfStock: true,
    systemLogs: false,
  });

  // Language state
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  useEffect(() => {
    // Get admin details
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      } else if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUsername(parsed.username || "admin");
        } catch (e) {}
      }

      const roles = localStorage.getItem("roles");
      if (roles) {
        try {
          const parsedRoles = JSON.parse(roles);
          setRole(parsedRoles[0] || "ROLE_ADMIN");
        } catch (e) {}
      }

      // Load settings
      const storedTheme = (localStorage.getItem("app-theme") || "light") as "light" | "dark";
      const storedFontSize = (localStorage.getItem("app-font-size") || "medium") as "small" | "medium" | "large";
      const storedPrimary = localStorage.getItem("app-primary-color") || "indigo";
      const storedLang = (localStorage.getItem("app-lang") || "vi") as "vi" | "en";

      setTheme(storedTheme);
      setFontSize(storedFontSize);
      setPrimaryColor(storedPrimary);
      setLanguage(storedLang);

      const storedAdminNotifs = localStorage.getItem("admin-notifications");
      if (storedAdminNotifs) {
        try {
          setAdminNotifs(JSON.parse(storedAdminNotifs));
        } catch (e) {}
      }
    }
    setIsLoading(false);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error("Không tìm thấy thông tin tài khoản admin.");
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
      await authService.changePassword(username, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });

      toast.success("Thay đổi mật khẩu quản trị viên thành công! Sẽ đăng xuất sau 1.5 giây.");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });

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

  const selectPrimaryColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem("app-primary-color", color);
    toast.success(`Đã đổi màu chủ đạo hệ thống sang: ${color.toUpperCase()}`);
  };

  const changeLanguage = (lang: "vi" | "en") => {
    setLanguage(lang);
    localStorage.setItem("app-lang", lang);
    toast.success(`Đã đổi ngôn ngữ quản trị sang: ${lang === "vi" ? "Tiếng Việt" : "English"}`);
  };

  const toggleAdminNotification = (key: keyof typeof adminNotifs) => {
    const updated = {
      ...adminNotifs,
      [key]: !adminNotifs[key],
    };
    setAdminNotifs(updated);
    localStorage.setItem("admin-notifications", JSON.stringify(updated));
    toast.success("Đã cập nhật cấu hình thông báo quản trị viên.");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] text-slate-600">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm mt-2">Đang tải cài đặt quản trị viên...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Cài đặt hệ thống & Quản trị viên
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Tùy chỉnh các cài đặt giao diện điều khiển, bảo mật tài khoản admin và nhận thông báo quản trị.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General Profile Card Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Thông tin phiên làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tên tài khoản</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">@{username || "admin"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Vai trò phân quyền</p>
                <span className="inline-flex mt-1 items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {role}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors */}
          <Card className="border-none shadow-md bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Màu chủ đạo hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
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
                  className={`h-8 w-8 rounded-full transition-transform active:scale-90 ${colorObj.color} ${
                    primaryColor === colorObj.key
                      ? "ring-4 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900"
                      : "hover:scale-110"
                  }`}
                  title={colorObj.key}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Detailed Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance Settings */}
          <Card className="border-none shadow-md bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                Thiết lập Giao diện Admin
              </CardTitle>
              <CardDescription>Cấu hình phông nền sáng/tối và cỡ chữ của trang quản lý.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sáng tối */}
              <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 dark:border-slate-800/80">
                <div>
                  <h4 className="font-semibold text-sm">Chế độ giao diện</h4>
                  <p className="text-xs text-muted-foreground">Chuyển đổi giao diện sáng hoặc tối cho Dashboard.</p>
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

              {/* Cỡ chữ */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-1.5">
                    <Type className="h-4 w-4 text-slate-500" /> Kích thước chữ
                  </h4>
                  <p className="text-xs text-muted-foreground">Điều chỉnh cỡ chữ của bảng và biểu đồ.</p>
                </div>
                <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => changeFontSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        fontSize === size
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                      }`}
                    >
                      {size === "small" ? "Nhỏ" : size === "large" ? "Lớn" : "Vừa"}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="border-none shadow-md bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                Mật khẩu & Bảo mật Admin
              </CardTitle>
              <CardDescription>Đổi mật khẩu tài khoản quản trị viên. Thành công sẽ yêu cầu đăng nhập lại.</CardDescription>
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
                  <Button type="submit" disabled={isChangingPass} className="rounded-xl font-bold px-6">
                    {isChangingPass ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang cập nhật...
                      </>
                    ) : (
                      "Cập nhật mật khẩu admin"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Admin Notifications & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-indigo-500" />
                  Thông báo Hệ thống
                </CardTitle>
                <CardDescription>Thiết lập thông báo vận hành của admin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* New Orders */}
                <div className="flex items-start justify-between gap-3 py-1">
                  <div>
                    <h5 className="text-sm font-semibold">Đơn đặt hàng mới</h5>
                    <p className="text-xs text-muted-foreground">Thông báo ngay khi có khách hàng tạo đơn mới.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminNotifs.newOrders}
                    onChange={() => toggleAdminNotification("newOrders")}
                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 accent-indigo-600"
                  />
                </div>

                {/* Out of Stock */}
                <div className="flex items-start justify-between gap-3 py-1 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                  <div>
                    <h5 className="text-sm font-semibold">Cảnh báo hết hàng</h5>
                    <p className="text-xs text-muted-foreground">Cảnh báo khi số lượng sản phẩm trong kho xuống dưới 5.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminNotifs.outOfStock}
                    onChange={() => toggleAdminNotification("outOfStock")}
                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 accent-indigo-600"
                  />
                </div>

                {/* System Logs */}
                <div className="flex items-start justify-between gap-3 py-1 border-t border-slate-50 dark:border-slate-800/80 pt-3">
                  <div>
                    <h5 className="text-sm font-semibold">Báo cáo hệ thống</h5>
                    <p className="text-xs text-muted-foreground">Gửi báo cáo lỗi và nhật ký hệ thống định kỳ.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={adminNotifs.systemLogs}
                    onChange={() => toggleAdminNotification("systemLogs")}
                    className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 accent-indigo-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white dark:bg-slate-900/60 dark:border dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Languages className="h-5 w-5 text-indigo-500" />
                  Ngôn ngữ trang Quản trị
                </CardTitle>
                <CardDescription>Thay đổi ngôn ngữ hiển thị Dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button
                    variant={language === "vi" ? "default" : "outline"}
                    className="w-full justify-between rounded-xl px-4 py-5"
                    onClick={() => changeLanguage("vi")}
                  >
                    <span>Tiếng Việt (VI)</span>
                    {language === "vi" && <span className="h-2 w-2 rounded-full bg-emerald-400" />}
                  </Button>
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    className="w-full justify-between rounded-xl px-4 py-5"
                    onClick={() => changeLanguage("en")}
                  >
                    <span>English (EN)</span>
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

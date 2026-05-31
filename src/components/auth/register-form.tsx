"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Timer, ArrowLeft, RefreshCw } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Timers
  const [otpTimeLeft, setOtpTimeLeft] = useState(60);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(300);

  const router = useRouter();

  // Ref to store intervals so we can clean them up cleanly
  const otpTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // OTP Timer countdown
  useEffect(() => {
    if (step === 2) {
      setOtpTimeLeft(60);
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
      otpTimerRef.current = setInterval(() => {
        setOtpTimeLeft((prev) => {
          if (prev <= 1) {
            if (otpTimerRef.current) clearInterval(otpTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    }
    return () => {
      if (otpTimerRef.current) clearInterval(otpTimerRef.current);
    };
  }, [step]);

  // Session Timer countdown
  useEffect(() => {
    if (step === 3) {
      setSessionTimeLeft(300);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = setInterval(() => {
        setSessionTimeLeft((prev) => {
          if (prev <= 1) {
            if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
            // Session expired!
            setError("Phiên đăng ký đã hết hạn. Vui lòng xác thực lại email.");
            setStep(1);
            setOtp("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    setLoading(true);
    try {
      await authService.sendOtp(email);
      setSuccess("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
      setOtp("");
    } catch (err: any) {
      setError(err?.response?.data || "Không thể gửi OTP. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!otp) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }
    setLoading(true);
    try {
      await authService.verifyOtp(email, otp);
      setSuccess("Xác thực email thành công! Vui lòng điền thông tin đăng ký.");
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !username || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có độ dài tối thiểu 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username,
        email,
        password,
        confirmPassword,
        fullName,
      });

      if (response === "Registered") {
        setSuccess("Đăng ký tài khoản thành công! Đang chuyển hướng...");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        setError(response);
      }
    } catch (err: any) {
      setError(err?.response?.data || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn("flex flex-col gap-4 max-w-5xl mx-auto w-full", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">

          {/* Form container */}
          <div className="p-6 md:p-8 flex flex-col justify-center bg-card">

            {/* Step 1: Input Email */}
            {step === 1 && (
              <form className="space-y-4" onSubmit={handleSendOtp}>
                <FieldGroup className="gap-4">
                  <div className="flex flex-col items-center gap-2 text-center mb-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Đăng ký tài khoản</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      Nhập email của bạn để nhận mã xác thực OTP
                    </p>
                  </div>

                  {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-200">{error}</p>}
                  {success && <p className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded border border-green-200">{success}</p>}

                  <Field className="space-y-1">
                    <FieldLabel htmlFor="email" className="text-sm font-medium">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      required
                      className="h-10 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>

                  <Field className="pt-1">
                    <Button type="submit" className="w-full h-10 text-base" disabled={loading}>
                      {loading ? "Đang gửi mã..." : "Gửi mã OTP"}
                    </Button>
                  </Field>

                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card py-2 text-xs font-medium">
                    Hoặc tiếp tục với
                  </FieldSeparator>

                  {/* Apple, Google, Meta OAuth Placeholder */}
                  <Field className="grid grid-cols-3 gap-3">
                    <Button variant="outline" type="button" className="h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
                      </svg>
                    </Button>
                    <Button variant="outline" type="button" className="h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                      </svg>
                    </Button>
                    <Button variant="outline" type="button" className="h-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor" />
                      </svg>
                    </Button>
                  </Field>

                  <FieldDescription className="text-center text-sm">
                    Đã có tài khoản?{" "}
                    <a href="/auth/login" className="font-semibold underline underline-offset-4 text-primary">
                      Đăng nhập
                    </a>
                  </FieldDescription>
                </FieldGroup>
              </form>
            )}

            {/* Step 2: Input OTP */}
            {step === 2 && (
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <FieldGroup className="gap-4">
                  <div className="flex flex-col items-center gap-2 text-center mb-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Xác thực OTP</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      Mã OTP đã được gửi đến email <strong className="text-foreground">{email}</strong>
                    </p>
                  </div>

                  {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-200">{error}</p>}
                  {success && <p className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded border border-green-200">{success}</p>}

                  <Field className="space-y-1">
                    <div className="flex justify-between items-center">
                      <FieldLabel htmlFor="otp" className="text-sm font-medium">Mã OTP (6 chữ số)</FieldLabel>
                      <div className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Timer className="h-3 w-3 mr-1" />
                        <span>Hết hạn sau {otpTimeLeft}s</span>
                      </div>
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      required
                      className="h-10 text-sm tracking-[0.5em] text-center font-bold"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>

                  <Field className="pt-1 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/3 h-10"
                      onClick={() => {
                        setStep(1);
                        setError("");
                        setSuccess("");
                      }}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
                    </Button>
                    <Button type="submit" className="w-2/3 h-10 text-base" disabled={loading || otpTimeLeft === 0}>
                      {loading ? "Đang xác thực..." : "Xác thực"}
                    </Button>
                  </Field>

                  {otpTimeLeft === 0 && (
                    <div className="text-center text-sm">
                      <p className="text-muted-foreground mb-2">Mã OTP đã hết hạn.</p>
                      <Button
                        type="button"
                        variant="link"
                        className="text-primary font-semibold h-auto p-0 flex items-center mx-auto"
                        onClick={handleSendOtp}
                        disabled={loading}
                      >
                        <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} /> Gửi lại mã OTP
                      </Button>
                    </div>
                  )}
                </FieldGroup>
              </form>
            )}

            {/* Step 3: Complete Register Form */}
            {step === 3 && (
              <form className="space-y-4" onSubmit={handleCompleteRegister}>
                <FieldGroup className="gap-4">
                  <div className="flex flex-col items-center gap-2 text-center mb-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Hoàn tất đăng ký</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      Điền các thông tin dưới đây để tạo tài khoản mới
                    </p>
                    <div className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200 mt-1">
                      <Timer className="h-3.5 w-3.5 mr-1 animate-pulse" />
                      <span>Hoàn thành trước: {formatTime(sessionTimeLeft)}</span>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded border border-red-200">{error}</p>}
                  {success && <p className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded border border-green-200">{success}</p>}

                  {/* Email (Readonly) */}
                  <Field className="space-y-1">
                    <FieldLabel className="text-sm font-medium text-muted-foreground">Email (Đã xác thực)</FieldLabel>
                    <Input
                      type="text"
                      className="h-10 text-sm bg-muted text-muted-foreground cursor-not-allowed"
                      value={email}
                      disabled
                    />
                  </Field>

                  {/* Full Name */}
                  <Field className="space-y-1">
                    <FieldLabel htmlFor="fullName" className="text-sm font-medium">Họ và tên</FieldLabel>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      required
                      className="h-10 text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Field>

                  {/* Username */}
                  <Field className="space-y-1">
                    <FieldLabel htmlFor="username" className="text-sm font-medium">Tên đăng nhập</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username123"
                      required
                      className="h-10 text-sm"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Field>

                  {/* Password */}
                  <Field className="space-y-1">
                    <FieldLabel htmlFor="password" className="text-sm font-medium">Mật khẩu (tối thiểu 8 ký tự)</FieldLabel>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="h-10 text-sm pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Field>

                  {/* Confirm Password */}
                  <Field className="space-y-1">
                    <FieldLabel htmlFor="confirmPassword" className="text-sm font-medium">Xác nhận mật khẩu</FieldLabel>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="h-10 text-sm pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </Field>

                  <Field className="pt-1 flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/3 h-10"
                      onClick={() => {
                        setStep(1);
                        setError("");
                        setSuccess("");
                      }}
                      disabled={loading}
                    >
                      Hủy bỏ
                    </Button>
                    <Button type="submit" className="w-2/3 h-10 text-base" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

          </div>

          {/* Picture container */}
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/login_picture.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              height={1000}
              width={1000}
              priority
            />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

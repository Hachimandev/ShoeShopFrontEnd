"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail, CheckCircle2, ShieldAlert, ArrowLeft, Loader2, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Handle countdown for OTP step
  useEffect(() => {
    if (step === 2 && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [step, countdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPasswordSendOtp(email);
      setCountdown(60);
      setStep(2);
    } catch (err: any) {
      setError(
        err.response?.data || "Không thể gửi OTP. Vui lòng kiểm tra lại email."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.forgotPasswordSendOtp(email);
      setCountdown(60);
    } catch (err: any) {
      setError(
        err.response?.data || "Không thể gửi lại OTP. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPasswordVerifyOtp(email, otp);
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data || "Mã OTP không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Mật khẩu mới phải có tối thiểu 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPasswordResetPassword({
        email,
        password,
        confirmPassword,
      });
      setStep(4);
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50/50 min-h-[85vh] p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-primary/5 bg-white/90 backdrop-blur-xl">
          <CardContent className="p-8 md:p-10">
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="flex flex-col items-center gap-3 text-center mb-6">
                  <div className="bg-primary/5 p-4 rounded-2xl text-primary mb-1">
                    <KeyRound className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Quên mật khẩu?
                  </h1>
                  <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                    Nhập email đã đăng ký. Chúng tôi sẽ gửi mã OTP để phục hồi tài khoản của bạn.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold leading-relaxed">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <FieldGroup className="gap-5">
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Địa chỉ Email
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        required
                        className="h-12 pl-10 text-sm font-medium rounded-xl border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </Field>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Đang gửi mã...
                      </>
                    ) : (
                      "Gửi mã xác thực (OTP)"
                    )}
                  </Button>
                </FieldGroup>

                <div className="pt-4 border-t border-slate-50 text-center">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center text-xs font-black tracking-widest text-slate-400 hover:text-primary transition-colors uppercase gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Quay lại Đăng nhập
                  </Link>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex flex-col items-center gap-3 text-center mb-6">
                  <div className="bg-primary/5 p-4 rounded-2xl text-primary mb-1">
                    <Mail className="h-8 w-8 animate-bounce" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Xác thực mã OTP
                  </h1>
                  <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                    Mã xác thực đã được gửi tới <strong className="text-slate-800 font-bold">{email}</strong>.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold leading-relaxed">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <FieldGroup className="gap-5">
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor="otp" className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Mã OTP (6 chữ số)
                    </FieldLabel>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="• • • • • •"
                      maxLength={6}
                      required
                      className="h-12 text-center text-xl font-bold tracking-[0.5em] pl-4 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </Field>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    disabled={loading || !otp || otp.length < 6}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Đang xác thực...
                      </>
                    ) : (
                      "Xác nhận mã OTP"
                    )}
                  </Button>
                </FieldGroup>

                <div className="text-center pt-2">
                  {countdown > 0 ? (
                    <p className="text-xs font-bold text-slate-400">
                      Gửi lại mã sau <span className="text-primary font-black">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-xs font-black uppercase tracking-wider text-primary hover:underline"
                    >
                      Gửi lại mã OTP
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-50 text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center text-xs font-black tracking-widest text-slate-400 hover:text-primary transition-colors uppercase gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Thay đổi Email
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="flex flex-col items-center gap-3 text-center mb-6">
                  <div className="bg-primary/5 p-4 rounded-2xl text-primary mb-1">
                    <KeyRound className="h-8 w-8" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Mật khẩu mới
                  </h1>
                  <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                    Xác thực thành công. Vui lòng thiết lập mật khẩu mới cho tài khoản của bạn.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold leading-relaxed">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <FieldGroup className="gap-5">
                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor="password" className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Mật khẩu mới
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tối thiểu 8 ký tự"
                      required
                      className="h-12 text-sm font-medium rounded-xl border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>

                  <Field className="space-y-1.5">
                    <FieldLabel htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      className="h-12 text-sm font-medium rounded-xl border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Field>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Đang đặt lại...
                      </>
                    ) : (
                      "Đặt lại mật khẩu"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            )}

            {step === 4 && (
              <div className="space-y-6 py-4 flex flex-col items-center text-center">
                <div className="bg-emerald-50 text-emerald-500 p-5 rounded-full mb-1 animate-pulse border border-emerald-100">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                    Thành công!
                  </h1>
                  <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                    Mật khẩu của bạn đã được đặt lại thành công.
                  </p>
                  <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-1">
                    <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
                    Đang tự động chuyển hướng về trang đăng nhập...
                  </p>
                </div>

                <Button
                  className="w-full h-12 text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform mt-4"
                  onClick={() => router.push("/auth/login")}
                >
                  Đăng nhập ngay
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login({ username, password });
      router.push("/"); // Chuyển hướng sau khi đăng nhập thành công
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: string } }).response;
        setError(
          response?.data || "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
        );
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-4 max-w-5xl mx-auto w-full", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0 shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8 space-y-4" onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <div className="flex flex-col items-center gap-2 text-center mb-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-base text-balance text-muted-foreground">
                  Login to your account
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Field className="space-y-1">
                <FieldLabel htmlFor="username" className="text-sm font-medium">
                  Username
                </FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin/user"
                  required
                  className="h-10 text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <Field className="space-y-1">
                <div className="flex items-center">
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-xs underline-offset-2 hover:underline font-medium"
                  >
                    Forgot your password?
                  </Link>
                </div>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Field>
              <Field className="pt-1">
                <Button
                  type="submit"
                  className="w-full h-10 text-base"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Login"}
                </Button>
              </Field>

              <FieldDescription className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/register"
                  className="font-semibold underline underline-offset-4"
                >
                  Sign up
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>
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
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 font-medium">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 font-medium">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}

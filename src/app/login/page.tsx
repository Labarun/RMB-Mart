"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeftRight,
  LogIn,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        toast.success("Welcome back!");
        // Force a reload to /login so the server middleware automatically routes 
        // the user to either /admin or /dashboard based on their role
        window.location.href = "/login";
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen gradient-hero blob-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2.5 mb-8 group"
        >
          <div className="w-10 h-10 rounded-xl gradient-alipay flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight">
            RMB<span className="text-[var(--alipay-blue)]">mart</span>
          </span>
        </Link>

        {/* Card */}
        <div className="clay p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage your exchange orders
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="clay-input h-11 pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="clay-input h-11 pl-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full clay-button h-11 text-base font-semibold gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--alipay-blue)] font-medium hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

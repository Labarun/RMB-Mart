"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeftRight,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
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
            <h1 className="font-heading text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Start exchanging GHS to RMB in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="register-name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative flex items-center">
                <User className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-name"
                  placeholder="John Doe"
                  className="clay-input h-11 pl-10"
                  {...formRegister("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  className="clay-input h-11 pl-10"
                  {...formRegister("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="register-phone" className="text-sm font-medium">
                Phone Number{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-phone"
                  placeholder="024 XXX XXXX"
                  className="clay-input h-11 pl-10"
                  {...formRegister("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="register-password"
                className="text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="clay-input h-11 pl-10 pr-10"
                  {...formRegister("password")}
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="register-confirm"
                className="text-sm font-medium"
              >
                Confirm Password
              </Label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="register-confirm"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="clay-input h-11 pl-10"
                  {...formRegister("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full clay-button h-11 text-base font-semibold gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--alipay-blue)] font-medium hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Menu,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  userRole?: string;
}

export default function Navbar({ userRole }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-alipay flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <ArrowLeftRight className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            RMB<span className="text-[var(--alipay-blue)]">mart</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/track"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "gap-2 text-muted-foreground hover:text-foreground rounded-xl"
            )}
          >
            <Package className="w-4 h-4" />
            Track Order
          </Link>

          <ThemeToggle />

          {userRole ? (
            <Link
              href={userRole === "ADMIN" ? "/admin" : "/dashboard"}
              className={cn(buttonVariants(), "gap-2 clay-button px-5 font-semibold")}
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "gap-2 text-muted-foreground hover:text-foreground rounded-xl"
                )}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "gap-2 clay-button px-5 font-semibold"
                )}
              >
                <UserPlus className="w-4 h-4" />
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="sm:hidden"
              render={
                <Button variant="ghost" size="icon" className="rounded-xl" />
              }
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-3 mt-8">
                <Link
                  href="/track"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full gap-2 rounded-xl justify-start"
                  )}
                >
                  <Package className="w-4 h-4" />
                  Track Order
                </Link>

                {userRole ? (
                  <Link
                    href={userRole === "ADMIN" ? "/admin" : "/dashboard"}
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "w-full gap-2 clay-button justify-start")}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full gap-2 rounded-xl justify-start"
                      )}
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full gap-2 clay-button justify-start"
                      )}
                    >
                      <UserPlus className="w-4 h-4" />
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

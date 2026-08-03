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

        {/* Universal Nav (Hamburger) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72 p-6 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-3 mt-8">
                <Link
                  href="/track"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full gap-2 rounded-xl justify-start h-11"
                  )}
                >
                  <Package className="w-4 h-4" />
                  Track Order
                </Link>

                {userRole ? (
                  <Link
                    href={userRole === "ADMIN" ? "/admin" : "/dashboard"}
                    onClick={() => setOpen(false)}
                    className={cn(buttonVariants(), "w-full gap-2 clay-button justify-start h-11")}
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
                        "w-full gap-2 rounded-xl justify-start h-11"
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
                        "w-full gap-2 clay-button justify-start h-11"
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

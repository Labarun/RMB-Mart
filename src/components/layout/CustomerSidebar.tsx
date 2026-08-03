"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  LogOut,
  User as UserIcon,
  Menu,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

interface SidebarContentProps {
  userName: string;
  userEmail: string;
  onNavigate?: () => void;
}

const navLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/orders", icon: ListOrdered, label: "Order History" },
  { href: "/orders/new", icon: PlusCircle, label: "New Exchange", highlight: true },
  { href: "/profile", icon: UserIcon, label: "Profile" },
];

function SidebarContent({ userName, userEmail, onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="w-8 h-8 rounded-lg bg-alipay flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            RMB<span className="text-alipay">mart</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href + "/"));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? link.highlight
                    ? "bg-alipay/10 text-alipay"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                  : link.highlight
                    ? "text-alipay hover:bg-alipay/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-4 h-4 text-slate-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </div>
    </>
  );
}

export function CustomerSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header + Sidebar Sheet for all screen sizes */}
      <div className="flex w-full items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl gradient-alipay flex items-center justify-center">
            <ArrowLeftRight className="text-white w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-white">
            RMB<span className="text-alipay">mart</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="rounded-xl text-white hover:bg-slate-800">
                  <Menu className="w-5 h-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-0 bg-slate-950 border-slate-800">
              <SidebarContent userName={userName} userEmail={userEmail} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ShieldCheck,
  Users,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarContentProps {
  userName: string;
  userEmail: string;
  onNavigate?: () => void;
}

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview & Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/settings", icon: Settings, label: "Platform Settings" },
];

function AdminSidebarContent({ userName, userEmail, onNavigate }: AdminSidebarContentProps) {
  const pathname = usePathname();

  return (
    <>
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-white">
            Admin<span className="text-emerald-500">Panel</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 pb-4 space-y-1 mt-4">
        {adminLinks.map((link) => {
          const isActive = link.href === "/admin"
            ? pathname === "/admin"
            : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "text-white bg-slate-800"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 bg-slate-900/50 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">{userName?.charAt(0)}</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
        <Link
          href="/api/auth/signout"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Link>
      </div>
    </>
  );
}

export function AdminSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-950 text-slate-300 flex-shrink-0 flex-col">
        <AdminSidebarContent userName={userName} userEmail={userEmail} />
      </aside>

      {/* Mobile Header + Sidebar Sheet */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-white">
            Admin<span className="text-emerald-500">Panel</span>
          </span>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button variant="ghost" size="icon" className="rounded-xl text-white hover:bg-slate-800">
                <Menu className="w-5 h-5" />
              </Button>
            }
          />
          <SheetContent side="left" className="w-72 p-0 bg-slate-950 border-slate-800">
            <AdminSidebarContent userName={userName} userEmail={userEmail} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, User } from "lucide-react";

interface RoleUpdateActionProps {
  userId: string;
  currentRole: "ADMIN" | "CUSTOMER";
  userName: string;
}

export function RoleUpdateAction({ userId, currentRole, userName }: RoleUpdateActionProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleRoleChange(newRole: string | null) {
    if (!newRole || newRole === currentRole) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/customers/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update role");
      }

      toast.success(`${userName}'s role updated to ${newRole}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Select value={currentRole} onValueChange={handleRoleChange} disabled={isUpdating}>
      <SelectTrigger className="h-8 text-xs bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 w-[120px]">
        <SelectValue placeholder="Select Role" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
        <SelectItem value="CUSTOMER">
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            Customer
          </div>
        </SelectItem>
        <SelectItem value="ADMIN">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Admin
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

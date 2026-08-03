"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRole = searchParams.get("role") || "ALL";
  const currentKyc = searchParams.get("kyc") || "ALL";

  function handleFilterChange(key: "role" | "kyc", value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Select value={currentRole} onValueChange={(val) => handleFilterChange("role", val)}>
        <SelectTrigger className="w-[160px] h-10 bg-slate-900 border-slate-800 text-slate-200">
          <SelectValue placeholder="Filter Role" />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-slate-800 text-slate-300">
          <SelectItem value="ALL">All Roles</SelectItem>
          <SelectItem value="CUSTOMER">Customers Only</SelectItem>
          <SelectItem value="ADMIN">Admins Only</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentKyc} onValueChange={(val) => handleFilterChange("kyc", val)}>
        <SelectTrigger className="w-[160px] h-10 bg-slate-900 border-slate-800 text-slate-200">
          <SelectValue placeholder="Filter KYC Status" />
        </SelectTrigger>
        <SelectContent className="bg-slate-950 border-slate-800 text-slate-300">
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectItem value="VERIFIED">Verified</SelectItem>
          <SelectItem value="UNVERIFIED">Unverified</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface AdminOrderFiltersProps {
  currentStatus: string;
  currentSearch: string;
}

const statuses = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function AdminOrderFilters({ currentStatus, currentSearch }: AdminOrderFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/admin?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search.trim());
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or order #..."
            className="pl-9 h-9 rounded-xl text-sm"
          />
        </div>
        <Button type="submit" size="sm" variant="outline" className="h-9 rounded-xl">
          Search
        </Button>
      </form>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {statuses.map((s) => (
          <Button
            key={s.value}
            variant={currentStatus === s.value ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs rounded-full ${
              currentStatus === s.value
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            onClick={() => updateFilter("status", s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

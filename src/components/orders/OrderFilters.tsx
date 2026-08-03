"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";

interface OrderFiltersProps {
  currentStatus: string;
  currentSort: string;
}

const statuses = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "AWAITING_VERIFICATION", label: "Verifying" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "CANCELLED", label: "Cancelled" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "amount_desc", label: "Amount: High → Low" },
  { value: "amount_asc", label: "Amount: Low → High" },
];

export function OrderFilters({ currentStatus, currentSort }: OrderFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "ALL" || value === "newest") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/orders?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
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
                ? "bg-alipay hover:bg-alipay/90 text-white"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
            onClick={() => updateFilter("status", s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {/* Sort Dropdown as simple pills */}
      <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
        <ArrowUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="h-8 text-xs rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-alipay/20 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

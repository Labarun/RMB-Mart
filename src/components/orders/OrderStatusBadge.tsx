import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="outline" className={cn("bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/50", className)}>
          Pending Payment
        </Badge>
      );
    case "PROCESSING":
      return (
        <Badge variant="outline" className={cn("bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900/50", className)}>
          Processing
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="outline" className={cn("bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/50", className)}>
          Completed
        </Badge>
      );
    case "REFUNDED":
      return (
        <Badge variant="outline" className={cn("bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-900/50", className)}>
          Refunded
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" className={cn("bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700", className)}>
          Cancelled
        </Badge>
      );
    default:
      return <Badge className={className}>{status}</Badge>;
  }
}

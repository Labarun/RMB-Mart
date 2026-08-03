import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { format } from "date-fns";
import { PlusCircle, Clock, ArrowUpDown, Filter } from "lucide-react";
import { OrderFilters } from "@/components/orders/OrderFilters";

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; sort?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { status, sort } = await searchParams;

  // Build filter query
  const statusFilter = status && status !== "ALL"
    ? { status: status as "PENDING" | "PROCESSING" | "COMPLETED" | "REFUNDED" | "CANCELLED" }
    : {};

  // Build sort
  const orderBy = sort === "amount_desc"
    ? { amountRmb: "desc" as const }
    : sort === "amount_asc"
      ? { amountRmb: "asc" as const }
      : sort === "oldest"
        ? { createdAt: "asc" as const }
        : { createdAt: "desc" as const }; // default: newest first

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      ...statusFilter,
    },
    orderBy,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/orders/new">
          <Button className="clay-button gap-2">
            <PlusCircle className="w-4 h-4" />
            New Exchange
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <OrderFilters currentStatus={status || "ALL"} currentSort={sort || "newest"} />

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <Clock className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {status && status !== "ALL" ? `No ${status.toLowerCase()} orders` : "No orders yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {status && status !== "ALL"
                ? "Try changing the filter to see other orders."
                : "You haven't placed any exchange requests."}
            </p>
            {(!status || status === "ALL") && (
              <Link href="/orders/new">
                <Button className="clay-button">Place First Order</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">RMB</th>
                  <th className="px-6 py-4 font-medium">GHS</th>
                  <th className="px-6 py-4 font-medium">Payout</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {format(order.createdAt, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                      ¥{order.amountRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      GH₵{order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {order.payoutType === "ALIPAY" ? "Alipay" : "WeChat"}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="h-8">Details</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

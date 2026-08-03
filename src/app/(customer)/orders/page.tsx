import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { format } from "date-fns";
import { PlusCircle, Clock, Search, ChevronRight } from "lucide-react";
import { OrderTabs } from "@/components/orders/OrderTabs";

interface OrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { status } = await searchParams;
  const currentStatus = status || "ALL";

  // Build filter query
  const statusFilter = currentStatus !== "ALL"
    ? { status: currentStatus as any }
    : {};

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      ...statusFilter,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage your currency exchange requests.
          </p>
        </div>
        <Link href="/orders/new">
          <Button className="clay-button gap-2">
            <PlusCircle className="w-4 h-4" />
            New Exchange
          </Button>
        </Link>
      </div>

      <OrderTabs currentStatus={currentStatus} />

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="border-dashed border-2 bg-transparent shadow-none mt-6">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-medium text-slate-900 dark:text-slate-100 text-lg">
              {currentStatus !== "ALL" ? `No ${currentStatus.toLowerCase()} orders found` : "No orders yet"}
            </p>
            <p className="text-muted-foreground mt-2 max-w-sm mb-6">
              {currentStatus !== "ALL"
                ? "Try checking a different tab to see your other orders."
                : "You haven't placed any exchange requests yet. Create one to get started!"}
            </p>
            {currentStatus === "ALL" && (
              <Link href="/orders/new">
                <Button className="clay-button">Place First Order</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 mt-6">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block group">
              <Card className="clay-card border-none bg-white dark:bg-slate-950 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* Left: ID & Date */}
                    <div className="md:w-1/4">
                      <p className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {format(order.createdAt, "MMM d, yyyy • HH:mm")}
                      </p>
                    </div>

                    {/* Middle: Amount & Payout */}
                    <div className="md:w-1/3 flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">You Send</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100">GH₵{order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">They Get</p>
                        <p className="font-heading font-bold text-lg text-alipay">¥{order.amountRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="md:w-5/12 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col items-start md:items-end gap-1">
                        <OrderStatusBadge status={order.status} />
                        <span className="text-xs text-muted-foreground capitalize">Via {order.payoutType.toLowerCase()}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 group-hover:bg-alipay/10 group-hover:text-alipay flex items-center justify-center transition-colors text-slate-400">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

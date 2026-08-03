import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Clock, CheckCircle2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch user stats and recent orders
  const [orders, metrics] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: true,
      _sum: { amountRmb: true },
    }),
  ]);

  const totalVolume = metrics
    .filter((m) => m.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr._sum.amountRmb || 0), 0);

  const pendingCount = metrics
    .filter((m) => m.status === "PENDING" || m.status === "PROCESSING")
    .reduce((acc, curr) => acc + curr._count, 0);

  const completedCount = metrics
    .filter((m) => m.status === "COMPLETED")
    .reduce((acc, curr) => acc + curr._count, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back, {session.user.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your exchange activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exchanged</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-alipay" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">¥{totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime completed volume
            </p>
          </CardContent>
        </Card>
        <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCcw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Orders awaiting completion
            </p>
          </CardContent>
        </Card>
        <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully processed orders
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold tracking-tight">Recent Orders</h2>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="text-alipay hover:text-alipay/80 hover:bg-alipay/10">View all</Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <Card className="border-dashed border-2 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center h-48 text-center">
              <Clock className="w-10 h-10 text-muted-foreground mb-4 opacity-20" />
              <p className="font-medium text-slate-900 dark:text-slate-100">No orders yet</p>
              <p className="text-sm text-muted-foreground mb-4">You haven't placed any exchange requests.</p>
              <Link href="/orders/new">
                <Button className="clay-button">Place First Order</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
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
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
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
    </div>
  );
}

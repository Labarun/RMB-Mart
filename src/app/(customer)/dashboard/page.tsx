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
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Amount (RMB)</th>
                    <th className="px-6 py-4 font-medium">Amount (GHS)</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{format(order.createdAt, "MMM d, yyyy")}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">¥{order.amountRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">GH₵{order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
    </div>
  );
}

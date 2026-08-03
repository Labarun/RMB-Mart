import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Clock, CheckCircle2, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { format, subDays } from "date-fns";
import { AdminOrderFilters } from "@/components/admin/AdminOrderFilters";
import { ExportButton } from "@/components/admin/ExportButton";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const status = params.status as string | undefined;
  const search = params.search as string | undefined;

  // Build filter for orders table
  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  // Fetch aggregate metrics and filtered orders
  const thirtyDaysAgo = subDays(new Date(), 30);
  
  const [orders, metrics, userCount, recentCompletedOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
      take: 50, // Increased to 50 for the dashboard when filtering
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
      _sum: { amountRmb: true, amountGhs: true },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { amountRmb: true, amountGhs: true, createdAt: true },
    })
  ]);

  const totalVolumeRmb = metrics
    .filter((m) => m.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr._sum.amountRmb || 0), 0);
    
  const totalVolumeGhs = metrics
    .filter((m) => m.status === "COMPLETED")
    .reduce((acc, curr) => acc + (curr._sum.amountGhs || 0), 0);

  const pendingCount = metrics
    .filter((m) => m.status === "PENDING" || m.status === "PROCESSING")
    .reduce((acc, curr) => acc + curr._count, 0);
    
  const completedCount = metrics
    .filter((m) => m.status === "COMPLETED")
    .reduce((acc, curr) => acc + curr._count, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground mt-2">Manage all exchange requests and platform metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="clay-card border-none bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">¥{totalVolumeRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">GH₵{totalVolumeGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>

        <Card className="clay-card border-none bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Orders awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card className="clay-card border-none bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully fulfilled</p>
          </CardContent>
        </Card>

        <Card className="clay-card border-none bg-white dark:bg-slate-950">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{userCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsChart orders={recentCompletedOrders} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl font-heading font-semibold tracking-tight">Recent Orders</h2>
          <ExportButton />
        </div>
        
        <AdminOrderFilters currentStatus={status || "ALL"} currentSearch={search || ""} />

        <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">RMB / GHS</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No orders found matching your filters.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{order.user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{order.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{format(order.createdAt, "MMM d, yyyy")}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">¥{order.amountRmb.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">GH₵{order.amountGhs.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8 border-slate-200 dark:border-slate-700">Manage</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, QrCode } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { OrderChat } from "@/components/orders/OrderChat";
import { format } from "date-fns";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      auditLogs: {
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { name: true, email: true } } }
      },
    },
  });

  if (!order) {
    redirect("/admin");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-3">
            Manage Order {order.orderNumber}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5" />
            Placed by {order.user.name} on {format(order.createdAt, "PPP 'at' p")}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Order Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="clay-card border-none bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle>Exchange Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">RMB Requested</p>
                  <p className="text-2xl font-bold font-heading text-emerald-500">¥ {order.amountRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">GHS to Collect</p>
                  <p className="text-2xl font-bold font-heading">GH₵ {order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Payout Information</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Platform</span>
                    <span className="font-medium">{order.payoutType}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Recipient Name</span>
                    <span className="font-medium">{order.recipientName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Account ID</span>
                    <span className="font-medium">{order.recipientAccountId}</span>
                  </div>
                </div>

                {order.momoTransactionId && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-medium mb-1">Mobile Money Transaction ID</p>
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="font-mono font-bold text-slate-900 dark:text-slate-100 break-all">{order.momoTransactionId}</p>
                    </div>
                  </div>
                )}

                {order.recipientQrUrl && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      Uploaded Payment Receipt
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 inline-block">
                      <img src={order.recipientQrUrl} alt="Payment Receipt" className="max-w-full h-auto max-h-64 object-contain rounded-lg" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="clay-card border-none bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle>Customer Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{order.user.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{order.user.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{order.user.phone || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions and Logs */}
        <div className="space-y-6">
          <Card className="clay-card border-none bg-white dark:bg-slate-950">
            <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderStatusUpdater 
                orderId={order.id} 
                currentStatus={order.status} 
                externalTxnId={order.externalTxnId}
                adminNotes={order.adminNotes}
              />
            </CardContent>
          </Card>

          <Card className="clay-card border-none bg-white dark:bg-slate-950">
            <CardHeader>
              <CardTitle className="text-base">Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                {order.auditLogs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs text-slate-900 dark:text-slate-100">{log.action}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-1">{format(log.createdAt, "MMM d, h:mm a")} by {log.admin.name}</p>
                      {log.details && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-800 truncate">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <OrderChat orderId={order.id} currentUserId={session.user.id} isAdmin={true} />
        </div>
      </div>
    </div>
  );
}

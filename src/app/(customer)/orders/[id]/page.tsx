import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, Info, CheckCircle2, QrCode } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ReceiptUpload } from "@/components/orders/ReceiptUpload";
import { OrderChat } from "@/components/orders/OrderChat";
import { format } from "date-fns";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-3">
            Order {order.orderNumber}
            <OrderStatusBadge status={order.status} />
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5" />
            Placed on {format(order.createdAt, "PPP 'at' p")}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle>Exchange Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount to Receive</p>
                  <p className="text-2xl font-bold font-heading text-alipay">¥ {order.amountRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                  <p className="text-2xl font-bold font-heading">GH₵ {order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm py-2 px-1">
                <span className="text-muted-foreground">Exchange Rate Used</span>
                <span className="font-medium">¥ 1 = GH₵ {order.rateUsed}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle>Recipient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground">Payout Method</span>
                  <span className="font-medium">{order.payoutType === "ALIPAY" ? "Alipay" : "WeChat Pay"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground">Account Name</span>
                  <span className="font-medium">{order.recipientName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="font-medium">{order.recipientAccountId}</span>
                </div>
              </div>

              {order.recipientQrUrl && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Payment QR Code provided
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800 inline-block">
                    <img src={order.recipientQrUrl} alt="QR Code" className="w-32 h-32 object-contain rounded-lg" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50 h-full">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.status === "PENDING" && (
                <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-4 rounded-xl text-sm space-y-2 border border-amber-100 dark:border-amber-900/50">
                  <p className="font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4" /> Action Required
                  </p>
                  <p>We are waiting for your payment. Please make the transfer to complete your order.</p>
                  <Link href={`/orders/${order.id}/payment`} className="block mt-2">
                    <Button variant="outline" size="sm" className="w-full bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                      View Payment Details
                    </Button>
                  </Link>
                </div>
              )}

              {order.status === "PROCESSING" && (
                <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 p-4 rounded-xl text-sm space-y-2 border border-blue-100 dark:border-blue-900/50">
                  <p className="font-semibold flex items-center gap-2">
                    <Info className="w-4 h-4" /> In Progress
                  </p>
                  <p>Your payment has been received! We are currently transferring the RMB to your provided account.</p>
                </div>
              )}

              {order.status === "COMPLETED" && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 p-4 rounded-xl text-sm space-y-2 border border-emerald-100 dark:border-emerald-900/50">
                  <p className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Transfer Successful
                  </p>
                  <p>The RMB has been successfully credited to your account. Thank you for using RMBmart!</p>
                  {order.externalTxnId && (
                    <p className="mt-2 text-xs opacity-80 pt-2 border-t border-emerald-200 dark:border-emerald-800">
                      Txn Ref: {order.externalTxnId}
                    </p>
                  )}
                </div>
              )}

              {(order.status === "REFUNDED" || order.status === "CANCELLED") && (
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 p-4 rounded-xl text-sm space-y-2 border border-slate-200 dark:border-slate-700">
                  <p className="font-semibold">Order {order.status === "REFUNDED" ? "Refunded" : "Cancelled"}</p>
                  {order.adminNotes && (
                    <div className="mt-2 text-sm italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                      "{order.adminNotes}"
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Receipt Upload for PENDING orders */}
          {order.status === "PENDING" && (
            <ReceiptUpload orderId={order.id} hasReceipt={!!order.recipientQrUrl} />
          )}

          <OrderChat orderId={order.id} currentUserId={session.user.id} isAdmin={false} />
        </div>
      </div>
    </div>
  );
}

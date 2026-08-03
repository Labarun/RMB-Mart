import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { PaymentCompletionAction } from "@/components/orders/PaymentCompletionAction";

export default async function PaymentInstructionsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const paymentSettings = await prisma.paymentSettings.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="clay-card border-none bg-white dark:bg-slate-950 overflow-hidden shadow-xl">
        {/* Success Header */}
        <div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 flex flex-col items-center text-center border-b border-emerald-100 dark:border-emerald-800">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
          <h1 className="text-2xl font-heading font-bold text-emerald-900 dark:text-emerald-100">Order Placed Successfully!</h1>
          <p className="text-emerald-700 dark:text-emerald-300 mt-1">
            Order Ref: <strong>{order.orderNumber}</strong>
          </p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Amount Box */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex justify-between items-center border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-muted-foreground font-medium">Amount to Pay</p>
            <p className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
              GH₵ {order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Instructions Alert */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-3 flex gap-3 text-blue-800 dark:text-blue-300 items-start">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-tight">
              Please transfer the exact amount to the Mobile Money number below. Use your Order Number (<strong>{order.orderNumber}</strong>) as the reference.
            </p>
          </div>

          {/* MoMo Details */}
          {paymentSettings ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{paymentSettings.momoNetwork}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-muted-foreground">Account Name</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{paymentSettings.momoName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Number</span>
                <span className="font-heading font-bold text-xl tracking-wider text-slate-900 dark:text-slate-100">{paymentSettings.momoNumber}</span>
              </div>
              {paymentSettings.instructions && (
                <p className="text-xs text-muted-foreground italic mt-2">{paymentSettings.instructions}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center">Payment details unavailable. Please contact support.</p>
          )}

          {/* Completion Form */}
          <PaymentCompletionAction orderId={order.id} />
        </CardContent>
      </Card>
    </div>
  );
}

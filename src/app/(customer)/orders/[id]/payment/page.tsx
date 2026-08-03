import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Copy, AlertCircle } from "lucide-react";

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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Order Placed Successfully!</h1>
        <p className="text-muted-foreground text-lg">
          Your order <strong className="text-slate-900 dark:text-white">{order.orderNumber}</strong> has been saved.
        </p>
      </div>

      <Card className="clay-card border-none bg-white dark:bg-slate-950 overflow-hidden">
        <div className="bg-alipay text-white p-6 text-center">
          <p className="text-sm opacity-90 font-medium mb-1">Amount to Pay</p>
          <div className="text-4xl font-heading font-bold">GH₵ {order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 flex gap-3 text-blue-800 dark:text-blue-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold">Important Payment Instructions</p>
              <p>Please make a Mobile Money transfer to the number below. You MUST use your Order Number <strong>{order.orderNumber}</strong> as the payment reference.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Our MoMo Details</h3>
            
            {paymentSettings ? (
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-muted-foreground">Network</p>
                    <p className="font-medium text-lg">{paymentSettings.momoNetwork}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Name</p>
                    <p className="font-medium text-lg">{paymentSettings.momoName}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-muted-foreground">MoMo Number</p>
                    <p className="font-heading font-bold text-2xl tracking-wider">{paymentSettings.momoNumber}</p>
                  </div>
                  {/* Note: A real copy button would need a client component, but keeping it simple for now */}
                </div>
                
                {paymentSettings.instructions && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="font-medium text-slate-700 dark:text-slate-300">Additional Instructions:</p>
                    <p>{paymentSettings.instructions}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Payment details are currently unavailable. Please contact support.</p>
            )}
          </div>

          <div className="pt-6 border-t flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              After paying, your order status will be updated to Processing.
            </p>
            <Link href={`/orders/${order.id}`}>
              <Button className="clay-button">View Order Details</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

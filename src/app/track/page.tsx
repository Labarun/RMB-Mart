"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Search, Package, ArrowLeftRight, Clock, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { OrderStatus } from "@prisma/client";
import Link from "next/link";

interface TrackedOrder {
  orderNumber: string;
  status: OrderStatus;
  amountRmb: number;
  amountGhs: number;
  payoutType: "ALIPAY" | "WECHAT";
  createdAt: string;
  updatedAt: string;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setOrder(data.order);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gradient-alipay flex items-center justify-center shadow-md">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              RMB<span className="text-[var(--alipay-blue)]">mart</span>
            </span>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="rounded-xl">Sign In</Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-alipay/10 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-alipay" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Track Your Order
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter your order number (e.g., RMB-7050) to check the current status of your exchange.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <Input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number..."
            className="rounded-xl h-12 text-base"
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="clay-button h-12 px-6 gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Track
          </Button>
        </form>

        {/* Error State */}
        {error && (
          <Card className="border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 animate-in fade-in duration-300">
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {order && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-heading">Order {order.orderNumber}</CardTitle>
                <OrderStatusBadge status={order.status} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount (RMB)</p>
                    <p className="text-xl font-bold font-heading text-alipay">
                      ¥{order.amountRmb.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount Paid (GHS)</p>
                    <p className="text-xl font-bold font-heading">
                      GH₵{order.amountGhs.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-muted-foreground">Payout Method</span>
                    <span className="font-medium">{order.payoutType === "ALIPAY" ? "Alipay" : "WeChat Pay"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Placed
                    </span>
                    <span className="font-medium">{format(new Date(order.createdAt), "PPP 'at' p")}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{format(new Date(order.updatedAt), "PPP 'at' p")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Help Text */}
            <div className="text-center text-sm text-muted-foreground">
              {order.status === "PENDING" && "Your order is awaiting payment confirmation."}
              {order.status === "PROCESSING" && "Payment received! We are processing your exchange."}
              {order.status === "COMPLETED" && "Your RMB has been successfully delivered. 🎉"}
              {order.status === "CANCELLED" && "This order has been cancelled."}
              {order.status === "REFUNDED" && "This order has been refunded."}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

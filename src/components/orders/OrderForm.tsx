"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRightLeft, QrCode } from "lucide-react";
import { UploadDropzone } from "@/components/ui/upload-dropzone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderFormProps {
  currentRate: number;
}

export function OrderForm({ currentRate }: OrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OrderInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      amountRmb: 0,
      payoutType: "ALIPAY",
      recipientName: "",
      recipientAccountId: "",
      recipientQrUrl: "",
    },
  });

  const { watch, setValue } = form;
  const amountRmb = watch("amountRmb");
  const payoutType = watch("payoutType");
  const recipientQrUrl = watch("recipientQrUrl");

  const amountGhs = amountRmb > 0 ? Number((amountRmb * currentRate).toFixed(2)) : 0;

  async function onSubmit(data: OrderInput) {
    if (data.amountRmb <= 0) {
      toast.error("Please enter a valid RMB amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      toast.success("Order placed successfully!");
      router.push(`/orders/${result.orderId}/payment`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle>Exchange Amount</CardTitle>
              <CardDescription>Enter the amount of RMB you want to purchase.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amountRmb">You want (RMB ¥)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-medium">¥</span>
                  <Input 
                    id="amountRmb" 
                    type="number" 
                    step="0.01" 
                    className="pl-8 h-12 text-lg font-medium bg-white/80 dark:bg-slate-950/80" 
                    placeholder="1000"
                    {...form.register("amountRmb", { valueAsNumber: true })}
                  />
                </div>
                {form.formState.errors.amountRmb && (
                  <p className="text-sm text-red-500">{form.formState.errors.amountRmb.message}</p>
                )}
              </div>

              <div className="flex justify-center">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-2 text-slate-500">
                  <ArrowRightLeft className="w-4 h-4 rotate-90" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>You pay (GHS ₵)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-medium">₵</span>
                  <Input 
                    disabled 
                    value={amountGhs}
                    className="pl-8 h-12 text-lg font-medium bg-slate-50 dark:bg-slate-900 border-slate-200" 
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right mt-1">Rate: ¥1 = ₵{currentRate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle>Recipient Details</CardTitle>
              <CardDescription>Provide the account details to receive the RMB.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Payout Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setValue("payoutType", "ALIPAY")}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                      payoutType === "ALIPAY"
                        ? "border-alipay bg-alipay/5 text-alipay"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="font-semibold">Alipay</span>
                  </div>
                  <div
                    onClick={() => setValue("payoutType", "WECHAT")}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                      payoutType === "WECHAT"
                        ? "border-[#07C160] bg-[#07C160]/5 text-[#07C160]"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="font-semibold">WeChat Pay</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name</Label>
                <Input 
                  id="recipientName" 
                  placeholder="E.g., John Doe" 
                  className="bg-white/80 dark:bg-slate-950/80"
                  {...form.register("recipientName")} 
                />
                {form.formState.errors.recipientName && (
                  <p className="text-sm text-red-500">{form.formState.errors.recipientName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientAccountId">{payoutType === "ALIPAY" ? "Alipay Account ID (Email/Phone)" : "WeChat ID"}</Label>
                <Input 
                  id="recipientAccountId" 
                  placeholder="Enter account ID" 
                  className="bg-white/80 dark:bg-slate-950/80"
                  {...form.register("recipientAccountId")} 
                />
                {form.formState.errors.recipientAccountId && (
                  <p className="text-sm text-red-500">{form.formState.errors.recipientAccountId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Payment QR Code (Optional, highly recommended)</Label>
                {recipientQrUrl ? (
                  <div className="relative border rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-4 flex flex-col items-center justify-center">
                    <img src={recipientQrUrl} alt="Uploaded QR" className="max-h-48 object-contain" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setValue("recipientQrUrl", "")}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone 
                    onUploadComplete={(url) => setValue("recipientQrUrl", url)} 
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || amountRmb <= 0} 
          className="clay-button h-12 px-8 text-lg w-full md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order & View Payment Details"
          )}
        </Button>
      </div>
    </form>
  );
}

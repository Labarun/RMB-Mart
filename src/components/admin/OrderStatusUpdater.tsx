"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrderStatusSchema, type UpdateOrderStatusInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  externalTxnId?: string | null;
  adminNotes?: string | null;
}

export function OrderStatusUpdater({ orderId, currentStatus, externalTxnId, adminNotes }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UpdateOrderStatusInput>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues: {
      status: currentStatus as any,
      externalTxnId: externalTxnId || "",
      adminNotes: adminNotes || "",
    },
  });

  async function onSubmit(data: UpdateOrderStatusInput) {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update order");
      }

      toast.success("Order status updated successfully!");
      router.refresh(); // Refresh the page to show new status and audit logs
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Order Status</Label>
        <Select 
          onValueChange={(value) => form.setValue("status", value as any)} 
          defaultValue={form.getValues("status")}
        >
          <SelectTrigger className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-12">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending (Waiting for GHS)</SelectItem>
            <SelectItem value="PROCESSING">Processing (Transferring RMB)</SelectItem>
            <SelectItem value="COMPLETED">Completed (Transfer Done)</SelectItem>
            <SelectItem value="REFUNDED">Refunded (GHS Returned)</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="externalTxnId">External Transaction ID (Optional)</Label>
        <Input 
          id="externalTxnId" 
          placeholder="E.g., Alipay Transfer Ref #" 
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-12"
          {...form.register("externalTxnId")} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminNotes">Admin Notes (Visible to Customer)</Label>
        <Textarea 
          id="adminNotes" 
          placeholder="Add notes about refund reason or processing delay..." 
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 resize-none h-24"
          {...form.register("adminNotes")} 
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Updating...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}

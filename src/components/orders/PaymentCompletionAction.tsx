"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, CheckCircle } from "lucide-react";

interface PaymentCompletionActionProps {
  orderId: string;
}

export function PaymentCompletionAction({ orderId }: PaymentCompletionActionProps) {
  const router = useRouter();
  const [txnId, setTxnId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleComplete() {
    setIsSubmitting(true);
    try {
      if (txnId.trim()) {
        // Save the transaction ID if provided
        const response = await fetch(`/api/orders/${orderId}/receipt`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId: txnId.trim() }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to save Transaction ID");
        }
        toast.success("Transaction ID saved successfully!");
      }
      
      // Redirect to dashboard
      toast.success("Payment marked as completed!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      setIsSubmitting(false); // Only stop loading if there's an error, otherwise let it navigate
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 mt-6 border border-slate-200 dark:border-slate-800 space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Mobile Money Transaction ID (Optional but recommended)
        </label>
        <Input 
          placeholder="e.g. 1234567890" 
          value={txnId} 
          onChange={(e) => setTxnId(e.target.value)}
          className="bg-white dark:bg-slate-950"
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          Providing your Transaction ID helps us process your order much faster.
        </p>
      </div>
      
      <Button 
        onClick={handleComplete} 
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 text-base"
      >
        {isSubmitting ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
        ) : (
          <><CheckCircle className="w-5 h-5 mr-2" /> Payment Completed</>
        )}
      </Button>
    </div>
  );
}

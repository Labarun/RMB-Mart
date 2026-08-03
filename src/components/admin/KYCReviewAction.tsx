"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";

interface KYCReviewActionProps {
  userId: string;
}

export function KYCReviewAction({ userId }: KYCReviewActionProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState<"VERIFIED" | "REJECTED" | null>(null);

  async function handleReview(status: "VERIFIED" | "REJECTED") {
    setIsUpdating(status);
    try {
      const res = await fetch(`/api/admin/kyc/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`User KYC status updated to ${status}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update KYC status");
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="flex gap-3 justify-end">
      <Button 
        variant="outline" 
        className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950"
        onClick={() => handleReview("REJECTED")}
        disabled={isUpdating !== null}
      >
        {isUpdating === "REJECTED" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <X className="w-4 h-4 mr-2" />}
        Reject
      </Button>
      <Button 
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => handleReview("VERIFIED")}
        disabled={isUpdating !== null}
      >
        {isUpdating === "VERIFIED" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
        Approve
      </Button>
    </div>
  );
}

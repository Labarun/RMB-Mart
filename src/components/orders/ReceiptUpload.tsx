"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { UploadDropzone as UTDropzone } from "@/lib/uploadthing";

interface ReceiptUploadProps {
  orderId: string;
  hasReceipt: boolean;
}

export function ReceiptUpload({ orderId, hasReceipt }: ReceiptUploadProps) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [txnId, setTxnId] = useState("");

  if (hasReceipt) {
    return (
      <Card className="clay-card border-none bg-emerald-50/50 dark:bg-emerald-950/20">
        <CardContent className="flex items-center gap-3 pt-6">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
            Payment receipt submitted successfully
          </p>
        </CardContent>
      </Card>
    );
  }

  async function submitTxnIdOnly() {
    if (!txnId.trim()) return;
    setUploading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/receipt`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: txnId.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      toast.success("Transaction ID submitted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save Transaction ID");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Upload className="w-5 h-5 text-alipay" />
          Submit Payment Proof
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Upload a screenshot of your MoMo payment confirmation OR enter your Mobile Money Transaction ID to help us verify your order.
        </p>
        
        <div className="space-y-3">
          <Label>Transaction ID</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g. 1234567890" 
              value={txnId} 
              onChange={(e) => setTxnId(e.target.value)}
              className="bg-white dark:bg-slate-950"
            />
            <Button 
              onClick={submitTxnIdOnly} 
              disabled={!txnId.trim() || uploading}
              className="shrink-0"
            >
              {uploading && !txnId.trim() ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit ID
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted-foreground/20" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">Or</span></div>
        </div>

        <div className="space-y-3">
          <Label>Upload Receipt Image</Label>
          <UTDropzone
            endpoint="receiptUpload"
            onClientUploadComplete={async (res) => {
              if (res && res[0]) {
                setUploading(true);
                try {
                  const response = await fetch(`/api/orders/${orderId}/receipt`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                      receiptUrl: res[0].ufsUrl || res[0].url,
                      transactionId: txnId.trim() || undefined
                    }),
                  });
                  const data = await response.json();
                  if (!response.ok) throw new Error(data.error);
                  toast.success("Receipt uploaded successfully!");
                  router.refresh();
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Failed to save receipt");
                } finally {
                  setUploading(false);
                }
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

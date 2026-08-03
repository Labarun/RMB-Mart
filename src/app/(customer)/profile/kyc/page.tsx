"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { Loader2, ShieldCheck, FileCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function KYCPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);

  async function submitKyc() {
    if (!documentUrl) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/profile/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentUrl }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Identity verification document submitted successfully!");
      router.push("/profile");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit document");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
      <div className="flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Identity Verification (KYC)</h1>
          <p className="text-muted-foreground text-sm">Upload your ID to increase your limits and earn the Verified badge.</p>
        </div>
      </div>

      <Card className="clay-card border-none bg-white dark:bg-slate-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Upload Document
          </CardTitle>
          <CardDescription>
            Please upload a clear, legible photo or scan of a valid Government-issued ID (Passport, Driver's License, or National ID).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!documentUrl ? (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
              <UploadDropzone
                endpoint="kycDocumentUploader"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setDocumentUrl(res[0].url);
                    toast.success("Document uploaded successfully! Please click submit.");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border border-emerald-200 dark:border-emerald-800 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <FileCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">Document Uploaded Ready to Submit</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">Review the document and submit it for verification.</p>
              </div>
              <Button 
                onClick={submitKyc} 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setDocumentUrl(null)} 
                disabled={isSubmitting}
                className="text-muted-foreground"
              >
                Upload a different file
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

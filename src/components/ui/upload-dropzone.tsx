"use client";

import { UploadDropzone as UTDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onUploadComplete: (url: string) => void;
  className?: string;
}

export function UploadDropzone({ onUploadComplete, className }: UploadDropzoneProps) {
  return (
    <div className={cn("mt-2", className)}>
      <UTDropzone
        endpoint="qrCodeUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]) {
            toast.success("QR Code uploaded successfully");
            onUploadComplete(res[0].url);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
        appearance={{
          container: "border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors",
          label: "text-slate-700 dark:text-slate-300 font-medium hover:text-alipay",
          allowedContent: "text-slate-500 dark:text-slate-400 text-sm",
          button: "bg-alipay text-white hover:bg-alipay/90 rounded-xl px-4 py-2 text-sm font-medium transition-colors ut-uploading:cursor-not-allowed ut-uploading:bg-alipay/50",
        }}
      />
    </div>
  );
}

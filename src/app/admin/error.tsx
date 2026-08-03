"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin area error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-red-950/40 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-400 mb-6">
          An unexpected error occurred in the admin panel. Please try again.
        </p>
        <Button onClick={reset} variant="outline" className="gap-2 border-slate-700 text-white hover:bg-slate-800">
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

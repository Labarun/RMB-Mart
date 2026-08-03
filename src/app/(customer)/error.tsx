"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function CustomerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Customer area error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Please try again or contact support if the issue persists.
        </p>
        <Button onClick={reset} className="clay-button gap-2">
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

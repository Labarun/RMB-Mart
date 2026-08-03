function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-800 ${className || ""}`} />;
}

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <Skeleton className="h-9 w-56 mb-2" />
      <Skeleton className="h-5 w-36" />

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-slate-950 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4">
          <div className="flex gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-16" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 border-b border-slate-800 last:border-0">
            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-lg ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

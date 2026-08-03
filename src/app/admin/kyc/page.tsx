import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, UserCheck, XCircle, Clock } from "lucide-react";
import { KYCReviewAction } from "@/components/admin/KYCReviewAction";

export default async function AdminKYCPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const pendingKYC = await prisma.user.findMany({
    where: { kycStatus: "PENDING" },
    orderBy: { updatedAt: "asc" },
  });

  const recentReviews = await prisma.user.findMany({
    where: { kycStatus: { in: ["VERIFIED", "REJECTED"] } },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Identity Verification</h1>
        <p className="text-muted-foreground mt-2">Review and manage customer KYC documents.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Pending Reviews ({pendingKYC.length})</h2>
        {pendingKYC.length === 0 ? (
          <Card className="clay-card border-none bg-white dark:bg-slate-950">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShieldCheck className="w-12 h-12 mb-4 opacity-20" />
              <p>No pending KYC applications.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {pendingKYC.map((user) => (
              <Card key={user.id} className="clay-card border-none bg-white dark:bg-slate-950 overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-4 bg-slate-100 dark:bg-slate-900 flex justify-center items-center min-h-[200px]">
                    {user.kycDocumentUrl ? (
                      <a href={user.kycDocumentUrl} target="_blank" rel="noreferrer" className="block w-full max-w-sm">
                        {user.kycDocumentUrl.endsWith('.pdf') ? (
                          <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                            <span className="text-4xl">📄</span>
                            <span className="text-sm font-medium">View PDF Document</span>
                          </div>
                        ) : (
                          <img src={user.kycDocumentUrl} alt="KYC Document" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm border border-slate-200 dark:border-slate-800" />
                        )}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">No Document URL</span>
                    )}
                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <KYCReviewAction userId={user.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold">Recent Reviews</h2>
        <Card className="clay-card border-none bg-white dark:bg-slate-950">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentReviews.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">No recently reviewed applications.</div>
              ) : (
                recentReviews.map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      {user.kycStatus === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

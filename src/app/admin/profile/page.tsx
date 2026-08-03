import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ShieldCheck } from "lucide-react";

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your administrator account information and password.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          Administrator
        </div>
      </div>

      <ProfileForm
        initialName={user.name}
        initialEmail={user.email}
        initialPhone={user.phone || ""}
        memberSince={user.createdAt.toISOString()}
      />
    </div>
  );
}

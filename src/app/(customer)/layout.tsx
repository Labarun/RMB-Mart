import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CustomerSidebar } from "@/components/layout/CustomerSidebar";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <CustomerSidebar
        userName={session.user.name || "User"}
        userEmail={session.user.email || ""}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

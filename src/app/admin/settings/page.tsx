import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch the latest settings
  const [latestRate, latestSettings, latestSiteSettings] = await Promise.all([
    prisma.exchangeRate.findFirst({
      orderBy: { updatedAt: "desc" },
    }),
    prisma.paymentSettings.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-2">Manage exchange rates, payment instructions, site announcements, and contact info.</p>
      </div>

      <div className="max-w-3xl">
        <SettingsForm 
          initialRate={latestRate?.rateGhsToRmb || 1.95}
          initialMomoName={latestSettings?.momoName || ""}
          initialMomoNumber={latestSettings?.momoNumber || ""}
          initialMomoNetwork={latestSettings?.momoNetwork || "MTN"}
          initialInstructions={latestSettings?.instructions || ""}
          initialAnnouncementText={latestSiteSettings?.announcementText || ""}
          initialAnnouncementEnabled={latestSiteSettings?.announcementEnabled || false}
          initialSupportWhatsapp={latestSiteSettings?.supportWhatsapp || ""}
          initialSupportEmail={latestSiteSettings?.supportEmail || ""}
        />
      </div>
    </div>
  );
}

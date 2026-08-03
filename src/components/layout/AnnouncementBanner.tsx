import { prisma } from "@/lib/prisma";
import { Megaphone } from "lucide-react";

export async function AnnouncementBanner() {
  const settings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  if (!settings?.announcementEnabled || !settings?.announcementText) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[var(--alipay-blue)] to-[var(--alipay-teal)] text-white text-xs sm:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2 shadow-sm">
      <Megaphone className="w-4 h-4 shrink-0 animate-pulse" />
      <span>{settings.announcementText}</span>
    </div>
  );
}

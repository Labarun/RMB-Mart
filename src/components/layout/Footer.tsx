import Link from "next/link";
import { ArrowLeftRight, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  const settings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const supportEmail = settings?.supportEmail || "support@rmbmart.com";
  const supportWhatsapp = settings?.supportWhatsapp || "+233 XX XXX XXXX";

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-alipay flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-xl font-bold tracking-tight">
                RMB<span className="text-[var(--alipay-blue)]">mart</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Ghana&apos;s trusted platform for fast and reliable GHS to RMB
              currency exchange for Alipay and WeChat Pay.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-[var(--alipay-blue)] transition-colors"
                >
                  Rate Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-[var(--alipay-blue)] transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-[var(--alipay-blue)] transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-foreground">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-[var(--alipay-blue)]" />
                {supportEmail}
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-[var(--alipay-blue)]" />
                {supportWhatsapp}
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 text-[var(--alipay-blue)]" />
                Accra, Ghana
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {currentYear} RMBmart. All rights reserved.</p>
          <p>
            Powered by trusted exchange partners.
          </p>
        </div>
      </div>
    </footer>
  );
}

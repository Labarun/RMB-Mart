import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RMBmart — GHS to RMB Exchange",
    template: "%s | RMBmart",
  },
  description:
    "Fast, reliable Ghanaian Cedi (GHS) to Chinese Yuan (RMB) exchange for Alipay and WeChat Pay. Trusted by thousands in Ghana.",
  keywords: [
    "GHS to RMB",
    "Ghana cedi to yuan",
    "Alipay Ghana",
    "WeChat Pay Ghana",
    "currency exchange Ghana",
    "RMBmart",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} h-full`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AnnouncementBanner />
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

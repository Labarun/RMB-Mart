import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import RateCalculator from "@/components/landing/RateCalculator";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();
  
  return (
    <>
      <Navbar userRole={session?.user?.role as string | undefined} />
      <main className="flex-1">
        <Hero />
        <RateCalculator />
        <HowItWorks />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

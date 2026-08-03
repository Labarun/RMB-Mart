"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative gradient-hero blob-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-up">
            <Badge
              variant="secondary"
              className="clay px-4 py-1.5 text-sm font-medium gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[var(--alipay-blue)]" />
              Trusted by users across Ghana
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground animate-fade-in-up animate-delay-100">
            Exchange{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--alipay-blue)] to-[var(--alipay-teal)]">
              GHS to RMB
            </span>{" "}
            <br className="hidden sm:block" />
            Fast & Secure
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
            Convert Ghanaian Cedi to Chinese Yuan instantly. Pay directly to{" "}
            <span className="text-[var(--alipay-blue)] font-semibold">Alipay</span>{" "}
            or{" "}
            <span className="text-[var(--alipay-teal)] font-semibold">
              WeChat Pay
            </span>{" "}
            with competitive rates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
            <Link href="/register">
              <Button
                size="lg"
                className="clay-button px-8 py-6 text-base font-semibold gap-2 group"
              >
                Place Exchange Order
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#calculator">
              <Button
                variant="outline"
                size="lg"
                className="clay px-8 py-6 text-base font-medium border-border/60"
              >
                Check Rates
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-4 animate-fade-in-up animate-delay-400">
            {[
              { icon: Shield, label: "Secure Payments" },
              { icon: Zap, label: "Fast Processing" },
              { icon: Clock, label: "24h Support" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4 text-[var(--alipay-blue)]" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

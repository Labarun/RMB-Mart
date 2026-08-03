"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownUp,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";

// Default mock rate — replaced by DB rate once backend is connected
const DEFAULT_RATE = 1.95;

export default function RateCalculator() {
  const [ghsAmount, setGhsAmount] = useState<string>("100");
  const [rmbAmount, setRmbAmount] = useState<string>("");
  const [rate, setRate] = useState<number>(DEFAULT_RATE);
  const [direction, setDirection] = useState<"ghs-to-rmb" | "rmb-to-ghs">(
    "ghs-to-rmb"
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch rate from API (graceful fallback)
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch("/api/rates");
        if (res.ok) {
          const data = await res.json();
          if (data.rateGhsToRmb) {
            setRate(data.rateGhsToRmb);
          }
        }
      } catch {
        // Use default rate silently
      }
    }
    fetchRate();
  }, []);

  // Recalculate when amount or direction changes
  useEffect(() => {
    if (direction === "ghs-to-rmb") {
      const ghs = parseFloat(ghsAmount);
      if (!isNaN(ghs) && ghs > 0) {
        setRmbAmount((ghs / rate).toFixed(2));
      } else {
        setRmbAmount("");
      }
    }
  }, [ghsAmount, rate, direction]);

  useEffect(() => {
    if (direction === "rmb-to-ghs") {
      const rmb = parseFloat(rmbAmount);
      if (!isNaN(rmb) && rmb > 0) {
        setGhsAmount((rmb * rate).toFixed(2));
      } else {
        setGhsAmount("");
      }
    }
  }, [rmbAmount, rate, direction]);

  function handleSwapDirection() {
    setIsAnimating(true);
    setDirection((prev) =>
      prev === "ghs-to-rmb" ? "rmb-to-ghs" : "ghs-to-rmb"
    );
    setTimeout(() => setIsAnimating(false), 400);
  }

  function handleGhsChange(value: string) {
    setGhsAmount(value);
    if (direction === "rmb-to-ghs") {
      setDirection("ghs-to-rmb");
    }
  }

  function handleRmbChange(value: string) {
    setRmbAmount(value);
    if (direction === "ghs-to-rmb") {
      setDirection("rmb-to-ghs");
    }
  }

  return (
    <section id="calculator" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <Badge
            variant="secondary"
            className="clay px-4 py-1.5 text-sm font-medium gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[var(--alipay-blue)]" />
            Live Exchange Rate
          </Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Check Today&apos;s Rate
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter an amount to see the conversion in real time.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="clay p-8 space-y-6">
            {/* Rate Display */}
            <div className="flex items-center justify-center gap-3">
              <div className="clay-pressed px-4 py-2 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Current Rate
                </p>
                <p className="text-2xl font-heading font-bold text-[var(--alipay-blue)]">
                  1 RMB = {rate.toFixed(2)} GHS
                </p>
              </div>
            </div>

            {/* GHS Input */}
            <div className="space-y-2">
              <Label
                htmlFor="ghs-input"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-md bg-[var(--alipay-warning)]/20 flex items-center justify-center text-xs font-bold text-[var(--alipay-warning)]">
                  ₵
                </span>
                Ghana Cedi (GHS)
              </Label>
              <Input
                id="ghs-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter GHS amount"
                value={ghsAmount}
                onChange={(e) => handleGhsChange(e.target.value)}
                className="clay-input h-12 px-4 text-lg font-medium"
              />
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwapDirection}
                className={`w-10 h-10 rounded-full gradient-alipay flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  isAnimating ? "rotate-180" : ""
                }`}
                style={{
                  transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s",
                }}
                aria-label="Swap conversion direction"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* RMB Input */}
            <div className="space-y-2">
              <Label
                htmlFor="rmb-input"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-6 h-6 rounded-md bg-[var(--alipay-error)]/20 flex items-center justify-center text-xs font-bold text-[var(--alipay-error)]">
                  ¥
                </span>
                Chinese Yuan (RMB)
              </Label>
              <Input
                id="rmb-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter RMB amount"
                value={rmbAmount}
                onChange={(e) => handleRmbChange(e.target.value)}
                className="clay-input h-12 px-4 text-lg font-medium"
              />
            </div>

            {/* CTA */}
            <Link href="/register" className="block">
              <Button className="w-full clay-button h-12 text-base font-semibold gap-2 group">
                <Wallet className="w-4 h-4" />
                Place Exchange Order
                <RefreshCw className="w-3.5 h-3.5 opacity-50 group-hover:animate-spin" />
              </Button>
            </Link>

            <p className="text-center text-xs text-muted-foreground">
              Rates are updated regularly. Final rate confirmed at order placement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

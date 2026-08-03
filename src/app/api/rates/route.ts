import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/rates — fetch the latest exchange rate (public)
export async function GET() {
  try {
    const latestRate = await prisma.exchangeRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!latestRate) {
      // Return a default rate if none is set
      return NextResponse.json({
        rateGhsToRmb: 1.95,
        updatedAt: new Date().toISOString(),
        isDefault: true,
      });
    }

    return NextResponse.json({
      id: latestRate.id,
      rateGhsToRmb: latestRate.rateGhsToRmb,
      updatedAt: latestRate.updatedAt.toISOString(),
      isDefault: false,
    });
  } catch (error) {
    console.error("Error fetching rate:", error);
    // Graceful fallback
    return NextResponse.json({
      rateGhsToRmb: 1.95,
      updatedAt: new Date().toISOString(),
      isDefault: true,
    });
  }
}

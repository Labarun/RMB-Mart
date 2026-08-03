import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const rateLimit = checkRateLimit(ip, 10, 60000); // 10 requests per minute

    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber");

    if (!orderNumber || orderNumber.trim().length < 3) {
      return NextResponse.json(
        { error: "Please enter a valid order number" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.trim().toUpperCase() },
      select: {
        orderNumber: true,
        status: true,
        amountRmb: true,
        amountGhs: true,
        payoutType: true,
        createdAt: true,
        updatedAt: true,
        // Intentionally exclude: userId, recipientName, recipientAccountId, recipientQrUrl, adminNotes
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No order found with that number. Please check and try again." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

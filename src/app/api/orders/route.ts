import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { orderFormSchema } from "@/lib/validators";
import { sendOrderPlacedEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    const rateLimit = checkRateLimit(ip, 5, 60000); // 5 orders per minute per IP

    if (!rateLimit.success) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = orderFormSchema.parse(body);

    // Fetch the latest exchange rate to ensure calculation is done server-side securely
    const latestRate = await prisma.exchangeRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (!latestRate) {
      return NextResponse.json({ error: "Exchange rate not found" }, { status: 500 });
    }

    const rateUsed = latestRate.rateGhsToRmb;
    // Recalculate GHS amount to prevent client-side manipulation
    // Since rateGhsToRmb means 1 RMB = X GHS, amountGhs = amountRmb * rateGhsToRmb
    const amountGhs = Number((validatedData.amountRmb * rateUsed).toFixed(2));

    // Generate Order Number
    const count = await prisma.order.count();
    const orderNumber = `RMB-${1000 + count + 1}`;

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        amountRmb: validatedData.amountRmb,
        amountGhs,
        rateUsed,
        payoutType: validatedData.payoutType as any,
        recipientName: validatedData.recipientName,
        recipientAccountId: validatedData.recipientAccountId,
        recipientQrUrl: validatedData.recipientQrUrl,
        status: "PENDING",
      },
    });

    // Log the creation
    await prisma.auditLog.create({
      data: {
        orderId: order.id,
        adminId: session.user.id, // In this case, user created it, but audit log expects adminId. We can use a system account or user ID.
        action: "ORDER_CREATED",
        details: "Customer placed a new exchange request",
      },
    });

    // Send email notification
    await sendOrderPlacedEmail(
      session.user.email!,
      session.user.name!,
      orderNumber,
      amountGhs
    );

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPaymentReceivedEmail } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderId } = await params;
    const body = await req.json();
    const { receiptUrl, transactionId } = body;

    if (!receiptUrl && !transactionId) {
      return NextResponse.json(
        { error: "Receipt URL or Transaction ID is required" },
        { status: 400 }
      );
    }

    // Verify the order belongs to this user and is in a valid state
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { 
        userId: true, 
        status: true, 
        orderNumber: true,
        user: { select: { name: true, email: true } }
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Only allow receipt upload for PENDING orders
    if (order.status !== "PENDING") {
      return NextResponse.json(
        { error: "Can only update receipt for pending orders" },
        { status: 400 }
      );
    }

    // Update the order with the receipt URL and/or Transaction ID
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        ...(receiptUrl ? { recipientQrUrl: receiptUrl } : {}),
        ...(transactionId ? { momoTransactionId: transactionId } : {}),
      },
    });

    // Send email notification
    await sendPaymentReceivedEmail(
      order.user.email,
      order.user.name,
      order.orderNumber
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Receipt upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload receipt information" },
      { status: 500 }
    );
  }
}

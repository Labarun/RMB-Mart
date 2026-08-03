import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { updateOrderStatusSchema } from "@/lib/validators";
import { sendOrderNotification } from "@/lib/notifications";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateOrderStatusSchema.parse(body);

    const { id: orderId } = await params;
    const currentOrder = await prisma.order.findUnique({ where: { id: orderId } });

    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: validatedData.status,
        externalTxnId: validatedData.externalTxnId || currentOrder.externalTxnId,
        adminNotes: validatedData.adminNotes || currentOrder.adminNotes,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        orderId,
        adminId: session.user.id,
        action: `STATUS_CHANGE: ${currentOrder.status} → ${validatedData.status}`,
        details: JSON.stringify({
          externalTxnId: validatedData.externalTxnId,
          adminNotes: validatedData.adminNotes,
        }),
      },
    });

    // Trigger notification service
    const orderUser = await prisma.user.findUnique({ where: { id: currentOrder.userId } });
    if (orderUser) {
      await sendOrderNotification({
        orderId,
        orderNumber: currentOrder.orderNumber,
        userEmail: orderUser.email,
        userName: orderUser.name,
        newStatus: validatedData.status,
        adminNotes: validatedData.adminNotes,
      });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sendChatMessageEmail } from "@/lib/email";

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: orderId } = await params;
    
    // Validate order access
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { userId: true },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const messages = await prisma.orderMessage.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: orderId } = await params;
    const body = await req.json();
    const validatedData = messageSchema.parse(body);

    // Validate order access
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: { select: { email: true, name: true } } },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const message = await prisma.orderMessage.create({
      data: {
        orderId,
        userId: session.user.id,
        message: validatedData.message,
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    // Notify the other party if needed
    // If admin sends a message, email the customer
    if (session.user.role === "ADMIN") {
      await sendChatMessageEmail(order.user.email, order.user.name, order.orderNumber, validatedData.message);
    }
    // (Optional: If customer sends a message, you might want to email the admin, but for now we'll stick to notifying the customer)

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Post message error:", error);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}

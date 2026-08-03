import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Build filter
    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to + "T23:59:59.999Z") } : {}),
      };
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });

    // Build CSV
    const headers = [
      "Order Number",
      "Status",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Amount RMB",
      "Amount GHS",
      "Rate Used",
      "Payout Type",
      "Recipient Name",
      "Recipient Account",
      "External Txn ID",
      "Admin Notes",
      "Created At",
      "Updated At",
    ];

    const rows = orders.map((order) => [
      order.orderNumber,
      order.status,
      order.user.name,
      order.user.email,
      order.user.phone || "",
      order.amountRmb.toFixed(2),
      order.amountGhs.toFixed(2),
      order.rateUsed.toFixed(2),
      order.payoutType,
      order.recipientName,
      order.recipientAccountId,
      order.externalTxnId || "",
      (order.adminNotes || "").replace(/"/g, '""'),
      order.createdAt.toISOString(),
      order.updatedAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const filename = `rmbmart-orders-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}

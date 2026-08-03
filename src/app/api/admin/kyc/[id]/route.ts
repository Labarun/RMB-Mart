import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const kycReviewSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const body = await req.json();
    const { status } = kycReviewSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: status },
      select: { id: true, name: true, kycStatus: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("KYC review error:", error);
    return NextResponse.json({ error: "Failed to update KYC status" }, { status: 500 });
  }
}

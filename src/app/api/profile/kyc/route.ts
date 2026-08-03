import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const kycSchema = z.object({
  documentUrl: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { documentUrl } = kycSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        kycStatus: "PENDING",
        kycDocumentUrl: documentUrl,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("KYC submission error:", error);
    return NextResponse.json({ error: "Failed to submit KYC document" }, { status: 500 });
  }
}

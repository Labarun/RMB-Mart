import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const settingsSchema = z.object({
  rateGhsToRmb: z.number().positive(),
  momoName: z.string().min(1),
  momoNumber: z.string().min(1),
  momoNetwork: z.string().min(1),
  instructions: z.string().optional(),
  announcementText: z.string().optional(),
  announcementEnabled: z.boolean().optional(),
  supportWhatsapp: z.string().optional(),
  supportEmail: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = settingsSchema.parse(body);

    // Run updates in a transaction
    const [rate, settings, siteSettings] = await prisma.$transaction([
      prisma.exchangeRate.create({
        data: {
          rateGhsToRmb: validatedData.rateGhsToRmb,
          updatedBy: session.user.id,
        },
      }),
      prisma.paymentSettings.create({
        data: {
          momoName: validatedData.momoName,
          momoNumber: validatedData.momoNumber,
          momoNetwork: validatedData.momoNetwork,
          instructions: validatedData.instructions,
          updatedBy: session.user.id,
        },
      }),
      prisma.siteSettings.create({
        data: {
          announcementText: validatedData.announcementText,
          announcementEnabled: validatedData.announcementEnabled ?? false,
          supportWhatsapp: validatedData.supportWhatsapp,
          supportEmail: validatedData.supportEmail,
          updatedBy: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({ success: true, rate, settings, siteSettings });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}

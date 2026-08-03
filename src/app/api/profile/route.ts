import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().min(10).optional().or(z.literal("")),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = profileUpdateSchema.parse(body);

    // If changing password, validate current password first
    if (validatedData.newPassword) {
      if (!validatedData.currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }

      const { compare } = await import("bcryptjs");
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { passwordHash: true },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const isPasswordValid = await compare(validatedData.currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const { hash } = await import("bcryptjs");
      const newPasswordHash = await hash(validatedData.newPassword, 12);

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.phone !== undefined && { phone: validatedData.phone || null }),
          passwordHash: newPasswordHash,
        },
      });
    } else {
      // Just update profile fields, no password change
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.phone !== undefined && { phone: validatedData.phone || null }),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Verify requester is logged in and is an ADMIN
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // You cannot change your own role
    const p = await params;
    if (session.user.id === p.id) {
      return NextResponse.json({ error: "Cannot modify your own role" }, { status: 400 });
    }

    const json = await request.json();
    const { role } = json;

    if (role !== "ADMIN" && role !== "CUSTOMER") {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: p.id },
      data: { role },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Role update error:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { notificationService } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { societyId, flatNumber, buildingId } = await request.json();
    if (!societyId) return NextResponse.json({ error: "societyId required" }, { status: 400 });

    const society = await prisma.society.findUnique({ where: { id: societyId, status: "ACTIVE" } });
    if (!society) return NextResponse.json({ error: "Society not found" }, { status: 404 });

    const existing = await prisma.societyMembership.findUnique({
      where: { userId_societyId: { userId: session.user.id, societyId } },
    });

    if (existing) {
      if (existing.status === "APPROVED") {
        return NextResponse.json({ error: "You are already a member of this society" }, { status: 409 });
      }
      if (existing.status === "PENDING") {
        return NextResponse.json({ error: "Your membership request is pending approval" }, { status: 409 });
      }
    }

    await prisma.societyMembership.upsert({
      where: { userId_societyId: { userId: session.user.id, societyId } },
      update: { status: "PENDING", flatNumber, buildingId },
      create: {
        userId: session.user.id,
        societyId,
        role: "MEMBER",
        status: "PENDING",
        flatNumber,
        buildingId,
      },
    });

    return NextResponse.json(
      { message: "Membership request submitted. Awaiting society admin approval." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/societies/join]", error);
    return NextResponse.json({ error: "Failed to submit membership request" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { cancelCommitment } from "@/lib/deals/engine";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; commitmentId: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, commitmentId } = await params;

  try {
    // Ensure commitment belongs to current user
    const commitment = await prisma.dealCommitment.findUnique({
      where: { id: commitmentId },
    });
    if (!commitment || commitment.userId !== session.user.id) {
      return NextResponse.json({ error: "Commitment not found" }, { status: 404 });
    }

    const result = await cancelCommitment(id, session.user.id);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 422 });
    }
    return NextResponse.json({ message: result.message });
  } catch (error) {
    console.error("[DELETE /api/deals/[id]/commitments/[commitmentId]]", error);
    return NextResponse.json({ error: "Failed to cancel commitment" }, { status: 500 });
  }
}

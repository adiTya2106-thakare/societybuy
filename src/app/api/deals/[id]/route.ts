import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { commitToDeal, cancelCommitment, checkAndQualifyDeal } from "@/lib/deals/engine";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await prisma.bulkDeal.findUnique({
      where: { id },
      include: {
        product: {
          include: { category: true, variants: { where: { isActive: true } } },
        },
        tiers: { orderBy: { minQty: "asc" } },
        society: { select: { id: true, name: true } },
        merchant: { select: { id: true, businessName: true, rating: true } },
        _count: { select: { commitments: true } },
      },
    });

    if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });

    return NextResponse.json({ data: deal });
  } catch (error) {
    console.error("[GET /api/deals/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { qty } = await request.json();

  if (!qty || Number(qty) <= 0) {
    return NextResponse.json({ error: "Quantity must be positive" }, { status: 400 });
  }

  try {
    const result = await commitToDeal(id, session.user.id, Number(qty));
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 422 });
    }

    // Check if deal now qualifies
    await checkAndQualifyDeal(id);

    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/deals/[id]/commit]", error);
    return NextResponse.json({ error: "Failed to commit to deal" }, { status: 500 });
  }
}

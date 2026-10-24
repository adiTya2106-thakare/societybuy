import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id, status: "ACTIVE" },
      include: {
        category: true,
        variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        merchantProducts: {
          where: { isActive: true },
          include: {
            merchant: {
              select: { id: true, businessName: true, rating: true, city: true },
            },
            inventory: { select: { availableQty: true, unit: true } },
          },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { profile: { select: { firstName: true } } } },
          },
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Active deals for this product
    const activeDeals = await prisma.bulkDeal.findMany({
      where: {
        productId: id,
        status: { in: ["OPEN", "QUALIFIED"] },
        endsAt: { gt: new Date() },
      },
      include: {
        tiers: { orderBy: { minQty: "asc" } },
        society: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ data: { ...product, activeDeals } });
  } catch (error) {
    console.error("[GET /api/products/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

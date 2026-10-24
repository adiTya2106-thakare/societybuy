import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "24"), 100);
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") ?? "";
    const categoryId = searchParams.get("categoryId");
    const merchantId = searchParams.get("merchantId");
    const sort = searchParams.get("sort") ?? "name_asc";

    const where: Record<string, unknown> = { status: "ACTIVE" };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (merchantId) {
      where.merchantProducts = { some: { merchantId, isActive: true } };
    }

    const orderBy: Record<string, string> = {};
    if (sort === "name_asc") orderBy.name = "asc";
    else if (sort === "name_desc") orderBy.name = "desc";
    else if (sort === "newest") orderBy.createdAt = "desc";

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          merchantProducts: {
            where: { isActive: true },
            take: 1,
            select: {
              id: true,
              basePrice: true,
              mrp: true,
              bulkTiers: true,
              merchant: { select: { id: true, businessName: true } },
            },
          },
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

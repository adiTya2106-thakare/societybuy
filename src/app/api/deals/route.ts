import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const societyId = searchParams.get("societyId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "12"), 50);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      endsAt: { gt: new Date() },
      status: status ? { equals: status } : { in: ["OPEN", "QUALIFIED", "SCHEDULED"] },
    };
    if (societyId) where.societyId = societyId;

    const [total, deals] = await Promise.all([
      prisma.bulkDeal.count({ where }),
      prisma.bulkDeal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { endsAt: "asc" },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrls: true,
              brand: true,
            },
          },
          tiers: { orderBy: { minQty: "asc" } },
          society: { select: { id: true, name: true } },
          _count: { select: { commitments: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: deals,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/deals]", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

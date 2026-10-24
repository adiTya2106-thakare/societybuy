import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== "PLATFORM_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalOrders,
    totalRevenue,
    activeDeals,
    completedDeals,
    pendingMerchants,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalAmount: true },
    }),
    prisma.bulkDeal.count({ where: { status: { in: ["OPEN", "QUALIFIED"] } } }),
    prisma.bulkDeal.count({ where: { status: "COMPLETED" } }),
    prisma.merchant.count({ where: { status: "PENDING_VERIFICATION" } }),
  ]);

  return NextResponse.json({
    data: {
      totalUsers,
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.totalAmount ?? 0),
      activeDeals,
      completedDeals,
      pendingMerchants,
    },
  });
}

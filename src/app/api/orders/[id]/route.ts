import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { notificationService } from "@/lib/notifications";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: { select: { name: true, imageUrls: true } } } },
        payment: true,
        address: true,
        invoice: true,
        statusHistory: { orderBy: { createdAt: "asc" } },
        merchant: { select: { businessName: true, phone: true } },
        deal: { select: { title: true, status: true } },
        assignments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { partner: { select: { name: true, phone: true } } },
        },
      },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Authorization: owner, merchant, admin
    const isOwner = order.userId === session.user.id;
    const sessionRole = (session.user as { role?: string }).role;
    const isAdmin = sessionRole === "PLATFORM_ADMIN";
    const isMerchantUser =
      sessionRole === "MERCHANT" &&
      (await prisma.merchant.findFirst({
        where: { userId: session.user.id, id: order.merchantId ?? undefined },
      }));

    if (!isOwner && !isAdmin && !isMerchantUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ data: order });
  } catch (error) {
    console.error("[GET /api/orders/[id]]", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(request.url);
  if (!url.pathname.endsWith("/cancel")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const cancellableStatuses = ["PENDING_PAYMENT", "CONFIRMED", "PROCESSING"];
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: "Order cannot be cancelled at this stage" },
        { status: 422 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      });
      await tx.orderStatusHistory.create({
        data: {
          orderId: id,
          status: "CANCELLED",
          note: "Cancelled by customer",
          updatedBy: session.user.id,
        },
      });

      // Release inventory reservations
      for (const item of order.items) {
        const mp = await tx.merchantProduct.findFirst({
          where: { productId: item.productId },
          include: { inventory: true },
        });
        if (mp?.inventory) {
          await tx.inventory.update({
            where: { merchantProductId: mp.id },
            data: {
              reservedQty: { decrement: Number(item.qty) },
              availableQty: { increment: Number(item.qty) },
            },
          });
        }
      }
    });

    await notificationService.send(session.user.id, {
      type: "ORDER_CONFIRMED",
      title: "Order Cancelled",
      body: `Your order #${order.orderNumber} has been cancelled.`,
      data: { orderId: id },
    });

    return NextResponse.json({ message: "Order cancelled" });
  } catch (error) {
    console.error("[POST /api/orders/[id]/cancel]", error);
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
  }
}

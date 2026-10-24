import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { generateOrderNumber, generateInvoiceNumber } from "@/lib/utils";
import { calculateOrderTotal } from "@/lib/pricing";
import { notificationService } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { addressId, deliveryType = "HOME_DELIVERY", societyId, couponCode, notes } = body;

    // 1. Get cart
    const cart = await prisma.shoppingCart.findUnique({
      where: { userId: session.user!.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                merchantProducts: {
                  where: { isActive: true },
                  take: 1,
                  include: { inventory: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Validate each item
    const orderItems: Array<{
      productId: string;
      productName: string;
      qty: number;
      unitPrice: number;
      mrp: number;
      totalPrice: number;
      imageUrl?: string;
    }> = [];

    for (const item of cart.items) {
      const mp = item.product.merchantProducts[0];
      if (!mp) {
        return NextResponse.json(
          { error: `${item.product.name} is no longer available` },
          { status: 422 }
        );
      }

      const availableQty = mp.inventory ? Number(mp.inventory.availableQty) : 0;
      if (availableQty < Number(item.qty)) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}` },
          { status: 422 }
        );
      }

      const unitPrice = Number(mp.basePrice);
      orderItems.push({
        productId: item.productId,
        productName: item.product.name,
        qty: Number(item.qty),
        unitPrice,
        mrp: Number(mp.mrp),
        totalPrice: unitPrice * Number(item.qty),
        imageUrl: item.product.imageUrls[0],
      });
    }

    // 3. Calculate totals server-side
    const totals = calculateOrderTotal(
      orderItems.map((i) => ({ qty: i.qty, unitPrice: i.unitPrice })),
      deliveryType === "HOME_DELIVERY" ? 40 : 0,
      0,
      0,
      0
    );

    // 4. Create order transactionally
    const orderNumber = generateOrderNumber();
    const invoiceNumber = generateInvoiceNumber();

    const merchantId = cart.items[0].product.merchantProducts[0]?.merchantId;

    const order = await prisma.$transaction(async (tx: typeof prisma) => {
      const o = await tx.order.create({
        data: {
          userId: session.user!.id,
          merchantId,
          addressId,
          societyId,
          orderNumber,
          status: "PENDING_PAYMENT",
          deliveryType,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          taxAmount: totals.taxAmount,
          deliveryFee: totals.deliveryFee,
          serviceFee: totals.serviceFee,
          totalAmount: totals.totalAmount,
          couponCode,
          notes,
          items: {
            create: orderItems.map((i) => ({
              productId: i.productId,
              productName: i.productName,
              qty: i.qty,
              unitPrice: i.unitPrice,
              mrp: i.mrp,
              totalPrice: i.totalPrice,
              imageUrl: i.imageUrl,
            })),
          },
          statusHistory: {
            create: {
              status: "PENDING_PAYMENT",
              note: "Order created",
              updatedBy: session.user!.id,
            },
          },
        },
      });

      // Reserve inventory
      for (const item of cart.items) {
        const mp = item.product.merchantProducts[0];
        if (mp?.inventory) {
          await tx.inventory.update({
            where: { merchantProductId: mp.id },
            data: {
              reservedQty: { increment: Number(item.qty) },
              availableQty: { decrement: Number(item.qty) },
            },
          });
        }
      }

      // Create invoice
      await tx.invoice.create({
        data: {
          orderId: o.id,
          invoiceNumber,
          subtotal: totals.subtotal,
          taxAmount: totals.taxAmount,
          discountAmount: totals.discountAmount,
          totalAmount: totals.totalAmount,
        },
      });

      return o;
    });

    // 5. Notify
    await notificationService.send(session.user!.id, {
      type: "ORDER_CONFIRMED",
      title: "Order Placed!",
      body: `Your order #${orderNumber} has been placed. Complete payment to confirm.`,
      data: { orderId: order.id },
    });

    return NextResponse.json(
      { message: "Order created", data: { orderId: order.id, orderNumber, totalAmount: totals.totalAmount } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10"), 50);
  const skip = (page - 1) * limit;

  try {
    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId: session.user!.id } }),
      prisma.order.findMany({
        where: { userId: session.user!.id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: { take: 3, select: { productName: true, qty: true, unitPrice: true, imageUrl: true } },
          payment: { select: { status: true, method: true } },
        },
      }),
    ]);

    return NextResponse.json({
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/orders]", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}


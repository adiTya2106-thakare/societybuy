import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { paymentService } from "@/lib/payments/service";
import { notificationService } from "@/lib/notifications";

// POST /api/payments/verify — verify and finalize payment
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderId, gatewayOrderId, gatewayPaymentId, gatewaySignature } = await request.json();

    if (!orderId || !gatewayOrderId || !gatewayPaymentId || !gatewaySignature) {
      return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
    }

    // Idempotency check
    const idempotencyKey = `payment_verify_${orderId}`;
    const existing = await prisma.idempotencyRecord.findUnique({ where: { key: idempotencyKey } });
    if (existing && new Date() < existing.expiresAt) {
      return NextResponse.json(existing.response, { status: existing.statusCode });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== session.user!.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "CONFIRMED") {
      return NextResponse.json({ message: "Payment already confirmed", data: { orderId } });
    }

    const isValid = await paymentService.verifyPayment({
      orderId,
      gatewayOrderId,
      gatewayPaymentId,
      gatewaySignature,
    });

    if (!isValid) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAYMENT_FAILED" },
      });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 422 });
    }

    // Confirm order
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });
      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: "CONFIRMED",
          note: "Payment verified",
          updatedBy: session.user!.id,
        },
      });
      // Clear cart after successful payment
      const cart = await tx.shoppingCart.findUnique({ where: { userId: session.user!.id } });
      if (cart) {
        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      }
    });

    await notificationService.send(session.user!.id, {
      type: "PAYMENT_SUCCESS",
      title: "Payment Confirmed ✓",
      body: `Your payment for order #${order.orderNumber} is confirmed. We're preparing your order.`,
      data: { orderId },
    });

    const responseData = { message: "Payment confirmed", data: { orderId, orderNumber: order.orderNumber } };

    // Store idempotency record
    await prisma.idempotencyRecord.create({
      data: {
        key: idempotencyKey,
        response: responseData,
        statusCode: 200,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("[POST /api/payments/verify]", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}


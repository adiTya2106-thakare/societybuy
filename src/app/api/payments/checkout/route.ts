import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { paymentService } from "@/lib/payments/service";
import { notificationService } from "@/lib/notifications";

// POST /api/payments/checkout — create payment order
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderId } = await request.json();

    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json({ error: "Order is not awaiting payment" }, { status: 422 });
    }

    const paymentOrder = await paymentService.createOrder(
      orderId,
      Number(order.totalAmount)
    );

    return NextResponse.json({
      data: {
        ...paymentOrder,
        isDevMode: paymentService.isDevMode(),
        devModeNote: paymentService.isDevMode()
          ? "DEVELOPMENT MODE: Use gatewaySignature='simulated_success' to simulate payment."
          : undefined,
      },
    });
  } catch (error) {
    console.error("[POST /api/payments/checkout]", error);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}

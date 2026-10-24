/**
 * Payment Service
 * Provider-agnostic wrapper. Uses dev simulator when gateway keys are absent.
 * NEVER marks an order paid without verified provider response.
 */

import { prisma } from "@/lib/db";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

const isDevMode =
  process.env.PAYMENT_DEV_MODE === "true" ||
  !process.env.RAZORPAY_KEY_ID;

export interface PaymentOrder {
  gatewayOrderId: string;
  amount: number;
  currency: string;
  isSimulated: boolean;
}

export interface VerifyPaymentInput {
  orderId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
}

export const paymentService = {
  /**
   * Create a payment order with the configured gateway.
   */
  async createOrder(
    internalOrderId: string,
    amountInRupees: number,
    currency = "INR"
  ): Promise<PaymentOrder> {
    if (isDevMode) {
      const gatewayOrderId = `sim_order_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      await prisma.payment.upsert({
        where: { orderId: internalOrderId },
        update: {
          gatewayOrderId,
          amount: amountInRupees,
          isSimulated: true,
          status: PaymentStatus.PENDING,
        },
        create: {
          orderId: internalOrderId,
          userId: (
            await prisma.order.findUniqueOrThrow({
              where: { id: internalOrderId },
              select: { userId: true },
            })
          ).userId,
          amount: amountInRupees,
          currency,
          gatewayOrderId,
          isSimulated: true,
          method: PaymentMethod.SIMULATED,
          status: PaymentStatus.PENDING,
        },
      });
      return { gatewayOrderId, amount: amountInRupees, currency, isSimulated: true };
    }

    // Razorpay integration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { default: Razorpay } = await import("razorpay" as any).catch(() => {
      throw new Error("Razorpay SDK not installed");
    });
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100), // paise
      currency,
      receipt: internalOrderId,
    });

    await prisma.payment.upsert({
      where: { orderId: internalOrderId },
      update: {
        gatewayOrderId: rzpOrder.id,
        amount: amountInRupees,
        isSimulated: false,
        status: PaymentStatus.PENDING,
      },
      create: {
        orderId: internalOrderId,
        userId: (
          await prisma.order.findUniqueOrThrow({
            where: { id: internalOrderId },
            select: { userId: true },
          })
        ).userId,
        amount: amountInRupees,
        currency,
        gatewayOrderId: rzpOrder.id,
        isSimulated: false,
        method: PaymentMethod.UPI,
        status: PaymentStatus.PENDING,
      },
    });

    return {
      gatewayOrderId: rzpOrder.id,
      amount: amountInRupees,
      currency,
      isSimulated: false,
    };
  },

  /**
   * Verify payment signature. Returns true only on genuine verification.
   * For simulated payments in dev mode, accepts specific test values.
   */
  async verifyPayment(input: VerifyPaymentInput): Promise<boolean> {
    const payment = await prisma.payment.findUnique({
      where: { orderId: input.orderId },
    });
    if (!payment) return false;

    if (payment.isSimulated) {
      // Dev-mode: accept simulated_success signature only
      const isValid = input.gatewaySignature === "simulated_success";
      if (isValid) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.COMPLETED,
            gatewayPaymentId: input.gatewayPaymentId,
            gatewaySignature: input.gatewaySignature,
          },
        });
      }
      return isValid;
    }

    // Razorpay signature verification
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${input.gatewayOrderId}|${input.gatewayPaymentId}`)
      .digest("hex");

    const isValid = expectedSignature === input.gatewaySignature;
    if (isValid) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          gatewayPaymentId: input.gatewayPaymentId,
          gatewaySignature: input.gatewaySignature,
        },
      });
    }
    return isValid;
  },

  isDevMode: () => isDevMode,
};

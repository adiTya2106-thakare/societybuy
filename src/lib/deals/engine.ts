/**
 * Bulk Deal Engine
 * Handles state transitions, demand aggregation, tier selection,
 * concurrency-safe commitment operations.
 */

import { prisma } from "@/lib/db";
import { DealStatus, CommitmentStatus } from "@prisma/client";
import { getApplicableTier } from "@/lib/pricing";
import { notificationService } from "@/lib/notifications";

export type DealTransition =
  | "PUBLISH"
  | "OPEN"
  | "QUALIFY"
  | "START_FULFILLING"
  | "COMPLETE"
  | "FAIL"
  | "CANCEL";

const VALID_TRANSITIONS: Record<string, DealTransition[]> = {
  DRAFT: ["PUBLISH", "CANCEL"],
  SCHEDULED: ["OPEN", "CANCEL"],
  OPEN: ["QUALIFY", "FAIL", "CANCEL"],
  QUALIFIED: ["START_FULFILLING", "FAIL", "CANCEL"],
  FULFILLING: ["COMPLETE", "FAIL"],
  COMPLETED: [],
  FAILED: [],
  CANCELLED: [],
};

const TRANSITION_STATUS: Record<DealTransition, string> = {
  PUBLISH: "SCHEDULED",
  OPEN: "OPEN",
  QUALIFY: "QUALIFIED",
  START_FULFILLING: "FULFILLING",
  COMPLETE: "COMPLETED",
  FAIL: "FAILED",
  CANCEL: "CANCELLED",
};

/**
 * Calculate the current aggregate demand from ACTIVE commitments only.
 */
export async function getDealCurrentQty(dealId: string): Promise<number> {
  const result = await prisma.dealCommitment.aggregate({
    where: { dealId, status: CommitmentStatus.ACTIVE },
    _sum: { qty: true },
  });
  return Number(result._sum.qty ?? 0);
}

/**
 * Calculate the applicable qualified price based on current demand and tiers.
 */
export async function getDealQualifiedPrice(
  dealId: string,
  currentQty: number
): Promise<number | null> {
  const tiers = await prisma.bulkDealTier.findMany({
    where: { dealId },
    orderBy: { minQty: "asc" },
  });

  const tier = getApplicableTier(
    currentQty,
    tiers.map((t: { minQty: unknown; maxQty: unknown; price: unknown }) => ({
      minQty: Number(t.minQty),
      maxQty: t.maxQty ? Number(t.maxQty) : undefined,
      price: Number(t.price),
    }))
  );

  return tier ? tier.price : null;
}

/**
 * Attempt a deal state transition — validates current state, applies transition.
 */
export async function transitionDeal(
  dealId: string,
  transition: DealTransition,
  actorId?: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const deal = await tx.bulkDeal.findUniqueOrThrow({ where: { id: dealId } });

    if (!VALID_TRANSITIONS[deal.status].includes(transition)) {
      throw new Error(
        `Cannot apply '${transition}' to deal in '${deal.status}' state`
      );
    }

    const newStatus = TRANSITION_STATUS[transition];
    let extraFields: Record<string, unknown> = {};

    if (transition === "QUALIFY") {
      const currentQty = await getDealCurrentQty(dealId);
      const qualifiedPrice = await getDealQualifiedPrice(dealId, currentQty);
      extraFields = {
        currentQty,
        qualifiedPrice: qualifiedPrice ?? deal.basePrice,
      };
    }

    await tx.bulkDeal.update({
      where: { id: dealId },
      data: { status: newStatus, ...extraFields },
    });

    await tx.auditLog.create({
      data: {
        userId: actorId,
        action: `DEAL_${transition}`,
        entity: "BulkDeal",
        entityId: dealId,
        newValues: { status: newStatus },
      },
    });
  });
}

/**
 * Commit a resident's quantity to a deal.
 * Concurrency-safe using a unique constraint + upsert.
 */
export async function commitToDeal(
  dealId: string,
  userId: string,
  qty: number
): Promise<{ success: boolean; message: string }> {
  return await prisma.$transaction(async (tx) => {
    // Lock the deal row
    const deal = await tx.$queryRaw<Array<{ id: string; status: DealStatus; max_qty: number | null; current_qty: number }>>`
      SELECT id, status, max_qty, current_qty FROM bulk_deals WHERE id = ${dealId} FOR UPDATE
    `;

    const d = deal[0];
    if (!d) return { success: false, message: "Deal not found" };
    if (d.status !== "OPEN" && d.status !== "QUALIFIED") {
      return { success: false, message: "Deal is not accepting commitments" };
    }

    // Check max qty
    if (d.max_qty != null) {
      const currentQty = await getDealCurrentQty(dealId);
      if (currentQty + qty > d.max_qty) {
        return {
          success: false,
          message: `Only ${d.max_qty - currentQty} units available`,
        };
      }
    }

    // Upsert commitment
    await tx.dealCommitment.upsert({
      where: { dealId_userId: { dealId, userId } },
      update: { qty, status: CommitmentStatus.ACTIVE },
      create: { dealId, userId, qty, status: CommitmentStatus.ACTIVE },
    });

    // Update current qty
    const newQty = await getDealCurrentQty(dealId);
    await tx.bulkDeal.update({
      where: { id: dealId },
      data: { currentQty: newQty },
    });

    return { success: true, message: "Commitment recorded successfully" };
  });
}

/**
 * Cancel a resident's commitment from a deal.
 */
export async function cancelCommitment(
  dealId: string,
  userId: string
): Promise<{ success: boolean; message: string }> {
  return await prisma.$transaction(async (tx) => {
    const commitment = await tx.dealCommitment.findUnique({
      where: { dealId_userId: { dealId, userId } },
      include: { deal: true },
    });

    if (!commitment) return { success: false, message: "Commitment not found" };
    if (commitment.status !== CommitmentStatus.ACTIVE) {
      return { success: false, message: "Commitment is not active" };
    }

    const deal = commitment.deal;
    if (
      deal.status === "FULFILLING" ||
      deal.status === "COMPLETED" ||
      deal.status === "FAILED"
    ) {
      return {
        success: false,
        message: "Cannot cancel after fulfillment has started",
      };
    }

    await tx.dealCommitment.update({
      where: { id: commitment.id },
      data: { status: CommitmentStatus.CANCELLED },
    });

    const newQty = await getDealCurrentQty(dealId);
    await tx.bulkDeal.update({
      where: { id: dealId },
      data: { currentQty: newQty },
    });

    return { success: true, message: "Commitment cancelled" };
  });
}

/**
 * Check whether a deal has reached its minimum threshold; if so, auto-qualify.
 */
export async function checkAndQualifyDeal(dealId: string): Promise<void> {
  const deal = await prisma.bulkDeal.findUnique({ where: { id: dealId } });
  if (!deal || deal.status !== "OPEN") return;

  const currentQty = await getDealCurrentQty(dealId);
  if (currentQty >= Number(deal.minQty)) {
    await transitionDeal(dealId, "QUALIFY");
    // Notify all committed users
    const commitments = await prisma.dealCommitment.findMany({
      where: { dealId, status: CommitmentStatus.ACTIVE },
      select: { userId: true },
    });
    for (const { userId } of commitments) {
      await notificationService.send(userId, {
        type: "DEAL_QUALIFIED" as any,
        title: "🎉 Bulk Deal Qualified!",
        body: `${deal.title} has reached its minimum quantity. Get ready for great savings!`,
        data: { dealId },
      });
    }
  }
}

/**
 * Handle deal deadline expiry — called by a scheduled job.
 */
export async function handleDealDeadline(dealId: string): Promise<void> {
  const deal = await prisma.bulkDeal.findUnique({ where: { id: dealId } });
  if (!deal) return;
  if (deal.status !== "OPEN" && deal.status !== "QUALIFIED") return;

  const currentQty = await getDealCurrentQty(dealId);
  if (currentQty < Number(deal.minQty)) {
    // Fail the deal, cancel all active commitments
    await prisma.$transaction(async (tx) => {
      await tx.bulkDeal.update({
        where: { id: dealId },
        data: { status: "FAILED" },
      });
      await tx.dealCommitment.updateMany({
        where: { dealId, status: CommitmentStatus.ACTIVE },
        data: { status: CommitmentStatus.EXPIRED },
      });
    });
  } else if (deal.status === "QUALIFIED") {
    await transitionDeal(dealId, "START_FULFILLING");
  }
}



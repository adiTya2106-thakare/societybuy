/**
 * Pricing Engine — all calculations happen server-side.
 * Uses integer paise internally to avoid floating-point errors.
 */

export interface BulkTier {
  minQty: number;
  maxQty?: number | null;
  price: number;
}

export interface PricingInput {
  unitPrice: number;          // base price from merchant
  mrp: number;                // maximum retail price for savings calc
  qty: number;
  bulkTiers?: BulkTier[];
  couponDiscount?: number;    // fixed INR amount off
  taxRatePercent?: number;    // GST %
  deliveryFee?: number;
  serviceFee?: number;
}

export interface PricingResult {
  unitPrice: number;          // effective price per unit (bulk or base)
  mrp: number;
  isBulkPriced: boolean;
  appliedTierLabel?: string;
  subtotal: number;           // unitPrice × qty
  couponDiscount: number;
  taxableAmount: number;
  taxAmount: number;
  deliveryFee: number;
  serviceFee: number;
  totalAmount: number;
  savingsVsMrp: number;       // potential savings vs MRP × qty
  savingsVsBase: number;      // savings vs base price × qty (bulk benefit)
}

function toPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

function toRupees(paise: number): number {
  return paise / 100;
}

export function getApplicableTier(
  qty: number,
  tiers: BulkTier[]
): BulkTier | null {
  if (!tiers.length) return null;
  const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty);
  for (const tier of sorted) {
    if (qty >= tier.minQty) {
      if (tier.maxQty == null || qty <= tier.maxQty) {
        return tier;
      }
    }
  }
  return null;
}

export function calculatePricing(input: PricingInput): PricingResult {
  const {
    unitPrice,
    mrp,
    qty,
    bulkTiers = [],
    couponDiscount = 0,
    taxRatePercent = 0,
    deliveryFee = 0,
    serviceFee = 0,
  } = input;

  const applicableTier = getApplicableTier(qty, bulkTiers);
  const effectiveUnitPrice = applicableTier ? applicableTier.price : unitPrice;
  const isBulkPriced = !!applicableTier;

  // All arithmetic in paise
  const subtotalPaise = toPaise(effectiveUnitPrice) * qty;
  const couponDiscountPaise = Math.min(toPaise(couponDiscount), subtotalPaise);
  const taxableAmountPaise = Math.max(0, subtotalPaise - couponDiscountPaise);
  const taxAmountPaise = Math.round((taxableAmountPaise * taxRatePercent) / 100);
  const deliveryFeePaise = toPaise(deliveryFee);
  const serviceFeePaise = toPaise(serviceFee);

  const totalPaise =
    taxableAmountPaise +
    taxAmountPaise +
    deliveryFeePaise +
    serviceFeePaise;

  // Savings
  const savingsVsMrpPaise = Math.max(
    0,
    (toPaise(mrp) - toPaise(effectiveUnitPrice)) * qty
  );
  const savingsVsBasePaise = isBulkPriced
    ? Math.max(0, (toPaise(unitPrice) - toPaise(effectiveUnitPrice)) * qty)
    : 0;

  return {
    unitPrice: effectiveUnitPrice,
    mrp,
    isBulkPriced,
    appliedTierLabel: applicableTier
      ? `${applicableTier.minQty}+ units`
      : undefined,
    subtotal: toRupees(subtotalPaise),
    couponDiscount: toRupees(couponDiscountPaise),
    taxableAmount: toRupees(taxableAmountPaise),
    taxAmount: toRupees(taxAmountPaise),
    deliveryFee,
    serviceFee,
    totalAmount: toRupees(totalPaise),
    savingsVsMrp: toRupees(savingsVsMrpPaise),
    savingsVsBase: toRupees(savingsVsBasePaise),
  };
}

export function calculateOrderTotal(
  items: Array<{ qty: number; unitPrice: number; discount?: number }>,
  deliveryFee = 0,
  serviceFee = 0,
  taxRatePercent = 0,
  couponDiscount = 0
): {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  serviceFee: number;
  couponDiscount: number;
  totalAmount: number;
} {
  const subtotalPaise = items.reduce((acc, item) => {
    const discountedUnit = toPaise(item.unitPrice) - toPaise(item.discount ?? 0);
    return acc + discountedUnit * item.qty;
  }, 0);

  const couponDiscountPaise = Math.min(toPaise(couponDiscount), subtotalPaise);
  const taxableAmountPaise = Math.max(0, subtotalPaise - couponDiscountPaise);
  const taxAmountPaise = Math.round((taxableAmountPaise * taxRatePercent) / 100);
  const deliveryFeePaise = toPaise(deliveryFee);
  const serviceFeePaise = toPaise(serviceFee);

  const totalPaise =
    taxableAmountPaise + taxAmountPaise + deliveryFeePaise + serviceFeePaise;

  const totalItemDiscount = items.reduce(
    (acc, item) => acc + toPaise(item.discount ?? 0) * item.qty,
    0
  );

  return {
    subtotal: toRupees(subtotalPaise),
    discountAmount: toRupees(totalItemDiscount),
    taxAmount: toRupees(taxAmountPaise),
    deliveryFee,
    serviceFee,
    couponDiscount: toRupees(couponDiscountPaise),
    totalAmount: toRupees(totalPaise),
  };
}

import { describe, it, expect } from "vitest";
import { calculatePricing, getApplicableTier } from "@/lib/pricing";

describe("Pricing Engine", () => {
  it("returns base price when no tiers apply", () => {
    const result = calculatePricing({
      unitPrice: 100,
      mrp: 120,
      qty: 5,
      bulkTiers: [],
    });
    expect(result.unitPrice).toBe(100);
    expect(result.isBulkPriced).toBe(false);
    expect(result.subtotal).toBe(500);
    expect(result.savingsVsMrp).toBe(100);
  });

  it("applies the correct bulk tier", () => {
    const tiers = [
      { minQty: 10, price: 90 },
      { minQty: 50, price: 80 },
      { minQty: 100, price: 70 },
    ];

    const result = calculatePricing({
      unitPrice: 100,
      mrp: 120,
      qty: 55,
      bulkTiers: tiers,
    });

    expect(result.isBulkPriced).toBe(true);
    expect(result.unitPrice).toBe(80);
    expect(result.subtotal).toBe(55 * 80);
  });

  it("applies highest qualifying tier, not just first", () => {
    const tiers = [
      { minQty: 10, price: 90 },
      { minQty: 100, price: 70 },
    ];

    const result = calculatePricing({ unitPrice: 100, mrp: 120, qty: 150, bulkTiers: tiers });
    expect(result.unitPrice).toBe(70);
  });

  it("does not apply tier when qty is below minimum", () => {
    const tiers = [{ minQty: 50, price: 80 }];
    const result = calculatePricing({ unitPrice: 100, mrp: 120, qty: 10, bulkTiers: tiers });
    expect(result.isBulkPriced).toBe(false);
    expect(result.unitPrice).toBe(100);
  });

  it("prevents negative totals from excessive coupon", () => {
    const result = calculatePricing({
      unitPrice: 50,
      mrp: 60,
      qty: 2,
      couponDiscount: 999, // way more than total
    });
    expect(result.totalAmount).toBeGreaterThanOrEqual(0);
    expect(result.couponDiscount).toBeLessThanOrEqual(result.subtotal);
  });

  it("calculates tax correctly", () => {
    const result = calculatePricing({
      unitPrice: 100,
      mrp: 120,
      qty: 10,
      taxRatePercent: 18,
    });
    expect(result.taxAmount).toBeCloseTo(180, 0);
    expect(result.totalAmount).toBeGreaterThan(result.subtotal);
  });

  it("correctly calculates savings vs MRP", () => {
    const result = calculatePricing({ unitPrice: 80, mrp: 100, qty: 10 });
    expect(result.savingsVsMrp).toBe(200); // (100-80)*10
  });
});

describe("getApplicableTier", () => {
  it("returns null when no tiers", () => {
    expect(getApplicableTier(100, [])).toBeNull();
  });

  it("returns highest qualifying tier", () => {
    const tiers = [
      { minQty: 10, price: 90 },
      { minQty: 50, price: 80 },
      { minQty: 100, price: 70 },
    ];
    const tier = getApplicableTier(75, tiers);
    expect(tier?.price).toBe(80);
  });

  it("returns null when qty below all minimums", () => {
    const tiers = [{ minQty: 100, price: 70 }];
    expect(getApplicableTier(50, tiers)).toBeNull();
  });
});

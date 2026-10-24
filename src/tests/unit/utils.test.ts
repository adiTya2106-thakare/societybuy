import { describe, it, expect } from "vitest";
import { slugify, generateOrderNumber, generateInvoiceNumber, dealProgressPercent, timeUntil } from "@/lib/utils";

describe("slugify", () => {
  it("converts to lowercase with hyphens", () => {
    expect(slugify("Sunrise Apartments")).toBe("sunrise-apartments");
  });
  it("removes special characters", () => {
    expect(slugify("Hello, World! 2024")).toBe("hello-world-2024");
  });
  it("handles multiple spaces", () => {
    expect(slugify("a  b  c")).toBe("a-b-c");
  });
});

describe("generateOrderNumber", () => {
  it("generates a string", () => {
    const n = generateOrderNumber();
    expect(typeof n).toBe("string");
    expect(n.startsWith("SB")).toBe(true);
  });

  it("generates unique numbers for sequential calls", () => {
    const nums = Array.from({ length: 20 }, () => generateOrderNumber());
    const set = new Set(nums);
    expect(set.size).toBe(20);
  });
});

describe("dealProgressPercent", () => {
  it("returns 0 when current is 0", () => {
    expect(dealProgressPercent(0, 100)).toBe(0);
  });
  it("returns 100 when current equals target", () => {
    expect(dealProgressPercent(100, 100)).toBe(100);
  });
  it("caps at 100 when over target", () => {
    expect(dealProgressPercent(150, 100)).toBe(100);
  });
  it("returns correct percentage", () => {
    expect(dealProgressPercent(50, 200)).toBe(25);
  });
  it("handles zero target gracefully", () => {
    expect(dealProgressPercent(10, 0)).toBe(0);
  });
});

import { describe, expect, it } from "vitest";
import { buildQuoteFromPreset, RATE_PRESETS } from "@/data/presets";
import {
  calculateQuoteBreakdown,
  formatCurrency,
  generateClientPitchEmail,
  generateQuoteSummary,
} from "@/lib/pricingMath";

describe("RateCraft Pricing Math & Viral Exports", () => {
  it("computes hidden underpricing gap and 3 anchored package tiers", () => {
    const doc = buildQuoteFromPreset(RATE_PRESETS[0]);
    doc.inputs = {
      estimatedHours: 20,
      hourlyBaseline: 100,
      complexity: "moderate",
      adminBufferPercent: 20,
      directExpenses: 200,
      desiredMarginPercent: 25,
      valueMultiplier: 1.1,
    };

    const breakdown = calculateQuoteBreakdown(doc.inputs, doc.tiers);
    expect(breakdown.naiveHourlyTotal).toBe(2000);
    expect(breakdown.recommendedStandardPrice).toBeGreaterThan(2500);
    expect(breakdown.hiddenUnderpricingGap).toBe(
      breakdown.recommendedStandardPrice - breakdown.naiveHourlyTotal
    );

    const [basic, std, prem] = breakdown.packages;
    expect(basic.price).toBeLessThan(std.price);
    expect(std.price).toBe(breakdown.recommendedStandardPrice);
    expect(prem.price).toBeGreaterThan(std.price);
  });

  it("includes viral attribution in free summary and omits it in Pro", () => {
    const doc = buildQuoteFromPreset(RATE_PRESETS[0]);
    const freeSummary = generateQuoteSummary(doc, false);
    const proSummary = generateQuoteSummary(doc, true);

    expect(freeSummary).toContain("Calculated with RateCraft");
    expect(proSummary).not.toContain("Calculated with RateCraft");

    const email = generateClientPitchEmail(doc);
    expect(email).toContain("Recommended");
    expect(formatCurrency(1500)).toBe("$1,500");
  });
});

import { describe, expect, it } from "vitest";
import { RATE_PRESETS } from "@/data/presets";

describe("RateCraft 30 Industry Presets", () => {
  it("contains 30 unique presets with valid tiers, FAQs, and ScopeCraft handoff slugs", () => {
    expect(RATE_PRESETS).toHaveLength(30);

    const slugs = new Set<string>();
    const titles = new Set<string>();

    for (const p of RATE_PRESETS) {
      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);
      expect(titles.has(p.metaTitle)).toBe(false);
      titles.add(p.metaTitle);
      expect(p.tiers).toHaveLength(3);
      expect(p.underpricingTraps).toHaveLength(3);
      expect(p.faqs).toHaveLength(3);
      expect(p.scopeCraftSlug.length).toBeGreaterThan(5);
    }
  });
});

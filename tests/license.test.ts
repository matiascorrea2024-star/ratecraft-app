import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BILLING_PLANS, PAYPAL_ME_BASE } from "@/config/billing";
import { isValidLicenseFormat, verifyLicenseKeyClient } from "@/lib/license";

describe("RateCraft License Engine & PayPal Config", () => {
  it("connects directly to paypal.me/craftappstudio/12USD and /59USD without Mercado Pago", () => {
    expect(PAYPAL_ME_BASE).toBe("https://paypal.me/craftappstudio");
    expect(BILLING_PLANS.monthly.checkoutUrl).toBe("https://paypal.me/craftappstudio/12USD");
    expect(BILLING_PLANS.annual.checkoutUrl).toBe("https://paypal.me/craftappstudio/59USD");
    expect(JSON.stringify(BILLING_PLANS).toLowerCase()).not.toContain("mercadopago");
  });

  it("validates generated RC-PRO keys and rejects fake keys", async () => {
    const keys = fs
      .readFileSync(path.join(process.cwd(), "launch_kit", "license_keys_500.txt"), "utf8")
      .trim()
      .split("\n");
    expect(keys.length).toBe(500);

    for (const key of [keys[0], keys[250], keys[499]]) {
      expect(isValidLicenseFormat(key)).toBe(true);
      const res = await verifyLicenseKeyClient(key.toLowerCase());
      expect(res.valid).toBe(true);
    }

    const fake = await verifyLicenseKeyClient("RC-PRO-AAAA-AAAA-AAAA");
    expect(fake.valid).toBe(false);
  });
});

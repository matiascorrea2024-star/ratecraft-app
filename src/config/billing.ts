export type BillingProvider = "paypal_me" | "payhip" | "paypal_subscriptions";
export type PlanId = "monthly" | "annual";

export interface BillingPlan {
  id: PlanId;
  name: string;
  priceUsd: number;
  intervalLabel: string;
  badge?: string;
  description: string;
  checkoutUrl: string;
  paypalNoteTemplate: string;
}

export const PAYPAL_ME_BASE = "https://paypal.me/craftappstudio";

export const BILLING_PROVIDER: BillingProvider =
  (process.env.NEXT_PUBLIC_BILLING_PROVIDER as BillingProvider | undefined) ??
  "paypal_me";

const PAYHIP_MONTHLY_URL =
  process.env.NEXT_PUBLIC_PAYHIP_MONTHLY_URL ?? `${PAYPAL_ME_BASE}/12USD`;
const PAYHIP_ANNUAL_URL =
  process.env.NEXT_PUBLIC_PAYHIP_ANNUAL_URL ?? `${PAYPAL_ME_BASE}/59USD`;

const PAYPAL_SUB_MONTHLY_URL =
  process.env.NEXT_PUBLIC_PAYPAL_SUB_MONTHLY_URL ?? `${PAYPAL_ME_BASE}/12USD`;
const PAYPAL_SUB_ANNUAL_URL =
  process.env.NEXT_PUBLIC_PAYPAL_SUB_ANNUAL_URL ?? `${PAYPAL_ME_BASE}/59USD`;

function resolveCheckoutUrl(plan: PlanId): string {
  if (BILLING_PROVIDER === "payhip") {
    return plan === "monthly" ? PAYHIP_MONTHLY_URL : PAYHIP_ANNUAL_URL;
  }
  if (BILLING_PROVIDER === "paypal_subscriptions") {
    return plan === "monthly" ? PAYPAL_SUB_MONTHLY_URL : PAYPAL_SUB_ANNUAL_URL;
  }
  return plan === "monthly"
    ? `${PAYPAL_ME_BASE}/12USD`
    : `${PAYPAL_ME_BASE}/59USD`;
}

export const BILLING_PLANS: Record<PlanId, BillingPlan> = {
  monthly: {
    id: "monthly",
    name: "RateCraft Pro (30-Day Pass)",
    priceUsd: 12,
    intervalLabel: "/ 30-day pass",
    description:
      "One-time $12 payment (no auto-renewal). Zero watermark, custom studio branding, all 30 pricing presets, and unlimited saved quotes.",
    checkoutUrl: resolveCheckoutUrl("monthly"),
    paypalNoteTemplate: "RateCraft Pro 30-Day ($12) - your@email.com",
  },
  annual: {
    id: "annual",
    name: "RateCraft Pro (365-Day Pass)",
    priceUsd: 59,
    intervalLabel: "/ 365-day pass",
    badge: "Save 59%",
    description:
      "One-time $59 payment (no auto-renewal). Full year of white-label 3-tier quotes and all 30 industry pricing guides.",
    checkoutUrl: resolveCheckoutUrl("annual"),
    paypalNoteTemplate: "RateCraft Pro 365-Day ($59) - your@email.com",
  },
};

export const SUPPORT_EMAIL = "craftappstudio@gmail.com";

import {
  ComplexityLevel,
  CurrencyCode,
  PricingInputs,
  QuoteDocument,
  QuoteTierDefinition,
} from "@/types/pricing";

export interface CalculatedTier extends QuoteTierDefinition {
  price: number;
  effectiveHourly: number;
}

export interface QuoteBreakdown {
  naiveHourlyTotal: number;
  overheadCost: number;
  complexityMultiplier: number;
  directExpenses: number;
  marginAmount: number;
  recommendedStandardPrice: number;
  hiddenUnderpricingGap: number;
  effectiveHourlyRate: number;
  packages: [CalculatedTier, CalculatedTier, CalculatedTier];
}

const COMPLEXITY_MULTIPLIERS: Record<ComplexityLevel, number> = {
  standard: 1.0,
  moderate: 1.2,
  high: 1.45,
  rush: 1.7,
};

export function roundToNearest25(value: number): number {
  return Math.max(50, Math.round(value / 25) * 25);
}

export function calculateQuoteBreakdown(
  inputs: PricingInputs,
  tiers: [QuoteTierDefinition, QuoteTierDefinition, QuoteTierDefinition]
): QuoteBreakdown {
  const hours = Number.isFinite(inputs.estimatedHours)
    ? Math.max(1, inputs.estimatedHours)
    : 1;
  const hourly = Number.isFinite(inputs.hourlyBaseline)
    ? Math.max(10, inputs.hourlyBaseline)
    : 75;
  const bufferPct = Number.isFinite(inputs.adminBufferPercent)
    ? Math.max(0, Math.min(60, inputs.adminBufferPercent))
    : 15;
  const expenses = Number.isFinite(inputs.directExpenses)
    ? Math.max(0, inputs.directExpenses)
    : 0;
  const marginPct = Number.isFinite(inputs.desiredMarginPercent)
    ? Math.max(0, Math.min(80, inputs.desiredMarginPercent))
    : 25;
  const valueMult = Number.isFinite(inputs.valueMultiplier)
    ? Math.max(0.8, Math.min(3.0, inputs.valueMultiplier))
    : 1.1;

  const naiveHourlyTotal = Math.round(hours * hourly);
  const overheadCost = Math.round(naiveHourlyTotal * (bufferPct / 100));
  const complexityMultiplier = COMPLEXITY_MULTIPLIERS[inputs.complexity] ?? 1.0;

  const deliveryBase = (naiveHourlyTotal + overheadCost) * complexityMultiplier + expenses;
  const marginAmount = Math.round(deliveryBase * (marginPct / 100));
  const rawStandard = (deliveryBase + marginAmount) * valueMult;

  const recommendedStandardPrice = roundToNearest25(rawStandard);
  const hiddenUnderpricingGap = Math.max(0, recommendedStandardPrice - naiveHourlyTotal);
  const effectiveHourlyRate = Math.round(recommendedStandardPrice / hours);

  const basicPrice = roundToNearest25(recommendedStandardPrice * 0.72);
  const premiumPrice = roundToNearest25(recommendedStandardPrice * 1.55);

  const packages: [CalculatedTier, CalculatedTier, CalculatedTier] = [
    {
      ...tiers[0],
      price: basicPrice,
      effectiveHourly: Math.round(basicPrice / hours),
    },
    {
      ...tiers[1],
      price: recommendedStandardPrice,
      effectiveHourly: effectiveHourlyRate,
      recommended: true,
    },
    {
      ...tiers[2],
      price: premiumPrice,
      effectiveHourly: Math.round(premiumPrice / hours),
    },
  ];

  return {
    naiveHourlyTotal,
    overheadCost,
    complexityMultiplier,
    directExpenses: expenses,
    marginAmount,
    recommendedStandardPrice,
    hiddenUnderpricingGap,
    effectiveHourlyRate,
    packages,
  };
}

export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const locale = currency === "EUR" ? "en-IE" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateQuoteSummary(doc: QuoteDocument, isPro: boolean): string {
  const breakdown = calculateQuoteBreakdown(doc.inputs, doc.tiers);
  const lines = [
    `3-Tier Project Quote: ${doc.projectTitle}`,
    `Quote #${doc.quoteNumber} | Prepared by ${doc.providerName} for ${doc.clientCompany}`,
    "",
    ...breakdown.packages.map(
      (pkg) =>
        `- ${pkg.name}${pkg.recommended ? " (Recommended)" : ""}: ${formatCurrency(
          pkg.price,
          doc.currency
        )} — ${pkg.tagline} (${pkg.turnaroundLabel}, ${pkg.revisionsLabel})`
    ),
    "",
    `Valid until: ${doc.validUntil}`,
  ];

  if (!isPro) {
    lines.push("", "Calculated with RateCraft · https://ratecraft-app.vercel.app");
  } else if (doc.brand.customFooter.trim()) {
    lines.push("", doc.brand.customFooter.trim());
  }

  return lines.join("\n");
}

export function generateClientPitchEmail(doc: QuoteDocument): string {
  const breakdown = calculateQuoteBreakdown(doc.inputs, doc.tiers);
  const [basic, standard, premium] = breakdown.packages;

  return [
    `Subject: Proposal & 3 Engagement Options — ${doc.projectTitle}`,
    "",
    `Hi ${doc.clientContact.split(",")[0] || "there"},`,
    "",
    `Thanks again for walking through ${doc.projectTitle}. Based on our discussion, I put together three clear engagement options so ${doc.clientCompany} can choose the speed and coverage that fits best:`,
    "",
    `1) ${basic.name} — ${formatCurrency(basic.price, doc.currency)}`,
    `   ${basic.tagline} (${basic.turnaroundLabel}, ${basic.revisionsLabel})`,
    "",
    `2) ${standard.name} (Recommended) — ${formatCurrency(standard.price, doc.currency)}`,
    `   ${standard.tagline} (${standard.turnaroundLabel}, ${standard.revisionsLabel})`,
    "",
    `3) ${premium.name} — ${formatCurrency(premium.price, doc.currency)}`,
    `   ${premium.tagline} (${premium.turnaroundLabel}, ${premium.revisionsLabel})`,
    "",
    `Once you confirm which option you'd like to move forward with, I'll send over the formal Statement of Work and kickoff deposit link.`,
    "",
    `Best,`,
    doc.providerContact || doc.providerName,
  ].join("\n");
}

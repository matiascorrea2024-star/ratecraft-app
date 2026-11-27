export type CurrencyCode = "USD" | "CAD" | "EUR" | "GBP";

export type ComplexityLevel = "standard" | "moderate" | "high" | "rush";

export type PresetCategory =
  | "Engineering & Dev"
  | "Design & Creative"
  | "Marketing & Growth"
  | "Consulting & Advisory"
  | "Operations & Trades";

export interface PricingInputs {
  estimatedHours: number;
  hourlyBaseline: number;
  complexity: ComplexityLevel;
  adminBufferPercent: number;
  directExpenses: number;
  desiredMarginPercent: number;
  valueMultiplier: number;
}

export interface QuoteTierDefinition {
  id: "basic" | "standard" | "premium";
  name: string;
  tagline: string;
  deliverables: string[];
  turnaroundLabel: string;
  revisionsLabel: string;
  recommended?: boolean;
}

export interface BrandSettings {
  accentColor: string;
  logoDataUrl: string;
  customFooter: string;
}

export interface QuoteDocument {
  id: string;
  presetSlug: string;
  quoteNumber: string;
  projectTitle: string;
  summary: string;
  issueDate: string;
  validUntil: string;
  currency: CurrencyCode;
  providerName: string;
  providerContact: string;
  providerEmail: string;
  clientCompany: string;
  clientContact: string;
  inputs: PricingInputs;
  tiers: [QuoteTierDefinition, QuoteTierDefinition, QuoteTierDefinition];
  brand: BrandSettings;
}

export interface SavedQuote {
  id: string;
  savedAt: string;
  document: QuoteDocument;
}

export interface PresetFaq {
  question: string;
  answer: string;
}

export interface RatePreset {
  slug: string;
  title: string;
  shortName: string;
  category: PresetCategory;
  isProPreset: boolean;
  metaTitle: string;
  metaDescription: string;
  heroSummary: string;
  usMarketRange: string;
  scopeCraftSlug: string;
  defaultInputs: PricingInputs;
  projectTitle: string;
  summary: string;
  underpricingTraps: [string, string, string];
  tiers: [QuoteTierDefinition, QuoteTierDefinition, QuoteTierDefinition];
  faqs: [PresetFaq, PresetFaq, PresetFaq];
}

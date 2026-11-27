"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Lock,
  Mail,
  RotateCcw,
  Save,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Header } from "@/components/Header";
import { UpgradeModal } from "@/components/UpgradeModal";
import { SCOPECRAFT_URL, SITE_URL } from "@/config/site";
import { buildQuoteFromPreset, getPresetBySlug, RATE_PRESETS } from "@/data/presets";
import { trackEvent } from "@/lib/analytics";
import {
  clearStoredLicense,
  getStoredLicense,
  saveStoredLicense,
  verifyLicenseKeyClient,
} from "@/lib/license";
import { exportQuoteToPdf } from "@/lib/pdfExport";
import {
  calculateQuoteBreakdown,
  formatCurrency,
  generateClientPitchEmail,
  generateQuoteSummary,
} from "@/lib/pricingMath";
import { ComplexityLevel, CurrencyCode, QuoteDocument, SavedQuote } from "@/types/pricing";

type EditorTab = "numbers" | "packages" | "parties" | "saved";
type MobilePane = "editor" | "preview";

const DRAFTS_STORAGE_KEY = "ratecraft_saved_quotes_v1";
const FREE_PRESET_SLUGS = [
  "website-design-pricing",
  "shopify-store-build-pricing",
  "logo-brand-identity-pricing",
  "seo-retainer-pricing",
  "ui-ux-product-design-pricing",
];
const ACCENT_SWATCHES = ["#1D4ED8", "#0F5C4A", "#7C2D12", "#312E81", "#11131A"];

interface RateStudioProps {
  initialPresetSlug?: string;
}

export function RateStudio({ initialPresetSlug }: RateStudioProps) {
  const initialPreset =
    (initialPresetSlug ? getPresetBySlug(initialPresetSlug) : undefined) ?? RATE_PRESETS[0];

  const [doc, setDoc] = useState<QuoteDocument>(() => buildQuoteFromPreset(initialPreset));
  const [activeTab, setActiveTab] = useState<EditorTab>("numbers");
  const [mobilePane, setMobilePane] = useState<MobilePane>("editor");
  const [isPro, setIsPro] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [sharedSummary, setSharedSummary] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [showPostExportUpgrade, setShowPostExportUpgrade] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  useEffect(() => {
    const stored = getStoredLicense();
    if (stored) {
      verifyLicenseKeyClient(stored).then((res) => {
        if (res.valid) {
          setIsPro(true);
          setActiveKey(res.normalizedKey);
        }
      });
    }

    try {
      const raw = window.localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedQuote[];
        if (Array.isArray(parsed)) setSavedQuotes(parsed);
      }
    } catch {
      // Ignore
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("preset");
      if (slug) {
        const p = getPresetBySlug(slug);
        if (p) {
          setDoc((prev) => buildQuoteFromPreset(p, prev.brand));
          trackEvent("preset_loaded", { slug: p.slug, source: "url" });
        }
      }
    }
  }, []);

  const breakdown = useMemo(
    () => calculateQuoteBreakdown(doc.inputs, doc.tiers),
    [doc.inputs, doc.tiers]
  );

  const activePresetMeta = useMemo(
    () => getPresetBySlug(doc.presetSlug) ?? RATE_PRESETS[0],
    [doc.presetSlug]
  );

  const handleLoadPreset = (slug: string) => {
    const p = getPresetBySlug(slug);
    if (!p) return;
    setDoc((prev) => buildQuoteFromPreset(p, prev.brand));
    trackEvent("preset_loaded", { slug: p.slug, isProPreset: p.isProPreset });
    showToast(`Loaded ${p.shortName}`);
  };

  const handleDownloadPdf = () => {
    exportQuoteToPdf(doc, isPro);
    trackEvent("quote_pdf_exported", {
      isPro,
      standardPrice: breakdown.recommendedStandardPrice,
      presetSlug: doc.presetSlug,
    });
    if (!isPro) setShowPostExportUpgrade(true);
    showToast(isPro ? "Clean white-label quote PDF exported." : "Quote PDF exported.");
  };

  const handleShareSummary = async () => {
    const text = generateQuoteSummary(doc, isPro);
    trackEvent("quote_summary_shared", { isPro });
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: doc.projectTitle, text });
        showToast("Quote summary shared.");
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setSharedSummary(true);
      setTimeout(() => setSharedSummary(false), 2200);
      showToast("3-tier quote summary copied.");
    } catch {
      showToast("Clipboard blocked by browser.");
    }
  };

  const handleCopyPitchEmail = async () => {
    const text = generateClientPitchEmail(doc);
    trackEvent("pitch_email_copied", { isPro });
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2200);
      showToast("Client pitch email copied.");
    } catch {
      showToast("Clipboard blocked by browser.");
    }
  };

  const handleSaveQuote = () => {
    if (!isPro && savedQuotes.length >= 2 && !savedQuotes.some((q) => q.id === doc.id)) {
      trackEvent("upgrade_modal_opened", { trigger: "quote_limit" });
      setUpgradeOpen(true);
      return;
    }
    const updated: SavedQuote[] = [
      { id: doc.id, savedAt: new Date().toISOString(), document: doc },
      ...savedQuotes.filter((q) => q.id !== doc.id),
    ];
    setSavedQuotes(updated);
    try {
      window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
      showToast("Quote saved to this browser.");
    } catch {
      showToast("Unable to save quote (storage full).");
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify({ current: doc, drafts: savedQuotes }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ratecraft-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON backup downloaded.");
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as {
          current?: QuoteDocument;
          drafts?: SavedQuote[];
        };
        if (parsed.current && parsed.current.projectTitle) setDoc(parsed.current);
        if (Array.isArray(parsed.drafts)) {
          setSavedQuotes((prev) => {
            const seen = new Set(parsed.drafts!.map((d) => d.id));
            const merged = [...parsed.drafts!, ...prev.filter((d) => !seen.has(d.id))];
            const allowed = isPro ? merged : merged.slice(0, 2);
            window.localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(allowed));
            return allowed;
          });
        }
        showToast("Backup restored.");
      } catch {
        showToast("Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) {
      setUpgradeOpen(true);
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 400_000) {
      showToast("Logo file must be under 400 KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDoc((prev) => ({
          ...prev,
          brand: { ...prev.brand, logoDataUrl: reader.result as string },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const accentHex = isPro && doc.brand.accentColor ? doc.brand.accentColor : "#1D4ED8";
  const displayDomain = SITE_URL.replace(/^https?:\/\//, "");
  const scopeCraftHandoffUrl = `${SCOPECRAFT_URL}/?template=${activePresetMeta.scopeCraftSlug}#studio`;

  return (
    <>
      <Header
        isPro={isPro}
        onOpenUpgrade={() => {
          trackEvent("upgrade_modal_opened", { trigger: "header" });
          setUpgradeOpen(true);
        }}
      />

      <main className="flex-1">
        <section id="calculator" className="border-b border-hairline bg-canvas">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 pt-7 pb-10">
            {/* Editorial Headline */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-hairline">
              <div className="max-w-2xl">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cobalt font-medium">
                  No-Signup Freelance Pricing &amp; 3-Tier Quote Studio
                </p>
                <h1 className="font-serif text-3xl sm:text-5xl text-ink tracking-tight leading-[1.08] mt-2">
                  Stop guessing what to charge. Quote 3 tiers in 30 seconds.
                </h1>
                <p className="text-sm sm:text-base text-ink-secondary mt-2.5 leading-relaxed">
                  Factor hidden admin overhead, complexity, and profit margin automatically—then export a client-ready US Letter 3-package proposal PDF.
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mr-1">
                  Presets:
                </span>
                {FREE_PRESET_SLUGS.map((slug) => {
                  const p = getPresetBySlug(slug);
                  if (!p) return null;
                  const active = doc.presetSlug === p.slug;
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => handleLoadPreset(p.slug)}
                      className={`min-h-[40px] sm:min-h-[36px] px-3 rounded-md border text-xs font-medium transition-colors ${
                        active
                          ? "border-cobalt bg-cobalt-tint text-cobalt"
                          : "border-hairline bg-paper text-ink-secondary hover:text-ink hover:border-ink-muted"
                      }`}
                    >
                      {p.shortName}
                    </button>
                  );
                })}
              </div>

              <Link
                href="/rates"
                className="inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[36px] px-3 text-xs font-medium text-cobalt hover:text-cobalt-hover"
              >
                <span>Browse all 30 pricing guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activePresetMeta.isProPreset && !isPro && (
              <div className="mb-4 px-4 py-3 rounded-md bg-cobalt-tint/70 border border-cobalt/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-xs text-ink-secondary">
                  Previewing Pro benchmark <strong className="text-ink">{activePresetMeta.shortName}</strong>. Edit freely below—Pro removes the RateCraft footer and unlocks custom branding.
                </p>
                <button
                  type="button"
                  onClick={() => setUpgradeOpen(true)}
                  className="text-xs font-semibold text-cobalt hover:underline shrink-0 text-left sm:text-right"
                >
                  Unlock Pro ($12)
                </button>
              </div>
            )}

            {/* Mobile Pane Switcher */}
            <div className="lg:hidden sticky top-16 z-30 bg-canvas py-2.5 border-b border-hairline mb-4 flex items-center gap-2">
              <div className="grid grid-cols-2 flex-1 rounded-md border border-hairline bg-subtle p-1">
                <button
                  type="button"
                  onClick={() => setMobilePane("editor")}
                  className={`min-h-[44px] rounded text-xs font-semibold transition-colors ${
                    mobilePane === "editor" ? "bg-paper text-ink shadow-sm" : "text-ink-secondary"
                  }`}
                >
                  Price Inputs
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePane("preview")}
                  className={`min-h-[44px] rounded text-xs font-semibold transition-colors ${
                    mobilePane === "preview" ? "bg-paper text-ink shadow-sm" : "text-ink-secondary"
                  }`}
                >
                  3-Tier Quote
                </button>
              </div>
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="min-h-[44px] px-3.5 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-xs font-medium inline-flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT: Pricing Engine Inputs */}
              <div
                className={`lg:col-span-5 space-y-4 ${
                  mobilePane === "editor" ? "block" : "hidden lg:block"
                }`}
              >
                {/* Underpricing Gap Callout */}
                <div className="bg-paper border border-hairline rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cobalt shrink-0" />
                      <p className="text-xs font-semibold text-ink">
                        Recommended Quote vs. Naive Hourly
                      </p>
                    </div>
                    <span className="font-mono text-xs text-cobalt font-semibold tabular-nums">
                      +{formatCurrency(breakdown.hiddenUnderpricingGap, doc.currency)} recovered
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="p-2 rounded bg-subtle">
                      <span className="block text-[10px] text-ink-muted uppercase font-mono">
                        Naive Hourly
                      </span>
                      <span className="font-mono font-semibold text-ink-secondary tabular-nums">
                        {formatCurrency(breakdown.naiveHourlyTotal, doc.currency)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-cobalt-tint border border-cobalt/20">
                      <span className="block text-[10px] text-cobalt uppercase font-mono">
                        True Quote
                      </span>
                      <span
                        data-testid="recommended-price"
                        className="font-mono font-semibold text-cobalt tabular-nums"
                      >
                        {formatCurrency(breakdown.recommendedStandardPrice, doc.currency)}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-subtle">
                      <span className="block text-[10px] text-ink-muted uppercase font-mono">
                        Effective/hr
                      </span>
                      <span className="font-mono font-semibold text-ink tabular-nums">
                        {formatCurrency(breakdown.effectiveHourlyRate, doc.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Editor Card */}
                <div className="bg-paper border border-hairline rounded-lg overflow-hidden">
                  <div className="grid grid-cols-4 border-b border-hairline bg-subtle/60">
                    {(
                      [
                        { id: "numbers", label: "Numbers" },
                        { id: "packages", label: "Tiers" },
                        { id: "parties", label: "Studio" },
                        { id: "saved", label: "Saved" },
                      ] as { id: EditorTab; label: string }[]
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`min-h-[44px] px-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? "border-cobalt text-ink bg-paper"
                            : "border-transparent text-ink-secondary hover:text-ink"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 sm:p-5 space-y-4">
                    {activeTab === "numbers" && (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="quote-title-input"
                            className="block text-xs font-medium text-ink-secondary mb-1"
                          >
                            Project Title
                          </label>
                          <input
                            id="quote-title-input"
                            type="text"
                            value={doc.projectTitle}
                            onChange={(e) => setDoc({ ...doc, projectTitle: e.target.value })}
                            className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm font-medium text-ink focus:outline-none focus:border-cobalt"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor="hours-input"
                              className="block text-xs font-medium text-ink-secondary mb-1"
                            >
                              Delivery Hours
                            </label>
                            <input
                              id="hours-input"
                              type="number"
                              min={1}
                              value={doc.inputs.estimatedHours}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    estimatedHours: Math.max(1, parseFloat(e.target.value) || 1),
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas font-mono text-sm text-ink tabular-nums focus:outline-none focus:border-cobalt"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="hourly-input"
                              className="block text-xs font-medium text-ink-secondary mb-1"
                            >
                              Hourly Baseline ({doc.currency})
                            </label>
                            <input
                              id="hourly-input"
                              type="number"
                              min={10}
                              step={5}
                              value={doc.inputs.hourlyBaseline}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    hourlyBaseline: Math.max(10, parseFloat(e.target.value) || 10),
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas font-mono text-sm text-ink tabular-nums focus:outline-none focus:border-cobalt"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-ink-secondary mb-1">
                              Project Complexity
                            </label>
                            <select
                              value={doc.inputs.complexity}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    complexity: e.target.value as ComplexityLevel,
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-cobalt"
                            >
                              <option value="standard">Standard (1.0x)</option>
                              <option value="moderate">Moderate (1.2x)</option>
                              <option value="high">High / Custom (1.45x)</option>
                              <option value="rush">Rush Deadline (1.7x)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-ink-secondary mb-1">
                              Admin / Call Buffer (%)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={60}
                              value={doc.inputs.adminBufferPercent}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    adminBufferPercent: Math.max(
                                      0,
                                      Math.min(60, parseFloat(e.target.value) || 0)
                                    ),
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas font-mono text-sm text-ink tabular-nums"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">
                              Direct Costs
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={25}
                              value={doc.inputs.directExpenses}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    directExpenses: Math.max(0, parseFloat(e.target.value) || 0),
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-2.5 rounded border border-hairline bg-canvas font-mono text-xs text-ink tabular-nums"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">
                              Margin (%)
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={80}
                              value={doc.inputs.desiredMarginPercent}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    desiredMarginPercent: Math.max(
                                      0,
                                      Math.min(80, parseFloat(e.target.value) || 0)
                                    ),
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-2.5 rounded border border-hairline bg-canvas font-mono text-xs text-ink tabular-nums"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-ink-secondary mb-1">
                              Value Mult.
                            </label>
                            <input
                              type="number"
                              min={0.8}
                              max={3}
                              step={0.05}
                              value={doc.inputs.valueMultiplier}
                              onChange={(e) =>
                                setDoc({
                                  ...doc,
                                  inputs: {
                                    ...doc.inputs,
                                    valueMultiplier: Math.max(
                                      0.8,
                                      Math.min(3, parseFloat(e.target.value) || 1)
                                    ),
                                  },
                                })
                              }
                              className="w-full min-h-[44px] px-2.5 rounded border border-hairline bg-canvas font-mono text-xs text-ink tabular-nums"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "packages" && (
                      <div className="space-y-4">
                        {doc.tiers.map((tier, idx) => (
                          <div
                            key={tier.id}
                            className="p-3.5 rounded-md border border-hairline bg-canvas space-y-2.5"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={tier.name}
                                onChange={(e) => {
                                  const next = [...doc.tiers] as QuoteDocument["tiers"];
                                  next[idx] = { ...tier, name: e.target.value };
                                  setDoc({ ...doc, tiers: next });
                                }}
                                className="min-h-[40px] px-2.5 rounded border border-hairline bg-paper text-xs font-semibold text-ink"
                              />
                              <input
                                type="text"
                                value={tier.turnaroundLabel}
                                onChange={(e) => {
                                  const next = [...doc.tiers] as QuoteDocument["tiers"];
                                  next[idx] = { ...tier, turnaroundLabel: e.target.value };
                                  setDoc({ ...doc, tiers: next });
                                }}
                                className="min-h-[40px] px-2.5 rounded border border-hairline bg-paper text-xs text-ink-secondary"
                              />
                            </div>
                            <textarea
                              rows={3}
                              value={tier.deliverables.join("\n")}
                              onChange={(e) => {
                                const next = [...doc.tiers] as QuoteDocument["tiers"];
                                next[idx] = {
                                  ...tier,
                                  deliverables: e.target.value.split("\n"),
                                };
                                setDoc({ ...doc, tiers: next });
                              }}
                              className="w-full p-2.5 rounded border border-hairline bg-paper text-xs text-ink-secondary"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "parties" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-ink-muted">
                            Replace sample studio &amp; client placeholders:
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setDoc((prev) => ({
                                ...prev,
                                providerName: "",
                                providerContact: "",
                                providerEmail: "",
                                clientCompany: "",
                                clientContact: "",
                              }))
                            }
                            className="text-xs font-medium text-cobalt hover:underline"
                          >
                            Clear sample parties
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-ink-secondary mb-1">
                              Currency
                            </label>
                            <select
                              value={doc.currency}
                              onChange={(e) =>
                                setDoc({ ...doc, currency: e.target.value as CurrencyCode })
                              }
                              className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm text-ink"
                            >
                              <option value="USD">USD ($)</option>
                              <option value="CAD">CAD ($)</option>
                              <option value="EUR">EUR (€)</option>
                              <option value="GBP">GBP (£)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-ink-secondary mb-1">
                              Quote #
                            </label>
                            <input
                              type="text"
                              value={doc.quoteNumber}
                              onChange={(e) => setDoc({ ...doc, quoteNumber: e.target.value })}
                              className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas font-mono text-sm text-ink"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={doc.providerName}
                            onChange={(e) => setDoc({ ...doc, providerName: e.target.value })}
                            placeholder="Your Studio Name"
                            className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm text-ink"
                          />
                          <input
                            type="text"
                            value={doc.clientCompany}
                            onChange={(e) => setDoc({ ...doc, clientCompany: e.target.value })}
                            placeholder="Client Company"
                            className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm text-ink"
                          />
                          <input
                            type="text"
                            value={doc.providerContact}
                            onChange={(e) => setDoc({ ...doc, providerContact: e.target.value })}
                            placeholder="Your Name & Title"
                            className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm text-ink"
                          />
                          <input
                            type="text"
                            value={doc.clientContact}
                            onChange={(e) => setDoc({ ...doc, clientContact: e.target.value })}
                            placeholder="Client Contact"
                            className="w-full min-h-[44px] px-3 rounded border border-hairline bg-canvas text-sm text-ink"
                          />
                        </div>

                        <div className="p-4 rounded-md border border-hairline bg-subtle/60 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {!isPro && <Lock className="w-3.5 h-3.5 text-ink-muted" />}
                              <p className="text-xs font-semibold text-ink">
                                White-Label Studio Branding
                              </p>
                            </div>
                            {!isPro && (
                              <button
                                type="button"
                                onClick={() => setUpgradeOpen(true)}
                                className="text-xs font-medium text-cobalt hover:underline"
                              >
                                Unlock Pro
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            {ACCENT_SWATCHES.map((hex) => (
                              <button
                                key={hex}
                                type="button"
                                aria-label={`Select color ${hex}`}
                                onClick={() => {
                                  if (!isPro) {
                                    setUpgradeOpen(true);
                                    return;
                                  }
                                  setDoc((prev) => ({
                                    ...prev,
                                    brand: { ...prev.brand, accentColor: hex },
                                  }));
                                }}
                                className={`w-7 h-7 rounded-full border-2 ${
                                  doc.brand.accentColor === hex
                                    ? "border-ink scale-110"
                                    : "border-transparent"
                                }`}
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                            <label className="ml-auto min-h-[40px] px-3 rounded border border-hairline bg-paper text-xs font-medium text-ink-secondary hover:text-ink inline-flex items-center gap-1.5 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{doc.brand.logoDataUrl ? "Change Logo" : "Upload Logo"}</span>
                              <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={handleLogoUpload}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <input
                            type="text"
                            value={doc.brand.customFooter}
                            onFocus={() => {
                              if (!isPro) setUpgradeOpen(true);
                            }}
                            onChange={(e) => {
                              if (!isPro) return;
                              setDoc((prev) => ({
                                ...prev,
                                brand: { ...prev.brand, customFooter: e.target.value },
                              }));
                            }}
                            placeholder="Custom confidential PDF footer (Pro)"
                            className="w-full min-h-[44px] px-3 rounded border border-hairline bg-paper text-xs text-ink"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === "saved" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-semibold text-ink">Saved Browser Quotes</p>
                            <p className="text-xs text-ink-secondary">
                              {isPro
                                ? "Unlimited local quotes active."
                                : `Free tier stores up to 2 quotes (${savedQuotes.length}/2 used).`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleSaveQuote}
                            className="min-h-[44px] px-3.5 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-xs font-medium inline-flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Current</span>
                          </button>
                        </div>

                        {savedQuotes.length === 0 ? (
                          <div className="p-5 rounded-md border border-dashed border-hairline text-center text-xs text-ink-muted">
                            No saved quotes yet.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {savedQuotes.map((item) => (
                              <div
                                key={item.id}
                                className="p-3 rounded-md border border-hairline bg-canvas flex items-center justify-between gap-2"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-ink truncate">
                                    {item.document.projectTitle}
                                  </p>
                                  <p className="font-mono text-[11px] text-ink-muted">
                                    {item.document.quoteNumber} • {item.document.clientCompany}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => setDoc(item.document)}
                                    className="min-h-[36px] px-3 rounded border border-hairline bg-paper text-xs font-medium text-ink"
                                  >
                                    Load
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Delete saved quote"
                                    onClick={() => {
                                      const next = savedQuotes.filter((q) => q.id !== item.id);
                                      setSavedQuotes(next);
                                      window.localStorage.setItem(
                                        DRAFTS_STORAGE_KEY,
                                        JSON.stringify(next)
                                      );
                                    }}
                                    className="min-w-[36px] min-h-[36px] flex items-center justify-center text-ink-muted hover:text-red-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-hairline flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[11px] text-ink-muted">JSON Backup:</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleExportJson}
                              className="min-h-[36px] px-3 rounded border border-hairline bg-paper text-xs font-medium text-ink"
                            >
                              Export JSON
                            </button>
                            <label className="min-h-[36px] px-3 rounded border border-hairline bg-paper text-xs font-medium text-ink inline-flex items-center cursor-pointer">
                              <span>Restore JSON</span>
                              <input
                                type="file"
                                accept="application/json"
                                onChange={handleImportJson}
                                className="sr-only"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Sticky Live 3-Tier Quote Preview */}
              <div
                className={`lg:col-span-7 lg:sticky lg:top-20 space-y-3 ${
                  mobilePane === "preview" ? "block" : "hidden lg:block"
                }`}
              >
                <div className="bg-paper border border-hairline rounded-lg p-2 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      className="hidden lg:inline-flex min-h-[44px] px-4 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-sm font-medium items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Quote PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleShareSummary}
                      className="min-h-[44px] px-2.5 sm:px-3 rounded-md border border-hairline bg-canvas hover:border-cobalt text-xs font-medium text-ink inline-flex items-center gap-1.5"
                    >
                      {sharedSummary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cobalt" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Summary</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyPitchEmail}
                      className="min-h-[44px] px-2.5 sm:px-3 rounded-md border border-hairline bg-canvas hover:border-cobalt text-xs font-medium text-ink inline-flex items-center gap-1.5"
                    >
                      {copiedPitch ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cobalt" />
                          <span>Copied Email</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Pitch Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const p = getPresetBySlug(doc.presetSlug) ?? RATE_PRESETS[0];
                      setDoc((prev) => buildQuoteFromPreset(p, prev.brand));
                      showToast("Reset to preset defaults.");
                    }}
                    className="min-h-[44px] px-2.5 rounded-md text-xs font-medium text-ink-muted hover:text-ink inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {showPostExportUpgrade && !isPro && (
                  <div className="rounded-lg border border-cobalt/30 bg-cobalt-tint p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-cobalt font-semibold">
                          Quote PDF Exported — Ready to Send
                        </p>
                        <p className="text-sm font-semibold text-ink mt-0.5">
                          Make every proposal look like your own studio.
                        </p>
                        <p className="text-xs text-ink-secondary mt-1">
                          Remove the RateCraft footer, add your logo &amp; accent color, and unlock all 30 pricing guides ($12 / 30-day pass).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPostExportUpgrade(false)}
                        className="text-xs text-ink-muted hover:text-ink"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setUpgradeOpen(true)}
                        className="min-h-[40px] px-4 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-xs font-medium"
                      >
                        Unlock Studio Pro — $12
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpgradeOpen(true)}
                        className="min-h-[40px] px-3 rounded-md border border-hairline bg-paper text-xs font-medium text-ink"
                      >
                        Activate license key
                      </button>
                    </div>
                  </div>
                )}

                {toast && (
                  <div
                    role="status"
                    className="px-3.5 py-2 rounded-md bg-ink text-white text-xs font-medium"
                  >
                    {toast}
                  </div>
                )}

                {doc.providerName === "Northstar Digital Studio LLC" && (
                  <div className="px-3.5 py-2 rounded-md border border-hairline bg-subtle text-[11px] text-ink-secondary flex items-center justify-between gap-2">
                    <span>
                      <strong className="text-ink font-mono">SAMPLE DATA:</strong> Replace Northstar / Acme details in the Studio tab before sending.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("parties");
                        setMobilePane("editor");
                      }}
                      className="text-cobalt font-medium hover:underline shrink-0"
                    >
                      Edit studio
                    </button>
                  </div>
                )}

                {/* Quote Sheet */}
                <article
                  aria-label="Live 3-tier project quote preview"
                  className="bg-paper border border-hairline rounded-md paper-sheet overflow-hidden"
                >
                  <div className="h-1.5 w-full" style={{ backgroundColor: accentHex }} />
                  <div className="p-6 sm:p-8 space-y-6 text-[13px] text-ink">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-hairline">
                      <div className="flex items-start gap-3">
                        {isPro && doc.brand.logoDataUrl && (
                          <img
                            src={doc.brand.logoDataUrl}
                            alt="Studio logo"
                            className="w-10 h-10 object-contain rounded border border-hairline shrink-0"
                          />
                        )}
                        <div>
                          <p
                            className="font-mono text-[10px] font-semibold uppercase tracking-widest"
                            style={{ color: accentHex }}
                          >
                            Project Investment Proposal
                          </p>
                          <h2 className="font-serif text-2xl sm:text-[26px] text-ink leading-tight mt-1">
                            {doc.projectTitle || "Project Quote"}
                          </h2>
                        </div>
                      </div>

                      <div className="sm:text-right font-mono text-[11px] text-ink-muted shrink-0 tabular-nums space-y-0.5">
                        <p className="text-ink font-medium">{doc.quoteNumber}</p>
                        <p>Issued: {doc.issueDate}</p>
                        <p>Valid until: {doc.validUntil}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                          Prepared By
                        </span>
                        <span className="font-semibold text-ink mt-0.5 block">
                          {doc.providerName}
                        </span>
                        <span className="text-ink-secondary">{doc.providerContact}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                          Prepared For
                        </span>
                        <span className="font-semibold text-ink mt-0.5 block">
                          {doc.clientCompany}
                        </span>
                        <span className="text-ink-secondary">{doc.clientContact}</span>
                      </div>
                    </div>

                    {/* 3-Tier Option Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {breakdown.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`rounded-md p-4 flex flex-col justify-between border ${
                            pkg.recommended
                              ? "border-2 bg-cobalt-tint/35"
                              : "border-hairline bg-canvas"
                          }`}
                          style={pkg.recommended ? { borderColor: accentHex } : undefined}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className="font-mono text-[10px] uppercase tracking-wider font-semibold"
                                style={{ color: pkg.recommended ? accentHex : "#6A6E7E" }}
                              >
                                {pkg.recommended ? "Recommended" : pkg.id}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-ink mt-1">{pkg.name}</p>
                            <p
                              data-testid={`tier-price-${pkg.id}`}
                              className="font-mono text-2xl font-semibold mt-2 tabular-nums"
                              style={{ color: pkg.recommended ? accentHex : "#11131A" }}
                            >
                              {formatCurrency(pkg.price, doc.currency)}
                            </p>
                            <p className="text-[11px] text-ink-secondary mt-1">{pkg.tagline}</p>

                            <ul className="mt-3 pt-3 border-t border-hairline space-y-1.5 text-[11px] text-ink-secondary">
                              {pkg.deliverables.filter(Boolean).map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-cobalt shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-4 pt-2 border-t border-hairline font-mono text-[10px] text-ink-muted">
                            <p>{pkg.turnaroundLabel}</p>
                            <p>{pkg.revisionsLabel}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cross-Sell Bridge to ScopeCraft */}
                    <div className="p-3.5 rounded-md bg-subtle border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-ink">
                          Client approved a package?
                        </p>
                        <p className="text-[11px] text-ink-secondary">
                          Lock these deliverables into a watertight Statement of Work with exclusions and deposit milestones.
                        </p>
                      </div>
                      <a
                        href={scopeCraftHandoffUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          trackEvent("scopecraft_handoff_clicked", {
                            slug: activePresetMeta.scopeCraftSlug,
                          })
                        }
                        className="min-h-[38px] px-3.5 rounded-md border border-hairline bg-paper hover:border-cobalt text-xs font-medium text-cobalt inline-flex items-center gap-1.5 shrink-0"
                      >
                        <span>Generate SOW in ScopeCraft</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Viral Footer */}
                    <div className="pt-3 border-t border-hairline flex items-center justify-between gap-2 text-[11px] text-ink-muted">
                      {!isPro ? (
                        <>
                          <span data-testid="viral-watermark">
                            Prepared with RateCraft · {displayDomain}
                          </span>
                          <button
                            type="button"
                            onClick={() => setUpgradeOpen(true)}
                            className="inline-flex items-center gap-1 font-medium text-cobalt hover:underline shrink-0"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Remove watermark</span>
                          </button>
                        </>
                      ) : (
                        <span data-testid="pro-footer">
                          {doc.brand.customFooter.trim() ||
                            `Confidential — Prepared by ${doc.providerName}`}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <UpgradeModal
        open={upgradeOpen}
        isPro={isPro}
        activeKey={activeKey}
        onClose={() => setUpgradeOpen(false)}
        onActivated={(normalizedKey) => {
          saveStoredLicense(normalizedKey);
          setIsPro(true);
          setActiveKey(normalizedKey);
          showToast("RateCraft Pro activated.");
        }}
        onDeactivate={() => {
          clearStoredLicense();
          setIsPro(false);
          setActiveKey(null);
          showToast("License removed from browser.");
        }}
      />
    </>
  );
}

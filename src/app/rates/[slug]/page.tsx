import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SCOPECRAFT_URL, SITE_NAME, SITE_URL } from "@/config/site";
import { getPresetBySlug, RATE_PRESETS } from "@/data/presets";
import { calculateQuoteBreakdown, formatCurrency } from "@/lib/pricingMath";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RATE_PRESETS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const preset = getPresetBySlug(slug);
  if (!preset) return {};
  const url = `${SITE_URL}/rates/${preset.slug}`;
  return {
    title: preset.metaTitle,
    description: preset.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: preset.metaTitle,
      description: preset.metaDescription,
      url,
      type: "article",
    },
  };
}

export default async function RateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const preset = getPresetBySlug(slug);
  if (!preset) notFound();

  const breakdown = calculateQuoteBreakdown(preset.defaultInputs, preset.tiers);
  const related = RATE_PRESETS.filter(
    (p) => p.slug !== preset.slug && p.category === preset.category
  ).slice(0, 3);
  const fallbackRelated =
    related.length >= 3
      ? related
      : [
          ...related,
          ...RATE_PRESETS.filter((p) => p.slug !== preset.slug).slice(0, 3 - related.length),
        ];

  const pageUrl = `${SITE_URL}/rates/${preset.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `${SITE_NAME} — ${preset.shortName}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: pageUrl,
        offers: {
          "@type": "Offer",
          price: preset.isProPreset ? "12.00" : "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Rate Guides", item: `${SITE_URL}/rates` },
          { "@type": "ListItem", position: 3, name: preset.shortName, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: preset.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-canvas">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-10 space-y-10">
          <nav aria-label="Breadcrumb" className="text-xs text-ink-muted flex flex-wrap items-center gap-2">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span>/</span>
            <Link href="/rates" className="hover:text-ink">Rate Guides</Link>
            <span>/</span>
            <span className="text-ink font-medium">{preset.shortName}</span>
          </nav>

          <section className="pb-8 border-b border-hairline flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-cobalt font-medium">
                  {preset.category}
                </span>
                <span className="text-hairline">•</span>
                <span className="font-mono text-[11px] text-ink-muted">
                  {preset.isProPreset ? "Pro Benchmark (Free Preview)" : "Free Core Preset"}
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-ink mt-2 leading-tight">
                {preset.title}
              </h1>
              <p className="text-sm sm:text-base text-ink-secondary mt-3 leading-relaxed">
                {preset.heroSummary}
              </p>
              <div className="mt-5 flex flex-wrap gap-6 text-xs font-mono tabular-nums">
                <div>
                  <span className="block text-ink-muted uppercase text-[10px]">US Market Range</span>
                  <span className="text-ink font-medium mt-0.5 block">{preset.usMarketRange}</span>
                </div>
                <div>
                  <span className="block text-ink-muted uppercase text-[10px]">Recommended Quote</span>
                  <span className="text-cobalt font-semibold mt-0.5 block">
                    {formatCurrency(breakdown.recommendedStandardPrice)}
                  </span>
                </div>
                <div>
                  <span className="block text-ink-muted uppercase text-[10px]">Baseline Hours</span>
                  <span className="text-ink font-medium mt-0.5 block">
                    {preset.defaultInputs.estimatedHours} hrs @ ${preset.defaultInputs.hourlyBaseline}/hr
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href={`/?preset=${preset.slug}#calculator`}
                className="min-h-[48px] px-6 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open in RateCraft Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breakdown.packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-paper rounded-lg p-5 flex flex-col justify-between border ${
                  pkg.recommended ? "border-2 border-cobalt" : "border-hairline"
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {pkg.recommended ? "Recommended Tier" : pkg.id}
                  </span>
                  <h2 className="text-base font-semibold text-ink mt-1">{pkg.name}</h2>
                  <p className="font-mono text-2xl font-semibold text-cobalt mt-2 tabular-nums">
                    {formatCurrency(pkg.price)}
                  </p>
                  <p className="text-xs text-ink-secondary mt-1">{pkg.tagline}</p>
                  <ul className="mt-4 pt-3 border-t border-hairline space-y-1.5 text-xs text-ink-secondary">
                    {pkg.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cobalt shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 pt-2 border-t border-hairline font-mono text-[11px] text-ink-muted">
                  {pkg.turnaroundLabel} • {pkg.revisionsLabel}
                </p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-paper border border-hairline rounded-lg p-6 space-y-4">
              <h2 className="font-serif text-2xl text-ink flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-cobalt" />
                <span>Common Underpricing Traps</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-ink-secondary">
                {preset.underpricingTraps.map((trap) => (
                  <li key={trap} className="flex items-start gap-2 leading-relaxed">
                    <span className="font-mono text-cobalt font-semibold">•</span>
                    <span>{trap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-subtle border border-hairline rounded-lg p-6 flex flex-col justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-cobalt font-semibold">
                  CraftApp Workflow Bridge
                </p>
                <h3 className="font-serif text-2xl text-ink mt-1">
                  Client accepted the price? Lock the scope next.
                </h3>
                <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
                  Open the matching Statement of Work template in ScopeCraft with pre-built exclusions, milestone deposits, and Change Order protection.
                </p>
              </div>
              <a
                href={`${SCOPECRAFT_URL}/?template=${preset.scopeCraftSlug}#studio`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-4 rounded-md bg-paper border border-hairline hover:border-cobalt text-xs font-medium text-cobalt inline-flex items-center justify-center gap-1.5"
              >
                <span>Open Matching SOW in ScopeCraft</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </section>

          <section className="bg-paper border border-hairline rounded-lg p-6 sm:p-8 space-y-5">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              Frequently Asked Questions
            </h2>
            <div className="divide-y divide-hairline">
              {preset.faqs.map((faq) => (
                <div key={faq.question} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-ink">{faq.question}</h3>
                  <p className="text-xs sm:text-sm text-ink-secondary mt-1.5 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-2xl text-ink">Related Pricing Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {fallbackRelated.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/rates/${rel.slug}`}
                  className="bg-paper border border-hairline hover:border-cobalt rounded-md p-4 transition-colors"
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {rel.category}
                  </p>
                  <p className="text-sm font-semibold text-ink mt-1">{rel.shortName}</p>
                  <p className="text-xs text-ink-secondary mt-1 line-clamp-2">{rel.heroSummary}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

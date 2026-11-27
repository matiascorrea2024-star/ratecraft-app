"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { BILLING_PLANS } from "@/config/billing";
import { SCOPECRAFT_URL } from "@/config/site";
import { RATE_PRESETS } from "@/data/presets";
import { trackEvent } from "@/lib/analytics";

export function HomeSections() {
  const featured = RATE_PRESETS.slice(0, 6);

  return (
    <>
      <section className="border-b border-hairline bg-paper">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-xl mb-10">
            <p className="font-mono text-[11px] uppercase tracking-widest text-cobalt font-medium">
              Why Value-Based Pricing Wins
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-2 leading-tight">
              Stop quoting hours. Anchor deals with 3 clear packages.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-hairline divide-y md:divide-y-0 md:divide-x divide-hairline">
            <div className="py-6 md:pr-8">
              <p className="font-mono text-xs text-ink-muted tabular-nums">01</p>
              <h3 className="text-base font-semibold text-ink mt-2">
                Expose Hidden Hourly Leakage
              </h3>
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                RateCraft compares your naive hours × rate against true delivery costs—including meetings, revision rounds, complexity, and profit margin.
              </p>
            </div>
            <div className="py-6 md:px-8">
              <p className="font-mono text-xs text-ink-muted tabular-nums">02</p>
              <h3 className="text-base font-semibold text-ink mt-2">
                3-Tier Proposal Anchoring
              </h3>
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                Present Core Scope, Recommended Studio, and Priority Partner side by side so clients pick the right fit instead of negotiating your hourly rate down.
              </p>
            </div>
            <div className="py-6 md:pl-8">
              <p className="font-mono text-xs text-ink-muted tabular-nums">03</p>
              <h3 className="text-base font-semibold text-ink mt-2">
                Connected to ScopeCraft SOWs
              </h3>
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                Once a client chooses an option, transition straight into{" "}
                <a
                  href={SCOPECRAFT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cobalt hover:underline"
                >
                  ScopeCraft
                </a>{" "}
                to lock down exclusions, deposits, and Change Order rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline bg-canvas">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-cobalt font-medium">
                30 Industry Rate Playbooks
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-2">
                US market benchmarks &amp; pre-built package tiers.
              </h2>
            </div>
            <Link
              href="/rates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cobalt hover:text-cobalt-hover"
            >
              <span>View all 30 pricing guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <Link
                key={p.slug}
                href={`/rates/${p.slug}`}
                className="group bg-paper border border-hairline hover:border-cobalt rounded-md p-5 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {p.category}
                    </span>
                    <span className="font-mono text-[11px] text-cobalt">
                      {p.isProPreset ? "Pro" : "Free"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-ink mt-2 group-hover:text-cobalt transition-colors">
                    {p.shortName}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
                    {p.heroSummary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs font-mono text-ink-muted tabular-nums">
                  <span>{p.usMarketRange}</span>
                  <span className="text-ink group-hover:text-cobalt font-sans font-medium inline-flex items-center gap-1">
                    Open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="border-b border-hairline bg-paper">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-xl mb-10">
            <p className="font-mono text-[11px] uppercase tracking-widest text-cobalt font-medium">
              Simple Studio Passes
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-2">
              Free forever to calculate. One upgraded quote pays for years of Pro.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="border border-hairline rounded-lg p-6 bg-canvas flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  Free Forever
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-ink tabular-nums">$0</span>
                  <span className="text-sm text-ink-muted">/forever</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-ink-secondary">
                  {[
                    "Unlimited pricing & margin calculations",
                    "5 core freelance industry presets",
                    "3-tier proposal PDF + client pitch email",
                    "Includes subtle RateCraft footer badge",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#calculator"
                className="mt-6 w-full min-h-[44px] rounded-md border border-hairline bg-paper hover:border-ink text-sm font-medium text-ink inline-flex items-center justify-center"
              >
                Calculate Free
              </a>
            </div>

            <div className="border-2 border-cobalt rounded-lg p-6 bg-paper flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-cobalt font-semibold">
                  30-Day Pro Pass
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-ink tabular-nums">
                    ${BILLING_PLANS.monthly.priceUsd}
                  </span>
                  <span className="text-sm text-ink-muted tabular-nums">
                    USD {BILLING_PLANS.monthly.intervalLabel}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary mt-2">
                  {BILLING_PLANS.monthly.description}
                </p>
                <ul className="mt-5 space-y-2 text-xs text-ink-secondary">
                  {[
                    "Zero RateCraft watermark on PDFs",
                    "Custom logo, brand color & footer",
                    "All 30 US industry pricing guides",
                    "Unlimited saved browser quotes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={BILLING_PLANS.monthly.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("paypal_checkout_clicked", { plan: "monthly", priceUsd: 12 })
                }
                className="mt-6 w-full min-h-[44px] rounded-md bg-cobalt hover:bg-cobalt-hover text-sm font-medium text-white inline-flex items-center justify-center gap-1.5"
              >
                <span>Get 30-Day Pass ($12)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="border border-hairline rounded-lg p-6 bg-paper flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    365-Day Pro Pass
                  </p>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-cobalt text-white">
                    {BILLING_PLANS.annual.badge}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-ink tabular-nums">
                    ${BILLING_PLANS.annual.priceUsd}
                  </span>
                  <span className="text-sm text-ink-muted tabular-nums">
                    USD {BILLING_PLANS.annual.intervalLabel}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary mt-2">
                  {BILLING_PLANS.annual.description}
                </p>
                <ul className="mt-5 space-y-2 text-xs text-ink-secondary">
                  {[
                    "Full 365 days of white-label quoting",
                    "One-time payment — no auto-renewal",
                    "All 30 vertical benchmarks unlocked",
                    "Priority custom preset requests",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href={BILLING_PLANS.annual.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("paypal_checkout_clicked", { plan: "annual", priceUsd: 59 })
                }
                className="mt-6 w-full min-h-[44px] rounded-md border border-ink bg-paper hover:bg-subtle text-sm font-medium text-ink inline-flex items-center justify-center gap-1.5"
              >
                <span>Get 365-Day Pass ($59)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

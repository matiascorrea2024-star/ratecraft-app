"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
          <div className="max-w-2xl mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-cobalt font-semibold">
              Why Value-Based Pricing Wins
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-[-0.03em] mt-1.5 leading-tight">
              Stop quoting hours. Anchor deals with 3 clear packages.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cobalt-tint border border-cobalt/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-cobalt" />
              </div>
              <p className="font-mono text-xs text-ink-muted tabular-nums">01</p>
              <h3 className="font-display text-lg font-bold text-ink mt-1">
                Expose Hidden Hourly Leakage
              </h3>
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                RateCraft compares your naive hours × rate against true delivery costs—including meetings, revision rounds, complexity, and profit margin.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cobalt-tint border border-cobalt/20 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-cobalt" />
              </div>
              <p className="font-mono text-xs text-ink-muted tabular-nums">02</p>
              <h3 className="font-display text-lg font-bold text-ink mt-1">
                3-Tier Proposal Anchoring
              </h3>
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                Present Core Scope, Recommended Studio, and Priority Partner side by side so clients pick the right package instead of negotiating your rate down.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-cobalt-tint border border-cobalt/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5 text-cobalt" />
              </div>
              <p className="font-mono text-xs text-ink-muted tabular-nums">03</p>
              <h3 className="font-display text-lg font-bold text-ink mt-1">
                Connected to ScopeCraft SOWs
              </h3>
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                Once a client chooses an option, transition straight into{" "}
                <a
                  href={SCOPECRAFT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cobalt hover:underline font-medium"
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
              <p className="font-mono text-xs uppercase tracking-widest text-cobalt font-semibold">
                30 Industry Rate Playbooks
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-[-0.03em] mt-1.5">
                US market benchmarks &amp; pre-built package tiers.
              </h2>
            </div>
            <Link
              href="/rates"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cobalt hover:text-cobalt-hover"
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
                className="group bg-paper border border-hairline hover:border-cobalt rounded-2xl p-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      {p.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cobalt-tint font-mono text-[11px] font-semibold text-cobalt">
                      {p.isProPreset ? "Pro" : "Free"}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink mt-2.5 group-hover:text-cobalt transition-colors">
                    {p.shortName}
                  </h3>
                  <p className="text-xs text-ink-secondary mt-2 leading-relaxed">
                    {p.heroSummary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-xs font-mono text-ink-muted tabular-nums">
                  <span>{p.usMarketRange}</span>
                  <span className="text-ink group-hover:text-cobalt font-sans font-semibold inline-flex items-center gap-1">
                    Open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Pro Proposal Comparison */}
      <section className="border-b border-hairline bg-paper">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="rounded-2xl border border-hairline bg-dots-light p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-wider font-semibold text-ink-secondary">
                  Free Proposal PDF ($0)
                </span>
                <span className="text-xs text-ink-muted">Zero account needed</span>
              </div>
              <div className="bg-white rounded-xl border border-hairline p-5 shadow-sm space-y-3">
                <div className="text-xs font-mono text-ink-muted">QT-2026-101</div>
                <div className="text-sm font-semibold text-ink">
                  Core / Studio / Priority 3-Tier Proposal
                </div>
                <div className="h-2 w-4/5 rounded bg-subtle" />
                <div className="pt-3 border-t border-dashed border-hairline flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span>Full margin &amp; pitch email</span>
                  <span className="px-2 py-0.5 rounded bg-subtle">
                    Prepared with RateCraft
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-500/35 bg-[#090D16] text-white p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-semibold text-blue-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Pro White-Label Quote PDF
                </span>
                <span className="text-xs text-slate-400">From $12 one-time</span>
              </div>
              <div className="bg-white rounded-xl p-5 text-slate-900 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold">Your Studio Logo &amp; Header</span>
                  <span className="font-mono text-[10px] text-cobalt font-semibold">
                    NO WATERMARK
                  </span>
                </div>
                <div className="text-sm font-semibold">
                  Custom Branded 3-Package Proposal + Clean Footer
                </div>
                <div className="h-2 w-4/5 rounded bg-slate-100" />
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-cobalt font-semibold">
                  <span>All 30 Rate Benchmarks</span>
                  <span className="inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Unlimited Saved Quotes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Executive Pricing */}
      <section id="pricing" className="border-b border-hairline bg-canvas">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-2xl mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-cobalt font-semibold">
              Simple Studio Passes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-[-0.03em] mt-1.5">
              One professional proposal makes your next client conversation easier.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border border-hairline rounded-2xl p-6 sm:p-7 bg-paper flex flex-col justify-between shadow-sm">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-ink-muted font-semibold">
                  Free Forever
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-bold text-ink tabular-nums">$0</span>
                  <span className="text-sm text-ink-muted">/forever</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-ink-secondary">
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
                className="mt-6 w-full min-h-[46px] rounded-xl border border-hairline bg-canvas hover:border-ink text-sm font-semibold text-ink inline-flex items-center justify-center transition-colors"
              >
                Calculate Free
              </a>
            </div>

            <div className="border border-hairline rounded-2xl p-6 sm:p-7 bg-paper flex flex-col justify-between shadow-sm">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-cobalt font-semibold">
                  30-Day Pro Pass
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-mono text-4xl font-bold text-ink tabular-nums">
                    ${BILLING_PLANS.monthly.priceUsd}
                  </span>
                  <span className="text-sm text-ink-muted tabular-nums">
                    USD {BILLING_PLANS.monthly.intervalLabel}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary mt-2">
                  {BILLING_PLANS.monthly.description}
                </p>
                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-ink-secondary">
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
                className="mt-6 w-full min-h-[46px] rounded-xl bg-ink hover:bg-slate-800 text-sm font-semibold text-white inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Get 30-Day Pass ($12)</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="relative rounded-2xl p-6 sm:p-7 bg-[#0B111E] text-white border border-blue-500/45 shadow-[0_24px_70px_-24px_rgba(59,130,246,0.35)] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-sky-300 to-blue-500" />
              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs uppercase tracking-wider text-blue-300 font-semibold">
                    365-Day Pro Pass
                  </p>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 font-semibold">
                    {BILLING_PLANS.annual.badge}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-mono text-4xl sm:text-5xl font-bold text-white tabular-nums">
                    ${BILLING_PLANS.annual.priceUsd}
                  </span>
                  <span className="text-sm text-slate-400 tabular-nums">
                    USD {BILLING_PLANS.annual.intervalLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  {BILLING_PLANS.annual.description}
                </p>
                <ul className="mt-5 space-y-2.5 text-xs sm:text-sm text-slate-200">
                  {[
                    "Full 365 days of white-label quoting",
                    "One-time payment — no auto-renewal",
                    "All 30 vertical benchmarks unlocked",
                    "Priority custom preset requests",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
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
                className="mt-6 w-full min-h-[46px] rounded-xl bg-blue-500 hover:bg-blue-400 text-sm font-semibold text-white inline-flex items-center justify-center gap-1.5 transition-colors"
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

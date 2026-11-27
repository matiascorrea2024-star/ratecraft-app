import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RatesCatalog } from "@/components/RatesCatalog";
import { SITE_NAME, SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "30 Freelance & Agency Project Pricing Calculators",
  description:
    "Explore 30 US industry pricing guides and 3-tier quote calculators for web development, Shopify, design, marketing retainers, consulting, and trades.",
  alternates: { canonical: `${SITE_URL}/rates` },
};

export default function RatesIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-canvas">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="max-w-2xl pb-6 border-b border-hairline">
            <p className="font-mono text-[11px] uppercase tracking-widest text-cobalt font-medium">
              {SITE_NAME} Industry Benchmarks
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink mt-2 leading-tight">
              30 Freelance &amp; Agency Pricing Calculators
            </h1>
            <p className="text-sm sm:text-base text-ink-secondary mt-3 leading-relaxed">
              Every guide includes realistic US market ranges, underpricing traps, pre-built Core/Recommended/Priority quote tiers, and a 1-click transition to ScopeCraft SOWs.
            </p>
          </div>
          <RatesCatalog />
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { PricingClient } from "@/components/PricingClient";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Pricing & Pro License Passes",
  description:
    "Calculate freelance project quotes free with zero signup. Upgrade to RateCraft Pro ($12 / 30-day pass or $59 / 365-day pass via PayPal).",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function PricingPage() {
  return (
    <>
      <PricingClient />
      <Footer />
    </>
  );
}

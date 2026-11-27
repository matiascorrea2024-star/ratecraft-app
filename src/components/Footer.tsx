import Link from "next/link";
import { SCOPECRAFT_URL, SITE_NAME, SITE_PARENT } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-canvas border-t border-hairline">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-ink">
            {SITE_NAME} <span className="text-ink-muted font-normal">by {SITE_PARENT}</span>
          </p>
          <p className="text-xs text-ink-muted mt-1 max-w-md">
            Value-based freelance project pricing and 3-tier quote PDFs. Illustrative pricing benchmarks are not financial or legal advice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-ink-secondary">
          <Link href="/#calculator" className="hover:text-ink">
            Pricing Calculator
          </Link>
          <Link href="/rates" className="hover:text-ink">
            30 Rate Guides
          </Link>
          <Link href="/pricing" className="hover:text-ink">
            Pro License
          </Link>
          <a
            href={SCOPECRAFT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cobalt hover:underline font-medium"
          >
            ScopeCraft SOW Builder →
          </a>
          <a
            href="https://craftapp-hub.vercel.app/invoice-followup"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            InvoiceFollowUp
          </a>
          <a
            href="https://craftapp-hub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            CraftApp Hub
          </a>
        </div>
      </div>
    </footer>
  );
}

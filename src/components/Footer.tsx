import Link from "next/link";
import { SCOPECRAFT_URL, SITE_NAME, SITE_PARENT } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[#090D16] text-slate-300 border-t border-white/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="font-display text-sm font-bold text-white">
            {SITE_NAME}{" "}
            <span className="text-slate-400 font-normal font-mono text-xs">
              by {SITE_PARENT}
            </span>
          </p>
          <p className="text-xs text-slate-400 mt-1.5 max-w-md leading-relaxed">
            Value-based freelance project pricing and 3-tier quote PDFs. Illustrative pricing benchmarks are not financial or legal advice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300">
          <Link href="/#calculator" className="hover:text-white">
            Pricing Calculator
          </Link>
          <Link href="/rates" className="hover:text-white">
            30 Rate Guides
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pro License
          </Link>
          <a
            href={SCOPECRAFT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:underline font-medium"
          >
            ScopeCraft SOW Builder →
          </a>
          <a
            href="https://craftapp-hub.vercel.app/invoice-followup"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            InvoiceFollowUp
          </a>
          <a
            href="https://craftapp-hub.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            CraftApp Hub
          </a>
        </div>
      </div>
    </footer>
  );
}

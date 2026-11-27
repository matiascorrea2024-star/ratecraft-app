"use client";

import Link from "next/link";
import { CheckCircle2, KeyRound } from "lucide-react";
import { SCOPECRAFT_URL } from "@/config/site";

interface HeaderProps {
  isPro?: boolean;
  onOpenUpgrade?: () => void;
}

export function Header({ isPro = false, onOpenUpgrade }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-canvas/95 backdrop-blur border-b border-hairline">
      <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt rounded"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded bg-cobalt text-white flex items-center justify-center shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 12L6.5 8.5L9.2 10.8L13 5.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="13" cy="5.5" r="1.3" fill="currentColor" />
            </svg>
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-sans font-semibold text-[15px] tracking-tight text-ink">
              RateCraft
            </span>
            <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              by CraftApp
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-ink-secondary">
          <Link href="/#calculator" className="hover:text-ink transition-colors">
            Calculator
          </Link>
          <Link href="/rates" className="hover:text-ink transition-colors">
            30 Rate Guides
          </Link>
          <Link href="/pricing" className="hover:text-ink transition-colors">
            Pricing
          </Link>
          <a
            href={SCOPECRAFT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cobalt transition-colors"
          >
            ScopeCraft SOW
          </a>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/rates"
            className="md:hidden inline-flex items-center justify-center min-h-[44px] px-2 text-xs font-medium text-ink-secondary hover:text-ink"
          >
            Guides
          </Link>

          {isPro ? (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="inline-flex items-center gap-1.5 min-h-[44px] px-2.5 sm:px-3 rounded-md bg-cobalt-tint border border-cobalt/25 text-cobalt text-xs font-semibold tracking-wide whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PRO ACTIVE</span>
            </button>
          ) : (
            <>
              {onOpenUpgrade ? (
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-md border border-hairline bg-paper text-xs font-medium text-ink-secondary hover:text-ink hover:border-ink-muted transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Activate Key</span>
                </button>
              ) : (
                <Link
                  href="/pricing#activate"
                  className="hidden sm:inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-md border border-hairline bg-paper text-xs font-medium text-ink-secondary hover:text-ink hover:border-ink-muted transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Activate Key</span>
                </Link>
              )}

              {onOpenUpgrade ? (
                <button
                  type="button"
                  onClick={onOpenUpgrade}
                  className="inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Upgrade to Pro
                </button>
              ) : (
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center min-h-[44px] px-3 sm:px-4 rounded-md bg-cobalt hover:bg-cobalt-hover text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Upgrade to Pro
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}

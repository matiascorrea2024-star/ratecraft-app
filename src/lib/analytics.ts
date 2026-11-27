"use client";

import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "quote_pdf_exported"
  | "quote_summary_shared"
  | "pitch_email_copied"
  | "preset_loaded"
  | "scopecraft_handoff_clicked"
  | "paypal_checkout_clicked"
  | "pro_license_activated"
  | "upgrade_modal_opened";

export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
): void {
  try {
    track(name, props);
  } catch {
    // Analytics must never interrupt user flow
  }
}

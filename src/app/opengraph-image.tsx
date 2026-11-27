import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RateCraft — Freelance Pricing & 3-Tier Quote Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F9F9FB",
          padding: "64px 72px",
          borderTop: "10px solid #1D4ED8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              backgroundColor: "#1D4ED8",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "#11131A" }}>RateCraft</span>
            <span style={{ fontSize: "14px", color: "#6A6E7E", letterSpacing: "0.08em" }}>
              CRAFTAPP STUDIO
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "920px" }}>
          <span
            style={{
              fontSize: "18px",
              color: "#1D4ED8",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            Freelance Pricing &amp; 3-Tier Quote Studio
          </span>
          <div style={{ fontSize: "60px", lineHeight: 1.08, color: "#11131A", fontWeight: 600 }}>
            Stop guessing what to charge. Quote 3 tiers in 30 seconds.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #E2E4EC",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#4C5060",
          }}
        >
          <span>30 US Pricing Guides • Hidden Buffer Math • 3-Tier Proposal PDF</span>
          <span style={{ color: "#1D4ED8", fontWeight: 600 }}>Free to start</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

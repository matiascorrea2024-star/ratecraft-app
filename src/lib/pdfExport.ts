import { jsPDF } from "jspdf";
import { SITE_URL } from "@/config/site";
import { calculateQuoteBreakdown, formatCurrency } from "@/lib/pricingMath";
import { QuoteDocument } from "@/types/pricing";

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return [29, 78, 216]; // Default Cobalt #1D4ED8
}

export function exportQuoteToPdf(doc: QuoteDocument, isPro: boolean): void {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const pageWidth = pdf.internal.pageSize.getWidth(); // 612
  const pageHeight = pdf.internal.pageSize.getHeight(); // 792
  const marginX = 48;
  const contentWidth = pageWidth - marginX * 2;
  const accentRgb: [number, number, number] =
    isPro && doc.brand.accentColor ? hexToRgb(doc.brand.accentColor) : [29, 78, 216];

  const breakdown = calculateQuoteBreakdown(doc.inputs, doc.tiers);
  let y = 44;

  // Top brand accent bar
  pdf.setFillColor(...accentRgb);
  pdf.rect(0, 0, pageWidth, 5, "F");

  let headerTextX = marginX;
  if (isPro && doc.brand.logoDataUrl) {
    try {
      const format = doc.brand.logoDataUrl.includes("image/png") ? "PNG" : "JPEG";
      pdf.addImage(doc.brand.logoDataUrl, format, marginX, y - 4, 34, 34);
      headerTextX = marginX + 44;
    } catch {
      headerTextX = marginX;
    }
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...accentRgb);
  pdf.text("PROJECT INVESTMENT PROPOSAL", headerTextX, y + 6);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(106, 110, 126);
  pdf.text(`Quote # ${doc.quoteNumber}`, pageWidth - marginX, y + 6, { align: "right" });
  y += 22;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(19);
  pdf.setTextColor(17, 19, 26);
  const titleLines = pdf.splitTextToSize(doc.projectTitle || "Project Quote", contentWidth);
  pdf.text(titleLines, headerTextX, y);
  y += titleLines.length * 22 + 4;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(76, 80, 96);
  pdf.text(
    `Issue Date: ${doc.issueDate}    |    Valid Until: ${doc.validUntil}`,
    marginX,
    y
  );
  y += 14;

  pdf.setDrawColor(226, 228, 236);
  pdf.setLineWidth(0.75);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 18;

  // Prepared By / For
  const colW = (contentWidth - 20) / 2;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(106, 110, 126);
  pdf.text("PREPARED BY", marginX, y);
  pdf.text("PREPARED FOR", marginX + colW + 20, y);
  y += 13;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(17, 19, 26);
  pdf.text(doc.providerName || "Studio", marginX, y);
  pdf.text(doc.clientCompany || "Client", marginX + colW + 20, y);
  y += 13;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(76, 80, 96);
  pdf.text([doc.providerContact, doc.providerEmail].filter(Boolean).join(" • "), marginX, y);
  pdf.text(doc.clientContact || "", marginX + colW + 20, y);
  y += 22;

  // Overview
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10.5);
  pdf.setTextColor(17, 19, 26);
  pdf.text("1. Engagement Overview", marginX, y);
  y += 14;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9.5);
  pdf.setTextColor(65, 68, 82);
  const sumLines = pdf.splitTextToSize(doc.summary || "", contentWidth);
  pdf.text(sumLines, marginX, y);
  y += sumLines.length * 13 + 16;

  // 3-Tier Options Grid
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10.5);
  pdf.setTextColor(17, 19, 26);
  pdf.text("2. Choose Your Engagement Package", marginX, y);
  y += 14;

  const cardGap = 12;
  const cardWidth = (contentWidth - cardGap * 2) / 3;
  const cardHeight = 250;

  breakdown.packages.forEach((pkg, idx) => {
    const x = marginX + idx * (cardWidth + cardGap);
    if (pkg.recommended) {
      pdf.setFillColor(239, 244, 255);
      pdf.setDrawColor(...accentRgb);
      pdf.setLineWidth(1.5);
    } else {
      pdf.setFillColor(249, 249, 251);
      pdf.setDrawColor(226, 228, 236);
      pdf.setLineWidth(0.75);
    }
    pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, "FD");

    let cy = y + 18;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...(pkg.recommended ? accentRgb : ([106, 110, 126] as [number, number, number])));
    pdf.text(pkg.recommended ? "RECOMMENDED" : `OPTION 0${idx + 1}`, x + 12, cy);
    cy += 16;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(17, 19, 26);
    pdf.text(pkg.name, x + 12, cy);
    cy += 22;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(...accentRgb);
    pdf.text(formatCurrency(pkg.price, doc.currency), x + 12, cy);
    cy += 15;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(76, 80, 96);
    const tagLines = pdf.splitTextToSize(pkg.tagline, cardWidth - 24);
    pdf.text(tagLines, x + 12, cy);
    cy += tagLines.length * 10 + 8;

    pdf.setDrawColor(226, 228, 236);
    pdf.line(x + 12, cy, x + cardWidth - 12, cy);
    cy += 14;

    pkg.deliverables.forEach((item) => {
      const dLines = pdf.splitTextToSize(`• ${item}`, cardWidth - 24);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.2);
      pdf.setTextColor(40, 43, 55);
      pdf.text(dLines, x + 12, cy);
      cy += dLines.length * 10 + 4;
    });

    const bottomMetaY = y + cardHeight - 28;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.8);
    pdf.setTextColor(106, 110, 126);
    pdf.text(`Timeline: ${pkg.turnaroundLabel}`, x + 12, bottomMetaY);
    pdf.text(`Revisions: ${pkg.revisionsLabel}`, x + 12, bottomMetaY + 11);
  });

  y += cardHeight + 24;

  // Next Steps & Acceptance
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10.5);
  pdf.setTextColor(17, 19, 26);
  pdf.text("3. Next Steps & Approval", marginX, y);
  y += 14;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(76, 80, 96);
  const nextLines = pdf.splitTextToSize(
    "Reply with your selected package (Core Scope, Recommended Studio, or Priority Partner) to receive the formal Statement of Work and kickoff deposit invoice. Quoted rates remain valid for 14 days from issue date.",
    contentWidth
  );
  pdf.text(nextLines, marginX, y);
  y += nextLines.length * 13 + 22;

  // Approval line
  pdf.setDrawColor(226, 228, 236);
  pdf.line(marginX, y, pageWidth - marginX, y);
  y += 18;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(106, 110, 126);
  pdf.text(
    "Selected Option: [ ] Core Scope   [ ] Recommended Studio   [ ] Priority Partner      Client Signature: _______________________",
    marginX,
    y
  );

  // Footer
  const displayDomain = SITE_URL.replace(/^https?:\/\//, "");
  pdf.setDrawColor(226, 228, 236);
  pdf.line(marginX, pageHeight - 36, pageWidth - marginX, pageHeight - 36);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(106, 110, 126);
  if (!isPro) {
    pdf.text(`Prepared with RateCraft  |  ${displayDomain}`, marginX, pageHeight - 22);
  } else {
    pdf.text(
      doc.brand.customFooter.trim() || `Confidential — Prepared by ${doc.providerName}`,
      marginX,
      pageHeight - 22
    );
  }
  pdf.text("Page 1 of 1", pageWidth - marginX, pageHeight - 22, { align: "right" });

  const safeNum = (doc.quoteNumber || "Quote").replace(/[^a-zA-Z0-9_-]/g, "_");
  pdf.save(`RateCraft_${safeNum}.pdf`);
}

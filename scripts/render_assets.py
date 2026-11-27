import base64
import os
import subprocess
import tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(os.getcwd())
SHOTS = ROOT / "audit_screenshots"
OUT_COVER = ROOT / "launch_kit" / "editorial_cover_1280x720.png"
VID_DIR = ROOT / "launch_kit" / "viral_videos"
VID_DIR.mkdir(parents=True, exist_ok=True)


def b64(path: Path) -> str:
    return "data:image/png;base64," + base64.b64encode(path.read_bytes()).decode("ascii") if path.exists() else ""


COVER_HTML = """<!doctype html><html><head><meta charset="utf-8"/><style>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{width:1280px;height:720px;background:#F9F9FB;color:#11131A;font-family:'Inter',sans-serif;border-top:8px solid #1D4ED8;padding:54px 64px;display:flex;gap:48px;align-items:stretch;overflow:hidden}
.left{flex:1;display:flex;flex-direction:column;justify-content:space-between}
.brand{display:flex;align-items:center;gap:12px}
.mark{width:38px;height:38px;border-radius:7px;background:#1D4ED8;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#1D4ED8;font-weight:600;margin-bottom:16px}
h1{font-family:'Instrument Serif',Georgia,serif;font-size:62px;line-height:1.05;font-weight:400;margin-bottom:18px}
.sub{font-size:18px;line-height:1.5;color:#4C5060;max-width:500px}
.pills{display:flex;gap:8px}
.pill{font-family:'JetBrains Mono',monospace;font-size:11px;padding:7px 11px;border:1px solid #E2E4EC;background:#fff;border-radius:6px}
.pill.acc{background:#EFF4FF;border-color:rgba(29,78,216,.3);color:#1D4ED8;font-weight:600}
.right{flex:1;background:#fff;border:1px solid #E2E4EC;border-radius:10px;box-shadow:0 18px 40px rgba(17,19,26,.06);overflow:hidden;display:flex;flex-direction:column}
.bar{height:6px;background:#1D4ED8}
.body{padding:30px;display:flex;flex-direction:column;gap:18px;flex:1}
.gap{background:#EFF4FF;border:1px solid rgba(29,78,216,.22);border-radius:8px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:600;color:#1D4ED8}
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;flex:1}
.tier{border:1px solid #E2E4EC;border-radius:8px;padding:14px;background:#F9F9FB;display:flex;flex-direction:column;justify-content:space-between}
.tier.rec{border:2px solid #1D4ED8;background:#EFF4FF}
.mono{font-family:'JetBrains Mono',monospace;font-variant-numeric:tabular-nums}
</style></head><body>
<div class="left">
  <div class="brand"><div class="mark">R</div><div><div style="font-size:19px;font-weight:700">RateCraft</div><div class="mono" style="font-size:11px;color:#6A6E7E">CRAFTAPP STUDIO</div></div></div>
  <div>
    <div class="eyebrow">Freelance Pricing &amp; 3-Tier Quote Studio</div>
    <h1>Stop guessing what to charge.</h1>
    <p class="sub">Expose hidden hourly underpricing, anchor deals with Basic, Standard, and Premium packages, and export executive US Letter PDFs in 30 seconds.</p>
  </div>
  <div class="pills"><span class="pill acc">3-Tier Quote PDF</span><span class="pill">30 Industry Guides</span><span class="pill">Zero Signup</span></div>
</div>
<div class="right"><div class="bar"></div><div class="body">
  <div style="display:flex;justify-content:space-between;border-bottom:1px solid #E2E4EC;padding-bottom:12px">
    <div><div class="mono" style="font-size:10px;color:#1D4ED8;font-weight:600">PROJECT INVESTMENT PROPOSAL</div><div style="font-family:'Instrument Serif',serif;font-size:26px;margin-top:4px">Custom Marketing Website Build</div></div>
    <div class="mono" style="font-size:11px;color:#6A6E7E;text-align:right">QT-2026-101<br/>Valid 14 days</div>
  </div>
  <div class="gap"><span>Naive Hourly ($2,660) vs True Quote</span><span class="mono">+$2,640 RECOVERED</span></div>
  <div class="tiers">
    <div class="tier"><div><div class="mono" style="font-size:10px;color:#6A6E7E">CORE</div><div style="font-weight:700;font-size:13px;margin-top:4px">Core Scope</div><div class="mono" style="font-size:22px;font-weight:700;margin-top:8px">$3,825</div><div style="font-size:11px;color:#4C5060;margin-top:8px">4 responsive pages + staging preview</div></div><div class="mono" style="font-size:10px;color:#6A6E7E">3 weeks</div></div>
    <div class="tier rec"><div><div class="mono" style="font-size:10px;color:#1D4ED8;font-weight:700">RECOMMENDED</div><div style="font-weight:700;font-size:13px;margin-top:4px">Studio</div><div class="mono" style="font-size:22px;font-weight:700;color:#1D4ED8;margin-top:8px">$5,300</div><div style="font-size:11px;color:#4C5060;margin-top:8px">8 pages + CMS + SEO + 14d QA</div></div><div class="mono" style="font-size:10px;color:#1D4ED8">4 weeks</div></div>
    <div class="tier"><div><div class="mono" style="font-size:10px;color:#6A6E7E">PRIORITY</div><div style="font-weight:700;font-size:13px;margin-top:4px">Partner</div><div class="mono" style="font-size:22px;font-weight:700;margin-top:8px">$8,225</div><div style="font-size:11px;color:#4C5060;margin-top:8px">Priority sprint + copy + 30d opt</div></div><div class="mono" style="font-size:10px;color:#6A6E7E">2.5 weeks</div></div>
  </div>
  <div class="mono" style="font-size:11px;color:#6A6E7E;display:flex;justify-content:space-between;border-top:1px solid #E2E4EC;padding-top:10px"><span>Pitch Email Ready</span><span>Hands Off to ScopeCraft SOW</span></div>
</div></div>
</body></html>"""


def vslide(eyebrow: str, headline: str, sub: str, pill: str, shot: str = "", red: bool = False) -> str:
    col = "#B42318" if red else "#1D4ED8"
    img = f'<div style="background:#fff;border:2px solid #E2E4EC;border-radius:16px;padding:14px;max-height:920px;overflow:hidden;display:flex;justify-content:center;"><img src="{shot}" style="width:100%;height:auto;border-radius:10px;object-fit:contain;"/></div>' if shot else ""
    return f"""<!doctype html><html><head><meta charset="utf-8"/><style>
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@500;600;700&family=JetBrains+Mono:wght@600&display=swap');
    *{{box-sizing:border-box;margin:0;padding:0}}
    body{{width:1080px;height:1920px;background:#F9F9FB;color:#11131A;font-family:'Inter',sans-serif;border-top:14px solid {col};padding:110px 72px 120px;display:flex;flex-direction:column;justify-content:space-between}}
    </style></head><body>
    <div style="display:flex;justify-content:space-between;font-family:'JetBrains Mono',monospace;font-size:23px">
      <span style="color:{col};font-weight:600">{eyebrow}</span><span style="color:#6A6E7E">RateCraft</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:34px;margin:auto 0">
      <div style="display:inline-block;align-self:flex-start;padding:12px 22px;border-radius:999px;background:#EFF4FF;border:2px solid rgba(29,78,216,.28);color:#1D4ED8;font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:600">{pill}</div>
      <h1 style="font-family:'Instrument Serif',serif;font-size:94px;line-height:1.04;font-weight:400">{headline}</h1>
      <p style="font-size:38px;line-height:1.38;color:#4C5060">{sub}</p>
      {img}
    </div>
    <div style="background:#1D4ED8;color:#fff;border-radius:16px;padding:26px 32px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:600">ratecraft-app.vercel.app</div>
    </body></html>"""


def render_mp4(slides: list[tuple[str, float]], out_mp4: Path):
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        imgs = []
        with sync_playwright() as p:
            br = p.chromium.launch(headless=True)
            pg = br.new_page(viewport={"width": 1080, "height": 1920})
            for i, (html, _) in enumerate(slides):
                pg.set_content(html, wait_until="networkidle")
                ip = tmp / f"s_{i}.png"
                pg.screenshot(path=str(ip))
                imgs.append(ip)
            br.close()
        cmd = ["nice", "-n", "15", "ffmpeg", "-y"]
        for i, (_, d) in enumerate(slides):
            cmd += ["-loop", "1", "-t", f"{d:.2f}", "-i", str(imgs[i])]
        fade = 0.35
        filters = []
        cur = "[0:v]"
        off = slides[0][1] - fade
        for i in range(1, len(slides)):
            nxt = f"[{i}:v]"
            out = f"[v{i}]" if i < len(slides) - 1 else "[vout]"
            filters.append(f"{cur}{nxt}xfade=transition=fade:duration={fade}:offset={off:.2f}{out}")
            cur = out
            off += slides[i][1] - fade
        cmd += ["-filter_complex", ";".join(filters), "-map", "[vout]", "-r", "30", "-c:v", "libx264", "-preset", "faster", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out_mp4)]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Rendered MP4:", out_mp4.name, out_mp4.stat().st_size)


with sync_playwright() as p:
    br = p.chromium.launch(headless=True)
    pg = br.new_page(viewport={"width": 1280, "height": 720})
    pg.set_content(COVER_HTML, wait_until="networkidle")
    pg.screenshot(path=str(OUT_COVER))
    br.close()
print("Saved cover:", OUT_COVER.stat().st_size)

m_home = b64(SHOTS / "mobile_390_home.png")
m_quote = b64(SHOTS / "mobile_390_quote.png")

render_mp4([
    (vslide("PRICING REALITY CHECK", "If you charge $300 for a website...", "You're forgetting client calls, revisions, complexity, and profit margin.", "UNDERPRICING TRAP", red=True), 4.0),
    (vslide("SEE THE HIDDEN GAP", "Hours × Rate hides 40% of real cost.", "Enter hours, buffer & margin to see your true project price instantly.", "LIVE CALCULATOR", shot=m_home), 5.5),
    (vslide("3-TIER ANCHORING", "Send Basic, Studio & Priority PDFs.", "Clients pick the tier instead of negotiating your rate down.", "INSTANT PDF + EMAIL", shot=m_quote), 5.5),
    (vslide("TRY RATECRAFT FREE", "Zero signup. Export 3-tier PDFs free.", "Link in bio — plus 1-click ScopeCraft SOW handoff.", "FREE LINK IN BIO"), 3.5),
], VID_DIR / "01_underpricing_300_vs_1500_9x16.mp4")

render_mp4([
    (vslide("AGENCY SALES TIP", "Stop sending a single flat quote.", "One flat price forces a yes/no negotiation on cost.", "DEAL KILLER", red=True), 4.0),
    (vslide("VALUE ANCHORING", "3 clear packages lift deal size.", "Core Scope, Recommended Studio, and Priority Partner side by side.", "US LETTER PDF", shot=m_quote), 5.5),
    (vslide("30 INDUSTRY BENCHMARKS", "Web, Shopify, SEO, Design & Trades.", "Pre-loaded with US market rates and pitch emails.", "30 RATE GUIDES", shot=m_home), 5.0),
    (vslide("START IN 30 SECONDS", "Calculate your next project free.", "ratecraft-app.vercel.app — link in bio.", "CRAFTAPP STUDIO"), 3.5),
], VID_DIR / "02_three_tier_quote_pdf_9x16.mp4")

# Auto-Delivery Upgrade Guide — RateCraft

RateCraft collects one-time passes at `https://paypal.me/craftappstudio/12USD` (30-day pass) and `https://paypal.me/craftappstudio/59USD` (365-day pass) using keys in `launch_kit/license_keys_500.txt`.

To automate 24/7 instant key delivery with Payhip (same PayPal account):
1. Create **RateCraft Pro 30-Day ($12)** and **RateCraft Pro 365-Day ($59)** in Payhip and upload unused keys from `launch_kit/license_keys_500.txt`.
2. In Vercel (`ratecraft-app` -> Settings -> Environment Variables), add:
   - `NEXT_PUBLIC_BILLING_PROVIDER=payhip`
   - `NEXT_PUBLIC_PAYHIP_MONTHLY_URL=<Payhip $12 URL>`
   - `NEXT_PUBLIC_PAYHIP_ANNUAL_URL=<Payhip $59 URL>`
3. Redeploy once (`vercel deploy --prod --yes`).

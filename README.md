# RealtorAIGrowth — AI CMA Summarizer

Upload comps CSV → get a clean pricing range, risks, talking points, and PDF.

## Quickstart

1) Install deps
```bash
npm i
```
2) Environment
- Copy `ENV_EXAMPLE.txt` into `.env.local`
- Set `OPENAI_API_KEY`
- Optional: Supabase + Stripe keys for full flow

3) Dev server
```bash
npm run dev
```

Open `http://localhost:3000`

## Supabase
- Run `supabase.sql` in SQL Editor (or run `realtor_aigrowth_full_setup.sql`)
- Optional: seed with `supabase-seed.sql`

## Stripe (optional)
- Configure `STRIPE_SECRET_KEY` and product price IDs in env
- Webhook (Next.js): set `STRIPE_WEBHOOK_SECRET`
- Edge Function (recommended): `supabase functions deploy stripe-sync`
  - Set `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_ANNUAL` (or `PRICE_MONTHLY_ID`/`PRICE_ANNUAL_ID`)
  - For display-only pricing on marketing page, set `NEXT_PUBLIC_PRICE_MONTHLY` and `NEXT_PUBLIC_PRICE_ANNUAL`

PowerShell helpers (Windows):
```powershell
# Listen and forward to edge function locally
./scripts/stripe-listen.ps1
# Simulate a checkout completion
./scripts/stripe-test-checkout.ps1 -UserId 00000000-0000-0000-0000-000000000001
```

## Postman
Import `postman/RealtorAIGrowth.postman_collection.json` and set `baseUrl` variable.

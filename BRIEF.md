# Build brief: self-healing scraper demo store (Berlin AI Day)

## Role
Next.js frontend lead and product designer building a demo asset for Bright Data.

## Goal (definition of done)
A scraper built in Scraper Studio against v1 returns 12 of 12 clean rows. One run of the
GitHub Action switches the same URL to v2. The same scraper then fails with `parse_error`
on every input, Auto Self-Healing fires, and the next run returns 12 of 12 rows again.
The flip completes in under [60] seconds on stage. `node scripts/verify.mjs` prints PASS
on all three gates before anyone films.

## Context
Auto Self-Healing fires only when all three hold at once:
1. success rate below 40 percent (default),
2. at least 10 job inputs (default),
3. one of six error codes: `crawl_error`, `parse_error`, `bad_cmd_arg`, `dead_page`,
   `bad_input`, `bad_navigate`.
Every other code, including `wait_element_timeout` and `blocked`, is ignored.
`dead_page` triggers healing but cannot be healed. `parse_error` triggers and heals.
The previous demo (anilkk/scraper-demo-coffee-store) clears the gates with static HTML.
This rebuild keeps those guarantees and looks like a real store.

## Target
1. The conference audience watching a projected screen. The v1 to v2 change must be
   obvious from the back row.
2. The Scraper Studio browser worker reading the DOM. The v1 to v2 change must rename
   every scraped selector.

## Task
Build a Next.js store (App Router, TypeScript, Tailwind) with two variants, v1 and v2,
that differ in both look and DOM, plus the switching and verification tooling.

### Content
- Vertical: [electronics / coffee / other].
- 12 products in 3 categories, 4 each. Twelve gives the min-inputs gate margin.
- Per product: name, price, category, rating, review count, 3 to 5 spec rows, stock
  state, SKU, description, one image.
- Pages: home (hero plus grid), category `/c/[slug]`, product `/p/[slug]`,
  search `/search?q=`.
- Search and category filter work with JavaScript off (query params, server rendered)
  and are enhanced on the client.
- All product data lives in `data/products.json`, one source for both versions.

### What differs between v1 and v2
| Axis | v1 | v2 |
|---|---|---|
| Look | light, card grid (Shopcart reference) | editorial, dark or warm (Stella reference) |
| Class names | `product-card`, `product-name`, `product-price` | `listing-tile`, `tile__heading`, `price-tag` |
| Price text | `$19.50` | `USD 19.50` |
| Product URL | `/p/[slug]` | unchanged in `selectors` mode, `/shop/[cat]/[slug]` in `urls` and `both` |

Break modes match the existing repo: `selectors` (default, `parse_error`), `urls`
(`dead_page`), `both`.

### What must not differ
- Product data, slugs, count, category membership.
- Server rendering: every scraped field is present in the initial HTML.
- Real 404s: a removed URL returns HTTP 404. No catch-all rewrite, no soft 404.
- `robots.txt` allows all. No bot challenge, no cookie wall.

### Switching
- GitHub Action `Switch store version` with inputs `version` (v1, v2) and `break_mode`.
- Mechanism: [commit to config/live.json and let Vercel rebuild / pre-build both and
  flip the Vercel alias].
- The Action waits until `/version.json` reports the requested version and mode, then
  runs `verify.mjs` and writes a job summary.
- `/version.json` is served with `Cache-Control: no-store` and reports version, mode,
  productCount, productPaths, expectedErrorCodes.

### Verification tooling
- `scripts/verify.mjs`: ported from the existing repo. Checks live version, that old
  URLs 404 in `urls` and `both` modes, that old selectors match nothing, and prints
  PASS or FAIL per gate.
- `scripts/inputs.mjs`: writes the 12 product URLs as txt, csv, and json.

## Constraints
- Scraped elements use plain semantic class names or `data-*` attributes. No CSS
  Modules or hashed class names on anything a scraper reads.
- Deterministic HTML: no random content, no per-render timestamps.
- No external API at build or request time.
- Images: [local licensed assets / Unsplash / generated].
- Cart and wishlist are UI only. No checkout.
- Demo version badge: fixed pill outside the product DOM, [always visible / behind
  `?badge=1`].
- Vercel build under 90 seconds.

## Deliverable format
A repo containing: README (the three gates and quick start), `docs/runbook.md`
(Scraper Studio settings, demo steps, troubleshooting), the Action, the scripts, and a
live Vercel deployment.

## Failure handling
When a design or DX wish conflicts with a gate, the gate wins and the conflict is
noted in the README. When a requirement cannot be checked by `verify.mjs`, add a check
rather than trusting it.

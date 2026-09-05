# Voltique: a demo store that breaks scrapers on purpose

[![Switch store version](https://github.com/anilkk/scraper-demo-electronics-store/actions/workflows/switch-version.yml/badge.svg)](https://github.com/anilkk/scraper-demo-electronics-store/actions/workflows/switch-version.yml)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://vercel.com)

A realistic electronics store, built for the Bright Data **Scraper Studio Auto
Self-Healing** demo at Berlin AI Day. One URL serves either of two versions:

| | v1 | v2 |
|---|---|---|
| Look | light, blue, card grid | warm paper, serif, editorial |
| Price | `€299.00` | `299,00 €` |
| Title | `h1.product-name` | `h1.item-title` |
| Product URL | `/p/<slug>` | `/p/<slug>` (or `/shop/<category>/<slug>` in the `urls` and `both` modes) |

Same 12 products, same slugs, same data. A scraper built on v1 stops working on v2
with an error code Auto Self-Healing is allowed to act on, and the flip between them is a
one-click GitHub Action that finishes in seconds because every variant is pre-built.

**Read [docs/runbook.md](docs/runbook.md) before filming.** It covers the Scraper Studio
settings the demo needs (5 inputs, `price` required, Per Job checks), the on-stage
sequence, and what to do when nothing fires.

## Why it is built this way

[Auto Self-Healing](https://docs.brightdata.com/products/scraper-studio/auto-self-healing)
fires only when three gates pass at once:

| Gate | Default | How the store clears it |
|---|---|---|
| Success rate below threshold | 40 % | v2 drives a v1 scraper to 0 % |
| Minimum inputs | 10 | the demo uses 5 PDP URLs, so **set Minimum inputs to 5** |
| One of six error codes | | v2 produces `parse_error` (default) or `dead_page` |

Eligible codes: `crawl_error`, `parse_error`, `bad_cmd_arg`, `dead_page`, `bad_input`,
`bad_navigate`. `parse_error` triggers healing **and** heals. `dead_page` triggers but
cannot heal, since the page is gone. The default break mode is `selectors` for that reason.

Three things a Next.js store can get wrong are handled deliberately:

- **No hashed class names on scraped elements.** Every scraped field carries a plain
  semantic class from a per-version vocabulary (`src/components/v1`, `src/components/v2`).
  Tailwind utilities style the rest.
- **No product data outside the DOM.** Product objects never reach client-component props,
  so the React Server Component payload carries only the rendered tree, with the same
  class names as the DOM. No JSON-LD. The cart drawer looks products up from a
  client-only module. A scraper that "heals" by reading a hidden JSON blob is not a demo.
- **Real 404s.** Product routes set `dynamicParams = false` and there is no catch-all
  rewrite, so a URL a build does not serve returns HTTP 404, which is what `dead_page`
  needs.

## How switching works

```
deploy-variants.yml   builds v1, v2-selectors, v2-urls, v2-both  →  4 staged Vercel deployments,
                      each tagged with a `variant` meta key (runs on every push to main)
switch-version.yml    finds the newest deployment with that tag and promotes it
                      through the Vercel API                      →  live in seconds
                      polls /version.json, runs scripts/verify.mjs, writes a job summary
```

`/version.json` (no-store) reports version, mode, product paths and expected error codes.

## Quick start

```bash
npm install
npm run dev:v1            # http://localhost:3001
npm run dev:v2            # http://localhost:3002  (both can run side by side)
```

Build a specific variant:

```bash
STORE_VERSION=v2 BREAK_MODE=selectors npm run build
```

Deploy every variant and make v1 live (needs a logged-in Vercel CLI, or `VERCEL_TOKEN`):

```bash
npm run deploy:variants -- --promote v1
```

Flip, verify, generate scraper inputs:

```bash
npm run switch -- --version v2 --mode selectors --base-url https://scraper-demo-electronics.vercel.app
npm run verify -- --base-url https://scraper-demo-electronics.vercel.app
npm run inputs -- --base-url https://scraper-demo-electronics.vercel.app          # 5 URLs, txt/csv/json
```

## Setup for the GitHub Actions

| Kind | Name | Value |
|---|---|---|
| Secret | `VERCEL_TOKEN` | from vercel.com/account/settings/tokens, scope `random-test` (a team-scoped token is enough; the switch uses the REST API) |
| Variable | `VERCEL_ORG_ID` | `orgId` in `.vercel/project.json` after `vercel link` |
| Variable | `VERCEL_PROJECT_ID` | `projectId` in the same file |
| Variable | `STORE_BASE_URL` | production URL, no trailing slash |

Do **not** connect the Vercel project to this repo through the Git integration. An
automatic production deploy on push would override a promoted deployment mid-demo.
`vercel.json` disables Git deployments as a guard; deploys happen only through the
workflow or the CLI.

## Layout

```
data/products.json          the catalog: 12 products, 3 categories, one source for both versions
src/lib/variant.ts          STORE_VERSION and BREAK_MODE → vocabulary, URL shape, expected error codes
src/components/v1/          Shopcart-style design, v1 DOM vocabulary
src/components/v2/          editorial design, v2 DOM vocabulary
src/components/shared/      cart, wishlist, search filter, version badge (client-side, no product props)
src/app/                    routes: /, /c/[slug], /p/[slug], /shop/[category]/[slug], /search, /version.json
scripts/deploy-variants.mjs builds and deploys every variant, tags each with meta variant=<key>
scripts/switch.mjs          promotes a variant (API in CI, CLI locally) and waits for the live site to agree
scripts/verify.mjs          checks the three gates against the live site
scripts/inputs.mjs          writes the product URL lists for Scraper Studio
docs/runbook.md             the on-stage runbook
```

Images are from Unsplash under the Unsplash License. Product names, brands, reviews and
prices are fictional. Public data only, on a store you own.

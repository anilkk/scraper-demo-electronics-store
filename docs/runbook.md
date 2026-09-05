# Runbook: Berlin AI Day self-healing demo

This store exists to break a scraper on stage and let Bright Data Scraper Studio fix it.
The break has to be one Auto Self-Healing is allowed to act on, and the flip has to be
fast enough to fit a short slot. Both are designed in, but they only work if the
Scraper Studio side is set up as described here.

Source docs: [Auto Self-Healing](https://docs.brightdata.com/products/scraper-studio/auto-self-healing) ·
[Error codes](https://docs.brightdata.com/products/scraper-studio/error-codes) ·
[AI agent](https://docs.brightdata.com/products/scraper-studio/ai-agent)

Live store: `https://scraper-demo-electronics-store.vercel.app`

---

## The three gates

Auto Self-Healing runs only when all three hold at once.

| Gate | Default | What this demo does |
|---|---|---|
| Success rate below threshold | 40 % | v2 drives a v1 scraper to 0 % |
| Minimum inputs | **10** | the demo uses **5** product URLs, so set this to **5** |
| Error code in the eligible set | | v2 produces `parse_error` (selectors mode) |

Eligible codes: `crawl_error`, `parse_error`, `bad_cmd_arg`, `dead_page`, `bad_input`,
`bad_navigate`. Anything else, including `wait_element_timeout` and `blocked`, is ignored.

`parse_error` triggers healing and heals. `dead_page` triggers healing but leaves nothing
to relearn, so the scraper stays broken. The default break mode is `selectors` for that
reason.

## Break modes

| Mode | Class names | Product URLs | Price text | Error code |
|---|---|---|---|---|
| `selectors` (default) | renamed | unchanged, `/p/<slug>` | `€299.00` → `299,00 €` | `parse_error` |
| `urls` | unchanged | moved to `/shop/<category>/<slug>` | unchanged | `dead_page` |
| `both` | renamed | moved | changed | `dead_page` |

What v2 renames, for the fields a PDP scraper is likely to extract:

| Field | v1 selector | v2 selector | v2 text change |
|---|---|---|---|
| Title | `h1.product-name` | `h1.item-title` (brand in `.maker`, name in `.model`) | brand is now inside the h1 |
| Brand | `.product-brand` | `.maker` | |
| Price | `.product-price` | `.price-tag` (`.amt` + `.cur`) | `€299.00` → `299,00 €` |
| Was-price | `.product-compare-price` | `.was-price` | |
| Stock | `.product-stock` | `.stock-state[data-state]` | `In stock` → `Available now` |
| SKU | `.product-sku` | `.ref-code` | `SKU X` → `Ref. X` |
| Rating | `.rating-value` | `.rating-score` | `4.8` → `4,8 / 5` |
| Reviews | `.product-reviews` | `.review-count` | `1,243 reviews` → `1.243 reviews` |
| Specs | `table.product-specs tr.spec-row` (`th.spec-label`, `td.spec-value`) | `dl.detail-list .detail-row` (`dt.detail-row__key`, `dd.detail-row__value`) | table → definition list |
| Description | `section.product-description` | `.item-story` inside `<details>` | |
| Listing card | `.product-card` | `li.listing-tile` | |

The page `<title>` and the `h1` still contain the product name in v2, so a scraper that
only extracts a title may keep working. That is why the runbook asks you to mark `price`
required.

---

## Setup, once

### 1. Repository settings (GitHub → Settings → Secrets and variables → Actions)

| Kind | Name | Value |
|---|---|---|
| Secret | `VERCEL_TOKEN` | a token from vercel.com/account/settings/tokens, scope `random-test` (team-scoped is enough) |
| Variable | `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` after `vercel link` |
| Variable | `VERCEL_PROJECT_ID` | `projectId` from the same file |
| Variable | `STORE_BASE_URL` | the production URL, no trailing slash |

Without these the Actions stop at "Check configuration" with a message saying which is missing.

### 2. Deploy every variant

Actions → **Build and deploy all variants** → Run workflow (promote: `v1`).
Or locally with a logged-in Vercel CLI:

```bash
npm run deploy:variants -- --promote v1
```

This builds v1, v2-selectors, v2-urls and v2-both as staged production deployments,
each tagged with a `variant` meta key. It takes about four minutes, runs on every push
to `main`, and the switch finds the newest deployment per tag. The switch itself never
builds. Locally the script also writes `deployments.json` (ignored by git) for
`npm run switch`.

### 3. Build the scraper in Scraper Studio

1. New scraper → AI agent → **PDP scraper**.
2. Inputs: the 5 URLs from

   ```bash
   npm run inputs -- --base-url https://scraper-demo-electronics-store.vercel.app
   ```

   (written to `inputs/v1-selectors-product-urls.{txt,csv,json}`).
3. Ask for these fields: `name`, `brand`, `price`, `stock`, `sku`, `rating`, `review_count`, `specs`.
4. Make sure a missing price is an **error, not an empty cell**. Open the generated
   parser code in the IDE and check how `price` is read. Code like
   `$('.product-price').text()` returns `""` on v2 and the row counts as a success, so
   nothing fires. Code like `document.querySelector('.product-price').textContent`
   throws on v2 and gives `parse_error`. If in doubt, add one guard line after the
   price is read, then **Update Schema** and **Save to Production**:

   ```js
   if (!price) throw new Error('price not found on page');
   ```

   This is the single most common reason the demo does nothing.
5. Run it against v1. Expect 5 clean rows with prices like `€299.00`.

### 4. Configure Auto Self-Healing on the scraper

| Setting | Demo value | Why |
|---|---|---|
| Success rate threshold | 40 % (default) | v2 gives 0 % |
| **Minimum inputs** | **5** | the demo has 5 inputs, the default 10 never opens |
| Check frequency | **Per Job** | Per Day will not fire twice in one session |
| Cooldown hours | lowest allowed | the 3 h default blocks a second take |
| Max healing jobs per day | 8 (default) | failed attempts count too |
| Auto save code | on for a hands-off heal, off to review the diff on camera | off sends an email instead |

---

## Timing: healing takes minutes, not seconds

The docs say a healing refactor "can take up to 15 minutes" and Bright Data emails when
the diff is ready. The store flips in 9 seconds and the failed run shows in about a
minute, but the heal itself will not finish inside a short slot. Plan the talk around
that with **two identical scrapers**:

| Scraper | Auto Self-Healing | Role |
|---|---|---|
| `voltique-pdp-live` | on, Per Job, min inputs 5 | breaks live on stage and visibly *triggers* healing |
| `voltique-pdp-healed` | on, same settings | broken and healed 30 to 60 minutes before the slot; shows the *result* |

Two scrapers also sidestep the 3 hour cooldown, which would otherwise block a second
trigger on the scraper you rehearsed with. Both take the same 5 input URLs.

## On stage

Before the talk, run the Action once with `v1` so the store is in the "before" state,
and have the Scraper Studio scraper open with a fresh successful v1 run.

1. **Show the store and the scraper.** Open a product page. Run the scraper: 5 rows,
   prices, stock, specs.
2. **Flip.** Actions → **Switch store version** → `v2`, break mode `selectors` → Run.
   The job summary shows the moment the live site reports v2 and a PASS/FAIL per gate.
   Refresh the store: new design, badge in the corner reads `v2 · redesign · selectors`.
3. **Re-run the scraper.** It fails with `parse_error` on 5 of 5 inputs.
4. **Auto Self-Healing fires.** Open the scraper's Auto Self-Healing tab: the Status
   section lists the healing job that just started.
5. **Show the outcome on the second scraper.** Switch to `voltique-pdp-healed`: the diff
   from its earlier heal (old `.product-price` selector replaced by `.price-tag`), and its
   post-heal run with 5 rows reading `299,00 €`.
6. **Reset** afterwards: run the Action with `v1`.

Measured flip time on 2026-09-04: 5 to 15 seconds, including three consecutive confirmation polls. From a
terminal you can do the same without GitHub:

```bash
npm run switch -- --version v2 --mode selectors --base-url https://scraper-demo-electronics-store.vercel.app
```

Check state at any point:

```bash
npm run verify -- --base-url https://scraper-demo-electronics-store.vercel.app
```

It reports which version is live, what a v1-trained scraper would get on each of the 5
inputs, and PASS/FAIL against each gate.

---

## Troubleshooting

**The job succeeded with empty rows and no error code.**
`price` is not marked required. Fix step 3.4. Or switch to break mode `both` for a
`dead_page` that cannot be swallowed (but cannot be healed either).

**Nothing happened even though the run clearly failed.**
Check the gates in order: input count ≥ Minimum inputs (set it to 5), success rate below
threshold, and the error code is one of the six. `wait_element_timeout` and `blocked` look
like breakage but are not eligible.

**It fired once and then stopped.**
Cooldown, daily cap, or Per Day frequency. Failed attempts consume the budget too.

**It healed but the scraper still returns nothing.**
You are on `urls` or `both`: the input URLs are 404, nothing to relearn. Use `selectors`.

**The Switch Action ran but the site did not change.**
The job summary prints `attempt N: live=v1/selectors want=v2/selectors`. If it never
matches, the promote did not land: check that `VERCEL_TOKEN` belongs to the `random-test`
team and that the "Build and deploy all variants" workflow has run since the last
code change. Also check that the
Vercel project is **not** connected to the GitHub repo through the Git integration; an
automatic production deploy from a push would override the promoted deployment.
`vercel.json` disables Git deployments as a guard.

**Old URLs return 200 after switching to `urls`.**
There is no catch-all rewrite and `dynamicParams` is `false` on the product routes, so a
path a build does not generate is a real 404. If someone adds a rewrite, `dead_page`
disappears.

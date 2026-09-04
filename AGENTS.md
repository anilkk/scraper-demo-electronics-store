# Agent notes

Demo store for the Bright Data Scraper Studio Auto Self-Healing talk. Read README.md
first, then docs/runbook.md. Two rules that must survive any edit:

1. Every scraped field (name, brand, price, stock, SKU, specs, rating) is server-rendered
   and carries a plain semantic class from the v1 or v2 vocabulary in
   `src/components/v1` and `src/components/v2`. Never style those elements with hashed
   class names, and never move product data into client-component props.
2. A product URL that a build does not serve must return HTTP 404. No catch-all rewrites.

Build variants with `STORE_VERSION` and `BREAK_MODE`. See `src/lib/variant.ts`.

// Shared helpers for the demo scripts. Mirrors src/lib/variant.ts without
// importing TypeScript, so the scripts run with plain Node.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const CATALOG = JSON.parse(readFileSync(join(ROOT, "data/products.json"), "utf8"));
export const VARIANTS = [
  { key: "v1", version: "v1", mode: "selectors" },
  { key: "v2-selectors", version: "v2", mode: "selectors" },
  { key: "v2-urls", version: "v2", mode: "urls" },
  { key: "v2-both", version: "v2", mode: "both" },
];

export function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : fallback;
}
export function flag(name) {
  return process.argv.includes(`--${name}`);
}

export function resolve(version, mode = "selectors") {
  if (version === "v1") return { vocab: "v1", urls: "v1" };
  return { vocab: mode === "urls" ? "v1" : "v2", urls: mode === "selectors" ? "v1" : "v2" };
}

export function productPath(p, urls) {
  return urls === "v1" ? `/p/${p.slug}` : `/shop/${p.category}/${p.slug}`;
}

/** The selectors a v1-trained scraper would use, and what v2 renamed them to. */
export const SELECTORS = {
  v1: { title: "h1.product-name", price: ".product-price", brand: ".product-brand", stock: ".product-stock", sku: ".product-sku", specs: ".product-specs .spec-row", rating: ".rating-value", card: ".product-card" },
  v2: { title: "h1.item-title", price: ".price-tag", brand: ".maker", stock: ".stock-state", sku: ".ref-code", specs: ".detail-list .detail-row", rating: ".rating-score", card: ".listing-tile" },
};

export function baseUrl() {
  const b = arg("base-url", process.env.STORE_BASE_URL || "");
  return b.replace(/\/+$/, "");
}

export function color(on) {
  const enabled = process.stdout.isTTY && !process.env.NO_COLOR;
  return {
    pass: enabled ? "\x1b[32mPASS\x1b[0m" : "PASS",
    fail: enabled ? "\x1b[31mFAIL\x1b[0m" : "FAIL",
    dim: (s) => (enabled ? `\x1b[2m${s}\x1b[0m` : s),
    bold: (s) => (enabled ? `\x1b[1m${s}\x1b[0m` : s),
  };
}

/**
 * Team scope for the Vercel CLI. Without it, `vercel promote <url>` can resolve
 * to the personal account and fail with "Deployment belongs to a different team".
 * Order: VERCEL_SCOPE, VERCEL_ORG_ID (CI), then .vercel/project.json (local link).
 */
export function scopeArgs() {
  if (process.env.VERCEL_SCOPE) return ["--scope", process.env.VERCEL_SCOPE];
  // In CI the CLI reads VERCEL_ORG_ID itself. Passing --scope on top makes a
  // team-scoped token fail with "User not found (404)".
  if (process.env.VERCEL_ORG_ID) return [];
  try {
    const link = JSON.parse(readFileSync(join(ROOT, ".vercel/project.json"), "utf8"));
    if (link.orgId) return ["--scope", link.orgId];
  } catch {}
  return [];
}

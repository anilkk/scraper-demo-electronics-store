#!/usr/bin/env node
// Writes the product URL lists Scraper Studio takes as inputs.
//
//   node scripts/inputs.mjs --base-url https://your-store.vercel.app [--version v1] [--mode selectors] [--count 5]
//
// Output: inputs/<version>-<mode>-product-urls.{txt,csv,json}
// The default count is 5 because the Berlin demo uses a PDP scraper with 5
// inputs. Remember to set Minimum inputs to 5 in Auto Self-Healing, or the
// 10-input default gate never opens.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, CATALOG, arg, resolve, productPath, baseUrl } from "./lib.mjs";

const base = baseUrl();
if (!base) {
  console.error("error: pass --base-url https://your-store.vercel.app (or set STORE_BASE_URL)");
  process.exit(1);
}
const version = arg("version", "v1");
const mode = arg("mode", "selectors");
const count = Number(arg("count", 5));
const { urls } = resolve(version, mode);

const list = CATALOG.products.slice(0, count).map((p) => `${base}${productPath(p, urls)}`);
const dir = join(ROOT, "inputs");
mkdirSync(dir, { recursive: true });
const stem = join(dir, `${version}-${mode}-product-urls`);
writeFileSync(`${stem}.txt`, list.join("\n") + "\n");
writeFileSync(`${stem}.csv`, "url\n" + list.join("\n") + "\n");
writeFileSync(`${stem}.json`, JSON.stringify(list.map((url) => ({ url })), null, 2) + "\n");

console.log(`${list.length} URLs for ${version} (${mode}, url shape ${urls}) written to inputs/${version}-${mode}-product-urls.{txt,csv,json}`);
for (const u of list) console.log("  " + u);

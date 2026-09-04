#!/usr/bin/env node
// Points the production domain at an already-built variant. Seconds, not minutes.
//
//   node scripts/switch.mjs --version v2 [--mode selectors] [--base-url https://your-store.vercel.app]
//
// Reads deployments.json (written by deploy-variants.mjs), runs
// `vercel promote`, then polls /version.json until the live site agrees.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, arg, baseUrl, scopeArgs } from "./lib.mjs";

const version = arg("version", "v2");
const mode = version === "v1" ? "selectors" : arg("mode", "selectors");
const key = version === "v1" ? "v1" : `v2-${mode}`;
const token = process.env.VERCEL_TOKEN ? ["--token", process.env.VERCEL_TOKEN] : [];
const scope = scopeArgs();

const record = JSON.parse(readFileSync(join(ROOT, "deployments.json"), "utf8"));
const d = record.deployments[key];
if (!d) {
  console.error(`error: no deployment recorded for ${key}. Run scripts/deploy-variants.mjs first.`);
  process.exit(1);
}

console.log(`Promoting ${key} (${d.url}, commit ${d.commit})`);
const started = Date.now();
execFileSync("vercel", ["promote", d.url, "--yes", ...token, ...scope], { cwd: ROOT, stdio: "inherit" });

const base = baseUrl();
if (!base) {
  console.log("Promoted. Set STORE_BASE_URL or pass --base-url to wait for the live site.");
  process.exit(0);
}
// Edge nodes can disagree for a few seconds after a promote, so require the
// live site to report the new version three polls in a row.
const NEEDED = 3;
let streak = 0;
for (let i = 1; i <= 60; i++) {
  try {
    const res = await fetch(`${base}/version.json`, { cache: "no-store" });
    const live = await res.json();
    const match = live.version === version && live.mode === mode;
    streak = match ? streak + 1 : 0;
    if (streak >= NEEDED) {
      console.log(`Live: ${live.version}/${live.mode} after ${Math.round((Date.now() - started) / 1000)}s (${NEEDED} consecutive checks)`);
      process.exit(0);
    }
    console.log(`  attempt ${i}: live=${live.version}/${live.mode} want=${version}/${mode}${match ? ` (${streak}/${NEEDED})` : ""}`);
  } catch (err) {
    streak = 0;
    console.log(`  attempt ${i}: ${err.message}`);
  }
  await new Promise((r) => setTimeout(r, 2000));
}
console.error("Timed out waiting for the live site to report the new version.");
process.exit(1);

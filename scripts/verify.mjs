#!/usr/bin/env node
// Checks what the live store serves and whether it clears every Auto
// Self-Healing trigger gate against a scraper trained on v1.
//
//   node scripts/verify.mjs --base-url https://your-store.vercel.app [--min-inputs 5] [--inputs 5] [--expect v2/selectors]
//
// Exit code is 0 when every gate passes, 1 otherwise. --expect fails the run
// if the live version/mode is not the one you asked for.
import { CATALOG, arg, resolve, productPath, baseUrl, color, SELECTORS } from "./lib.mjs";

const base = baseUrl();
if (!base) {
  console.error("error: pass --base-url https://your-store.vercel.app (or set STORE_BASE_URL)");
  process.exit(1);
}
const minInputs = Number(arg("min-inputs", 5));
const inputCount = Number(arg("inputs", 5));
const successThreshold = Number(arg("success-threshold", 40));
const expect = arg("expect", "");
const c = color();

async function get(url) {
  try {
    const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "voltique-verify/1.0" } });
    return { status: res.status, body: res.ok ? await res.text() : "" };
  } catch (err) {
    return { status: 0, body: "", error: err.message };
  }
}

// Match a class selector like ".product-price" or "h1.product-name" against raw HTML.
function matches(html, selector) {
  const cls = selector.split(".").pop();
  return new RegExp(`class="[^"]*\\b${cls}\\b[^"]*"`).test(html);
}

const state = await get(`${base}/version.json`);
if (state.status !== 200) {
  console.error(`error: ${base}/version.json returned ${state.status}. Is the URL right and has Vercel finished promoting?`);
  process.exit(1);
}
const live = JSON.parse(state.body);
console.log(c.bold(`Live: ${live.version} / ${live.mode}`) + c.dim(`  vocab=${live.vocab} urls=${live.urlShape} products=${live.productCount}`));
if (expect && expect !== `${live.version}/${live.mode}`) {
  console.error(`${c.fail} expected ${expect}, live is ${live.version}/${live.mode}`);
  process.exit(1);
}

// A scraper trained on v1 holds these URLs and these selectors.
const trained = resolve("v1");
const inputs = CATALOG.products.slice(0, inputCount).map((p) => `${base}${productPath(p, trained.urls)}`);
const pages = await Promise.all(inputs.map(get));

let ok = 0, dead = 0, parseFail = 0;
const rows = [];
for (let i = 0; i < inputs.length; i++) {
  const r = pages[i];
  let outcome;
  if (r.status === 404 || r.status === 410) { dead++; outcome = "404  dead_page"; }
  else if (r.status !== 200) { dead++; outcome = `${r.status || "ERR"}  crawl_error`; }
  else {
    const title = matches(r.body, SELECTORS.v1.title);
    const price = matches(r.body, SELECTORS.v1.price);
    if (title && price) { ok++; outcome = "200  ok, v1 selectors resolve"; }
    else { parseFail++; outcome = `200  parse_error (title ${title ? "found" : "missing"}, price ${price ? "found" : "missing"})`; }
  }
  rows.push(`  ${outcome.padEnd(48)} ${inputs[i].replace(base, "")}`);
}
console.log(`\nA v1-trained scraper against ${inputs.length} inputs:`);
console.log(rows.join("\n"));

const successRate = Math.round((ok / inputs.length) * 100);
const codes = [];
if (dead) codes.push("dead_page");
if (parseFail) codes.push("parse_error");
const eligible = ["crawl_error", "parse_error", "bad_cmd_arg", "dead_page", "bad_input", "bad_navigate"];

console.log("\nAuto Self-Healing gates:");
const gate1 = successRate < successThreshold;
const gate2 = inputs.length >= minInputs;
const gate3 = codes.some((x) => eligible.includes(x));
console.log(`  ${gate1 ? c.pass : c.fail}  success rate ${successRate}% < ${successThreshold}%`);
console.log(`  ${gate2 ? c.pass : c.fail}  inputs ${inputs.length} >= minimum ${minInputs}  ${c.dim("(set Minimum inputs to " + minInputs + " in Scraper Studio)")}`);
console.log(`  ${gate3 ? c.pass : c.fail}  error code in eligible set: ${codes.length ? codes.join(", ") : "none"}`);

if (live.version === "v1") {
  console.log(`\n${c.dim("v1 is live: the scraper works, so no gate is expected to pass yet. Flip to v2 and run again.")}`);
  process.exit(gate1 || gate3 ? 1 : 0);
}
if (codes.includes("dead_page") && !codes.includes("parse_error")) {
  console.log(`\n${c.dim("dead_page triggers healing but leaves nothing to relearn. Use mode selectors for a full recovery on stage.")}`);
}
const all = gate1 && gate2 && gate3;
console.log(`\n${all ? c.pass : c.fail}  ${all ? "all three gates clear, healing can fire" : "healing will not fire"}`);
process.exit(all ? 0 : 1);

#!/usr/bin/env node
// Builds and deploys every store variant to Vercel as a staged production
// deployment (no domain attached), then records the URLs in deployments.json.
// Switching the live store later is a `vercel promote`, which takes seconds.
//
//   node scripts/deploy-variants.mjs [--only v1,v2-selectors] [--promote v1]
//
// Needs: a linked Vercel project (`vercel link`) or VERCEL_ORG_ID +
// VERCEL_PROJECT_ID, and VERCEL_TOKEN when running in CI.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ROOT, VARIANTS, arg } from "./lib.mjs";

const only = arg("only", "").split(",").filter(Boolean);
const promote = arg("promote", "");
const token = process.env.VERCEL_TOKEN ? ["--token", process.env.VERCEL_TOKEN] : [];
const scope = process.env.VERCEL_SCOPE ? ["--scope", process.env.VERCEL_SCOPE] : [];
const file = join(ROOT, "deployments.json");
const record = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : { deployments: {} };
const sha = (() => { try { return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT }).toString().trim(); } catch { return "unknown"; } })();

function vercel(args, opts = {}) {
  return execFileSync("vercel", [...args, ...token, ...scope], { cwd: ROOT, stdio: ["ignore", "pipe", "inherit"], ...opts }).toString().trim();
}

for (const v of VARIANTS) {
  if (only.length && !only.includes(v.key)) continue;
  console.log(`\n== ${v.key}  (STORE_VERSION=${v.version} BREAK_MODE=${v.mode})`);
  const url = vercel([
    "deploy", "--prod", "--skip-domain", "--yes",
    "--build-env", `STORE_VERSION=${v.version}`,
    "--build-env", `BREAK_MODE=${v.mode}`,
    "--build-env", `BUILD_TIME=${new Date().toISOString()}`,
    "--meta", `variant=${v.key}`, "--meta", `commit=${sha}`,
  ]);
  // The CLI prints a bare URL in a terminal and a JSON document in agent mode. Accept both.
  let deploymentUrl = "";
  try { deploymentUrl = JSON.parse(url).deployment?.url || JSON.parse(url).url || ""; } catch {}
  if (!deploymentUrl) deploymentUrl = (url.match(/https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.vercel\.app/g) || []).pop() || "";
  if (!deploymentUrl.startsWith("https://")) deploymentUrl = `https://${deploymentUrl}`;
  if (deploymentUrl === "https://") throw new Error(`could not read deployment URL from vercel output:\n${url}`);
  record.deployments[v.key] = { url: deploymentUrl, version: v.version, mode: v.mode, commit: sha, deployedAt: new Date().toISOString() };
  console.log(`   ${deploymentUrl}`);
  writeFileSync(file, JSON.stringify(record, null, 2) + "\n");
}

if (promote) {
  const d = record.deployments[promote];
  if (!d) throw new Error(`no deployment recorded for ${promote}`);
  console.log(`\n== promote ${promote} -> production domain`);
  console.log(vercel(["promote", d.url, "--yes"]));
}
console.log(`\nRecorded in deployments.json`);

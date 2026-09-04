/**
 * Build-time variant selection.
 *
 * The whole demo rests on two environment variables read at build time:
 *   STORE_VERSION  v1 | v2         which design and DOM vocabulary is served
 *   BREAK_MODE     selectors | urls | both   how v2 breaks a scraper built on v1
 *
 * Every deployment is built once with a fixed pair, so the served HTML is
 * deterministic. Switching versions means promoting a different deployment,
 * never rebuilding on stage.
 */

export const VERSIONS = ["v1", "v2"] as const;
export const MODES = ["selectors", "urls", "both"] as const;
export type Version = (typeof VERSIONS)[number];
export type Mode = (typeof MODES)[number];

function pick<T extends string>(raw: string | undefined, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(raw ?? "") ? (raw as T) : fallback;
}

export const VERSION: Version = pick(process.env.STORE_VERSION, VERSIONS, "v1");
export const MODE: Mode = pick(process.env.BREAK_MODE, MODES, "selectors");

/** Which vocabulary (class names, price format) and URL shape this build uses. */
export function resolve(version: Version = VERSION, mode: Mode = MODE) {
  if (version === "v1") return { vocab: "v1" as const, urls: "v1" as const, theme: "v1" as const };
  return {
    vocab: mode === "urls" ? ("v1" as const) : ("v2" as const),
    urls: mode === "selectors" ? ("v1" as const) : ("v2" as const),
    theme: "v2" as const,
  };
}

export const RESOLVED = resolve();

/** Scraper Studio error codes this build is expected to produce against a v1 scraper. */
export function expectedErrorCodes(version: Version = VERSION, mode: Mode = MODE): string[] {
  if (version === "v1") return [];
  const r = resolve(version, mode);
  const codes: string[] = [];
  if (r.urls === "v2") codes.push("dead_page");
  if (r.vocab === "v2") codes.push("parse_error");
  return codes;
}

/** Product URL for the current build. */
export function productPath(slug: string, category: string, urls: "v1" | "v2" = RESOLVED.urls): string {
  return urls === "v1" ? `/p/${slug}` : `/shop/${category}/${slug}`;
}

export function categoryPath(slug: string): string {
  return `/c/${slug}`;
}

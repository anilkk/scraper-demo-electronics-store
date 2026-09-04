import { PRODUCTS } from "@/lib/products";
import { VERSION, MODE, RESOLVED, expectedErrorCodes, productPath } from "@/lib/variant";

/**
 * Reports what this deployment is. The switch workflow polls it until the
 * live URL reports the requested version, and verify.mjs reads it to know
 * which selectors and URLs should resolve.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const body = {
    version: VERSION,
    mode: MODE,
    vocab: RESOLVED.vocab,
    urlShape: RESOLVED.urls,
    productCount: PRODUCTS.length,
    productPaths: PRODUCTS.map((p) => productPath(p.slug, p.category)),
    expectedErrorCodes: expectedErrorCodes(),
    builtAt: process.env.BUILD_TIME ?? null,
  };
  return Response.json(body, { headers: { "Cache-Control": "no-store" } });
}

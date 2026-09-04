import type { MetadataRoute } from "next";

/** Everything is open. Scrapers are the point. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}

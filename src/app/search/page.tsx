import type { Metadata } from "next";
import { UI } from "@/components";
import { PRODUCTS, onSale, search } from "@/lib/products";

export const metadata: Metadata = { title: "Search" };

/** Server-rendered results: works with JavaScript off and is shareable as a URL. */
export default async function SearchRoute({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  let results = query ? search(query) : PRODUCTS;
  if (query.toLowerCase() === "sale" || query.toLowerCase() === "deals") results = onSale();
  if (query.toLowerCase() === "best") results = [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount);
  return <UI.SearchPage query={query} results={results} />;
}

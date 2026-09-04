"use client";
/**
 * Client-side product lookup for the cart drawer. Imported only by client
 * components, so this JSON ships in a JS chunk and never in the page HTML.
 * That keeps product fields out of the server-rendered payload, which is
 * what the scraper reads.
 */
import catalog from "../../data/products.json";

export interface CartProductInfo {
  slug: string;
  name: string;
  brand: string;
  price: number;
  imageId: string;
  category: string;
}

const BY_SLUG = new Map<string, CartProductInfo>(
  catalog.products.map((p) => [
    p.slug,
    { slug: p.slug, name: p.name, brand: p.brand, price: p.price, imageId: p.image.id, category: p.category },
  ]),
);

export function lookup(slug: string): CartProductInfo | undefined {
  return BY_SLUG.get(slug);
}

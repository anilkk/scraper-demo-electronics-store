import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { UI } from "@/components";
import { PRODUCTS, getProduct, related } from "@/lib/products";
import { RESOLVED } from "@/lib/variant";

/** v2 URL shape: /shop/<category>/<slug>. Only generated in the urls and both modes. */
export const dynamicParams = false;

export function generateStaticParams() {
  if (RESOLVED.urls !== "v2") return [];
  return PRODUCTS.map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? { title: `${p.brand} ${p.name}`, description: p.tagline } : {};
}

export default async function ProductRoute({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const product = getProduct(slug);
  if (!product || product.category !== category || RESOLVED.urls !== "v2") notFound();
  return <UI.ProductPage product={product} related={related(product)} />;
}

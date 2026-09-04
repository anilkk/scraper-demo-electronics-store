import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { UI } from "@/components";
import { PRODUCTS, getProduct, related } from "@/lib/products";
import { RESOLVED } from "@/lib/variant";

/**
 * v1 URL shape: /p/<slug>
 * Served only when this build uses the v1 URL shape. Otherwise no params are
 * generated and, with dynamicParams off, every request here is a real 404.
 * That 404 is what makes Scraper Studio report dead_page in the urls modes.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  if (RESOLVED.urls !== "v1") return [];
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? { title: `${p.brand} ${p.name}`, description: p.tagline } : {};
}

export default async function ProductRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || RESOLVED.urls !== "v1") notFound();
  return <UI.ProductPage product={product} related={related(product)} />;
}

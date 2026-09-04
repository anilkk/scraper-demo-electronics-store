import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { UI } from "@/components";
import { CATEGORIES, getCategory, productsIn } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return { title: c?.name ?? "Category", description: c?.blurb };
}

export default async function CategoryRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  return <UI.CategoryPage category={category} products={productsIn(slug)} />;
}

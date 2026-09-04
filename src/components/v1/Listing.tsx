import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import { categoryPath } from "@/lib/variant";
import { unsplash } from "@/lib/images";
import { InstantFilter } from "@/components/shared/InstantFilter";
import { ProductGrid } from "./ProductCard";
import { Breadcrumbs } from "./Blocks";

const filterProps = {
  tileSelector: ".product-card",
  attr: "data-product-search",
  placeholder: "Filter these results…",
  className: "flex items-center gap-3",
  inputClass: "w-56 rounded-lg border border-mist bg-white px-3 py-2 text-sm outline-none focus:border-brand",
  countClass: "text-sm text-slate-500",
};

function CategoryChips({ active }: { active?: string }) {
  return (
    <ul className="flex flex-wrap gap-2">
      <li><Link href="/search?q=" className={`rounded-full border px-3 py-1.5 text-sm ${!active ? "border-brand bg-brand text-white" : "border-mist hover:border-brand"}`}>All</Link></li>
      {CATEGORIES.map((c) => (
        <li key={c.slug}><Link href={categoryPath(c.slug)} className={`rounded-full border px-3 py-1.5 text-sm ${active === c.slug ? "border-brand bg-brand text-white" : "border-mist hover:border-brand"}`}>{c.name}</Link></li>
      ))}
    </ul>
  );
}

export function CategoryPage({ category: c, products }: { category: Category; products: Product[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: c.name }]} />
      <div className="relative mt-4 overflow-hidden rounded-2xl bg-navy text-white">
        <Image src={unsplash(c.image.id, 1600, 500)} alt={c.image.alt} fill priority sizes="100vw" className="object-cover opacity-50" />
        <div className="relative px-8 py-14">
          <h1 className="category-name text-4xl font-bold">{c.name}</h1>
          <p className="mt-2 max-w-md text-white/80">{c.blurb}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <CategoryChips active={c.slug} />
        <div className="flex items-center gap-4">
          <InstantFilter {...filterProps} gridId="category-grid" />
          <p className="text-sm text-slate-500">{products.length} products</p>
        </div>
      </div>
      <div className="mt-6"><ProductGrid products={products} id="category-grid" /></div>
    </div>
  );
}

export function SearchPage({ query, results }: { query: string; results: Product[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="mt-4 text-3xl font-bold">{query ? <>Results for “<span className="text-brand">{query}</span>”</> : "All products"}</h1>
      <p className="mt-1 text-slate-500">{results.length} {results.length === 1 ? "product" : "products"}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <CategoryChips />
        <InstantFilter {...filterProps} gridId="search-grid" />
      </div>
      <div className="mt-6">
        {results.length ? <ProductGrid products={results} id="search-grid" /> : (
          <div className="rounded-2xl border border-dashed border-mist p-16 text-center">
            <p className="text-lg font-semibold">Nothing matched “{query}”.</p>
            <p className="mt-1 text-slate-500">Try a brand, a category, or a feature like “battery”.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold">That page has moved or never existed.</h1>
      <p className="mt-2 text-slate-500">Head back to the shop floor.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white">Back to home</Link>
    </div>
  );
}

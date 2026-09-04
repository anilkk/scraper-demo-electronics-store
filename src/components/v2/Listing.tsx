import Image from "next/image";
import Link from "next/link";
import type { Category, Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import { categoryPath } from "@/lib/variant";
import { unsplash } from "@/lib/images";
import { InstantFilter } from "@/components/shared/InstantFilter";
import { Catalogue } from "./Tile";
import { Crumbtrail, Eyebrow } from "./Blocks";

const filterProps = {
  tileSelector: ".listing-tile",
  attr: "data-tile-search",
  placeholder: "Refine",
  className: "flex items-center gap-4",
  inputClass: "w-40 border-b border-ink/30 bg-transparent py-1 text-xs uppercase tracking-[0.2em] outline-none focus:border-ink placeholder:text-ink-soft",
  countClass: "text-xs uppercase tracking-[0.2em] text-ink-soft",
};

function CollectionNav({ active }: { active?: string }) {
  return (
    <nav className="flex flex-wrap gap-6 text-xs uppercase tracking-[0.25em]" aria-label="Collections">
      <Link href="/search?q=" className={`border-b pb-1 ${!active ? "border-ink" : "border-transparent text-ink-soft hover:text-ink"}`}>All</Link>
      {CATEGORIES.map((c) => (<Link key={c.slug} href={categoryPath(c.slug)} className={`border-b pb-1 ${active === c.slug ? "border-ink" : "border-transparent text-ink-soft hover:text-ink"}`}>{c.name}</Link>))}
    </nav>
  );
}

export function CategoryPage({ category: c, products }: { category: Category; products: Product[] }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-8">
      <Crumbtrail items={[{ label: "Home", href: "/" }, { label: c.name }]} />
      <div className="mt-10 grid items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <Eyebrow>Collection</Eyebrow>
          <h1 className="collection-title mt-3 font-serif text-6xl leading-none md:text-7xl">{c.name}</h1>
          <p className="mt-5 max-w-md text-ink-soft">{c.blurb}</p>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden bg-paper-deep md:col-span-5">
          <Image src={unsplash(c.image.id, 1000, 563)} alt={c.image.alt} fill priority sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
      </div>
      <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-y border-ink/15 py-4">
        <CollectionNav active={c.slug} />
        <div className="flex items-center gap-6">
          <InstantFilter {...filterProps} gridId="collection" />
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">{products.length} pieces</p>
        </div>
      </div>
      <div className="mt-12"><Catalogue products={products} id="collection" /></div>
    </div>
  );
}

export function SearchPage({ query, results }: { query: string; results: Product[] }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-8">
      <Crumbtrail items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="mt-10">
        <Eyebrow>{query ? "Search" : "Everything"}</Eyebrow>
        <h1 className="mt-3 font-serif text-5xl leading-none md:text-6xl">{query ? <>“{query}”</> : "The whole shelf"}</h1>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-ink-soft">{results.length} {results.length === 1 ? "piece" : "pieces"}</p>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-y border-ink/15 py-4">
        <CollectionNav />
        <InstantFilter {...filterProps} gridId="results" />
      </div>
      <div className="mt-12">
        {results.length ? <Catalogue products={results} id="results" /> : (
          <div className="border border-dashed border-ink/30 px-8 py-24 text-center">
            <p className="font-serif text-2xl">Nothing here for “{query}”.</p>
            <p className="mt-2 text-sm text-ink-soft">Try a maker, a collection, or something like “battery”.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-32 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-4 font-serif text-5xl">This page has left the building.</h1>
      <p className="mt-3 text-ink-soft">It may have moved with the redesign.</p>
      <Link href="/" className="mt-8 inline-block border-b border-ink pb-1 text-xs uppercase tracking-[0.25em] hover:text-terra">Back to the shop</Link>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, featured, onSale, getProduct } from "@/lib/products";
import { categoryPath, productPath } from "@/lib/variant";
import { unsplash } from "@/lib/images";
import { ProductGrid } from "./ProductCard";
import { Section, TrustBar, Newsletter } from "./Blocks";

export function HomePage() {
  const hero = getProduct("aurora-anc-headphones") ?? featured(1)[0];
  return (
    <>
      <section className="bg-brand-soft">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand shadow-sm">Autumn drop · new arrivals in every category</p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">Sound. Worn. Home.<br />Electronics that earn their place.</h1>
            <p className="mt-4 max-w-md text-lg text-slate-ink">Twelve products we would buy ourselves, tested in Berlin flats, on the U-Bahn and in the rain.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={categoryPath("audio")} className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark">Shop audio</Link>
              <Link href="/search?q=sale" className="rounded-lg border border-mist bg-white px-6 py-3 font-semibold hover:border-brand">See deals</Link>
            </div>
            <ul className="mt-8 flex gap-6 text-sm text-slate-500">
              <li><strong className="block text-2xl font-bold text-navy">4.7</strong>average rating</li>
              <li><strong className="block text-2xl font-bold text-navy">14k</strong>reviews</li>
              <li><strong className="block text-2xl font-bold text-navy">2 yr</strong>warranty</li>
            </ul>
          </div>
          <Link href={productPath(hero.slug, hero.category)} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-xl">
            <Image src={unsplash(hero.image.id, 1200, 900)} alt={hero.image.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-4 py-3 shadow backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-brand">{hero.badge ?? "Featured"}</p>
              <p className="font-semibold">{hero.name}</p>
            </div>
          </Link>
        </div>
      </section>

      <Section title="Shop by category" subtitle="Three shelves, no filler.">
        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={categoryPath(c.slug)} className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-cloud">
              <Image src={unsplash(c.image.id, 800, 600)} alt={c.image.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-5 text-white">
                <h3 className="text-xl font-bold">{c.name}</h3>
                <p className="text-sm text-white/80">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Best sellers" subtitle="What Berlin bought this month." link={{ href: "/search?q=best", label: "View all" }}>
        <ProductGrid products={featured(8)} id="home-featured" />
      </Section>

      <TrustBar />

      <Section title="On sale this week" subtitle="Prices drop on Thursdays. These already did." link={{ href: "/search?q=sale", label: "All deals" }}>
        <ProductGrid products={onSale().slice(0, 4)} id="home-sale" />
      </Section>

      <Newsletter />
    </>
  );
}

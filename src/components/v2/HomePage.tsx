import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, featured, onSale, getProduct } from "@/lib/products";
import { categoryPath, productPath } from "@/lib/variant";
import { unsplash } from "@/lib/images";
import { Catalogue } from "./Tile";
import { Eyebrow } from "./Blocks";

export function HomePage() {
  const lead = getProduct("aurora-anc-headphones") ?? featured(1)[0];
  const hero = [lead];
  return (
    <>
      <section className="relative h-[82vh] min-h-[520px] overflow-hidden bg-ink text-paper">
        <Image src={unsplash(hero[0].image.id, 2000, 1400)} alt={hero[0].image.alt} fill priority sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-6 pb-16">
          <Eyebrow light>Autumn edit · 2026</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] md:text-7xl">Objects that earn their place.</h1>
          <p className="mt-6 max-w-md text-paper/80">Twelve pieces of electronics, chosen slowly. Tested in Berlin flats, on the U-Bahn, in the rain.</p>
          <div className="mt-8 flex gap-8 text-xs uppercase tracking-[0.25em]">
            <Link href={categoryPath("audio")} className="border-b border-paper pb-1 hover:text-terra hover:border-terra">Explore audio</Link>
            <Link href={productPath(hero[0].slug, hero[0].category)} className="border-b border-transparent pb-1 text-paper/70 hover:text-paper">The {hero[0].name}</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Link key={c.slug} href={categoryPath(c.slug)} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-paper-deep">
                <Image src={unsplash(c.image.id, 800, 1067)} alt={c.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <h2 className="font-serif text-3xl">{c.name}</h2>
                <span className="text-xs tabular-nums tracking-[0.25em] text-ink-soft">0{i + 1}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper-deep/50">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-24 md:grid-cols-12">
          <div className="md:col-span-4"><Eyebrow>Most loved</Eyebrow><h2 className="mt-4 font-serif text-4xl leading-tight">The pieces people write to us about.</h2><p className="mt-4 text-ink-soft">Ranked by review count, refreshed monthly. Nothing paid for its place.</p></div>
          <div className="md:col-span-8"><Catalogue products={featured(6)} id="home-loved" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden bg-paper-deep">
            <Image src={unsplash("photo-1546868871-7041f2a55e12", 1200, 1200)} alt="Smartwatch worn on a wrist" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <Eyebrow>Our promise</Eyebrow>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">Fewer things, chosen with more care.</h2>
            <p className="mt-6 leading-relaxed text-ink-soft">We stock twelve products. Each one is used by someone on the team for at least a month before it goes on the shelf. If it breaks, our Kreuzberg workshop fixes it. If it disappoints, send it back within thirty days and we cover the label.</p>
            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-ink/15 pt-6">
              {[["2 yr", "warranty"], ["30 d", "returns"], ["1 shop", "Berlin"]].map(([v, l]) => (<div key={l}><dt className="font-serif text-3xl">{v}</dt><dd className="text-xs uppercase tracking-[0.2em] text-ink-soft">{l}</dd></div>))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-8">
        <div className="mb-10 flex items-end justify-between"><div><Eyebrow>Reduced</Eyebrow><h2 className="mt-3 font-serif text-4xl">Season&rsquo;s end</h2></div><Link href="/search?q=sale" className="text-xs uppercase tracking-[0.25em] hover:text-terra">All reductions</Link></div>
        <Catalogue products={onSale().slice(0, 3)} id="home-sale" />
      </section>
    </>
  );
}

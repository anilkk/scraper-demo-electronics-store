import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategory } from "@/lib/products";
import { formatPrice, discountPct } from "@/lib/money";
import { unsplash } from "@/lib/images";
import { categoryPath } from "@/lib/variant";
import { QuantityAddToCart } from "@/components/shared/QuantityAddToCart";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { Catalogue, PriceTag } from "./Tile";
import { Crumbtrail, Eyebrow } from "./Blocks";

const STOCK: Record<Product["stock"], { label: string; state: string }> = {
  in_stock: { label: "Available now", state: "available" },
  low_stock: { label: "Low stock", state: "low" },
  preorder: { label: "Pre-order · ships October", state: "preorder" },
};

export function ProductPage({ product: p, related }: { product: Product; related: Product[] }) {
  const cat = getCategory(p.category);
  const pct = discountPct(p.price, p.compareAt);
  const stock = STOCK[p.stock];
  return (
    <>
      <article className="item-detail mx-auto max-w-[1400px] px-6 pt-8" data-ref={p.sku}>
        <Crumbtrail items={[{ label: "Home", href: "/" }, { label: cat?.name ?? p.category, href: categoryPath(p.category) }, { label: p.name }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          <div className="item-visual lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
              <Image src={unsplash(p.image.id, 1400, 1750)} alt={p.image.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="item-visual__img object-cover" />
              {p.badge && <span className="absolute left-5 top-5 text-[11px] uppercase tracking-[0.25em]">{p.badge}</span>}
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-ink-soft">{p.image.alt}</p>
          </div>

          <div className="item-summary lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>{cat?.name}</Eyebrow>
            <h1 className="item-title mt-3 font-serif text-4xl leading-[1.05] md:text-5xl">
              <span className="maker block text-base uppercase tracking-[0.25em] text-ink-soft not-italic">{p.brand}</span>
              <span className="model">{p.name}</span>
            </h1>
            <p className="item-notes mt-4 text-lg leading-snug text-ink-soft">{p.tagline}</p>

            <div className="mt-8 flex items-end gap-4 border-t border-ink/15 pt-6">
              <PriceTag cents={p.price} className="font-serif text-4xl" />
              {p.compareAt && <p className="was-price pb-1 text-ink-soft line-through">{formatPrice(p.compareAt, "v2")}</p>}
              {pct && <p className="saving pb-1 text-[11px] uppercase tracking-[0.25em] text-terra">−{pct} %</p>}
            </div>
            <p className="mt-2 text-xs text-ink-soft">Inclusive of 19 % VAT. Shipping included.</p>

            <p className="stock-state mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em]" data-state={stock.state}>
              <span className={`h-2 w-2 rounded-full ${stock.state === "available" ? "bg-moss" : stock.state === "low" ? "bg-terra" : "bg-ink-soft"}`} />
              {stock.label}
            </p>
            <p className="ref-code mt-1 text-xs text-ink-soft">Ref. {p.sku}</p>

            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.25em] text-ink-soft">Finish</p>
              <ul className="finish-options mt-3 flex flex-wrap gap-2">
                {p.colors.map((c, i) => (<li key={c} className={`border px-4 py-2 text-xs uppercase tracking-[0.15em] ${i === 0 ? "border-ink bg-ink text-paper" : "border-ink/30"}`}>{c}</li>))}
              </ul>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <QuantityAddToCart
                slug={p.slug}
                label={p.stock === "preorder" ? "Pre-order" : "Add to bag"}
                buttonClass="flex-1 bg-ink py-4 text-xs font-semibold uppercase tracking-[0.25em] text-paper hover:bg-terra"
                stepperClass="inline-flex items-center border border-ink/30 py-3 text-base"
              />
              <WishlistButton slug={p.slug} className="grid h-[52px] w-[52px] place-items-center border border-ink/30 hover:border-terra hover:text-terra" />
            </div>

            <ul className="mt-8 space-y-2 text-sm">
              {p.highlights.map((h) => (<li key={h} className="flex gap-3"><span className="text-terra">—</span>{h}</li>))}
            </ul>

            <details open className="mt-10 border-t border-ink/15">
              <summary className="flex items-center justify-between py-4 text-[11px] uppercase tracking-[0.25em]">Details<span aria-hidden="true">+</span></summary>
              <div className="item-story pb-6 text-sm leading-relaxed text-ink-soft">
                {p.description.split("\n\n").map((para, i) => (<p key={i} className={i ? "mt-3" : ""}>{para}</p>))}
              </div>
            </details>
            <details open className="border-t border-ink/15">
              <summary className="flex items-center justify-between py-4 text-[11px] uppercase tracking-[0.25em]">Specifications<span aria-hidden="true">+</span></summary>
              <dl className="detail-list pb-6 text-sm">
                {p.specs.map((s) => (
                  <div key={s.label} className="detail-row flex justify-between gap-6 border-b border-ink/10 py-2.5">
                    <dt className="detail-row__key text-ink-soft">{s.label}</dt>
                    <dd className="detail-row__value text-right">{s.value}</dd>
                  </div>
                ))}
                <div className="detail-row flex justify-between gap-6 py-2.5"><dt className="detail-row__key text-ink-soft">Reference</dt><dd className="detail-row__value text-right">{p.sku}</dd></div>
              </dl>
            </details>
            <details className="border-y border-ink/15">
              <summary className="flex items-center justify-between py-4 text-[11px] uppercase tracking-[0.25em]">Shipping and returns<span aria-hidden="true">+</span></summary>
              <p className="pb-6 text-sm text-ink-soft">Orders placed before 16:00 leave the same day. Berlin arrives tomorrow, the rest of the EU within three days. Thirty days to return, label on us.</p>
            </details>
          </div>
        </div>

        <section className="voices mt-24 border-t border-ink/15 pt-12">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow>Voices</Eyebrow>
              <p className="rating-score mt-3 font-serif text-5xl">{p.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })}<span className="text-2xl text-ink-soft"> / 5</span></p>
              <p className="review-count mt-1 text-sm text-ink-soft">{p.reviewCount.toLocaleString("de-DE")} reviews</p>
            </div>
            <ul className="md:col-span-8 divide-y divide-ink/10">
              {p.reviews.map((r) => (
                <li key={r.author + r.date} className="voice grid gap-2 py-6 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <p className="voice__who text-sm">{r.author}</p>
                    <p className="text-xs text-ink-soft">{r.date}</p>
                  </div>
                  <div className="md:col-span-9">
                    <p className="voice__score text-[11px] uppercase tracking-[0.25em] text-terra">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                    <h3 className="voice__title mt-1 font-serif text-xl">{r.title}</h3>
                    <p className="voice__text mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>

      <section className="mx-auto max-w-[1400px] px-6 pt-24">
        <div className="mb-10 flex items-end justify-between">
          <div><Eyebrow>Pairs well with</Eyebrow><h2 className="mt-3 font-serif text-4xl">Complete the set</h2></div>
          <Link href={categoryPath(p.category)} className="text-xs uppercase tracking-[0.25em] hover:text-terra">All {cat?.name}</Link>
        </div>
        <Catalogue products={related.slice(0, 3)} id="related" />
      </section>
    </>
  );
}

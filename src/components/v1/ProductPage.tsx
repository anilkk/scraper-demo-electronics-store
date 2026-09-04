import Image from "next/image";
import type { Product } from "@/lib/products";
import { getCategory } from "@/lib/products";
import { formatPrice, discountPct } from "@/lib/money";
import { unsplash } from "@/lib/images";
import { categoryPath } from "@/lib/variant";
import { Stars } from "@/components/shared/Stars";
import { QuantityAddToCart } from "@/components/shared/QuantityAddToCart";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { ProductGrid } from "./ProductCard";
import { Breadcrumbs, Section } from "./Blocks";

const STOCK: Record<Product["stock"], { label: string; cls: string }> = {
  in_stock: { label: "In stock", cls: "bg-green-50 text-green-700 ring-green-200" },
  low_stock: { label: "Only a few left", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  preorder: { label: "Pre-order, ships in October", cls: "bg-blue-50 text-brand ring-blue-200" },
};

export function ProductPage({ product: p, related }: { product: Product; related: Product[] }) {
  const cat = getCategory(p.category);
  const pct = discountPct(p.price, p.compareAt);
  const stock = STOCK[p.stock];
  return (
    <>
      <article className="product-detail mx-auto max-w-7xl px-4 pt-6" data-product-id={p.id}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: cat?.name ?? p.category, href: categoryPath(p.category) }, { label: p.name }]} />

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="product-gallery">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-cloud">
              <Image src={unsplash(p.image.id, 1200, 1200)} alt={p.image.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="product-image object-cover" />
              {p.badge && <span className="product-badge absolute left-4 top-4 rounded-md bg-navy px-2.5 py-1 text-xs font-semibold text-white">{p.badge}</span>}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`relative aspect-square overflow-hidden rounded-lg bg-cloud ${i === 1 ? "ring-2 ring-brand" : "opacity-70"}`}>
                  <Image src={unsplash(p.image.id, 300, 300)} alt="" fill sizes="120px" className="object-cover" style={{ objectPosition: `${(i - 1) * 33}% 50%` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-summary">
            <p className="product-brand text-sm font-semibold uppercase tracking-wide text-brand">{p.brand}</p>
            <h1 className="product-name mt-1 text-3xl font-bold tracking-tight md:text-4xl">{p.name}</h1>
            <p className="product-tagline mt-2 text-lg text-slate-ink">{p.tagline}</p>

            <div className="product-rating mt-4 flex items-center gap-2 text-sm">
              <Stars rating={p.rating} className="text-amber-400" size={16} />
              <span className="rating-value font-semibold">{p.rating.toFixed(1)}</span>
              <a href="#reviews" className="product-reviews text-slate-500 underline-offset-2 hover:underline">{p.reviewCount.toLocaleString("en-IE")} reviews</a>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="product-price text-4xl font-bold">{formatPrice(p.price, "v1")}</span>
              {p.compareAt && <span className="product-compare-price text-xl text-slate-400 line-through">{formatPrice(p.compareAt, "v1")}</span>}
              {pct && <span className="product-discount rounded-md bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">Save {pct}%</span>}
            </div>
            <p className="mt-1 text-xs text-slate-500">Incl. 19% VAT. Free shipping.</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className={`product-stock inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium ring-1 ${stock.cls}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />{stock.label}
              </span>
              <span className="product-sku text-slate-500">SKU {p.sku}</span>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Colour</p>
              <ul className="product-colors flex flex-wrap gap-2">
                {p.colors.map((c, i) => (
                  <li key={c} className={`rounded-lg border px-3 py-1.5 text-sm ${i === 0 ? "border-brand bg-brand-soft font-medium text-brand" : "border-mist"}`}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <QuantityAddToCart
                slug={p.slug}
                label={p.stock === "preorder" ? "Pre-order now" : "Add to cart"}
                buttonClass="flex-1 rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
                stepperClass="inline-flex items-center rounded-lg border border-mist py-3 text-lg"
              />
              <WishlistButton slug={p.slug} className="rounded-lg border border-mist p-3 text-slate-ink hover:border-brand hover:text-brand" />
            </div>

            <ul className="product-highlights mt-8 space-y-2 text-sm">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600" aria-hidden="true"><path d="M5 12l4 4L19 6" /></svg>{h}
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 rounded-xl border border-mist bg-cloud p-4 text-sm sm:grid-cols-2">
              <div><p className="font-semibold">Delivery</p><p className="text-slate-500">Order before 16:00, ships today. Berlin: next day.</p></div>
              <div><p className="font-semibold">Returns</p><p className="text-slate-500">30 days, free label, no questions.</p></div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          <section className="product-description lg:col-span-2">
            <h2 className="text-xl font-bold">About the {p.name}</h2>
            {p.description.split("\n\n").map((para, i) => (<p key={i} className="mt-4 leading-relaxed text-slate-ink">{para}</p>))}
          </section>
          <section>
            <h2 className="text-xl font-bold">Specifications</h2>
            <table className="product-specs mt-4 w-full text-sm">
              <tbody>
                {p.specs.map((s) => (
                  <tr key={s.label} className="spec-row border-b border-mist">
                    <th scope="row" className="spec-label py-2.5 pr-4 text-left font-medium text-slate-500">{s.label}</th>
                    <td className="spec-value py-2.5 text-right font-medium">{s.value}</td>
                  </tr>
                ))}
                <tr className="spec-row border-b border-mist"><th scope="row" className="spec-label py-2.5 pr-4 text-left font-medium text-slate-500">SKU</th><td className="spec-value py-2.5 text-right font-medium">{p.sku}</td></tr>
              </tbody>
            </table>
          </section>
        </div>

        <section id="reviews" className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Customer reviews</h2>
              <div className="product-rating mt-1 flex items-center gap-2 text-sm">
                <Stars rating={p.rating} className="text-amber-400" size={16} />
                <span className="rating-value font-semibold">{p.rating.toFixed(1)} out of 5</span>
                <span className="product-reviews text-slate-500">· {p.reviewCount.toLocaleString("en-IE")} ratings</span>
              </div>
            </div>
            <button type="button" className="rounded-lg border border-mist px-4 py-2 text-sm font-semibold hover:border-brand">Write a review</button>
          </div>
          <ul className="product-reviews-list mt-6 grid gap-4 md:grid-cols-3">
            {p.reviews.map((r) => (
              <li key={r.author + r.date} className="review rounded-xl border border-mist p-5">
                <div className="review-rating flex items-center gap-2"><Stars rating={r.rating} className="text-amber-400" /><span className="text-xs text-slate-500">{r.date}</span></div>
                <h3 className="review-title mt-2 font-semibold">{r.title}</h3>
                <p className="review-body mt-1 text-sm text-slate-ink">{r.body}</p>
                <p className="review-author mt-3 text-xs font-medium text-slate-500">{r.author} · Verified purchase</p>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <Section title="You may also like" link={{ href: categoryPath(p.category), label: `More ${cat?.name ?? ""}` }}>
        <ProductGrid products={related} id="related" />
      </Section>
    </>
  );
}

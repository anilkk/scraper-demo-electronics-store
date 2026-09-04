import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice, discountPct } from "@/lib/money";
import { unsplash } from "@/lib/images";
import { productPath } from "@/lib/variant";
import { Stars } from "@/components/shared/Stars";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { WishlistButton } from "@/components/shared/WishlistButton";

export function ProductCard({ product: p, priority = false }: { product: Product; priority?: boolean }) {
  const pct = discountPct(p.price, p.compareAt);
  return (
    <div className="product-card group relative flex flex-col rounded-xl border border-mist bg-white p-3 transition hover:shadow-lg" data-product-search={`${p.brand} ${p.name} ${p.category}`}>
      <Link href={productPath(p.slug, p.category)} className="relative block aspect-square overflow-hidden rounded-lg bg-cloud">
        <Image src={unsplash(p.image.id, 600, 600)} alt={p.image.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" priority={priority} className="product-image object-cover transition duration-500 group-hover:scale-105" />
        {p.badge && <span className="product-badge absolute left-2 top-2 rounded-md bg-navy px-2 py-1 text-[11px] font-semibold text-white">{p.badge}</span>}
        {pct && <span className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[11px] font-semibold text-white">−{pct}%</span>}
      </Link>
      <div className="mt-3 flex flex-1 flex-col px-1">
        <p className="product-brand text-xs font-medium uppercase tracking-wide text-brand">{p.brand}</p>
        <h3 className="product-name mt-0.5 font-semibold leading-snug">
          <Link href={productPath(p.slug, p.category)} className="hover:text-brand">{p.name}</Link>
        </h3>
        <div className="product-rating mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Stars rating={p.rating} className="text-amber-400" />
          <span className="rating-value font-medium text-navy">{p.rating.toFixed(1)}</span>
          <span className="product-reviews">({p.reviewCount.toLocaleString("en-IE")})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="product-price text-lg font-bold">{formatPrice(p.price, "v1")}</span>
          {p.compareAt && <span className="product-compare-price text-sm text-slate-400 line-through">{formatPrice(p.compareAt, "v1")}</span>}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <AddToCartButton slug={p.slug} className="flex-1 rounded-lg bg-brand py-2 text-sm font-semibold text-white transition hover:bg-brand-dark" />
          <WishlistButton slug={p.slug} className="rounded-lg border border-mist p-2 text-slate-ink hover:border-brand hover:text-brand" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, id = "product-grid" }: { products: Product[]; id?: string }) {
  return (
    <div id={id} className="product-grid grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => (<ProductCard key={p.slug} product={p} priority={i < 4} />))}
    </div>
  );
}

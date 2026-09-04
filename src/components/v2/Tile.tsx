import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategory } from "@/lib/products";
import { priceParts, formatPrice } from "@/lib/money";
import { unsplash } from "@/lib/images";
import { productPath } from "@/lib/variant";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { WishlistButton } from "@/components/shared/WishlistButton";

/** Price as two nodes: amount and currency. Text reads "299,00 €". */
export function PriceTag({ cents, className = "" }: { cents: number; className?: string }) {
  const { amount, currency } = priceParts(cents);
  return (
    <p className={`price-tag whitespace-nowrap tabular-nums ${className}`}>
      <span className="amt">{amount}</span> <span className="cur">{currency}</span>
    </p>
  );
}

export function Tile({ product: p, index, priority = false }: { product: Product; index: number; priority?: boolean }) {
  const cat = getCategory(p.category);
  return (
    <li className="listing-tile group" data-tile-search={`${p.brand} ${p.name} ${cat?.name ?? ""}`}>
      <figure className="tile__media relative aspect-[4/5] overflow-hidden bg-paper-deep">
        <Link href={productPath(p.slug, p.category)} className="absolute inset-0">
          <Image src={unsplash(p.image.id, 800, 1000)} alt={p.image.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" priority={priority} className="object-cover transition duration-700 group-hover:scale-[1.04]" />
        </Link>
        {p.badge && <figcaption className="tile__flag absolute left-4 top-4 text-[10px] uppercase tracking-[0.25em] text-ink">{p.badge}</figcaption>}
        <span className="absolute right-4 top-4 text-[10px] tabular-nums tracking-[0.25em] text-ink/60">{String(index + 1).padStart(2, "0")}</span>
        <div className="absolute inset-x-4 bottom-4 flex translate-y-3 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <AddToCartButton slug={p.slug} label="Add to bag" addedLabel="In your bag" className="flex-1 bg-ink py-3 text-[11px] uppercase tracking-[0.2em] text-paper hover:bg-terra" />
          <WishlistButton slug={p.slug} className="grid w-11 place-items-center bg-paper text-ink hover:text-terra" />
        </div>
      </figure>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="maker text-[11px] uppercase tracking-[0.25em] text-ink-soft">{p.brand}</p>
          <h3 className="tile__heading mt-1 font-serif text-xl leading-tight">
            <Link href={productPath(p.slug, p.category)} className="hover:text-terra">{p.name}</Link>
          </h3>
          <p className="mt-1 text-xs text-ink-soft"><span className="rating-score">{p.rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })} / 5</span> · <span className="review-count">{p.reviewCount.toLocaleString("de-DE")} reviews</span></p>
        </div>
        <div className="shrink-0 text-right">
          <PriceTag cents={p.price} className="text-base" />
          {p.compareAt && <p className="was-price text-xs text-ink-soft line-through">{formatPrice(p.compareAt, "v2")}</p>}
        </div>
      </div>
    </li>
  );
}

export function Catalogue({ products, id = "catalogue" }: { products: Product[]; id?: string }) {
  return (
    <ul id={id} className="catalogue grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
      {products.map((p, i) => (<Tile key={p.slug} product={p} index={i} priority={i < 3} />))}
    </ul>
  );
}

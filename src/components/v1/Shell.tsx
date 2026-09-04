import Link from "next/link";
import type { ReactNode } from "react";
import { CATEGORIES, STORE } from "@/lib/products";
import { categoryPath } from "@/lib/variant";
import { CartButton, WishlistCount } from "@/components/shared/CartButton";
import { CartDrawer } from "@/components/shared/CartDrawer";

const cartTheme = {
  panel: "bg-white text-navy",
  title: "text-lg font-semibold",
  button: "w-full rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-40",
  muted: "text-slate-500",
  line: "border-mist",
  vocab: "v1" as const,
  heading: "Your cart",
  empty: "Your cart is empty.",
  checkout: "Checkout",
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" aria-label={`${STORE.name} home`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>
      </span>
      {STORE.name}
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-navy text-center text-xs font-medium text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2">
          <span>Free shipping on orders over €50</span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden sm:inline">30-day returns</span>
          <span className="hidden md:inline text-white/40">|</span>
          <span className="hidden md:inline">Berlin store open Mon to Sat, 10 to 19</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-mist bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <Logo />
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-ink lg:flex" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={categoryPath(c.slug)} className="hover:text-brand">{c.name}</Link>
            ))}
            <Link href="/search?q=sale" className="text-brand">Deals</Link>
          </nav>
          <form action="/search" method="get" role="search" className="ml-auto flex w-full max-w-md items-center overflow-hidden rounded-full border border-mist bg-cloud focus-within:border-brand">
            <input type="search" name="q" placeholder="Search headphones, watches, thermostats…" aria-label="Search products" className="w-full bg-transparent px-4 py-2 text-sm outline-none" />
            <button type="submit" className="bg-brand px-4 py-2 text-white hover:bg-brand-dark" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            </button>
          </form>
          <div className="flex items-center gap-1">
            <Link href="/search?q=" className="hidden rounded-full p-2 text-slate-ink hover:bg-cloud md:block" aria-label="Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>
            </Link>
            <span className="relative hidden rounded-full p-2 text-slate-ink md:block" aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.3C11.8 6.1 13.2 5 15.2 5c3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z" /></svg>
              <WishlistCount className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white" />
            </span>
            <CartButton className="relative rounded-full p-2 text-slate-ink hover:bg-cloud" badgeClass="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.4 11.2a2 2 0 002 1.6h8.6a2 2 0 002-1.5L22 8H6" /><circle cx="9" cy="21" r="1.2" /><circle cx="18" cy="21" r="1.2" /></svg>
            </CartButton>
          </div>
        </div>
        <nav className="border-t border-mist lg:hidden" aria-label="Categories">
          <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-4 py-2 text-sm font-medium text-slate-ink">
            {CATEGORIES.map((c) => (<Link key={c.slug} href={categoryPath(c.slug)} className="whitespace-nowrap">{c.name}</Link>))}
            <Link href="/search?q=sale" className="text-brand">Deals</Link>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-mist bg-cloud">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 text-sm text-slate-500">{STORE.tagline}. Independent since 2014, Kreuzberg, Berlin.</p>
          </div>
          {[
            { h: "Shop", links: CATEGORIES.map((c) => [c.name, categoryPath(c.slug)] as const).concat([["Deals", "/search?q=sale"]]) },
            { h: "Help", links: [["Shipping & delivery", "#"], ["Returns", "#"], ["Warranty", "#"], ["Contact", "#"]] as const },
            { h: "Company", links: [["About Voltique", "#"], ["Store, Oranienstraße 32", "#"], ["Careers", "#"], ["Press", "#"]] as const },
          ].map((col) => (
            <div key={col.h}>
              <h3 className="mb-3 text-sm font-semibold">{col.h}</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                {col.links.map(([label, href]) => (<li key={label}><Link href={href} className="hover:text-brand">{label}</Link></li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-mist">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500">
            <p>© 2026 {STORE.name} GmbH. Demo store, no real orders are placed.</p>
            <div className="flex gap-4"><span>Visa</span><span>Mastercard</span><span>PayPal</span><span>Klarna</span><span>SEPA</span></div>
          </div>
        </div>
      </footer>
      <CartDrawer theme={cartTheme} />
    </>
  );
}

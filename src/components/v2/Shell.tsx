import Link from "next/link";
import type { ReactNode } from "react";
import { CATEGORIES, STORE } from "@/lib/products";
import { categoryPath } from "@/lib/variant";
import { CartButton, WishlistCount } from "@/components/shared/CartButton";
import { CartDrawer } from "@/components/shared/CartDrawer";

const cartTheme = {
  panel: "bg-paper text-ink",
  title: "font-serif text-2xl",
  button: "w-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.2em] text-paper hover:bg-terra disabled:opacity-40",
  muted: "text-ink-soft",
  line: "border-ink/15",
  vocab: "v2" as const,
  heading: "Bag",
  empty: "Your bag is empty. Everything here is worth a second look.",
  checkout: "Proceed to checkout",
};

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <p className="bg-ink py-2 text-center text-[11px] uppercase tracking-[0.25em] text-paper/80">Complimentary shipping across the EU · Studio in Kreuzberg open Tue to Sat</p>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto grid max-w-[1400px] grid-cols-3 items-center px-6 py-5">
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.2em]" aria-label="Collections">
            {CATEGORIES.map((c) => (<Link key={c.slug} href={categoryPath(c.slug)} className="hidden whitespace-nowrap hover:text-terra md:inline">{c.name}</Link>))}
            <Link href="/search?q=" className="whitespace-nowrap hover:text-terra">Shop all</Link>
          </nav>
          <Link href="/" className="justify-self-center font-serif text-3xl tracking-[0.12em] uppercase" aria-label={`${STORE.name} home`}>{STORE.name}</Link>
          <div className="flex items-center justify-end gap-6 text-xs uppercase tracking-[0.2em]">
            <form action="/search" method="get" role="search" className="hidden items-center gap-2 border-b border-ink/30 focus-within:border-ink lg:flex">
              <input type="search" name="q" placeholder="Search" aria-label="Search products" className="w-32 bg-transparent py-1 text-xs uppercase tracking-[0.2em] outline-none placeholder:text-ink-soft" />
              <button type="submit" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              </button>
            </form>
            <span className="relative hidden md:inline">Saved<WishlistCount className="absolute -right-3 -top-2 text-[10px] text-terra" /></span>
            <CartButton className="relative hover:text-terra" badgeClass="ml-1 text-terra">Bag</CartButton>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-24 bg-ink text-paper">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-4xl leading-tight">Objects that earn<br />their place.</p>
            <form className="mt-8 flex max-w-sm border-b border-paper/30 focus-within:border-paper" action="#" method="get">
              <input type="email" placeholder="Email for the journal" aria-label="Email address" className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-paper/50" />
              <button type="button" className="text-xs uppercase tracking-[0.2em]">Join</button>
            </form>
          </div>
          {[
            { h: "Collections", links: CATEGORIES.map((c) => [c.name, categoryPath(c.slug)] as const) },
            { h: "Studio", links: [["Our story", "#"], ["Oranienstraße 32", "#"], ["Journal", "#"], ["Press", "#"]] as const },
            { h: "Service", links: [["Shipping", "#"], ["Returns", "#"], ["Repairs", "#"], ["Contact", "#"]] as const },
          ].map((col) => (
            <div key={col.h} className="md:col-span-2">
              <h3 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-paper/60">{col.h}</h3>
              <ul className="space-y-2 text-sm">{col.links.map(([l, h]) => (<li key={l}><Link href={h} className="hover:text-terra">{l}</Link></li>))}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-paper/15">
          <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-3 px-6 py-6 text-[11px] uppercase tracking-[0.2em] text-paper/50">
            <p>© 2026 {STORE.name} · Berlin · Demo store, no real orders</p>
            <p>Visa · Mastercard · PayPal · Klarna</p>
          </div>
        </div>
      </footer>
      <CartDrawer theme={cartTheme} />
    </>
  );
}

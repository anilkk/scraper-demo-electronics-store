import Link from "next/link";
import type { ReactNode } from "react";

export function Section({ title, subtitle, link, children }: { title: string; subtitle?: string; link?: { href: string; label: string }; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
        </div>
        {link && <Link href={link.href} className="text-sm font-semibold text-brand hover:underline">{link.label} →</Link>}
      </div>
      {children}
    </section>
  );
}

export function TrustBar() {
  const items = [
    ["Free shipping", "On every order over €50, across the EU"],
    ["30-day returns", "Change your mind, we pay the label"],
    ["2-year warranty", "Repairs handled in our Berlin workshop"],
    ["Real humans", "Chat, email or walk in, Mon to Sat"],
  ];
  return (
    <section className="border-y border-mist bg-cloud">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([h, p]) => (
          <div key={h} className="flex gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12l4 4L19 6" /></svg>
            </span>
            <div><h3 className="font-semibold">{h}</h3><p className="text-sm text-slate-500">{p}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="rounded-2xl bg-navy px-6 py-12 text-center text-white md:px-12">
        <h2 className="text-2xl font-bold md:text-3xl">Get first dibs on drops and deals</h2>
        <p className="mx-auto mt-2 max-w-lg text-white/70">One email a fortnight. Unsubscribe with a click. No spam, we hate it too.</p>
        <form className="mx-auto mt-6 flex max-w-md gap-2" action="#" method="get">
          <input type="email" placeholder="you@example.com" aria-label="Email address" className="w-full rounded-lg px-4 py-3 text-navy outline-none bg-white" />
          <button type="button" className="shrink-0 rounded-lg bg-brand px-5 py-3 font-semibold hover:bg-brand-dark">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumb text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {it.href ? <Link href={it.href} className="hover:text-brand">{it.label}</Link> : <span className="text-navy">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

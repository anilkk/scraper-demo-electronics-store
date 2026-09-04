import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`text-[11px] uppercase tracking-[0.3em] ${light ? "text-paper/70" : "text-terra"}`}>{children}</p>;
}

export function Crumbtrail({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="crumbtrail text-[11px] uppercase tracking-[0.25em] text-ink-soft" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2">—</span>}
          {it.href ? <Link href={it.href} className="hover:text-terra">{it.label}</Link> : <span className="text-ink">{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}

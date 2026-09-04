"use client";
import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { lookup } from "@/lib/catalog.client";
import { unsplash } from "@/lib/images";
import { formatPrice } from "@/lib/money";

interface Theme {
  panel: string;
  title: string;
  button: string;
  muted: string;
  line: string;
  vocab: "v1" | "v2";
  heading: string;
  empty: string;
  checkout: string;
}

export function CartDrawer({ theme }: { theme: Theme }) {
  const { lines, open, setOpen, setQty, remove, subtotal, count } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col shadow-2xl transition-transform duration-300 ${theme.panel} ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className={`flex items-center justify-between border-b px-6 py-5 ${theme.line}`}>
          <h2 className={theme.title}>{theme.heading} ({count})</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close cart" className="text-2xl leading-none">×</button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className={`py-16 text-center ${theme.muted}`}>{theme.empty}</p>
          ) : (
            <ul className={`divide-y ${theme.line}`}>
              {lines.map((l) => {
                const p = lookup(l.slug);
                if (!p) return null;
                return (
                  <li key={l.slug} className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-200">
                      <Image src={unsplash(p.imageId, 200, 200)} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className={`text-xs uppercase tracking-wide ${theme.muted}`}>{p.brand}</p>
                          <p className="font-medium">{p.name}</p>
                        </div>
                        <p className="font-medium tabular-nums">{formatPrice(p.price * l.qty, theme.vocab)}</p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className={`inline-flex items-center rounded border ${theme.line}`}>
                          <button type="button" className="px-2.5 py-1" onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Decrease">−</button>
                          <span className="min-w-6 text-center text-sm tabular-nums">{l.qty}</span>
                          <button type="button" className="px-2.5 py-1" onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Increase">+</button>
                        </div>
                        <button type="button" className={`text-sm underline ${theme.muted}`} onClick={() => remove(l.slug)}>Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <footer className={`border-t px-6 py-5 ${theme.line}`}>
          <div className="mb-1 flex justify-between text-base">
            <span>Subtotal</span>
            <span className="font-semibold tabular-nums">{formatPrice(subtotal, theme.vocab)}</span>
          </div>
          <p className={`mb-4 text-xs ${theme.muted}`}>Shipping and taxes calculated at checkout.</p>
          <button type="button" className={theme.button} disabled={lines.length === 0}>{theme.checkout}</button>
        </footer>
      </aside>
    </div>
  );
}

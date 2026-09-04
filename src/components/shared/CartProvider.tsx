"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { lookup } from "@/lib/catalog.client";

interface Line { slug: string; qty: number }

interface CartState {
  lines: Line[];
  wishlist: string[];
  open: boolean;
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  toggleWish: (slug: string) => void;
  setOpen: (open: boolean) => void;
}

const Ctx = createContext<CartState | null>(null);
const KEY = "voltique-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage after mount so server and first client render match.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { lines?: Line[]; wishlist?: string[] };
        setLines(saved.lines ?? []);
        setWishlist(saved.wishlist ?? []);
      }
    } catch {}
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(KEY, JSON.stringify({ lines, wishlist })); } catch {}
  }, [lines, wishlist, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => l.slug === slug);
      if (i === -1) return [...ls, { slug, qty }];
      const next = [...ls];
      next[i] = { slug, qty: next[i].qty + qty };
      return next;
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => setLines((ls) => ls.filter((l) => l.slug !== slug)), []);
  const setQty = useCallback((slug: string, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.slug !== slug) : ls.map((l) => (l.slug === slug ? { ...l, qty } : l))));
  }, []);
  const toggleWish = useCallback((slug: string) => {
    setWishlist((w) => (w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug]));
  }, []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const subtotal = lines.reduce((a, l) => a + (lookup(l.slug)?.price ?? 0) * l.qty, 0);
    return { lines, wishlist, open, count, subtotal, add, remove, setQty, toggleWish, setOpen };
  }, [lines, wishlist, open, add, remove, setQty, toggleWish]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

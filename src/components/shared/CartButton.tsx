"use client";
import { useCart } from "./CartProvider";
import type { ReactNode } from "react";

export function CartButton({ className = "", badgeClass = "", children }: { className?: string; badgeClass?: string; children: ReactNode }) {
  const { count, setOpen } = useCart();
  return (
    <button type="button" onClick={() => setOpen(true)} className={className} aria-label={`Open cart, ${count} items`}>
      {children}
      {count > 0 && <span className={badgeClass}>{count}</span>}
    </button>
  );
}

export function WishlistCount({ className = "" }: { className?: string }) {
  const { wishlist } = useCart();
  if (wishlist.length === 0) return null;
  return <span className={className}>{wishlist.length}</span>;
}

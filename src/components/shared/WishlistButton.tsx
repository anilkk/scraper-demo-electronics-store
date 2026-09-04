"use client";
import { useCart } from "./CartProvider";

export function WishlistButton({ slug, className = "", iconOnly = true }: { slug: string; className?: string; iconOnly?: boolean }) {
  const { wishlist, toggleWish } = useCart();
  const on = wishlist.includes(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      className={className}
      onClick={() => toggleWish(slug)}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.6 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.3C11.8 6.1 13.2 5 15.2 5c3.5 0 5.6 3.6 4.3 6.8C19.5 16.4 12 21 12 21z" />
      </svg>
      {!iconOnly && <span>{on ? "Saved" : "Save"}</span>}
    </button>
  );
}

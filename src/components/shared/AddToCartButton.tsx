"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

interface Props {
  slug: string;
  label?: string;
  addedLabel?: string;
  className?: string;
  qty?: number;
}

/** Receives only a slug, never product fields, so nothing scrapeable rides in its props. */
export function AddToCartButton({ slug, label = "Add to cart", addedLabel = "Added", className = "", qty = 1 }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        add(slug, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
    >
      {added ? addedLabel : label}
    </button>
  );
}

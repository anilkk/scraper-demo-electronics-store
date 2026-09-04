"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

interface Props {
  slug: string;
  label: string;
  buttonClass: string;
  stepperClass: string;
  disabled?: boolean;
}

export function QuantityAddToCart({ slug, label, buttonClass, stepperClass, disabled }: Props) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <div className="flex items-stretch gap-3">
      <div className={stepperClass} role="group" aria-label="Quantity">
        <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="px-3">−</button>
        <span className="min-w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
        <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Increase quantity" className="px-3">+</button>
      </div>
      <button
        type="button"
        disabled={disabled}
        className={buttonClass}
        onClick={() => {
          add(slug, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1400);
        }}
      >
        {added ? "Added to cart" : label}
      </button>
    </div>
  );
}

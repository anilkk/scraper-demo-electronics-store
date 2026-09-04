"use client";
import { useState } from "react";

interface Props {
  /** CSS selector for each tile inside the grid. */
  tileSelector: string;
  /** Attribute on each tile that carries its searchable text. */
  attr: string;
  gridId: string;
  placeholder: string;
  className: string;
  inputClass: string;
  countClass: string;
}

/**
 * Client-side filtering on top of a server-rendered grid. The grid arrives in
 * the HTML complete, so scrapers and JS-off visitors see every product.
 */
export function InstantFilter({ tileSelector, attr, gridId, placeholder, className, inputClass, countClass }: Props) {
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<number | null>(null);

  function apply(value: string) {
    setQ(value);
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(tileSelector));
    const needle = value.trim().toLowerCase();
    let n = 0;
    for (const t of tiles) {
      const hay = (t.getAttribute(attr) ?? "").toLowerCase();
      const hit = !needle || hay.includes(needle);
      t.hidden = !hit;
      if (hit) n++;
    }
    setShown(needle ? n : null);
  }

  return (
    <div className={className}>
      <input type="search" value={q} onChange={(e) => apply(e.target.value)} placeholder={placeholder} className={inputClass} aria-label="Filter products" />
      {shown !== null && <span className={countClass}>{shown} shown</span>}
    </div>
  );
}

import { RESOLVED } from "./variant";

/**
 * v1 prints prices the English way, "€299.00".
 * v2 prints them the German way, "299,00 €".
 * Same number, different text. A scraper that learned v1 has to relearn the format.
 */
export function formatPrice(cents: number, vocab: "v1" | "v2" = RESOLVED.vocab): string {
  const amount = cents / 100;
  if (vocab === "v1") {
    return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(amount);
  }
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
}

/** v2 splits the amount and the currency symbol into separate nodes. */
export function priceParts(cents: number): { amount: string; currency: string } {
  const amount = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);
  return { amount, currency: "€" };
}

export function discountPct(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

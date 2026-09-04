import catalog from "../../data/products.json";

export type Stock = "in_stock" | "low_stock" | "preorder";

export interface Review {
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  price: number;
  compareAt: number | null;
  rating: number;
  reviewCount: number;
  stock: Stock;
  sku: string;
  badge: string | null;
  tagline: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  colors: string[];
  image: { id: string; alt: string; credit?: string };
  reviews: Review[];
}

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  image: { id: string; alt: string };
}

export const STORE = catalog.store;
export const CATEGORIES: Category[] = catalog.categories;
export const PRODUCTS: Product[] = catalog.products as Product[];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function productsIn(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function related(product: Product, n = 4): Product[] {
  const same = productsIn(product.category).filter((p) => p.slug !== product.slug);
  const rest = PRODUCTS.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, n);
}

export function featured(n = 8): Product[] {
  return [...PRODUCTS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, n);
}

export function onSale(): Product[] {
  return PRODUCTS.filter((p) => p.compareAt && p.compareAt > p.price);
}

/** Plain text search over name, brand, tagline, category and specs. */
export function search(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return PRODUCTS.map((p) => {
    const hay = [p.name, p.brand, p.tagline, p.category, p.description, ...p.highlights, ...p.specs.map((s) => `${s.label} ${s.value}`)]
      .join(" ")
      .toLowerCase();
    const score = terms.reduce((acc, t) => {
      if (p.name.toLowerCase().includes(t)) return acc + 3;
      if (p.brand.toLowerCase().includes(t)) return acc + 2;
      return hay.includes(t) ? acc + 1 : acc;
    }, 0);
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}

import type { ReactNode } from "react";
import type { Category, Product } from "@/lib/products";

export interface VariantSet {
  Shell: (props: { children: ReactNode }) => ReactNode;
  HomePage: () => ReactNode;
  CategoryPage: (props: { category: Category; products: Product[] }) => ReactNode;
  ProductPage: (props: { product: Product; related: Product[] }) => ReactNode;
  SearchPage: (props: { query: string; results: Product[] }) => ReactNode;
  NotFound: () => ReactNode;
}

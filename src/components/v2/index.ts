import type { VariantSet } from "../types";
import { Shell } from "./Shell";
import { HomePage } from "./HomePage";
import { ProductPage } from "./ProductPage";
import { CategoryPage, SearchPage, NotFound } from "./Listing";

export const v2: VariantSet = { Shell, HomePage, CategoryPage, ProductPage, SearchPage, NotFound };

import { VERSION } from "@/lib/variant";
import { v1 } from "./v1";
import { v2 } from "./v2";
import type { VariantSet } from "./types";

/** The design and DOM vocabulary this build serves. Fixed at build time. */
export const UI: VariantSet = VERSION === "v1" ? v1 : v2;

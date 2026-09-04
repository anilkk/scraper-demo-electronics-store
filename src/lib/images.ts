/** Unsplash image URL. Photos are used under the Unsplash License. */
export function unsplash(id: string, w = 1200, h?: number): string {
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: "80" });
  if (h) params.set("h", String(h));
  return `https://images.unsplash.com/${id}?${params.toString()}`;
}

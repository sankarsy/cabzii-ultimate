import { SITE_URL } from "./seo/constants";

/** Responsive width for card / list thumbnails (mobile-first). */
export const CARD_IMAGE_WIDTH = 640;
export const PRODUCT_OG_WIDTH = 800;
export const PRODUCT_OG_HEIGHT = 600;

/** Trim Unsplash and similar CDN URLs for faster mobile loads. */
export function optimizeImageUrl(url, width = CARD_IMAGE_WIDTH) {
  if (!url || typeof url !== "string") return url;
  try {
    if (url.includes("images.unsplash.com")) {
      const u = new URL(url);
      u.searchParams.set("w", String(width));
      u.searchParams.set("q", "75");
      u.searchParams.set("auto", "format");
      u.searchParams.set("fit", "crop");
      return u.toString();
    }
  } catch {
    /* ignore malformed URLs */
  }
  return url;
}

/** Absolute URL for Open Graph / JSON-LD (Google requires fully qualified image URLs). */
export function absoluteImageUrl(path, siteUrl = SITE_URL) {
  if (!path) return "";
  const trimmed = String(path).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${siteUrl}${trimmed}`;
  return `${siteUrl}/${trimmed}`;
}

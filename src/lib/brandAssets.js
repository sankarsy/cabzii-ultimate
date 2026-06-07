/** Cabzii brand image assets in /public — single source for meta, PWA & UI. */
export const BRAND_ICON = "/android-chrome-512x512.png";
export const BRAND_ICON_SM = "/android-chrome-192x192.png";
export const BRAND_APPLE_TOUCH = "/apple-touch-icon.png";
export const BRAND_FAVICON = "/favicon.ico";
export const BRAND_OG_IMAGE = "/og-image.jpg";
export const BRAND_TWITTER_IMAGE = "/twitter-card.jpg";

export const SITE_ICONS = {
  icon: [
    { url: BRAND_FAVICON, sizes: "any" },
    { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: BRAND_ICON_SM, sizes: "192x192", type: "image/png" },
    { url: BRAND_ICON, sizes: "512x512", type: "image/png" }
  ],
  apple: [{ url: BRAND_APPLE_TOUCH, sizes: "180x180", type: "image/png" }],
  shortcut: [BRAND_FAVICON],
  other: [{ rel: "mask-icon", url: "/icon.svg", color: "#0056D2" }]
};

export function absoluteBrandUrl(path, siteUrl = "https://cabzii.in") {
  if (!path) return siteUrl;
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

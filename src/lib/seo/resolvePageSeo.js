import { buildPageMetadata } from "./constants";
import { STATIC_PAGE_SEO_BY_PATH } from "./pageSeoCatalog";

function keywordsArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Merge DB pageSeo with built-in defaults for a path. */
export function getPageSeoEntry(settings, path) {
  const defaults = STATIC_PAGE_SEO_BY_PATH[path];
  const stored = settings?.pageSeo?.[path] || {};
  if (!defaults) return stored.productName || stored.seoTitle ? { ...stored, path } : null;

  return {
    productName: stored.productName || defaults.productName,
    seoTitle: stored.seoTitle || defaults.seoTitle,
    seoDescription: stored.seoDescription || defaults.seoDescription,
    seoKeywords: stored.seoKeywords || defaults.seoKeywords,
    path
  };
}

export function buildMetadataForPath(path, settings) {
  const entry = getPageSeoEntry(settings, path);
  const defaults = STATIC_PAGE_SEO_BY_PATH[path];
  const seoTitle = entry?.seoTitle || defaults?.seoTitle || "Cabzii";
  const seoDescription = entry?.seoDescription || defaults?.seoDescription || "";
  const keywords = keywordsArray(entry?.seoKeywords || defaults?.seoKeywords);

  return buildPageMetadata({
    title: seoTitle,
    description: seoDescription,
    path,
    keywords,
    ...(path === "/"
      ? {
          image: "/opengraph-image",
          imageAlt: seoTitle
        }
      : {})
  });
}

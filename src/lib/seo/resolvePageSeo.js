import { HOME_SEO_TITLE } from "./constants";
import { buildSeoMetadata } from "./buildSeoMetadata";
import { STATIC_PAGE_SEO_BY_PATH } from "./pageSeoCatalog";

function keywordsArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Reject brand-only titles that make mobile Google results show just “Cabzii”. */
function isWeakSeoTitle(title) {
  const t = String(title || "").trim();
  if (!t) return true;
  if (/^cabzii(\.in)?$/i.test(t)) return true;
  if (t.length < 28) return true;
  return false;
}

function resolveSeoTitle(storedTitle, defaultTitle, path) {
  if (!isWeakSeoTitle(storedTitle)) return String(storedTitle).trim();
  if (!isWeakSeoTitle(defaultTitle)) return String(defaultTitle).trim();
  return path === "/" ? HOME_SEO_TITLE : "Cab Booking Online | Cabzii";
}

/** Merge DB pageSeo with built-in defaults for a path. */
export function getPageSeoEntry(settings, path) {
  const defaults = STATIC_PAGE_SEO_BY_PATH[path];
  const stored = settings?.pageSeo?.[path] || {};
  if (!defaults) return stored.productName || stored.seoTitle ? { ...stored, path } : null;

  return {
    productName: stored.productName || defaults.productName,
    seoTitle: resolveSeoTitle(stored.seoTitle, defaults.seoTitle, path),
    seoDescription: stored.seoDescription || defaults.seoDescription,
    seoKeywords: stored.seoKeywords || defaults.seoKeywords,
    path
  };
}

export function buildMetadataForPath(path, settings) {
  const entry = getPageSeoEntry(settings, path);
  const defaults = STATIC_PAGE_SEO_BY_PATH[path];
  const seoTitle = resolveSeoTitle(entry?.seoTitle, defaults?.seoTitle, path);
  const seoDescription =
    entry?.seoDescription ||
    defaults?.seoDescription ||
    "Book cabs, airport taxi, outstation trips and acting drivers across South India on Cabzii.in.";
  const keywords = keywordsArray(entry?.seoKeywords || defaults?.seoKeywords);

  return buildSeoMetadata({
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

import { SITE_REVIEW_STATS } from "./seo/constants";
import { fetchCatalogList } from "./serverCatalog";

/** Approved testimonials → sitewide AggregateRating for schema (no fabricated counts). */
export async function fetchSiteReviewStats() {
  const items = await fetchCatalogList("testimonials", 200);
  if (!items.length) return SITE_REVIEW_STATS;

  const ratings = items
    .map((item) => Number(item.rating ?? item.stars))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!ratings.length) {
    return { ...SITE_REVIEW_STATS, reviewCount: String(items.length) };
  }

  const avg = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
  return {
    ratingValue: avg.toFixed(1),
    reviewCount: String(items.length),
    bestRating: "5",
    worstRating: "1"
  };
}

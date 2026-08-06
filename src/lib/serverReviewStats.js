import { fetchCatalogList } from "./serverCatalog";

/** Approved testimonials → AggregateRating only when real ratings exist (never fabricate). */
export async function fetchSiteReviewStats() {
  const items = await fetchCatalogList("testimonials", 200);
  if (!items.length) return null;

  const ratings = items
    .map((item) => Number(item.rating ?? item.stars))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!ratings.length) return null;

  const avg = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
  return {
    ratingValue: avg.toFixed(1),
    reviewCount: String(items.length),
    bestRating: "5",
    worstRating: "1"
  };
}

import { fetchCatalogList } from "./serverCatalog";

/** Approved public testimonials + booking reviews only. Never fabricate a rating. */
export async function fetchSiteReviewStats() {
  const [testimonials, bookingReviews] = await Promise.all([
    fetchCatalogList("testimonials", 200),
    fetchCatalogList("reviews", 200)
  ]);
  const ratings = [
    ...(Array.isArray(testimonials) ? testimonials : []),
    ...(Array.isArray(bookingReviews) ? bookingReviews.filter((item) => item.status !== "pending" && item.status !== "rejected") : [])
  ]
    .filter((item) => !item.sampleReview)
    .map((item) => Number(item.rating ?? item.stars))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (!ratings.length) return null;

  const avg = ratings.reduce((sum, n) => sum + n, 0) / ratings.length;
  return {
    ratingValue: avg.toFixed(1),
    reviewCount: String(ratings.length),
    bestRating: "5",
    worstRating: "1"
  };
}

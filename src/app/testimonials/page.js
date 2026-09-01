import Link from "next/link";
import TestimonialCard from "../../components/TestimonialCard";
import WriteReviewForm from "../../components/reviews/WriteReviewForm";
import JsonLd from "../../components/seo/JsonLd";
import { aggregateReviewJsonLd } from "../../lib/seo/schema";
import { fetchSiteReviewStats } from "../../lib/serverReviewStats";
import { fetchCatalogList } from "../../lib/serverCatalog";
import { SEO_REVALIDATE_SECONDS } from "../../lib/revalidation/constants";

export const revalidate = SEO_REVALIDATE_SECONDS;

function asCards(testimonials = [], bookingReviews = []) {
  const fromTestimonials = testimonials
    .filter((item) => !item.sampleReview)
    .map((item) => ({
      ...item,
      verified: false
    }));
  const fromBookings = bookingReviews
    .filter((item) => item.status === "approved" && (item.text || item.rating))
    .map((item) => ({
      _id: item._id,
      name: item.customerName || "Guest",
      location: "",
      message: item.text || item.serviceUsed || "Rated their Cabzii trip.",
      rating: item.rating,
      date: item.bookingDate,
      verified: true
    }));
  return [...fromBookings, ...fromTestimonials];
}

export default async function TestimonialsPage() {
  const [items, bookingReviews, reviewStats] = await Promise.all([
    fetchCatalogList("testimonials", 24),
    fetchCatalogList("reviews", 24),
    fetchSiteReviewStats()
  ]);
  const cards = asCards(Array.isArray(items) ? items : [], Array.isArray(bookingReviews) ? bookingReviews : []);

  return (
    <>
      {reviewStats ? (
        <JsonLd
          data={aggregateReviewJsonLd({
            ratingValue: reviewStats.ratingValue,
            reviewCount: reviewStats.reviewCount,
            itemName: "Cabzii cab and taxi booking"
          })}
        />
      ) : null}
      <div className="section-shell py-8 sm:py-10">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Customer reviews</h1>
        <p className="mt-2 text-sm text-slate-600">
          Real feedback from riders on cabzii.in. Sample quotes are not shown.
        </p>
        <div className="mt-5 max-w-xl">
          <WriteReviewForm />
        </div>
        {cards.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {cards.map((item) => (
              <TestimonialCard key={String(item._id ?? item.id ?? item.name)} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No published reviews yet. After you travel, write a review above or rate a finished trip in My Bookings.
            Approved reviews appear here.
          </p>
        )}
        <p className="mt-8">
          <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </>
  );
}

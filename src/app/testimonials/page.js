import Link from "next/link";
import TestimonialCard from "../../components/TestimonialCard";
import JsonLd from "../../components/seo/JsonLd";
import { aggregateReviewJsonLd } from "../../lib/seo/schema";
import { fetchSiteReviewStats } from "../../lib/serverReviewStats";
import { fetchCatalogList } from "../../lib/serverCatalog";

export default async function TestimonialsPage() {
  const [items, reviewStats] = await Promise.all([
    fetchCatalogList("testimonials", 24),
    fetchSiteReviewStats()
  ]);

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
      <div className="section-shell py-10">
        <h1 className="text-2xl font-bold text-slate-900">Customer reviews</h1>
        <p className="mt-2 text-sm text-slate-600">
          Feedback from riders who booked on cabzii.in.
        </p>
        {items.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <TestimonialCard key={String(item._id ?? item.id)} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            Customer reviews will appear here once approved. Book a trip on Cabzii to share your experience after travel.
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

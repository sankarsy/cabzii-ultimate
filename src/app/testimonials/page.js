import Link from "next/link";
import TestimonialCard from "../../components/TestimonialCard";
import JsonLd from "../../components/seo/JsonLd";
import { SITE_REVIEW_STATS } from "../../lib/seo";
import { aggregateReviewJsonLd } from "../../lib/seo/schema";
import { fetchCatalogList } from "../../lib/serverCatalog";
import { SAMPLE_TESTIMONIALS } from "../../lib/sampleContent";

export default async function TestimonialsPage() {
  const real = await fetchCatalogList("testimonials", 24);
  /* Never show an empty wall — fall back to sample reviews until real ones exist */
  const items = real.length ? real : SAMPLE_TESTIMONIALS;

  return (
    <>
      <JsonLd
        data={aggregateReviewJsonLd({
          ratingValue: SITE_REVIEW_STATS.ratingValue,
          reviewCount: SITE_REVIEW_STATS.reviewCount,
          itemName: "Cabzii cab and taxi booking"
        })}
      />
      <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Customer reviews</h1>
      <p className="mt-2 text-sm text-slate-600">
        Feedback from riders who booked on cabzii.in.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {items.map((item) => (
          <TestimonialCard key={String(item._id ?? item.id)} item={item} />
        ))}
      </div>
      <p className="mt-8">
        <Link href="/" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
          ← Back to home
        </Link>
      </p>
      </div>
    </>
  );
}

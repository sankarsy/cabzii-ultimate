import { Star } from "lucide-react";

/**
 * On-page mirror of Google rich-result rows — stars, price, attribute pills.
 * Reinforces Product/Service schema for crawlers and improves conversion UX.
 */
export default function SerpRichBar({
  ratingValue,
  reviewCount,
  priceLabel,
  availabilityLabel = "In stock · Available today",
  badges = [],
  className = ""
}) {
  const rating = Number(ratingValue);
  const reviews = Number(reviewCount);
  const showRating = Number.isFinite(rating) && rating > 0 && Number.isFinite(reviews) && reviews > 0;

  if (!showRating && !priceLabel && !badges.length) return null;

  return (
    <div
      className={`mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      aria-label="Booking highlights"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {showRating ? (
          <div className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
            <span className="inline-flex text-amber-400" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(rating) ? "fill-current" : "fill-none opacity-35"}`}
                />
              ))}
            </span>
            <span>{rating.toFixed(1)}</span>
            <span className="font-normal text-slate-500">({reviews.toLocaleString("en-IN")} reviews)</span>
          </div>
        ) : null}
        {priceLabel ? (
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
            Price: {priceLabel}
          </span>
        ) : null}
        {availabilityLabel ? (
          <span className="text-xs font-medium text-slate-600">{availabilityLabel}</span>
        ) : null}
      </div>

      {badges.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <li
              key={badge.label}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {badge.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

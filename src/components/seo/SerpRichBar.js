import { Star } from "lucide-react";
import { formatInr } from "../../lib/formatInr";

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
      className={`mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:mt-4 sm:p-4 ${className}`}
      aria-label="Booking highlights"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:gap-x-4 sm:gap-y-2 sm:text-sm">
        {showRating ? (
          <div className="inline-flex items-center gap-1 font-semibold text-slate-900 sm:gap-1.5">
            <span className="inline-flex text-amber-400" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.round(rating) ? "fill-current" : "fill-none opacity-35"}`}
                />
              ))}
            </span>
            <span>{rating.toFixed(1)}</span>
            <span className="font-normal text-slate-500">({formatInr(reviews)} reviews)</span>
          </div>
        ) : null}
        {priceLabel ? (
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 sm:px-2.5 sm:py-1 sm:text-xs">
            Price: {priceLabel}
          </span>
        ) : null}
        {availabilityLabel ? (
          <span className="text-[10px] font-medium text-slate-600 sm:text-xs">{availabilityLabel}</span>
        ) : null}
      </div>

      {badges.length ? (
        <ul className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
          {badges.map((badge) => (
            <li
              key={badge.label}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 sm:px-3 sm:py-1 sm:text-xs"
            >
              {badge.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

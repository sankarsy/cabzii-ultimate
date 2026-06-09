import { Star } from "lucide-react";

export default function RatingBadge({ rating, reviewCount, className = "" }) {
  if (rating == null || rating === "") return null;
  const value = Number(rating);
  if (!Number.isFinite(value)) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-amber-200/80 ${className}`}
    >
      <Star className="h-3 w-3 fill-amber-500 text-amber-500" strokeWidth={0} aria-hidden />
      {value.toFixed(1)}
      {reviewCount != null && Number(reviewCount) > 0 ? (
        <span className="font-medium text-amber-700/80">({reviewCount})</span>
      ) : null}
    </span>
  );
}

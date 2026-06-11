import { Star } from "lucide-react";

/** Filled-star rating display. Never renders empty/zero states — callers must hide when no reviews. */
export default function StarRating({ value = 0, size = "h-4 w-4", className = "" }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= rounded ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
          strokeWidth={0}
          aria-hidden
        />
      ))}
    </span>
  );
}

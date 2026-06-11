"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import StarRating from "./StarRating";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Verified reviews block for a cab/driver detail page.
 * Renders NOTHING when the item has no approved reviews — no empty stars,
 * no "0 reviews", no placeholder section.
 */
export default function ReviewsSection({ itemType, itemId, className = "" }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!itemType || !itemId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const qs = `itemType=${encodeURIComponent(itemType)}&itemId=${encodeURIComponent(itemId)}`;
        const [listRes, sumRes] = await Promise.all([
          fetch(`/api/reviews?${qs}&pageSize=20`, { cache: "no-store" }),
          fetch(`/api/reviews/summary?${qs}`, { cache: "no-store" })
        ]);
        const list = await listRes.json();
        const sum = await sumRes.json();
        if (cancelled) return;
        if (Array.isArray(list?.data)) setReviews(list.data);
        if (sum?.data) setSummary(sum.data);
      } catch {
        /* silent — reviews are progressive enhancement */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [itemType, itemId]);

  /* Hard rule: zero approved reviews → render nothing at all */
  if (!summary?.total || reviews.length === 0) return null;

  const { average, total, distribution } = summary;

  return (
    <section id="reviews" className={`scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 ${className}`}>
      <h2 className="text-base font-bold text-slate-900">Customer reviews</h2>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex shrink-0 flex-col items-start">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{average.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-500">/ 5</span>
          </div>
          <StarRating value={average} className="mt-1" />
          <p className="mt-1 text-xs font-medium text-slate-500">
            {total} verified {total === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution?.[star] || 0;
            const pct = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 shrink-0 text-right font-semibold text-slate-600">{star}</span>
                <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" strokeWidth={0} aria-hidden />
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-7 shrink-0 text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <ul className="mt-5 space-y-4 border-t border-slate-100 pt-4">
        {reviews.map((review) => (
          <li key={review._id} className="rounded-xl bg-slate-50/80 p-3.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-bold text-slate-900">{review.customerName}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <BadgeCheck className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                Verified booking
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500">
              <StarRating value={review.rating} size="h-3.5 w-3.5" />
              {review.bookingDate ? <span>Trip on {formatDate(review.bookingDate)}</span> : null}
              {review.serviceUsed ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="min-w-0 truncate">{review.serviceUsed}</span>
                </>
              ) : null}
            </div>
            {review.text ? <p className="mt-2 text-xs leading-relaxed text-slate-700">{review.text}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import StarRating from "./StarRating";

/**
 * "Rate your trip" widget shown on finished cab/driver bookings.
 * One review per booking; phone is verified against the booking server-side.
 */
export default function BookingReviewForm({ booking }) {
  const bookingId = String(booking._id || "");
  const phone = booking.phone || "";
  const [existing, setExisting] = useState(undefined); // undefined = loading, null = none
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!bookingId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/reviews/for-booking?bookingId=${encodeURIComponent(bookingId)}&phone=${encodeURIComponent(phone)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!cancelled) setExisting(json?.data ?? null);
      } catch {
        if (!cancelled) setExisting(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bookingId, phone]);

  const submit = async () => {
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, phone, rating, text: text.trim() })
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not submit review");
      setExisting(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSaving(false);
    }
  };

  if (existing === undefined) return null;

  if (existing) {
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <StarRating value={existing.rating} size="h-3.5 w-3.5" />
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <BadgeCheck className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            Verified booking
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {existing.status === "approved"
              ? "Your review is live"
              : existing.status === "rejected"
                ? "Review not published"
                : "Awaiting verification — appears once approved"}
          </span>
        </div>
        {existing.text ? <p className="mt-1.5 text-xs text-slate-600">{existing.text}</p> : null}
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
      <p className="text-xs font-bold text-slate-900">Rate your trip</p>
      <div className="mt-2 flex items-center gap-1" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="cabzii-tap p-0.5 transition-transform active:scale-90"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= (hover || rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
              }`}
              strokeWidth={0}
              aria-hidden
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder="Share how your trip went (optional)"
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[var(--cabzii-brand)] focus:outline-none"
      />
      {error ? <p className="mt-1.5 text-[11px] font-medium text-rose-600">{error}</p> : null}
      <button
        type="button"
        onClick={submit}
        disabled={saving}
        className="cabzii-tap mt-2 rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-xs font-bold text-white transition hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
      >
        {saving ? "Submitting…" : "Submit review"}
      </button>
      <p className="mt-1.5 text-[10px] text-slate-500">
        Reviews are verified against your booking and published after a quick check.
      </p>
    </div>
  );
}

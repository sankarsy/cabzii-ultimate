"use client";

import { useCallback, useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import StarRating from "../reviews/StarRating";

const STATUS_FILTERS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "", label: "All" }
];

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-700"
};

/** Verified-review moderation: approve / reject / delete. Aggregates recalc on the backend instantly. */
export default function AdminReviews({ token }) {
  const [status, setStatus] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const headers = token ? { authorization: `Bearer ${token}` } : {};

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ admin: "1", pageSize: "100" });
      if (status) qs.set("status", status);
      const res = await fetch(`/api/reviews?${qs.toString()}`, { headers, cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not load reviews");
      setReviews(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setReviews([]);
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token]);

  useEffect(() => {
    load();
  }, [load]);

  const setReviewStatus = async (id, nextStatus) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${id}/status`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Update failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId("");
    }
  };

  const removeReview = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE", headers });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Delete failed");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--cabzii-shadow-card)] md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Customer reviews</h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Approving a review publishes it and instantly recalculates the item&apos;s rating.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id || "all"}
              type="button"
              onClick={() => setStatus(f.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                status === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{error}</p> : null}

      {loading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          No {status || ""} reviews.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reviews.map((review) => {
            const id = String(review._id);
            const busy = busyId === id;
            return (
              <li key={id} className="rounded-xl border border-slate-200 p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{review.customerName}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <BadgeCheck className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                    Verified booking
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_BADGE[review.status] || ""}`}>
                    {review.status}
                  </span>
                  <StarRating value={review.rating} size="h-3.5 w-3.5" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {review.itemType === "driver" ? "Acting driver" : "Cab"} · {review.serviceUsed || "—"}
                  {review.bookingDate ? ` · Trip ${review.bookingDate}` : ""} · {review.phone}
                </p>
                {review.text ? <p className="mt-2 text-xs leading-relaxed text-slate-700">{review.text}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.status !== "approved" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setReviewStatus(id, "approved")}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Approve
                    </button>
                  ) : null}
                  {review.status !== "rejected" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setReviewStatus(id, "rejected")}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeReview(id)}
                    className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

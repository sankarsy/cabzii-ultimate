"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TestimonialCard from "../TestimonialCard";

function asCards(items = []) {
  return items
    .filter((item) => item && !item.sampleReview)
    .map((item) => ({
      ...item,
      verified: false
    }));
}

export default function TestimonialsSection() {
  const [cards, setCards] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/testimonials?limit=8&page=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setCards(asCards(Array.isArray(json?.data) ? json.data : []));
      })
      .catch(() => {
        if (!cancelled) setCards([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">Reviews</p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">What riders say</h2>
          </div>
          <Link href="/testimonials#write-review" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            Leave a review
          </Link>
        </div>

        {!loaded ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : cards.length ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((item) => (
              <TestimonialCard key={String(item._id ?? item.id ?? item.name)} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Customer reviews coming soon.
          </p>
        )}
      </div>
    </section>
  );
}

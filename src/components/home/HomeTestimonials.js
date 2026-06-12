"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, BadgeCheck, Quote } from "lucide-react";
import SectionIntro from "../ui/SectionIntro";
import { SAMPLE_TESTIMONIALS } from "../../lib/sampleContent";
import { getInitials } from "../../lib/avatar";
import { fetchJson } from "../../lib/apiClient";

function Stars({ rating }) {
  const r = Math.min(5, Math.max(1, Number(rating) || 5));
  return (
    <span className="inline-flex gap-0.5" aria-label={`${r} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= r ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
          strokeWidth={0}
          aria-hidden
        />
      ))}
    </span>
  );
}

function TestimonialTile({ item }) {
  const name = item.name || "Guest";
  return (
    <article className="flex h-full w-[18rem] shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-auto">
      <Quote className="h-5 w-5 text-[var(--cabzii-brand)]/30" strokeWidth={2} aria-hidden />
      <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-700">&ldquo;{item.message}&rdquo;</p>
      <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-[var(--cabzii-brand)]"
          aria-hidden
        >
          {getInitials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-xs font-bold text-slate-900">
            {name}
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.25} aria-hidden />
          </p>
          <p className="truncate text-[11px] text-slate-500">
            {[item.location, item.date].filter(Boolean).join(" · ")}
          </p>
        </div>
        <Stars rating={item.rating} />
      </div>
    </article>
  );
}

/**
 * Homepage testimonials — real admin-approved testimonials when available,
 * sample reviews as a fallback so the section is never empty.
 */
export default function HomeTestimonials() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson("/api/testimonials?limit=6&page=1")
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        setItems(list.length ? list : SAMPLE_TESTIMONIALS);
      })
      .catch(() => {
        if (!cancelled) setItems(SAMPLE_TESTIMONIALS);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = (items || SAMPLE_TESTIMONIALS).slice(0, 6);

  return (
    <section className="border-t border-slate-200 bg-slate-50/70 py-8 sm:py-10">
      <div className="section-shell">
        <div className="flex items-end justify-between gap-3">
          <SectionIntro
            eyebrow="Reviews"
            title="What customers say"
            subtitle="Feedback from riders who booked cabs, acting drivers and tours on cabzii.in."
          />
          <Link
            href="/testimonials"
            className="hidden shrink-0 text-sm font-semibold text-[var(--cabzii-brand)] hover:underline sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="scroll-x-touch -mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {visible.map((item) => (
            <TestimonialTile key={String(item._id ?? item.id)} item={item} />
          ))}
        </div>
        <Link
          href="/testimonials"
          className="mt-4 block text-center text-sm font-semibold text-[var(--cabzii-brand)] hover:underline sm:hidden"
        >
          View all reviews →
        </Link>
      </div>
    </section>
  );
}

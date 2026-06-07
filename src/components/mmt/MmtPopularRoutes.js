"use client";

import Link from "next/link";
import { useRef } from "react";
import { routeToCabSearchHref } from "../../lib/routeTrip";
import { SEO_ROUTES } from "../../lib/seo/routes";
import { cityBySlug } from "../../lib/seo/cities";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

function ScrollButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll routes left" : "Scroll routes right"}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function MmtPopularRoutes() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <section className="section-shell py-8 sm:py-10">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Popular routes</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            One-way outstation cabs — Chennai, Bengaluru, Hyderabad &amp; more
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />
          <ScrollButton direction="right" onClick={() => scroll(1)} />
          <Link href="/locations" className="text-sm font-semibold text-[var(--emt-primary)] hover:underline">
            View all cities
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="offers-scroll flex h-[118px] flex-nowrap items-stretch gap-3 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth"
        aria-label="Popular outstation cab routes"
      >
          {SEO_ROUTES.map((route) => {
            const from = cityBySlug(route.from);
            const to = cityBySlug(route.to);
            const fromName = from?.name || route.from;
            const toName = to?.name || route.to;
            return (
              <Link
                key={route.slug}
                href={routeToCabSearchHref(route)}
                className="group flex h-full min-w-[200px] max-w-[200px] shrink-0 snap-start flex-col justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition hover:border-[var(--emt-primary)]/40 hover:shadow-md"
              >
                <p className="line-clamp-1 text-sm font-bold leading-snug text-slate-900 group-hover:text-[var(--emt-primary)]">
                  {fromName} → {toName}
                </p>
                <div>
                  <p className="text-[11px] text-slate-500">
                    {route.distance} · {route.duration}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--emt-primary)]">
                    From {formatINR(route.sedanFrom)}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-400 group-hover:text-[var(--emt-primary)]/80">
                    One way · View cabs →
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
}

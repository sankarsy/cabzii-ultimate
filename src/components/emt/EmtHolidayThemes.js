"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HOLIDAY_THEMES, themeHref } from "../../lib/holidayHome";

function ScrollButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll themes left" : "Scroll themes right"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80"
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

export default function EmtHolidayThemes() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex flex-col items-center gap-2 text-center sm:mb-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Explore Holidays By Theme</h2>
          <p className="max-w-lg text-sm text-slate-600">
            Find your perfect getaway, tailored to your interests
          </p>
          <Link
            href="/holidays"
            className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
          >
            View all holiday packages →
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />

          <div
            ref={scrollRef}
            className="offers-scroll flex flex-1 justify-center gap-6 overflow-x-auto overscroll-x-contain px-1 py-3 snap-x snap-mandatory scroll-smooth sm:gap-8"
          >
            {HOLIDAY_THEMES.map((theme) => (
              <Link
                key={theme.id}
                href={themeHref(theme)}
                className="group flex w-[128px] shrink-0 snap-center flex-col items-center text-center sm:w-[140px]"
              >
                <div className="flex h-[108px] w-[108px] items-center justify-center rounded-full border-2 border-sky-200 bg-sky-50/40 transition duration-200 group-hover:border-[var(--cabzii-brand)]/45 group-hover:bg-sky-50 group-hover:shadow-[var(--cabzii-shadow-card)] sm:h-[118px] sm:w-[118px]">
                  <span className="text-[2.75rem] leading-none sm:text-5xl" aria-hidden>
                    {theme.emoji}
                  </span>
                </div>
                <p className="mt-3 text-base font-bold text-slate-900">{theme.title}</p>
                <span className="mt-1 text-sm font-semibold text-[var(--cabzii-brand)] group-hover:underline">
                  Explore Now
                </span>
              </Link>
            ))}
          </div>

          <ScrollButton direction="right" onClick={() => scroll(1)} />
        </div>
      </div>
    </section>
  );
}

/** Prefetch packages for destination tiles */
export function useHomeHolidayPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/packages?limit=100&page=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setPackages(Array.isArray(json?.data) ? json.data : []);
      })
      .catch(() => {
        if (!cancelled) setPackages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { packages, loading };
}

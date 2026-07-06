"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOLIDAY_THEMES, themeHref } from "../../lib/holidayHome";
import HolidayThemeTile from "./HolidayThemeTile";

function ScrollButton({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll themes left" : "Scroll themes right"}
      className="cabzii-tap flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[var(--cabzii-brand)]/30 hover:text-[var(--cabzii-brand)]"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default function EmtHolidayThemes() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(160, Math.round(el.clientWidth * 0.55));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-[var(--cabzii-bg)] py-6 sm:py-8">
      <div className="section-shell">
        <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Explore by theme</h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Beach, temple tours, family &amp; more</p>
          </div>
          <Link
            href="/holidays"
            className="shrink-0 text-xs font-semibold text-[var(--cabzii-brand)] hover:underline sm:text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ScrollButton direction="left" onClick={() => scroll(-1)} />

          <div
            ref={scrollRef}
            className="scroll-x-touch flex min-w-0 flex-1 items-start justify-between gap-3 overflow-x-auto overscroll-x-contain px-0.5 py-1 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
          >
            {HOLIDAY_THEMES.map((theme) => (
              <HolidayThemeTile key={theme.id} theme={{ ...theme, href: themeHref(theme) }} />
            ))}
          </div>

          <ScrollButton direction="right" onClick={() => scroll(1)} />
        </div>
      </div>
    </section>
  );
}

export { useHomeHolidayPackages } from "./useHomeHolidayPackages";

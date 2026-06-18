"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getOfferIcon } from "../icons/heroIcons";
import { DOMESTIC_OFFERS } from "../../lib/domesticFocus";

function ScrollButton({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll offers left" : "Scroll offers right"}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default function EmtOffersCarousel() {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="section-shell py-8 sm:py-10">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">Exclusive offers</h2>
        <div className="flex shrink-0 items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="right" onClick={() => scrollBy(1)} />
          <Link
            href="/search?q=offers"
            className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
          >
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="offers-scroll flex gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth"
        role="region"
        aria-label="Exclusive offers"
        tabIndex={0}
      >
        {DOMESTIC_OFFERS.map((o) => {
          const OfferIcon = getOfferIcon(o.iconKey);
          return (
            <Link
              key={o.tag}
              href={o.href}
              className={`min-w-[min(280px,85vw)] max-w-[320px] shrink-0 snap-start rounded-2xl bg-linear-to-br ${o.color} p-5 text-white shadow-[var(--emt-shadow-card)] transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2`}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">{o.tag}</span>
              <div className="mt-3 flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/25 text-white ring-1 ring-white/30 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  <OfferIcon className="h-[1.35rem] w-[1.35rem]" />
                </span>
                <div>
                  <h3 className="font-bold leading-snug">{o.title}</h3>
                  <p className="mt-1 text-sm text-white/90">{o.desc}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildDomesticDestinations } from "../../lib/holidayHome";
import { resolveMediaUrl } from "../../lib/media";

/* Gradient fallbacks when a destination has no image */
const CARD_COLORS = [
  "from-sky-500 to-blue-400",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-purple-400"
];

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

function ScrollButton({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll packages left" : "Scroll packages right"}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

function DestinationCard({ d, index }) {
  const cover = resolveMediaUrl(d.fallbackImage || d.image);
  const primary = resolveMediaUrl(d.image);
  const [src, setSrc] = useState(primary || cover);

  useEffect(() => {
    setSrc(primary || cover);
  }, [primary, cover]);

  function onImageError() {
    if (cover && src !== cover) {
      setSrc(cover);
      return;
    }
    setSrc(null);
  }

  return (
    <Link
      href={d.href}
      title={d.packageName || d.name}
      className="group min-w-[min(280px,85vw)] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--emt-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 lg:min-w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]"
    >
      {/* Banner — destination photo, gradient fallback otherwise */}
      <div className={`relative h-36 overflow-hidden bg-linear-to-br ${CARD_COLORS[index % CARD_COLORS.length]}`}>
        {src ? (
          <img
            src={src}
            alt={d.name ? `${d.name} holiday destination` : "Holiday destination"}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={onImageError}
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700 shadow-sm">
          Holidays
        </span>
      </div>

      {/* Body — name / price below the image */}
      <div className="flex min-h-[7.25rem] flex-col p-4">
        <h3 className="line-clamp-1 text-base font-extrabold leading-snug text-slate-900 group-hover:text-[var(--cabzii-brand)]">
          {d.name}
        </h3>
        <p className="mt-1 text-sm font-extrabold text-[var(--cabzii-brand)]">
          {d.priceFrom > 0 ? `From ${formatINR(d.priceFrom)}` : "Explore packages"}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-400">Instant enquiry</span>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
            BOOK NOW
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EmtPopularDestinations({ packages = [], loading = false }) {
  const domestic = buildDomesticDestinations(packages);
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="section-shell border-t border-slate-200 py-8 sm:py-10">
      <div className="relative mb-5 sm:mb-7">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Getaways &amp; tours</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
            Holiday packages
          </h2>
          <p className="mt-1 text-sm text-slate-600">Handpicked destinations across India with cab &amp; stay included</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="right" onClick={() => scrollBy(1)} />
          <Link href="/holidays" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            View all →
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading packages…
        </div>
      ) : domestic.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No holiday packages yet. Restart the backend to auto-load packages, or add tours in admin.
        </div>
      ) : (
        <div
          ref={trackRef}
          className="offers-scroll flex gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth"
          role="region"
          aria-label="Holiday packages"
          tabIndex={0}
        >
          {domestic.map((d, index) => (
            <DestinationCard key={d.slug} d={d} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}

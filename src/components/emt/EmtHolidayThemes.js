"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOLIDAY_CATEGORIES } from "../../lib/holidays";

/*
 * Per-category card meta — banner gradient, tagline and optional photo.
 * Drop an image at public/images/categories/<id>.jpg (e.g. pilgrimage.jpg)
 * and it will automatically replace the gradient banner.
 */
const CATEGORY_META = {
  pilgrimage: {
    color: "from-amber-500 to-orange-400",
    desc: "Tirupati, Rameswaram, Madurai & more temple tours with cab, darshan & stay."
  },
  beach: {
    color: "from-sky-500 to-blue-400",
    desc: "Goa, Pondicherry & coastal getaways — sun, sand and scenic ECR drives."
  },
  hill: {
    color: "from-emerald-500 to-teal-400",
    desc: "Ooty, Kodaikanal, Munnar & cool mountain escapes with sightseeing cabs."
  },
  heritage: {
    color: "from-rose-500 to-pink-400",
    desc: "Forts, palaces & UNESCO wonders — Mysore, Hampi, Thanjavur and beyond."
  },
  honeymoon: {
    color: "from-violet-500 to-purple-400",
    desc: "Romantic escapes with private cab, handpicked stays & flexible plans."
  },
  adventure: {
    color: "from-indigo-500 to-violet-400",
    desc: "Safari trails, trekking bases & offbeat drives for thrill seekers."
  },
  family: {
    color: "from-cyan-500 to-sky-400",
    desc: "Kid-friendly itineraries, spacious cabs & relaxed sightseeing for all ages."
  }
};

function ScrollButton({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll categories left" : "Scroll categories right"}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

function CategoryCard({ cat }) {
  const meta = CATEGORY_META[cat.id] || CATEGORY_META.pilgrimage;
  const [imageOk, setImageOk] = useState(true);
  const imageSrc = cat.image || `/images/categories/${cat.id}.jpg`;

  return (
    <Link
      href={`/holidays?category=${cat.id}`}
      className="group min-w-[min(280px,85vw)] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--emt-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 lg:min-w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]"
    >
      {/* Banner — category photo when uploaded, gradient fallback otherwise */}
      <div className={`relative flex min-h-[9rem] flex-col justify-end overflow-hidden bg-linear-to-br ${meta.color} p-4 text-white`}>
        {imageOk ? (
          <>
            <img
              src={imageSrc}
              alt={`${cat.label} tour packages`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageOk(false)}
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/75 via-slate-900/30 to-slate-900/5" aria-hidden />
          </>
        ) : null}
        <div className="relative drop-shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Tour packages</span>
          <h3 className="mt-1 text-lg font-extrabold leading-snug">{cat.label}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-[7.25rem] flex-col p-4">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{meta.desc}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-[11px] font-medium text-slate-400">Instant enquiry</span>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
            VIEW PACKAGES
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EmtHolidayThemes() {
  const trackRef = useRef(null);
  const categories = HOLIDAY_CATEGORIES.filter((cat) => cat.id !== "all");

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-[var(--cabzii-bg)] section-shell py-8 sm:py-10">
      <div className="relative mb-5 sm:mb-7">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">Tour categories</p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
            Explore by category
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Pilgrimage, beach, hill station &amp; more — find the tour that fits your trip
          </p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="right" onClick={() => scrollBy(1)} />
          <Link href="/holidays" className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="offers-scroll flex gap-4 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth"
        role="region"
        aria-label="Tour package categories"
        tabIndex={0}
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}

export { useHomeHolidayPackages } from "./useHomeHolidayPackages";

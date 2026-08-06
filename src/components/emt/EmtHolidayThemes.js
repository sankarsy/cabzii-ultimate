"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOLIDAY_CATEGORIES } from "../../lib/holidays";
import { useSiteSettings } from "../SiteSettingsProvider";
import { resolveMediaUrl } from "../../lib/media";

const GRADIENTS = {
  pilgrimage: "from-amber-500 to-orange-400",
  beach: "from-sky-500 to-blue-400",
  hill: "from-emerald-500 to-teal-400",
  heritage: "from-rose-500 to-pink-400",
  honeymoon: "from-violet-500 to-purple-400",
  adventure: "from-indigo-500 to-violet-400",
  family: "from-cyan-500 to-sky-400"
};

function ScrollButton({ direction, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll categories left" : "Scroll categories right"}
      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-sm transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex sm:h-9 sm:w-9"
    >
      <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

function CategoryCard({ cat }) {
  const [imageOk, setImageOk] = useState(Boolean(cat.image));
  const imageSrc = cat.image ? resolveMediaUrl(cat.image) : `/images/categories/${cat.id}.jpg`;
  const color = GRADIENTS[cat.id] || GRADIENTS.pilgrimage;

  return (
    <Link
      href={`/holidays?category=${cat.id}`}
      className="group min-w-[min(240px,78vw)] max-w-[280px] shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2 lg:min-w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]"
    >
      <div className={`relative flex min-h-[7rem] flex-col justify-end overflow-hidden bg-linear-to-br ${color} p-3 text-white sm:min-h-[8rem] sm:p-3.5`}>
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
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Tour packages</span>
          <h3 className="mt-0.5 text-sm font-extrabold leading-snug sm:text-base">{cat.label}</h3>
        </div>
      </div>

      <div className="flex min-h-[5.5rem] flex-col p-3 sm:min-h-[6rem] sm:p-3.5">
        <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-600 sm:text-xs">{cat.desc}</p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-[10px] font-medium text-slate-400">Instant enquiry</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)] sm:text-xs">
            VIEW PACKAGES
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function EmtHolidayThemes() {
  const trackRef = useRef(null);
  const settings = useSiteSettings();
  const fromCms = Array.isArray(settings?.holidayCategories) ? settings.holidayCategories : [];
  const categories = (fromCms.length ? fromCms : HOLIDAY_CATEGORIES.filter((c) => c.id !== "all")).map((cat) => {
    const fallback = HOLIDAY_CATEGORIES.find((c) => c.id === cat.id);
    return {
      id: cat.id,
      label: cat.label || fallback?.label || cat.id,
      image: cat.image || "",
      desc:
        cat.desc ||
        (cat.id === "pilgrimage"
          ? "Tirupati, Rameswaram, Madurai & more temple tours with cab, darshan & stay."
          : `${cat.label || cat.id} holiday packages with cab options on cabzii.in.`)
    };
  }).filter((c) => c.id && c.id !== "all");

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-[var(--cabzii-bg)] section-shell py-5 sm:py-8">
      <div className="relative mb-3 sm:mb-5">
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--cabzii-brand)] sm:text-xs">Tour categories</p>
          <h2 className="mt-0.5 text-base font-extrabold tracking-tight text-slate-900 sm:text-xl">
            Explore by category
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-600 sm:text-sm">
            Pilgrimage, beach, hill station &amp; more — find the tour that fits your trip
          </p>
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scrollBy(-1)} />
          <ScrollButton direction="right" onClick={() => scrollBy(1)} />
          <Link href="/holidays" className="text-xs font-semibold text-[var(--cabzii-brand)] hover:underline sm:text-sm">
            View all →
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="offers-scroll flex gap-3 overflow-x-auto overscroll-x-contain pb-1 pt-1 snap-x snap-mandatory scroll-smooth sm:gap-4"
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

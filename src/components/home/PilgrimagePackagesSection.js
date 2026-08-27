"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PILGRIMAGE_PACKAGES } from "../../lib/domesticFocus";

/* Warm banner gradients per card — pilgrimage theme */
const PACKAGE_COLORS = [
  "from-orange-500 to-amber-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-yellow-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-sky-500 to-blue-400"
];

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

export default function PilgrimagePackagesSection() {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-slate-200 bg-gradient-to-b from-orange-50/40 to-white py-8 sm:py-10">
      <div className="section-shell">
        <div className="relative mb-5 sm:mb-7">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">Temple &amp; pilgrimage</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
              Popular tour packages
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Tirupati, Rameswaram, Madurai, Navagraha &amp; South India tours
            </p>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
            <ScrollButton direction="left" onClick={() => scrollBy(-1)} />
            <ScrollButton direction="right" onClick={() => scrollBy(1)} />
            <Link
              href="/holidays?category=pilgrimage"
              className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline"
            >
              View all →
            </Link>
          </div>
        </div>

        <div
          ref={trackRef}
          className="offers-scroll cabzii-scroll-bleed flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth sm:gap-4"
          role="region"
          aria-label="Popular tour packages"
          tabIndex={0}
        >
          {PILGRIMAGE_PACKAGES.map((pkg, index) => (
            <Link
              key={pkg.slug}
              href={pkg.href}
              className="cabzii-hscroll-card group shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 sm:min-w-[16.25rem] sm:w-[16.25rem] sm:max-w-[18.75rem] sm:hover:-translate-y-1 sm:hover:shadow-[var(--emt-shadow-hover)] lg:min-w-[calc(25%-0.75rem)] lg:w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2"
            >
              {/* Banner — photo when pkg.image is set, gradient fallback otherwise */}
              <div
                className={`relative h-36 overflow-hidden bg-linear-to-br ${PACKAGE_COLORS[index % PACKAGE_COLORS.length]}`}
              >
                {pkg.image ? (
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 640px) 85vw, 320px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 shadow-sm">
                  {pkg.tag}
                </span>
              </div>

              {/* Body — tag / name / price below the image */}
              <div className="flex min-h-[7.25rem] flex-col p-4">
                <h3 className="text-base font-extrabold leading-snug text-slate-900 group-hover:text-[var(--cabzii-brand)]">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm font-extrabold text-[var(--cabzii-brand)]">From {pkg.fromPrice}</p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-medium text-slate-400">Instant enquiry</span>
                  <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
                    BOOK NOW
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

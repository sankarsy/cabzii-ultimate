"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getIcon } from "../icons";

const OFFERS = [
  {
    tag: "CABS",
    title: "20% OFF outstation cabs",
    desc: "Sedan, SUV & Innova from verified vendors.",
    iconKey: "car",
    color: "from-[var(--cabzii-brand)] to-blue-500",
    href: "/cabs"
  },
  {
    tag: "FLIGHTS",
    title: "Flat ₹500 OFF on domestic flights",
    desc: "Use code CABZII500 on select routes.",
    iconKey: "plane",
    color: "from-orange-500 to-amber-400",
    href: "/flights"
  },
  {
    tag: "HOTELS",
    title: "Up to 40% OFF on weekend stays",
    desc: "Free cancellation on 500+ properties.",
    iconKey: "hotel",
    color: "from-teal-500 to-cyan-400",
    href: "/hotels"
  },
  {
    tag: "DRIVERS",
    title: "Acting driver from ₹900",
    desc: "4hr, 8hr & outstation packages.",
    iconKey: "driver",
    color: "from-slate-700 to-slate-500",
    href: "/drivers"
  },
  {
    tag: "HOLIDAYS",
    title: "Pilgrimage from ₹4,999",
    desc: "Tirupati, Rameswaram & more.",
    iconKey: "holiday",
    color: "from-rose-500 to-pink-400",
    href: "/holidays?category=pilgrimage"
  },
  {
    tag: "DEALS",
    title: "Airport cab Chennai",
    desc: "Fixed fares · instant OTP booking.",
    iconKey: "airport",
    color: "from-indigo-500 to-violet-400",
    href: "/cabs/results?serviceTripType=airport&from=Chennai%20Airport&to=Chennai"
  }
];

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
        {OFFERS.map((o) => {
          const OfferIcon = getIcon(o.iconKey);
          return (
            <Link
              key={o.tag}
              href={o.href}
              className={`min-w-[min(280px,85vw)] max-w-[320px] shrink-0 snap-start rounded-2xl bg-linear-to-br ${o.color} p-5 text-white shadow-[var(--emt-shadow-card)] transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2`}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-90">{o.tag}</span>
              <div className="mt-3 flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm"
                  aria-hidden="true"
                >
                  {OfferIcon ? <OfferIcon className="h-5 w-5 text-white" strokeWidth={1.75} /> : null}
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

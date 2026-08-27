"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { getOfferIcon } from "../icons/heroIcons";
import { HOME_CARD_COPY, SHOWCASE_FALLBACKS } from "../../lib/homeShowcase";

function ScrollButton({ direction, onClick, label }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? `Scroll ${label} left` : `Scroll ${label} right`}
      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-card)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <Icon className="h-5 w-5" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

export default function HomeShowcaseCarousel({ section = "offers" }) {
  const copy = HOME_CARD_COPY[section] || HOME_CARD_COPY.offers;
  const trackRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [cards, setCards] = useState(SHOWCASE_FALLBACKS[section] || SHOWCASE_FALLBACKS.offers);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/offers?section=${encodeURIComponent(section)}`, { cache: "no-store" });
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data.filter((o) => o?.title && o.published !== false) : [];
        if (!cancelled && rows.length) setCards(rows);
      } catch {
        /* keep static fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [section]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const copyCode = (e, code) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode((prev) => (prev === code ? "" : prev)), 1500);
  };

  return (
    <section className="section-shell py-8 sm:py-10">
      <div className="relative mb-5 sm:mb-7">
        <h2 className="text-center text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">
          {copy.title}
        </h2>
        <div className="mt-3 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scrollBy(-1)} label={copy.title} />
          <ScrollButton direction="right" onClick={() => scrollBy(1)} label={copy.title} />
          <Link href={copy.viewAllHref} className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            {copy.viewAllLabel}
          </Link>
        </div>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="offers-scroll cabzii-scroll-bleed flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth sm:gap-4"
          role="region"
          aria-label={copy.ariaLabel}
          tabIndex={0}
        >
          {cards.map((o) => {
            const OfferIcon = getOfferIcon(o.iconKey);
            const copied = o.code && copiedCode === o.code;
            return (
              <Link
                key={o._id || `${section}-${o.tag}-${o.title}`}
                href={o.href || "/cabs"}
                className="cabzii-hscroll-card group shrink-0 snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 sm:min-w-[16.25rem] sm:w-[16.25rem] sm:max-w-[18.75rem] sm:hover:-translate-y-1 sm:hover:shadow-[var(--emt-shadow-hover)] lg:min-w-[calc(25%-0.75rem)] lg:w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2"
              >
                <div className={`relative flex min-h-[8.5rem] flex-col overflow-hidden bg-linear-to-br ${o.color || "from-[var(--cabzii-brand)] to-blue-500"} p-4 text-white`}>
                  {o.image ? (
                    <>
                      <Image
                        src={o.image}
                        alt={o.title}
                        fill
                        sizes="(max-width: 640px) 85vw, 320px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/45 to-slate-950/20" aria-hidden />
                    </>
                  ) : (
                    <span
                      className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/25 text-white ring-1 ring-white/30 backdrop-blur-sm"
                      aria-hidden="true"
                    >
                      <OfferIcon className="h-[1.35rem] w-[1.35rem]" />
                    </span>
                  )}
                  <div className="relative pr-12 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/95">{o.tag}</span>
                    <h3 className="home-showcase-title mt-1 text-base font-extrabold leading-snug text-white!">{o.title}</h3>
                  </div>
                  {o.code ? (
                    <button
                      type="button"
                      onClick={(e) => copyCode(e, o.code)}
                      className="relative mt-auto inline-flex items-center gap-1.5 self-start rounded border-[1.5px] border-dashed border-white/60 bg-white/20 px-2.5 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-sm transition hover:bg-white/30"
                      aria-label={`Copy promo code ${o.code}`}
                    >
                      {o.code}
                      {copied ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      )}
                      {copied ? <span className="text-[10px] font-semibold normal-case">Copied!</span> : null}
                    </button>
                  ) : o.fare ? (
                    <span className="relative mt-auto inline-flex items-center self-start rounded border-[1.5px] border-dashed border-white/60 bg-white/20 px-2.5 py-1 text-xs font-bold tracking-wider text-white backdrop-blur-sm">
                      {o.fare}
                    </span>
                  ) : null}
                </div>

                <div className="flex min-h-[7.25rem] flex-col p-4">
                  <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{o.desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[11px] font-medium text-slate-400">
                      {o.validTill ? `Valid Till : ${o.validTill}` : "Instant confirmation"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold tracking-wide text-slate-900 transition group-hover:text-[var(--cabzii-cta)]">
                      BOOK NOW
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

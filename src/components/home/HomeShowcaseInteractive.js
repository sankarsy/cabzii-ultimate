"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

/** Scroll buttons + promo copy — cards stay server-rendered. */
export default function HomeShowcaseInteractive({ title, viewAllHref, viewAllLabel, ariaLabel, children }) {
  const trackRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState("");

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.85);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  const onTrackClickCapture = (e) => {
    const btn = e.target.closest("[data-promo-code]");
    if (!btn || !trackRef.current?.contains(btn)) return;
    e.preventDefault();
    e.stopPropagation();
    const code = btn.getAttribute("data-promo-code");
    if (!code) return;
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* clipboard unavailable */
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode((prev) => (prev === code ? "" : prev)), 1500);
  };

  return (
    <>
      <div className="relative mb-5 sm:mb-7">
        <h2 className="text-center text-xl font-extrabold tracking-tight text-slate-900 sm:text-[1.75rem]">{title}</h2>
        <div className="mt-3 flex items-center justify-center gap-2 sm:absolute sm:right-0 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-end sm:gap-3">
          <ScrollButton direction="left" onClick={() => scrollBy(-1)} label={title} />
          <ScrollButton direction="right" onClick={() => scrollBy(1)} label={title} />
          <Link href={viewAllHref} className="text-sm font-semibold text-[var(--cabzii-brand)] hover:underline">
            {viewAllLabel}
          </Link>
        </div>
        {copiedCode ? (
          <p className="sr-only" aria-live="polite">
            Copied {copiedCode}
          </p>
        ) : null}
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="offers-scroll cabzii-scroll-bleed flex gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-smooth sm:gap-4"
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          onClickCapture={onTrackClickCapture}
        >
          {children}
        </div>
      </div>
    </>
  );
}

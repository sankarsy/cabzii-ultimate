"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "../icons/rscIcons";
import HomeSectionHeader from "./HomeSectionHeader";

function ScrollButton({ direction, onClick, label }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? `Scroll ${label} left` : `Scroll ${label} right`}
      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--cabzii-border)] bg-white text-[var(--cabzii-brand)] shadow-[var(--cabzii-shadow-xs)] transition hover:border-[var(--cabzii-brand)]/35 hover:bg-blue-50/80 sm:flex"
    >
      <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />
    </button>
  );
}

/** Scroll buttons + promo copy — cards stay server-rendered. */
export default function HomeShowcaseInteractive({ eyebrow, title, viewAllHref, viewAllLabel, ariaLabel, children }) {
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
      <HomeSectionHeader
        eyebrow={eyebrow}
        title={title}
        href={viewAllHref}
        linkLabel={viewAllLabel}
        actions={
          <>
            <ScrollButton direction="left" onClick={() => scrollBy(-1)} label={title} />
            <ScrollButton direction="right" onClick={() => scrollBy(1)} label={title} />
          </>
        }
      />
      {copiedCode ? (
        <p className="sr-only" aria-live="polite">
          Copied {copiedCode}
        </p>
      ) : null}

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

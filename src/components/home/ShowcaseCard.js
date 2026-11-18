"use client";

import Link from "next/link";
import { Copy } from "../icons/rscIcons";
import { getOfferIcon } from "../icons/heroIcons";
import { formatOfferValidUntil } from "../../lib/offers";
import { approxFromLabel } from "../../lib/approxPrice";
import { useSelectedCity } from "../../lib/useSelectedCity";
import { cityScopedCardHref } from "../../lib/cityShowcase";

export default function ShowcaseCard({ card: o, section = "offers", layout = "carousel" }) {
  const { city: selectedCity } = useSelectedCity();
  const href =
    section === "routes"
      ? o.href || "/cabs"
      : cityScopedCardHref(o.href || "/cabs", selectedCity);
  const OfferIcon = getOfferIcon(o.iconKey);
  const validUntilLabel = formatOfferValidUntil(o);
  const layoutClass =
    layout === "grid"
      ? "h-full w-full"
      : "cabzii-hscroll-card shrink-0 snap-start sm:min-w-[16.25rem] sm:w-[16.25rem] sm:max-w-[18.75rem] lg:min-w-[calc(25%-0.75rem)] lg:w-[calc(25%-0.75rem)] lg:max-w-[calc(25%-0.75rem)]";

  return (
    <Link
      href={href}
      className={`${layoutClass} group overflow-hidden rounded-2xl border border-[var(--cabzii-border)] bg-white shadow-[var(--emt-shadow-card)] transition-all duration-200 sm:hover:-translate-y-[3px] sm:hover:border-[var(--cabzii-brand)] sm:hover:shadow-[var(--emt-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cabzii-brand)] focus-visible:ring-offset-2`}
    >
      <div className="relative flex min-h-[6.75rem] flex-col bg-[var(--cabzii-sky)] p-3.5 sm:p-4">
        <span
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--cabzii-brand)] ring-1 ring-[var(--cabzii-border)]"
          aria-hidden="true"
        >
          <OfferIcon className="h-[1.35rem] w-[1.35rem]" />
        </span>
        <div className="relative pr-12">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--cabzii-brand)]">{o.tag}</span>
          <h3 className="home-showcase-title mt-1 text-base font-bold leading-snug text-[var(--cabzii-ink)]">{o.title}</h3>
        </div>
        {o.code ? (
          <span
            data-promo-code={o.code}
            className="relative mt-auto inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-[var(--cabzii-brand)]/40 bg-white px-2.5 py-1 text-xs font-bold tracking-wider text-[var(--cabzii-brand)]"
            aria-label={`Promo code ${o.code}`}
          >
            {o.code}
            <Copy className="h-3.5 w-3.5 pointer-events-none" strokeWidth={2} aria-hidden />
          </span>
        ) : o.fare ? (
          <span className="relative mt-auto inline-flex items-center self-start rounded-lg border border-dashed border-[var(--cabzii-brand)]/40 bg-white px-2.5 py-1 text-xs font-bold tracking-wider text-[var(--cabzii-brand)]">
            {approxFromLabel(o.fare)}
          </span>
        ) : null}
      </div>

      <div className="flex min-h-[6.5rem] flex-col p-3.5 sm:p-4">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-slate-600">{o.desc}</p>
        <div className="mt-auto flex flex-nowrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          {validUntilLabel ? (
            <span className="min-w-0 flex-1 truncate text-[11px] font-medium leading-none text-slate-400">
              {`Valid till ${validUntilLabel}`}
            </span>
          ) : (
            <span className="min-w-0 flex-1" />
          )}
          <span className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-[10px] bg-[var(--cabzii-brand)] px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-white">
            BOOK NOW
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

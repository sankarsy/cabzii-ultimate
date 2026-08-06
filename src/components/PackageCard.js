"use client";

import Link from "next/link";
import { optimizeImageUrl } from "../lib/imageOptimize";
import { categoryLabel } from "../lib/holidays";
import { resolveProductImageSeo, serviceFallbackPath } from "../lib/dynamicImageSeo";
import {
  packageDisplayPrice,
  packageHasManualDiscount,
  packageStrikePrice
} from "../lib/tourPackagePricing";
import { ArrowRightIcon, MapPinIcon, CheckIcon } from "./icons";

const FALLBACK_TOUR_IMAGE = serviceFallbackPath("holiday");

export default function PackageCard({ pkg, actionText = "Book", onAction, actionHref }) {
  const d = packageHasManualDiscount(pkg) ? Math.min(99, Math.max(0, Number(pkg.discountPercentage) || 0)) : 0;
  const packagePay = packageDisplayPrice(pkg);
  const packageOriginal = packageStrikePrice(pkg);
  const tagLabel = pkg.category
    ? categoryLabel(pkg.category)
    : pkg.tag || (Array.isArray(pkg.tags) && pkg.tags[0] ? String(pkg.tags[0]) : "Holiday");

  const imageSeo = resolveProductImageSeo(pkg, { kind: "holiday" });
  const imageSrc = optimizeImageUrl(imageSeo.displayUrl || imageSeo.coverUrl, 560);

  const BookAction = actionHref ? (
    <Link
      href={actionHref}
      className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap w-full justify-center !min-h-8 !text-[11px] sm:!min-h-9 sm:!text-xs"
    >
      {actionText} <ArrowRightIcon className="h-3.5 w-3.5 text-white/90" />
    </Link>
  ) : (
    <button
      type="button"
      onClick={() => onAction?.(pkg)}
      className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap w-full justify-center !min-h-8 !text-[11px] sm:!min-h-9 sm:!text-xs"
    >
      {actionText} <ArrowRightIcon className="h-3.5 w-3.5 text-white/90" />
    </button>
  );

  return (
    <article className="cabzii-card cabzii-card-interactive group relative flex h-full w-full flex-col overflow-hidden rounded-xl">
      <div className="relative p-1.5">
        <div className="relative overflow-hidden rounded-lg bg-slate-100">
          <img
            src={imageSrc}
            alt={imageSeo.alt || pkg.name || "Holiday package"}
            width={560}
            height={220}
            loading="lazy"
            decoding="async"
            className="h-[130px] w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] sm:h-[150px] md:h-[140px] lg:h-[155px]"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_TOUR_IMAGE) {
                e.currentTarget.src = FALLBACK_TOUR_IMAGE;
              }
            }}
          />
          <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap items-center gap-1">
            {d > 0 ? (
              <span className="rounded bg-[#0056D2] px-1.5 py-0.5 text-[10px] font-bold leading-tight text-white shadow">
                {d}% OFF
              </span>
            ) : null}
            <span className="truncate rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
              {tagLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-1 sm:px-3 sm:pb-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 sm:text-[15px]">
          {pkg.name}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-1.5">
          <p className="line-clamp-1 text-[11px] text-slate-500 sm:text-xs">by {pkg.vendor || "Tour Partner"}</p>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-slate-500">
            <CheckIcon className="h-3 w-3 text-emerald-400" />
            Verified
          </span>
        </div>

        {pkg.city ? (
          <div className="mt-1.5">
            <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600">
              <MapPinIcon className="h-3 w-3 shrink-0 text-sky-400" />
              <span className="truncate">{pkg.city}</span>
            </span>
          </div>
        ) : null}

        <div className="mt-2.5 flex items-end justify-between gap-2 border-t border-slate-100 pt-2">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">From</p>
            <p className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
              ₹{packagePay.toLocaleString("en-IN")}
            </p>
            {packageOriginal > packagePay ? (
              <p className="text-[11px] text-slate-400 line-through">
                ₹{packageOriginal.toLocaleString("en-IN")}
              </p>
            ) : null}
          </div>
          {d > 0 ? (
            <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-1 text-[11px] font-bold text-slate-700">
              {d}% OFF
            </span>
          ) : null}
        </div>

        <div className="mt-2.5">{BookAction}</div>
      </div>
    </article>
  );
}

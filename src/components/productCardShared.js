"use client";

import { optimizeImageUrl } from "../lib/imageOptimize";
import { serviceFallbackPath } from "../lib/dynamicImageSeo";

/** Shared layout tokens matching CabCard (image + meta below). */

import { CheckIcon } from "./icons";

export const CARD_ARTICLE_CLASS =
  "cabzii-card cabzii-card-interactive group relative flex h-full flex-col overflow-hidden";

export const CARD_BOOK_BTN_CLASS =
  "cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap w-full !text-[11px] sm:w-auto";

export function MetaPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 px-1.5 py-px text-[9px] leading-snug text-slate-600 sm:gap-1 sm:px-2 sm:text-[10px]">
      {icon ? <span className="text-sky-400">{icon}</span> : null}
      {label}
    </span>
  );
}

const FALLBACK_PRODUCT_IMAGE = serviceFallbackPath("cab");

export function ProductImageFrame({ src, alt, badges, imageClassName = "h-[120px] w-full object-cover sm:h-[140px] md:h-[130px]" }) {
  const imageSrc = optimizeImageUrl(src || FALLBACK_PRODUCT_IMAGE, 640);
  return (
    <div className="relative p-1 sm:p-1.5">
      <div className="relative overflow-hidden rounded-lg bg-slate-100 sm:rounded-xl">
        <img
          src={imageSrc}
          alt={alt || "Cabzii service"}
          width={640}
          height={320}
          loading="lazy"
          decoding="async"
          className={`${imageClassName} transition-transform duration-300 group-hover:scale-[1.02]`}
          onError={(e) => {
            if (e.currentTarget.src !== FALLBACK_PRODUCT_IMAGE) {
              e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
            }
          }}
        />
        {badges}
      </div>
    </div>
  );
}

export function ProductMetaBlock({ title, vendor, vendorFallback = "Cabzii", children }) {
  return (
    <div className="px-2 pb-1 sm:px-2.5">
      <h3 className="line-clamp-1 text-xs font-bold leading-snug text-slate-900 sm:text-sm">{title}</h3>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className="line-clamp-1 text-[10px] text-slate-500 sm:text-[11px]">by {vendor || vendorFallback}</p>
        <span className="flex shrink-0 items-center gap-0.5 text-[10px] text-slate-500 sm:text-[11px]">
          <CheckIcon className="h-2.5 w-2.5 text-emerald-400" />
          Verified
        </span>
      </div>
      {children ? <div className="mt-1 flex flex-wrap gap-1">{children}</div> : null}
    </div>
  );
}

export function PriceSummaryCard({
  finalPrice,
  extraKmCharge,
  extraHourCharge,
  extraBadges,
  priceLabel = "Starting From",
  priceSuffix = ""
}) {
  return (
    <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 sm:mt-1.5 sm:rounded-xl sm:p-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{priceLabel}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <p className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
              ₹{finalPrice.toLocaleString("en-IN")}
              {priceSuffix ? <span className="ml-1 text-[10px] font-medium text-slate-500">{priceSuffix}</span> : null}
            </p>
          </div>
        </div>
      </div>
      {(extraKmCharge != null || extraHourCharge != null) && (
        <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:mt-2 sm:gap-2">
          {extraKmCharge != null ? (
            <div className="rounded-md bg-white px-1.5 py-1 sm:rounded-lg sm:px-2 sm:py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Extra KM</p>
              <p className="text-[10px] font-bold text-slate-800 sm:text-xs">₹{extraKmCharge}/km</p>
            </div>
          ) : null}
          {extraHourCharge != null ? (
            <div className="rounded-md bg-white px-1.5 py-1 sm:rounded-lg sm:px-2 sm:py-1.5">
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Extra Hour</p>
              <p className="text-[10px] font-bold text-slate-800 sm:text-xs">₹{extraHourCharge}/hr</p>
            </div>
          ) : null}
        </div>
      )}
      {extraBadges ? <div className="mt-1.5 flex flex-wrap gap-1">{extraBadges}</div> : null}
    </div>
  );
}

export function PackagePill({ pkg, selected, onSelect, showPrice = true }) {
  const price = pkg?.price ?? pkg?.list;
  const hasPrice = showPrice && price > 0;
  const priceText = hasPrice ? `₹${Number(price).toLocaleString("en-IN")}` : "—";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`cabzii-segmented-option flex min-h-[3.75rem] w-full min-w-0 flex-1 basis-0 flex-col items-center justify-center px-2 py-2 text-center ${
        selected ? "cabzii-segmented-option-active" : ""
      }`}
    >
      <span className="line-clamp-2 w-full text-[11px] font-bold leading-tight text-slate-900 sm:text-xs">
        {pkg.label}
      </span>
      <span
        className={`mt-1 w-full text-xs font-semibold ${hasPrice ? "text-blue-700" : "invisible"}`}
        aria-hidden={!hasPrice}
      >
        {priceText}
      </span>
    </button>
  );
}

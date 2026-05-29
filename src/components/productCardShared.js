/** Shared layout tokens matching CabCard (image + meta below). */

import { typo } from "../lib/typography";
import { CheckIcon } from "./icons";

export const CARD_ARTICLE_CLASS =
  "group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg";

export const CARD_BOOK_BTN_CLASS =
  "inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#0056D2] px-3 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-[#0046b0] active:scale-[0.98] sm:text-sm sm:normal-case sm:tracking-normal";

export function MetaPill({ icon, label }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 ${typo.caption}`}>
      {icon ? <span className="text-[#0056D2]">{icon}</span> : null}
      {label}
    </span>
  );
}

export function ProductImageFrame({ src, alt, badges, imageClassName = "h-[185px] w-full object-contain p-1.5" }) {
  return (
    <div className="relative p-1.5">
      <div className="relative overflow-hidden rounded-[16px] bg-slate-100">
        <img
          src={src}
          alt={alt}
          className={`${imageClassName} transition-transform duration-300 group-hover:scale-[1.02]`}
        />
        {badges}
      </div>
    </div>
  );
}

export function ProductMetaBlock({ title, vendor, vendorFallback = "Cabzii", children }) {
  return (
    <div className="px-2.5 pb-1">
      <h3 className={`line-clamp-1 ${typo.h3}`}>{title}</h3>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className={`line-clamp-1 ${typo.caption}`}>by {vendor || vendorFallback}</p>
        <span className={`shrink-0 flex items-center gap-0.5 ${typo.caption}`}>
          <CheckIcon className="h-2.5 w-2.5" />
          Verified
        </span>
      </div>
      {children ? <div className="mt-1.5 flex flex-wrap gap-1">{children}</div> : null}
    </div>
  );
}

export function PriceSummaryCard({
  finalPrice,
  originalPrice,
  savedAmount,
  discountPct,
  extraKmCharge,
  extraHourCharge,
  extraBadges,
  priceLabel = "Starting From",
  priceSuffix = ""
}) {
  const d = Math.min(99, Math.max(0, discountPct));
  return (
    <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`${typo.badge} text-slate-400`}>{priceLabel}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className={typo.price}>
              ₹{finalPrice.toLocaleString("en-IN")}
              {priceSuffix ? <span className={`ml-1 text-xs font-medium text-slate-500`}>{priceSuffix}</span> : null}
            </p>
            {originalPrice > finalPrice ? (
              <span className="text-xs font-medium text-slate-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            ) : null}
          </div>
          {savedAmount > 0 ? (
            <p className={`mt-1 text-xs font-semibold text-slate-600`}>
              Save ₹{savedAmount.toLocaleString("en-IN")}
            </p>
          ) : null}
        </div>
        {d > 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-center">
            <p className={`${typo.badge} text-slate-500`}>Discount</p>
            <p className="text-xs font-bold text-slate-800">{d}% OFF</p>
          </div>
        ) : null}
      </div>
      {(extraKmCharge != null || extraHourCharge != null) && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {extraKmCharge != null ? (
            <div className="rounded-lg bg-white px-2 py-2">
              <p className={`${typo.badge} text-slate-400`}>Extra KM</p>
              <p className="mt-0.5 text-xs font-bold text-slate-800">₹{extraKmCharge}/km</p>
            </div>
          ) : null}
          {extraHourCharge != null ? (
            <div className="rounded-lg bg-white px-2 py-2">
              <p className={`${typo.badge} text-slate-400`}>Extra Hour</p>
              <p className="mt-0.5 text-xs font-bold text-slate-800">₹{extraHourCharge}/hr</p>
            </div>
          ) : null}
        </div>
      )}
      {extraBadges ? <div className="mt-2 flex flex-wrap gap-1.5">{extraBadges}</div> : null}
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
      className={`flex min-h-[3.75rem] w-full min-w-0 flex-1 basis-0 flex-col items-center justify-center rounded-xl border px-1.5 py-2 text-center transition-all duration-200 ${
        selected ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-300"
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

/** Shared layout tokens matching CabCard (image + meta below). */

export const CARD_ARTICLE_CLASS =
  "group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg";

export const CARD_BOOK_BTN_CLASS =
  "inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#18243d] to-[#22365f] px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:opacity-95 active:scale-[0.98]";

export function MetaPill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-medium text-slate-600">
      <span className="text-[#0056D2]">{icon}</span>
      {label}
    </span>
  );
}

export function ProductImageFrame({ src, alt, badges, imageClassName = "h-[185px] w-full object-contain p-1.5" }) {
  return (
    <div className="relative p-1.5">
      <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#18243d] via-[#1d3155] to-[#101827]">
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
      <h3 className="line-clamp-1 text-[15px] font-bold leading-tight text-slate-900">{title}</h3>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <p className="line-clamp-1 text-[10px] text-slate-500">by {vendor || vendorFallback}</p>
        <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-medium text-emerald-600">
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
          <p className="text-[9px] uppercase tracking-wide text-slate-400">{priceLabel}</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-xl font-extrabold text-slate-900">
              ₹{finalPrice.toLocaleString("en-IN")}
              {priceSuffix ? (
                <span className="text-[11px] font-semibold text-slate-500">{priceSuffix}</span>
              ) : null}
            </p>
            {originalPrice > finalPrice ? (
              <span className="text-xs font-medium text-slate-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            ) : null}
          </div>
          {savedAmount > 0 ? (
            <p className="mt-1 text-[10px] font-semibold text-emerald-600">
              Save ₹{savedAmount.toLocaleString("en-IN")}
            </p>
          ) : null}
        </div>
        {d > 0 ? (
          <div className="rounded-xl bg-orange-100 px-2 py-1.5 text-center">
            <p className="text-[8px] font-semibold uppercase text-orange-500">Discount</p>
            <p className="text-xs font-bold text-orange-600">{d}% OFF</p>
          </div>
        ) : null}
      </div>
      {(extraKmCharge != null || extraHourCharge != null) && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {extraKmCharge != null ? (
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[8px] uppercase tracking-wide text-slate-400">Extra KM</p>
              <p className="mt-1 text-[11px] font-bold text-slate-800">₹{extraKmCharge}/km</p>
            </div>
          ) : null}
          {extraHourCharge != null ? (
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[8px] uppercase tracking-wide text-slate-400">Extra Hour</p>
              <p className="mt-1 text-[11px] font-bold text-slate-800">₹{extraHourCharge}/hr</p>
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
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl border px-2.5 py-1.5 text-center transition-all duration-200 ${
        selected ? "border-blue-600 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-blue-300"
      }`}
    >
      <span className="block text-[10px] font-bold text-slate-900">{pkg.label}</span>
      {showPrice && price > 0 ? (
        <span className="mt-0.5 block text-[9px] font-semibold text-blue-700">
          ₹{Number(price).toLocaleString("en-IN")}
        </span>
      ) : null}
    </button>
  );
}

function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

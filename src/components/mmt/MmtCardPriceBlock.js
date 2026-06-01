function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

export default function MmtCardPriceBlock({ originalPrice, finalPrice, discountPct = 0, compact = false }) {
  const original = Number(originalPrice) || 0;
  const final = Number(finalPrice) || 0;
  const pct =
    discountPct > 0
      ? Math.min(99, Math.round(discountPct))
      : original > final && original > 0
        ? Math.min(99, Math.round(((original - final) / original) * 100))
        : 0;
  const showDiscount = original > final && original > 0;

  return (
    <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
      {showDiscount ? (
        <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "justify-end"}`}>
          <span className="text-xs font-medium text-slate-400 line-through">{formatINR(original)}</span>
          {pct > 0 ? (
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold leading-none text-emerald-700">
              {pct}% OFF
            </span>
          ) : null}
        </div>
      ) : null}
      <p className={`font-extrabold leading-tight text-slate-900 ${showDiscount ? "text-base sm:text-lg" : "text-lg sm:text-2xl"}`}>
        {formatINR(final)}
      </p>
      <p className={`leading-tight text-slate-500 ${compact ? "hidden text-[10px] sm:block" : "text-[10px]"}`}>
        incl. taxes &amp; charges
      </p>
    </div>
  );
}

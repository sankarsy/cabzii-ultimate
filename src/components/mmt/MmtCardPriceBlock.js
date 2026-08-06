function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

const MIN_DISPLAY_PRICE = 1;

function discountPct(original, finalAmt, discountPctProp = 0) {
  if (discountPctProp > 0) return Math.min(99, Math.round(discountPctProp));
  if (original > finalAmt && original > 0) {
    return Math.min(99, Math.round(((original - finalAmt) / original) * 100));
  }
  return 0;
}

export default function MmtCardPriceBlock({
  originalPrice,
  finalPrice,
  discountPct: discountPctProp = 0,
  compact = false,
  fareNote,
  perKmRate,
  perHourRate,
  distanceKm,
  roundTrip = false
}) {
  const kmRate = Number(perKmRate) || 0;
  const hrRate = Number(perHourRate) || 0;
  const km = Math.ceil(Number(distanceKm) || 0);
  const final = Number(finalPrice) || 0;

  if (hrRate >= MIN_DISPLAY_PRICE) {
    return (
      <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
        <p
          className={`font-extrabold leading-none text-slate-900 ${compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl"}`}
        >
          {formatINR(hrRate)}
          <span className={`font-bold text-slate-600 ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>
            /hr
          </span>
        </p>
        <p className={`leading-tight text-slate-500 ${compact ? "hidden text-[10px] sm:block" : "text-[10px]"}`}>
          {fareNote || "per hour · chauffeur"}
        </p>
      </div>
    );
  }

  if (kmRate >= MIN_DISPLAY_PRICE && km >= 1 && final >= MIN_DISPLAY_PRICE) {
    const mult = roundTrip ? 2 : 1;
    const distanceSubtotal = Math.round(kmRate * km * mult);
    const listAmt = Math.max(distanceSubtotal, Number(originalPrice) || 0);
    const pct = discountPct(listAmt, final, discountPctProp);
    const showDiscount = listAmt > final + 0.5 && listAmt >= MIN_DISPLAY_PRICE;
    const tripLabel = roundTrip ? "round trip" : "one-way";
    const kmFormula = `₹${kmRate}/km × ${km} km${mult > 1 ? " × 2" : ""}`;

    return (
      <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
        {showDiscount ? (
          <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "justify-end"}`}>
            <span className="text-xs font-medium text-slate-400 line-through">{formatINR(listAmt)}</span>
            {pct > 0 ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold leading-none text-emerald-700">
                {pct}% OFF
              </span>
            ) : null}
          </div>
        ) : null}
        <p
          className={`font-extrabold leading-none text-slate-900 ${compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl"}`}
        >
          {formatINR(final)}
        </p>
        <p className={`leading-tight text-slate-500 ${compact ? "text-[10px] sm:text-xs" : "text-xs"}`}>
          {km} km · {tripLabel} · {kmFormula}
        </p>
        {showDiscount ? (
          <p className={`leading-tight text-emerald-700 ${compact ? "text-[10px]" : "text-[10px]"}`}>
            {kmFormula} = {formatINR(distanceSubtotal)} → you pay {formatINR(final)}
          </p>
        ) : fareNote ? (
          <p className={`leading-tight text-slate-400 ${compact ? "text-[10px]" : "text-[10px]"}`}>{fareNote}</p>
        ) : null}
      </div>
    );
  }

  if (kmRate >= MIN_DISPLAY_PRICE) {
    return (
      <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
        <p
          className={`font-extrabold leading-none text-slate-900 ${compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl"}`}
        >
          {formatINR(kmRate)}
          <span className={`font-bold text-slate-600 ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>
            /km
          </span>
        </p>
        <p className={`leading-tight text-slate-500 ${compact ? "hidden text-[10px] sm:block" : "text-[10px]"}`}>
          {fareNote || "per km · enter route for total"}
        </p>
      </div>
    );
  }

  const original = Number(originalPrice) || 0;
  const finalAmt = Number(finalPrice) || 0;

  if (finalAmt < MIN_DISPLAY_PRICE && original < MIN_DISPLAY_PRICE) {
    return (
      <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
        <p className={`font-bold text-slate-700 ${compact ? "text-sm" : "text-base"}`}>Get quote</p>
        <p className={`leading-tight text-slate-500 ${compact ? "hidden text-[10px] sm:block" : "text-[10px]"}`}>
          fare on booking
        </p>
      </div>
    );
  }

  const pct = discountPct(original, finalAmt, discountPctProp);
  const showDiscount = original > finalAmt && original >= MIN_DISPLAY_PRICE;

  return (
    <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
      {showDiscount ? (
        <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "justify-end"}`}>
          <span className="text-xs font-medium text-slate-400 line-through">{formatINR(original)}</span>
          {pct > 0 ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold leading-none text-emerald-700">
              {pct}% OFF
            </span>
          ) : null}
        </div>
      ) : null}
      <p
        className={`font-extrabold leading-tight text-slate-900 ${
          compact
            ? "text-sm sm:text-base"
            : showDiscount
              ? "text-base sm:text-lg"
              : "text-lg sm:text-xl"
        }`}
      >
        {formatINR(finalAmt)}
      </p>
      <p className={`leading-tight text-slate-500 ${compact ? "text-[10px]" : "text-[10px]"}`}>
        {fareNote || "package fare"}
      </p>
    </div>
  );
}

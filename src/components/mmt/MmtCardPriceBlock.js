function formatINR(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(n) || 0);
}

const MIN_DISPLAY_PRICE = 1;

export default function MmtCardPriceBlock({
  originalPrice,
  finalPrice,
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
  const final = Number(finalPrice) || Number(originalPrice) || 0;

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
    const tripLabel = roundTrip ? "round trip" : "one-way";
    const kmFormula = `₹${kmRate}/km × ${km} km${roundTrip ? " × 2" : ""}`;

    return (
      <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
        <p
          className={`font-extrabold leading-none text-slate-900 ${compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl"}`}
        >
          {formatINR(final)}
        </p>
        <p className={`leading-tight text-slate-500 ${compact ? "text-[10px] sm:text-xs" : "text-xs"}`}>
          {km} km · {tripLabel} · {kmFormula}
        </p>
        {fareNote ? (
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

  if (final < MIN_DISPLAY_PRICE) {
    return (
      <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
        <p className={`font-bold text-slate-700 ${compact ? "text-sm" : "text-base"}`}>Get quote</p>
        <p className={`leading-tight text-slate-500 ${compact ? "hidden text-[10px] sm:block" : "text-[10px]"}`}>
          fare on booking
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "min-w-0" : "min-w-0 text-right"}>
      <p className={`font-extrabold leading-tight text-slate-900 ${compact ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}>
        {formatINR(final)}
      </p>
      <p className={`leading-tight text-slate-500 ${compact ? "text-[10px]" : "text-[10px]"}`}>
        {fareNote || "package fare"}
      </p>
    </div>
  );
}

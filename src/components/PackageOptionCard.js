"use client";

import { Sparkles } from "lucide-react";
import { packageYouPay } from "../lib/cabFare";
import { formatInrCurrency } from "../lib/formatInr";
import { ClockIcon, ICON_SOFT_CLASS, RoadIcon, TwoWayIcon } from "./icons";

export default function PackageOptionCard({ pkg, selected, discount, onSelect, compact = false }) {
  const list = pkg.list;
  const d = Math.min(99, Math.max(0, Number(discount) || 0));
  const youPay = packageYouPay(list, d);
  const isTrip = Boolean(pkg.note);
  const title = pkg.label || pkg.shortLabel;
  const PackageIcon = pkg.group === "outstation" ? (pkg.id?.includes("twoway") ? TwoWayIcon : RoadIcon) : ClockIcon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex h-full w-full min-w-0 flex-col rounded-lg border text-left transition ${
        compact ? "px-2 py-2" : "min-h-[10rem] px-3 py-3 sm:px-4 sm:py-4"
      } ${
        selected
          ? "border-[var(--cabzii-brand)] bg-blue-50/40 ring-1 ring-[var(--cabzii-brand)]/25"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {pkg.popular ? (
        <span
          className={`absolute -top-2 left-1/2 flex -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-full bg-violet-600 font-bold uppercase tracking-wide text-white ${
            compact ? "px-1.5 py-px text-[7px]" : "px-2 py-0.5 text-[9px]"
          }`}
        >
          <Sparkles className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} strokeWidth={2.5} aria-hidden />
          Most Popular
        </span>
      ) : null}

      <span
        className={`flex items-center gap-1 font-semibold text-slate-800 ${
          compact ? "text-[10px] leading-tight" : "text-xs sm:text-sm"
        }`}
      >
        <PackageIcon className={compact ? `h-3 w-3 shrink-0 ${ICON_SOFT_CLASS}` : `h-3.5 w-3.5 shrink-0 ${ICON_SOFT_CLASS}`} />
        <span className="line-clamp-1 min-w-0 flex-1">{title}</span>
      </span>

      {d > 0 ? (
        <div className={`flex flex-wrap items-center gap-1 ${compact ? "mt-0.5" : "mt-1"}`}>
          <span className={`text-slate-400 line-through ${compact ? "text-[9px]" : "text-xs"}`}>
            {formatInrCurrency(list)}
          </span>
          <span
            className={`rounded-full bg-emerald-50 font-bold text-emerald-700 ${
              compact ? "px-1 py-px text-[8px]" : "px-1.5 py-px text-[10px]"
            }`}
          >
            {d}% OFF
          </span>
        </div>
      ) : null}

      <p
        className={`shrink-0 font-extrabold leading-none text-[#0056D2] ${
          compact ? "mt-1 text-sm" : "mt-1.5 text-lg sm:text-xl"
        }`}
      >
        {formatInrCurrency(youPay)}
      </p>

      <div className={compact ? "mt-1" : "mt-1.5"}>
        {isTrip ? (
          <p className={`text-slate-500 ${compact ? "text-[8px] leading-snug line-clamp-2" : "text-[10px] sm:text-xs"}`}>
            {pkg.note}
          </p>
        ) : (
          <div className={compact ? "space-y-0" : "space-y-px"}>
            <p className={`text-slate-500 ${compact ? "text-[8px] leading-tight" : "text-[10px] sm:text-xs"}`}>
              Extra Hr: {pkg.extraHr != null ? `${formatInrCurrency(pkg.extraHr)}/hr` : "—"}
            </p>
            <p className={`text-slate-500 ${compact ? "text-[8px] leading-tight" : "text-[10px] sm:text-xs"}`}>
              Extra Km: {pkg.extraKm != null ? `${formatInrCurrency(pkg.extraKm)}/km` : "—"}
            </p>
          </div>
        )}
      </div>

      <span
        className={`mx-auto flex shrink-0 items-center justify-center rounded-full border-2 ${
          compact ? "mt-1.5 h-3 w-3" : "mt-2 h-4 w-4"
        } ${selected ? "border-[#0056D2] bg-[#0056D2]" : "border-slate-300 bg-white"}`}
        aria-hidden
      >
        {selected ? <span className={`rounded-full bg-white ${compact ? "h-1 w-1" : "h-1.5 w-1.5"}`} /> : null}
      </span>
    </button>
  );
}

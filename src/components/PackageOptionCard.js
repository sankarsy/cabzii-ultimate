"use client";

import { packageYouPay } from "../lib/cabFare";
import { ClockIcon, RoadIcon, TwoWayIcon } from "./icons";

const COMPACT_MIN_H = "min-h-[8.75rem]";
const FULL_MIN_H = "min-h-[11rem]";

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
      className={`relative flex h-full w-full min-w-0 flex-col rounded-xl border text-left transition ${
        compact ? `px-2.5 py-2.5 ${COMPACT_MIN_H}` : `px-4 py-4 ${FULL_MIN_H}`
      } ${
        selected
          ? "border-[#0056D2] bg-blue-50/30 ring-2 ring-[#0056D2]/20"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {pkg.popular ? (
        <span
          className={`absolute -top-2.5 left-1/2 flex -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-full bg-violet-600 font-bold uppercase tracking-wide text-white ${
            compact ? "px-1.5 py-px text-[7px]" : "px-2.5 py-0.5 text-[10px]"
          }`}
        >
          ★ Most Popular
        </span>
      ) : null}

      <span
        className={`flex min-h-[2rem] items-start gap-1 font-semibold text-slate-800 ${
          compact ? "text-[10px]" : "text-sm"
        }`}
      >
        <PackageIcon className={compact ? "h-3 w-3 shrink-0 text-slate-500" : "h-4 w-4 shrink-0 text-slate-500"} />
        <span className="line-clamp-2 min-w-0 flex-1 leading-tight">{title}</span>
      </span>

      <div className={`flex min-h-[1.125rem] flex-wrap items-center gap-1.5 ${compact ? "mt-1" : "mt-2"}`}>
        {d > 0 ? (
          <>
            <span className={`text-slate-400 line-through ${compact ? "text-[10px]" : "text-sm"}`}>
              ₹{list.toLocaleString("en-IN")}
            </span>
            <span
              className={`rounded-full bg-emerald-50 font-bold text-emerald-700 ${
                compact ? "px-1.5 py-px text-[9px]" : "px-2 py-0.5 text-xs"
              }`}
            >
              {d}% OFF
            </span>
          </>
        ) : null}
      </div>

      <p className={`shrink-0 font-extrabold text-[#0056D2] ${compact ? "mt-0.5 text-base" : "mt-1 text-2xl"}`}>
        ₹{youPay.toLocaleString("en-IN")}
      </p>

      <div className={`mt-auto min-h-[2rem] ${compact ? "pt-0.5" : "pt-1"}`}>
        {isTrip ? (
          <p className={`text-slate-500 ${compact ? "text-[9px] leading-snug" : "text-xs"}`}>{pkg.note}</p>
        ) : (
          <div className={compact ? "space-y-px" : "space-y-0.5"}>
            <p className={`text-slate-500 ${compact ? "text-[9px]" : "text-xs"}`}>
              Extra Hour: ₹{pkg.extraHr?.toLocaleString("en-IN") ?? "—"}/hr
            </p>
            <p className={`text-slate-500 ${compact ? "text-[9px]" : "text-xs"}`}>
              Extra Km: ₹{pkg.extraKm?.toLocaleString("en-IN") ?? "—"}/km
            </p>
          </div>
        )}
      </div>

      <span
        className={`mx-auto flex shrink-0 items-center justify-center rounded-full border-2 ${
          compact ? "mt-1.5 h-3.5 w-3.5" : "mt-3 h-5 w-5"
        } ${selected ? "border-[#0056D2] bg-[#0056D2]" : "border-slate-300 bg-white"}`}
        aria-hidden
      >
        {selected ? (
          <span className={`rounded-full bg-white ${compact ? "h-1 w-1" : "h-2 w-2"}`} />
        ) : null}
      </span>
    </button>
  );
}

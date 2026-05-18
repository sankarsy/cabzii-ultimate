"use client";

import { packageYouPay } from "../lib/cabFare";

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
      className={`relative flex w-full min-w-0 flex-col rounded-xl border text-left transition ${
        compact ? "px-2.5 py-2.5" : "px-4 py-4"
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
        className={`flex items-center gap-1 font-semibold text-slate-800 ${compact ? "text-[10px]" : "text-sm"}`}
      >
        <PackageIcon className={compact ? "h-3 w-3 shrink-0 text-slate-500" : "h-4 w-4 shrink-0 text-slate-500"} />
        <span className="line-clamp-2 leading-tight">{title}</span>
      </span>

      {d > 0 ? (
        <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "mt-1" : "mt-2"}`}>
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
        </div>
      ) : null}

      <p className={`font-extrabold text-[#0056D2] ${compact ? "mt-0.5 text-base" : "mt-1 text-2xl"}`}>
        ₹{youPay.toLocaleString("en-IN")}
      </p>

      {isTrip ? (
        <p className={`text-slate-500 ${compact ? "mt-0.5 text-[9px]" : "mt-1 text-xs"}`}>{pkg.note}</p>
      ) : (
        <div className={compact ? "mt-0.5 space-y-px" : "mt-1 space-y-0.5"}>
          <p className={`text-slate-500 ${compact ? "text-[9px]" : "text-xs"}`}>
            Extra Hour: ₹{pkg.extraHr?.toLocaleString("en-IN") ?? "—"}/hr
          </p>
          <p className={`text-slate-500 ${compact ? "text-[9px]" : "text-xs"}`}>
            Extra Km: ₹{pkg.extraKm?.toLocaleString("en-IN") ?? "—"}/km
          </p>
        </div>
      )}

      <span
        className={`mx-auto flex items-center justify-center rounded-full border-2 ${
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

function ClockIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function RoadIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M4 19l4-14M16 5l4 14M9 19h6M10 12h4" />
    </svg>
  );
}

function TwoWayIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M7 16l-4-4 4-4M17 8l4 4-4 4M3 12h18" />
    </svg>
  );
}

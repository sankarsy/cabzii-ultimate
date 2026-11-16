"use client";

import { Check, Sparkles } from "./icons/rscIcons";
import { formatInrCurrency } from "../lib/formatInr";
import { APPROX_PRICE_LABEL } from "../lib/approxPrice";

export default function PackageOptionCard({ pkg, selected, onSelect, compact = false }) {
  const youPay = Number(pkg.price) > 0 ? Number(pkg.price) : Number(pkg.list) || 0;
  const isTrip = Boolean(pkg.note);
  const title = pkg.label || pkg.shortLabel;
  const hours = Number(pkg.includedHours) || 0;
  const km = Number(pkg.includedKm) || 0;
  const hasQuota = hours > 0 || km > 0;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border text-left transition ${
        compact ? "p-3" : "p-4 sm:p-5"
      } ${
        selected
          ? "border-[var(--cabzii-brand)] bg-white shadow-[0_10px_28px_rgba(30,64,175,0.12)]"
          : "border-slate-200 bg-white hover:border-[var(--cabzii-brand)]/35 hover:shadow-sm"
      }`}
    >
      {selected ? (
        <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[var(--cabzii-brand)] text-white">
          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </span>
      ) : null}

      <div className={`flex flex-wrap items-center gap-2 ${selected ? "pr-9" : ""}`}>
        {pkg.popular ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cabzii-cta)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <Sparkles className="h-3 w-3" strokeWidth={2.5} aria-hidden />
            Popular
          </span>
        ) : null}
        {!hasQuota ? (
          <span className={`font-bold text-[var(--cabzii-ink)] ${compact ? "text-sm" : "text-base"}`}>{title}</span>
        ) : null}
      </div>

      {hasQuota ? (
        <div className={`grid grid-cols-2 ${compact ? "mt-2 gap-2" : "mt-3 gap-3"}`}>
          {hours > 0 ? (
            <span className="rounded-xl bg-[var(--cabzii-sky)] px-2.5 py-2">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Hours</span>
              <span className={`font-extrabold text-[var(--cabzii-ink)] ${compact ? "text-sm" : "text-lg"}`}>{hours} hr</span>
            </span>
          ) : null}
          {km > 0 ? (
            <span className="rounded-xl bg-[var(--cabzii-sky)] px-2.5 py-2">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Included</span>
              <span className={`font-extrabold text-[var(--cabzii-ink)] ${compact ? "text-sm" : "text-lg"}`}>{km} km</span>
            </span>
          ) : null}
        </div>
      ) : null}

      <p
        className={`shrink-0 font-extrabold leading-none text-[var(--cabzii-cta)] ${
          compact ? "mt-2.5 text-xl" : "mt-3 text-2xl"
        }`}
      >
        {formatInrCurrency(youPay)}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-400">{APPROX_PRICE_LABEL}</p>

      <div className={compact ? "mt-2" : "mt-3"}>
        {isTrip ? (
          <p className="text-xs leading-snug text-slate-500">{pkg.note}</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              Extra {pkg.extraHr != null ? `${formatInrCurrency(pkg.extraHr)}/hr` : "—"}
            </span>
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              Extra {pkg.extraKm != null ? `${formatInrCurrency(pkg.extraKm)}/km` : "—"}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

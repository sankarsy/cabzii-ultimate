"use client";

import Link from "next/link";
import { formatInrCurrency } from "../lib/formatInr";

function inr(n) {
  return formatInrCurrency(n);
}

/** Clear tour-package fare breakdown: package + transport → subtotal → discount → total. */
export default function TourPriceBreakdown({
  item,
  selection,
  payHref,
  proceedLabel = "Continue to payment",
  compact = false,
  footerNote
}) {
  if (!selection) return null;

  const total = selection.total ?? 0;
  const packageList = selection.packageListPrice ?? 0;
  const transportList = selection.transportListPrice ?? 0;
  const subtotal = selection.listSubtotal ?? selection.listPrice ?? packageList + transportList;
  const discountPct = selection.discountPct ?? 0;
  const discountAmount = selection.discountAmount ?? Math.max(0, subtotal - total);
  const cabLabel = selection.cabLabel;
  const cabPct =
    selection.cabMultiplier > 1 ? `+${Math.round((selection.cabMultiplier - 1) * 100)}%` : null;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "p-4" : "p-5 md:p-6"}`}>
      <h3 className={`font-bold text-slate-900 ${compact ? "text-sm" : "text-lg"}`}>Price summary</h3>
      <p className={`text-slate-500 ${compact ? "mt-0.5 text-[10px]" : "mt-1 text-xs"}`}>
        {footerNote ?? "All amounts below are included in your payable total. Toll, permit & driver bata are extra."}
      </p>

      {item ? (
        <div className={`mt-4 rounded-lg bg-slate-50 ${compact ? "p-2.5" : "p-3"}`}>
          <p className={`font-semibold text-slate-900 ${compact ? "text-xs" : "text-sm"}`}>{item.title}</p>
          <p className={`text-slate-600 ${compact ? "text-[10px]" : "text-xs"}`}>
            {item.subtitle || `${item.type} · by ${item.vendor}`}
          </p>
        </div>
      ) : null}

      <dl className={`mt-3 space-y-2 ${compact ? "text-[11px]" : "text-sm"} text-slate-700`}>
        {selection.persons != null ? (
          <div className="flex justify-between gap-2">
            <dt>Travellers</dt>
            <dd className="font-medium">{selection.persons}</dd>
          </div>
        ) : null}
        {cabLabel ? (
          <div className="flex justify-between gap-2">
            <dt>Vehicle</dt>
            <dd className="font-medium">
              {cabLabel}
              {cabPct ? <span className="text-slate-500"> ({cabPct})</span> : null}
            </dd>
          </div>
        ) : null}
        {selection.pickup ? (
          <div className="flex justify-between gap-2">
            <dt>Pickup</dt>
            <dd className="max-w-[58%] text-right font-medium leading-snug">{selection.pickup}</dd>
          </div>
        ) : null}

        <div className="my-2 border-t border-slate-100 pt-2">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Fare calculation</p>

          <div className="flex justify-between gap-2">
            <dt className="max-w-[65%] leading-snug">
              Package
              {cabLabel ? ` (${cabLabel})` : ""}
            </dt>
            <dd className="shrink-0 font-semibold">{inr(packageList)}</dd>
          </div>

          {transportList > 0 ? (
            <div className="mt-1.5 flex justify-between gap-2">
              <dt className="max-w-[65%] leading-snug text-slate-600">
                Transport
                {selection.transportFrom && selection.transportTo ? (
                  <span className="block text-[10px] font-normal text-slate-500">
                    {selection.transportFrom} ↔ {selection.transportTo}
                    {selection.transportDistanceKm > 0 ? ` · ${selection.transportDistanceKm} km round trip` : ""}
                  </span>
                ) : null}
              </dt>
              <dd className="shrink-0 font-semibold">{inr(transportList)}</dd>
            </div>
          ) : null}

          <div className="mt-2 flex justify-between gap-2 border-t border-dashed border-slate-200 pt-2 font-medium">
            <dt>Subtotal</dt>
            <dd>{inr(subtotal)}</dd>
          </div>

          {discountPct > 0 ? (
            <div className="mt-1 flex justify-between gap-2 text-emerald-700">
              <dt>Online discount ({discountPct}%)</dt>
              <dd className="font-semibold">− {inr(discountAmount)}</dd>
            </div>
          ) : null}
        </div>
      </dl>

      <div className={`mt-4 rounded-xl bg-[#0056D2]/10 ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">Total payable now</span>
          <span className={`font-bold text-[#0056D2] ${compact ? "text-base" : "text-xl"}`}>{inr(total)}</span>
        </div>
        {discountPct > 0 ? (
          <p className="mt-1 text-[10px] text-slate-600">
            You save {inr(discountAmount)} ({discountPct}% off MRP {inr(subtotal)})
          </p>
        ) : null}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-slate-500">
        Toll, permit & driver bata billed separately as per actual trip.
      </p>

      {payHref ? (
        <Link
          href={payHref}
          className={`mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#0056D2] font-bold text-white transition hover:bg-[#0047b3] ${
            compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
          }`}
        >
          {proceedLabel} →
        </Link>
      ) : null}
    </div>
  );
}

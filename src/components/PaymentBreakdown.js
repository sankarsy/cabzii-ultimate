"use client";

import Link from "next/link";
import { formatInrCurrency } from "../lib/formatInr";

function inr(n) {
  return formatInrCurrency(n);
}

export default function PaymentBreakdown({
  cab,
  item,
  selection,
  payHref,
  proceedLabel = "Proceed to Payment",
  compact = false,
  showExtrasNote = true,
  footerNote
}) {
  const product = item ?? (cab ? { title: cab.title, type: cab.type, vendor: cab.vendor } : null);
  const baseFare = selection?.baseFare ?? selection?.fare ?? 0;
  const listPrice = selection?.listPrice ?? baseFare;
  const discountPct = selection?.discountPct ?? 0;
  const discountAmount = selection?.discountAmount ?? Math.max(0, listPrice - baseFare);
  const total = selection?.total ?? baseFare;
  const usesDistance = Boolean(selection?.usesDistance && selection?.distanceKm > 0 && selection?.perKmRate > 0);
  const distanceCharge =
    selection?.distanceCharge ??
    (usesDistance
      ? Math.round(Math.ceil(selection.distanceKm) * selection.perKmRate * (selection.roundTrip ? 2 : 1))
      : 0);

  const fareLines = usesDistance ? (
    <>
      <div className="my-2 border-t border-slate-100 pt-2">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Fare calculation</p>
        <div className="flex justify-between gap-2">
          <dt className="max-w-[65%] leading-snug">
            Distance
            <span className="block text-[10px] font-normal text-slate-500">
              {selection.distanceKm} km · ₹{selection.perKmRate}/km
              {selection.roundTrip ? " × 2 round trip" : " · one-way"}
            </span>
          </dt>
          <dd className="shrink-0 font-semibold">{inr(distanceCharge)}</dd>
        </div>
        {selection?.driverBatta > 0 ? (
          <div className="mt-1 flex justify-between gap-2">
            <dt>Driver bata</dt>
            <dd className="font-semibold">{inr(selection.driverBatta)}</dd>
          </div>
        ) : null}
        <div className="mt-2 flex justify-between gap-2 border-t border-dashed border-slate-200 pt-2 font-medium">
          <dt>Subtotal</dt>
          <dd>{inr(listPrice)}</dd>
        </div>
        {discountPct > 0 ? (
          <div className="mt-1 flex justify-between gap-2 text-emerald-700">
            <dt>Online discount ({discountPct}%)</dt>
            <dd className="font-semibold">− {inr(discountAmount)}</dd>
          </div>
        ) : null}
      </div>
    </>
  ) : (
    <>
      {discountPct > 0 ? (
        <>
          <div className="flex justify-between gap-2 text-slate-500">
            <dt>List price</dt>
            <dd className="line-through">{inr(listPrice)}</dd>
          </div>
          <div className="flex justify-between gap-2 text-emerald-700">
            <dt>Discount ({discountPct}%)</dt>
            <dd className="font-medium">− {inr(discountAmount)}</dd>
          </div>
        </>
      ) : null}
      <div className="flex justify-between gap-2 border-t border-slate-100 pt-2">
        <dt className="font-medium">Base fare</dt>
        <dd className="font-semibold">{inr(baseFare)}</dd>
      </div>
    </>
  );

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "p-4" : "p-5 md:p-6"}`}>
      <h3 className={`font-bold text-slate-900 ${compact ? "text-sm" : "text-lg"}`}>Payment breakdown</h3>
      <p className={`text-slate-500 ${compact ? "mt-0.5 text-[10px]" : "mt-1 text-xs"}`}>
        {footerNote ?? "Review fare before you pay. Toll, parking & extra km/hr billed separately."}
      </p>

      {product ? (
        <div className={`mt-4 rounded-lg bg-slate-50 ${compact ? "p-2.5" : "p-3"}`}>
          <p className={`font-semibold text-slate-900 ${compact ? "text-xs" : "text-sm"}`}>{product.title}</p>
          <p className={`text-slate-600 ${compact ? "text-[10px]" : "text-xs"}`}>
            {product.subtitle || `${product.type} · by ${product.vendor}`}
          </p>
        </div>
      ) : null}

      <dl className={`mt-3 space-y-2 ${compact ? "text-[11px]" : "text-sm"} text-slate-700`}>
        <div className="flex justify-between gap-2">
          <dt>Package</dt>
          <dd className="text-right font-medium">{selection?.packageLabel ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Service type</dt>
          <dd className="text-right font-medium capitalize">{selection?.serviceTab ?? "—"}</dd>
        </div>
        {selection?.persons != null ? (
          <div className="flex justify-between gap-2">
            <dt>Travellers</dt>
            <dd className="text-right font-medium">{selection.persons}</dd>
          </div>
        ) : null}
        {selection?.pickup ? (
          <div className="flex justify-between gap-2">
            <dt>Pickup</dt>
            <dd className="max-w-[55%] text-right font-medium leading-snug">{selection.pickup}</dd>
          </div>
        ) : null}
        {fareLines}
      </dl>

      {!showExtrasNote && selection?.note && !usesDistance ? (
        <p className="mt-3 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5 text-[11px] text-slate-600">
          {selection.note}
        </p>
      ) : null}

      {showExtrasNote && selection?.extraKm != null && !(selection?.distanceKm > 0) ? (
        <ul className="mt-3 space-y-1 rounded-lg border border-slate-100 bg-slate-50/80 p-2.5 text-[11px] text-slate-600">
          <li className="flex justify-between">
            <span>Extra km (if applicable)</span>
            <span className="font-medium">₹{selection.extraKm}/km</span>
          </li>
          <li className="flex justify-between">
            <span>Extra hour (if applicable)</span>
            <span className="font-medium">₹{selection.extraHr}/hr</span>
          </li>
          {selection.note ? <li className="pt-1 text-slate-500">{selection.note}</li> : null}
        </ul>
      ) : null}

      <div className={`mt-4 rounded-xl bg-[#0056D2]/10 ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">Total payable now</span>
          <span className={`font-bold text-[#0056D2] ${compact ? "text-base" : "text-xl"}`}>{inr(total)}</span>
        </div>
        {usesDistance && discountPct > 0 ? (
          <p className="mt-1 text-[10px] text-slate-600">
            ₹{selection.perKmRate}/km × {selection.distanceKm} km = {inr(distanceCharge)} → you pay {inr(total)}
          </p>
        ) : null}
      </div>

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

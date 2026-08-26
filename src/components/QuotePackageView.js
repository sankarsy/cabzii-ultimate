"use client";

import { useEffect, useState } from "react";

function formatINR(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "";
  return `₹${v.toLocaleString("en-IN")}`;
}

export default function QuotePackageView({ quoteRef }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/quote-leads/public/${encodeURIComponent(quoteRef)}`)
      .then((r) => r.json().then((json) => ({ ok: r.ok, json })))
      .then(({ ok, json }) => {
        if (cancelled) return;
        if (!ok) throw new Error(json?.message || "Quote not found");
        setData(json.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Quote not found");
      });
    return () => {
      cancelled = true;
    };
  }, [quoteRef]);

  if (error) {
    return <p className="mx-auto max-w-lg px-4 py-16 text-center text-rose-600">{error}</p>;
  }
  if (!data) {
    return <p className="mx-auto max-w-lg px-4 py-16 text-center text-slate-500">Loading quote…</p>;
  }

  const trip = data.trip || {};
  const pdfHref = `/api/quote-leads/public/${encodeURIComponent(data.quoteRef || quoteRef)}/pdf`;
  const fare = formatINR(trip.estimatedFare);
  const rows = [
    ["Quote ref", data.quoteRef],
    ["Vehicle", trip.vehicleName],
    ["Service", trip.tripType || trip.productType],
    ["Package", trip.packageLabel],
    ["Pickup", trip.pickup],
    ["Drop", trip.drop],
    ["Travel date", trip.travelDate],
    ["Pickup time", trip.pickupTime],
    ["Distance", trip.distanceKm ? `${trip.distanceKm} km` : ""],
    ["Passengers", trip.passengerCount],
    ["Quoted fare", fare]
  ].filter(([, v]) => v);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-sky-600">Cabzii package quote</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{trip.vehicleName || "Trip package"}</h1>
        <p className="mt-1 text-sm text-slate-500">PDF and text details for WhatsApp. This is not a confirmed booking.</p>
        <dl className="mt-5 space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-slate-100 py-1.5">
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-right font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
        <pre className="mt-5 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
          {data.text}
        </pre>
        <a
          href={pdfHref}
          className="mt-5 inline-flex h-11 w-full max-w-xs items-center justify-center rounded-xl bg-[#0056D2] text-sm font-bold text-white hover:bg-[#0047b3]"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}

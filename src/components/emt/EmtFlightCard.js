"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../../lib/emt/cn";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function EmtFlightCard({ flight, searchQuery }) {
  const [expanded, setExpanded] = useState(false);
  const stopsLabel = flight.stops === 0 ? "Non-stop" : flight.stops === 1 ? "1 Stop" : `${flight.stops}+ Stops`;

  const bookHref = `/booking?type=flight&id=${flight.id}&${searchQuery}&step=1`;

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-[var(--emt-shadow-hover)]">
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 lg:w-36">
          <div className="relative h-10 w-10 overflow-hidden rounded bg-slate-50">
            <Image src={flight.airline.logo} alt="" fill sizes="40px" className="object-contain p-1" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{flight.airline.name}</p>
            <p className="text-xs text-slate-500">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
          <div className="text-center">
            <p className="text-lg font-bold">{flight.departure.time}</p>
            <p className="text-xs font-semibold text-slate-600">{flight.departure.airport}</p>
          </div>
          <div className="min-w-[100px] flex-1 text-center text-xs text-slate-500">
            <p>{flight.duration}</p>
            <div className="my-1 border-t border-dashed border-slate-300" />
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium">{stopsLabel}</span>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{flight.arrival.time}</p>
            <p className="text-xs font-semibold text-slate-600">{flight.arrival.airport}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 lg:flex-col lg:border-l lg:border-t-0 lg:pt-0 lg:pl-4">
          <div className="text-right">
            <p className="text-2xl font-extrabold text-slate-900">{formatINR(flight.price)}</p>
            <p className="text-xs text-slate-500">per adult</p>
          </div>
          <Link
            href={bookHref}
            className="rounded-full bg-[var(--emt-primary)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[var(--emt-primary-dark)]"
          >
            Book Now
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-slate-50 px-4 py-2">
        {flight.fareTypes.map((f) => (
          <span
            key={f.label}
            className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600"
          >
            {f.label} {formatINR(f.price)}
          </span>
        ))}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="ml-auto text-xs font-semibold text-[var(--emt-primary)]"
        >
          {expanded ? "Hide details" : "Flight details"}
        </button>
      </div>

      {expanded ? (
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3 text-xs text-slate-600">
          <p>Aircraft: {flight.aircraft}</p>
          <p className="mt-1">Amenities: {flight.amenities.join(" · ")}</p>
          {flight.fareTypes.map((f) => (
            <p key={f.label} className="mt-1">
              <strong>{f.label}:</strong> {f.features.join(" · ")}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}

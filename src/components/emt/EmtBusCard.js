"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Armchair, BedDouble, Clock, MapPin, Star, Wifi, Zap } from "lucide-react";
import { cacheBusTrip } from "../../lib/busCatalog";

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function EmtBusCard({ trip, searchQuery }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const isSleeper = String(trip.busType).toLowerCase().includes("sleeper");
  const seatsHref = `/buses/seats?id=${encodeURIComponent(trip.id)}&${searchQuery}`;

  function goToSeats(e) {
    e.preventDefault();
    cacheBusTrip(trip);
    router.push(seatsHref);
  }

  return (
    <article className="cabzii-card cabzii-card-interactive overflow-hidden">
      <div className="flex flex-col gap-4 cabzii-card-pad lg:flex-row lg:items-stretch">
        <div className="flex items-start gap-3 lg:w-44 lg:flex-col lg:justify-center">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
            {trip.operator?.logo ? (
              <Image src={trip.operator.logo} alt="" fill sizes="44px" className="object-contain p-1.5" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-sky-600">
                {trip.operator?.code || "BUS"}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{trip.operator?.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                {trip.rating}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {trip.busType}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-3 lg:border-y-0 lg:border-x lg:py-0 lg:px-4">
          <div className="text-center">
            <p className="text-xl font-bold tabular-nums text-slate-900">{trip.departure.time}</p>
            <p className="text-xs font-medium text-slate-500">{trip.fromCity}</p>
          </div>
          <div className="min-w-[7rem] flex-1 text-center">
            <p className="inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {trip.duration}
            </p>
            <div className="relative my-2 flex items-center">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-300" />
              <span className="mx-2 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-700">
                {trip.availableSeats} seats
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-300 to-slate-300" />
            </div>
            <p className="text-[10px] text-slate-400">{trip.boardingPoints?.[0]?.name?.split(" ")[0] || "Boarding"} → Drop</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold tabular-nums text-slate-900">{trip.arrival.time}</p>
            <p className="text-xs font-medium text-slate-500">{trip.toCity}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:w-48 lg:flex-col lg:justify-center lg:border-l lg:border-slate-100 lg:pl-4">
          <div className="text-left lg:text-right">
            <p className="text-2xl font-extrabold tabular-nums text-slate-900">{formatINR(trip.fares.seater)}</p>
            <p className="text-xs text-slate-500">onwards · per seat</p>
          </div>
          <Link href={seatsHref} onClick={goToSeats} className="cabzii-btn cabzii-btn-primary cabzii-tap shrink-0 px-5">
            Select seats
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-2.5">
        {isSleeper ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">
            <BedDouble className="h-3 w-3" aria-hidden /> Sleeper from {formatINR(trip.fares.lowerBerth)}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-700">
            <Armchair className="h-3 w-3" aria-hidden /> Seater {formatINR(trip.fares.seater)}
          </span>
        )}
        {trip.amenities?.slice(0, 2).map((a) => (
          <span key={a} className="rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
            {a}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
          <Wifi className="h-3 w-3" aria-hidden /> Live tracking
        </span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="cabzii-tap ml-auto min-h-[var(--cabzii-touch-min)] px-2 text-xs font-semibold text-[var(--cabzii-brand)] hover:underline"
        >
          {expanded ? "Hide stops" : "Boarding & dropping"}
        </button>
      </div>

      {expanded ? (
        <div className="grid gap-4 border-t border-slate-100 bg-white px-4 py-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" aria-hidden /> Boarding points
            </p>
            <ul className="space-y-1.5">
              {(trip.boardingPoints || []).map((p) => (
                <li key={p.name} className="text-xs text-slate-700">
                  <span className="font-bold tabular-nums text-slate-900">{p.time}</span> — {p.name}
                  {p.landmark ? <span className="text-slate-400"> · {p.landmark}</span> : null}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Zap className="h-3.5 w-3.5 text-rose-500" aria-hidden /> Dropping points
            </p>
            <ul className="space-y-1.5">
              {(trip.droppingPoints || []).map((p) => (
                <li key={p.name} className="text-xs text-slate-700">
                  <span className="font-bold tabular-nums text-slate-900">{p.time}</span> — {p.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </article>
  );
}

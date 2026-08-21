"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star, ShieldCheck, ChevronDown } from "lucide-react";
import { cacheBusTrip } from "../../lib/busCatalog";
import { SeatAvailabilityStrip } from "../bus/BusSeatMap";

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export default function EmtBusCard({ trip, searchQuery }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const isSleeper = String(trip.busType).toLowerCase().includes("sleeper") || String(trip.busType).toLowerCase().includes("volvo");
  const seatsHref = `/buses/seats?id=${encodeURIComponent(trip.id)}&${searchQuery}`;
  const listPrice = Math.max(trip.fares.seater, trip.fares.sleeper || 0);
  const fromPrice = Math.min(trip.fares.seater || listPrice, trip.fares.upperBerth || listPrice, trip.fares.lowerBerth || listPrice);
  const low = (trip.availableSeats || 0) <= 9;

  function goToSeats(e) {
    e.preventDefault();
    cacheBusTrip(trip);
    router.push(seatsHref);
  }

  const tags = [
    isSleeper ? "Sleeper (2 + 1)" : "Seater (2 + 2)",
    trip.liveTracking?.enabled !== false ? "Bus Track" : null,
    "Clean & Hygienic",
    Number(trip.rating) >= 4.5 ? "Top Rated" : null
  ].filter(Boolean);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-2 border-b border-sky-100 bg-sky-50 px-4 py-1.5 text-[11px] font-semibold text-sky-800">
        <span className="inline-flex items-center gap-1 rounded bg-sky-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
          <ShieldCheck className="h-3 w-3" /> Cabzii Assured
        </span>
        <span>Clean bus · live tracking · verified operator</span>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_160px] lg:items-center">
        <div className="min-w-0">
          <p className="text-base font-extrabold text-slate-900">{trip.operator?.name}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {trip.busType}
            {isSleeper ? " (2 + 1)" : " (2 + 2)"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
              <Star className="h-3 w-3 fill-white" /> {Number(trip.rating || 0).toFixed(1)}
            </span>
            <span className="text-[11px] text-slate-500">{trip.reviewCount || 0} ratings</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="rounded border border-sky-200 px-1.5 py-0.5 text-[10px] font-semibold text-sky-800">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div>
            <p className="text-xl font-extrabold tabular-nums text-slate-900">{trip.departure.time}</p>
            <p className="text-xs text-slate-500">{trip.fromCity}</p>
          </div>
          <div className="min-w-[5.5rem] flex-1 text-center">
            <p className="text-[11px] text-slate-500">{trip.duration}</p>
            <div className="my-1 h-px bg-slate-200" />
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold tabular-nums text-slate-900">{trip.arrival.time}</p>
            <p className="text-xs text-slate-500">{trip.toCity}</p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-2 lg:items-end">
          <p className="text-lg font-extrabold text-slate-900">From {formatINR(fromPrice)}</p>
          <Link href={seatsHref} onClick={goToSeats} className="rounded-lg bg-[#d84e55] px-4 py-2 text-center text-sm font-bold text-white hover:bg-[#c03940]">
            Select Seats
          </Link>
          <span className={`rounded border px-2 py-0.5 text-center text-[11px] font-bold ${low ? "border-amber-300 bg-amber-50 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
            {trip.availableSeats} {isSleeper ? "Berths" : "Seats"} Left
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">
        <SeatAvailabilityStrip trip={trip} />
        <button type="button" onClick={() => setExpanded(!expanded)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#d84e55]">
          Bus details <ChevronDown className={`h-3.5 w-3.5 transition ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {expanded ? (
        <div className="grid gap-4 border-t border-slate-100 px-4 py-3 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">Boarding points</p>
            <ul className="space-y-1">
              {(trip.boardingPoints || []).map((p) => (
                <li key={p.name} className="text-xs text-slate-700">
                  <span className="font-bold">{p.time}</span> — {p.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase text-slate-500">Dropping points</p>
            <ul className="space-y-1">
              {(trip.droppingPoints || []).map((p) => (
                <li key={p.name} className="text-xs text-slate-700">
                  <span className="font-bold">{p.time}</span> — {p.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </article>
  );
}

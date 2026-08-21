"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  DEFAULT_POLICIES,
  cancellationSlabs,
  defaultRestStops,
  defaultRouteStops,
  livePosition,
  lovedTags,
  ratingBars
} from "../../lib/busExperience";

const TripRouteMap = dynamic(() => import("../maps/TripRouteMap"), { ssr: false });

const TABS = [
  { id: "highlights", label: "Highlights" },
  { id: "cancel", label: "Cancellation policy" },
  { id: "board", label: "Boarding point" },
  { id: "drop", label: "Dropping point" },
  { id: "route", label: "Bus route" },
  { id: "rest", label: "Rest stop" },
  { id: "features", label: "Bus Features" },
  { id: "reviews", label: "Rating and reviews" },
  { id: "track", label: "Live tracking" },
  { id: "policies", label: "Other Policies" }
];

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

function Timeline({ stops, city, empty }) {
  if (!stops?.length) return <p className="text-sm text-slate-500">{empty}</p>;
  return (
    <ol className="relative ml-2 space-y-4 border-l border-slate-200 pl-5">
      {stops.map((s, i) => (
        <li key={`${s.name}-${i}`} className="relative">
          <span className="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-800" />
          <p className="text-xs font-bold tabular-nums text-slate-900">
            {s.time}
            {s.dateLabel ? <span className="ml-1 text-[11px] text-[#d84e55]">{s.dateLabel}</span> : null}
          </p>
          <p className="text-sm font-bold text-slate-900">{s.name}</p>
          {s.landmark ? <p className="text-xs text-slate-500">{s.landmark}</p> : null}
        </li>
      ))}
    </ol>
  );
}

export default function BusInfoPanel({ trip, travelDate }) {
  const [tab, setTab] = useState("cancel");
  const slabs = useMemo(() => cancellationSlabs(trip, travelDate), [trip, travelDate]);
  const restStops = trip?.restStops?.length ? trip.restStops : defaultRestStops(trip?.fromCity);
  const routeStops = trip?.routeStops?.length ? trip.routeStops : defaultRouteStops(trip?.fromCity, trip?.toCity);
  const policies = { ...DEFAULT_POLICIES, ...(trip?.policies || {}) };
  const pos = livePosition(trip);
  const tags = lovedTags(trip);

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-xl border border-slate-200 bg-white">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-2 pt-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 whitespace-nowrap px-3 py-2 text-xs font-semibold ${
              tab === t.id ? "border-b-2 border-[#d84e55] text-[#d84e55]" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 text-sm">
        {tab === "highlights" ? (
          <ul className="space-y-2 text-slate-700">
            <li>{trip?.busType} · {trip?.operator?.name}</li>
            <li>{trip?.availableSeats} seats left · {trip?.duration} journey</li>
            <li>Live tracking and boarding alerts on Cabzii</li>
            {(trip?.amenities || []).slice(0, 6).map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        ) : null}

        {tab === "cancel" ? (
          <div>
            <h3 className="mb-3 font-bold text-slate-900">Cancellation policy</h3>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="pb-2 font-semibold">Time before travel</th>
                  <th className="pb-2 font-semibold">Refund</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((row) => (
                  <tr key={row.hoursBefore} className="border-t border-slate-100">
                    <td className="py-2 pr-3 text-slate-800">{row.label}</td>
                    <td className="py-2 font-bold text-slate-900">{row.refundPercent}% Refund</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-500">
              <li>Cancellation is per seat, on the base fare ({formatINR(trip?.fares?.sleeper || trip?.fares?.seater)}).</li>
              <li>Calculated from service start time ({trip?.departure?.time}).</li>
              <li>No cancellation after departure. GST is excluded from refunds.</li>
            </ul>
          </div>
        ) : null}

        {tab === "board" ? (
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-bold text-slate-900">Boarding point</h3>
              <span className="text-xs text-slate-500">{trip?.fromCity}</span>
            </div>
            <Timeline stops={trip?.boardingPoints} empty="No boarding points yet — add them in Admin → Buses." />
          </div>
        ) : null}

        {tab === "drop" ? (
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-bold text-slate-900">Dropping point</h3>
              <span className="text-xs text-slate-500">{trip?.toCity}</span>
            </div>
            <Timeline stops={trip?.droppingPoints} empty="No dropping points yet — add them in Admin → Buses." />
          </div>
        ) : null}

        {tab === "route" ? (
          <div>
            <p className="mb-3 text-sm font-semibold text-slate-800">
              {(trip?.distanceKm || 0) > 0 ? `${trip.distanceKm} km` : "Intercity"} · {trip?.duration}
            </p>
            <p className="text-sm leading-7 text-slate-700">
              {routeStops.map((name, i) => (
                <span key={`${name}-${i}`}>
                  <span className={i === 0 || i === routeStops.length - 1 ? "rounded bg-amber-100 px-1 font-semibold" : ""}>{name}</span>
                  {i < routeStops.length - 1 ? " → " : ""}
                </span>
              ))}
            </p>
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-sm font-bold text-emerald-900">Highly On Time</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">{trip?.onTimePercent ?? 86}%</p>
              <p className="text-xs text-emerald-800">
                {trip?.onTimeTrips ?? 957} of {trip?.onTimeTotal ?? 1113} past trips in the last 15 days.
              </p>
            </div>
          </div>
        ) : null}

        {tab === "rest" ? (
          <ul className="space-y-4">
            {restStops.map((s) => (
              <li key={s.name}>
                <p className="font-bold text-slate-900">{s.name}</p>
                <p className="text-xs text-[#d84e55]">
                  {s.time || "Night halt"} · {s.durationMin || 15} Mins stop
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(s.features || ["Safety"]).map((f) => (
                    <span key={f} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                      {f}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {tab === "features" ? (
          <div>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {["Washroom Hygiene", "Food Quality", "Safety"].map((f) => (
                <span key={f} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  {f}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(trip?.amenities || []).map((a) => (
                <p key={a} className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800">
                  {a}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "reviews" ? (
          <div>
            <p className="text-2xl font-extrabold text-emerald-600">★ {Number(trip?.rating || 4.9).toFixed(1)}</p>
            <p className="text-xs text-slate-500">{trip?.reviewCount || 0} Ratings · Real feedback from verified travellers</p>
            <div className="mt-3 space-y-1">
              {ratingBars().map(([star, pct]) => (
                <div key={star} className="flex items-center gap-2 text-[11px]">
                  <span className="w-6 text-slate-500">{star}★</span>
                  <div className="h-1.5 flex-1 rounded bg-slate-100">
                    <div className="h-1.5 rounded bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-slate-500">{pct}%</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-bold text-slate-700">Loved by travelers</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map(([name, n]) => (
                <span key={name} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                  {name} ({n})
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "track" ? (
          <div>
            <h3 className="mb-2 font-bold text-slate-900">Live tracking</h3>
            {trip?.liveTracking?.enabled === false ? (
              <p className="text-sm text-slate-500">Tracking is switched off for this bus in admin.</p>
            ) : pos ? (
              <>
                <p className="mb-2 text-xs text-slate-600">
                  {pos.source === "admin" ? "Operator GPS" : "Estimated on route"} · {pos.status === "on_time" ? "On time" : pos.status}
                </p>
                <TripRouteMap
                  fromLat={pos.lat}
                  fromLng={pos.lng}
                  toLat={cityFallback(trip?.toCity, pos).lat}
                  toLng={cityFallback(trip?.toCity, pos).lng}
                  className="h-52 w-full rounded-xl"
                />
                <p className="mt-2 text-[11px] text-slate-500">Set exact lat/lng in Admin → Buses to pin the live location. Customers see this after the bus starts.</p>
              </>
            ) : (
              <p className="text-sm text-slate-500">Tracking starts after departure. Add from/to cities or GPS in admin.</p>
            )}
          </div>
        ) : null}

        {tab === "policies" ? (
          <dl className="space-y-3">
            <div>
              <dt className="font-bold text-slate-900">Luggage policy</dt>
              <dd className="text-xs text-slate-600">{policies.luggage}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900">Pets policy</dt>
              <dd className="text-xs text-slate-600">{policies.pets}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900">Liquor policy</dt>
              <dd className="text-xs text-slate-600">{policies.liquor}</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900">Pick up time policy</dt>
              <dd className="text-xs text-slate-600">{policies.pickupTime}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </div>
  );
}

function cityFallback(name, pos) {
  const map = {
    chennai: { lat: 13.0827, lng: 80.2707 },
    coimbatore: { lat: 11.0168, lng: 76.9558 },
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    madurai: { lat: 9.9252, lng: 78.1198 },
    tirupati: { lat: 13.6288, lng: 79.4192 }
  };
  const hit = map[String(name || "").toLowerCase()];
  return hit || { lat: pos.lat + 0.4, lng: pos.lng - 0.4 };
}

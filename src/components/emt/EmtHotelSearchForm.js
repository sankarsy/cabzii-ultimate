"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ChevronDownIcon } from "../icons";
import { todayStr } from "../../lib/mmtTrip";
import { addDays, formatDayName, formatEmtDate } from "../../lib/emt/heroDates";
import { EmtHeroPriceHint } from "./EmtHeroPills";

export default function EmtHotelSearchForm({ emtHero = false }) {
  const router = useRouter();
  const [city, setCity] = useState("Bangalore");
  const [country] = useState("India");
  const [checkIn, setCheckIn] = useState(todayStr());
  const [checkOut, setCheckOut] = useState(addDays(todayStr(), 1));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);

  function search() {
    const q = new URLSearchParams({
      city: city.trim(),
      checkIn,
      checkOut,
      rooms: String(rooms),
      guests: String(guests)
    });
    router.push(`/hotels?${q.toString()}`);
  }

  if (emtHero) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-end">
          <EmtHeroPriceHint>Same hotel, Cheapest price. Guaranteed!</EmtHeroPriceHint>
        </div>

        <div className="emt-hero-search-card">
          <div className="emt-search-wrap emt-search-wrap-hotels">
            <div className="emt-search-bar emt-search-bar-hotels">
              <div className="cabzii-search-cell sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Enter City Name, Location, or Specific hotel
                </span>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bangalore"
                  className="w-full min-w-0 border-0 bg-transparent text-base font-bold text-slate-900 focus:outline-none sm:text-xl"
                />
                <span className="text-xs text-slate-500">{country}</span>
              </div>

              <div className="cabzii-search-cell">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Check-In</span>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute right-0 top-2 h-4 w-4 text-slate-400" aria-hidden />
                  <p className="truncate text-base font-bold text-slate-900 sm:text-xl">{formatEmtDate(checkIn)}</p>
                  <p className="text-xs text-slate-500">{formatDayName(checkIn)}</p>
                  <input
                    type="date"
                    value={checkIn}
                    min={todayStr()}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="emt-date-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Check-in date"
                  />
                </div>
              </div>

              <div className="cabzii-search-cell">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Check-Out</span>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute right-0 top-2 h-4 w-4 text-slate-400" aria-hidden />
                  <p className="truncate text-base font-bold text-slate-900 sm:text-xl">{formatEmtDate(checkOut)}</p>
                  <p className="text-xs text-slate-500">{formatDayName(checkOut)}</p>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || todayStr()}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="emt-date-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Check-out date"
                  />
                </div>
              </div>

              <div className="cabzii-search-cell relative">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rooms &amp; Guests</span>
                <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:right-5" aria-hidden />
                <p className="truncate text-base font-bold text-slate-900 sm:text-xl">
                  {rooms} Room{rooms > 1 ? "s" : ""} {guests} Guest{guests > 1 ? "s" : ""}
                </p>
                <div className="mt-1 flex gap-2">
                  <select
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="min-w-0 cursor-pointer appearance-none border-0 bg-transparent pr-4 text-xs font-semibold text-slate-500 focus:outline-none"
                    aria-label="Rooms"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Room{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="min-w-0 cursor-pointer appearance-none border-0 bg-transparent pr-4 text-xs font-semibold text-slate-500 focus:outline-none"
                    aria-label="Guests"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Guest{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button type="button" onClick={search} className="emt-search-submit cabzii-tap">
              SEARCH
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <label className="emt-hotel-filter cabzii-tap">
              <input type="checkbox" className="accent-[#2196f3]" />
              Last Minute Deals
            </label>
            <label className="emt-hotel-filter cabzii-tap">
              <input type="checkbox" className="accent-[#2196f3]" />
              Lowest Price Guarantee
            </label>
          </div>
          <Link href="/hotels" className="text-xs font-bold text-white/95 hover:underline">
            Browse all hotels →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="emt-search-label">City / Hotel</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Goa, Mumbai, Bengaluru…"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="emt-search-label">Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={todayStr()}
            onChange={(e) => setCheckIn(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="emt-search-label">Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || todayStr()}
            onChange={(e) => setCheckOut(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          />
        </div>
        <div>
          <label className="emt-search-label">Rooms</label>
          <select
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} Room{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="emt-search-label">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Guest{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={search}
        className="rounded-full bg-[var(--emt-primary)] px-12 py-3 text-base font-bold text-white shadow-md hover:bg-[var(--emt-primary-dark)]"
      >
        Search Hotels
      </button>
    </div>
  );
}

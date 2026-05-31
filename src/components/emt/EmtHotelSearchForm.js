"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { todayStr } from "../../lib/mmtTrip";

function addDays(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function EmtHotelSearchForm() {
  const router = useRouter();
  const [city, setCity] = useState("Goa");
  const [checkIn, setCheckIn] = useState(todayStr());
  const [checkOut, setCheckOut] = useState(addDays(todayStr(), 2));
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

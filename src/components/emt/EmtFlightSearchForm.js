"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmtAirportInput from "./EmtAirportInput";
import { todayStr } from "../../lib/mmtTrip";

export default function EmtFlightSearchForm() {
  const router = useRouter();
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [fromLabel, setFromLabel] = useState("New Delhi (DEL)");
  const [toLabel, setToLabel] = useState("Mumbai (BOM)");
  const [date, setDate] = useState(todayStr());
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState("economy");
  const [error, setError] = useState("");

  function swap() {
    setFrom(to);
    setTo(from);
    setFromLabel(toLabel);
    setToLabel(fromLabel);
  }

  function search() {
    setError("");
    if (!from || !to) {
      setError("Select origin and destination.");
      return;
    }
    if (from === to) {
      setError("Origin and destination must differ.");
      return;
    }
    const q = new URLSearchParams({
      from,
      to,
      date,
      adults: String(adults),
      children: "0",
      infants: "0",
      class: travelClass,
      tripType
    });
    if (tripType === "roundtrip" && returnDate) q.set("returnDate", returnDate);
    router.push(`/flights?${q.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Trip type">
        {[
          { id: "oneway", label: "One-way" },
          { id: "roundtrip", label: "Round trip" },
          { id: "multicity", label: "Multi-city" }
        ].map((t) => (
          <label key={t.id} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
            <input
              type="radio"
              name="tripType"
              checked={tripType === t.id}
              onChange={() => setTripType(t.id)}
              className="accent-[var(--emt-primary)]"
            />
            {t.label}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
        <EmtAirportInput
          label="From"
          value={fromLabel}
          onChange={(code, display) => {
            if (code) setFrom(code);
            if (display) setFromLabel(display);
          }}
        />
        <button
          type="button"
          onClick={swap}
          className="mx-auto flex h-10 w-10 items-center justify-center self-end rounded-full border border-slate-200 bg-white text-lg hover:bg-slate-50"
          aria-label="Swap cities"
        >
          ⇄
        </button>
        <EmtAirportInput
          label="To"
          value={toLabel}
          onChange={(code, display) => {
            if (code) setTo(code);
            if (display) setToLabel(display);
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="emt-search-label">Departure</label>
          <input
            type="date"
            value={date}
            min={todayStr()}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          />
        </div>
        {tripType === "roundtrip" ? (
          <div>
            <label className="emt-search-label">Return</label>
            <input
              type="date"
              value={returnDate}
              min={date || todayStr()}
              onChange={(e) => setReturnDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
            />
          </div>
        ) : null}
        <div>
          <label className="emt-search-label">Travellers</label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Adult{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="emt-search-label">Class</label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        type="button"
        onClick={search}
        className="w-full rounded-full bg-[var(--emt-primary)] py-3 text-base font-bold text-white shadow-md transition hover:bg-[var(--emt-primary-dark)] sm:w-auto sm:px-12"
      >
        Search Flights
      </button>
    </div>
  );
}

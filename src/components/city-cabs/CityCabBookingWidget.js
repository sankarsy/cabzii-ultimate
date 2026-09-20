"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { tripToSearchQuery } from "../../lib/mmtTrip";
import { useTodayStr } from "../../lib/useTodayStr";

const TRIP_TYPES = [
  { id: "one-way", label: "One-way" },
  { id: "round-trip", label: "Round-trip" },
  { id: "airport", label: "Airport" },
  { id: "local", label: "Local" }
];

function toEngineTrip({ tripKind, from, to, date, cityName }) {
  if (tripKind === "airport") {
    return { tripType: "airport", from, to, date, time: "09:00", roundTrip: false, city: cityName, direction: "pickup" };
  }
  if (tripKind === "local") {
    return { tripType: "hourly", from, to: cityName, date, time: "09:00", roundTrip: false, city: cityName, packageHours: 8 };
  }
  return {
    tripType: "outstation",
    from,
    to,
    date,
    time: "09:00",
    roundTrip: tripKind === "round-trip",
    city: cityName
  };
}

export default function CityCabBookingWidget({ cityName, defaultFrom, airportLabel }) {
  const router = useRouter();
  const today = useTodayStr();
  const [tripKind, setTripKind] = useState("one-way");
  const [from, setFrom] = useState(defaultFrom || cityName);
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (today) setDate((prev) => prev || today);
  }, [today]);

  const needsDrop = tripKind !== "local";

  function handleSearch(event) {
    event.preventDefault();
    setError("");
    const pickup = from.trim();
    const drop = to.trim();
    if (!pickup) {
      setError("Enter a pickup location.");
      return;
    }
    if (needsDrop && !drop) {
      setError(tripKind === "airport" ? "Enter the airport or city drop." : "Enter a destination.");
      return;
    }
    const trip = toEngineTrip({
      tripKind,
      from: pickup,
      to: drop || cityName,
      date: date || today,
      cityName
    });
    router.push(`/cabs/results?${tripToSearchQuery(trip).toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-5"
      aria-label={`Book a cab in ${cityName}`}
    >
      <p className="text-sm font-semibold text-slate-800">Book a cab in {cityName}</p>
      <p className="mt-1 text-xs text-slate-500">One-way, round-trip, airport or local. Fares show before you pay.</p>

      <fieldset className="mt-3">
        <legend className="sr-only">Trip type</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TRIP_TYPES.map((type) => (
            <label
              key={type.id}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-2 text-xs font-semibold ${
                tripKind === type.id
                  ? "border-[var(--cabzii-brand)] bg-[var(--cabzii-brand)] text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <input
                type="radio"
                name="trip-type"
                value={type.id}
                checked={tripKind === type.id}
                onChange={() => setTripKind(type.id)}
                className="sr-only"
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <PlaceAutocomplete
          label="From"
          placeholder={tripKind === "airport" ? airportLabel || `${cityName} airport` : `Pickup in ${cityName}`}
          value={from}
          onChange={setFrom}
        />
        {needsDrop ? (
          <PlaceAutocomplete
            label="To"
            placeholder={tripKind === "airport" ? "City or terminal drop" : "Destination city"}
            value={to}
            onChange={setTo}
          />
        ) : (
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Local package</label>
            <p className="mt-2 text-sm font-semibold text-slate-800">Full-day 8 Hrs / 80 Km</p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <label htmlFor="city-cab-date" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Date
        </label>
        <input
          id="city-cab-date"
          type="date"
          min={today || undefined}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-900"
        />
      </div>

      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}

      <button
        type="submit"
        className="mt-4 min-h-11 w-full rounded-xl bg-[var(--cabzii-brand)] px-4 text-sm font-semibold text-white hover:bg-[var(--cabzii-brand-hover)]"
      >
        Search {cityName} cabs
      </button>
    </form>
  );
}

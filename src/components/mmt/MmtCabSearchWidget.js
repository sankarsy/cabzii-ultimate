"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, MapPinIcon, MapPinnedIcon, SearchIcon } from "../icons";
import { HOURLY_PACKAGES, todayStr, tripToSearchQuery } from "../../lib/mmtTrip";
import { writeSelectedCity } from "../../lib/locationPriority";

const TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly Rentals" },
  { id: "local", label: "Local" }
];

export default function MmtCabSearchWidget({ defaultCity = "" }) {
  const router = useRouter();
  const [tripType, setTripType] = useState("outstation");
  const [roundTrip, setRoundTrip] = useState(false);
  const [pickup, setPickup] = useState(defaultCity);
  const [drop, setDrop] = useState("");
  const [airportDirection, setAirportDirection] = useState("pickup");
  const [packageHours, setPackageHours] = useState(8);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState(null);

  function handleSearch() {
    setError(null);
    const trip = { tripType, date, time, roundTrip, direction: airportDirection, packageHours };

    if (tripType === "outstation" || tripType === "local") {
      if (!pickup.trim()) {
        setError("Enter pickup location.");
        return;
      }
      if (tripType === "outstation" && !drop.trim()) {
        setError("Enter drop location.");
        return;
      }
      trip.from = pickup.trim();
      trip.to = drop.trim();
    } else if (tripType === "airport") {
      if (!pickup.trim() || !drop.trim()) {
        setError("Enter airport and city locations.");
        return;
      }
      if (airportDirection === "pickup") {
        trip.from = pickup.trim();
        trip.to = drop.trim();
      } else {
        trip.from = drop.trim();
        trip.to = pickup.trim();
      }
    } else {
      if (!pickup.trim()) {
        setError("Enter city.");
        return;
      }
      trip.from = pickup.trim();
    }

    router.push(`/cabs/results?${tripToSearchQuery(trip).toString()}`);
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {TRIP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tripType === tab.id
                ? "bg-[var(--emt-primary)] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tripType === "outstation" ? (
        <div className="mt-4 flex gap-4">
          {[
            { id: false, label: "One Way" },
            { id: true, label: "Round Trip" }
          ].map((opt) => (
            <label key={String(opt.id)} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="radio"
                name="roundtrip"
                checked={roundTrip === opt.id}
                onChange={() => setRoundTrip(opt.id)}
                className="size-4 accent-[var(--emt-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : null}

      {tripType === "airport" ? (
        <div className="mt-4 flex flex-wrap gap-4">
          {[
            { id: "pickup", label: "Pickup from Airport" },
            { id: "drop", label: "Drop to Airport" }
          ].map((opt) => (
            <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="radio"
                name="airportdir"
                checked={airportDirection === opt.id}
                onChange={() => setAirportDirection(opt.id)}
                className="size-4 accent-[var(--emt-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {tripType === "hourly" ? (
          <>
            <div className="bg-white p-3 sm:p-4">
              <PlaceAutocomplete
                label="City"
                placeholder="Pickup city or area"
                value={pickup}
                onChange={setPickup}
                onResolved={(area) => {
                  if (area?.city) writeSelectedCity(area.city);
                }}
                leadingIcon={MapPinIcon}
                leadingIconClassName="text-emerald-600"
              />
            </div>
            <div className="flex flex-col justify-center gap-1 bg-white p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Package</span>
              <select
                value={packageHours}
                onChange={(e) => setPackageHours(Number(e.target.value))}
                className="bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
              >
                {HOURLY_PACKAGES.map((p) => (
                  <option key={p.hours} value={p.hours}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : tripType === "airport" ? (
          <>
            <div className="bg-white p-3 sm:p-4">
              <PlaceAutocomplete
                label="Airport"
                placeholder="Airport name"
                value={pickup}
                onChange={setPickup}
                leadingIcon={MapPinIcon}
                leadingIconClassName="text-sky-600"
              />
            </div>
            <div className="bg-white p-3 sm:p-4">
              <PlaceAutocomplete
                label="City"
                placeholder="City / area"
                value={drop}
                onChange={setDrop}
                onResolved={(area) => {
                  if (area?.city) writeSelectedCity(area.city);
                }}
                leadingIcon={MapPinnedIcon}
                leadingIconClassName="text-rose-600"
              />
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-3 sm:p-4">
              <PlaceAutocomplete
                label="From"
                placeholder="Pickup location"
                value={pickup}
                onChange={setPickup}
                onResolved={(area) => {
                  if (area?.city) writeSelectedCity(area.city);
                }}
                leadingIcon={MapPinIcon}
                leadingIconClassName="text-emerald-600"
              />
            </div>
            {tripType === "outstation" ? (
              <div className="bg-white p-3 sm:p-4">
                <PlaceAutocomplete
                  label="To"
                  placeholder="Drop location"
                  value={drop}
                  onChange={setDrop}
                  leadingIcon={MapPinnedIcon}
                  leadingIconClassName="text-rose-600"
                />
              </div>
            ) : null}
          </>
        )}

        <div className="flex flex-col justify-center gap-1 bg-white p-4">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Pickup Date</label>
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="date"
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-0 bg-transparent pl-7 text-lg font-bold text-slate-900 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1 bg-white p-4">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Pickup Time</label>
          <div className="relative">
            <ClockIcon className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border-0 bg-transparent pl-7 text-lg font-bold text-slate-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--emt-primary)] px-12 py-3 text-base font-bold text-white shadow-md transition hover:bg-[var(--emt-primary-dark)]"
        >
          <SearchIcon className="h-6 w-6" />
          Search Cabs
        </button>
      </div>
    </div>
  );
}

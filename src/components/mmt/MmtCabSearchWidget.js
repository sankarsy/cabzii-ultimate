"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, MapPinIcon, MapPinnedIcon, SearchIcon } from "../icons";
import { applyDistanceToTrip, fetchTripDistance } from "../../lib/fetchTripDistance";
import { coordsForPlaceLabel } from "../../lib/indiaCityCoords";
import { HOURLY_PACKAGES, todayStr, tripNeedsDrop, tripToSearchQuery } from "../../lib/mmtTrip";
import { writeSelectedCity } from "../../lib/locationPriority";

const TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly Rentals" },
  { id: "local", label: "Local" }
];

export default function MmtCabSearchWidget({ defaultCity = "", initialTrip = null }) {
  const router = useRouter();
  const [tripType, setTripType] = useState("outstation");
  const [roundTrip, setRoundTrip] = useState(false);
  const [pickup, setPickup] = useState(defaultCity);
  const [drop, setDrop] = useState("");
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [airportDirection, setAirportDirection] = useState("pickup");
  const [packageHours, setPackageHours] = useState(8);
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!initialTrip?.from?.trim()) return;
    setTripType(initialTrip.tripType || "outstation");
    setRoundTrip(Boolean(initialTrip.roundTrip));
    setPickup(initialTrip.from);
    setDrop(initialTrip.to || "");
    setAirportDirection(initialTrip.direction || "pickup");
    setPackageHours(initialTrip.packageHours || 8);
    setDate(initialTrip.date || todayStr());
    setTime(initialTrip.time || "09:00");
    setFromCoords(
      initialTrip.fromLat != null ? { lat: initialTrip.fromLat, lng: initialTrip.fromLng } : null
    );
    setToCoords(initialTrip.toLat != null ? { lat: initialTrip.toLat, lng: initialTrip.toLng } : null);
  }, [initialTrip]);

  function fillCityCoords(trip) {
    if (!trip.fromLat && trip.from) {
      const hit = coordsForPlaceLabel(trip.from);
      if (hit) {
        trip.fromLat = hit.lat;
        trip.fromLng = hit.lng;
      }
    }
    if (!trip.toLat && trip.to) {
      const hit = coordsForPlaceLabel(trip.to);
      if (hit) {
        trip.toLat = hit.lat;
        trip.toLng = hit.lng;
      }
    }
    return trip;
  }

  async function handleSearch() {
    setError(null);
    let trip = { tripType, date, time, roundTrip, direction: airportDirection, packageHours };

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
      if (fromCoords?.lat != null) trip.fromLat = fromCoords.lat;
      if (fromCoords?.lng != null) trip.fromLng = fromCoords.lng;
      if (toCoords?.lat != null) trip.toLat = toCoords.lat;
      if (toCoords?.lng != null) trip.toLng = toCoords.lng;
    } else if (tripType === "airport") {
      if (!pickup.trim() || !drop.trim()) {
        setError("Enter airport and city locations.");
        return;
      }
      if (airportDirection === "pickup") {
        trip.from = pickup.trim();
        trip.to = drop.trim();
        if (fromCoords?.lat != null) trip.fromLat = fromCoords.lat;
        if (fromCoords?.lng != null) trip.fromLng = fromCoords.lng;
        if (toCoords?.lat != null) trip.toLat = toCoords.lat;
        if (toCoords?.lng != null) trip.toLng = toCoords.lng;
      } else {
        trip.from = drop.trim();
        trip.to = pickup.trim();
        if (toCoords?.lat != null) trip.fromLat = toCoords.lat;
        if (toCoords?.lng != null) trip.fromLng = toCoords.lng;
        if (fromCoords?.lat != null) trip.toLat = fromCoords.lat;
        if (fromCoords?.lng != null) trip.toLng = fromCoords.lng;
      }
    } else {
      if (!pickup.trim()) {
        setError("Enter city.");
        return;
      }
      trip.from = pickup.trim();
      if (fromCoords?.lat != null) trip.fromLat = fromCoords.lat;
      if (fromCoords?.lng != null) trip.fromLng = fromCoords.lng;
    }

    trip = fillCityCoords(trip);

    if (tripNeedsDrop(trip.tripType) && trip.from && trip.to) {
      setSearching(true);
      try {
        trip = applyDistanceToTrip(trip, await fetchTripDistance(trip));
      } catch {
        /* navigate without distance — results page will retry */
      } finally {
        setSearching(false);
      }
    }

    router.push(`/cabs/results?${tripToSearchQuery(trip).toString()}`);
  }

  return (
    <div className="w-full">
      <div className="hero-tabs-scroll -mx-0.5 flex gap-2 overflow-x-auto pb-4">
        {TRIP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={`cabzii-chip cabzii-tap ${tripType === tab.id ? "cabzii-chip-active" : ""}`}
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

      <div className="cabzii-search-grid">
        {tripType === "hourly" ? (
          <>
            <div className="cabzii-search-cell">
              <PlaceAutocomplete
                label="City"
                placeholder="Pickup city or area"
                value={pickup}
                onChange={setPickup}
                onResolved={(area) => {
                  setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                  if (area?.city) writeSelectedCity(area.city);
                }}
                leadingIcon={MapPinIcon}
                leadingIconClassName="text-emerald-600"
              />
            </div>
            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Package</span>
              <select
                value={packageHours}
                onChange={(e) => setPackageHours(Number(e.target.value))}
                className="cabzii-field -mx-1 w-full rounded-lg border-0 bg-transparent text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
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
            <div className="cabzii-search-cell">
              <PlaceAutocomplete
                label="Airport"
                placeholder="Airport name"
                value={pickup}
                onChange={setPickup}
                onResolved={(area) => {
                  setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                }}
                leadingIcon={MapPinIcon}
                leadingIconClassName="text-sky-600"
              />
            </div>
            <div className="cabzii-search-cell">
              <PlaceAutocomplete
                label="City"
                placeholder="City / area"
                value={drop}
                onChange={setDrop}
                onResolved={(area) => {
                  setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                  if (area?.city) writeSelectedCity(area.city);
                }}
                leadingIcon={MapPinnedIcon}
                leadingIconClassName="text-rose-600"
              />
            </div>
          </>
        ) : (
          <>
            <div className="cabzii-search-cell">
              <PlaceAutocomplete
                label="From"
                placeholder="Pickup location"
                value={pickup}
                onChange={setPickup}
                onResolved={(area) => {
                  setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                  if (area?.city) writeSelectedCity(area.city);
                }}
                leadingIcon={MapPinIcon}
                leadingIconClassName="text-emerald-600"
              />
            </div>
            {tripType === "outstation" ? (
              <div className="cabzii-search-cell">
                <PlaceAutocomplete
                  label="To"
                  placeholder="Drop location"
                  value={drop}
                  onChange={setDrop}
                  onResolved={(area) => {
                    setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                  }}
                  leadingIcon={MapPinnedIcon}
                  leadingIconClassName="text-rose-600"
                />
              </div>
            ) : null}
          </>
        )}

        <div className="cabzii-search-cell">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup Date</label>
          <div className="relative">
            <CalendarIcon className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="date"
              min={todayStr()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-full min-w-0 border-0 bg-transparent pl-7 pr-1 text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
            />
          </div>
        </div>
        <div className="cabzii-search-cell">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup Time</label>
          <div className="relative">
            <ClockIcon className="pointer-events-none absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full max-w-full min-w-0 border-0 bg-transparent pl-7 pr-1 text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
            />
          </div>
        </div>
      </div>

      {error ? <p className="cabzii-error mt-4" role="alert">{error}</p> : null}

      <div className="mt-5 flex justify-stretch sm:mt-6 sm:justify-center">
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="cabzii-btn cabzii-btn-primary cabzii-btn-lg w-full sm:w-auto sm:min-w-[220px]"
        >
          <SearchIcon className="h-5 w-5" />
          {searching ? "Calculating distance…" : "Search Cabs"}
        </button>
      </div>
    </div>
  );
}

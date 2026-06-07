"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, MapPinIcon, MapPinnedIcon, SearchIcon } from "../icons";
import {
  DRIVER_HOURLY_PACKAGES,
  DRIVER_TRIP_TABS,
  driverTripNeedsDrop,
  driverTripToSearchQuery,
  packageIdFromTrip,
  todayStr
} from "../../lib/driverTrip";
import { applyDistanceToTrip, fetchTripDistance } from "../../lib/fetchTripDistance";
import { coordsForPlaceLabel } from "../../lib/indiaCityCoords";
import { writeSelectedCity } from "../../lib/locationPriority";

export default function MmtDriverSearchWidget({ defaultCity = "", initialTrip = null }) {
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

    trip.packageId = packageIdFromTrip(trip);
    trip.city = trip.from.split(",")[0];
    trip = fillCityCoords(trip);

    if (driverTripNeedsDrop(trip.tripType) && trip.from && trip.to) {
      setSearching(true);
      try {
        trip = applyDistanceToTrip(trip, await fetchTripDistance(trip));
      } catch {
        /* results page will retry */
      } finally {
        setSearching(false);
      }
    }

    router.push(`/drivers/results?${driverTripToSearchQuery(trip).toString()}`);
  }

  return (
    <div className="w-full">
      <div className="hero-tabs-scroll -mx-1 flex gap-2 overflow-x-auto border-b border-slate-200 px-1 pb-3">
        {DRIVER_TRIP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
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
                name="driver-roundtrip"
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
                name="driver-airportdir"
                checked={airportDirection === opt.id}
                onChange={() => setAirportDirection(opt.id)}
                className="size-4 accent-[var(--emt-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-px overflow-visible rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {tripType === "hourly" ? (
          <>
            <div className="bg-white p-3 sm:p-4">
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
            <div className="flex flex-col justify-center gap-1 bg-white p-4">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Package</span>
              <select
                value={packageHours}
                onChange={(e) => setPackageHours(Number(e.target.value))}
                className="bg-transparent text-lg font-bold text-slate-900 focus:outline-none"
              >
                {DRIVER_HOURLY_PACKAGES.map((p) => (
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
                onResolved={(area) => {
                  setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                }}
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
            <div className="bg-white p-3 sm:p-4">
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
              <div className="bg-white p-3 sm:p-4">
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

      <div className="mt-5 flex justify-stretch sm:mt-6 sm:justify-center">
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--emt-primary)] px-8 py-3 text-base font-bold text-white shadow-md transition hover:bg-[var(--emt-primary-dark)] disabled:opacity-70 sm:w-auto sm:px-12"
        >
          <SearchIcon className="h-6 w-6" />
          {searching ? "Calculating distance…" : "Search Drivers"}
        </button>
      </div>
    </div>
  );
}

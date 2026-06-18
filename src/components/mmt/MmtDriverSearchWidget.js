"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, SearchIcon, TwoWayIcon } from "../icons";
import { SEARCH_FIELD_ICON_CHIPS, SEARCH_FIELD_ICONS } from "../icons/heroIcons";
import EmtHeroPills, { EmtHeroPriceHint } from "../emt/EmtHeroPills";
import { formatEmtDate, formatTime12 } from "../../lib/emt/heroDates";
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

const HERO_DRIVER_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport Transfer" },
  { id: "hourly", label: "Hourly" }
];

export default function MmtDriverSearchWidget({
  defaultCity = "",
  initialTrip = null,
  emtLayout = false,
  heroMode = false
}) {
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

  function swapLocations() {
    setPickup(drop);
    setDrop(pickup);
    setFromCoords(toCoords);
    setToCoords(fromCoords);
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

  const dateTimeCell = heroMode ? (
    <div className="cabzii-search-cell">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pick-up Date &amp; Time</span>
      <div className="relative">
        <p className="truncate text-base font-bold text-slate-900 sm:text-xl">{formatEmtDate(date)}</p>
        <p className="text-sm font-medium text-slate-500">{formatTime12(time)}</p>
        <input
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="emt-date-input absolute inset-x-0 top-0 h-1/2 cursor-pointer opacity-0"
          aria-label="Pickup date"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="emt-date-input absolute inset-x-0 bottom-0 h-1/2 cursor-pointer opacity-0"
          aria-label="Pickup time"
        />
      </div>
    </div>
  ) : (
    <>
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
    </>
  );

  const locationFields =
    tripType === "hourly" ? (
      <>
        <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
          <PlaceAutocomplete
            label="City"
            placeholder="Pickup city or area"
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
            leadingIcon={SEARCH_FIELD_ICONS.pickup}
            leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
          />
        </div>
        <div className={heroMode ? "cabzii-search-cell" : "flex flex-col justify-center gap-1 bg-white p-4"}>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Package</span>
          <select
            value={packageHours}
            onChange={(e) => setPackageHours(Number(e.target.value))}
            className="w-full border-0 bg-transparent text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
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
        <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
          <PlaceAutocomplete
            label={heroMode ? "From (Pick-up)" : "Airport"}
            placeholder={heroMode ? "Enter Airport" : "Airport name"}
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
            }}
            leadingIcon={SEARCH_FIELD_ICONS.airport}
            leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.airport}
          />
        </div>
        {heroMode ? (
          <div className="emt-search-swap-cell hidden lg:flex">
            <button type="button" onClick={swapLocations} className="emt-search-swap-btn" aria-label="Swap locations">
              <TwoWayIcon className="h-4 w-4" />
            </button>
          </div>
        ) : null}
        <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
          <PlaceAutocomplete
            label={heroMode ? "To (Drop-off)" : "City"}
            placeholder={heroMode ? "Enter Drop Location" : "City / area"}
            value={drop}
            onChange={setDrop}
            onResolved={(area) => {
              setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
            leadingIcon={SEARCH_FIELD_ICONS.drop}
            leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
          />
        </div>
      </>
    ) : (
      <>
        <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
          <PlaceAutocomplete
            label="From"
            placeholder="Pickup location"
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
            leadingIcon={SEARCH_FIELD_ICONS.pickup}
            leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
          />
        </div>
        {tripType === "outstation" ? (
          <>
            {heroMode ? (
              <div className="emt-search-swap-cell hidden lg:flex">
                <button type="button" onClick={swapLocations} className="emt-search-swap-btn" aria-label="Swap locations">
                  <TwoWayIcon className="h-4 w-4" />
                </button>
              </div>
            ) : null}
            <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
              <PlaceAutocomplete
                label="To"
                placeholder="Drop location"
                value={drop}
                onChange={setDrop}
                onResolved={(area) => {
                  setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                }}
                leadingIcon={SEARCH_FIELD_ICONS.drop}
                leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
              />
            </div>
          </>
        ) : null}
      </>
    );

  const subOptions =
    tripType === "outstation" ? (
      <div className={`flex flex-wrap gap-3 ${heroMode ? "emt-hero-radios mb-4" : "mt-4"}`}>
        {[
          { id: false, label: "One Way" },
          { id: true, label: "Round Trip" }
        ].map((opt) => (
          <label
            key={String(opt.id)}
            className={`flex cursor-pointer items-center gap-2 text-sm font-medium ${heroMode ? "" : "text-slate-700"}`}
          >
            <input
              type="radio"
              name="driver-roundtrip"
              checked={roundTrip === opt.id}
              onChange={() => setRoundTrip(opt.id)}
              className={`size-4 ${heroMode ? "accent-white" : "accent-[var(--emt-primary)]"}`}
            />
            {opt.label}
          </label>
        ))}
      </div>
    ) : tripType === "airport" ? (
      <div className={`flex flex-wrap gap-4 ${heroMode ? "emt-hero-radios mb-4" : "mt-4"}`}>
        {[
          { id: "pickup", label: "Pickup from Airport" },
          { id: "drop", label: "Drop to Airport" }
        ].map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer items-center gap-2 text-sm font-medium ${heroMode ? "" : "text-slate-700"}`}
          >
            <input
              type="radio"
              name="driver-airportdir"
              checked={airportDirection === opt.id}
              onChange={() => setAirportDirection(opt.id)}
              className={`size-4 ${heroMode ? "accent-white" : "accent-[var(--emt-primary)]"}`}
            />
            {opt.label}
          </label>
        ))}
      </div>
    ) : null;

  if (heroMode && emtLayout) {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-end">
          <EmtHeroPriceHint>Book Acting Drivers Online</EmtHeroPriceHint>
        </div>
        {subOptions}
        <div className="emt-hero-search-card emt-cab-search-card">
          <div className="emt-cab-type-bar">
            <EmtHeroPills options={HERO_DRIVER_TABS} value={tripType} onChange={setTripType} />
          </div>
          <div className="emt-search-wrap">
            <div className="emt-search-bar emt-search-bar-cabs">
              {locationFields}
              {dateTimeCell}
            </div>
            <button type="button" onClick={handleSearch} disabled={searching} className="emt-search-submit cabzii-tap">
              {searching ? "Searching…" : "SEARCH"}
            </button>
          </div>
        </div>
        {error ? (
          <p className="cabzii-error mt-4 font-medium text-white" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
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

      {subOptions}

      <div className="mt-4 grid grid-cols-1 gap-px overflow-visible rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
        {locationFields}
        {!heroMode ? dateTimeCell : null}
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, SearchIcon, TwoWayIcon } from "../icons";
import { SEARCH_FIELD_ICON_CHIPS, SEARCH_FIELD_ICONS } from "../icons/heroIcons";
import { EmtHeroPriceHint } from "../emt/EmtHeroPills";
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
import { SegmentedOption } from "../ui/RadioOption";

/* EMT-style hero toggle — maps onto the same tripType + roundTrip state */
const DRIVER_MODE_TABS = [
  { id: "oneway", label: "Outstation One Way" },
  { id: "roundtrip", label: "Outstation Round Trip" },
  { id: "hourly", label: "Hourly" },
  { id: "airport", label: "Airport Transfer" }
];

function nextDayStr(dateStr) {
  const d = new Date(dateStr || todayStr());
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export default function MmtDriverSearchWidget({
  defaultCity = "",
  initialTrip = null,
  emtLayout = false,
  heroMode = false,
  compact = false
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
  /* UI-only return date for the round-trip cell — search params stay unchanged */
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  const driverMode = tripType === "outstation" ? (roundTrip ? "roundtrip" : "oneway") : tripType;

  function setDriverMode(id) {
    if (id === "oneway") {
      setTripType("outstation");
      setRoundTrip(false);
    } else if (id === "roundtrip") {
      setTripType("outstation");
      setRoundTrip(true);
      setReturnDate((prev) => prev || nextDayStr(date));
    } else {
      setTripType(id);
    }
  }

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

  const packageCell = (
    <div className={heroMode ? "cabzii-search-cell" : "flex flex-col justify-center gap-1 bg-white p-4"}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {heroMode ? "Rent For" : "Package"}
      </span>
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
  );

  const airportDirectionCell =
    heroMode && tripType === "airport" ? (
      <div className="cabzii-search-cell">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Airport Transfer</span>
        <select
          value={airportDirection}
          onChange={(e) => setAirportDirection(e.target.value)}
          className="cabzii-field -mx-1 w-full rounded-lg border-0 bg-transparent text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
          aria-label="Airport transfer type"
        >
          <option value="pickup">Pickup from Airport</option>
          <option value="drop">Drop to Airport</option>
        </select>
      </div>
    ) : null;

  const returnCell =
    heroMode && tripType === "outstation" ? (
      <div className="cabzii-search-cell relative">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Return Date &amp; Time</span>
        {roundTrip ? (
          <div className="relative">
            <p className="truncate text-base font-bold text-slate-900 sm:text-xl">
              {formatEmtDate(returnDate || nextDayStr(date))}
            </p>
            <p className="text-sm font-medium text-slate-500">Select Time</p>
            <input
              type="date"
              min={date}
              value={returnDate || nextDayStr(date)}
              onChange={(e) => setReturnDate(e.target.value)}
              className="emt-date-input absolute inset-0 cursor-pointer opacity-0"
              aria-label="Return date"
            />
            <button
              type="button"
              onClick={() => setDriverMode("oneway")}
              className="absolute -right-1 -top-6 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 sm:-top-7"
              aria-label="Remove return trip"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setDriverMode("roundtrip")}
            className="text-left text-sm font-semibold leading-snug text-[var(--cabzii-brand)] hover:underline"
          >
            Book a round trip
            <br />
            to save more
          </button>
        )}
      </div>
    ) : null;

  const locationFields =
    tripType === "hourly" ? (
      <>
        <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
          <PlaceAutocomplete
            label={heroMode ? "From (Pick-up)" : "City"}
            placeholder={heroMode ? "Select Pick-up Location, landmark, or hotel" : "Pickup city or area"}
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
        {!heroMode ? packageCell : null}
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
          {heroMode ? <span className="text-xs text-slate-400">e.g. Chennai T1, Bengaluru T2</span> : null}
        </div>
        {heroMode ? (
          <div className="emt-search-swap-cell hidden lg:flex">
            <button type="button" onClick={swapLocations} className="emt-search-swap-btn" aria-label="Swap locations">
              <TwoWayIcon className="h-4 w-4 text-slate-400" />
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
          {heroMode ? <span className="text-xs text-slate-400">e.g. hotel, office, home address</span> : null}
        </div>
      </>
    ) : (
      <>
        <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
          <PlaceAutocomplete
            label={heroMode ? "From (Pick-up)" : "From"}
            placeholder={heroMode ? "Select Pick-up Location, landmark, or hotel" : "Pickup location"}
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
            leadingIcon={SEARCH_FIELD_ICONS.pickup}
            leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
          />
          {heroMode ? <span className="text-xs text-slate-400">e.g. Chennai Airport, T Nagar</span> : null}
        </div>
        {tripType === "outstation" ? (
          <>
            {heroMode ? (
              <div className="emt-search-swap-cell hidden lg:flex">
                <button type="button" onClick={swapLocations} className="emt-search-swap-btn" aria-label="Swap locations">
                  <TwoWayIcon className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            ) : null}
            <div className={heroMode ? "cabzii-search-cell" : "bg-white p-3 sm:p-4"}>
              <PlaceAutocomplete
                label={heroMode ? "To (Drop-off)" : "To"}
                placeholder={heroMode ? "Drop Location, landmark, or hotel" : "Drop location"}
                value={drop}
                onChange={setDrop}
                onResolved={(area) => {
                  setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                }}
                leadingIcon={SEARCH_FIELD_ICONS.drop}
                leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
              />
              {heroMode ? <span className="text-xs text-slate-400">e.g. hotel, office, home address</span> : null}
            </div>
          </>
        ) : null}
      </>
    );

  const subOptions = heroMode ? null : tripType === "outstation" ? (
      <div
        className="cabzii-segmented mb-4 mt-4"
        role="radiogroup"
        aria-label="Trip direction"
      >
        {[
          { id: false, label: "One Way" },
          { id: true, label: "Round Trip" }
        ].map((opt) => (
          <SegmentedOption
            key={String(opt.id)}
            name="driver-roundtrip"
            checked={roundTrip === opt.id}
            onChange={() => setRoundTrip(opt.id)}
            label={opt.label}
          />
        ))}
      </div>
    ) : tripType === "airport" ? (
      <div
        className="cabzii-segmented mb-4 mt-4"
        role="radiogroup"
        aria-label="Airport transfer type"
      >
        {[
          { id: "pickup", label: "Pickup from Airport" },
          { id: "drop", label: "Drop to Airport" }
        ].map((opt) => (
          <SegmentedOption
            key={opt.id}
            name="driver-airportdir"
            checked={airportDirection === opt.id}
            onChange={() => setAirportDirection(opt.id)}
            label={opt.label}
          />
        ))}
      </div>
    ) : null;

  if (heroMode && emtLayout) {
    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="emt-cab-mode-capsule" role="tablist" aria-label="Driver trip type">
            {DRIVER_MODE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={driverMode === tab.id}
                onClick={() => setDriverMode(tab.id)}
                className={`emt-cab-mode-pill cabzii-tap ${driverMode === tab.id ? "emt-cab-mode-pill-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="hidden sm:block">
            <EmtHeroPriceHint>Book Acting Drivers Online</EmtHeroPriceHint>
          </span>
        </div>
        <div className="emt-hero-search-card emt-cab-search-card">
          <div className="emt-search-wrap">
            <div className={`emt-search-bar emt-search-bar-cabs emt-search-bar-cabs-${driverMode}`}>
              {airportDirectionCell}
              {locationFields}
              {dateTimeCell}
              {returnCell}
              {tripType === "hourly" ? packageCell : null}
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
    <div className={`w-full ${compact ? "cabzii-search-compact" : ""}`}>
      <div
        className={`hero-tabs-scroll -mx-1 flex gap-1.5 overflow-x-auto border-b border-slate-200 px-1 ${
          compact ? "pb-1.5" : "gap-2 pb-2.5 sm:pb-3"
        }`}
      >
        {DRIVER_TRIP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={`shrink-0 rounded-full font-semibold transition-colors ${
              compact
                ? "px-2.5 py-1 text-[11px]"
                : "px-3 py-1.5 text-xs sm:px-4 sm:text-sm"
            } ${
              tripType === tab.id
                ? "bg-[var(--emt-primary)] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.id === "hourly" ? "Hourly" : tab.label}
          </button>
        ))}
      </div>

      {subOptions}

      <div
        className={`grid grid-cols-1 gap-px overflow-visible rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4 ${
          compact ? "mt-2.5" : "mt-3 sm:mt-4"
        }`}
      >
        {locationFields}
        {!heroMode ? dateTimeCell : null}
      </div>

      {error ? <p className="mt-2 text-xs text-rose-600 sm:text-sm">{error}</p> : null}

      <div className={`flex justify-center ${compact ? "mt-2.5" : "mt-3 sm:mt-4"}`}>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap mx-auto inline-flex w-auto min-w-[8.5rem] max-w-[10.5rem] items-center justify-center px-4"
        >
          <SearchIcon className="h-3.5 w-3.5 text-white/90" />
          {searching ? "Searching…" : "Search drivers"}
        </button>
      </div>
    </div>
  );
}

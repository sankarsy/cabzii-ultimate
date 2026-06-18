"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, SearchIcon, TwoWayIcon } from "../icons";
import { SEARCH_FIELD_ICON_CHIPS, SEARCH_FIELD_ICONS } from "../icons/heroIcons";
import EmtHeroPills, { EmtHeroPriceHint } from "../emt/EmtHeroPills";
import { formatEmtDate, formatTime12 } from "../../lib/emt/heroDates";
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

const HERO_TRIP_TABS = [
  { id: "airport", label: "Airport Transfer" },
  { id: "outstation", label: "Outstation" },
  { id: "hourly", label: "Hourly" }
];

export default function MmtCabSearchWidget({ defaultCity = "", initialTrip = null, emtLayout = false, heroMode = false }) {
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

    trip = fillCityCoords(trip);

    if (tripNeedsDrop(trip.tripType) && trip.from && trip.to) {
      setSearching(true);
      try {
        trip = applyDistanceToTrip(trip, await fetchTripDistance(trip));
      } catch {
        /* navigate without distance â€” results page will retry */
      } finally {
        setSearching(false);
      }
    }

    router.push(`/cabs/results?${tripToSearchQuery(trip).toString()}`);
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
    </>
  );

  const searchFields = (
    <>
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
              leadingIcon={SEARCH_FIELD_ICONS.pickup}
              leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
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
                <TwoWayIcon className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          <div className="cabzii-search-cell">
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
              <div className="cabzii-search-cell">
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
      )}

      {dateTimeCell}
    </>
  );

  const searchButton = (
    <button
      type="button"
      onClick={handleSearch}
      disabled={searching}
      className={
        emtLayout
          ? "emt-search-submit cabzii-tap"
          : "cabzii-btn cabzii-btn-primary cabzii-btn-lg w-full sm:w-auto sm:min-w-[220px]"
      }
    >
      <SearchIcon className="h-5 w-5" />
      {searching ? (emtLayout ? "Searchingâ€¦" : "Calculating distanceâ€¦") : emtLayout ? "SEARCH" : "Search Cabs"}
    </button>
  );

  const tripPills = (
    <div className={heroMode ? "" : emtLayout ? "flex flex-wrap gap-2 pb-4" : "hero-tabs-scroll -mx-0.5 flex gap-2 overflow-x-auto pb-4"}>
      {(heroMode ? (
        <EmtHeroPills options={HERO_TRIP_TABS} value={tripType} onChange={setTripType} />
      ) : emtLayout ? (
        TRIP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={
              emtLayout
                ? `cabzii-tap rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                    tripType === tab.id
                      ? "bg-[var(--cabzii-brand)] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`
                : `cabzii-chip cabzii-tap ${tripType === tab.id ? "cabzii-chip-active" : ""}`
            }
          >
            {tab.label}
          </button>
        ))
      ) : (
        TRIP_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={`cabzii-chip cabzii-tap ${tripType === tab.id ? "cabzii-chip-active" : ""}`}
          >
            {tab.label}
          </button>
        ))
      ))}
    </div>
  );

  const subOptions =
    tripType === "outstation" ? (
      <div className={`flex flex-wrap gap-3 ${heroMode ? "emt-hero-radios mb-4" : emtLayout ? "mb-4" : "mt-4"}`}>
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
              name="roundtrip"
              checked={roundTrip === opt.id}
              onChange={() => setRoundTrip(opt.id)}
              className="size-4 accent-white"
            />
            {opt.label}
          </label>
        ))}
      </div>
    ) : tripType === "airport" ? (
      <div className={`flex flex-wrap gap-4 ${heroMode ? "emt-hero-radios mb-4" : emtLayout ? "mb-4" : "mt-4"}`}>
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
              name="airportdir"
              checked={airportDirection === opt.id}
              onChange={() => setAirportDirection(opt.id)}
              className="size-4 accent-white"
            />
            {opt.label}
          </label>
        ))}
      </div>
    ) : null;

  const searchCard = emtLayout ? (
    <div className={heroMode ? "emt-hero-search-card emt-cab-search-card" : ""}>
      {heroMode ? (
        <div className="emt-cab-type-bar">
          <EmtHeroPills options={HERO_TRIP_TABS} value={tripType} onChange={setTripType} />
        </div>
      ) : null}
      <div className="emt-search-wrap">
        <div className={`emt-search-bar ${heroMode ? "emt-search-bar-cabs" : ""}`}>{searchFields}</div>
        {searchButton}
      </div>
    </div>
  ) : (
    <>
      <div className="cabzii-search-grid">{searchFields}</div>
      <div className="mt-5 flex justify-stretch sm:mt-6 sm:justify-center">{searchButton}</div>
    </>
  );

  return (
    <div className="w-full">
      {heroMode ? (
        <>
          <div className="mb-4 flex items-center justify-end">
            <EmtHeroPriceHint>Book Online Cab</EmtHeroPriceHint>
          </div>
          {subOptions}
          {searchCard}
          <div className="mt-4 flex justify-end">
            <p className="rounded-md border border-white/40 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
              ✓ Trusted by 50K+ travellers
            </p>
          </div>
        </>
      ) : (
        <>
          {tripPills}
          {subOptions}
          {searchCard}
        </>
      )}

      {error ? <p className={`cabzii-error mt-4 ${heroMode ? "font-medium text-white" : ""}`} role="alert">{error}</p> : null}
    </div>
  );
}

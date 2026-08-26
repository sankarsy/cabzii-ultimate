"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { CalendarIcon, ClockIcon, SearchIcon, TwoWayIcon } from "../icons";
import { SEARCH_FIELD_ICON_CHIPS, SEARCH_FIELD_ICONS } from "../icons/heroIcons";
import { EmtHeroPriceHint } from "../emt/EmtHeroPills";
import { formatEmtDate, formatTime12, addDays, openNativePicker } from "../../lib/emt/heroDates";
import { applyDistanceToTrip, fetchTripDistance } from "../../lib/fetchTripDistance";
import { coordsForPlaceLabel } from "../../lib/indiaCityCoords";
import { HOURLY_PACKAGES, todayStr, tripNeedsDrop, tripToSearchQuery } from "../../lib/mmtTrip";
import { writeSelectedCity } from "../../lib/locationPriority";
import { SegmentedOption } from "../ui/RadioOption";
import { trackEvent } from "../../lib/analytics";

const TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly" },
  { id: "local", label: "Local" }
];

/* EMT-style hero toggle — maps onto the same tripType + roundTrip state */
const CAB_MODE_TABS = [
  { id: "oneway", label: "Outstation One Way" },
  { id: "roundtrip", label: "Outstation Round Trip" },
  { id: "hourly", label: "Hourly" },
  { id: "airport", label: "Airport Transfer" }
];

function nextDayStr(dateStr) {
  return addDays(dateStr || todayStr(), 1);
}

export default function MmtCabSearchWidget({
  defaultCity = "",
  initialTrip = null,
  emtLayout = false,
  heroMode = false,
  /** When set (e.g. SEO outstation page), only these trip tabs show — usually a single type. */
  allowedTripTypes = null,
  /** Smaller fields + search button for SEO embeds. */
  compact = false
}) {
  const router = useRouter();
  const lockedKey =
    Array.isArray(allowedTripTypes) && allowedTripTypes.length ? allowedTripTypes.join(",") : "";
  const lockedTypes = lockedKey ? lockedKey.split(",") : null;
  const defaultType = lockedTypes?.[0] || initialTrip?.tripType || "outstation";
  const [tripType, setTripType] = useState(defaultType);
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

  const cabMode = tripType === "outstation" ? (roundTrip ? "roundtrip" : "oneway") : tripType;

  function setCabMode(id) {
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
    if (lockedTypes?.length) setTripType(lockedTypes[0]);
  }, [lockedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialTrip?.from?.trim()) return;
    const nextType = lockedTypes?.[0] || initialTrip.tripType || "outstation";
    setTripType(nextType);
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
  }, [initialTrip]); // eslint-disable-line react-hooks/exhaustive-deps

  const visibleTripTabs = lockedTypes
    ? TRIP_TABS.filter((t) => lockedTypes.includes(t.id))
    : TRIP_TABS;
  const showTripTabs = !heroMode && visibleTripTabs.length > 1;

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
        /* navigate without distance — results page will retry */
      } finally {
        setSearching(false);
      }
    }

    trackEvent("search_started", {
      service_type: "cab",
      city: trip.from || trip.city || "",
      route: [trip.from, trip.to].filter(Boolean).join(" → "),
      cta_location: "cab_search_widget"
    });
    router.push(`/cabs/results?${tripToSearchQuery(trip).toString()}`);
  }

  function handlePickupDate(next) {
    setDate(next);
    if (returnDate && next && returnDate < next) setReturnDate(next);
  }

  const dateTimeCell = heroMode ? (
    <div className="cabzii-search-cell">
      <span className="pointer-events-none text-xs font-semibold uppercase tracking-wide text-slate-500">Pick-up Date &amp; Time</span>
      <div className="relative min-h-[2.75rem]">
        <p className="pointer-events-none truncate text-base font-bold text-slate-900 sm:text-xl">{formatEmtDate(date)}</p>
        <p className="pointer-events-none text-sm font-medium text-slate-500">{formatTime12(time)}</p>
        <input
          type="date"
          min={todayStr()}
          value={date}
          onChange={(e) => handlePickupDate(e.target.value)}
          onClick={openNativePicker}
          className="emt-date-input absolute inset-x-0 top-0 z-10 h-1/2 w-full cursor-pointer"
          aria-label="Pickup date"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          onClick={openNativePicker}
          className="emt-date-input absolute inset-x-0 bottom-0 z-10 h-1/2 w-full cursor-pointer"
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
            onChange={(e) => handlePickupDate(e.target.value)}
            onClick={openNativePicker}
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
            onClick={openNativePicker}
            className="w-full max-w-full min-w-0 border-0 bg-transparent pl-7 pr-1 text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
          />
        </div>
      </div>
    </>
  );

  const packageCell = (
    <div className="cabzii-search-cell">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {heroMode ? "Rent For" : "Package"}
      </span>
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
          <div className="relative min-h-[2.75rem]">
            <p className="pointer-events-none truncate text-base font-bold text-slate-900 sm:text-xl">
              {formatEmtDate(returnDate || nextDayStr(date))}
            </p>
            <p className="pointer-events-none text-sm font-medium text-slate-500">Select Time</p>
            <input
              type="date"
              min={date}
              value={returnDate || nextDayStr(date)}
              onChange={(e) => setReturnDate(e.target.value)}
              onClick={openNativePicker}
              className="emt-date-input absolute inset-0 z-10 cursor-pointer"
              aria-label="Return date"
            />
            <button
              type="button"
              onClick={() => setCabMode("oneway")}
              className="absolute -right-1 -top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 sm:-top-7"
              aria-label="Remove return trip"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setCabMode("roundtrip")}
            className="mt-0.5 min-h-[2.75rem] w-full text-left text-sm font-semibold leading-snug text-[var(--cabzii-brand)] hover:underline"
          >
            Book a round trip
            <br />
            to save more
          </button>
        )}
      </div>
    ) : null;

  const searchFields = (
    <>
      {airportDirectionCell}
      {tripType === "hourly" ? (
        <>
          <div className="cabzii-search-cell">
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
                <TwoWayIcon className="h-4 w-4 text-slate-400" />
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
              <div className="cabzii-search-cell">
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
      )}

      {dateTimeCell}
      {returnCell}
      {heroMode && tripType === "hourly" ? packageCell : null}
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
          : "cabzii-btn cabzii-btn-primary cabzii-btn-sm cabzii-tap mx-auto w-auto min-w-[8.5rem] max-w-[10.5rem] justify-center px-4"
      }
    >
      <SearchIcon className="h-3.5 w-3.5 text-white/90" />
      {searching ? "Searching…" : emtLayout ? "SEARCH" : "Search cabs"}
    </button>
  );

  /* EMT-style capsule toggle above the search card */
  const modeToggle = (
    <div className="emt-cab-mode-capsule" role="tablist" aria-label="Cab trip type">
      {CAB_MODE_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={cabMode === tab.id}
          onClick={() => setCabMode(tab.id)}
          className={`emt-cab-mode-pill cabzii-tap ${cabMode === tab.id ? "emt-cab-mode-pill-active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const tripPills = heroMode ? (
    <div className="">{modeToggle}</div>
  ) : showTripTabs ? (
    <div
      className={
        emtLayout
          ? "flex flex-wrap gap-2 pb-4"
            : compact
            ? "hero-tabs-scroll -mx-0.5 flex gap-1.5 overflow-x-auto pb-1.5"
            : "hero-tabs-scroll -mx-0.5 flex gap-1.5 overflow-x-auto pb-2.5 sm:gap-2 sm:pb-3"
      }
    >
      {visibleTripTabs.map((tab) => (
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
              : compact
                ? `cabzii-tap rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    tripType === tab.id
                      ? "border-[var(--cabzii-brand)] bg-[var(--cabzii-brand)] text-white"
                      : "border-slate-200 bg-white text-slate-600"
                  }`
                : `cabzii-chip cabzii-tap ${tripType === tab.id ? "cabzii-chip-active" : ""}`
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  ) : null;

  const subOptions = heroMode ? null : tripType === "outstation" ? (
      <div
        className={`cabzii-segmented ${compact ? "cabzii-segmented-compact mb-2 mt-1.5" : "mb-2.5 mt-2"}`}
        role="radiogroup"
        aria-label="Trip direction"
      >
        {[
          { id: false, label: "One Way" },
          { id: true, label: "Round Trip" }
        ].map((opt) => (
          <SegmentedOption
            key={String(opt.id)}
            name="roundtrip"
            checked={roundTrip === opt.id}
            onChange={() => setRoundTrip(opt.id)}
            label={opt.label}
          />
        ))}
      </div>
    ) : tripType === "airport" ? (
      <div
        className={`cabzii-segmented ${compact ? "cabzii-segmented-compact mb-2 mt-1.5" : "mb-2.5 mt-2"}`}
        role="radiogroup"
        aria-label="Airport transfer type"
      >
        {[
          { id: "pickup", label: "Pickup from Airport" },
          { id: "drop", label: "Drop to Airport" }
        ].map((opt) => (
          <SegmentedOption
            key={opt.id}
            name="airportdir"
            checked={airportDirection === opt.id}
            onChange={() => setAirportDirection(opt.id)}
            label={opt.label}
          />
        ))}
      </div>
    ) : null;

  const searchCard = emtLayout ? (
    <div className={heroMode ? "emt-hero-search-card emt-cab-search-card" : ""}>
      <div className="emt-search-wrap">
        <div className={`emt-search-bar ${heroMode ? `emt-search-bar-cabs emt-search-bar-cabs-${cabMode}` : ""}`}>
          {searchFields}
        </div>
        {searchButton}
      </div>
    </div>
  ) : (
    <>
      <div className={`cabzii-search-grid ${compact ? "cabzii-search-grid-compact" : ""}`}>{searchFields}</div>
      <div className={`flex justify-center ${compact ? "mt-2.5" : "mt-3 sm:mt-4"}`}>
        {searchButton}
      </div>
    </>
  );

  return (
    <div className={`w-full ${compact ? "cabzii-search-compact" : ""}`}>
      {heroMode ? (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            {modeToggle}
            <span className="hidden sm:block">
              <EmtHeroPriceHint>Book Online Cab</EmtHeroPriceHint>
            </span>
          </div>
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

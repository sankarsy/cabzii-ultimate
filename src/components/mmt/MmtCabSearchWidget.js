"use client";

import { useEffect, useState } from "react";
import { useTodayStr, HydrateSafeDate } from "../../lib/useTodayStr";
import { useRouter } from "next/navigation";
import { X } from "../icons/rscIcons";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { SearchIcon, TwoWayIcon } from "../icons";
import { NativeDateField, NativeTimeField } from "../ui/NativeDateTimeField";
import { SEARCH_FIELD_ICON_CHIPS, SEARCH_FIELD_ICONS } from "../icons/heroIcons";
import { formatTime12, addDays, openNativePicker } from "../../lib/emt/heroDates";
import { applyDistanceToTrip, fetchTripDistance } from "../../lib/fetchTripDistance";
import { coordsForPlaceLabel } from "../../lib/indiaCityCoords";
import { cabResultsHref, HOURLY_PACKAGES, todayStr, tripNeedsDrop } from "../../lib/mmtTrip";
import { writeSelectedCity } from "../../lib/locationPriority";
import { SegmentedOption } from "../ui/RadioOption";
import { trackEvent } from "../../lib/analytics";
import { callDriverBookHref } from "../../lib/callDriver";

const TRIP_TABS = [
  { id: "outstation", label: "Outstation" },
  { id: "airport", label: "Airport" },
  { id: "hourly", label: "Hourly" },
  { id: "local", label: "Local" }
];

/* Homepage services — maps onto the same tripType + roundTrip state */
const CAB_MODE_TABS = [
  { id: "hourly", label: "Local" },
  { id: "airport", label: "Airport" },
  { id: "outstation", label: "Outstation" },
  { id: "driver", label: "Driver" }
];

function TabGlyph({ id }) {
  const common = "h-4 w-4 shrink-0";
  if (id === "airport") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    );
  }
  if (id === "outstation") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="6" cy="19" r="2.25" />
        <path d="M8.2 19h7.4a3.3 3.3 0 0 0 0-6.6H7.6a3.3 3.3 0 0 1 0-6.6H16" />
        <circle cx="18" cy="5.8" r="2.25" />
      </svg>
    );
  }
  if (id === "driver") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.25" />
        <path d="M12 3.2v4.2M12 16.6v4.2M3.2 12h4.2M16.6 12h4.2" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5 6.7 8.4A2 2 0 0 1 8.6 7h6.8a2 2 0 0 1 1.9 1.4L19 12.5" />
      <path d="M4 12.5h16v3.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 16.3v-3.8z" />
      <circle cx="7.5" cy="16.2" r="1.05" />
      <circle cx="16.5" cy="16.2" r="1.05" />
    </svg>
  );
}

const HERO_PLACE_INPUT =
  "h-auto min-h-[1.75rem] w-full rounded-none border-0 bg-transparent p-0 text-lg font-extrabold leading-tight text-slate-900 outline-none ring-0 placeholder:text-base placeholder:font-semibold placeholder:text-slate-400 focus:border-0 focus:bg-transparent focus:ring-0 sm:text-xl";

const HERO_FI_INPUT =
  "hero-fi-input h-12 w-full appearance-none rounded-xl border-[1.5px] border-[var(--cabzii-border)] bg-[var(--cabzii-bg)] py-[13px] pl-[42px] pr-3 text-[15px] font-semibold text-[var(--cabzii-ink)] outline-none ring-0 placeholder:font-medium placeholder:text-[#9aa8c7] focus:border-[var(--cabzii-brand)] focus:ring-0";

function FieldGlyph({ name }) {
  const common = "h-[18px] w-[18px]";
  if (name === "clock") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 7v5.5l3.5 2" />
      </svg>
    );
  }
  if (name === "cal") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
      </svg>
    );
  }
  if (name === "plane") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    );
  }
  if (name === "flag") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M5 22V3M5 4h13l-2.5 4.5L18 13H5" />
      </svg>
    );
  }
  if (name === "steer") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.25" />
        <path d="M12 3.2v4.2M12 16.6v4.2M3.2 12h4.2M16.6 12h4.2" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function HeroFi({ label, icon, children }) {
  return (
    <div className="hero-fi min-w-0">
      {label ? (
        <label className="mb-1 block text-[13px] font-semibold text-[var(--cabzii-muted)]">{label}</label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[var(--cabzii-brand)]" aria-hidden>
            <FieldGlyph name={icon} />
          </span>
        ) : null}
        {children}
      </div>
    </div>
  );
}

function HeroPlaceIcon({ name }) {
  return <FieldGlyph name={name} />;
}

function HeroPlace({ label, icon, value, onChange, onResolved, placeholder, allowCurrentLocation = true }) {
  const LeadingIcon = function LeadingIcon() {
    return <HeroPlaceIcon name={icon} />;
  };
  return (
    <HeroFi label={label}>
      <PlaceAutocomplete
        label=""
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onResolved={onResolved}
        allowCurrentLocation={allowCurrentLocation}
        leadingIcon={LeadingIcon}
        leadingIconClassName="text-[var(--cabzii-brand)]"
        inputClassName={`${HERO_FI_INPUT} !pl-[42px]`}
        className="w-full"
      />
    </HeroFi>
  );
}

function HeroDateTime({ label = "Date & time", date, time, min, onDate, onTime }) {
  const value = date && time ? `${date}T${time}` : "";
  return (
    <HeroFi label={label} icon="cal">
      <input
        type="datetime-local"
        min={min ? `${min}T00:00` : undefined}
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          if (!next) {
            onDate("");
            return;
          }
          const [day, clock] = next.split("T");
          onDate(day);
          if (clock) onTime(clock.slice(0, 5));
        }}
        className={HERO_FI_INPUT}
        aria-label={label}
      />
    </HeroFi>
  );
}

const CHENNAI_AIRPORT_LABEL = "Chennai International Airport (MAA)";

function nextDayStr(dateStr) {
  if (!dateStr) return "";
  return addDays(dateStr, 1);
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
  const defaultType = lockedTypes?.[0] || initialTrip?.tripType || (heroMode ? "hourly" : "outstation");
  const [tripType, setTripType] = useState(defaultType);
  const [roundTrip, setRoundTrip] = useState(false);
  const [driverService, setDriverService] = useState("local");
  const [pickup, setPickup] = useState(heroMode ? "" : defaultCity);
  const [drop, setDrop] = useState("");
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [airportDirection, setAirportDirection] = useState("pickup");
  const [packageHours, setPackageHours] = useState(heroMode ? 4 : 8);
  const today = useTodayStr();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  /* UI-only return date for the round-trip cell — search params stay unchanged */
  const [returnDate, setReturnDate] = useState("");
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  const cabMode = tripType === "outstation" ? (roundTrip ? "roundtrip" : "oneway") : tripType;
  const cabService =
    tripType === "airport"
      ? "airport"
      : tripType === "outstation"
        ? "outstation"
        : tripType === "driver"
          ? "driver"
          : "hourly";

  function setCabMode(id) {
    if (id === "oneway") {
      setTripType("outstation");
      setRoundTrip(false);
    } else if (id === "roundtrip") {
      setTripType("outstation");
      setRoundTrip(true);
      setReturnDate((prev) => prev || nextDayStr(date));
    } else if (id === "outstation") {
      setTripType("outstation");
    } else {
      setTripType(id);
    }
  }

  useEffect(() => {
    if (lockedTypes?.length) setTripType(lockedTypes[0]);
  }, [lockedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (heroMode) return;
    if (today) setDate((prev) => prev || today);
  }, [today, heroMode]);

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
    if (tripType === "driver") {
      if (!pickup.trim()) {
        setError("Enter pickup location.");
        return;
      }
      router.push(callDriverBookHref(driverService, { pickup: pickup.trim() }));
      return;
    }
    const pickupDate = date || today || todayStr();
    const pickupTime = time || "09:00";
    let trip = { tripType, date: pickupDate, time: pickupTime, roundTrip, direction: airportDirection, packageHours };

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
      if (heroMode) {
        const cityAddress = pickup.trim();
        if (!cityAddress) {
          setError("Enter pickup or drop address.");
          return;
        }
        if (airportDirection === "pickup") {
          trip.from = CHENNAI_AIRPORT_LABEL;
          trip.to = cityAddress;
        } else {
          trip.from = cityAddress;
          trip.to = CHENNAI_AIRPORT_LABEL;
        }
        if (fromCoords?.lat != null) trip.fromLat = fromCoords.lat;
        if (fromCoords?.lng != null) trip.fromLng = fromCoords.lng;
      } else {
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
    router.push(cabResultsHref(trip));
  }

  function handlePickupDate(next) {
    setDate(next);
    if (returnDate && next && returnDate < next) setReturnDate(next);
  }

  const dateTimeCell = heroMode ? (
    <div className="cabzii-search-cell">
      <span className="pointer-events-none text-xs font-semibold uppercase tracking-wide text-slate-400">
        Pick-up Date &amp; Time
      </span>
      <div className="relative min-h-[2.75rem]">
        <HydrateSafeDate
          iso={date}
          className="pointer-events-none block text-base font-bold leading-tight text-slate-900 sm:text-xl"
        />
        <span className="pointer-events-none block text-sm font-medium text-slate-500">{formatTime12(time)}</span>
        <input
          type="date"
          min={today || undefined}
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
      <div className="cabzii-search-cell min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup Date</p>
        <NativeDateField value={date} onChange={handlePickupDate} min={today} label="" ariaLabel="Pickup date" />
      </div>
      <div className="cabzii-search-cell min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pickup Time</p>
        <NativeTimeField value={time} onChange={setTime} label="" ariaLabel="Pickup time" />
      </div>
    </>
  );

  const packageCell = (
    <div className="cabzii-search-cell">
      <span className={`text-xs font-semibold uppercase tracking-wide ${heroMode ? "emt-redbus-label" : "text-slate-500"}`}>
        {heroMode ? "PACKAGE" : "Package"}
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
        <span className={`text-xs font-semibold uppercase tracking-wide ${heroMode ? "emt-redbus-label" : "text-slate-500"}`}>
          {heroMode ? "AIRPORT TRANSFER" : "Airport Transfer"}
        </span>
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
        <span className={`text-xs font-semibold uppercase tracking-wide ${heroMode ? "emt-redbus-label" : "text-slate-500"}`}>
          {heroMode ? "RETURN DATE" : "Return Date & Time"}
        </span>
        {roundTrip ? (
          <div className="relative min-h-[2.75rem]">
            <HydrateSafeDate
              iso={returnDate || nextDayStr(date)}
              className="pointer-events-none block truncate text-base font-bold text-slate-900 sm:text-xl"
            />
            <span className="pointer-events-none block text-sm font-medium text-slate-500">Select Time</span>
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

  const driverFields = (
    <>
      <div className="cabzii-search-cell">
        <span className="emt-redbus-label">SERVICE</span>
        <select
          value={driverService}
          onChange={(e) => setDriverService(e.target.value)}
          className="cabzii-field -mx-1 w-full rounded-lg border-0 bg-transparent text-base font-bold text-slate-900 focus:outline-none sm:text-lg"
          aria-label="Driver service"
        >
          <option value="local">Local city trip</option>
          <option value="outstation">Outstation per day</option>
          <option value="airport">Airport pickup or drop</option>
          <option value="valet">Valet</option>
        </select>
      </div>
      <div className="cabzii-search-cell">
        {heroMode ? <span className="emt-redbus-label">FROM</span> : null}
        <PlaceAutocomplete
          label={heroMode ? "" : "Pickup area"}
          placeholder="Pickup area"
          value={pickup}
          onChange={setPickup}
          onResolved={(area) => {
            setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
            if (area?.city) writeSelectedCity(area.city);
          }}
          leadingIcon={heroMode ? undefined : SEARCH_FIELD_ICONS.pickup}
          leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
          inputClassName={heroMode ? HERO_PLACE_INPUT : undefined}
        />
      </div>
      {dateTimeCell}
    </>
  );

  const searchFields = tripType === "driver" ? (
    driverFields
  ) : (
    <>
      {airportDirectionCell}
      {tripType === "hourly" ? (
        <>
          <div className="cabzii-search-cell">
            {heroMode ? <span className="emt-redbus-label">FROM</span> : null}
            <PlaceAutocomplete
              label={heroMode ? "" : "City"}
              placeholder={heroMode ? "Pickup city" : "Pickup city or area"}
              value={pickup}
              onChange={setPickup}
              onResolved={(area) => {
                setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                if (area?.city) writeSelectedCity(area.city);
              }}
              leadingIcon={heroMode ? undefined : SEARCH_FIELD_ICONS.pickup}
              leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
              inputClassName={heroMode ? HERO_PLACE_INPUT : undefined}
            />
          </div>
          {!heroMode ? packageCell : null}
        </>
      ) : tripType === "airport" ? (
        <>
          <div className="cabzii-search-cell">
            {heroMode ? <span className="emt-redbus-label">FROM</span> : null}
            <PlaceAutocomplete
              label={heroMode ? "" : "Airport"}
              placeholder={heroMode ? "Pickup city" : "Airport name"}
              value={pickup}
              onChange={setPickup}
              onResolved={(area) => {
                setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              }}
              leadingIcon={heroMode ? undefined : SEARCH_FIELD_ICONS.airport}
              leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.airport}
              inputClassName={heroMode ? HERO_PLACE_INPUT : undefined}
            />
          </div>
          {heroMode ? (
            <div className="emt-search-swap-cell hidden sm:flex">
              <button type="button" onClick={swapLocations} className="emt-search-swap-btn" aria-label="Swap locations">
                <TwoWayIcon className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          ) : null}
          <div className="cabzii-search-cell">
            {heroMode ? <span className="emt-redbus-label">TO</span> : null}
            <PlaceAutocomplete
              label={heroMode ? "" : "City"}
              placeholder={heroMode ? "Going to" : "City / area"}
              value={drop}
              onChange={setDrop}
              allowCurrentLocation={false}
              onResolved={(area) => {
                setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                if (area?.city) writeSelectedCity(area.city);
              }}
              leadingIcon={heroMode ? undefined : SEARCH_FIELD_ICONS.drop}
              leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
              inputClassName={heroMode ? HERO_PLACE_INPUT : undefined}
            />
          </div>
        </>
      ) : (
        <>
          <div className="cabzii-search-cell">
            {heroMode ? <span className="emt-redbus-label">FROM</span> : null}
            <PlaceAutocomplete
              label={heroMode ? "" : "From"}
              placeholder={heroMode ? "Pickup city" : "Pickup location"}
              value={pickup}
              onChange={setPickup}
              onResolved={(area) => {
                setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                if (area?.city) writeSelectedCity(area.city);
              }}
              leadingIcon={heroMode ? undefined : SEARCH_FIELD_ICONS.pickup}
              leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.pickup}
              inputClassName={heroMode ? HERO_PLACE_INPUT : undefined}
            />
          </div>
          {tripType === "outstation" ? (
            <>
              {heroMode ? (
                <div className="emt-search-swap-cell hidden sm:flex">
                  <button type="button" onClick={swapLocations} className="emt-search-swap-btn" aria-label="Swap locations">
                    <TwoWayIcon className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              ) : null}
              <div className="cabzii-search-cell">
                {heroMode ? <span className="emt-redbus-label">TO</span> : null}
                <PlaceAutocomplete
                  label={heroMode ? "" : "To"}
                  placeholder={heroMode ? "Going to" : "Drop location"}
                  value={drop}
                  onChange={setDrop}
                  allowCurrentLocation={false}
                  onResolved={(area) => {
                    setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                  }}
                  leadingIcon={heroMode ? undefined : SEARCH_FIELD_ICONS.drop}
                  leadingIconClassName={SEARCH_FIELD_ICON_CHIPS.drop}
                  inputClassName={heroMode ? HERO_PLACE_INPUT : undefined}
                />
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
          : "cabzii-btn cabzii-btn-cta cabzii-btn-sm cabzii-tap mx-auto w-auto min-w-[8.5rem] max-w-[10.5rem] justify-center px-4"
      }
    >
      <SearchIcon className="h-3.5 w-3.5" />
      {searching ? "Searching…" : heroMode ? "Search cabs" : "Get Fare"}
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
          aria-selected={cabService === tab.id}
          onClick={() => setCabMode(tab.id)}
          className={`emt-cab-mode-pill cabzii-tap ${cabService === tab.id ? "emt-cab-mode-pill-active" : ""}`}
        >
          <TabGlyph id={tab.id} />
          <span className="t">{tab.label}</span>
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

  const heroFields = (
    <>
      {tripType === "hourly" ? (
        <>
          <HeroPlace
            label="Pickup area"
            icon="pin"
            placeholder=""
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
          />
          <HeroFi label="Package" icon="clock">
            <select
              value={packageHours}
              onChange={(e) => setPackageHours(Number(e.target.value))}
              className={HERO_FI_INPUT}
              aria-label="Package"
            >
              {HOURLY_PACKAGES.map((p) => (
                <option key={p.hours} value={p.hours}>
                  {`${p.hours} hr / ${p.hours * 10} km`}
                </option>
              ))}
            </select>
          </HeroFi>
        </>
      ) : tripType === "airport" ? (
        <>
          <HeroFi label="Direction" icon="plane">
            <select
              value={airportDirection}
              onChange={(e) => setAirportDirection(e.target.value)}
              className={HERO_FI_INPUT}
              aria-label="Airport transfer type"
            >
              <option value="pickup">Pickup from airport</option>
              <option value="drop">Drop to airport</option>
            </select>
          </HeroFi>
          <HeroPlace
            label="Address"
            icon="pin"
            placeholder="Home, hotel or office"
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
          />
        </>
      ) : tripType === "driver" ? (
        <>
          <HeroFi label="Service" icon="steer">
            <select
              value={driverService}
              onChange={(e) => setDriverService(e.target.value)}
              className={HERO_FI_INPUT}
              aria-label="Driver service"
            >
              <option value="local">Local city trip</option>
              <option value="outstation">Outstation per day</option>
              <option value="airport">Airport pickup or drop</option>
              <option value="valet">Valet</option>
            </select>
          </HeroFi>
          <HeroPlace
            label="Pickup area"
            icon="pin"
            placeholder=""
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
          />
        </>
      ) : (
        <>
          <HeroPlace
            label="From"
            icon="pin"
            placeholder="Pickup city"
            value={pickup}
            onChange={setPickup}
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.city) writeSelectedCity(area.city);
            }}
          />
          <HeroPlace
            label="To"
            icon="flag"
            placeholder="Going to"
            value={drop}
            onChange={setDrop}
            allowCurrentLocation={false}
            onResolved={(area) => {
              setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
            }}
          />
        </>
      )}
      <HeroDateTime date={date} time={time} min={today} onDate={handlePickupDate} onTime={setTime} />
    </>
  );

  if (heroMode) {
    return (
      <div className="w-full">
        <div className="emt-hero-search-card emt-cab-search-card">
          {modeToggle}
          <div className="emt-search-wrap hero-fields">
            {heroFields}
            {searchButton}
          </div>
          <p className="mt-3 flex items-center gap-2 text-[13px] font-medium text-[var(--cabzii-muted)]">
            <svg className="h-4 w-4 shrink-0 text-[var(--cabzii-brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
              <circle cx="12" cy="12" r="9.5" />
              <path d="M8 9.5h.01M16 9.5h.01M8.2 14.2c1.1 1.4 2.6 2.1 3.8 2.1s2.7-.7 3.8-2.1" />
            </svg>
            Ride happy — fare shown before you confirm.
          </p>
        </div>
        {error ? <p className="cabzii-error mt-4 font-medium" role="alert">{error}</p> : null}
      </div>
    );
  }

  const searchCard = emtLayout ? (
    <div>
      <div className="emt-search-wrap">
        <div className="emt-search-bar">{searchFields}</div>
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
      {tripPills}
      {subOptions}
      {searchCard}

      {error ? <p className="cabzii-error mt-4 font-medium" role="alert">{error}</p> : null}
    </div>
  );
}

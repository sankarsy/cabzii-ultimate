"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Car, Clock, Plane } from "../icons/rscIcons";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { PickupDateTimeFields } from "../ui/NativeDateTimeField";
import { cabResultsHref, HOURLY_PACKAGES } from "../../lib/mmtTrip";
import { useTodayStr } from "../../lib/useTodayStr";

const TRIP_TYPES = [
  { id: "local", label: "Local Trip", shortLabel: "Local", Icon: Car },
  { id: "outstation", label: "Outstation", shortLabel: "Outstation", Icon: Briefcase },
  { id: "hourly", label: "Hourly Rental", shortLabel: "Hourly", Icon: Clock },
  { id: "airport", label: "Airport", shortLabel: "Airport", Icon: Plane }
];

const fieldInputClass =
  "w-full border-0 bg-transparent px-0 py-0.5 text-base font-semibold text-slate-900 shadow-none outline-none ring-0 focus:ring-0 sm:text-sm";

function toEngineTrip({ tripKind, from, to, date, time, cityName, packageHours, roundTrip }) {
  const pickupTime = time || "09:00";
  if (tripKind === "airport") {
    return {
      tripType: "airport",
      from,
      to,
      date,
      time: pickupTime,
      roundTrip: false,
      city: cityName,
      direction: "pickup"
    };
  }
  if (tripKind === "hourly") {
    return {
      tripType: "hourly",
      from,
      to: to || cityName,
      date,
      time: pickupTime,
      roundTrip: false,
      city: cityName,
      packageHours
    };
  }
  if (tripKind === "outstation") {
    return {
      tripType: "outstation",
      from,
      to,
      date,
      time: pickupTime,
      roundTrip: Boolean(roundTrip),
      city: cityName
    };
  }
  return {
    tripType: "local",
    from,
    to: to || cityName,
    date,
    time: pickupTime,
    roundTrip: false,
    city: cityName,
    packageHours
  };
}

function tripKindFromTrip(trip) {
  if (!trip?.tripType) return "local";
  if (trip.tripType === "hourly") return "hourly";
  if (trip.tripType === "airport") return "airport";
  if (trip.tripType === "outstation") return "outstation";
  return "local";
}

export default function CityCabBookingWidget({
  cityName,
  defaultFrom,
  defaultTo = "",
  airportLabel,
  initialTrip,
  onSearch
}) {
  const router = useRouter();
  const today = useTodayStr();
  const [tripKind, setTripKind] = useState(() => tripKindFromTrip(initialTrip));
  const [from, setFrom] = useState(defaultFrom || initialTrip?.from || cityName);
  const [to, setTo] = useState(() => {
    const start = defaultTo || initialTrip?.to || "";
    return start === cityName ? "" : start;
  });
  const [fromCoords, setFromCoords] = useState(() =>
    initialTrip?.fromLat != null ? { lat: initialTrip.fromLat, lng: initialTrip.fromLng } : null
  );
  const [toCoords, setToCoords] = useState(() =>
    initialTrip?.toLat != null ? { lat: initialTrip.toLat, lng: initialTrip.toLng } : null
  );
  const [date, setDate] = useState(initialTrip?.date || "");
  const [time, setTime] = useState(initialTrip?.time || "09:00");
  const [packageHours, setPackageHours] = useState(Number(initialTrip?.packageHours) || 4);
  const [roundTrip, setRoundTrip] = useState(Boolean(initialTrip?.roundTrip));
  const [error, setError] = useState("");

  useEffect(() => {
    if (today) setDate((prev) => prev || today);
  }, [today]);

  useEffect(() => {
    if (!initialTrip) return;
    setTripKind(tripKindFromTrip(initialTrip));
    if (initialTrip.from) setFrom(initialTrip.from);
    if (initialTrip.to) setTo(initialTrip.to === cityName ? "" : initialTrip.to);
    setFromCoords(initialTrip.fromLat != null ? { lat: initialTrip.fromLat, lng: initialTrip.fromLng } : null);
    setToCoords(initialTrip.toLat != null ? { lat: initialTrip.toLat, lng: initialTrip.toLng } : null);
    if (initialTrip.date) setDate(initialTrip.date);
    if (initialTrip.time) setTime(initialTrip.time);
    if (initialTrip.packageHours) setPackageHours(Number(initialTrip.packageHours));
    setRoundTrip(Boolean(initialTrip.roundTrip));
  }, [cityName, initialTrip?.tripType, initialTrip?.from, initialTrip?.to, initialTrip?.date, initialTrip?.time, initialTrip?.packageHours, initialTrip?.roundTrip]);

  const showDrop = tripKind !== "hourly";
  const needsDrop = tripKind === "outstation" || tripKind === "airport";

  function handleTripKind(id) {
    setTripKind(id);
    setError("");
    if (id === "airport" && airportLabel && (!to || to === cityName)) {
      setTo(airportLabel);
    }
  }

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
      time,
      cityName,
      packageHours,
      roundTrip: tripKind === "outstation" ? roundTrip : false
    });
    if (fromCoords?.lat != null) {
      trip.fromLat = fromCoords.lat;
      trip.fromLng = fromCoords.lng;
    }
    if (toCoords?.lat != null) {
      trip.toLat = toCoords.lat;
      trip.toLng = toCoords.lng;
    }
    if (onSearch) {
      onSearch(trip);
      return;
    }
    router.push(cabResultsHref(trip));
  }

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
      aria-label={`Book a cab in ${cityName}`}
    >
      <fieldset>
        <legend className="sr-only">Trip type</legend>
        <div className="grid grid-cols-4 gap-1.5">
          {TRIP_TYPES.map((type) => {
            const selected = tripKind === type.id;
            const Icon = type.Icon;
            return (
              <label
                key={type.id}
                className={`flex min-h-[3.6rem] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border px-0.5 py-1.5 text-center transition sm:min-h-[4.5rem] sm:gap-1 sm:px-1 sm:py-2 ${
                  selected
                    ? "border-amber-300 bg-[#fff4cc] text-slate-900"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="trip-type"
                  value={type.id}
                  checked={selected}
                  onChange={() => handleTripKind(type.id)}
                  className="sr-only"
                />
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${selected ? "text-amber-600" : "text-slate-500"}`} strokeWidth={1.7} />
                <span className="text-[10px] font-bold leading-tight sm:hidden">{type.shortLabel}</span>
                <span className="hidden text-[11px] font-bold leading-tight sm:inline">{type.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-3 space-y-2.5">
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
            <span className="text-[11px] font-semibold text-slate-500">From</span>
          </div>
          <PlaceAutocomplete
            placeholder={`Pickup in ${cityName}`}
            value={from}
            onChange={setFrom}
            allowCurrentLocation
            onResolved={(area) => {
              setFromCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
              if (area?.label) setFrom(area.label);
            }}
            inputClassName={fieldInputClass}
          />
        </div>

        {showDrop ? (
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="mb-0.5 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden />
              <span className="text-[11px] font-semibold text-slate-500">To</span>
            </div>
            <PlaceAutocomplete
              placeholder={tripKind === "airport" ? airportLabel || "Airport or city drop" : "Destination"}
              value={to}
              onChange={setTo}
              allowCurrentLocation={false}
              onResolved={(area) => {
                setToCoords(area?.lat != null ? { lat: area.lat, lng: area.lng } : null);
                if (area?.label) setTo(area.label);
              }}
              inputClassName={fieldInputClass}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <label htmlFor="city-cab-package" className="text-[11px] font-semibold text-slate-500">
              Package
            </label>
            <select
              id="city-cab-package"
              value={packageHours}
              onChange={(event) => setPackageHours(Number(event.target.value))}
              className="mt-0.5 w-full border-0 bg-transparent px-0 text-sm font-semibold text-slate-900 outline-none"
            >
              {HOURLY_PACKAGES.map((pkg) => (
                <option key={pkg.hours} value={pkg.hours}>
                  {pkg.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
          <p className="text-[11px] font-semibold text-slate-500">Pickup</p>
          <PickupDateTimeFields
            date={date}
            time={time}
            onDate={setDate}
            onTime={setTime}
            minDate={today}
            className="mt-1"
          />
        </div>
      </div>

      {tripKind === "outstation" ? (
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={roundTrip}
            onChange={(event) => setRoundTrip(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#0b1b3a] focus:ring-[#0b1b3a]"
          />
          Round Trip
        </label>
      ) : null}

      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}

      <button
        type="submit"
        className="mt-3 min-h-11 w-full rounded-xl bg-[#0b1b3a] px-4 text-sm font-bold text-white hover:bg-[#152a52]"
      >
        Search cabs
      </button>
    </form>
  );
}

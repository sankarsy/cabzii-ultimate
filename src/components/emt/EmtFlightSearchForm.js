"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ChevronDownIcon, TwoWayIcon } from "../icons";
import { todayStr } from "../../lib/mmtTrip";
import { airportByCode } from "../../lib/mock-data/airports";
import { formatDayName, formatEmtDate } from "../../lib/emt/heroDates";
import EmtAirportInput from "./EmtAirportInput";
import EmtFlightSpecialFares from "./EmtFlightSpecialFares";
import EmtHeroPills, { EmtHeroPriceHint } from "./EmtHeroPills";

const TRIP_TYPES = [
  { id: "oneway", label: "One Way" },
  { id: "roundtrip", label: "Round Trip" },
  { id: "multicity", label: "Multicity" }
];

function cityFromLabel(label) {
  if (!label) return "Select city";
  const match = label.match(/^(.+?)\s*\(/);
  return match ? match[1] : label.split("(")[0]?.trim() || label;
}

function airportSub(code, fallback = "") {
  const hit = airportByCode(code);
  if (!hit) return fallback;
  return `[${hit.code}] ${hit.airport}`;
}

export default function EmtFlightSearchForm({ emtHero = false }) {
  const router = useRouter();
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [fromLabel, setFromLabel] = useState("New Delhi (DEL)");
  const [toLabel, setToLabel] = useState("Mumbai (BOM)");
  const [date, setDate] = useState(todayStr());
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState("economy");
  const [error, setError] = useState("");

  function swap() {
    setFrom(to);
    setTo(from);
    setFromLabel(toLabel);
    setToLabel(fromLabel);
  }

  function search() {
    setError("");
    if (tripType === "multicity") {
      router.push("/flights?tripType=multicity");
      return;
    }
    if (!from || !to) {
      setError("Select origin and destination.");
      return;
    }
    if (from === to) {
      setError("Origin and destination must differ.");
      return;
    }
    const q = new URLSearchParams({
      from,
      to,
      date,
      adults: String(adults),
      children: "0",
      infants: "0",
      class: travelClass,
      tripType
    });
    if (tripType === "roundtrip" && returnDate) q.set("returnDate", returnDate);
    router.push(`/flights?${q.toString()}`);
  }

  if (!emtHero) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4" role="radiogroup" aria-label="Trip type">
          {TRIP_TYPES.map((t) => (
            <label key={t.id} className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="radio"
                name="tripType"
                checked={tripType === t.id}
                onChange={() => setTripType(t.id)}
                className="accent-[var(--emt-primary)]"
              />
              {t.label}
            </label>
          ))}
        </div>
        <LegacyFlightFields
          tripType={tripType}
          fromLabel={fromLabel}
          toLabel={toLabel}
          setFrom={setFrom}
          setTo={setTo}
          setFromLabel={setFromLabel}
          setToLabel={setToLabel}
          swap={swap}
          date={date}
          setDate={setDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          adults={adults}
          setAdults={setAdults}
          travelClass={travelClass}
          setTravelClass={setTravelClass}
        />
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="button"
          onClick={search}
          className="w-full rounded-full bg-[var(--emt-primary)] py-3 text-base font-bold text-white shadow-md transition hover:bg-[var(--emt-primary-dark)] sm:w-auto sm:px-12"
        >
          Search Flights
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <EmtHeroPills options={TRIP_TYPES} value={tripType} onChange={setTripType} />
        <EmtHeroPriceHint />
      </div>

      <div className="emt-hero-search-card">
        <div className="emt-search-wrap emt-search-wrap-flights">
          <div className="emt-search-bar emt-search-bar-flights">
            <div className="cabzii-search-cell emt-flight-airport-cell">
              <EmtAirportInput
                label="From"
                value={fromLabel}
                onChange={(code, display) => {
                  if (code) setFrom(code);
                  if (display) setFromLabel(display);
                }}
                variant="cell"
                displayCity={cityFromLabel(fromLabel)}
                displaySub={airportSub(from)}
              />
            </div>

            <div className="emt-search-swap-cell hidden lg:flex">
              <button
                type="button"
                onClick={swap}
                className="emt-search-swap-btn"
                aria-label="Swap origin and destination"
              >
                <TwoWayIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="cabzii-search-cell emt-flight-airport-cell">
              <EmtAirportInput
                label="To"
                value={toLabel}
                onChange={(code, display) => {
                  if (code) setTo(code);
                  if (display) setToLabel(display);
                }}
                variant="cell"
                displayCity={cityFromLabel(toLabel)}
                displaySub={airportSub(to)}
              />
            </div>

            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Departure Date</span>
              <div className="relative">
                <CalendarIcon className="pointer-events-none absolute right-0 top-2 h-[1.125rem] w-[1.125rem] text-slate-300 sm:h-5 sm:w-5" aria-hidden />
                <p className="truncate text-base font-bold text-slate-900 sm:text-xl">{formatEmtDate(date)}</p>
                <p className="text-xs text-slate-500">{formatDayName(date)}</p>
                <input
                  type="date"
                  min={todayStr()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="emt-date-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Departure date"
                />
              </div>
            </div>

            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Return Date</span>
              {tripType === "roundtrip" ? (
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute right-0 top-2 h-[1.125rem] w-[1.125rem] text-slate-300 sm:h-5 sm:w-5" aria-hidden />
                  <p className="truncate text-base font-bold text-slate-900 sm:text-xl">
                    {returnDate ? formatEmtDate(returnDate) : "Select date"}
                  </p>
                  <p className="text-xs text-slate-500">{returnDate ? formatDayName(returnDate) : ""}</p>
                  <input
                    type="date"
                    min={date || todayStr()}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="emt-date-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Return date"
                  />
                </div>
              ) : (
                <p className="text-sm font-medium leading-snug text-slate-400">Book a round trip to save more</p>
              )}
            </div>

            <div className="cabzii-search-cell relative">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Travellers &amp; Class</span>
              <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 sm:right-5" aria-hidden />
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent pr-6 text-base font-bold text-slate-900 focus:outline-none sm:text-xl"
                aria-label="Travellers"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Traveller{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
              <select
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
                className="w-full min-w-0 cursor-pointer appearance-none border-0 bg-transparent pr-6 text-sm font-medium text-slate-500 focus:outline-none"
                aria-label="Travel class"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          </div>

          <button type="button" onClick={search} className="emt-search-submit cabzii-tap">
            SEARCH
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-white">{error}</p> : null}

      <div className="mt-4">
        <EmtFlightSpecialFares />
        <a href="/flights" className="emt-discover-more cabzii-tap mt-3 inline-flex">
          DISCOVER MORE
        </a>
      </div>
    </div>
  );
}

function LegacyFlightFields(props) {
  const {
    tripType,
    fromLabel,
    toLabel,
    setFrom,
    setTo,
    setFromLabel,
    setToLabel,
    swap,
    date,
    setDate,
    returnDate,
    setReturnDate,
    adults,
    setAdults,
    travelClass,
    setTravelClass
  } = props;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
        <EmtAirportInput
          label="From"
          value={fromLabel}
          onChange={(code, display) => {
            if (code) setFrom(code);
            if (display) setFromLabel(display);
          }}
        />
        <button
          type="button"
          onClick={swap}
          className="mx-auto flex h-10 w-10 items-center justify-center self-end rounded-full border border-slate-200 bg-white text-lg hover:bg-slate-50"
          aria-label="Swap cities"
        >
          ⇄
        </button>
        <EmtAirportInput
          label="To"
          value={toLabel}
          onChange={(code, display) => {
            if (code) setTo(code);
            if (display) setToLabel(display);
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="emt-search-label">Departure</label>
          <input
            type="date"
            value={date}
            min={todayStr()}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          />
        </div>
        {tripType === "roundtrip" ? (
          <div>
            <label className="emt-search-label">Return</label>
            <input
              type="date"
              value={returnDate}
              min={date || todayStr()}
              onChange={(e) => setReturnDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
            />
          </div>
        ) : null}
        <div>
          <label className="emt-search-label">Travellers</label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>
                {n} Adult{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="emt-search-label">Class</label>
          <select
            value={travelClass}
            onChange={(e) => setTravelClass(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold"
          >
            <option value="economy">Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </div>
      </div>
    </>
  );
}

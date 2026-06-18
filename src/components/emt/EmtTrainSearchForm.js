"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, TwoWayIcon } from "../icons";
import { todayStr } from "../../lib/mmtTrip";
import { addDays, formatDayName, formatEmtDate, formatEmtDateShort } from "../../lib/emt/heroDates";
import EmtHeroPills, { EmtHeroPriceHint } from "./EmtHeroPills";

const TRAIN_MODES = [
  { id: "search", label: "Search Trains" },
  { id: "name", label: "Search by Train Name or Number" },
  { id: "pnr", label: "Check PNR Status" },
  { id: "live", label: "Train Live Status" },
  { id: "station", label: "Live Station" }
];

function quickDates(base) {
  return [0, 1, 2].map((i) => addDays(base, i));
}

export default function EmtTrainSearchForm({ emtHero = false }) {
  const router = useRouter();
  const [mode, setMode] = useState("search");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayStr());

  function search() {
    if (mode !== "search") {
      router.push("/trains");
      return;
    }
    const q = new URLSearchParams();
    if (from.trim()) q.set("from", from.trim());
    if (to.trim()) q.set("to", to.trim());
    if (date) q.set("date", date);
    router.push(`/trains?${q.toString()}`);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  if (!emtHero) {
    return null;
  }

  const quick = quickDates(todayStr());

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <EmtHeroPills options={TRAIN_MODES} value={mode} onChange={setMode} />
        <EmtHeroPriceHint>Book Train Tickets</EmtHeroPriceHint>
      </div>

      <div className="emt-hero-search-card">
        <div className="emt-search-wrap emt-search-wrap-trains">
          <div className="emt-search-bar emt-search-bar-trains">
            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">From</span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Choose Source station"
                className="w-full min-w-0 border-0 bg-transparent text-base font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none sm:text-lg"
              />
            </div>

            <div className="emt-search-swap-cell hidden lg:flex">
              <button type="button" onClick={swap} className="emt-search-swap-btn" aria-label="Swap stations">
                <TwoWayIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="cabzii-search-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">To</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Choose destination station"
                className="w-full min-w-0 border-0 bg-transparent text-base font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none sm:text-lg"
              />
            </div>

            <div className="cabzii-search-cell emt-train-date-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Departure Date</span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[7rem] flex-1">
                  <CalendarIcon className="pointer-events-none absolute right-0 top-2 h-4 w-4 text-slate-400" aria-hidden />
                  <p className="truncate text-base font-bold text-slate-900 sm:text-lg">
                    {date ? formatEmtDate(date) : "Depart Date"}
                  </p>
                  <p className="text-xs text-slate-500">{date ? formatDayName(date) : ""}</p>
                  <input
                    type="date"
                    min={todayStr()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="emt-date-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Departure date"
                  />
                </div>
                <div className="flex gap-1.5">
                  {quick.map((d) => {
                    const s = formatEmtDateShort(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDate(d)}
                        className={`emt-quick-date cabzii-tap ${date === d ? "emt-quick-date-active" : ""}`}
                      >
                        <span className="text-sm font-bold leading-none">{s.day}</span>
                        <span className="text-[0.5625rem] font-semibold uppercase leading-none">{s.mon}</span>
                        <span className="text-[0.5rem] font-medium uppercase leading-none opacity-80">{s.wd}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={search} className="emt-search-submit cabzii-tap">
            SEARCH
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
          🎉 Festival season bookings — plan early for best seats
        </p>
        <p className="text-xs font-semibold text-white/90">IRCTC Authorized Partner</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, TwoWayIcon } from "../icons";
import { HERO_TAB_ICONS } from "../icons/heroIcons";
import { todayStr } from "../../lib/mmtTrip";
import { addDays, formatDayName, formatEmtDate } from "../../lib/emt/heroDates";
import { EmtHeroPriceHint } from "./EmtHeroPills";

const BusIcon = HERO_TAB_ICONS.buses;

export default function EmtBusSearchForm({ emtHero = false }) {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayStr());

  function search() {
    const q = new URLSearchParams();
    if (from.trim()) q.set("from", from.trim());
    if (to.trim()) q.set("to", to.trim());
    if (date) q.set("date", date);
    router.push(`/buses?${q.toString()}`);
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  function pickQuick(offset) {
    setDate(addDays(todayStr(), offset));
  }

  if (!emtHero) {
    return null;
  }

  const isToday = date === todayStr();
  const isTomorrow = date === addDays(todayStr(), 1);

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <EmtHeroPriceHint>Book Bus Tickets Online</EmtHeroPriceHint>
      </div>

      <div className="emt-hero-search-card">
        <div className="emt-search-wrap emt-search-wrap-bus">
          <div className="emt-search-bar emt-search-bar-bus">
            <div className="cabzii-search-cell">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <BusIcon className="h-3.5 w-3.5 text-sky-400" aria-hidden />
                From
              </span>
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Source City"
                className="w-full min-w-0 border-0 bg-transparent text-base font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none sm:text-lg"
              />
            </div>

            <div className="emt-search-swap-cell hidden lg:flex">
              <button type="button" onClick={swap} className="emt-search-swap-btn" aria-label="Swap cities">
                <TwoWayIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="cabzii-search-cell">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <BusIcon className="h-3.5 w-3.5 text-sky-400" aria-hidden />
                To
              </span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination City"
                className="w-full min-w-0 border-0 bg-transparent text-base font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400 focus:outline-none sm:text-lg"
              />
            </div>

            <div className="cabzii-search-cell emt-bus-date-cell">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</span>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[8rem] flex-1">
                  <CalendarIcon className="pointer-events-none absolute right-0 top-2 h-4 w-4 text-slate-400" aria-hidden />
                  <p className="truncate text-base font-bold text-slate-900 sm:text-lg">
                    {date ? formatEmtDate(date) : "DD-MM-YYYY"}
                  </p>
                  <p className="text-xs text-slate-500">{date ? formatDayName(date) : ""}</p>
                  <input
                    type="date"
                    min={todayStr()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="emt-date-input absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Travel date"
                  />
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => pickQuick(0)}
                    className={`emt-bus-quick cabzii-tap ${isToday ? "emt-bus-quick-active" : ""}`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => pickQuick(1)}
                    className={`emt-bus-quick cabzii-tap ${isTomorrow ? "emt-bus-quick-active" : ""}`}
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button type="button" onClick={search} className="emt-search-submit cabzii-tap">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}

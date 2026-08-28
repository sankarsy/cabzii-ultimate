"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Calendar } from "lucide-react";
import { addDays } from "../../lib/emt/heroDates";
import { useTodayStr, HydrateSafeDate } from "../../lib/useTodayStr";
import { POPULAR_BUS_ROUTES, busResultsHref } from "../../lib/popularBusRoutes";

export default function EmtBusSearchForm({ emtHero = false, compact = false, initialFrom = "", initialTo = "", initialDate = "" }) {
  const router = useRouter();
  const [from, setFrom] = useState(initialFrom || "Chennai");
  const [to, setTo] = useState(initialTo || "");
  const today = useTodayStr();
  const [date, setDate] = useState(initialDate || "");

  useEffect(() => {
    if (today) setDate((prev) => prev || today);
  }, [today]);

  function search() {
    router.push(busResultsHref(from.trim() || "Chennai", to.trim(), date));
  }

  function swap() {
    setFrom(to || "Chennai");
    setTo(from);
  }

  function pickQuick(offset) {
    if (!today) return;
    setDate(addDays(today, offset));
  }

  const isToday = Boolean(today) && date === today;
  const isTomorrow = Boolean(today) && date === addDays(today, 1);

  return (
    <div className={compact ? "" : ""}>
      {!compact ? (
        <p className={`mb-3 text-right text-xs font-bold ${emtHero ? "text-white/90" : "text-rose-700"}`}>
          India&apos;s bus tickets · AC seater & sleeper
        </p>
      ) : null}

      <div className="rdb-search-card">
        <div className="rdb-search-bar">
          <div className="rdb-search-cell">
            <label className="rdb-search-label" htmlFor="rdb-from">
              From
            </label>
            <input
              id="rdb-from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Leaving from"
              className="rdb-search-input"
              autoComplete="off"
            />
          </div>

          <div className="flex items-center justify-center px-1 py-2 lg:py-0">
            <button type="button" onClick={swap} className="rdb-swap-btn cabzii-tap" aria-label="Swap cities">
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          <div className="rdb-search-cell">
            <label className="rdb-search-label" htmlFor="rdb-to">
              To
            </label>
            <input
              id="rdb-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Going to"
              className="rdb-search-input"
              autoComplete="off"
            />
          </div>

          <div className="rdb-search-cell">
            <span className="rdb-search-label">Date of journey</span>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[8rem] flex-1">
                <Calendar className="pointer-events-none absolute right-0 top-2 h-4 w-4 text-slate-400" aria-hidden />
                <HydrateSafeDate
                  iso={date}
                  empty="DD-MM-YYYY"
                  className="truncate text-base font-extrabold text-slate-900"
                />
                <HydrateSafeDate iso={date} weekday className="text-xs text-slate-500" />
                <input
                  type="date"
                  min={today || undefined}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Travel date"
                />
              </div>
              <div className="flex gap-1.5">
                <button type="button" onClick={() => pickQuick(0)} className={`rdb-quick cabzii-tap ${isToday ? "rdb-quick-active" : ""}`}>
                  Today
                </button>
                <button type="button" onClick={() => pickQuick(1)} className={`rdb-quick cabzii-tap ${isTomorrow ? "rdb-quick-active" : ""}`}>
                  Tomorrow
                </button>
              </div>
            </div>
          </div>

          <button type="button" onClick={search} className="rdb-search-submit cabzii-tap w-full lg:w-auto">
            Search
          </button>
        </div>
      </div>

      {!compact ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_BUS_ROUTES.slice(0, 6).map((r) => (
            <button
              key={`${r.from}-${r.to}`}
              type="button"
              onClick={() => {
                setFrom(r.from);
                setTo(r.to);
              }}
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                emtHero ? "bg-white/15 text-white hover:bg-white/25" : "bg-rose-50 text-rose-800 hover:bg-rose-100"
              }`}
            >
              {r.from} → {r.to}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

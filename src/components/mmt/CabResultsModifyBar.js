"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, Pencil } from "lucide-react";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { formatMmtBarDate, formatMmtListingStamp, formatTime12, openNativePicker } from "../../lib/emt/heroDates";
import { HOURLY_PACKAGES } from "../../lib/mmtTrip";
import { useHasMounted } from "../../lib/useTodayStr";
import CabResultsSearchSheet from "./CabResultsSearchSheet";
import { shortPlace, TRIP_OPTIONS, useCabModifySearch } from "./useCabModifySearch";

const PLACE_INPUT =
  "h-auto min-h-[1.15rem] w-full border-0 bg-transparent p-0 text-[13px] font-bold leading-tight text-white outline-none ring-0 placeholder:font-semibold placeholder:text-white/40 focus:border-0 focus:bg-transparent focus:ring-0";

function Cell({ label, children, className = "" }) {
  return (
    <div className={`min-w-0 rounded-xl bg-[#1a2d52] px-3 py-1.5 ${className}`}>
      <span className="pointer-events-none block text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function CabResultsModifyBar({ initialTrip }) {
  const router = useRouter();
  const mounted = useHasMounted();
  const search = useCabModifySearch(initialTrip);
  const [sheetOpen, setSheetOpen] = useState(false);

  const routeLabel = search.needsDrop
    ? `${shortPlace(search.pickup) || "Pickup"} to ${shortPlace(search.drop) || "Drop"}`
    : shortPlace(search.pickup) || "Pickup";
  const stamp = mounted ? formatMmtListingStamp(search.date, search.time) : "\u00a0";

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-3 py-1.5 pt-[max(0.4rem,env(safe-area-inset-top))] lg:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-700"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="min-w-0 flex-1 rounded-xl bg-[#f4f6fa] px-3 py-1.5 text-left"
          >
            <span className="block truncate text-[13px] font-bold leading-tight text-slate-900">{routeLabel}</span>
            <span suppressHydrationWarning className="block text-[10px] text-slate-500">
              {stamp}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex shrink-0 flex-col items-center px-1.5 py-1 text-[#1a73e8]"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
            <span className="text-[10px] font-semibold">Edit</span>
          </button>
        </div>
      </div>

      <CabResultsSearchSheet open={sheetOpen} onClose={() => setSheetOpen(false)} search={search} />

      <div className="hidden bg-[#0b1b3a] lg:block">
        <div className="section-shell py-2">
          <div className="flex flex-row items-end gap-1.5">
            <Cell label="Trip Type" className="w-44 shrink-0">
              <div className="relative">
                <select
                  value={search.optionId}
                  onChange={(e) => search.setOptionId(e.target.value)}
                  className="w-full appearance-none bg-transparent pr-5 text-[13px] font-bold text-white outline-none"
                  aria-label="Trip type"
                >
                  {TRIP_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id} className="bg-[#0b1b3a] text-slate-900">
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" aria-hidden />
              </div>
            </Cell>

            <Cell label="From" className="min-w-0 flex-1">
              <PlaceAutocomplete
                placeholder="Pickup city"
                value={search.pickup}
                onChange={search.setPickup}
                onResolved={(item) => {
                  search.setPickup(item.label);
                  if (item.lat != null) search.setFromCoords({ lat: item.lat, lng: item.lng });
                }}
                inputClassName={PLACE_INPUT}
              />
            </Cell>

            {search.needsDrop ? (
              <Cell label="To" className="min-w-0 flex-1">
                <PlaceAutocomplete
                  placeholder="Drop city"
                  value={search.drop}
                  onChange={search.setDrop}
                  onResolved={(item) => {
                    search.setDrop(item.label);
                    if (item.lat != null) search.setToCoords({ lat: item.lat, lng: item.lng });
                  }}
                  inputClassName={PLACE_INPUT}
                />
              </Cell>
            ) : null}

            {search.showPackage ? (
              <Cell label="Package" className="w-44 shrink-0">
                <select
                  value={search.packageHours}
                  onChange={(e) => search.setPackageHours(Number(e.target.value))}
                  className="w-full bg-transparent text-[13px] font-bold text-white outline-none"
                  aria-label="Hourly package"
                >
                  {HOURLY_PACKAGES.map((p) => (
                    <option key={p.hours} value={p.hours} className="text-slate-900">
                      {p.label}
                    </option>
                  ))}
                </select>
              </Cell>
            ) : null}

            <Cell label="Pick-up Date" className="w-44 shrink-0">
              <div className="relative min-h-[1.15rem]">
                <span suppressHydrationWarning className="pointer-events-none block text-[13px] font-bold text-white">
                  {mounted && search.date ? formatMmtBarDate(search.date) : "\u00a0"}
                </span>
                <input
                  type="date"
                  min={search.today || undefined}
                  value={search.date}
                  onChange={(e) => search.setDate(e.target.value)}
                  onClick={openNativePicker}
                  className="emt-date-input absolute inset-0 z-10 w-full cursor-pointer"
                  aria-label="Pickup date"
                />
              </div>
            </Cell>

            <Cell label="Pick-up Time" className="w-32 shrink-0">
              <div className="relative min-h-[1.15rem]">
                <span className="pointer-events-none block text-[13px] font-bold text-white">{formatTime12(search.time)}</span>
                <input
                  type="time"
                  value={search.time}
                  onChange={(e) => search.setTime(e.target.value)}
                  onClick={openNativePicker}
                  className="emt-date-input absolute inset-0 z-10 w-full cursor-pointer"
                  aria-label="Pickup time"
                />
              </div>
            </Cell>

            <button
              type="button"
              onClick={search.handleSearch}
              disabled={search.searching}
              className="h-11 min-w-28 shrink-0 rounded-xl bg-[#1e88e5] px-6 text-xs font-extrabold uppercase tracking-wide text-white shadow-md hover:bg-[#1877cc] disabled:opacity-70"
            >
              {search.searching ? "…" : "Search"}
            </button>
          </div>
          {search.error ? <p className="mt-2 text-sm font-semibold text-rose-300">{search.error}</p> : null}
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect } from "react";
import { ArrowUpDown, Calendar, Check, X } from "lucide-react";
import PlaceAutocomplete from "../PlaceAutocomplete";
import { formatMmtSheetDateParts, formatTime12, openNativePicker } from "../../lib/emt/heroDates";
import { HOURLY_PACKAGES } from "../../lib/mmtTrip";
import { useHasMounted } from "../../lib/useTodayStr";
import { sheetTitle, shortPlace } from "./useCabModifySearch";

const PLACE_INPUT =
  "h-auto min-h-[1.5rem] w-full border-0 bg-transparent p-0 text-[18px] font-extrabold leading-none text-slate-900 outline-none ring-0 placeholder:text-[16px] placeholder:font-bold placeholder:text-slate-400 focus:border-0 focus:bg-transparent focus:ring-0";

function ModeCard({ selected, title, subtitle, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-[4.25rem] flex-1 flex-col items-start rounded-xl border px-3 py-2.5 text-left ${
        selected ? "border-[#1a73e8] bg-[#e8f3ff]" : "border-slate-200 bg-white"
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-[1.5px] ${
            selected ? "border-[#1a73e8]" : "border-slate-300"
          }`}
        >
          {selected ? <span className="h-2 w-2 rounded-full bg-[#1a73e8]" /> : null}
        </span>
        <span className={`text-[14px] font-semibold ${selected ? "text-[#1a73e8]" : "text-slate-800"}`}>{title}</span>
      </span>
      <span className="mt-0.5 pl-[26px] text-[11px] leading-snug text-slate-500">{subtitle}</span>
    </button>
  );
}

function PlaceField({ label, pin, children, className = "" }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl bg-[#f2f3f5] px-3.5 py-2.5 ${className}`}>
      <span className={`mt-[1.35rem] ${pin}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
        {children}
      </div>
    </div>
  );
}

function DateField({ label, iso, time, min, onDate, onTime, showTime, mounted }) {
  const parts = formatMmtSheetDateParts(iso);
  return (
    <div className="relative min-w-0 flex-1 rounded-xl bg-[#f2f3f5] px-3 py-2.5">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
      <div className="mt-1 flex items-start gap-2">
        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium leading-tight text-slate-900">
            <span>{parts.wd} </span>
            <span className="text-[16px] font-extrabold">{mounted ? parts.day : "\u00a0"}</span>
            <span>
              {" "}
              {parts.mon} {parts.year}
            </span>
          </p>
          {showTime ? <p className="mt-0.5 text-[12px] leading-tight text-slate-500">{formatTime12(time)}</p> : null}
        </div>
      </div>
      <input
        type="date"
        min={min || undefined}
        value={iso}
        onChange={(e) => onDate(e.target.value)}
        onClick={openNativePicker}
        className="emt-date-input absolute inset-x-0 top-0 z-10 h-1/2 w-full cursor-pointer"
        aria-label={label}
      />
      {showTime && onTime ? (
        <input
          type="time"
          value={time}
          onChange={(e) => onTime(e.target.value)}
          onClick={openNativePicker}
          className="emt-date-input absolute inset-x-0 bottom-0 z-10 h-1/2 w-full cursor-pointer"
          aria-label={`${label} time`}
        />
      ) : null}
    </div>
  );
}

export default function CabResultsSearchSheet({ open, onClose, search }) {
  const mounted = useHasMounted();
  const isOutstation = search.option.tripType === "outstation";
  const roundTrip = isOutstation && search.option.roundTrip;
  const returnCity = shortPlace(search.pickup) || "pickup";

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  async function submit() {
    const ok = await search.handleSearch();
    if (ok) onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-white lg:hidden" role="dialog" aria-modal="true" aria-label={sheetTitle(search.option)}>
      <div className="flex items-center px-2 pb-3 pt-[max(0.65rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-slate-600"
          aria-label="Close search"
        >
          <X className="h-5 w-5" strokeWidth={2.25} />
        </button>
        <h2 className="flex-1 text-center text-[16px] font-semibold tracking-tight text-slate-800">{sheetTitle(search.option)}</h2>
        <span className="w-10" aria-hidden />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {isOutstation ? (
          <div className="mb-3.5 flex gap-2.5">
            <ModeCard
              selected={!roundTrip}
              title="One Way"
              subtitle="Get dropped off"
              onSelect={() => search.setOutstationMode(false)}
            />
            <ModeCard
              selected={roundTrip}
              title="Round Trip"
              subtitle="Keep cab till return"
              onSelect={() => search.setOutstationMode(true)}
            />
          </div>
        ) : null}

        <div className="relative space-y-2">
          <PlaceField label="From" pin="h-2.5 w-2.5 rounded-full bg-slate-400">
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
          </PlaceField>

          {search.needsDrop ? (
            <>
              <button
                type="button"
                onClick={search.swapLocations}
                className="absolute right-3 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm"
                aria-label="Swap pickup and drop"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </button>
              <PlaceField label="To" pin="h-2.5 w-2.5 rounded-full border-[1.5px] border-slate-400 bg-white">
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
              </PlaceField>
            </>
          ) : null}
        </div>

        {search.showPackage ? (
          <div className="mt-3 rounded-xl bg-[#f2f3f5] px-3.5 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Package</span>
            <select
              value={search.packageHours}
              onChange={(e) => search.setPackageHours(Number(e.target.value))}
              className="mt-0.5 w-full bg-transparent text-[16px] font-extrabold text-slate-900 outline-none"
              aria-label="Hourly package"
            >
              {HOURLY_PACKAGES.map((p) => (
                <option key={p.hours} value={p.hours}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {roundTrip ? (
          <div className="mt-4 flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <div>
              <p className="text-[14px] font-semibold leading-snug text-slate-800">Return to - {returnCity}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-slate-500">
                Since it is a round trip, you will return to your pickup
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex gap-2.5">
          <DateField
            label="Trip Start"
            iso={search.date}
            time={search.time}
            min={search.today}
            onDate={search.setDate}
            onTime={search.setTime}
            showTime
            mounted={mounted}
          />
          {roundTrip ? (
            <DateField
              label="Trip End"
              iso={search.returnDate || search.date}
              min={search.date || search.today}
              onDate={search.setReturnDate}
              showTime={false}
              mounted={mounted}
            />
          ) : null}
        </div>

        {search.error ? <p className="mt-3 text-[13px] font-semibold text-rose-600">{search.error}</p> : null}

        <button
          type="button"
          onClick={submit}
          disabled={search.searching}
          className="mt-5 h-12 w-full rounded-xl bg-[#1a73e8] text-[15px] font-extrabold uppercase tracking-wide text-white hover:bg-[#1565c0] disabled:opacity-70"
        >
          {search.searching ? "…" : "Search"}
        </button>
      </div>
    </div>
  );
}

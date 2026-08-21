"use client";

import { ShipWheel } from "lucide-react";
import { cn } from "../../lib/emt/cn";
import { seatPrice } from "../../lib/busBooking";

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

/** Armchair / berth glyph used on results cards and the seat map. */
export function SeatIcon({ state = "available", className = "h-5 w-5" }) {
  const fill =
    state === "booked"
      ? "#d4d4d4"
      : state === "female-booked"
        ? "#f4a4c0"
        : "none";
  const stroke =
    state === "female" || state === "female-booked"
      ? "#e889b0"
      : state === "male"
        ? "#5ba3d9"
        : state === "booked"
          ? "#c8c8c8"
          : state === "selected"
            ? "#d84e55"
            : "#9ca3af";
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="4" y="8" width="16" height="10" rx="2.5" fill={fill} stroke={stroke} strokeWidth="1.6" />
      <path d="M6 8 V6.5 c0-1.2 1-2.2 2.2-2.2 h7.6 c1.2 0 2.2 1 2.2 2.2 V8" fill="none" stroke={stroke} strokeWidth="1.6" />
      <path d="M5 18 v2.2 M19 18 v2.2" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function BerthCell({ seat, selected, price, onToggle, disabled }) {
  const sold = seat.status === "booked";
  const female = seat.gender === "F" || seat.ladiesOnly;
  return (
    <button
      type="button"
      disabled={sold || disabled}
      onClick={() => onToggle?.(seat)}
      title={sold ? `${seat.id} booked` : `${seat.id} · ${formatINR(price)}`}
      className={cn(
        "relative flex h-11 w-[4.6rem] items-center justify-center rounded-md border bg-white text-[11px] font-semibold tabular-nums sm:h-12 sm:w-[5.1rem]",
        sold && !female && "cursor-not-allowed border-transparent bg-[#e8e8e8] text-transparent",
        sold && female && "cursor-not-allowed border-transparent bg-[#f4a4c0] text-transparent",
        !sold && seat.ladiesOnly && "border-[#e889b0] text-slate-800",
        !sold && !seat.ladiesOnly && !selected && "border-[#cfcfcf] text-slate-800 hover:border-[#d84e55]",
        selected && "border-2 border-[#d84e55] bg-white text-slate-900 shadow-[0_0_0_1px_#d84e55]"
      )}
    >
      <span
        className={cn(
          "absolute bottom-1 top-1 w-[3px] rounded-full",
          female ? "left-1 bg-[#e889b0]" : "right-1 bg-[#c5c5c5]",
          sold && "opacity-40"
        )}
      />
      {sold ? null : formatINR(price)}
    </button>
  );
}

function SeaterCell({ seat, selected, price, onToggle, disabled }) {
  const sold = seat.status === "booked";
  const female = seat.gender === "F" || seat.ladiesOnly;
  const state = sold ? (female ? "female-booked" : "booked") : selected ? "selected" : seat.ladiesOnly ? "female" : "available";
  return (
    <button
      type="button"
      disabled={sold || disabled}
      onClick={() => onToggle?.(seat)}
      title={sold ? `${seat.id} booked` : `${seat.id} · ${formatINR(price)}`}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-md px-0.5 py-0.5",
        sold && "cursor-not-allowed opacity-80",
        selected && "ring-2 ring-[#d84e55] ring-offset-1"
      )}
    >
      <SeatIcon state={state} className="h-7 w-7" />
      <span className={cn("text-[9px] font-semibold tabular-nums", sold ? "text-slate-400" : "text-slate-700")}>
        {sold ? "Sold" : formatINR(price)}
      </span>
    </button>
  );
}

function SleeperDeck({ seats, label, showWheel, fares, selectedIds, onToggle, maxSeats }) {
  const singles = seats.filter((s) => s.side === "right" || s.col >= 2).sort((a, b) => a.row - b.row);
  const doubles = seats.filter((s) => s.side === "left" || s.col < 2).sort((a, b) => a.row - b.row || a.col - b.col);
  const bottom = doubles.filter((_, i) => i % 2 === 0).slice(0, Math.max(4, singles.length - 2));

  const render = (row) =>
    row.map((seat) => (
      <BerthCell
        key={seat.id}
        seat={seat}
        selected={selectedIds.includes(seat.id)}
        price={seatPrice(seat, fares)}
        onToggle={onToggle}
        disabled={selectedIds.length >= maxSeats && !selectedIds.includes(seat.id)}
      />
    ));

  return (
    <div className="flex gap-3 rounded-xl border border-[#ececec] bg-[#fafafa] p-3">
      <div className="flex w-14 shrink-0 flex-col items-center justify-center gap-2">
        {showWheel ? <ShipWheel className="h-5 w-5 text-slate-500" aria-hidden /> : <span className="h-5" />}
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">{label}</p>
      </div>
      <div className="min-w-0 flex-1 space-y-3 overflow-x-auto">
        <div className="flex flex-wrap gap-1.5">{render(singles)}</div>
        <div className="h-px bg-[#e5e5e5]" />
        <div className="flex flex-wrap gap-1.5">{render(bottom)}</div>
      </div>
    </div>
  );
}

function SeaterDeck({ seats, fares, selectedIds, onToggle, maxSeats }) {
  const byRow = {};
  seats.forEach((s) => {
    if (!byRow[s.row]) byRow[s.row] = [];
    byRow[s.row].push(s);
  });
  const rows = Object.keys(byRow).sort((a, b) => Number(a) - Number(b));
  return (
    <div className="rounded-xl border border-[#ececec] bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <ShipWheel className="h-5 w-5 text-slate-500" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">Seats</p>
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => {
          const left = byRow[row].filter((s) => s.side === "left").sort((a, b) => a.col - b.col);
          const right = byRow[row].filter((s) => s.side === "right").sort((a, b) => a.col - b.col);
          return (
            <div key={row} className="flex items-center justify-center gap-4">
              <div className="flex gap-1">
                {left.map((seat) => (
                  <SeaterCell
                    key={seat.id}
                    seat={seat}
                    selected={selectedIds.includes(seat.id)}
                    price={seatPrice(seat, fares)}
                    onToggle={onToggle}
                    disabled={selectedIds.length >= maxSeats && !selectedIds.includes(seat.id)}
                  />
                ))}
              </div>
              <div className="h-8 w-6 rounded-sm bg-slate-100" aria-hidden />
              <div className="flex gap-1">
                {right.map((seat) => (
                  <SeaterCell
                    key={seat.id}
                    seat={seat}
                    selected={selectedIds.includes(seat.id)}
                    price={seatPrice(seat, fares)}
                    onToggle={onToggle}
                    disabled={selectedIds.length >= maxSeats && !selectedIds.includes(seat.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function BusSeatMap({ layout = [], selectedIds = [], onToggle, maxSeats = 6, fares = {} }) {
  const sleeper = layout.some((s) => String(s.type || "").includes("berth"));
  const lower = layout.filter((s) => s.deck === "lower" || s.type === "seater");
  const upper = layout.filter((s) => s.deck === "upper");

  if (!layout.length) {
    return <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">Seat map not available for this bus.</p>;
  }

  return (
    <div className="space-y-3">
      {sleeper ? (
        <>
          {upper.length ? (
            <SleeperDeck seats={upper} label="Upper" fares={fares} selectedIds={selectedIds} onToggle={onToggle} maxSeats={maxSeats} />
          ) : null}
          <SleeperDeck seats={lower} label="Lower" showWheel fares={fares} selectedIds={selectedIds} onToggle={onToggle} maxSeats={maxSeats} />
        </>
      ) : (
        <SeaterDeck seats={lower} fares={fares} selectedIds={selectedIds} onToggle={onToggle} maxSeats={maxSeats} />
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <SeatIcon state="available" className="h-4 w-4" /> Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SeatIcon state="female" className="h-4 w-4" /> For Female
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SeatIcon state="male" className="h-4 w-4" /> For Male
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SeatIcon state="female-booked" className="h-4 w-4" /> Female booked
        </span>
        <span className="inline-flex items-center gap-1.5">
          <SeatIcon state="booked" className="h-4 w-4" /> Booked
        </span>
      </div>
    </div>
  );
}

/** Mini availability strip for search result cards. */
export function SeatAvailabilityStrip({ trip, max = 14 }) {
  const layout = trip?.seatLayout || [];
  const sleeper = layout.some((s) => String(s.type || "").includes("berth"));
  const preview = layout.slice(0, max);
  if (!preview.length) {
    return (
      <p className="text-xs font-semibold text-slate-600">
        {trip?.availableSeats || 0} {sleeper ? "berths" : "seats"} available
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {preview.map((s) => {
        const sold = s.status === "booked";
        const female = s.gender === "F" || s.ladiesOnly;
        const state = sold ? (female ? "female-booked" : "booked") : s.ladiesOnly ? "female" : "available";
        return <SeatIcon key={s.id} state={state} className="h-4 w-4" />;
      })}
      <span className="ml-1 text-[11px] font-semibold text-slate-600">
        {trip.availableSeats} {sleeper ? "berths" : "seats"} left
      </span>
    </div>
  );
}

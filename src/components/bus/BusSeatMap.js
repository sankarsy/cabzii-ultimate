"use client";

import { Armchair, BedDouble, CircleDot, ShipWheel } from "lucide-react";
import { cn } from "../../lib/emt/cn";
import { SEAT_TYPES } from "../../lib/busBooking";

const SEAT_COLORS = {
  seater: "border-sky-300 bg-sky-50 text-sky-900 hover:border-sky-400 hover:bg-sky-100",
  "lower-berth": "border-emerald-300 bg-emerald-50 text-emerald-900 hover:border-emerald-400 hover:bg-emerald-100",
  "upper-berth": "border-violet-300 bg-violet-50 text-violet-900 hover:border-violet-400 hover:bg-violet-100",
  ladies: "border-rose-300 bg-rose-50 text-rose-900",
  booked: "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed",
  selected: "border-[var(--cabzii-brand)] bg-[var(--cabzii-brand)] text-white shadow-md ring-2 ring-sky-200/80"
};

function SeatIcon({ type, className }) {
  const isBerth = type === "lower-berth" || type === "upper-berth" || type === "sleeper";
  const Icon = isBerth ? BedDouble : Armchair;
  return <Icon className={className} aria-hidden />;
}

export default function BusSeatMap({ layout = [], selectedIds = [], onToggle, maxSeats = 6 }) {
  const isSleeper = layout.some((s) => s.type?.includes("berth"));
  const lower = layout.filter((s) => s.deck === "lower" || s.type === "seater");
  const upper = layout.filter((s) => s.deck === "upper");

  function renderSeat(seat) {
    const isBooked = seat.status === "booked";
    const isSelected = selectedIds.includes(seat.id);
    const atMax = selectedIds.length >= maxSeats && !isSelected;
    const isBerth = seat.type === "lower-berth" || seat.type === "upper-berth";

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked || atMax}
        onClick={() => onToggle?.(seat)}
        title={`${seat.id} · ${SEAT_TYPES[seat.type]?.label || seat.type}`}
        className={cn(
          "cabzii-tap flex flex-col items-center justify-center rounded-lg border font-bold transition",
          isBerth ? "h-11 w-12 text-[9px] sm:h-12 sm:w-14" : "h-10 w-10 text-[9px] sm:h-11 sm:w-11",
          isBooked ? SEAT_COLORS.booked : isSelected ? SEAT_COLORS.selected : SEAT_COLORS[seat.type] || SEAT_COLORS.seater,
          atMax && !isBooked && "opacity-40"
        )}
      >
        <SeatIcon type={seat.type} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="mt-0.5 leading-none">{seat.id.replace(/^[SLU]/, "")}</span>
      </button>
    );
  }

  function renderDeck(seats, label) {
    const byRow = {};
    seats.forEach((s) => {
      if (!byRow[s.row]) byRow[s.row] = [];
      byRow[s.row].push(s);
    });
    const rows = Object.keys(byRow).sort((a, b) => Number(a) - Number(b));

    return (
      <div className="min-w-0 flex-1">
        {label ? (
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        ) : null}
        <div className="mx-auto w-full max-w-md space-y-2.5">
          {rows.map((row) => {
            const left = byRow[row]
              .filter((s) => s.side === "left" || s.col < 2)
              .sort((a, b) => a.col - b.col);
            const right = byRow[row]
              .filter((s) => s.side === "right" || s.col >= 2)
              .sort((a, b) => a.col - b.col);
            return (
              <div key={row} className="flex items-center gap-2">
                <span className="w-6 shrink-0 text-center text-[10px] font-bold tabular-nums text-slate-400">{row}</span>
                <div className="flex flex-1 justify-end gap-1.5 sm:gap-2">{left.map(renderSeat)}</div>
                <div className="flex w-8 shrink-0 flex-col items-center justify-center gap-0.5 sm:w-10" aria-hidden>
                  <div className="h-full min-h-[2.5rem] w-px bg-slate-300" />
                  <span className="text-[8px] font-bold uppercase text-slate-400">Aisle</span>
                </div>
                <div className="flex flex-1 justify-start gap-1.5 sm:gap-2">{right.map(renderSeat)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="cabzii-card overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-3 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto max-w-lg">
          {/* Bus front / driver */}
          <div className="relative mx-auto mb-4 max-w-[14rem] rounded-t-[2rem] border-2 border-slate-300 bg-slate-100 px-4 pb-3 pt-4 shadow-inner">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-400 bg-slate-200 text-slate-600">
              <ShipWheel className="h-5 w-5" aria-hidden />
            </div>
            <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">Front · Driver</p>
            <div className="absolute -bottom-px left-1/2 h-2 w-16 -translate-x-1/2 rounded-t bg-slate-300" aria-hidden />
          </div>

          {/* Seat decks */}
          <div className={cn("rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 p-3 sm:p-4", isSleeper && upper.length ? "space-y-6" : "")}>
            <div className={cn("flex flex-col gap-6", isSleeper && upper.length ? "lg:flex-row" : "")}>
              {renderDeck(lower, isSleeper ? "Lower deck" : null)}
              {upper.length ? renderDeck(upper, "Upper deck") : null}
            </div>
          </div>

          {/* Bus rear */}
          <div className="mx-auto mt-3 flex max-w-[10rem] items-center justify-center gap-1.5 rounded-b-xl border border-t-0 border-slate-200 bg-slate-50 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
            <CircleDot className="h-3 w-3" aria-hidden />
            Back
          </div>
        </div>
      </div>

      {/* Legend + selection hint */}
      <div className="space-y-3 border-t border-slate-100 bg-white px-4 py-3 sm:px-5">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(SEAT_TYPES)
            .filter(([k]) => k !== "booked" && k !== "sleeper")
            .map(([key, meta]) => (
              <span key={key} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <span className={cn("h-3.5 w-3.5 rounded border", SEAT_COLORS[key]?.split(" ").slice(0, 2).join(" "))} />
                {meta.label}
              </span>
            ))}
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-3.5 w-3.5 rounded border border-slate-200 bg-slate-100" /> Booked
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-3.5 w-3.5 rounded bg-[var(--cabzii-brand)]" /> Selected
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Tap seats to select · Max {maxSeats} seats ·{" "}
          <span className="font-semibold text-slate-700">{selectedIds.length} selected</span>
        </p>
      </div>
    </div>
  );
}

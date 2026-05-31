"use client";

import { CarIcon } from "../icons";

const VERTICALS = [
  { id: "flights", label: "Flights", icon: "✈️" },
  { id: "hotels", label: "Hotels", icon: "🏨" },
  { id: "homestays", label: "Homestays", icon: "🏠" },
  { id: "holidays", label: "Holidays", icon: "🎒" },
  { id: "trains", label: "Trains", icon: "🚆" },
  { id: "buses", label: "Buses", icon: "🚌" },
  { id: "cabs", label: "Cabs", icon: null }
];

export default function MmtVerticalNav({ active, onSelect }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
      {VERTICALS.map(({ id, label, icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={isActive}
            className={`flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              isActive
                ? "bg-[var(--cabzii-brand)]/10 text-[var(--cabzii-brand)]"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            {icon ? (
              <span className="text-lg leading-none" aria-hidden="true">
                {icon}
              </span>
            ) : (
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  isActive ? "bg-[var(--cabzii-brand)] text-white" : "bg-slate-100 text-[var(--cabzii-brand)]"
                }`}
              >
                <CarIcon className="h-3.5 w-3.5" />
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { MapPin } from "lucide-react";
import { cn } from "../../lib/emt/cn";
import { RadioOption } from "../ui/RadioOption";

export default function BusStopPicker({ label, stops = [], value, onChange, variant = "boarding" }) {
  const iconColor = variant === "boarding" ? "text-emerald-500" : "text-rose-500";
  const groupName = `${variant}-stop`;

  return (
    <div className="cabzii-card cabzii-card-pad">
      <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
        <MapPin className={cn("h-4 w-4", iconColor)} aria-hidden />
        {label}
      </p>
      <div className="cabzii-radio-group" role="radiogroup" aria-label={label}>
        {stops.map((stop) => {
          const id = stop.name;
          const selected = value === id;
          return (
            <RadioOption
              key={id}
              name={groupName}
              value={id}
              checked={selected}
              onChange={() => onChange?.(id)}
              label={
                <span className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold tabular-nums text-slate-800">
                    {stop.time}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{stop.name}</span>
                    {stop.landmark ? <span className="text-xs text-slate-500">{stop.landmark}</span> : null}
                  </span>
                </span>
              }
              className="items-start"
            />
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Calendar, Clock } from "../icons/rscIcons";
import { HydrateSafeDate } from "../../lib/useTodayStr";
import { formatTime12, openNativePicker } from "../../lib/emt/heroDates";

function OverlayField({ label, icon: Icon, children, control }) {
  return (
    <div className="block min-w-0">
      {label ? <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p> : null}
      <div className={`relative flex min-h-8 min-w-0 items-center gap-1.5 overflow-hidden ${label ? "mt-0.5" : ""}`}>
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} aria-hidden /> : null}
        <div className="min-w-0 flex-1 truncate">{children}</div>
        {control}
      </div>
    </div>
  );
}

export function NativeDateField({ value, onChange, min, label = "Date", ariaLabel }) {
  return (
    <OverlayField
      label={label}
      icon={Calendar}
      control={
        <input
          type="date"
          min={min || undefined}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onClick={openNativePicker}
          className="emt-date-input absolute inset-0 z-10 cursor-pointer"
          aria-label={ariaLabel || label || "Date"}
        />
      }
    >
      <HydrateSafeDate iso={value} className="pointer-events-none block truncate text-sm font-semibold text-slate-900" empty="Select date" />
    </OverlayField>
  );
}

export function NativeTimeField({ value, onChange, label = "Time", ariaLabel }) {
  return (
    <OverlayField
      label={label}
      icon={Clock}
      control={
        <input
          type="time"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onClick={openNativePicker}
          className="emt-date-input absolute inset-0 z-10 cursor-pointer"
          aria-label={ariaLabel || label || "Time"}
        />
      }
    >
      <span className="pointer-events-none block truncate text-sm font-semibold text-slate-900">
        {formatTime12(value) || "Select time"}
      </span>
    </OverlayField>
  );
}

export function PickupDateTimeFields({ date, time, onDate, onTime, minDate, className = "" }) {
  return (
    <div className={`grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 ${className}`}>
      <NativeDateField value={date} onChange={onDate} min={minDate} />
      <NativeTimeField value={time} onChange={onTime} />
    </div>
  );
}

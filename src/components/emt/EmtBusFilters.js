"use client";

import { BUS_TYPES } from "../../lib/busBooking";
import { CheckboxOption, RadioOption } from "../ui/RadioOption";

export default function EmtBusFilters({ filters, onChange, operators = [] }) {
  return (
    <aside className="cabzii-filter-panel h-fit">
      <p className="mb-3 text-sm font-bold text-slate-900">Filters</p>

      <label className="mb-4 block text-xs font-semibold text-slate-600">
        Max price (₹)
        <input
          type="range"
          min={400}
          max={3000}
          step={100}
          value={filters.maxPrice || 2500}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="mt-2 w-full accent-[var(--cabzii-brand)]"
        />
        <span className="mt-1 block text-slate-500">Up to ₹{Number(filters.maxPrice || 2500).toLocaleString("en-IN")}</span>
      </label>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-semibold text-slate-600">Departure</legend>
        <div className="cabzii-radio-group">
          {[
            { id: "", label: "Any time" },
            { id: "morning", label: "Morning (before 12)" },
            { id: "afternoon", label: "Afternoon (12–5)" },
            { id: "evening", label: "Evening (after 5)" }
          ].map((w) => (
            <RadioOption
              key={w.id || "any"}
              name="depWindow"
              value={w.id}
              checked={(filters.departureWindow || "") === w.id}
              onChange={() => onChange({ ...filters, departureWindow: w.id })}
              label={w.label}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-semibold text-slate-600">Bus type</legend>
        <div className="cabzii-checkbox-group">
          {BUS_TYPES.map((bt) => (
            <CheckboxOption
              key={bt.id}
              checked={(filters.busTypes || []).includes(bt.id)}
              onChange={(e) => {
                const set = new Set(filters.busTypes || []);
                if (e.target.checked) set.add(bt.id);
                else set.delete(bt.id);
                onChange({ ...filters, busTypes: [...set] });
              }}
              label={bt.label}
            />
          ))}
        </div>
      </fieldset>

      {operators.length ? (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold text-slate-600">Operator</legend>
          <div className="cabzii-checkbox-group max-h-40 overflow-y-auto">
            {operators.map((op) => (
              <CheckboxOption
                key={op}
                checked={(filters.operators || []).includes(op)}
                onChange={(e) => {
                  const set = new Set(filters.operators || []);
                  if (e.target.checked) set.add(op);
                  else set.delete(op);
                  onChange({ ...filters, operators: [...set] });
                }}
                label={op}
              />
            ))}
          </div>
        </fieldset>
      ) : null}
    </aside>
  );
}

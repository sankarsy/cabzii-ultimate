"use client";

import { applySampleToTourPackageForm } from "../../lib/tourPackageContent";
import { itineraryToLines, linesToItinerary } from "../../lib/adminCatalogConfig";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {hint ? <span className="mt-0.5 block text-[11px] text-slate-500">{hint}</span> : null}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none focus:border-sky-400";
}

function splitLines(text) {
  if (text == null || text === "") return [];
  return String(text).split("\n");
}

function joinLines(list) {
  return (Array.isArray(list) ? list : []).join("\n");
}

function LineListEditor({ label, hint, value, onChange, disabled, placeholder = "Add item…" }) {
  const items = splitLines(value);
  const updateAt = (index, next) => {
    const copy = [...items];
    copy[index] = next;
    onChange(joinLines(copy));
  };
  const removeAt = (index) => onChange(joinLines(items.filter((_, i) => i !== index)));
  const addItem = () => onChange(joinLines([...items, ""]));

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-1.5">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-500">
            No items yet — click Add.
          </p>
        ) : null}
        {items.map((item, index) => (
          <div key={`line-${index}`} className="flex gap-1.5">
            <input
              className={inputCls()}
              disabled={disabled}
              value={item}
              placeholder={placeholder}
              onChange={(e) => updateAt(index, e.target.value)}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeAt(index)}
              className="shrink-0 rounded-lg border border-rose-200 px-2 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              title="Delete"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={addItem}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          + Add
        </button>
      </div>
    </Field>
  );
}

function ItineraryEditor({ value, onChange, disabled }) {
  const days = linesToItinerary(value);
  const setDays = (next) => onChange(itineraryToLines(next));

  const updateAt = (index, patch) => {
    const copy = days.map((d, i) => (i === index ? { ...d, ...patch } : d));
    setDays(copy);
  };
  const removeAt = (index) => setDays(days.filter((_, i) => i !== index));
  const addDay = () =>
    setDays([
      ...days,
      { day: days.length + 1, title: "", details: "" }
    ]);

  return (
    <Field label="Day-wise itinerary" hint="Create, edit or delete each day">
      <div className="space-y-2">
        {days.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-white px-2.5 py-2 text-[11px] text-slate-500">
            No itinerary days yet — click Add day or Fill sample content.
          </p>
        ) : null}
        {days.map((day, index) => (
          <div key={`day-${index}`} className="rounded-lg border border-slate-200 bg-white p-2.5">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Day {index + 1}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(index)}
                className="rounded-md border border-rose-200 px-2 py-0.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                Delete day
              </button>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-[4.5rem_1fr]">
              <input
                type="number"
                min={1}
                className={inputCls()}
                disabled={disabled}
                value={day.day || index + 1}
                onChange={(e) => updateAt(index, { day: Number(e.target.value) || index + 1 })}
                title="Day number"
              />
              <input
                className={inputCls()}
                disabled={disabled}
                value={day.title || ""}
                placeholder="Title (e.g. Arrival & temple visit)"
                onChange={(e) => updateAt(index, { title: e.target.value })}
              />
            </div>
            <textarea
              rows={2}
              className={`${inputCls()} mt-1.5`}
              disabled={disabled}
              value={day.details || ""}
              placeholder="Details for this day…"
              onChange={(e) => updateAt(index, { details: e.target.value })}
            />
          </div>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={addDay}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          + Add day
        </button>
      </div>
    </Field>
  );
}

/** Structured page-content editor for holiday packages (create / edit / delete rows). */
export default function TourPackageContentEditor({ form, onChange, disabled }) {
  const patch = (partial) => onChange((prev) => ({ ...prev, ...partial }));

  const fillSample = () => {
    onChange((prev) => applySampleToTourPackageForm(prev));
  };

  const clearContent = () => {
    if (!window.confirm("Clear description, highlights, itinerary, inclusions and exclusions?")) return;
    patch({
      description: "",
      highlights: "",
      itinerary: "",
      inclusions: "",
      exclusions: "",
      cancellationPolicy: "",
      termsAndConditions: ""
    });
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-sky-900">Package page content</p>
          <p className="mt-0.5 text-[11px] text-slate-600">
            Shown on the booking page (/holidays/…) and SEO landing (/tour-packages/…). Create, edit or delete
            each section below.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            disabled={disabled}
            onClick={fillSample}
            className="rounded-md border border-sky-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-800 hover:bg-sky-50 disabled:opacity-50"
          >
            Fill sample content
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={clearContent}
            className="rounded-md border border-rose-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
          >
            Clear content
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Destination">
          <input
            className={inputCls()}
            disabled={disabled}
            value={form.destination || ""}
            onChange={(e) => patch({ destination: e.target.value })}
            placeholder="Madurai – Rameswaram"
          />
        </Field>
        <Field label="State">
          <input
            className={inputCls()}
            disabled={disabled}
            value={form.state || ""}
            onChange={(e) => patch({ state: e.target.value })}
            placeholder="Tamil Nadu"
          />
        </Field>
        <Field label="Days">
          <input
            type="number"
            min={0}
            className={inputCls()}
            disabled={disabled}
            value={form.days || 0}
            onChange={(e) => patch({ days: Number(e.target.value) })}
          />
        </Field>
        <Field label="Nights">
          <input
            type="number"
            min={0}
            className={inputCls()}
            disabled={disabled}
            value={form.nights || 0}
            onChange={(e) => patch({ nights: Number(e.target.value) })}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Description" hint="Full overview on the product page">
            <textarea
              rows={4}
              className={inputCls()}
              disabled={disabled}
              value={form.description || ""}
              onChange={(e) => patch({ description: e.target.value })}
              placeholder="Package overview shown to customers…"
            />
          </Field>
        </div>

        <LineListEditor
          label="Highlights"
          hint="One item per row — add or delete freely"
          value={form.highlights}
          onChange={(highlights) => patch({ highlights })}
          disabled={disabled}
          placeholder="e.g. AC cab throughout"
        />
        <div className="sm:col-span-2">
          <ItineraryEditor
            value={form.itinerary}
            onChange={(itinerary) => patch({ itinerary })}
            disabled={disabled}
          />
        </div>
        <LineListEditor
          label="Inclusions"
          hint="What the package includes"
          value={form.inclusions}
          onChange={(inclusions) => patch({ inclusions })}
          disabled={disabled}
        />
        <LineListEditor
          label="Exclusions"
          hint="What customers pay extra"
          value={form.exclusions}
          onChange={(exclusions) => patch({ exclusions })}
          disabled={disabled}
        />
        <Field label="Cancellation policy">
          <textarea
            rows={2}
            className={inputCls()}
            disabled={disabled}
            value={form.cancellationPolicy || ""}
            onChange={(e) => patch({ cancellationPolicy: e.target.value })}
          />
        </Field>
        <Field label="Terms & conditions">
          <textarea
            rows={2}
            className={inputCls()}
            disabled={disabled}
            value={form.termsAndConditions || ""}
            onChange={(e) => patch({ termsAndConditions: e.target.value })}
          />
        </Field>
      </div>
    </div>
  );
}

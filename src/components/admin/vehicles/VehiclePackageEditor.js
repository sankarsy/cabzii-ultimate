"use client";

import { PACKAGE_TYPES } from "../../../lib/vehicleAdminConfig";

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function numField(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function VehiclePackageEditor({ packages = [], onChange, disabled }) {
  const update = (index, patch) => {
    const next = packages.map((p, i) => (i === index ? { ...p, ...patch } : p));
    onChange(next);
  };

  const add = () => {
    onChange([
      ...packages,
      {
        packageType: "custom",
        packageName: "",
        includedHours: 0,
        includedKm: 0,
        originalPrice: 0,
        price: 0,
        discountPercentage: 0,
        extraKmRate: 0,
        extraHourRate: 0,
        sortOrder: packages.length,
        active: true
      }
    ]);
  };

  const remove = (index) => {
    onChange(packages.filter((_, i) => i !== index));
  };

  const duplicate = (index) => {
    const src = packages[index];
    const copy = { ...src, packageName: `${src.packageName || "Package"} (Copy)`, sortOrder: packages.length };
    delete copy._id;
    onChange([...packages, copy]);
  };

  const move = (index, dir) => {
    const next = [...packages];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((p, i) => ({ ...p, sortOrder: i })));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Fare packages</h3>
          <p className="text-xs text-slate-500">Add local, outstation and custom packages. Leave price at 0 for a package that is not offered.</p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={add}
          className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
        >
          + Add package
        </button>
      </div>

      <div className="grid gap-4">
        {packages.map((pkg, index) => (
          <div
            key={pkg._id || `pkg-${index}`}
            className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-sky-700">Package {index + 1}</span>
              <div className="flex flex-wrap gap-1">
                <button type="button" disabled={disabled || index === 0} onClick={() => move(index, -1)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white disabled:opacity-40">↑</button>
                <button type="button" disabled={disabled || index === packages.length - 1} onClick={() => move(index, 1)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white disabled:opacity-40">↓</button>
                <button type="button" disabled={disabled} onClick={() => duplicate(index)} className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-white">Duplicate</button>
                <button type="button" disabled={disabled || packages.length <= 1} onClick={() => remove(index)} className="rounded border border-rose-300 bg-rose-50 px-2 py-1 text-xs text-rose-700 hover:bg-rose-100 disabled:opacity-40">Delete</button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Package type">
                <select className={inputCls()} disabled={disabled} value={pkg.packageType} onChange={(e) => update(index, { packageType: e.target.value })}>
                  {PACKAGE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Package name">
                <input className={inputCls()} disabled={disabled} value={pkg.packageName || ""} onChange={(e) => update(index, { packageName: e.target.value })} placeholder="Local 4Hr / 40Km" />
              </Field>
              <Field label="Included hours">
                <input type="number" min={0} className={inputCls()} disabled={disabled} value={pkg.includedHours ?? 0} onChange={(e) => update(index, { includedHours: numField(e.target.value) })} />
              </Field>
              <Field label="Included KM">
                <input type="number" min={0} className={inputCls()} disabled={disabled} value={pkg.includedKm ?? 0} onChange={(e) => update(index, { includedKm: numField(e.target.value) })} />
              </Field>
              <Field label="Price (₹)">
                <input type="number" min={0} className={inputCls()} disabled={disabled} value={pkg.price ?? 0} onChange={(e) => update(index, { price: numField(e.target.value), originalPrice: numField(e.target.value), discountPercentage: 0 })} />
              </Field>
              <Field label="Extra KM rate">
                <input type="number" min={0} className={inputCls()} disabled={disabled} value={pkg.extraKmRate ?? 0} onChange={(e) => update(index, { extraKmRate: numField(e.target.value) })} />
              </Field>
              <Field label="Extra hour rate">
                <input type="number" min={0} className={inputCls()} disabled={disabled} value={pkg.extraHourRate ?? 0} onChange={(e) => update(index, { extraHourRate: numField(e.target.value) })} />
              </Field>
              <label className="flex items-end gap-2 text-xs font-semibold text-slate-600">
                <input
                  type="checkbox"
                  className="mb-2.5 rounded border-slate-300"
                  disabled={disabled}
                  checked={pkg.active !== false}
                  onChange={(e) => update(index, { active: e.target.checked })}
                />
                Offered (active)
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import {
  AVAILABILITY_STATUS_OPTIONS,
  BRAND_OPTIONS,
  DOCUMENT_STATUS_OPTIONS,
  FEATURE_PRESETS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  VEHICLE_CATEGORY_OPTIONS,
  VEHICLE_DOCUMENT_TYPES,
  VEHICLE_STATUS_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  emptyVehicleDocument
} from "../../../lib/vehicleAdminConfig";
import { useFormContext } from "react-hook-form";
import AdminSearchSelect from "../AdminSearchSelect";
import ImageUploadField from "../ImageUploadField";
import VehiclePackageEditor from "./VehiclePackageEditor";
import VehicleGalleryEditor from "./VehicleGalleryEditor";
import VehicleSeoPreview from "./VehicleSeoPreview";

const VehicleSeoPanel = dynamic(() => import("./VehicleSeoPanel"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="h-4 w-48 rounded bg-slate-200" />
      <div className="h-28 rounded bg-slate-100" />
      <div className="h-28 rounded bg-slate-100" />
      <div className="h-28 rounded bg-slate-100" />
    </div>
  )
});

const SeoRichTextEditor = dynamic(() => import("./SeoRichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-lg border border-slate-200 bg-slate-50" />
});

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function Checkbox({ label, checked, onChange, disabled }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="rounded border-slate-300" />
      {label}
    </label>
  );
}

export default function VehicleForm({
  activeTab,
  disabled,
  onRequestSave,
  authToken,
  cityOptions = [],
  vendorOptions = [],
  categoryOptions = VEHICLE_CATEGORY_OPTIONS,
  brandOptions = BRAND_OPTIONS,
  isSuperAdmin = false
}) {
  const { register, watch, setValue } = useFormContext();
  const form = watch();

  const patch = (updates) => {
    Object.entries(updates).forEach(([key, value]) => setValue(key, value, { shouldDirty: true }));
  };

  const toggleFeature = (name) => {
    const set = new Set(form.features || []);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    patch({ features: [...set] });
  };

  const addPickup = () => patch({ pickupLocations: [...(form.pickupLocations || []), ""] });
  const updatePickup = (i, v) => {
    const next = [...(form.pickupLocations || [])];
    next[i] = v;
    patch({ pickupLocations: next });
  };
  const removePickup = (i) => patch({ pickupLocations: (form.pickupLocations || []).filter((_, idx) => idx !== i) });

  const statusOptions = VEHICLE_STATUS_OPTIONS.filter((o) => isSuperAdmin || !o.adminOnly);
  const availabilityOptions = AVAILABILITY_STATUS_OPTIONS.filter((o) => isSuperAdmin || !o.adminOnly);

  const updateDocument = (i, updates) => {
    const next = [...(form.vehicleDocuments || [])];
    next[i] = { ...emptyVehicleDocument(), ...next[i], ...updates };
    patch({ vehicleDocuments: next });
  };
  const addDocument = () => patch({ vehicleDocuments: [...(form.vehicleDocuments || []), emptyVehicleDocument()] });
  const removeDocument = (i) => patch({ vehicleDocuments: (form.vehicleDocuments || []).filter((_, idx) => idx !== i) });

  const blockedDatesText = (form.blockedDates || []).join(", ");

  return (
    <div>
      {activeTab === "basic" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title *"><input className={inputCls()} disabled={disabled} {...register("title", { required: true })} /></Field>
          <Field label="Vehicle name *"><input className={inputCls()} disabled={disabled} {...register("vehicleName", { required: true })} /></Field>
          <Field label="Brand *" hint="Search list or type a new brand">
            <AdminSearchSelect
              disabled={disabled}
              value={form.brand || ""}
              options={brandOptions}
              placeholder="Search brand…"
              onChange={(brand) => patch({ brand })}
            />
          </Field>
          <Field label="Model"><input className={inputCls()} disabled={disabled} {...register("model")} /></Field>
          <Field label="Variant"><input className={inputCls()} disabled={disabled} {...register("variant")} /></Field>
          <Field label="Year"><input type="number" className={inputCls()} disabled={disabled} {...register("year")} /></Field>
          <Field label="Vehicle type / category *" hint="Sedan, SUV, Tempo… — search or type custom">
            <AdminSearchSelect
              disabled={disabled}
              value={form.category || form.type || ""}
              options={categoryOptions}
              placeholder="Search vehicle type…"
              onChange={(category) => patch({ category, type: category })}
            />
          </Field>
          <Field label="Vendor *" hint="Pick from master vendors or type">
            <AdminSearchSelect
              disabled={disabled}
              value={form.vendor || ""}
              options={vendorOptions}
              placeholder="Search vendor…"
              onChange={(vendor) => patch({ vendor })}
            />
          </Field>
          <Field label="City *" hint="HQ default is Chennai — pick from cities or type">
            <AdminSearchSelect
              disabled={disabled}
              value={form.city || ""}
              options={cityOptions}
              placeholder="Search city…"
              onChange={(city) => patch({ city })}
            />
          </Field>
          <Field label="Location"><input className={inputCls()} disabled={disabled} {...register("location")} /></Field>
          <Field label="Slug"><input className={inputCls()} disabled={disabled} {...register("slug")} hint="Auto-generated if empty" /></Field>
          <Field label="Product code"><input className={inputCls()} disabled={disabled} {...register("productCode")} hint="Auto-generated (CAB000001)" /></Field>
          <Field label="Status">
            <select className={inputCls()} disabled={disabled} {...register("status")}>
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="mt-1 text-[11px] font-normal text-slate-500">
              Active needs a name, seats and pricing. A photo is optional. Draft/Inactive stay off the public site and sitemap.
            </p>
          </Field>
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <Checkbox label="Featured" checked={form.featured} onChange={(v) => patch({ featured: v })} disabled={disabled} />
            <Checkbox label="Recommended" checked={form.recommended} onChange={(v) => patch({ recommended: v })} disabled={disabled} />
            <Checkbox label="Best seller" checked={form.bestseller} onChange={(v) => patch({ bestseller: v })} disabled={disabled} />
          </div>

          <div className="sm:col-span-2 space-y-3 rounded-xl border border-sky-100 bg-sky-50/40 p-3 sm:p-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Page content</p>
              <p className="mt-0.5 text-[11px] text-slate-600">
                Shown on the public cab package page. Write unique copy for this exact vehicle — do not reuse Force Traveller #1 text on #2 or Urbania.
              </p>
            </div>
            <Field label="Short description" hint="1–2 lines under the heading">
              <textarea
                className={`${inputCls()} min-h-[64px]`}
                disabled={disabled}
                value={form.shortDescription || ""}
                onChange={(e) => patch({ shortDescription: e.target.value })}
                placeholder="Book Honda Amaze in Chennai for airport, local and outstation trips…"
              />
            </Field>
            <Field label="Page heading (H1)" hint="Optional — defaults to vehicle name">
              <input
                className={inputCls()}
                disabled={disabled}
                value={form.h1 || ""}
                onChange={(e) => patch({ h1: e.target.value })}
                placeholder="Honda Amaze Cab Rental in Chennai"
              />
            </Field>
            <div>
              <p className="mb-1 text-xs font-semibold text-slate-600">Full page content</p>
              <SeoRichTextEditor
                value={form.longSeoContent || ""}
                disabled={disabled}
                onChange={(html) => patch({ longSeoContent: html })}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Cover seating, local rental, outstation, and airport/corporate/pilgrimage only if this vehicle actually offers them. Do not invent specs.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "inventory" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Registration number" hint="TN01AB1234 — unique across Cabzii. Optional on existing vehicles.">
            <input className={inputCls()} disabled={disabled} {...register("registrationNumber")} placeholder="TN01AB1234" />
          </Field>
          <Field label="Availability" hint="Busy is set by assignment, not occupancy. Blocked dates are stored here; matching comes later.">
            <select className={inputCls()} disabled={disabled} {...register("availabilityStatus")}>
              {availabilityOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          {isSuperAdmin ? (
            <Field label="Verification" hint="Vendors cannot change this.">
              <select className={inputCls()} disabled={disabled} {...register("verificationStatus")}>
                {VERIFICATION_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Verification">
              <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {form.verificationStatus || "approved"}
              </p>
            </Field>
          )}
          <Field label="Blocked dates" hint="YYYY-MM-DD, comma separated. Stored only — not used for matching yet.">
            <input
              className={inputCls()}
              disabled={disabled}
              value={form.blockedDatesInput ?? blockedDatesText}
              onChange={(e) => patch({ blockedDatesInput: e.target.value })}
              onBlur={(e) =>
                patch({
                  blockedDatesInput: undefined,
                  blockedDates: e.target.value
                    .split(/[,\s]+/)
                    .map((s) => s.trim())
                    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
                })
              }
              placeholder="2026-09-01, 2026-09-02"
            />
          </Field>
          <Field label="Service areas" hint="Defaults from city + pickup locations. Extra cities this vehicle serves.">
            <input
              className={inputCls()}
              disabled={disabled}
              value={(form.serviceAreas || []).join(", ")}
              onChange={(e) =>
                patch({
                  serviceAreas: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                })
              }
              placeholder="Chennai, Vellore"
            />
          </Field>
          <div className="sm:col-span-2 space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Vehicle documents</p>
              <button type="button" disabled={disabled} onClick={addDocument} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold hover:bg-white">
                + Add document
              </button>
            </div>
            {(form.vehicleDocuments || []).length === 0 ? (
              <p className="text-xs text-slate-500">RC, insurance, permit, fitness. Upload a photo or paste a URL.</p>
            ) : null}
            {(form.vehicleDocuments || []).map((doc, i) => (
              <div key={i} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2">
                <Field label="Type">
                  <select
                    className={inputCls()}
                    disabled={disabled}
                    value={doc.docType || "rc"}
                    onChange={(e) => updateDocument(i, { docType: e.target.value })}
                  >
                    {VEHICLE_DOCUMENT_TYPES.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Label">
                  <input className={inputCls()} disabled={disabled} value={doc.label || ""} onChange={(e) => updateDocument(i, { label: e.target.value })} placeholder="RC front" />
                </Field>
                <Field label="Expires">
                  <input type="date" className={inputCls()} disabled={disabled} value={doc.expiresAt || ""} onChange={(e) => updateDocument(i, { expiresAt: e.target.value })} />
                </Field>
                {isSuperAdmin ? (
                  <Field label="Doc status">
                    <select
                      className={inputCls()}
                      disabled={disabled}
                      value={doc.status || "pending"}
                      onChange={(e) => updateDocument(i, { status: e.target.value })}
                    >
                      {DOCUMENT_STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </Field>
                ) : (
                  <Field label="Doc status">
                    <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{doc.status || "pending"}</p>
                  </Field>
                )}
                <div className="sm:col-span-2">
                  <ImageUploadField
                    label="Document image / URL"
                    value={doc.url || ""}
                    onChange={(url) => updateDocument(i, { url })}
                    disabled={disabled}
                    authToken={authToken}
                    alt={doc.label || doc.docType || "Vehicle document"}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="button" disabled={disabled} onClick={() => removeDocument(i)} className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs text-rose-700">
                    Remove document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "specs" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Seats *"><input type="number" min={1} className={inputCls()} disabled={disabled} value={form.seats} onChange={(e) => patch({ seats: Number(e.target.value) })} /></Field>
          <Field label="Bags"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.bags} onChange={(e) => patch({ bags: Number(e.target.value) })} /></Field>
          <Field label="Doors"><input type="number" min={2} className={inputCls()} disabled={disabled} value={form.doors} onChange={(e) => patch({ doors: Number(e.target.value) })} /></Field>
          <Field label="Fuel type">
            <AdminSearchSelect
              disabled={disabled}
              value={form.fuelType || ""}
              options={FUEL_TYPE_OPTIONS}
              placeholder="Petrol / Diesel…"
              onChange={(fuelType) => patch({ fuelType })}
            />
          </Field>
          <Field label="Transmission">
            <AdminSearchSelect
              disabled={disabled}
              value={form.transmission || ""}
              options={TRANSMISSION_OPTIONS}
              placeholder="Manual / Automatic"
              onChange={(transmission) => patch({ transmission })}
            />
          </Field>
          <Field label="Mileage"><input className={inputCls()} disabled={disabled} value={form.mileage} onChange={(e) => patch({ mileage: e.target.value })} /></Field>
          <Field label="Engine"><input className={inputCls()} disabled={disabled} value={form.engine} onChange={(e) => patch({ engine: e.target.value })} /></Field>
          <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-4">
            <Checkbox label="AC" checked={form.airCondition} onChange={(v) => patch({ airCondition: v, ac: v })} disabled={disabled} />
            <Checkbox label="GPS" checked={form.gps} onChange={(v) => patch({ gps: v })} disabled={disabled} />
            <Checkbox label="FastTag" checked={form.fastTag} onChange={(v) => patch({ fastTag: v })} disabled={disabled} />
            <Checkbox label="Music system" checked={form.musicSystem} onChange={(v) => patch({ musicSystem: v })} disabled={disabled} />
            <Checkbox label="Charger" checked={form.charger} onChange={(v) => patch({ charger: v })} disabled={disabled} />
            <Checkbox label="Bottle water" checked={form.bottledWater} onChange={(v) => patch({ bottledWater: v })} disabled={disabled} />
            <Checkbox label="Child seat" checked={form.childSeat} onChange={(v) => patch({ childSeat: v })} disabled={disabled} />
            <Checkbox label="Wheelchair accessible" checked={form.wheelchairAccessible} onChange={(v) => patch({ wheelchairAccessible: v })} disabled={disabled} />
          </div>
        </div>
      )}

      {activeTab === "pricing" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Base price (₹) *"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.price} onChange={(e) => patch({ price: Number(e.target.value) })} /></Field>
          <Field label="Starting from (₹)"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.startingPrice} onChange={(e) => patch({ startingPrice: Number(e.target.value) })} /></Field>
          <Field label="Price per KM"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.pricePerKm} onChange={(e) => patch({ pricePerKm: Number(e.target.value) })} /></Field>
          <Field label="Price per hour"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.pricePerHour} onChange={(e) => patch({ pricePerHour: Number(e.target.value) })} /></Field>
          <Field label="Hourly rate"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.hourlyRate} onChange={(e) => patch({ hourlyRate: Number(e.target.value) })} /></Field>
          <Field label="Day rate"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.dayRate} onChange={(e) => patch({ dayRate: Number(e.target.value) })} /></Field>
          <Field label="Extra hour rate"><input type="number" min={0} className={inputCls()} disabled={disabled} value={form.extraHourRate} onChange={(e) => patch({ extraHourRate: Number(e.target.value) })} /></Field>
          <Field label="Driver batta / day (₹)" hint="Outstation calendar-day allowance">
            <input type="number" min={0} className={inputCls()} disabled={disabled} value={form.driverAllowance || 0} onChange={(e) => patch({ driverAllowance: Number(e.target.value) })} />
          </Field>
        </div>
      )}

      {activeTab === "packages" && (
        <VehiclePackageEditor packages={form.packages || []} onChange={(packages) => patch({ packages })} disabled={disabled} />
      )}

      {activeTab === "pickup" && (
        <div className="space-y-3">
          {(form.pickupLocations || []).map((loc, i) => (
            <div key={i} className="flex gap-2">
              <input className={inputCls()} disabled={disabled} value={loc} onChange={(e) => updatePickup(i, e.target.value)} placeholder="Pickup location" />
              <button type="button" disabled={disabled} onClick={() => removePickup(i)} className="shrink-0 rounded-lg border border-rose-300 px-3 text-xs text-rose-700">Remove</button>
            </div>
          ))}
          <button type="button" disabled={disabled} onClick={addPickup} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50">+ Add pickup location</button>
        </div>
      )}

      {activeTab === "features" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {FEATURE_PRESETS.map((f) => (
              <button
                key={f}
                type="button"
                disabled={disabled}
                onClick={() => toggleFeature(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${(form.features || []).includes(f) ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <Field label="Custom features (comma separated)">
            <input
              className={inputCls()}
              disabled={disabled}
              value={(form.features || []).join(", ")}
              onChange={(e) => patch({ features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </Field>
        </div>
      )}

      {activeTab === "gallery" && (
        <VehicleGalleryEditor images={form.images || []} onChange={(images) => patch({ images })} disabled={disabled} authToken={authToken} />
      )}

      {activeTab === "seo" && (
        <VehicleSeoPanel form={form} patch={patch} disabled={disabled} pathPrefix="/cabs" onRequestSave={onRequestSave} authToken={authToken} />
      )}

      {activeTab === "preview" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap gap-2">
            {form.featured ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Featured</span> : null}
            {form.recommended ? <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">Recommended</span> : null}
            {form.bestseller ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">Bestseller</span> : null}
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{form.vehicleName || form.title}</h3>
          <p className="text-sm text-slate-600">{form.brand} · {form.category} · {form.city} · {form.seats} seats</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {form.pricePerKm > 0 ? `₹${form.pricePerKm} / KM` : `From ₹${Number(form.startingPrice || form.price).toLocaleString("en-IN")}`}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(form.packages || []).filter((p) => p.price > 0).map((p, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3 text-sm">
                <div className="font-semibold">{p.packageName || p.packageType}</div>
                <div className="text-slate-600">₹{Number(p.price).toLocaleString("en-IN")}{p.includedHours ? ` · ${p.includedHours}hr / ${p.includedKm}km` : ""}</div>
              </div>
            ))}
          </div>
          <VehicleSeoPreview form={form} />
        </div>
      )}
    </div>
  );
}

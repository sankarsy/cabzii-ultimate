"use client";

import { useState } from "react";
import { normalizeMobileInput, sanitizeMobileInput } from "../../lib/auth";
import { earnJoinWhatsappMessage, whatsappBookingUrl } from "../../lib/conversion";
import { upsertEnquiry } from "../../lib/enquiryCapture";
import { inputBaseClass, typo } from "../../lib/typography";

const inputCls = `${inputBaseClass} h-10 max-sm:min-h-11 focus:border-[var(--cabzii-cta)] focus:ring-orange-100`;

const ATTACH = [
  { id: "driver", label: "Driver Attach", vehicleRequired: false, defaultVehicle: "acting driver" },
  { id: "lease", label: "Lease Vehicle", vehicleRequired: true, defaultVehicle: "" },
  { id: "vehicle", label: "Vehicle Attach", vehicleRequired: true, defaultVehicle: "" }
];

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className={typo.label}>
        {label}
        {required ? <span className="text-[var(--cabzii-cta)]"> *</span> : null}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

export default function EarnJoinForm() {
  const [attachId, setAttachId] = useState("driver");
  const [form, setForm] = useState({ name: "", mobile: "", city: "", vehicle: "" });
  const [error, setError] = useState("");
  const attach = ATTACH.find((item) => item.id === attachId) || ATTACH[0];

  function patch(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function onSubmit(event) {
    event.preventDefault();
    const name = form.name.trim();
    const city = form.city.trim();
    const mobile = normalizeMobileInput(form.mobile);
    const vehicle = attach.vehicleRequired ? form.vehicle.trim() : attach.defaultVehicle;
    if (!mobile) return setError("Enter a valid 10-digit contact number.");
    if (!city) return setError("Enter your home location / city.");
    if (!name) return setError("Enter the driver name.");
    if (attach.vehicleRequired && !vehicle) return setError("Enter the vehicle.");
    setError("");
    const message = earnJoinWhatsappMessage({
      city,
      vehicle,
      name,
      mobile,
      attach: attach.label
    });
    upsertEnquiry({
      name,
      mobile,
      pickup: city,
      vehicleName: vehicle,
      message,
      service: "partner",
      source: "earn",
      sourcePage: "/earn",
      ctaLocation: "earn_join_form",
      packageLabel: attach.label
    });
    window.open(whatsappBookingUrl({ message }), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="cabzii-card p-3 sm:p-3.5">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
        {ATTACH.map((item) => {
          const selected = item.id === attachId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setAttachId(item.id);
                setError("");
              }}
              className={`cabzii-tap min-h-9 rounded-lg px-1 text-[11px] font-bold leading-tight sm:text-xs ${
                selected ? "bg-[var(--cabzii-cta)] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 space-y-2.5">
        <Field label="Contact Number" required>
          <input
            className={inputCls}
            name="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => patch("mobile", sanitizeMobileInput(e.target.value))}
            placeholder="10-digit mobile"
            autoComplete="tel"
          />
        </Field>
        <Field label="Home Location" required>
          <input
            className={inputCls}
            name="city"
            value={form.city}
            onChange={(e) => patch("city", e.target.value)}
            placeholder="City"
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Driver Name" required>
          <input
            className={inputCls}
            name="name"
            value={form.name}
            onChange={(e) => patch("name", e.target.value)}
            placeholder="Driver name"
            autoComplete="name"
          />
        </Field>
        {attach.vehicleRequired ? (
          <Field label="Vehicle" required>
            <input
              className={inputCls}
              name="vehicle"
              value={form.vehicle}
              onChange={(e) => patch("vehicle", e.target.value)}
              placeholder="e.g. Toyota Etios"
            />
          </Field>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-xs font-medium text-[var(--cabzii-red)]">{error}</p> : null}

      <button type="submit" className="cabzii-btn cabzii-btn-cta cabzii-tap mt-3 min-h-11 w-full">
        Submit
      </button>
    </form>
  );
}

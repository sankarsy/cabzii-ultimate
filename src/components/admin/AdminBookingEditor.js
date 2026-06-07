"use client";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", hint: "Customer is waiting for confirmation" },
  { value: "confirmed", label: "Confirmed", hint: "Share driver/vendor contact with customer" },
  { value: "finished", label: "Finished", hint: "Trip done — contact hidden from customer" },
  { value: "cancelled", label: "Cancelled", hint: "Booking cancelled" }
];

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function Field({ label, children, hint }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

export default function AdminBookingEditor({ form, onChange, disabled = false }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));

  const selectedStatus = STATUS_OPTIONS.find((o) => o.value === form.status) || STATUS_OPTIONS[0];

  return (
    <div className="mt-4 space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Trip summary</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase text-slate-500">Customer</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{form.customerName || "Guest"}</p>
            <p className="text-xs text-slate-600">{form.phone || "—"}</p>
            {form.email ? <p className="text-xs text-slate-600">{form.email}</p> : null}
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-[11px] font-semibold uppercase text-slate-500">Booking</p>
            <p className="mt-1 text-sm font-bold capitalize text-slate-900">{form.type || "cab"}</p>
            <p className="text-xs text-slate-600">
              ₹{Number(form.amount || 0).toLocaleString("en-IN")} · {form.paymentMethod || "cash"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase text-slate-500">Route</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {form.pickup || "Pickup TBD"}
              {form.drop ? ` → ${form.drop}` : ""}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {form.date || "Date TBD"}
              {form.pickupTime ? ` · ${form.pickupTime}` : ""}
              {form.distanceKm ? ` · ${form.distanceKm} km` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-slate-900">Booking status</p>
        <p className="mt-1 text-xs text-slate-600">Choose what the customer sees on My Bookings.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {STATUS_OPTIONS.map((opt) => {
            const active = form.status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={disabled}
                onClick={() => set({ status: opt.value })}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  active
                    ? "border-[#0056D2] bg-blue-50 ring-1 ring-[#0056D2]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } disabled:opacity-60`}
              >
                <p className={`text-sm font-bold ${active ? "text-[#0056D2]" : "text-slate-900"}`}>{opt.label}</p>
                <p className="mt-0.5 text-xs text-slate-600">{opt.hint}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">Selected: {selectedStatus.label} — {selectedStatus.hint}</p>
      </div>

      {form.status === "confirmed" ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-950">Contact details for customer</p>
          <p className="mt-1 text-xs text-emerald-800">
            Shown on My Bookings and sent by SMS when you save. Phone is required unless vendor phone exists on the cab.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Contact name">
              <input
                className={inputCls()}
                disabled={disabled}
                value={form.vendorContactName}
                onChange={(e) => set({ vendorContactName: e.target.value })}
                placeholder="Cabzii Premier · Maruti Dzire"
              />
            </Field>
            <Field label="Phone *">
              <input
                className={inputCls()}
                disabled={disabled}
                value={form.vendorContactPhone}
                onChange={(e) => set({ vendorContactPhone: e.target.value })}
                placeholder="9944197416"
              />
            </Field>
            <Field label="WhatsApp">
              <input
                className={inputCls()}
                disabled={disabled}
                value={form.vendorContactWhatsapp}
                onChange={(e) => set({ vendorContactWhatsapp: e.target.value })}
                placeholder="Same as phone"
              />
            </Field>
            <Field label="Email">
              <input
                className={inputCls()}
                disabled={disabled}
                value={form.vendorContactEmail}
                onChange={(e) => set({ vendorContactEmail: e.target.value })}
                placeholder="partner@cabzii.in"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes for customer" hint="Vehicle number, driver name, pickup instructions">
                <textarea
                  className={inputCls()}
                  rows={2}
                  disabled={disabled}
                  value={form.vendorContactNotes}
                  onChange={(e) => set({ vendorContactNotes: e.target.value })}
                />
              </Field>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

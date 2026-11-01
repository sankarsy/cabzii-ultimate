"use client";

import { useMemo, useState } from "react";
import { MapPin, Plus, Power, PowerOff, Trash2, X } from "../../icons/rscIcons";
import { useAdminCities } from "../../../lib/admin/useAdminCities";

const emptyCity = {
  name: "",
  slug: "",
  state: "",
  country: "India",
  isActive: true,
  sortOrder: 0,
  description: "",
  airportDetails: "",
  services: { cabBooking: true, airportTaxi: true, actingDriver: true }
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function inputCls() {
  return "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
}

function cityId(city) {
  return String(city?._id || city?.id || "");
}

function formFromCity(city) {
  return {
    ...emptyCity,
    name: city.name || "",
    slug: city.slug || "",
    state: city.state || "",
    country: city.country || "India",
    isActive: city.isActive !== false,
    sortOrder: Number(city.sortOrder) || 0,
    description: city.description || city.content || "",
    airportDetails: city.airportDetails || "",
    services: {
      cabBooking: city.services?.cabBooking !== false,
      airportTaxi: city.services?.airportTaxi !== false,
      actingDriver: city.services?.actingDriver !== false
    }
  };
}

const SERVICE_FLAGS = [
  { key: "cabBooking", label: "Cab booking" },
  { key: "airportTaxi", label: "Airport taxi" },
  { key: "actingDriver", label: "Acting driver" }
];

export default function AdminCities({ token }) {
  const { cities, loading, error, reload } = useAdminCities({ token, activeOnly: false });
  const [form, setForm] = useState(emptyCity);
  const [editId, setEditId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { authorization: `Bearer ${token}` } : {})
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((city) => `${city.name} ${city.state} ${city.slug}`.toLowerCase().includes(q));
  }, [cities, search]);

  const closeForm = () => {
    setFormOpen(false);
    setEditId("");
    setForm(emptyCity);
  };

  const openCreate = () => {
    setMessage("");
    setEditId("");
    setForm(emptyCity);
    setFormOpen(true);
  };

  const openEdit = (city) => {
    const id = cityId(city);
    if (!id) {
      setMessage("This city has no id, so it cannot be edited.");
      return;
    }
    setMessage("");
    setEditId(id);
    setForm(formFromCity(city));
    setFormOpen(true);
  };

  const payloadFromForm = () => ({
    name: form.name.trim(),
    slug: slugify(form.slug || form.name),
    state: form.state.trim(),
    country: form.country || "India",
    isActive: form.isActive !== false,
    sortOrder: Number(form.sortOrder) || 0,
    description: form.description,
    content: form.description,
    airportDetails: form.airportDetails,
    services: {
      cabBooking: form.services?.cabBooking !== false,
      airportTaxi: form.services?.airportTaxi !== false,
      actingDriver: form.services?.actingDriver !== false
    }
  });

  const save = async () => {
    if (!form.name.trim()) {
      setMessage("City name is required.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(editId ? `/api/cities/${editId}` : "/api/cities", {
        method: editId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(payloadFromForm())
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Save failed.");
      setMessage(editId ? "City updated." : "City created. It now appears in every city dropdown.");
      closeForm();
      await reload();
    } catch (err) {
      setMessage(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (city) => {
    const id = cityId(city);
    if (!id) return;
    const next = city.isActive === false;
    if (!window.confirm(next ? `Activate ${city.name}?` : `Deactivate ${city.name}? Existing bookings stay.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/cities/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          ...formFromCity(city),
          isActive: next
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Update failed.");
      setMessage(next ? `${city.name} activated.` : `${city.name} deactivated.`);
      await reload();
    } catch (err) {
      setMessage(err.message || "Update failed.");
    }
  };

  const removeCity = async (city) => {
    const id = cityId(city);
    if (!id) return;
    if (!window.confirm(`Delete ${city.name}? This removes it from dropdowns. Existing bookings stay.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/cities/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: `Bearer ${token}` } : {}
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Delete failed.");
      if (editId === id) closeForm();
      setMessage(`${city.name} deleted.`);
      await reload();
    } catch (err) {
      setMessage(err.message || "Delete failed.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700">CMS</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cities</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Create a city once. Cab services, airport taxi, acting driver and routes all reuse this list.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          <Plus className="h-4 w-4" />
          Add city
        </button>
      </div>

      {message ? <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">{message}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4">
          <input className={inputCls()} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search cities…" />
        </div>
        {loading ? <p className="p-4 text-sm text-slate-500">Loading cities…</p> : null}
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Services</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((city) => (
                <tr key={cityId(city) || city.slug} className="border-t border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{city.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {city.state || "India"} · <span className="font-mono">{city.slug || "—"}</span>
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {SERVICE_FLAGS.filter((flag) => city.services?.[flag.key] !== false).map((flag) => (
                        <span key={flag.key} className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800">
                          {flag.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${city.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                      {city.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="text-xs font-semibold text-sky-700 hover:underline" onClick={() => openEdit(city)}>
                        Edit
                      </button>
                      <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline" onClick={() => toggleActive(city)}>
                        {city.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                        {city.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline" onClick={() => removeCity(city)}>
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && !filtered.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                    <MapPin className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                    No cities yet. Click Add city to create the first one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full overflow-auto rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-lg sm:rounded-2xl">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold text-slate-900">{editId ? "Edit city" : "New city"}</p>
              <button type="button" onClick={closeForm} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <Field label="City name *">
                <input
                  className={inputCls()}
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                      slug: p.slug && editId ? p.slug : slugify(e.target.value)
                    }))
                  }
                  placeholder="Chennai"
                />
              </Field>
              <Field label="URL slug *" hint="Unique. Used in /cab-booking/{slug}">
                <input className={inputCls()} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))} placeholder="chennai" />
              </Field>
              <Field label="State">
                <input className={inputCls()} value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} placeholder="Tamil Nadu" />
              </Field>
              <Field label="Description">
                <textarea className={inputCls()} rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </Field>
              <div>
                <p className="text-xs font-semibold text-slate-600">Available services</p>
                <div className="mt-2 grid gap-2">
                  {SERVICE_FLAGS.map((flag) => (
                    <label key={flag.key} className="flex items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.services?.[flag.key] !== false}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, services: { ...p.services, [flag.key]: e.target.checked } }))
                        }
                      />
                      {flag.label}
                    </label>
                  ))}
                </div>
              </div>
              <Field label="Airport details" hint="Name, IATA code, pickup notes">
                <textarea className={inputCls()} rows={2} value={form.airportDetails} onChange={(e) => setForm((p) => ({ ...p, airportDetails: e.target.value }))} placeholder="Chennai International Airport (MAA)" />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={form.isActive !== false} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                Active (inactive cities are hidden from new-page dropdowns)
              </label>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={saving} onClick={save} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                  {saving ? "Saving…" : editId ? "Save city" : "Create city"}
                </button>
                {editId ? (
                  <button type="button" onClick={() => removeCity({ _id: editId, name: form.name })} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50">
                    Delete
                  </button>
                ) : null}
                <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const DRIVER_TYPES = [
  { id: "local", label: "Local Driver" },
  { id: "outstation", label: "Outstation Driver" },
  { id: "airport", label: "Airport Driver" },
  { id: "school", label: "Monthly Driver" },
  { id: "corporate", label: "Corporate Driver" },
  { id: "valet", label: "Valet Parking" }
];

const emptyDriver = {
  name: "",
  phone: "",
  city: "",
  location: "",
  type: "local",
  vendor: "",
  status: "active"
};

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputCls() {
  return "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

export default function AdminDriverAccounts({ token, isSuperAdmin = false, cities = [] }) {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(emptyDriver);
  const [editId, setEditId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`
  };

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/drivers?admin=1&limit=200&page=1", {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      const json = await res.json();
      setDrivers(Array.isArray(json?.data) ? json.data : []);
    } catch {
      setMessage("Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!form.name.trim()) {
      setMessage("Driver name is required.");
      return;
    }
    if (!form.phone.trim()) {
      setMessage("Driver mobile is required for /driver/login.");
      return;
    }
    const url = editId ? `/api/drivers/${editId}` : "/api/drivers";
    const method = editId ? "PUT" : "POST";
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      location: form.location.trim(),
      type: form.type || "local",
      status: form.status === "inactive" ? "inactive" : "active",
      availabilityStatus: form.status === "inactive" ? "inactive" : "available"
    };
    if (isSuperAdmin && form.vendor.trim()) payload.vendor = form.vendor.trim();
    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Driver save failed");
      return;
    }
    setForm(emptyDriver);
    setEditId("");
    setMessage("Driver saved. They can sign in at /driver/login with this mobile (OTP).");
    await load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this driver?")) return;
    const res = await fetch(`/api/drivers/${id}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Delete failed");
      return;
    }
    setMessage("Driver deleted.");
    if (editId === id) {
      setEditId("");
      setForm(emptyDriver);
    }
    await load();
  };

  const filtered = useMemo(
    () =>
      drivers.filter((d) =>
        `${d.name} ${d.phone} ${d.city} ${d.type} ${d.vendor}`.toLowerCase().includes(search.toLowerCase())
      ),
    [drivers, search]
  );

  return (
    <div className="space-y-4">
      {!isSuperAdmin ? (
        <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
          You can create and update drivers for your vendor only. They sign in at <span className="font-mono">/driver/login</span>.
        </p>
      ) : null}
      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-800">{editId ? "Edit driver" : "Create driver"}</p>
          <p className="mt-1 text-xs text-slate-600">
            Same flow as vendor accounts: name, mobile, city and service type. Driver login is OTP at{" "}
            <span className="font-mono text-sky-800">/driver/login</span>.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Driver name *">
              <input className={inputCls()} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ramesh Kumar" />
            </Field>
            <Field label="Driver mobile (login) *">
              <input className={inputCls()} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile" />
            </Field>
            <Field label="Service type">
              <select className={inputCls()} value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
                {DRIVER_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="City">
              <input
                className={inputCls()}
                list="driver-city-options"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                placeholder="Type city e.g. Chennai"
              />
              <datalist id="driver-city-options">
                {cities.map((c) => (
                  <option key={c._id || c.name} value={c.name} />
                ))}
              </datalist>
            </Field>
            <Field label="Location / area">
              <input className={inputCls()} value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Area or landmark" />
            </Field>
            {isSuperAdmin ? (
              <Field label="Vendor">
                <input className={inputCls()} value={form.vendor} onChange={(e) => setForm((p) => ({ ...p, vendor: e.target.value }))} placeholder="Vendor name" />
              </Field>
            ) : null}
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={form.status !== "inactive"}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked ? "active" : "inactive" }))}
            />
            Active (can log in)
          </label>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
              {editId ? "Update driver" : "Create driver"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(emptyDriver);
                setEditId("");
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-3">
            <input className={inputCls()} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search drivers..." />
          </div>
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Driver</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-[11px] text-slate-500">{[d.city, d.location].filter(Boolean).join(" · ") || "—"}</p>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{d.phone || "—"}</td>
                  <td className="px-3 py-2 text-xs capitalize">{DRIVER_TYPES.find((t) => t.id === d.type)?.label || d.type || "Local Driver"}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${d.status === "inactive" ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {d.status === "inactive" ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-xs font-semibold text-sky-700"
                        onClick={() => {
                          setEditId(d._id);
                          setForm({
                            name: d.name || "",
                            phone: d.phone || "",
                            city: d.city || "",
                            location: d.location || "",
                            type: d.type || "local",
                            vendor: d.vendor || "",
                            status: d.status === "inactive" ? "inactive" : "active"
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => remove(d._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && !loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500">
                    No drivers yet. Create one to enable /driver/login.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

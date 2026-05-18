"use client";

import { useCallback, useEffect, useState } from "react";

const emptyVendor = { name: "", contactPhone: "", contactEmail: "", adminPhone: "", isActive: true };
const emptyCity = { name: "", state: "", country: "India", isActive: true, sortOrder: 0 };
const emptyLocation = { city: "", name: "", address: "", pincode: "", isActive: true };

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

export default function AdminMasterData({ token, isSuperAdmin }) {
  const [section, setSection] = useState("vendors");
  const [vendors, setVendors] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [vendorForm, setVendorForm] = useState(emptyVendor);
  const [cityForm, setCityForm] = useState(emptyCity);
  const [locationForm, setLocationForm] = useState(emptyLocation);
  const [editVendorId, setEditVendorId] = useState("");
  const [editCityId, setEditCityId] = useState("");
  const [editLocationId, setEditLocationId] = useState("");

  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`
  };

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setMessage("");
    try {
      const [vRes, cRes, lRes] = await Promise.all([
        fetch("/api/vendors", { headers: { authorization: headers.authorization }, cache: "no-store" }),
        fetch("/api/cities?active=0", { cache: "no-store" }),
        fetch("/api/locations?active=0", { cache: "no-store" })
      ]);
      const [vJson, cJson, lJson] = await Promise.all([vRes.json(), cRes.json(), lRes.json()]);
      setVendors(Array.isArray(vJson?.data) ? vJson.data : []);
      setCities(Array.isArray(cJson?.data) ? cJson.data : []);
      setLocations(Array.isArray(lJson?.data) ? lJson.data : []);
    } catch {
      setMessage("Failed to load master data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!isSuperAdmin) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Locations directory</p>
        <p className="mt-1">Only super admin can create vendors and cities. You can view service locations below.</p>
        {loading ? (
          <p className="mt-3 text-slate-600">Loading…</p>
        ) : (
          <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto text-xs">
            {locations.map((loc) => (
              <li key={loc._id} className="rounded border border-amber-100 bg-white px-2 py-1.5">
                <span className="font-medium">{loc.name}</span> — {loc.cityName}
                {loc.address ? ` · ${loc.address}` : ""}
              </li>
            ))}
            {!locations.length && <li className="text-slate-500">No locations configured yet.</li>}
          </ul>
        )}
      </div>
    );
  }

  const saveVendor = async () => {
    const url = editVendorId ? `/api/vendors/${editVendorId}` : "/api/vendors";
    const method = editVendorId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers, body: JSON.stringify(vendorForm) });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Vendor save failed");
      return;
    }
    setVendorForm(emptyVendor);
    setEditVendorId("");
    setMessage("Vendor saved.");
    await loadAll();
  };

  const saveCity = async () => {
    const url = editCityId ? `/api/cities/${editCityId}` : "/api/cities";
    const method = editCityId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers, body: JSON.stringify(cityForm) });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "City save failed");
      return;
    }
    setCityForm(emptyCity);
    setEditCityId("");
    setMessage("City saved.");
    await loadAll();
  };

  const saveLocation = async () => {
    const url = editLocationId ? `/api/locations/${editLocationId}` : "/api/locations";
    const method = editLocationId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers, body: JSON.stringify(locationForm) });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Location save failed");
      return;
    }
    setLocationForm(emptyLocation);
    setEditLocationId("");
    setMessage("Location saved.");
    await loadAll();
  };

  const deleteEntity = async (type, id) => {
    if (!window.confirm("Delete this item?")) return;
    const res = await fetch(`/api/${type}/${id}`, { method: "DELETE", headers });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.message || "Delete failed");
      return;
    }
    setMessage("Deleted.");
    await loadAll();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["vendors", "cities", "locations"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSection(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize ${
              section === tab ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      {section === "vendors" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">{editVendorId ? "Edit vendor" : "Create vendor"}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Vendor name *">
                <input className={inputCls()} value={vendorForm.name} onChange={(e) => setVendorForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="Admin phone (vendor login)">
                <input className={inputCls()} value={vendorForm.adminPhone} onChange={(e) => setVendorForm((p) => ({ ...p, adminPhone: e.target.value }))} placeholder="10-digit mobile" />
              </Field>
              <Field label="Contact phone">
                <input className={inputCls()} value={vendorForm.contactPhone} onChange={(e) => setVendorForm((p) => ({ ...p, contactPhone: e.target.value }))} />
              </Field>
              <Field label="Contact email">
                <input className={inputCls()} value={vendorForm.contactEmail} onChange={(e) => setVendorForm((p) => ({ ...p, contactEmail: e.target.value }))} />
              </Field>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
              <input type="checkbox" checked={vendorForm.isActive} onChange={(e) => setVendorForm((p) => ({ ...p, isActive: e.target.checked }))} />
              Active
            </label>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={saveVendor} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                {editVendorId ? "Update" : "Create"} vendor
              </button>
              <button type="button" onClick={() => { setVendorForm(emptyVendor); setEditVendorId(""); }} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">
                Reset
              </button>
            </div>
          </div>
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {vendors.map((v) => (
              <li key={v._id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold text-slate-900">{v.name}</p>
                <p className="text-xs text-slate-500">Admin: {v.adminPhone || "—"} · {v.isActive ? "Active" : "Inactive"}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="text-xs font-semibold text-sky-700" onClick={() => { setEditVendorId(v._id); setVendorForm({ name: v.name, contactPhone: v.contactPhone || "", contactEmail: v.contactEmail || "", adminPhone: v.adminPhone || "", isActive: v.isActive !== false }); }}>Edit</button>
                  <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => deleteEntity("vendors", v._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === "cities" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">{editCityId ? "Edit city" : "Create city"}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="City name *">
                <input className={inputCls()} value={cityForm.name} onChange={(e) => setCityForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label="State">
                <input className={inputCls()} value={cityForm.state} onChange={(e) => setCityForm((p) => ({ ...p, state: e.target.value }))} />
              </Field>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={saveCity} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                {editCityId ? "Update" : "Create"} city
              </button>
              <button type="button" onClick={() => { setCityForm(emptyCity); setEditCityId(""); }} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">
                Reset
              </button>
            </div>
          </div>
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {cities.map((c) => (
              <li key={c._id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold">{c.name}{c.state ? `, ${c.state}` : ""}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="text-xs font-semibold text-sky-700" onClick={() => { setEditCityId(c._id); setCityForm({ name: c.name, state: c.state || "", country: c.country || "India", isActive: c.isActive !== false, sortOrder: c.sortOrder || 0 }); }}>Edit</button>
                  <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => deleteEntity("cities", c._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {section === "locations" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">{editLocationId ? "Edit location" : "Create location"}</p>
            <div className="mt-3 grid gap-3">
              <Field label="City *">
                <select className={inputCls()} value={locationForm.city} onChange={(e) => setLocationForm((p) => ({ ...p, city: e.target.value }))}>
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}{c.state ? `, ${c.state}` : ""}</option>
                  ))}
                </select>
              </Field>
              <Field label="Location name *">
                <input className={inputCls()} value={locationForm.name} onChange={(e) => setLocationForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Kempegowda Airport T1" />
              </Field>
              <Field label="Address">
                <input className={inputCls()} value={locationForm.address} onChange={(e) => setLocationForm((p) => ({ ...p, address: e.target.value }))} />
              </Field>
              <Field label="Pincode">
                <input className={inputCls()} value={locationForm.pincode} onChange={(e) => setLocationForm((p) => ({ ...p, pincode: e.target.value }))} />
              </Field>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={saveLocation} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
                {editLocationId ? "Update" : "Create"} location
              </button>
              <button type="button" onClick={() => { setLocationForm(emptyLocation); setEditLocationId(""); }} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">
                Reset
              </button>
            </div>
          </div>
          <ul className="max-h-80 space-y-2 overflow-y-auto">
            {locations.map((loc) => (
              <li key={loc._id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                <p className="font-semibold text-slate-900">{loc.name}</p>
                <p className="text-xs text-slate-500">{loc.cityName}{loc.address ? ` · ${loc.address}` : ""}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="text-xs font-semibold text-sky-700" onClick={() => { setEditLocationId(loc._id); setLocationForm({ city: String(loc.city), name: loc.name, address: loc.address || "", pincode: loc.pincode || "", isActive: loc.isActive !== false }); }}>Edit</button>
                  <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => deleteEntity("locations", loc._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

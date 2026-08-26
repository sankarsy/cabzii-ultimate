"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AdminHomeCards from "./AdminHomeCards";
import AdminDriverAccounts from "./AdminDriverAccounts";
import { MASTER_HOME_CARD_SECTIONS, MASTER_SECTION_KEYS, MASTER_SECTION_LABELS } from "../../lib/adminMasterConfig";

const emptyVendor = {
  name: "",
  contactPhone: "",
  contactEmail: "",
  adminPhone: "",
  adminPassword: "",
  adminPasswordConfirm: "",
  city: "",
  location: "",
  driverPhone: "",
  isActive: true
};
const emptyCity = {
  name: "",
  slug: "",
  state: "",
  country: "India",
  isActive: true,
  sortOrder: 0,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  content: "",
  image: "",
  banner: "",
  airportDetails: "",
  popularLocations: "",
  popularRoutes: "",
  popularPackages: ""
};
const emptyLocation = { city: "", cityInput: "", name: "", address: "", pincode: "", isActive: true };

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

function PasswordField({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <Field label={label}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className={`${inputCls()} pr-10`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-800"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

function locationCityId(loc) {
  if (!loc?.city) return "";
  if (typeof loc.city === "object") return String(loc.city._id || loc.city.id || "");
  return String(loc.city);
}

export default function AdminMasterData({ token, isSuperAdmin, initialSection = "vendors", focusCreateVendor = false }) {
  const [section, setSection] = useState(initialSection);
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
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    if (initialSection && MASTER_SECTION_KEYS.includes(initialSection)) {
      setSection(isSuperAdmin ? initialSection : "drivers");
    }
  }, [initialSection, isSuperAdmin]);

  useEffect(() => {
    if (focusCreateVendor && isSuperAdmin) {
      setSection("vendors");
      setEditVendorId("");
      setVendorForm(emptyVendor);
    }
  }, [focusCreateVendor, isSuperAdmin]);

  const saveVendor = async () => {
    if (!vendorForm.name.trim()) {
      setMessage("Vendor name is required.");
      return;
    }
    if (!vendorForm.adminPhone.trim()) {
      setMessage("Admin phone is required for partner login.");
      return;
    }
    if (!editVendorId && !vendorForm.adminPassword) {
      setMessage("Set a login password for the vendor admin.");
      return;
    }
    if (vendorForm.adminPassword && vendorForm.adminPassword.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (vendorForm.adminPassword && vendorForm.adminPassword !== vendorForm.adminPasswordConfirm) {
      setMessage("Password and re-enter password do not match.");
      return;
    }
    if (vendorForm.driverPhone && vendorForm.driverPhone.replace(/\D/g, "") === vendorForm.adminPhone.replace(/\D/g, "")) {
      setMessage("Driver login phone must be different from the vendor admin phone.");
      return;
    }
    const url = editVendorId ? `/api/vendors/${editVendorId}` : "/api/vendors";
    const method = editVendorId ? "PUT" : "POST";
    const payload = { ...vendorForm };
    delete payload.adminPasswordConfirm;
    if (editVendorId && !payload.adminPassword) delete payload.adminPassword;
    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
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
    const payload = {
      ...cityForm,
      popularLocations: String(cityForm.popularLocations || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      popularRoutes: String(cityForm.popularRoutes || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      popularPackages: String(cityForm.popularPackages || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    };
    const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
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
  const filteredVendors = useMemo(
    () => vendors.filter((v) => `${v.name} ${v.adminPhone} ${v.contactPhone} ${v.city} ${v.location}`.toLowerCase().includes(search.toLowerCase())),
    [vendors, search]
  );
  const filteredCities = useMemo(
    () => cities.filter((c) => `${c.name} ${c.state}`.toLowerCase().includes(search.toLowerCase())),
    [cities, search]
  );
  const filteredLocations = useMemo(
    () => locations.filter((l) => `${l.name} ${l.cityName} ${l.address}`.toLowerCase().includes(search.toLowerCase())),
    [locations, search]
  );

  if (!isSuperAdmin) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Drivers</p>
          <p className="text-xs text-slate-600">Create and update drivers for your vendor. Super-admin master data is restricted.</p>
        </div>
        <AdminDriverAccounts token={token} isSuperAdmin={false} cities={cities} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MASTER_SECTION_KEYS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSection(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${
              section === tab ? "bg-sky-600 text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {MASTER_SECTION_LABELS[tab] || tab}
          </button>
        ))}
        {section === "vendors" ? (
          <button
            type="button"
            onClick={() => {
              setEditVendorId("");
              setVendorForm(emptyVendor);
              document.getElementById("vendor-admin-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Create vendor admin
          </button>
        ) : null}
      </div>
      {!MASTER_HOME_CARD_SECTIONS.includes(section) && section !== "drivers" ? (
        <input className={inputCls()} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${section}...`} />
      ) : null}

      {message ? <p className="text-sm text-slate-700">{message}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      {section === "vendors" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div id="vendor-admin-form" className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">{editVendorId ? "Edit vendor admin" : "Create vendor admin"}</p>
            <p className="mt-1 text-xs text-slate-600">
              Sets vendor name, city/location, admin mobile login and password. Partner signs in at{" "}
              <span className="font-mono text-sky-800">/login?role=partner</span>. Optional driver login is{" "}
              <span className="font-mono text-sky-800">/driver/login</span> (use a different mobile).
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Vendor name *">
                <input className={inputCls()} value={vendorForm.name} onChange={(e) => setVendorForm((p) => ({ ...p, name: e.target.value }))} placeholder="ABC Travels Chennai" />
              </Field>
              <Field label="Admin phone (vendor login) *">
                <input className={inputCls()} value={vendorForm.adminPhone} onChange={(e) => setVendorForm((p) => ({ ...p, adminPhone: e.target.value }))} placeholder="10-digit mobile (not your super admin phone)" />
              </Field>
              <PasswordField
                label={editVendorId ? "New login password (optional)" : "Admin login password *"}
                value={vendorForm.adminPassword}
                onChange={(e) => setVendorForm((p) => ({ ...p, adminPassword: e.target.value }))}
                placeholder={editVendorId ? "Leave blank to keep current" : "Min 6 characters"}
              />
              <PasswordField
                label="Re-enter password"
                value={vendorForm.adminPasswordConfirm}
                onChange={(e) => setVendorForm((p) => ({ ...p, adminPasswordConfirm: e.target.value }))}
                placeholder={editVendorId ? "Required only if changing password" : "Type password again"}
              />
              <Field label="City / base location">
                <input
                  className={inputCls()}
                  list="vendor-city-options"
                  value={vendorForm.city}
                  onChange={(e) => setVendorForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Type city e.g. Chennai"
                />
                <datalist id="vendor-city-options">
                  {cities.map((c) => (
                    <option key={c._id} value={c.name} />
                  ))}
                </datalist>
              </Field>
              <Field label="Location / address">
                <input className={inputCls()} value={vendorForm.location} onChange={(e) => setVendorForm((p) => ({ ...p, location: e.target.value }))} placeholder="Office, landmark or area" />
              </Field>
              <Field label="Driver login phone (optional)">
                <input className={inputCls()} value={vendorForm.driverPhone} onChange={(e) => setVendorForm((p) => ({ ...p, driverPhone: e.target.value }))} placeholder="Different 10-digit mobile for /driver/login" />
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
                {editVendorId ? "Update vendor admin" : "Create vendor admin"}
              </button>
              <button type="button" onClick={() => { setVendorForm(emptyVendor); setEditVendorId(""); }} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">
                Reset
              </button>
            </div>
          </div>
          <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600">
                <tr><th className="px-3 py-2 text-left">Vendor</th><th className="px-3 py-2 text-left">Phone</th><th className="px-3 py-2 text-left">City</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-left">Actions</th></tr>
              </thead>
              <tbody>
            {filteredVendors.map((v) => (
              <tr key={v._id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 font-semibold">{v.name}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{v.adminPhone || v.contactPhone || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{v.city || "—"}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${v.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>{v.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                  <button type="button" className="text-xs font-semibold text-sky-700" onClick={() => { setEditVendorId(v._id); setVendorForm({ name: v.name, contactPhone: v.contactPhone || "", contactEmail: v.contactEmail || "", adminPhone: v.adminPhone || "", adminPassword: "", adminPasswordConfirm: "", city: v.city || "", location: v.location || "", driverPhone: v.driverPhone || "", isActive: v.isActive !== false }); }}>Edit</button>
                  <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => deleteEntity("vendors", v._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
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
              <Field label="Slug">
                <input className={inputCls()} value={cityForm.slug} onChange={(e) => setCityForm((p) => ({ ...p, slug: e.target.value }))} placeholder="chennai" />
              </Field>
              <Field label="State">
                <input className={inputCls()} value={cityForm.state} onChange={(e) => setCityForm((p) => ({ ...p, state: e.target.value }))} />
              </Field>
              <Field label="Meta title">
                <input className={inputCls()} value={cityForm.metaTitle} onChange={(e) => setCityForm((p) => ({ ...p, metaTitle: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Meta description">
                  <textarea className={inputCls()} rows={2} value={cityForm.metaDescription} onChange={(e) => setCityForm((p) => ({ ...p, metaDescription: e.target.value }))} />
                </Field>
              </div>
              <Field label="Keywords">
                <input className={inputCls()} value={cityForm.keywords} onChange={(e) => setCityForm((p) => ({ ...p, keywords: e.target.value }))} />
              </Field>
              <Field label="Image URL">
                <input className={inputCls()} value={cityForm.image} onChange={(e) => setCityForm((p) => ({ ...p, image: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Content (HTML)">
                  <textarea className={inputCls()} rows={4} value={cityForm.content} onChange={(e) => setCityForm((p) => ({ ...p, content: e.target.value }))} />
                </Field>
              </div>
              <Field label="Airport details">
                <input className={inputCls()} value={cityForm.airportDetails} onChange={(e) => setCityForm((p) => ({ ...p, airportDetails: e.target.value }))} />
              </Field>
              <Field label="Popular locations (comma-separated)">
                <input className={inputCls()} value={cityForm.popularLocations} onChange={(e) => setCityForm((p) => ({ ...p, popularLocations: e.target.value }))} />
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
          <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600">
                <tr><th className="px-3 py-2 text-left">City</th><th className="px-3 py-2 text-left">State</th><th className="px-3 py-2 text-left">Actions</th></tr>
              </thead>
              <tbody>
            {filteredCities.map((c) => (
              <tr key={c._id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 font-semibold">{c.name}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{c.state || "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                  <button type="button" className="text-xs font-semibold text-sky-700" onClick={() => { setEditCityId(c._id); setCityForm({ ...emptyCity, ...c, popularLocations: (c.popularLocations || []).join(", "), popularRoutes: (c.popularRoutes || []).join(", "), popularPackages: (c.popularPackages || []).join(", ") }); }}>Edit</button>
                  <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => deleteEntity("cities", c._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {section === "locations" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-800">{editLocationId ? "Edit location" : "Create location"}</p>
            <div className="mt-3 grid gap-3">
              <Field label="City *">
                <input
                  className={inputCls()}
                  list="location-city-options"
                  value={locationForm.cityInput || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const match = cities.find(
                      (c) => c.name === val || `${c.name}${c.state ? `, ${c.state}` : ""}` === val
                    );
                    setLocationForm((p) => ({ ...p, city: match?._id || val, cityInput: val }));
                  }}
                  placeholder="Type or pick a city"
                />
                <datalist id="location-city-options">
                  {cities.map((c) => (
                    <option key={c._id} value={c.state ? `${c.name}, ${c.state}` : c.name} />
                  ))}
                </datalist>
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
          <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-100 text-xs uppercase text-slate-600">
                <tr><th className="px-3 py-2 text-left">Location</th><th className="px-3 py-2 text-left">City</th><th className="px-3 py-2 text-left">Address</th><th className="px-3 py-2 text-left">Actions</th></tr>
              </thead>
              <tbody>
            {filteredLocations.map((loc) => (
              <tr key={loc._id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 font-semibold text-slate-900">{loc.name}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{loc.cityName || "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-600">{loc.address || "—"}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                  <button type="button" className="text-xs font-semibold text-sky-700" onClick={() => { setEditLocationId(loc._id); setLocationForm({ city: locationCityId(loc), cityInput: loc.cityName || "", name: loc.name, address: loc.address || "", pincode: loc.pincode || "", isActive: loc.isActive !== false }); }}>Edit</button>
                  <button type="button" className="text-xs font-semibold text-rose-700" onClick={() => deleteEntity("locations", loc._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {MASTER_HOME_CARD_SECTIONS.includes(section) ? <AdminHomeCards token={token} section={section} /> : null}
      {section === "drivers" && <AdminDriverAccounts token={token} isSuperAdmin cities={cities} />}
    </div>
  );
}

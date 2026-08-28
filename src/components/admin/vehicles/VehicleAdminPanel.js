"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { resolveMediaUrl } from "../../../lib/media";
import {
  buildVehicleListUrl,
  DEFAULT_HQ_CITY,
  emptyVehicleForm,
  SORT_OPTIONS,
  VEHICLE_CATEGORY_OPTIONS,
  VEHICLE_STATUS_OPTIONS,
  AVAILABILITY_STATUS_OPTIONS,
  vehicleFromApi,
  vehicleToPayload,
  VEHICLE_TABS
} from "../../../lib/vehicleAdminConfig";
import { TAMIL_NADU_CITIES } from "../../../lib/tamilNaduCities";
import { SEO_CITIES } from "../../../lib/seo/cities";
import AdminSearchSelect from "../AdminSearchSelect";
import VehicleForm from "./VehicleForm";
import AdminPackageExcelToolbar from "../AdminPackageExcelToolbar";

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-100 text-amber-800",
    sky: "bg-sky-100 text-sky-800",
    emerald: "bg-emerald-100 text-emerald-800",
    rose: "bg-rose-100 text-rose-800"
  };
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${tones[tone] || tones.slate}`}>{children}</span>;
}

export default function VehicleAdminPanel({
  token,
  isSuperAdmin,
  initialEditId = "",
  pageMode = "list"
}) {
  const router = useRouter();
  const authHeaders = useMemo(() => (token ? { authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {}), [token]);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(pageMode === "create" || pageMode === "edit");
  const [activeTab, setActiveTab] = useState("basic");
  const [editingId, setEditingId] = useState(initialEditId || "");

  const formMethods = useForm({ defaultValues: emptyVehicleForm() });
  const { reset, handleSubmit } = formMethods;

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [vendor, setVendor] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [availabilityStatus, setAvailabilityStatus] = useState("");
  const [featured, setFeatured] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [cityOptions, setCityOptions] = useState(() => [
    DEFAULT_HQ_CITY,
    ...TAMIL_NADU_CITIES.map((c) => c.name),
    ...SEO_CITIES.map((c) => c.name)
  ]);
  const [vendorOptions, setVendorOptions] = useState(["Cabzii"]);
  const [categoryOptions, setCategoryOptions] = useState(VEHICLE_CATEGORY_OPTIONS);
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadList = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = buildVehicleListUrl({
        page,
        q,
        city,
        vendor,
        brand,
        category,
        status,
        availabilityStatus,
        sort,
        featured: featured || undefined,
        recommended: recommended || undefined,
        bestseller: bestseller || undefined
      });
      const res = await fetch(url, { headers: authHeaders });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load vehicles");
      const rows = Array.isArray(json.data) ? json.data : [];
      setItems(rows);
      setMeta(json.meta || { page: 1, totalPages: 1, total: rows.length });
      setCityOptions((prev) => {
        const next = new Set(prev);
        rows.forEach((row) => {
          if (row.city) next.add(row.city);
        });
        return [...next];
      });
      setVendorOptions((prev) => {
        const next = new Set(prev);
        rows.forEach((row) => {
          if (row.vendor) next.add(row.vendor);
        });
        return [...next];
      });
      setCategoryOptions((prev) => {
        const next = new Set(prev);
        rows.forEach((row) => {
          if (row.category) next.add(row.category);
          if (row.type) next.add(row.type);
        });
        return [...next];
      });
    } catch (err) {
      toast.error(err.message || "Could not load vehicles");
    } finally {
      setLoading(false);
    }
  }, [token, authHeaders, page, q, city, vendor, brand, category, status, availabilityStatus, sort, featured, recommended, bestseller]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const [citiesRes, vendorsRes] = await Promise.all([
          fetch("/api/cities?active=0&limit=200", { headers: { authorization: authHeaders.authorization }, cache: "no-store" }),
          fetch("/api/vendors?active=0", { headers: { authorization: authHeaders.authorization }, cache: "no-store" })
        ]);
        const citiesJson = await citiesRes.json().catch(() => ({}));
        const vendorsJson = await vendorsRes.json().catch(() => ({}));
        if (cancelled) return;
        const apiCities = Array.isArray(citiesJson?.data) ? citiesJson.data.map((c) => c.name).filter(Boolean) : [];
        const apiVendors = Array.isArray(vendorsJson?.data) ? vendorsJson.data.map((v) => v.name).filter(Boolean) : [];
        setCityOptions((prev) => [...new Set([DEFAULT_HQ_CITY, ...apiCities, ...prev])]);
        setVendorOptions((prev) => [...new Set(["Cabzii", ...apiVendors, ...prev])]);
      } catch {
        /* presets already loaded */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, authHeaders.authorization]);
  useEffect(() => {
    if (pageMode === "create") {
      reset(emptyVehicleForm());
      setEditingId("");
      setFormOpen(true);
      setActiveTab("basic");
    }
  }, [pageMode, reset]);

  useEffect(() => {
    if (!initialEditId || !token) return;
    (async () => {
      try {
        const res = await fetch(`/api/cabs/${initialEditId}?admin=1`, { headers: authHeaders });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Not found");
        reset(vehicleFromApi(json.data));
        setEditingId(json.data._id || json.data.id || initialEditId);
        setFormOpen(true);
        setActiveTab("basic");
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, [initialEditId, token, authHeaders, reset]);

  const openCreate = () => {
    reset(emptyVehicleForm());
    setEditingId("");
    setFormOpen(true);
    setActiveTab("basic");
    router.push("/admin?tab=cabs&mode=create");
  };

  const openEdit = async (item) => {
    setEditingId(item._id || item.id);
    reset(vehicleFromApi(item));
    setFormOpen(true);
    setActiveTab("basic");
    router.push(`/admin?tab=cabs&mode=edit&edit=${item._id || item.id}`);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId("");
    router.push("/admin?tab=cabs&mode=list");
  };

  const validate = (form, { silent = false } = {}) => {
    if (!form.title?.trim()) return "Vehicle title is required";
    if (!form.brand?.trim()) return "Brand is required";
    if (!form.city?.trim()) return "City is required";
    if (!form.category?.trim()) return "Category is required";
    if (Number(form.price) < 0) return "Price cannot be negative";
    if (Number(form.seats) < 1) return "Seats is required";
    if (Number(form.discountPercentage) > 100) return "Discount cannot exceed 100%";
    for (const p of form.packages || []) {
      if (Number(p.price) > Number(p.originalPrice) && Number(p.originalPrice) > 0) {
        return `Package "${p.packageName || p.packageType}" price cannot exceed original price`;
      }
    }
    if (form.status === "active") {
      const packs = form.farePackages && typeof form.farePackages === "object" ? form.farePackages : {};
      const hasFare =
        Number(form.price) > 0 ||
        Number(form.startingPrice) > 0 ||
        Object.values(packs).some((p) => Number(p?.price || p?.originalPrice || 0) > 0);
      if (!hasFare) return "Pricing is required before setting Active";
    }
    // Enterprise SEO required fields (skip for drafts so vendors can save incomplete inventory)
    if (!silent && form.status === "active") {
      if (!form.seoTitle?.trim()) return "SEO Title is required — open the SEO tab";
      if (!form.seoDescription?.trim()) return "Meta Description is required — open the SEO tab";
      if (!form.slug?.trim()) return "Slug is required — open the SEO tab";
      if (!form.canonicalUrl?.trim()) return "Canonical URL is required — open the SEO tab";
      if (!form.h1?.trim()) return "H1 is required — fill Page content on Basic Info or SEO tab";
      if ((form.seoTitle || "").length > 70) return "SEO Title is too long (keep under 70 characters)";
      if ((form.seoDescription || "").length > 180) return "Meta Description is too long (keep under 180 characters)";
    }
    return null;
  };

  const persistVehicle = async (form, { silent = false } = {}) => {
    const err = validate(form, { silent });
    if (err) {
      if (!silent) toast.warn(err);
      return false;
    }
    if (!silent) setSaving(true);
    try {
      const payload = vehicleToPayload(form);
      const isEdit = Boolean(editingId);
      const res = await fetch(isEdit ? `/api/cabs/${editingId}` : "/api/cabs", {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Save failed");
      if (!silent) toast.success(isEdit ? "Vehicle updated" : "Vehicle created");
      else toast.info("SEO autosaved", { autoClose: 1200 });
      reset(vehicleFromApi(json.data));
      setEditingId(json.data._id || json.data.id);
      await loadList();
      if (!isEdit && !silent) closeForm();
      return true;
    } catch (e) {
      if (!silent) toast.error(e.message || "Save failed");
      return false;
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const save = handleSubmit(async (form) => {
    await persistVehicle(form, { silent: false });
  });

  const requestSilentSave = () => {
    const values = formMethods.getValues();
    if (!editingId) return;
    void persistVehicle(values, { silent: true });
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.title}?`)) return;
    try {
      const res = await fetch(`/api/cabs/${item._id || item.id}`, { method: "DELETE", headers: authHeaders });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Delete failed");
      toast.success("Vehicle deleted");
      await loadList();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const duplicate = async (item) => {
    try {
      const res = await fetch(`/api/cabs/${item._id || item.id}/duplicate`, { method: "POST", headers: authHeaders });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Duplicate failed");
      toast.success("Vehicle duplicated");
      await loadList();
      openEdit(json.data);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const previewPublic = (item) => {
    const slug = item.slug || item._id || item.id;
    window.open(`/cabs/${slug}`, "_blank");
  };

  const setPageCitiesToChennai = async () => {
    const targets = items.filter((item) => String(item.city || "").trim().toLowerCase() !== DEFAULT_HQ_CITY.toLowerCase());
    if (!targets.length) {
      toast.info(`All vehicles on this page already use ${DEFAULT_HQ_CITY}`);
      return;
    }
    if (
      !window.confirm(
        `Set city to ${DEFAULT_HQ_CITY} for ${targets.length} vehicle(s) on this page? (HQ focus — does not delete packages)`
      )
    ) {
      return;
    }
    setBulkBusy(true);
    let ok = 0;
    try {
      for (const item of targets) {
        const payload = vehicleToPayload({ ...vehicleFromApi(item), city: DEFAULT_HQ_CITY });
        const res = await fetch(`/api/cabs/${item._id || item.id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload)
        });
        if (res.ok) ok += 1;
      }
      toast.success(`Updated ${ok} vehicle(s) to ${DEFAULT_HQ_CITY}`);
      await loadList();
    } catch (e) {
      toast.error(e.message || "Bulk city update failed");
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vehicle management</h1>
        <p className="text-sm text-slate-600">
            {isSuperAdmin === false
              ? "Add each physical vehicle separately. Force Traveller #1 and #2 must be two records. Draft stays off the public site until name, seats and pricing are complete. A photo is optional."
              : `Edit fleet city under Basic Info. HQ default: ${DEFAULT_HQ_CITY}. Path: Admin → Cabs.`}
          </p>
        </div>
          <button type="button" onClick={openCreate} className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            + Add vehicle
          </button>
      </div>

      {!formOpen ? (
        <AdminPackageExcelToolbar
          tabKey="cabs"
          items={items}
          token={token}
          canEdit={isSuperAdmin !== false}
          onImported={loadList}
        />
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Search name, plate, brand, slug, code…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <AdminSearchSelect
            value={city}
            options={cityOptions}
            placeholder="Filter city…"
            allowCustom
            onChange={(v) => { setCity(v); setPage(1); }}
          />
          {isSuperAdmin !== false ? (
          <AdminSearchSelect
            value={vendor}
            options={vendorOptions}
            placeholder="Filter vendor…"
            allowCustom
            onChange={(v) => { setVendor(v); setPage(1); }}
          />
          ) : null}
          <input className="rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Brand" value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }} />
          <AdminSearchSelect
            value={category}
            options={categoryOptions}
            placeholder="Filter vehicle type…"
            allowCustom
            onChange={(v) => { setCategory(v); setPage(1); }}
          />
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All status</option>
            {VEHICLE_STATUS_OPTIONS.filter((o) => isSuperAdmin !== false || !o.adminOnly).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={availabilityStatus} onChange={(e) => { setAvailabilityStatus(e.target.value); setPage(1); }}>
            <option value="">All availability</option>
            {AVAILABILITY_STATUS_OPTIONS.filter((o) => isSuperAdmin !== false || !o.adminOnly).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-1"><input type="checkbox" checked={featured} onChange={(e) => { setFeatured(e.target.checked); setPage(1); }} /> Featured</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={recommended} onChange={(e) => { setRecommended(e.target.checked); setPage(1); }} /> Recommended</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={bestseller} onChange={(e) => { setBestseller(e.target.checked); setPage(1); }} /> Bestseller</label>
          </div>
        </div>
        {isSuperAdmin !== false && !formOpen ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <button
              type="button"
              disabled={bulkBusy || loading || !items.length}
              onClick={() => { setCity("Salem"); setPage(1); }}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Find Salem vehicles
            </button>
            <button
              type="button"
              disabled={bulkBusy || loading || !items.length}
              onClick={setPageCitiesToChennai}
              className="rounded-lg border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 disabled:opacity-50"
            >
              {bulkBusy ? "Updating…" : `Set this page → ${DEFAULT_HQ_CITY}`}
            </button>
            <p className="text-[11px] text-slate-500">Tip: filter City = Salem, then click Set this page → Chennai.</p>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading vehicles…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No vehicles found. Run seed or add a vehicle.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Vehicle</th>
                  <th className="px-3 py-3">Number</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">City</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Availability</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id || item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img loading="lazy" src={resolveMediaUrl(item.image)} alt="" className="h-12 w-16 rounded-lg border object-cover" />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">No img</div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{item.vehicleName || item.title}</div>
                          <div className="text-xs text-slate-500">{item.productCode || item.slug}</div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.featured ? <Badge tone="amber">Featured</Badge> : null}
                            {item.recommended ? <Badge tone="sky">Recommended</Badge> : null}
                            {item.bestseller ? <Badge tone="emerald">Bestseller</Badge> : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{item.registrationNumber || "—"}</td>
                    <td className="px-3 py-3">{item.category || item.type || "—"}</td>
                    <td className="px-3 py-3">{item.city || "—"}</td>
                    <td className="px-3 py-3">
                      <Badge tone={item.status === "active" ? "emerald" : item.status === "draft" || item.status === "under_verification" ? "amber" : "rose"}>{item.status || "active"}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={item.availabilityStatus === "available" || !item.availabilityStatus ? "emerald" : item.availabilityStatus === "busy" ? "sky" : "slate"}>
                        {item.availabilityStatus || "available"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button type="button" onClick={() => openEdit(item)} className="rounded border px-2 py-1 text-xs hover:bg-white">Edit</button>
                        <button type="button" onClick={() => duplicate(item)} className="rounded border px-2 py-1 text-xs hover:bg-white">Duplicate</button>
                        <button type="button" onClick={() => previewPublic(item)} className="rounded border px-2 py-1 text-xs hover:bg-white">Preview</button>
                        <button type="button" onClick={() => remove(item)} className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {meta.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
            <span className="text-slate-600">{meta.total} vehicles · page {meta.page}/{meta.totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-3 py-1 disabled:opacity-40">Prev</button>
              <button type="button" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded border px-3 py-1 disabled:opacity-40">Next</button>
            </div>
          </div>
        ) : null}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="flex h-[98vh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[96vh] sm:rounded-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-5">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit vehicle" : "New vehicle"}</h2>
              <button type="button" onClick={closeForm} className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100">Close</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
              <div className="mb-4 flex gap-1 overflow-x-auto">
                {VEHICLE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold ${activeTab === tab.id ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <FormProvider {...formMethods}>
                <VehicleForm
                  activeTab={activeTab}
                  disabled={saving}
                  onRequestSave={requestSilentSave}
                  authToken={token}
                  cityOptions={cityOptions}
                  vendorOptions={vendorOptions}
                  categoryOptions={categoryOptions}
                  isSuperAdmin={isSuperAdmin !== false}
                />
              </FormProvider>
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 px-4 py-3 sm:px-5">
              <button type="button" onClick={closeForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
              <button type="button" disabled={saving} onClick={save} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                {saving ? "Saving…" : "Save vehicle"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

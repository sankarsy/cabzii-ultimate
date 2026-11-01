"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, MapPin, Plus, RefreshCw, Search } from "../../icons/rscIcons";
import { buildCatalogListUrl } from "../../../lib/adminCatalogConfig";
import { isSeoScopeAirportCity, isSeoScopeCity } from "../../../config/seo-scope";
import { useAdminCities } from "../../../lib/admin/useAdminCities";
import {
  CMS_SERVICE_MODULES,
  buildCmsServiceRows,
  seoTypesOf,
  suggestCmsCopy
} from "../../../lib/admin/cmsServiceCatalog";
import { clearPathPageSeo, deleteSeoSnippet, saveSeoSnippet } from "../../../lib/admin/adminSeoApi";
import AdminSeoSnippetEditor from "../AdminSeoSnippetEditor";
import CitySelect from "./CitySelect";

const STATUS_STYLES = {
  complete: "bg-emerald-100 text-emerald-800",
  partial: "bg-amber-100 text-amber-800",
  auto: "bg-slate-100 text-slate-600"
};

function inputCls() {
  return "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100";
}

function chipCls(active) {
  return `inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-[11px] font-semibold transition ${
    active ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
  }`;
}

async function fetchAdminList(url, token) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: token ? { authorization: `Bearer ${token}` } : {}
  });
  const json = await res.json();
  if (!res.ok) return [];
  return Array.isArray(json?.data) ? json.data : [];
}

export default function AdminCmsServicePages({ token, moduleKey = "cab" }) {
  const module = CMS_SERVICE_MODULES[moduleKey] || CMS_SERVICE_MODULES.cab;
  const { cities: allCities, loading: citiesLoading, error: citiesError } = useAdminCities({
    token,
    activeOnly: false,
    service: module.serviceFlag
  });
  const cities = useMemo(
    () =>
      allCities.filter((city) =>
        module.key === "airport" ? isSeoScopeAirportCity(city.slug) : isSeoScopeCity(city.slug)
      ),
    [allCities, module.key]
  );

  const [cityPages, setCityPages] = useState([]);
  const [seoServices, setSeoServices] = useState([]);
  const [pageSeo, setPageSeo] = useState({});
  const [loadingLists, setLoadingLists] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorRow, setEditorRow] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    citySlug: "",
    typeId: module.types[0]?.id || "",
    productName: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    intro: "",
    html: "",
    published: true
  });

  const loadLists = useCallback(async () => {
    if (!token) {
      setLoadingLists(false);
      return;
    }
    setLoadingLists(true);
    try {
      const [pages, services, settingsRes] = await Promise.all([
        fetchAdminList(`${buildCatalogListUrl("seoCityPages")}&limit=500`, token),
        fetchAdminList(`${buildCatalogListUrl("seoServices")}&limit=200`, token),
        fetch("/api/site-settings", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" })
      ]);
      let stored = {};
      if (settingsRes.ok) {
        const json = await settingsRes.json();
        stored = json?.data?.pageSeo || {};
      }
      setCityPages(pages);
      setSeoServices(services);
      setPageSeo(stored);
    } catch {
      setError("Could not load CMS pages.");
    } finally {
      setLoadingLists(false);
    }
  }, [token]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const rows = useMemo(
    () => buildCmsServiceRows({ moduleKey: module.key, cities, cityPages, seoServices, pageSeo }),
    [module.key, cities, cityPages, seoServices, pageSeo]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (cityFilter !== "all" && row.citySlug !== cityFilter) return false;
      if (typeFilter !== "all" && row.typeId !== typeFilter) return false;
      if (statusFilter !== "all" && row.seoStatus !== statusFilter) return false;
      if (!q) return true;
      return `${row.cityName} ${row.typeLabel} ${row.seoTitle} ${row.path}`.toLowerCase().includes(q);
    });
  }, [rows, query, cityFilter, typeFilter, statusFilter]);

  const seoTypes = seoTypesOf(module);
  const selectedCreateType = seoTypes.find((type) => type.id === createForm.typeId) || seoTypes[0];
  const selectedCreateCity = cities.find((city) => city.slug === createForm.citySlug);

  const openCreate = (row) => {
    const type = seoTypes.find((item) => item.id === (row?.typeId || seoTypes[0]?.id)) || seoTypes[0];
    const city = cities.find((item) => item.slug === (row?.citySlug || ""));
    const suggested = city ? suggestCmsCopy(type, city) : {};
    setCreateForm({
      citySlug: row?.citySlug || "",
      typeId: type.id,
      productName: row?.productName || suggested.productName || "",
      seoTitle: row?.seoTitle || suggested.seoTitle || "",
      seoDescription: row?.seoDescription || suggested.seoDescription || "",
      seoKeywords: row?.seoKeywords || suggested.seoKeywords || "",
      intro: row?.intro || "",
      html: row?.html || "",
      published: true
    });
    setCreateOpen(true);
    setEditorRow(null);
    setError("");
    setMessage("");
  };

  const applySuggest = () => {
    if (!selectedCreateCity || !selectedCreateType) return;
    setCreateForm((prev) => ({ ...prev, ...suggestCmsCopy(selectedCreateType, selectedCreateCity) }));
  };

  const saveRow = async (row, form) => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await saveSeoSnippet({ row, form, token, pageSeo });
      if (result?.pageSeo) setPageSeo(result.pageSeo);
      setMessage(`Saved SEO for ${row.path}.`);
      await loadLists();
      setEditorRow(null);
      setCreateOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save SEO.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    const type = selectedCreateType;
    const city = selectedCreateCity;
    if (!type || !city) {
      setError("Select a city and a service type.");
      return;
    }
    const row = rows.find((item) => item.citySlug === city.slug && item.typeId === type.id);
    if (!row) {
      setError("That city does not have this service enabled.");
      return;
    }
    await saveRow(row, createForm);
  };

  const handleDelete = async (row) => {
    if (!token || !row) return;
    if (!window.confirm(`Delete saved SEO for ${row.typeLabel} in ${row.cityName}? The live URL stays; Google copy falls back to the template.`)) {
      return;
    }
    setError("");
    setMessage("");
    try {
      let result;
      if (row.type === "service" || !row.editId) {
        result = await clearPathPageSeo({ path: row.path, token, pageSeo });
      } else {
        result = await deleteSeoSnippet({ row: { ...row, canDelete: true }, token, pageSeo });
      }
      if (result?.pageSeo) setPageSeo(result.pageSeo);
      setMessage(`Deleted SEO override for ${row.path}.`);
      await loadLists();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  if (editorRow) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {error ? <p className="mb-3 text-sm text-rose-600">{error}</p> : null}
        {message ? <p className="mb-3 text-sm text-emerald-700">{message}</p> : null}
        <AdminSeoSnippetEditor
          row={editorRow}
          open
          token={token}
          backLabel={module.backLabel}
          onClose={() => setEditorRow(null)}
          onSave={(form) => saveRow(editorRow, form)}
          saving={saving}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">{module.title}</h1>
          <p className="text-[11px] text-slate-500">
            {filtered.length} unique URLs · {cities.length} cities
            {module.key === "cab" ? " · one taxi-service page per city." : ". Packages that share a page are not listed again."}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={loadLists}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => openCreate()}
            className="inline-flex h-8 items-center gap-1 rounded-lg bg-sky-600 px-3 text-[12px] font-semibold text-white hover:bg-sky-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>

      {createOpen ? (
        <form onSubmit={handleCreate} className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Create / publish SEO</h2>
              <p className="mt-1 text-xs text-slate-500">City and service type stay on this page. Title 50–60 · description 120–155.</p>
            </div>
            <button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100">
              Close
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-slate-600">
              City *
              <div className="mt-1">
                <CitySelect
                  token={token}
                  value={createForm.citySlug}
                  onChange={(citySlug) => setCreateForm((prev) => ({ ...prev, citySlug }))}
                  service={module.serviceFlag}
                />
              </div>
            </label>
            <label className="block text-xs font-semibold text-slate-600">
              Service type *
              <select
                className={`${inputCls()} mt-1`}
                value={createForm.typeId}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, typeId: e.target.value }))}
              >
                {seoTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            {selectedCreateCity && selectedCreateType ? (
              <button type="button" onClick={applySuggest} className="sm:col-span-2 text-left text-xs font-semibold text-sky-700 hover:underline">
                Fill ranking copy for {selectedCreateType.label} in {selectedCreateCity.name}
              </button>
            ) : null}
            <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
              Visible H1 *
              <input className={`${inputCls()} mt-1`} value={createForm.productName} onChange={(e) => setCreateForm((prev) => ({ ...prev, productName: e.target.value }))} required />
            </label>
            <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
              Meta title * <span className="font-normal text-slate-400">({createForm.seoTitle.length} chars)</span>
              <input className={`${inputCls()} mt-1`} value={createForm.seoTitle} onChange={(e) => setCreateForm((prev) => ({ ...prev, seoTitle: e.target.value }))} required />
            </label>
            <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
              Meta description * <span className="font-normal text-slate-400">({createForm.seoDescription.length} chars)</span>
              <textarea className={`${inputCls()} mt-1`} rows={3} value={createForm.seoDescription} onChange={(e) => setCreateForm((prev) => ({ ...prev, seoDescription: e.target.value }))} required />
            </label>
            <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
              Keywords
              <input className={`${inputCls()} mt-1`} value={createForm.seoKeywords} onChange={(e) => setCreateForm((prev) => ({ ...prev, seoKeywords: e.target.value }))} />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
              <input type="checkbox" checked={createForm.published !== false} onChange={(e) => setCreateForm((prev) => ({ ...prev, published: e.target.checked }))} />
              Publish now (off = save as draft)
            </label>
          </div>
          {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60">
              {saving ? "Saving…" : createForm.published !== false ? "Publish SEO" : "Save draft"}
            </button>
            <button type="button" onClick={() => setCreateOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative w-44 shrink-0">
          <Search className="pointer-events-none absolute left-2.5 top-1.5 h-3.5 w-3.5 text-slate-400" />
          <input className="h-7 w-full rounded-full border border-slate-200 bg-white pl-8 pr-3 text-[11px] text-slate-800 outline-none focus:border-sky-500" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
        </label>
        <div className="flex flex-wrap items-center gap-1">
          <button type="button" className={chipCls(cityFilter === "all")} onClick={() => setCityFilter("all")}>
            All cities
          </button>
          {cities.map((city) => (
            <button key={city.slug} type="button" className={chipCls(cityFilter === city.slug)} onClick={() => setCityFilter(city.slug)}>
              {city.name}
            </button>
          ))}
        </div>
        {seoTypes.length > 1 ? (
          <div className="flex flex-wrap items-center gap-1">
            <button type="button" className={chipCls(typeFilter === "all")} onClick={() => setTypeFilter("all")}>
              All
            </button>
            {seoTypes.map((type) => (
              <button key={type.id} type="button" className={chipCls(typeFilter === type.id)} onClick={() => setTypeFilter(type.id)}>
                {type.label}
              </button>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-1">
          {[
            { id: "all", label: "All status" },
            { id: "complete", label: "Saved" },
            { id: "partial", label: "Partial" },
            { id: "auto", label: "Not saved" }
          ].map((item) => (
            <button key={item.id} type="button" className={chipCls(statusFilter === item.id)} onClick={() => setStatusFilter(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      {citiesError ? <p className="text-sm text-rose-600">{citiesError}</p> : null}
      {citiesLoading || loadingLists ? <p className="text-sm text-slate-500">Loading all services…</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-2.5 font-semibold">City</th>
                <th className="px-4 py-2.5 font-semibold">Service</th>
                <th className="px-4 py-2.5 font-semibold">SEO title</th>
                <th className="px-4 py-2.5 font-semibold">URL</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((row) => (
                <tr key={row.id} className="align-top hover:bg-slate-50/80">
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-semibold text-slate-900">{row.cityName}</p>
                    <p className="text-[11px] text-slate-500">{row.cityActive ? "Active" : "Inactive"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{row.typeLabel}</p>
                    {row.sharedNote ? <p className="mt-0.5 text-[11px] text-slate-500">{row.sharedNote}</p> : null}
                  </td>
                  <td className="max-w-[220px] px-4 py-3 text-xs text-slate-600">{row.seoTitle || "—"}</td>
                  <td className="px-4 py-3">
                    <code className="break-all text-[11px] text-sky-800">{row.path}</code>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[row.seoStatus]}`}>
                      {row.seoStatus === "auto" ? "not saved" : row.seoStatus === "complete" ? "saved" : "partial"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <button type="button" onClick={() => setEditorRow(row)} className="text-xs font-semibold text-sky-700 hover:underline">
                        Edit SEO
                      </button>
                      <button type="button" onClick={() => openCreate(row)} className="text-xs font-semibold text-emerald-700 hover:underline">
                        {row.seoStatus === "auto" ? "Create SEO" : "Update SEO"}
                      </button>
                      <a href={row.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:underline">
                        View live <ExternalLink className="h-3 w-3" />
                      </a>
                      {row.canDelete ? (
                        <button type="button" onClick={() => handleDelete(row)} className="text-xs font-semibold text-rose-700 hover:underline">
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!citiesLoading && !loadingLists && !filtered.length ? (
          <div className="p-8 text-center">
            <MapPin className="mx-auto h-6 w-6 text-slate-400" />
            <p className="mt-2 text-sm text-slate-600">No rows match the filters. Change city or service above, or add a city in Cities.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

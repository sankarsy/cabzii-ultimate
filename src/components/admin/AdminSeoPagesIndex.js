"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clearSitePageSeo, deleteSeoSnippet, saveSeoSnippet } from "../../lib/admin/adminSeoApi";
import { buildCatalogListUrl } from "../../lib/adminCatalogConfig";
import { buildSeoPageIndex, seoIndexStats } from "../../lib/seo/seoPageIndexBuilder";
import AdminSeoSnippetEditor from "./AdminSeoSnippetEditor";

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "site", label: "Home & listings" },
  { id: "cab", label: "Cabs" },
  { id: "driver", label: "Drivers" },
  { id: "tour", label: "Tours" },
  { id: "route", label: "Routes" },
  { id: "service", label: "Services" },
  { id: "city", label: "City hubs" },
  { id: "acting-driver", label: "Acting driver" },
  { id: "blog", label: "Blogs" }
];

const SEO_STATUS_STYLES = {
  complete: "bg-emerald-100 text-emerald-800",
  partial: "bg-amber-100 text-amber-800",
  auto: "bg-slate-100 text-slate-600"
};

async function fetchAdminList(url, token) {
  const res = await fetch(url, {
    cache: "no-store",
    headers: token ? { authorization: `Bearer ${token}` } : {}
  });
  const json = await res.json();
  if (!res.ok) return [];
  return Array.isArray(json?.data) ? json.data : [];
}

export default function AdminSeoPagesIndex({ token = "" }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [pageSeo, setPageSeo] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editorRow, setEditorRow] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [cabs, drivers, packages, blogs, seoServices, seoRoutes, seoCityPages, settingsRes] = await Promise.all([
        fetchAdminList(`${buildCatalogListUrl("cabs")}&limit=500`, token),
        fetchAdminList(`${buildCatalogListUrl("drivers")}&limit=500`, token),
        fetchAdminList(`${buildCatalogListUrl("packages")}&limit=500`, token),
        fetchAdminList(`${buildCatalogListUrl("blogs")}&limit=200`, token),
        fetchAdminList(buildCatalogListUrl("seoServices"), token),
        fetchAdminList(buildCatalogListUrl("seoRoutes"), token),
        fetchAdminList(buildCatalogListUrl("seoCityPages"), token),
        fetch("/api/site-settings", { headers: { authorization: `Bearer ${token}` }, cache: "no-store" })
      ]);
      let storedPageSeo = {};
      if (settingsRes.ok) {
        const settingsJson = await settingsRes.json();
        storedPageSeo = settingsJson?.data?.pageSeo || {};
      }
      setPageSeo(storedPageSeo);
      setRows(
        buildSeoPageIndex({
          cabs,
          drivers,
          packages,
          blogs,
          seoServices,
          seoRoutes,
          seoCityPages,
          pageSeo: storedPageSeo
        })
      );
    } catch {
      setError("Could not load SEO page index. Refresh to retry.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const stats = useMemo(() => seoIndexStats(rows), [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (typeFilter !== "all" && row.type !== typeFilter) return false;
      if (statusFilter !== "all" && row.seoStatus !== statusFilter) return false;
      if (campaignFilter === "ready" && row.seoStatus !== "complete") return false;
      if (campaignFilter === "needs-work" && row.seoStatus === "complete") return false;
      if (!q) return true;
      return (
        row.productName?.toLowerCase().includes(q) ||
        row.seoTitle?.toLowerCase().includes(q) ||
        row.seoKeywords?.toLowerCase().includes(q) ||
        row.path?.toLowerCase().includes(q) ||
        row.typeLabel?.toLowerCase().includes(q)
      );
    });
  }, [rows, query, typeFilter, statusFilter, campaignFilter]);

  const handleSave = async (form) => {
    if (!editorRow || !token) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const result = await saveSeoSnippet({ row: editorRow, form, token, pageSeo });
      if (result?.pageSeo) setPageSeo(result.pageSeo);
      setMessage(`Saved SEO for ${editorRow.path}. Google & ads will update after revalidation (~1 min).`);
      setEditorRow(null);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save SEO.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!token || !row) return;
    if (!window.confirm(`Delete CMS SEO record for ${row.path}? The page will fall back to built-in template.`)) return;
    setError("");
    setMessage("");
    try {
      await deleteSeoSnippet({ row, token });
      setMessage(`Deleted SEO override for ${row.path}.`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  const handleClearSiteOverride = async (row) => {
    if (!token || row.type !== "site") return;
    if (!window.confirm(`Reset ${row.path} to default SEO template?`)) return;
    try {
      const result = await clearSitePageSeo({ row, token, pageSeo });
      if (result?.pageSeo) setPageSeo(result.pageSeo);
      setMessage(`Reset ${row.path} to defaults.`);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--cabzii-shadow-card)] sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Google & Meta Ads — SEO dashboard</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Manage every page that appears in Google search and ad campaigns. Create, update or delete meta title,
            description and keywords — the same fields shown in your Google snippet.
          </p>
          {!loading && rows.length ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">{stats.total} URLs</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-800">{stats.complete} campaign-ready</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800">{stats.partial} partial</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">{stats.auto} auto</span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin?tab=cabs&mode=create" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">
            + Cab
          </Link>
          <Link href="/admin?tab=seoServices&mode=create" className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">
            + Service
          </Link>
          <Link href="/admin?tab=seoCityPages&mode=create" className="rounded-lg bg-[var(--cabzii-brand)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--cabzii-brand-hover)]">
            + City SEO
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product name, meta title, keywords or URL…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-600 xl:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTypeFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                typeFilter === f.id ? "bg-[var(--cabzii-brand)] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
        >
          <option value="all">All SEO status</option>
          <option value="complete">Complete SEO</option>
          <option value="partial">Partial SEO</option>
          <option value="auto">Auto only</option>
        </select>
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
        >
          <option value="all">All pages</option>
          <option value="ready">Campaign-ready only</option>
          <option value="needs-work">Needs SEO work</option>
        </select>
        <button type="button" onClick={loadAll} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
          Refresh
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {loading ? <p className="mt-4 text-sm text-slate-500">Loading all products and SEO pages…</p> : null}

      <p className="mt-3 text-xs text-slate-500">
        Showing {filtered.length} of {rows.length} entries — click <strong>Edit SEO</strong> to update Google snippet fields inline
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Type</th>
              <th className="px-3 py-2.5 font-semibold">Product name</th>
              <th className="px-3 py-2.5 font-semibold">Meta title</th>
              <th className="px-3 py-2.5 font-semibold">Meta description</th>
              <th className="px-3 py-2.5 font-semibold">Keywords</th>
              <th className="px-3 py-2.5 font-semibold">URL</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.slice(0, 400).map((row) => (
              <tr key={row.id} className="align-top hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-3 py-2 text-xs font-medium text-slate-500">{row.typeLabel}</td>
                <td className="max-w-[140px] px-3 py-2 font-medium text-slate-900">{row.productName}</td>
                <td className="max-w-[180px] px-3 py-2 text-xs text-slate-700">{row.seoTitleDisplay}</td>
                <td className="max-w-[200px] px-3 py-2 text-xs text-slate-600">{row.seoDescriptionDisplay}</td>
                <td className="max-w-[140px] px-3 py-2 text-xs text-slate-600">{row.seoKeywordsDisplay}</td>
                <td className="max-w-[160px] px-3 py-2">
                  <code className="break-all text-[11px] text-sky-800">{row.path}</code>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${SEO_STATUS_STYLES[row.seoStatus] || SEO_STATUS_STYLES.auto}`}>
                    {row.seoStatus}
                  </span>
                  <p className="mt-1 text-[10px] text-slate-500">{row.sourceLabel}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <div className="flex flex-col gap-1">
                    <button type="button" onClick={() => setEditorRow(row)} className="text-left text-xs font-semibold text-[var(--cabzii-brand)] hover:underline">
                      Edit SEO
                    </button>
                    <a href={row.path} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-700 hover:underline">
                      View live
                    </a>
                    {row.type !== "site" ? (
                      <Link href={row.editHref} className="text-xs font-semibold text-emerald-700 hover:underline">
                        Full edit
                      </Link>
                    ) : null}
                    {row.canDelete ? (
                      <button type="button" onClick={() => handleDelete(row)} className="text-left text-xs font-semibold text-rose-700 hover:underline">
                        Delete
                      </button>
                    ) : null}
                    {row.canClearOverride ? (
                      <button type="button" onClick={() => handleClearSiteOverride(row)} className="text-left text-xs font-semibold text-amber-700 hover:underline">
                        Reset to default
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 400 ? (
        <p className="mt-2 text-xs text-amber-700">Showing first 400 matches — use search or filters to narrow down.</p>
      ) : null}

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-xs text-sky-900">
          <p className="font-semibold">Google Ads checklist</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-sky-800">
            <li>Homepage + /cabs — use as main landing pages (matches your Google snippet)</li>
            <li>Meta title = ad headline source · Meta description = ad description source</li>
            <li>Filter &quot;Campaign-ready&quot; for pages with title + description + keywords</li>
            <li>Export keywords from each row into Google Ads keyword lists</li>
          </ul>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-xs text-violet-900">
          <p className="font-semibold">Meta (Facebook/Instagram) Ads checklist</p>
          <ul className="mt-1 list-inside list-disc space-y-0.5 text-violet-800">
            <li>Use same meta title as primary text and description as ad copy</li>
            <li>City & service pages = location-targeted ad sets</li>
            <li>Complete SEO on all product pages before launching catalog ads</li>
          </ul>
        </div>
      </div>

      <AdminSeoSnippetEditor row={editorRow} open={Boolean(editorRow)} onClose={() => setEditorRow(null)} onSave={handleSave} saving={saving} />
    </div>
  );
}

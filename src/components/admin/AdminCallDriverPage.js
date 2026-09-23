"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CALL_DRIVER_SERVICES } from "../../lib/callDriver";
import { DEFAULT_CALL_DRIVER_PAGE, emptyCallDriverSection, mergeCallDriverPage } from "../../lib/callDriverPage";

const SeoRichTextEditor = dynamic(() => import("./vehicles/SeoRichTextEditor"), { ssr: false });

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function Field({ label, children, hint, count }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      {count != null ? <span className="ml-2 font-normal text-slate-400">({count} chars)</span> : null}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

const TABS = [
  { id: "landing", label: "Landing copy" },
  { id: "cards", label: "Service cards" },
  { id: "google", label: "Google snippet" }
];

export default function AdminCallDriverPage({ token, isSuperAdmin }) {
  const [tab, setTab] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(DEFAULT_CALL_DRIVER_PAGE);
  const [snippet, setSnippet] = useState({
    productName: "Call Driver Service",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  });
  const [chennaiSnippet, setChennaiSnippet] = useState({
    productName: "Call Drivers in Chennai",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/site-settings", {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Could not load Call Driver page");
      const data = json.data || {};
      setPage(mergeCallDriverPage(data.callDriverPage));
      const stored = data.pageSeo?.["/call-driver"] || {};
      setSnippet({
        productName: stored.productName || "Call Driver Service",
        seoTitle: stored.seoTitle || "",
        seoDescription: stored.seoDescription || "",
        seoKeywords: stored.seoKeywords || ""
      });
      const chennai = data.pageSeo?.["/call-drivers-chennai"] || {};
      setChennaiSnippet({
        productName: chennai.productName || "Call Drivers in Chennai",
        seoTitle: chennai.seoTitle || "",
        seoDescription: chennai.seoDescription || "",
        seoKeywords: chennai.seoKeywords || ""
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!token || !isSuperAdmin) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({
          callDriverPage: page,
          pageSeo: {
            "/call-driver": {
              productName: snippet.productName,
              seoTitle: snippet.seoTitle,
              seoDescription: snippet.seoDescription,
              seoKeywords: snippet.seoKeywords
            },
            "/call-drivers-chennai": {
              productName: chennaiSnippet.productName,
              seoTitle: chennaiSnippet.seoTitle,
              seoDescription: chennaiSnippet.seoDescription,
              seoKeywords: chennaiSnippet.seoKeywords
            }
          }
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Could not save");
      setMessage("Saved. Open /call-driver to review — allow about a minute if the page is cached.");
      if (json.data?.callDriverPage) setPage(mergeCallDriverPage(json.data.callDriverPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const patchService = (id, patch) => {
    setPage((p) => ({
      ...p,
      services: {
        ...(p.services || {}),
        [id]: { ...(p.services?.[id] || {}), ...patch }
      }
    }));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Call Driver page</h2>
          <p className="mt-1 text-sm text-slate-600">
            Edits the public page at{" "}
            <Link href="/call-driver" className="font-semibold text-sky-700 hover:underline" target="_blank">
              /call-driver
            </Link>
            . Rates stay in Settings → Call Driver tariff. Booking-form SEO is Settings → Call Driver SEO.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin?tab=settings" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Tariff & booking SEO
          </Link>
          <Link href="/admin?tab=seoPagesHub" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            All Google pages
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              tab === t.id ? "bg-[var(--cabzii-brand)] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
      {loading ? <p className="mt-4 text-sm text-slate-500">Loading…</p> : null}

      {!loading && tab === "landing" ? (
        <div className="mt-5 max-w-3xl space-y-4">
          <Field label="Page H1">
            <input className={inputCls()} value={page.title} onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Subtitle under H1">
            <input className={inputCls()} value={page.subtitle} onChange={(e) => setPage((p) => ({ ...p, subtitle: e.target.value }))} />
          </Field>
          <Field label="Intro line above service cards">
            <textarea className={inputCls()} rows={3} value={page.intro} onChange={(e) => setPage((p) => ({ ...p, intro: e.target.value }))} />
          </Field>
          <div>
            <p className="text-xs font-semibold text-slate-700">SEO sections below the cards</p>
            <div className="mt-2 space-y-4">
              {(page.sections || []).map((section, index) => (
                <div key={index} className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">Section {index + 1}</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-rose-600"
                      onClick={() => setPage((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== index) }))}
                    >
                      Remove
                    </button>
                  </div>
                  <Field label="Heading (H2)">
                    <input
                      className={inputCls()}
                      value={section.heading}
                      onChange={(e) =>
                        setPage((p) => ({
                          ...p,
                          sections: p.sections.map((row, i) => (i === index ? { ...row, heading: e.target.value } : row))
                        }))
                      }
                    />
                  </Field>
                  <div className="mt-2">
                    <Field label="Body">
                      <SeoRichTextEditor
                        value={section.body || ""}
                        onChange={(body) =>
                          setPage((p) => ({
                            ...p,
                            sections: p.sections.map((row, i) => (i === index ? { ...row, body } : row))
                          }))
                        }
                        disabled={!isSuperAdmin}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 text-xs font-semibold text-[var(--cabzii-brand)] hover:underline"
              onClick={() => setPage((p) => ({ ...p, sections: [...(p.sections || []), emptyCallDriverSection()] }))}
            >
              + Add section
            </button>
          </div>
        </div>
      ) : null}

      {!loading && tab === "cards" ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {CALL_DRIVER_SERVICES.map((svc) => {
            const row = page.services?.[svc.id] || {};
            return (
              <div key={svc.id} className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-900">{svc.title}</p>
                <p className="mb-2 text-[11px] text-slate-500">Blank fields keep the default card text.</p>
                <Field label="Card title">
                  <input className={inputCls()} value={row.title || ""} placeholder={svc.title} onChange={(e) => patchService(svc.id, { title: e.target.value })} />
                </Field>
                <div className="mt-2">
                  <Field label="Short description">
                    <textarea className={inputCls()} rows={2} value={row.blurb || ""} placeholder={svc.blurb} onChange={(e) => patchService(svc.id, { blurb: e.target.value })} />
                  </Field>
                </div>
                <div className="mt-2">
                  <Field label="Button text">
                    <input className={inputCls()} value={row.cta || ""} placeholder={svc.cta} onChange={(e) => patchService(svc.id, { cta: e.target.value })} />
                  </Field>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {!loading && tab === "google" ? (
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Booking hub · /call-driver</h3>
          <Field label="Product / H1 name">
            <input className={inputCls()} value={snippet.productName} onChange={(e) => setSnippet((p) => ({ ...p, productName: e.target.value }))} />
          </Field>
          <Field label="Meta title" hint="Google blue link — about 50–60 characters" count={snippet.seoTitle.length}>
            <input className={inputCls()} value={snippet.seoTitle} onChange={(e) => setSnippet((p) => ({ ...p, seoTitle: e.target.value }))} />
          </Field>
          <Field label="Meta description" hint="About 120–155 characters" count={snippet.seoDescription.length}>
            <textarea className={inputCls()} rows={3} value={snippet.seoDescription} onChange={(e) => setSnippet((p) => ({ ...p, seoDescription: e.target.value }))} />
          </Field>
          <Field label="Keywords (comma-separated)">
            <textarea className={inputCls()} rows={2} value={snippet.seoKeywords} onChange={(e) => setSnippet((p) => ({ ...p, seoKeywords: e.target.value }))} />
          </Field>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Google preview</p>
            <p className="mt-2 text-base font-medium text-[#1a0dab]">{snippet.seoTitle || "Meta title"}</p>
            <p className="text-xs text-[#006621]">cabzii.in/call-driver</p>
            <p className="mt-1 text-sm text-slate-600">{snippet.seoDescription || "Meta description appears here."}</p>
          </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Ranking page · /call-drivers-chennai</h3>
            <p className="text-xs text-slate-500">This URL is the acting-driver landing — same role as the Chennai Travels page that ranks for “outstation acting driver”.</p>
            <Field label="Product / H1 name">
              <input className={inputCls()} value={chennaiSnippet.productName} onChange={(e) => setChennaiSnippet((p) => ({ ...p, productName: e.target.value }))} />
            </Field>
            <Field label="Meta title" hint="Aim for 50–60 characters" count={chennaiSnippet.seoTitle.length}>
              <input className={inputCls()} value={chennaiSnippet.seoTitle} onChange={(e) => setChennaiSnippet((p) => ({ ...p, seoTitle: e.target.value }))} />
            </Field>
            <Field label="Meta description" hint="About 120–155 characters" count={chennaiSnippet.seoDescription.length}>
              <textarea className={inputCls()} rows={3} value={chennaiSnippet.seoDescription} onChange={(e) => setChennaiSnippet((p) => ({ ...p, seoDescription: e.target.value }))} />
            </Field>
            <Field label="Keywords (comma-separated)">
              <textarea className={inputCls()} rows={2} value={chennaiSnippet.seoKeywords} onChange={(e) => setChennaiSnippet((p) => ({ ...p, seoKeywords: e.target.value }))} />
            </Field>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">Google preview</p>
              <p className="mt-2 text-base font-medium text-[#1a0dab]">{chennaiSnippet.seoTitle || "Meta title"}</p>
              <p className="text-xs text-[#006621]">cabzii.in/call-drivers-chennai</p>
              <p className="mt-1 text-sm text-slate-600">{chennaiSnippet.seoDescription || "Meta description appears here."}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={save}
          disabled={saving || !isSuperAdmin || loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Call Driver page"}
        </button>
        {!isSuperAdmin ? <p className="text-xs text-slate-500">Super admin only.</p> : null}
      </div>
    </div>
  );
}

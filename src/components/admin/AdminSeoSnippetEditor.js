"use client";

import { useEffect, useState } from "react";

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

export default function AdminSeoSnippetEditor({ row, open, onClose, onSave, saving = false }) {
  const [form, setForm] = useState({
    productName: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: ""
  });

  useEffect(() => {
    if (!row || !open) return;
    setForm({
      productName: row.productName || "",
      seoTitle: row.seoTitle || "",
      seoDescription: row.seoDescription || "",
      seoKeywords: row.seoKeywords || ""
    });
  }, [row, open]);

  if (!open || !row) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.typeLabel}</p>
              <h3 className="text-lg font-bold text-slate-900">Edit Google snippet</h3>
              <code className="mt-1 block text-xs text-sky-800">{row.path}</code>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <Field label="Product / page name" hint="Shown as H1 or page title on the site">
            <input className={inputCls()} value={form.productName} onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))} />
          </Field>
          <Field label="Meta title *" hint="Google blue link — aim for 50–60 characters" count={form.seoTitle.length}>
            <input className={inputCls()} value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} required />
          </Field>
          <Field label="Meta description *" hint="Snippet under title — 120–155 characters for ads & SEO" count={form.seoDescription.length}>
            <textarea className={inputCls()} rows={3} value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} required />
          </Field>
          <Field label="Search keywords" hint="Comma-separated — use in Google Ads & Meta Ads keyword lists">
            <textarea className={inputCls()} rows={2} value={form.seoKeywords} onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))} placeholder="cab booking chennai, airport taxi, cabzii" />
          </Field>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Google preview</p>
            <p className="mt-2 text-base font-medium text-[#1a0dab]">{form.seoTitle || "Meta title"}</p>
            <p className="text-xs text-[#006621]">cabzii.in{row.path === "/" ? "" : row.path}</p>
            <p className="mt-1 text-sm text-slate-600">{form.seoDescription || "Meta description appears here."}</p>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save SEO"}
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

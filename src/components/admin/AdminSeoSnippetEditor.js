"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import AdminPageLinksEditor from "./AdminPageLinksEditor";
import { defaultPageLinkGroups, normalizePageLinkGroups } from "../../lib/seo/pageLinks";
import { normalizeFaqs } from "../../lib/admin/adminSeoApi";

const SeoRichTextEditor = dynamic(() => import("./vehicles/SeoRichTextEditor"), { ssr: false });

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function Field({ label, children, hint, count, ok }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      {label}
      {count != null ? (
        <span className={`ml-2 font-normal ${ok ? "text-emerald-600" : "text-amber-600"}`}>({count} chars)</span>
      ) : null}
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function editorPageKind(row) {
  if (!row) return "cabs";
  if (row.path === "/") return "home";
  if (row.type === "driver" || row.type === "acting-driver") return "drivers";
  if (row.type === "tour") return "packages";
  if (row.type === "landing") return "cabs";
  return "cabs";
}

function emptyFaq() {
  return { question: "", answer: "" };
}

export default function AdminSeoSnippetEditor({ row, open, onClose, onSave, saving = false }) {
  const [form, setForm] = useState({
    productName: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    intro: "",
    html: "",
    faqs: [emptyFaq()],
    pageLinks: [],
    ctaHref: "/cabs",
    ctaLabel: "Book now"
  });

  useEffect(() => {
    if (!row || !open) return;
    const kind = editorPageKind(row);
    const storedLinks = normalizePageLinkGroups(row.pageLinks);
    const faqs = normalizeFaqs(row.faqs);
    setForm({
      productName: row.productName || row.h1 || "",
      seoTitle: row.seoTitle || "",
      seoDescription: row.seoDescription || "",
      seoKeywords: row.seoKeywords || "",
      intro: row.intro || "",
      html: row.html || row.body || "",
      faqs: faqs.length ? faqs : [emptyFaq()],
      pageLinks: storedLinks.length ? storedLinks : defaultPageLinkGroups(row.path, kind, row.citySlug || ""),
      ctaHref: row.ctaHref || "/cabs",
      ctaLabel: row.ctaLabel || "Book now"
    });
  }, [row, open]);

  if (!open || !row) return null;

  const titleOk = form.seoTitle.length >= 50 && form.seoTitle.length <= 60;
  const descOk = form.seoDescription.length >= 120 && form.seoDescription.length <= 155;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      faqs: normalizeFaqs(form.faqs),
      pageLinks: normalizePageLinkGroups(form.pageLinks)
    });
  };

  const updateFaq = (index, key, value) => {
    setForm((p) => ({
      ...p,
      faqs: p.faqs.map((faq, i) => (i === index ? { ...faq, [key]: value } : faq))
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.typeLabel}</p>
              <h3 className="text-lg font-bold text-slate-900">Edit ranking SEO</h3>
              <code className="mt-1 block text-xs text-sky-800">{row.path}</code>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Same SEO type on every page: visible H1, title 50–60 characters, description 120–155, keywords, intro, body, FAQs, hub links.
          </p>

          <Field label="Visible H1 *" hint="On-page heading Google matches to the query">
            <input className={inputCls()} value={form.productName} onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))} required />
          </Field>
          <Field label="Meta title *" hint="Google blue link — 50–60 characters" count={form.seoTitle.length} ok={titleOk}>
            <input className={inputCls()} value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} required />
          </Field>
          <Field label="Meta description *" hint="Snippet under the title — 120–155 characters" count={form.seoDescription.length} ok={descOk}>
            <textarea className={inputCls()} rows={3} value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} required />
          </Field>
          <Field label="Search keywords" hint="Comma-separated">
            <textarea className={inputCls()} rows={2} value={form.seoKeywords} onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))} placeholder="acting driver in chennai, outstation acting driver, cabzii" />
          </Field>
          <Field label="Intro paragraph" hint="Lead under the H1">
            <textarea className={inputCls()} rows={3} value={form.intro} onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))} />
          </Field>

          {row.type === "landing" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Book button URL">
                <input className={inputCls()} value={form.ctaHref} onChange={(e) => setForm((p) => ({ ...p, ctaHref: e.target.value }))} />
              </Field>
              <Field label="Book button label">
                <input className={inputCls()} value={form.ctaLabel} onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))} />
              </Field>
            </div>
          ) : null}

          <div>
            <p className="text-xs font-semibold text-slate-600">Body HTML</p>
            <div className="mt-1 rounded-lg border border-slate-200">
              <SeoRichTextEditor value={form.html} onChange={(html) => setForm((p) => ({ ...p, html }))} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">FAQs</p>
              <button
                type="button"
                className="text-xs font-semibold text-sky-700 hover:underline"
                onClick={() => setForm((p) => ({ ...p, faqs: [...p.faqs, emptyFaq()] }))}
              >
                + Add FAQ
              </button>
            </div>
            <div className="mt-2 space-y-3">
              {form.faqs.map((faq, index) => (
                <div key={`faq-${index}`} className="rounded-lg border border-slate-200 p-3">
                  <input
                    className={inputCls()}
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaq(index, "question", e.target.value)}
                  />
                  <textarea
                    className={`${inputCls()} mt-2`}
                    rows={2}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  />
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-rose-700 hover:underline"
                    onClick={() => setForm((p) => ({ ...p, faqs: p.faqs.filter((_, i) => i !== index) }))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">Google preview</p>
            <p className="mt-2 text-base font-medium text-[#1a0dab]">{form.seoTitle || "Meta title"}</p>
            <p className="text-xs text-[#006621]">cabzii.in{row.path === "/" ? "" : row.path}</p>
            <p className="mt-1 text-sm text-slate-600">{form.seoDescription || "Meta description appears here."}</p>
          </div>

          <AdminPageLinksEditor
            groups={form.pageLinks}
            onChange={(pageLinks) => setForm((p) => ({ ...p, pageLinks }))}
            onLoadDefaults={() =>
              setForm((p) => ({
                ...p,
                pageLinks: defaultPageLinkGroups(row.path, editorPageKind(row), row.citySlug || "")
              }))
            }
          />

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

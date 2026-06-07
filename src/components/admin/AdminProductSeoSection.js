"use client";

import { previewCatalogSlug } from "../../lib/catalogProduct";

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
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

/**
 * MrMed-style product SEO block for cabs, drivers, and holiday packages.
 */
export function AdminProductSeoSection({ form, onChange, pathPrefix, titleField = "title", cityField = "city" }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const previewSlug = previewCatalogSlug(form, titleField, cityField);
  const publicPath = previewSlug ? `${pathPrefix}/${previewSlug}` : pathPrefix;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-semibold text-slate-800">Google SEO & product details</p>
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
        <span className="font-semibold">Public URL:</span> <span className="font-mono">{publicPath}</span>
        <span className="text-sky-700"> · Included in sitemap when active</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="URL slug" hint="Auto from name + city if empty">
          <input className={inputCls()} value={form.slug || ""} onChange={(e) => set({ slug: e.target.value })} placeholder={previewSlug || "maruti-dzire-taxi-chennai"} />
        </Field>
        <Field label="Product code" hint="Internal SKU / reference">
          <input className={inputCls()} value={form.productCode || ""} onChange={(e) => set({ productCode: e.target.value })} />
        </Field>
        <Field label="Brand name" hint="Vendor or fleet brand for SEO">
          <input className={inputCls()} value={form.brandName || ""} onChange={(e) => set({ brandName: e.target.value })} placeholder={form.vendor || ""} />
        </Field>
        <Field label="Speciality" hint="e.g. Sedan, SUV, Pilgrimage">
          <input className={inputCls()} value={form.speciality || ""} onChange={(e) => set({ speciality: e.target.value })} />
        </Field>
        <Field label="Condition / use case" hint="e.g. Airport, Outstation, Diabetes">
          <input className={inputCls()} value={form.condition || ""} onChange={(e) => set({ condition: e.target.value })} />
        </Field>
        <Field label="Country of origin">
          <input className={inputCls()} value={form.countryOfOrigin || "India"} onChange={(e) => set({ countryOfOrigin: e.target.value })} />
        </Field>
        <Field label="Image alt text" hint="For Google Images & accessibility">
          <input className={inputCls()} value={form.imageAlt || ""} onChange={(e) => set({ imageAlt: e.target.value })} />
        </Field>
        <Field label="Image title">
          <input className={inputCls()} value={form.imageTitle || ""} onChange={(e) => set({ imageTitle: e.target.value })} />
        </Field>
        <Field label="Tax %">
          <input type="number" min={0} max={100} className={inputCls()} value={form.taxPercent ?? 5} onChange={(e) => set({ taxPercent: Number(e.target.value) })} />
        </Field>
        <Field label="SEO title" hint="Google search title — 50–60 chars ideal">
          <input className={inputCls()} value={form.seoTitle || ""} onChange={(e) => set({ seoTitle: e.target.value })} />
        </Field>
        <Field label="SEO keywords" hint="Comma-separated, e.g. buy X online, X price">
          <input className={inputCls()} value={form.seo || ""} onChange={(e) => set({ seo: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="SEO description" hint="Meta description — 150–160 chars ideal">
            <textarea className={inputCls()} rows={2} value={form.seoDescription || ""} onChange={(e) => set({ seoDescription: e.target.value })} />
          </Field>
        </div>
      </div>
    </div>
  );
}

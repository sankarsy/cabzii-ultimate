"use client";

import { previewCatalogSlug } from "../../lib/catalogProduct";
import { resolveMediaUrl } from "../../lib/media";
import { stockImageForProduct } from "../../lib/vehicleImages";

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
 * MrMed-style SEO & catalog fields for cabs, drivers, and tour packages.
 */
export function AdminProductSeoSection({
  form,
  onChange,
  pathPrefix,
  titleField = "title",
  cityField = "city",
  productNameLabel = "Product name",
  hideProductName = false,
  createdAt,
  updatedAt
}) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const previewSlug = previewCatalogSlug(form, titleField, cityField);
  const publicPath = previewSlug ? `${pathPrefix}/${previewSlug}` : pathPrefix;
  const productName = form[titleField] || form.name || "";
  const previewImage = resolveMediaUrl(form.image) || stockImageForProduct(form);

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <p className="text-sm font-semibold text-slate-800">SEO & catalog (Google ranking)</p>
      <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
        <span className="font-semibold">Public URL:</span> <span className="font-mono">{publicPath}</span>
        <span className="text-sky-700"> · Slug: {form.slug || previewSlug || "auto"}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {!hideProductName ? (
          <div className="sm:col-span-2">
            <Field label={`${productNameLabel} *`} hint="Customer-facing title on website">
              <input
                className={inputCls()}
                value={productName}
                onChange={(e) => set({ [titleField]: e.target.value, ...(titleField !== "name" ? { name: e.target.value } : {}) })}
              />
            </Field>
          </div>
        ) : null}
        <Field label="Slug" hint="URL path — auto from name + city if empty">
          <input className={inputCls()} value={form.slug || ""} onChange={(e) => set({ slug: e.target.value })} placeholder={previewSlug || "maruti-dzire-taxi-chennai"} />
        </Field>
        <Field label="Product code" hint="Internal SKU">
          <input className={inputCls()} value={form.productCode || ""} onChange={(e) => set({ productCode: e.target.value })} />
        </Field>
        <Field label="Speciality" hint="e.g. Airport taxi, Outstation, Sedan">
          <input className={inputCls()} value={form.speciality || ""} onChange={(e) => set({ speciality: e.target.value })} placeholder={form.type || "Sedan"} />
        </Field>
        <Field label="Condition / use case" hint="Comma-separated — e.g. Airport, Business, Family">
          <input className={inputCls()} value={form.condition || ""} onChange={(e) => set({ condition: e.target.value })} placeholder="Airport, Outstation, Local" />
        </Field>
        <Field label="Brand name" hint="Vendor or fleet brand">
          <input className={inputCls()} value={form.brandName || ""} onChange={(e) => set({ brandName: e.target.value })} placeholder={form.vendor || ""} />
        </Field>
        <Field label="Image alt text" hint="Google Images & accessibility">
          <input className={inputCls()} value={form.imageAlt || ""} onChange={(e) => set({ imageAlt: e.target.value })} placeholder={`${productName || "Cab"} rental photo`} />
        </Field>
        <Field label="Image title">
          <input className={inputCls()} value={form.imageTitle || ""} onChange={(e) => set({ imageTitle: e.target.value })} placeholder={productName || ""} />
        </Field>
        <Field label="SEO title *" hint="Google blue link — 50–60 chars">
          <input className={inputCls()} value={form.seoTitle || ""} onChange={(e) => set({ seoTitle: e.target.value })} placeholder={`${productName || "Cab"}: Book Online | Cabzii`} />
        </Field>
        <Field label="Keywords" hint="Comma-separated search queries">
          <input className={inputCls()} value={form.seo || ""} onChange={(e) => set({ seo: e.target.value })} placeholder={`${productName}, cab booking, taxi ${form.city || "chennai"}`} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="SEO description *" hint="Google snippet — 120–155 characters">
            <textarea className={inputCls()} rows={2} value={form.seoDescription || ""} onChange={(e) => set({ seoDescription: e.target.value })} />
          </Field>
        </div>
        {createdAt || updatedAt ? (
          <>
            <Field label="Created at">
              <input className={inputCls()} value={createdAt || "—"} readOnly disabled />
            </Field>
            <Field label="Updated at">
              <input className={inputCls()} value={updatedAt || "—"} readOnly disabled />
            </Field>
          </>
        ) : null}
        {form.image || productName ? (
          <div className="sm:col-span-2">
            <p className="text-xs font-semibold text-slate-600">Image preview (uploaded or auto stock)</p>
            <img src={previewImage} alt="" className="mt-1 h-24 max-w-xs rounded-lg border border-slate-200 object-cover" onError={(e) => { e.currentTarget.src = stockImageForProduct(form); }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

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

function serviceSlugPreview(form) {
  const slug = previewCatalogSlug(form, "seoTitle", "menuCitySlug");
  const city = (form.menuCitySlug || "chennai").toLowerCase().replace(/[^a-z0-9-]/g, "");
  return `/services/${slug || "…"}/${city || "chennai"}`;
}

function routeSlugPreview(form) {
  const manual = previewCatalogSlug(form, "seoTitle");
  if (manual) return `/routes/${manual}`;
  const from = (form.fromCitySlug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const to = (form.toCitySlug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (from && to) return `/routes/${from}-to-${to}-cab`;
  return `/routes/${manual || "…"}`;
}

export function AdminSeoServiceForm({ form, onChange }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <p className="font-semibold">SEO maintenance checklist</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-emerald-800">
          <li>SEO title: 50–60 chars, city + service + cabzii.in</li>
          <li>Description & keywords auto-fill if left empty on save</li>
          <li>Published ON → live on /services/ and in sitemap</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-semibold text-slate-800">Google SEO (required for ranking)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="SEO title *" hint="Google search title — e.g. Airport Taxi Chennai: Book Online | cabzii.in">
              <input
                className={inputCls()}
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value, name: e.target.value })}
                placeholder="Airport Taxi Chennai: Book Online, Fares & 24×7 Pickup"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="SEO description *" hint="Meta description — 150–160 characters ideal">
              <textarea
                className={inputCls()}
                rows={2}
                value={form.seoDescription || ""}
                onChange={(e) => set({ seoDescription: e.target.value })}
                placeholder="Book airport taxi in Chennai with fixed fares, AC cabs and instant confirmation on cabzii.in."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="SEO keywords" hint="Comma-separated — e.g. airport taxi chennai, chennai airport cab booking">
              <input className={inputCls()} value={form.seo || ""} onChange={(e) => set({ seo: e.target.value })} />
            </Field>
          </div>
          <Field label="URL slug" hint="Auto from SEO title if empty">
            <input className={inputCls()} value={form.slug || ""} onChange={(e) => set({ slug: e.target.value })} placeholder="airport-taxi" />
          </Field>
          <Field label="Menu city slug" hint="Default city in URL & navbar">
            <input className={inputCls()} value={form.menuCitySlug || "chennai"} onChange={(e) => set({ menuCitySlug: e.target.value })} placeholder="chennai" />
          </Field>
          <div className="sm:col-span-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <span className="font-semibold">Live URL:</span>{" "}
            <span className="font-mono">{serviceSlugPreview(form)}</span>
            <span className="text-sky-700"> · Added to sitemap when published</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Price from (₹)">
          <input type="number" min={0} className={inputCls()} value={form.priceFrom ?? 0} onChange={(e) => set({ priceFrom: Number(e.target.value) })} />
        </Field>
        <Field label="Menu label" hint="Navbar text — leave blank to use SEO title">
          <input className={inputCls()} value={form.menuLabel || ""} onChange={(e) => set({ menuLabel: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Highlights" hint="Comma-separated bullet points">
            <input className={inputCls()} value={form.highlights || ""} onChange={(e) => set({ highlights: e.target.value })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Page content (optional HTML)">
            <textarea className={inputCls()} rows={4} value={form.body || ""} onChange={(e) => set({ body: e.target.value })} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.allCities !== false} onChange={(e) => set({ allCities: e.target.checked })} />
          All cities (sitemap URL per city)
        </label>
        <Field label="City slugs only" hint="If not all cities — chennai, bengaluru">
          <input className={inputCls()} value={form.citySlugs || ""} onChange={(e) => set({ citySlugs: e.target.value })} disabled={form.allCities !== false} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set({ published: e.target.checked })} />
          Published (live + sitemap)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" checked={Boolean(form.showInMenu)} onChange={(e) => set({ showInMenu: e.target.checked })} />
          Show in main menu navbar
        </label>
        <Field label="Menu sort order">
          <input type="number" className={inputCls()} value={form.menuSortOrder ?? 0} onChange={(e) => set({ menuSortOrder: Number(e.target.value) })} />
        </Field>
      </div>
    </div>
  );
}

export function AdminSeoCityPageForm({ form, onChange }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const previewPath = `/${form.pageType || "cab-booking"}/${(form.citySlug || "…").toLowerCase().replace(/[^a-z0-9-…]/g, "")}`;

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <p className="font-semibold">City page SEO</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-emerald-800">
          <li>Controls meta for /cab-booking/&#123;city&#125; or /acting-driver/&#123;city&#125;</li>
          <li>Leave a field empty to keep the website&apos;s auto-generated copy</li>
          <li>One entry per page type + city (e.g. cab-booking + chennai)</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-semibold text-slate-800">Google SEO (required for ranking)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Page type *">
            <select className={inputCls()} value={form.pageType || "cab-booking"} onChange={(e) => set({ pageType: e.target.value })}>
              <option value="cab-booking">Cab booking city (/cab-booking/…)</option>
              <option value="acting-driver">Acting driver city (/acting-driver/…)</option>
            </select>
          </Field>
          <Field label="City slug *" hint="e.g. chennai, bengaluru, madurai">
            <input className={inputCls()} value={form.citySlug || ""} onChange={(e) => set({ citySlug: e.target.value })} placeholder="chennai" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="SEO title *" hint="Google search title — 50–60 chars ideal">
              <input
                className={inputCls()}
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value })}
                placeholder="Cab Booking Chennai | Airport Taxi & Outstation | Cabzii"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="SEO description" hint="Meta description — 120–155 characters ideal">
              <textarea
                className={inputCls()}
                rows={2}
                value={form.seoDescription || ""}
                onChange={(e) => set({ seoDescription: e.target.value })}
                placeholder="Book airport taxi, local and outstation cabs in Chennai with instant confirmation on cabzii.in."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="SEO keywords" hint="Comma-separated">
              <input className={inputCls()} value={form.seo || ""} onChange={(e) => set({ seo: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <span className="font-semibold">Live URL:</span> <span className="font-mono">{previewPath}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="H1 heading override" hint="Leave blank to keep auto heading">
            <input className={inputCls()} value={form.h1 || ""} onChange={(e) => set({ h1: e.target.value })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Extra page content (optional HTML)" hint="Shown above the auto-generated city content">
            <textarea className={inputCls()} rows={4} value={form.body || ""} onChange={(e) => set({ body: e.target.value })} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set({ published: e.target.checked })} />
          Published (overrides live page meta)
        </label>
      </div>
    </div>
  );
}

export function AdminSeoRouteForm({ form, onChange }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <p className="font-semibold">SEO maintenance checklist</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-emerald-800">
          <li>SEO title: route + fare + cabzii.in</li>
          <li>From/to city slugs must match site cities (chennai, bengaluru)</li>
          <li>Published ON → appears on /routes/ and in sitemap</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-semibold text-slate-800">Google SEO (required for ranking)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="SEO title *" hint="e.g. Chennai to Bengaluru Cab: Book One-Way & Round Trip | cabzii.in">
              <input
                className={inputCls()}
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value, title: e.target.value })}
                placeholder="Chennai to Bengaluru Cab: Fares, Distance & Online Booking"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="SEO description *">
              <textarea
                className={inputCls()}
                rows={2}
                value={form.seoDescription || ""}
                onChange={(e) => set({ seoDescription: e.target.value })}
                placeholder="Book Chennai to Bengaluru cab online. Sedan, SUV & Innova with transparent fares on cabzii.in."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="SEO keywords" hint="Comma-separated">
              <input className={inputCls()} value={form.seo || ""} onChange={(e) => set({ seo: e.target.value })} />
            </Field>
          </div>
          <Field label="URL slug" hint="Auto: chennai-to-bengaluru-cab">
            <input className={inputCls()} value={form.slug || ""} onChange={(e) => set({ slug: e.target.value })} />
          </Field>
          <div className="sm:col-span-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
            <span className="font-semibold">Live URL:</span>{" "}
            <span className="font-mono">{routeSlugPreview(form)}</span>
            <span className="text-sky-700"> · Added to sitemap when published</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="From city slug *" hint="e.g. chennai">
          <input className={inputCls()} value={form.fromCitySlug || ""} onChange={(e) => set({ fromCitySlug: e.target.value })} placeholder="chennai" />
        </Field>
        <Field label="To city slug *" hint="e.g. bengaluru">
          <input className={inputCls()} value={form.toCitySlug || ""} onChange={(e) => set({ toCitySlug: e.target.value })} placeholder="bengaluru" />
        </Field>
        <Field label="Distance">
          <input className={inputCls()} value={form.distance || ""} onChange={(e) => set({ distance: e.target.value })} placeholder="350 km" />
        </Field>
        <Field label="Duration">
          <input className={inputCls()} value={form.duration || ""} onChange={(e) => set({ duration: e.target.value })} placeholder="6–7 hours" />
        </Field>
        <Field label="Sedan from (₹)">
          <input type="number" min={0} className={inputCls()} value={form.sedanFrom ?? 0} onChange={(e) => set({ sedanFrom: Number(e.target.value) })} />
        </Field>
        <Field label="SUV from (₹)">
          <input type="number" min={0} className={inputCls()} value={form.suvFrom ?? 0} onChange={(e) => set({ suvFrom: Number(e.target.value) })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Highlights" hint="Comma-separated">
            <input className={inputCls()} value={form.highlights || ""} onChange={(e) => set({ highlights: e.target.value })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Page content (optional HTML)">
            <textarea className={inputCls()} rows={4} value={form.body || ""} onChange={(e) => set({ body: e.target.value })} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set({ published: e.target.checked })} />
          Published (live + sitemap)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" checked={Boolean(form.showInMenu)} onChange={(e) => set({ showInMenu: e.target.checked })} />
          Show in main menu navbar
        </label>
        <Field label="Menu label">
          <input className={inputCls()} value={form.menuLabel || ""} onChange={(e) => set({ menuLabel: e.target.value })} />
        </Field>
        <Field label="Menu sort order">
          <input type="number" className={inputCls()} value={form.menuSortOrder ?? 0} onChange={(e) => set({ menuSortOrder: Number(e.target.value) })} />
        </Field>
      </div>
    </div>
  );
}

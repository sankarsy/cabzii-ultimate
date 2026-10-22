"use client";

import { previewCatalogSlug } from "../../lib/catalogProduct";
import { seoCityPublicPath } from "../../lib/cityCabPaths";
import { routePublicPath } from "../../lib/seo/outstationPaths";
import ImageUploadField from "./ImageUploadField";
import CitySelect from "./cms/CitySelect";

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
  if (manual) return routePublicPath(manual) || `/routes/${manual}`;
  const from = (form.fromCitySlug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  const to = (form.toCitySlug || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (from && to) return `/${from}/outstation/${from}-to-${to}`;
  return `/routes/${manual || "…"}`;
}

export function AdminSeoServiceForm({ form, onChange, authToken = "" }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const productName = form.name || form.menuLabel || "";

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <p className="font-semibold">SEO maintenance checklist</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-emerald-800">
          <li>Meta title: 50–60 chars, city + service + cabzii.in</li>
          <li>Description & keywords auto-fill if left empty on save</li>
          <li>Published ON → live on /services/ and in sitemap</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-semibold text-slate-800">Google SEO (required for ranking)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Product name *" hint="Service name shown on page — e.g. Airport Taxi Chennai">
              <input
                className={inputCls()}
                value={productName}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Airport Taxi Chennai"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta title *" hint="Google search title — e.g. Airport Taxi Chennai: Book Online | cabzii.in">
              <input
                className={inputCls()}
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value })}
                placeholder="Airport Taxi Chennai: Book Online & Fares"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta description *" hint="Google snippet — 120–155 characters ideal">
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
            <Field label="Search keywords" hint="Comma-separated — e.g. airport taxi chennai, chennai airport cab booking">
              <input className={inputCls()} value={form.seo || ""} onChange={(e) => set({ seo: e.target.value })} />
            </Field>
          </div>
          <Field label="URL slug" hint="Auto from SEO title if empty">
            <input className={inputCls()} value={form.slug || ""} onChange={(e) => set({ slug: e.target.value })} placeholder="airport-taxi" />
          </Field>
          <Field label="City *" hint="From Cities. Never type a new city here.">
            <CitySelect token={authToken} value={form.menuCitySlug || ""} onChange={(menuCitySlug) => set({ menuCitySlug })} service="cabBooking" />
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
          <Field
            label="SEO page content (HTML)"
            hint="Shown below the cab list. Paste your article (headings, lists, tables). Leave empty to hide this block."
          >
            <textarea
              className={`${inputCls()} font-mono text-[13px]`}
              rows={14}
              value={form.body || ""}
              onChange={(e) => set({ body: e.target.value })}
              placeholder={"<h2>How to Book</h2>\n<p>Write your own copy here…</p>"}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Cover photo (homepage + SEO cards)"
            hint="Shown on “Cab services in all cities” and social previews"
            value={form.image || ""}
            authToken={authToken}
            alt={form.seoTitle || form.name || "Service"}
            onChange={(image) =>
              set({
                image,
                imageAlt:
                  form.imageAlt ||
                  `${form.seoTitle || form.name || "Cabzii service"} in ${form.menuCitySlug || "India"}`
              })
            }
          />
        </div>
        <Field label="Image alt text">
          <input className={inputCls()} value={form.imageAlt || ""} onChange={(e) => set({ imageAlt: e.target.value })} />
        </Field>
        <Field label="Image title">
          <input className={inputCls()} value={form.imageTitle || ""} onChange={(e) => set({ imageTitle: e.target.value })} />
        </Field>
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

export function AdminSeoCityPageForm({ form, onChange, authToken = "" }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const previewPath = seoCityPublicPath(form.pageType || "cab-booking", form.citySlug || "chennai");

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <p className="font-semibold">City landing pages — this is the Google result for “cab booking Chennai”</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-emerald-800">
          <li>Live URL is /cab-booking/&#123;city&#125;, /acting-driver/&#123;city&#125;, or /&#123;city&#125;/airport-cab-booking</li>
          <li>Create Cab Booking + Chennai or Acting Driver + Madurai here. Empty fields keep auto-generated copy</li>
          <li>Manual SEO fields below always beat generated defaults. Publishing a draft does not overwrite them later</li>
          <li>One entry per page type + city. Super admin only</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-semibold text-slate-800">Google SEO (required for ranking)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Page type *">
            <select className={inputCls()} value={form.pageType || "cab-booking"} onChange={(e) => set({ pageType: e.target.value })}>
              <option value="cab-booking">Cab booking (/cab-booking/chennai)</option>
              <option value="airport-cab-booking">Airport cab booking (/chennai/airport-cab-booking)</option>
              <option value="acting-driver">Acting driver (/acting-driver/chennai)</option>
            </select>
          </Field>
          <Field label="City *" hint="From Cities. Never type a new city here.">
            <CitySelect token={authToken} value={form.citySlug || ""} onChange={(citySlug) => set({ citySlug })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Product name (H1)" hint="Visible heading — e.g. Best Cab Services in Chennai - Cabzii">
              <input
                className={inputCls()}
                value={form.h1 || ""}
                onChange={(e) => set({ h1: e.target.value })}
                placeholder="Best Cab Services in Chennai - Cabzii"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Lead line" hint="Under the H1">
              <input
                className={inputCls()}
                value={form.lead || ""}
                onChange={(e) => set({ lead: e.target.value })}
                placeholder="Book airport, local and outstation cabs in Chennai. Fares show before you pay."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta title *" hint="Google search title — 50–60 chars ideal">
              <input
                className={inputCls()}
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value })}
                placeholder="Cab Booking Chennai | Airport Taxi & Outstation | Cabzii"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta description" hint="Google snippet — 120–155 characters ideal">
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
            <Field label="Search keywords" hint="Comma-separated">
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
          <Field label="About this city" hint="Shown in the SEO body">
            <textarea className={inputCls()} rows={3} value={form.aboutCity || ""} onChange={(e) => set({ aboutCity: e.target.value })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Extra page content (optional HTML)" hint="Shown in the SEO article">
            <textarea className={inputCls()} rows={4} value={form.body || ""} onChange={(e) => set({ body: e.target.value })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="FAQs" hint="One per line: Question | Answer">
            <textarea className={inputCls()} rows={6} value={form.faqsText || ""} onChange={(e) => set({ faqsText: e.target.value })} placeholder={"How do I book a cab in Chennai? | Enter pickup and drop, choose a vehicle, pay 50% to confirm."} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Tourist places / common drops" hint={form.pageType === "airport-cab-booking" ? "One per line: Area | Short description" : "One per line: Place | Short description"}>
            <textarea className={inputCls()} rows={4} value={form.touristPlacesText || ""} onChange={(e) => set({ touristPlacesText: e.target.value })} placeholder={"Marina Beach | Book a local cab for the beach drop without parking hassle."} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Airport details" hint="Shown on city hub — terminal, IATA code, pickup notes">
            <textarea className={inputCls()} rows={2} value={form.airportDetails || ""} onChange={(e) => set({ airportDetails: e.target.value })} placeholder="Chennai International Airport (MAA) — domestic & international terminal pickup." />
          </Field>
        </div>
        <Field label="Popular locations" hint="Comma-separated neighbourhoods">
          <input className={inputCls()} value={form.popularLocations || ""} onChange={(e) => set({ popularLocations: e.target.value })} placeholder="OMR, Anna Nagar, T. Nagar, Maduravoyal" />
        </Field>
        <Field label="Popular routes" hint="Comma-separated route slugs or labels">
          <input className={inputCls()} value={form.popularRoutes || ""} onChange={(e) => set({ popularRoutes: e.target.value })} placeholder="chennai-to-bangalore-cab, chennai-to-pondicherry-cab" />
        </Field>
        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-800">Manual SEO override</p>
          <p className="mt-1 text-xs text-slate-500">Leave blank to use generated title, description and robots.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Canonical URL">
                <input className={inputCls()} value={form.canonicalUrl || ""} onChange={(e) => set({ canonicalUrl: e.target.value })} placeholder="https://www.cabzii.in/cab-booking/chennai" />
              </Field>
            </div>
            <Field label="OG title">
              <input className={inputCls()} value={form.ogTitle || ""} onChange={(e) => set({ ogTitle: e.target.value })} />
            </Field>
            <Field label="Twitter title">
              <input className={inputCls()} value={form.twitterTitle || ""} onChange={(e) => set({ twitterTitle: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="OG description">
                <textarea className={inputCls()} rows={2} value={form.ogDescription || ""} onChange={(e) => set({ ogDescription: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <ImageUploadField label="OG image" value={form.ogImage || ""} authToken={authToken} onChange={(ogImage) => set({ ogImage })} />
            </div>
            <div className="sm:col-span-2">
              <Field label="JSON-LD schema (optional)">
                <textarea className={inputCls()} rows={4} value={form.schemaJson || ""} onChange={(e) => set({ schemaJson: e.target.value })} placeholder="{ }" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.robotsIndex !== false} onChange={(e) => set({ robotsIndex: e.target.checked })} />
              Index
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.robotsFollow !== false} onChange={(e) => set({ robotsFollow: e.target.checked })} />
              Follow
            </label>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set({ published: e.target.checked })} />
          Published (drafts stay noindex and off the sitemap)
        </label>
      </div>
    </div>
  );
}

export function AdminSeoRouteForm({ form, onChange, authToken = "" }) {
  const set = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const routeName = form.title || "";

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
        <p className="font-semibold">SEO maintenance checklist</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-emerald-800">
          <li>Meta title: route + fare + cabzii.in</li>
          <li>From/to city slugs must match site cities (chennai, bengaluru)</li>
          <li>Published ON → live at /{"{city}"}/outstation/{"{from}-to-{to}"} and in sitemap</li>
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-semibold text-slate-800">Google SEO (required for ranking)</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Product name *" hint="Route title — e.g. Chennai to Bengaluru Cab">
              <input
                className={inputCls()}
                value={routeName}
                onChange={(e) => set({ title: e.target.value })}
                placeholder="Chennai to Bengaluru Cab"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta title *" hint="e.g. Chennai to Bengaluru Cab: Book One-Way & Round Trip | cabzii.in">
              <input
                className={inputCls()}
                value={form.seoTitle || ""}
                onChange={(e) => set({ seoTitle: e.target.value })}
                placeholder="Chennai to Bengaluru Cab: Fares, Distance & Online Booking"
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Meta description *">
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
            <Field label="Search keywords" hint="Comma-separated">
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
        <Field label="Origin city *" hint="Active cities only">
          <CitySelect token={authToken} value={form.fromCitySlug || ""} onChange={(fromCitySlug) => set({ fromCitySlug })} excludeSlug={form.toCitySlug} />
        </Field>
        <Field label="Destination city *" hint="Must be a different city">
          <CitySelect token={authToken} value={form.toCitySlug || ""} onChange={(toCitySlug) => set({ toCitySlug })} excludeSlug={form.fromCitySlug} />
        </Field>
        <Field label="Distance">
          <input className={inputCls()} value={form.distance || ""} onChange={(e) => set({ distance: e.target.value })} placeholder="350 km" />
        </Field>
        <Field label="Duration">
          <input className={inputCls()} value={form.duration || ""} onChange={(e) => set({ duration: e.target.value })} placeholder="6–7 hours" />
        </Field>
        <div className="sm:col-span-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Category fares: every Hatchback / Sedan / SUV / Van on this route shows the amount you enter. Two sedans = same sedan price.
        </div>
        <Field label="Hatchback (₹)">
          <input type="number" min={0} className={inputCls()} value={form.hatchbackFrom ?? 0} onChange={(e) => set({ hatchbackFrom: Number(e.target.value) })} />
        </Field>
        <Field label="Sedan (₹)">
          <input type="number" min={0} className={inputCls()} value={form.sedanFrom ?? 0} onChange={(e) => set({ sedanFrom: Number(e.target.value) })} />
        </Field>
        <Field label="SUV (₹)">
          <input type="number" min={0} className={inputCls()} value={form.suvFrom ?? 0} onChange={(e) => set({ suvFrom: Number(e.target.value) })} />
        </Field>
        <Field label="Van / Tempo (₹)">
          <input type="number" min={0} className={inputCls()} value={form.vanFrom ?? 0} onChange={(e) => set({ vanFrom: Number(e.target.value) })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Highlights" hint="Comma-separated">
            <input className={inputCls()} value={form.highlights || ""} onChange={(e) => set({ highlights: e.target.value })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field
            label="SEO page content (HTML)"
            hint="Shown below the cab list. Paste your article (headings, lists, tables). Leave empty to hide this block."
          >
            <textarea
              className={`${inputCls()} font-mono text-[13px]`}
              rows={14}
              value={form.body || ""}
              onChange={(e) => set({ body: e.target.value })}
              placeholder={"<h2>How to Book</h2>\n<p>Write your own copy here…</p>"}
            />
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

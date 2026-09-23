"use client";

import { useMemo, useState } from "react";
import { SEO_CITIES } from "../../lib/seo/cities";
import { createRankingSeoPage } from "../../lib/admin/adminSeoApi";

const KINDS = [
  { id: "landing", label: "Custom landing", hint: "New URL at /pages/your-slug" },
  { id: "city", label: "City cab hub", hint: "/car-rental/{city}-city-cabs" },
  { id: "acting-driver", label: "Acting driver city", hint: "/acting-driver/{city}" },
  { id: "service", label: "Service page", hint: "/services/{slug}/chennai" },
  { id: "route", label: "Route page", hint: "/routes/{from}-to-{to}-cab" }
];

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

function cityName(slug) {
  return SEO_CITIES.find((c) => c.slug === slug)?.name || slug;
}

function suggestCopy(kind, form) {
  const name = cityName(form.citySlug);
  if (kind === "acting-driver" && form.citySlug) {
    const title = `Call Drivers in ${name} | Hire Acting Drivers | Cabzii`;
    return {
      productName: `Hire Call Drivers in ${name}`,
      seoTitle: title.length <= 60 ? title : `Call Drivers in ${name} | Acting Driver | Cabzii`,
      seoDescription: `Hire a Cabzii call driver / acting driver in ${name} for your own car — city, outstation and airport. Pay 50% to confirm. Fuel and driver included; tolls extra.`,
      seoKeywords: `acting driver in ${name.toLowerCase()}, outstation acting driver, call driver ${name.toLowerCase()}, cabzii`
    };
  }
  if (kind === "city" && form.citySlug) {
    return {
      productName: `Cab booking in ${name}`,
      seoTitle: `Cab Booking in ${name} | Airport Taxi | Cabzii`.slice(0, 60),
      seoDescription: `Book airport taxi, local package and outstation cabs in ${name}. Pay 50% now. First outstation ₹500 off (CABZII500). Tolls extra.`,
      seoKeywords: `cab booking ${name.toLowerCase()}, airport taxi ${name.toLowerCase()}, outstation cab, cabzii`
    };
  }
  return null;
}

export default function AdminSeoCreatePage({ open, token, pageSeo = {}, onClose, onCreated }) {
  const [kind, setKind] = useState("landing");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    slug: "",
    citySlug: "chennai",
    fromCitySlug: "chennai",
    toCitySlug: "",
    productName: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    intro: "",
    html: "",
    ctaHref: "/cabs",
    ctaLabel: "Book now"
  });

  const cities = useMemo(() => SEO_CITIES.slice().sort((a, b) => a.name.localeCompare(b.name)), []);

  if (!open) return null;

  const applySuggest = () => {
    const next = suggestCopy(kind, form);
    if (next) setForm((p) => ({ ...p, ...next }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await createRankingSeoPage({ kind, form, token, pageSeo });
      onCreated?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create page.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Create SEO page</h3>
              <p className="mt-1 text-xs text-slate-500">Same ranking fields as every other Cabzii page. Super admin only.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {KINDS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setKind(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  kind === item.id ? "bg-[var(--cabzii-brand)] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">{KINDS.find((k) => k.id === kind)?.hint}</p>

          {kind === "landing" ? (
            <Field label="URL slug *" hint="Goes live at /pages/your-slug">
              <input className={inputCls()} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="outstation-acting-driver-chennai" required />
            </Field>
          ) : null}

          {kind === "city" || kind === "acting-driver" ? (
            <Field label="City *">
              <select className={inputCls()} value={form.citySlug} onChange={(e) => setForm((p) => ({ ...p, citySlug: e.target.value }))}>
                {cities.map((city) => (
                  <option key={city.slug} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}

          {kind === "service" ? (
            <Field label="Service slug *" hint="airport-taxi, outstation-cab, hourly-rental, car-rental">
              <input className={inputCls()} value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
            </Field>
          ) : null}

          {kind === "route" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="From city *">
                <input className={inputCls()} value={form.fromCitySlug} onChange={(e) => setForm((p) => ({ ...p, fromCitySlug: e.target.value }))} placeholder="chennai" required />
              </Field>
              <Field label="To city *">
                <input className={inputCls()} value={form.toCitySlug} onChange={(e) => setForm((p) => ({ ...p, toCitySlug: e.target.value }))} placeholder="tirupati" required />
              </Field>
            </div>
          ) : null}

          {(kind === "city" || kind === "acting-driver") && form.citySlug ? (
            <button type="button" onClick={applySuggest} className="text-xs font-semibold text-sky-700 hover:underline">
              Fill ranking copy for {cityName(form.citySlug)}
            </button>
          ) : null}

          <Field label="Visible H1 *">
            <input className={inputCls()} value={form.productName} onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))} required />
          </Field>
          <Field label="Meta title *" count={form.seoTitle.length} hint="50–60 characters">
            <input className={inputCls()} value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} required />
          </Field>
          <Field label="Meta description *" count={form.seoDescription.length} hint="120–155 characters">
            <textarea className={inputCls()} rows={3} value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} required />
          </Field>
          <Field label="Keywords">
            <textarea className={inputCls()} rows={2} value={form.seoKeywords} onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))} />
          </Field>
          <Field label="Intro">
            <textarea className={inputCls()} rows={3} value={form.intro} onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))} />
          </Field>

          {kind === "landing" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Book button URL">
                <input className={inputCls()} value={form.ctaHref} onChange={(e) => setForm((p) => ({ ...p, ctaHref: e.target.value }))} />
              </Field>
              <Field label="Book button label">
                <input className={inputCls()} value={form.ctaLabel} onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))} />
              </Field>
            </div>
          ) : null}

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
            >
              {saving ? "Creating…" : "Create page"}
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

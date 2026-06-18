"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CMS_PAGE_TYPES,
  DEFAULT_DESTINATIONS,
  ENTERPRISE_SECTIONS,
  FAQ_ENTITY_TYPES
} from "../../../lib/enterpriseAdminConfig";
import { enterpriseFetch, Field, inputCls, slugifyClient } from "./shared";

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-slate-900">{value ?? 0}</p>
    </div>
  );
}

function ListEditor({ items, onChange, fields }) {
  return (
    <div className="space-y-2">
      {(items || []).map((item, idx) => (
        <div key={idx} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              <input
                className={inputCls()}
                value={item[f.key] || ""}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], [f.key]: e.target.value };
                  onChange(next);
                }}
              />
            </Field>
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-rose-600 sm:col-span-2"
            onClick={() => onChange(items.filter((_, i) => i !== idx))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600"
        onClick={() => onChange([...(items || []), Object.fromEntries(fields.map((f) => [f.key, ""]))])}
      >
        + Add row
      </button>
    </div>
  );
}

export default function AdminEnterprise({ token, initialSection = "dashboard" }) {
  const [section, setSection] = useState(initialSection);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const [cmsPages, setCmsPages] = useState([]);
  const [cmsForm, setCmsForm] = useState({
    slug: "",
    title: "",
    pageType: "custom",
    body: "",
    seoTitle: "",
    seoDescription: "",
    published: true
  });
  const [editCmsId, setEditCmsId] = useState("");

  const [faqs, setFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "general",
    published: true,
    assignments: [{ entityType: "global", entitySlug: "" }]
  });
  const [editFaqId, setEditFaqId] = useState("");

  const [destinations, setDestinations] = useState([]);
  const [destForm, setDestForm] = useState({
    name: "",
    slug: "",
    state: "Tamil Nadu",
    description: "",
    body: "",
    seoTitle: "",
    seoDescription: "",
    featured: false,
    published: true
  });
  const [editDestId, setEditDestId] = useState("");

  const [media, setMedia] = useState([]);
  const [mediaForm, setMediaForm] = useState({ url: "", alt: "", folder: "general", tags: "" });

  const [templates, setTemplates] = useState([]);
  const [templateForm, setTemplateForm] = useState({
    key: "city-taxi",
    label: "City taxi",
    templateType: "city",
    titleTemplate: "{City} Taxi Service | Cabzii",
    descriptionTemplate: "Book cabs in {City} on cabzii.in",
    keywordsTemplate: "cab {City}, taxi {City}",
    active: true
  });

  const [gscRows, setGscRows] = useState([]);
  const [chatLeads, setChatLeads] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [bulkEntity, setBulkEntity] = useState("faqs");
  const [bulkJson, setBulkJson] = useState("[]");
  const [aiVars, setAiVars] = useState({ City: "Chennai", FromCity: "Chennai", ToCity: "Bengaluru" });
  const [aiDraft, setAiDraft] = useState(null);

  const loadDashboard = useCallback(async () => {
    const data = await enterpriseFetch("dashboard", { token });
    setDashboard(data.data);
  }, [token]);

  const loadSection = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      if (section === "dashboard") await loadDashboard();
      else if (section === "cms-pages") {
        const d = await enterpriseFetch("cms-pages?admin=1&limit=100", { token });
        setCmsPages(d.data || []);
      } else if (section === "faqs") {
        const d = await enterpriseFetch("faqs?admin=1&limit=200", { token });
        setFaqs(d.data || []);
      } else if (section === "destinations") {
        const d = await enterpriseFetch("destinations?admin=1&limit=100", { token });
        setDestinations(d.data || []);
      } else if (section === "media") {
        const d = await enterpriseFetch("media?limit=100", { token });
        setMedia(d.data || []);
      } else if (section === "seo-templates" || section === "seo-center") {
        const d = await enterpriseFetch("seo-templates", { token });
        setTemplates(d.data || []);
      } else if (section === "gsc") {
        const gsc = await enterpriseFetch("search-console?limit=50", { token });
        setGscRows(gsc.data || []);
      } else if (section === "content-health") {
        await loadDashboard();
      } else if (section === "chat-leads") {
        const d = await enterpriseFetch("chat-leads?limit=100", { token });
        setChatLeads(d.data || []);
      } else if (section === "audit-logs") {
        const d = await enterpriseFetch("audit-logs?limit=100", { token });
        setAuditLogs(d.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [section, token, loadDashboard]);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  async function saveCmsPage(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const payload = { ...cmsForm, slug: slugifyClient(cmsForm.slug || cmsForm.title) };
      if (editCmsId) await enterpriseFetch(`cms-pages/${editCmsId}`, { token, method: "PUT", body: payload });
      else await enterpriseFetch("cms-pages", { token, method: "POST", body: payload });
      setMessage("CMS page saved.");
      setEditCmsId("");
      setCmsForm({ slug: "", title: "", pageType: "custom", body: "", seoTitle: "", seoDescription: "", published: true });
      loadSection();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveFaq(e) {
    e.preventDefault();
    try {
      if (editFaqId) await enterpriseFetch(`faqs/${editFaqId}`, { token, method: "PUT", body: faqForm });
      else await enterpriseFetch("faqs", { token, method: "POST", body: faqForm });
      setMessage("FAQ saved.");
      setEditFaqId("");
      setFaqForm({ question: "", answer: "", category: "general", published: true, assignments: [{ entityType: "global", entitySlug: "" }] });
      loadSection();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveDestination(e) {
    e.preventDefault();
    try {
      const payload = { ...destForm, slug: slugifyClient(destForm.slug || destForm.name) };
      if (editDestId) await enterpriseFetch(`destinations/${editDestId}`, { token, method: "PUT", body: payload });
      else await enterpriseFetch("destinations", { token, method: "POST", body: payload });
      setMessage("Destination saved.");
      setEditDestId("");
      loadSection();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveMedia(e) {
    e.preventDefault();
    try {
      await enterpriseFetch("media", {
        token,
        method: "POST",
        body: { ...mediaForm, tags: String(mediaForm.tags || "").split(",").map((t) => t.trim()).filter(Boolean) }
      });
      setMessage("Media asset saved.");
      setMediaForm({ url: "", alt: "", folder: "general", tags: "" });
      loadSection();
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveTemplate(e) {
    e.preventDefault();
    try {
      await enterpriseFetch("seo-templates", { token, method: "POST", body: templateForm });
      setMessage("SEO template saved.");
      loadSection();
    } catch (err) {
      setError(err.message);
    }
  }

  async function runBulkImport() {
    try {
      const rows = JSON.parse(bulkJson);
      const d = await enterpriseFetch("bulk-import", { token, method: "POST", body: { entity: bulkEntity, rows } });
      setMessage(`Imported ${d.data?.imported || 0} rows.`);
      if (d.data?.errors?.length) setError(`${d.data.errors.length} rows failed.`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function runAiDraft(type) {
    try {
      const d = await enterpriseFetch("ai/draft", { token, method: "POST", body: { type, vars: aiVars } });
      setAiDraft(d.data);
      setMessage("AI draft generated (template-based).");
    } catch (err) {
      setError(err.message);
    }
  }

  async function seedDestinations() {
    try {
      const rows = DEFAULT_DESTINATIONS.map((name) => ({
        name,
        slug: slugifyClient(name),
        state: "Tamil Nadu",
        description: `${name} holiday and outstation cab packages from Cabzii.`,
        published: true,
        featured: ["Ooty", "Kodaikanal", "Munnar"].includes(name)
      }));
      const d = await enterpriseFetch("bulk-import", { token, method: "POST", body: { entity: "destinations", rows } });
      setMessage(`Seeded ${d.data?.imported || 0} destinations.`);
      loadSection();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
        <h2 className="text-lg font-bold text-slate-900">Enterprise CMS</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage all website content, SEO, FAQs, destinations, media, and analytics — no code required.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ENTERPRISE_SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSection(s.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              section === s.key ? "bg-[var(--cabzii-brand)] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {message ? <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}

      {section === "dashboard" && dashboard ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="CMS Pages" value={dashboard.counts?.cmsPages} />
            <StatCard label="FAQs" value={dashboard.counts?.faqs} />
            <StatCard label="Destinations" value={dashboard.counts?.destinations} />
            <StatCard label="Chat Leads" value={dashboard.counts?.chatLeads} />
            <StatCard label="SEO Routes" value={dashboard.counts?.seoRoutes} />
            <StatCard label="SEO Services" value={dashboard.counts?.seoServices} />
            <StatCard label="City Pages" value={dashboard.counts?.seoCityPages} />
            <StatCard label="Media Assets" value={dashboard.counts?.mediaCount} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold text-slate-900">AI Content Assistant</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Field label="City">
                <input className={inputCls()} value={aiVars.City} onChange={(e) => setAiVars((p) => ({ ...p, City: e.target.value }))} />
              </Field>
              <Field label="From city">
                <input className={inputCls()} value={aiVars.FromCity} onChange={(e) => setAiVars((p) => ({ ...p, FromCity: e.target.value }))} />
              </Field>
              <Field label="To city">
                <input className={inputCls()} value={aiVars.ToCity} onChange={(e) => setAiVars((p) => ({ ...p, ToCity: e.target.value }))} />
              </Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["city", "route", "faq", "blog"].map((t) => (
                <button key={t} type="button" onClick={() => runAiDraft(t)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
                  Generate {t}
                </button>
              ))}
            </div>
            {aiDraft ? (
              <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-800">{JSON.stringify(aiDraft, null, 2)}</pre>
            ) : null}
          </div>
        </div>
      ) : null}

      {section === "cms-pages" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={saveCmsPage} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">{editCmsId ? "Edit" : "Create"} CMS Page</h3>
            <Field label="Page type">
              <select className={inputCls()} value={cmsForm.pageType} onChange={(e) => setCmsForm((p) => ({ ...p, pageType: e.target.value }))}>
                {CMS_PAGE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Title"><input className={inputCls()} value={cmsForm.title} onChange={(e) => setCmsForm((p) => ({ ...p, title: e.target.value }))} required /></Field>
            <Field label="Slug"><input className={inputCls()} value={cmsForm.slug} onChange={(e) => setCmsForm((p) => ({ ...p, slug: e.target.value }))} placeholder="terms-and-conditions" /></Field>
            <Field label="SEO title"><input className={inputCls()} value={cmsForm.seoTitle} onChange={(e) => setCmsForm((p) => ({ ...p, seoTitle: e.target.value }))} /></Field>
            <Field label="SEO description"><textarea className={inputCls()} rows={2} value={cmsForm.seoDescription} onChange={(e) => setCmsForm((p) => ({ ...p, seoDescription: e.target.value }))} /></Field>
            <Field label="Body (HTML)"><textarea className={inputCls()} rows={8} value={cmsForm.body} onChange={(e) => setCmsForm((p) => ({ ...p, body: e.target.value }))} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cmsForm.published} onChange={(e) => setCmsForm((p) => ({ ...p, published: e.target.checked }))} /> Published</label>
            <button type="submit" className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Save page</button>
          </form>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">Existing pages</h3>
            <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto text-sm">
              {cmsPages.map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2">
                  <span><strong>{p.title}</strong> · /{p.slug}</span>
                  <button type="button" className="text-xs font-semibold text-[var(--cabzii-brand)]" onClick={() => { setEditCmsId(p._id); setCmsForm({ ...p, faqs: p.faqs || [] }); }}>Edit</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {section === "faqs" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={saveFaq} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">{editFaqId ? "Edit" : "Create"} FAQ</h3>
            <Field label="Question"><input className={inputCls()} value={faqForm.question} onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))} required /></Field>
            <Field label="Answer"><textarea className={inputCls()} rows={4} value={faqForm.answer} onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))} required /></Field>
            <Field label="Category"><input className={inputCls()} value={faqForm.category} onChange={(e) => setFaqForm((p) => ({ ...p, category: e.target.value }))} /></Field>
            <Field label="Assign to entity type">
              <select className={inputCls()} value={faqForm.assignments?.[0]?.entityType || "global"} onChange={(e) => setFaqForm((p) => ({ ...p, assignments: [{ entityType: e.target.value, entitySlug: p.assignments?.[0]?.entitySlug || "" }] }))}>
                {FAQ_ENTITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Entity slug (optional)"><input className={inputCls()} value={faqForm.assignments?.[0]?.entitySlug || ""} onChange={(e) => setFaqForm((p) => ({ ...p, assignments: [{ entityType: p.assignments?.[0]?.entityType || "global", entitySlug: e.target.value }] }))} /></Field>
            <button type="submit" className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Save FAQ</button>
          </form>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">FAQ library ({faqs.length})</h3>
            <ul className="mt-3 max-h-[32rem] space-y-2 overflow-y-auto text-sm">
              {faqs.map((f) => (
                <li key={f._id} className="rounded-lg border border-slate-100 px-3 py-2">
                  <p className="font-semibold">{f.question}</p>
                  <p className="text-slate-600">{f.answer.slice(0, 120)}…</p>
                  <button type="button" className="mt-1 text-xs font-semibold text-[var(--cabzii-brand)]" onClick={() => { setEditFaqId(f._id); setFaqForm(f); }}>Edit</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {section === "destinations" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={saveDestination} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{editDestId ? "Edit" : "Create"} Destination</h3>
              <button type="button" onClick={seedDestinations} className="text-xs font-semibold text-indigo-600">Seed popular destinations</button>
            </div>
            <Field label="Name"><input className={inputCls()} value={destForm.name} onChange={(e) => setDestForm((p) => ({ ...p, name: e.target.value }))} required /></Field>
            <Field label="Slug"><input className={inputCls()} value={destForm.slug} onChange={(e) => setDestForm((p) => ({ ...p, slug: e.target.value }))} /></Field>
            <Field label="Description"><textarea className={inputCls()} rows={3} value={destForm.description} onChange={(e) => setDestForm((p) => ({ ...p, description: e.target.value }))} /></Field>
            <Field label="SEO title"><input className={inputCls()} value={destForm.seoTitle} onChange={(e) => setDestForm((p) => ({ ...p, seoTitle: e.target.value }))} /></Field>
            <Field label="Body"><textarea className={inputCls()} rows={5} value={destForm.body} onChange={(e) => setDestForm((p) => ({ ...p, body: e.target.value }))} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={destForm.featured} onChange={(e) => setDestForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
            <button type="submit" className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Save destination</button>
          </form>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">Destinations ({destinations.length})</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {destinations.map((d) => (
                <li key={d._id} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2">
                  <span>{d.name} {d.featured ? "⭐" : ""}</span>
                  <button type="button" className="text-xs font-semibold text-[var(--cabzii-brand)]" onClick={() => { setEditDestId(d._id); setDestForm(d); }}>Edit</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {section === "media" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={saveMedia} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">Add media asset</h3>
            <Field label="URL (upload via existing upload, paste URL here)"><input className={inputCls()} value={mediaForm.url} onChange={(e) => setMediaForm((p) => ({ ...p, url: e.target.value }))} required /></Field>
            <Field label="Alt text"><input className={inputCls()} value={mediaForm.alt} onChange={(e) => setMediaForm((p) => ({ ...p, alt: e.target.value }))} /></Field>
            <Field label="Folder"><input className={inputCls()} value={mediaForm.folder} onChange={(e) => setMediaForm((p) => ({ ...p, folder: e.target.value }))} /></Field>
            <Field label="Tags (comma-separated)"><input className={inputCls()} value={mediaForm.tags} onChange={(e) => setMediaForm((p) => ({ ...p, tags: e.target.value }))} /></Field>
            <button type="submit" className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Save to library</button>
          </form>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">Media library ({media.length})</h3>
            <div className="mt-3 grid max-h-[32rem] gap-2 overflow-y-auto sm:grid-cols-2">
              {media.map((m) => (
                <div key={m._id} className="rounded-lg border border-slate-100 p-2 text-xs">
                  {m.url ? <img src={m.url} alt={m.alt || ""} className="mb-2 h-20 w-full rounded object-cover" /> : null}
                  <p className="truncate font-mono">{m.url}</p>
                  <p className="text-slate-500">{m.folder} · {m.alt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {(section === "seo-center" || section === "seo-templates") ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <form onSubmit={saveTemplate} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">SEO template engine</h3>
            <p className="text-xs text-slate-500">Use placeholders: {"{City}"}, {"{FromCity}"}, {"{ToCity}"}</p>
            <Field label="Key"><input className={inputCls()} value={templateForm.key} onChange={(e) => setTemplateForm((p) => ({ ...p, key: e.target.value }))} /></Field>
            <Field label="Label"><input className={inputCls()} value={templateForm.label} onChange={(e) => setTemplateForm((p) => ({ ...p, label: e.target.value }))} /></Field>
            <Field label="Title template"><input className={inputCls()} value={templateForm.titleTemplate} onChange={(e) => setTemplateForm((p) => ({ ...p, titleTemplate: e.target.value }))} /></Field>
            <Field label="Description template"><textarea className={inputCls()} rows={2} value={templateForm.descriptionTemplate} onChange={(e) => setTemplateForm((p) => ({ ...p, descriptionTemplate: e.target.value }))} /></Field>
            <Field label="Keywords template"><input className={inputCls()} value={templateForm.keywordsTemplate} onChange={(e) => setTemplateForm((p) => ({ ...p, keywordsTemplate: e.target.value }))} /></Field>
            <button type="submit" className="rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Save template</button>
          </form>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-bold">Active templates</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {templates.map((t) => (
                <li key={t._id} className="rounded-lg border border-slate-100 px-3 py-2">
                  <p className="font-semibold">{t.label} <span className="text-slate-400">({t.key})</span></p>
                  <p className="text-slate-600">{t.titleTemplate}</p>
                </li>
              ))}
            </ul>
            {section === "seo-center" ? (
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">SEO modules also managed in:</p>
                <ul className="mt-1 list-inside list-disc">
                  <li>Services tab — service landing SEO</li>
                  <li>Routes tab — route landing SEO</li>
                  <li>City Pages tab — per-city meta</li>
                  <li>Site settings — homepage hero & sections</li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {section === "content-health" && dashboard ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="font-bold text-amber-900">Content optimization suggestions</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-amber-900">
              {(dashboard.contentHealth?.suggestions || []).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Thin meta routes" value={dashboard.contentHealth?.thinMetaRoutes} />
            <StatCard label="Thin meta services" value={dashboard.contentHealth?.thinMetaServices} />
            <StatCard label="Unpublished blogs" value={dashboard.contentHealth?.unpublishedBlogs} />
          </div>
        </div>
      ) : null}

      {section === "gsc" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-bold">Search Console insights</h3>
          <p className="mt-1 text-xs text-slate-500">Import via Bulk Operations as JSON rows, or connect GSC API later.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead><tr className="border-b"><th className="py-2 pr-4">Keyword</th><th className="py-2 pr-4">Clicks</th><th className="py-2 pr-4">Impressions</th><th className="py-2 pr-4">CTR</th><th className="py-2 pr-4">Position</th><th className="py-2">Landing</th></tr></thead>
              <tbody>
                {gscRows.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{r.keyword}</td>
                    <td className="py-2 pr-4">{r.clicks}</td>
                    <td className="py-2 pr-4">{r.impressions}</td>
                    <td className="py-2 pr-4">{r.ctr}</td>
                    <td className="py-2 pr-4">{r.position}</td>
                    <td className="py-2 truncate max-w-[12rem]">{r.landingPage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {section === "chat-leads" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-bold">Zii chatbot leads ({chatLeads.length})</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {chatLeads.map((l) => (
              <li key={l._id} className="flex justify-between rounded-lg border border-slate-100 px-3 py-2">
                <span><strong>{l.name}</strong> · {l.mobile}</span>
                <span className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {section === "audit-logs" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-bold">Audit logs</h3>
          <ul className="mt-3 max-h-[32rem] space-y-1 overflow-y-auto font-mono text-xs">
            {auditLogs.map((l) => (
              <li key={l._id} className="rounded border border-slate-100 px-2 py-1">
                {l.createdAt} · {l.action} · {l.entity} · {l.entityId}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {section === "bulk-ops" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-bold">Bulk import</h3>
          <Field label="Entity">
            <select className={inputCls()} value={bulkEntity} onChange={(e) => setBulkEntity(e.target.value)}>
              <option value="faqs">FAQs</option>
              <option value="destinations">Destinations</option>
              <option value="cms-pages">CMS Pages</option>
              <option value="gsc">Search Console rows</option>
            </select>
          </Field>
          <Field label="JSON array of rows" hint='Example: [{"question":"...","answer":"..."}]'>
            <textarea className={inputCls()} rows={12} value={bulkJson} onChange={(e) => setBulkJson(e.target.value)} />
          </Field>
          <button type="button" onClick={runBulkImport} className="mt-3 rounded-lg bg-[var(--cabzii-brand)] px-4 py-2 text-sm font-semibold text-white">Run bulk import</button>
        </div>
      ) : null}
    </div>
  );
}

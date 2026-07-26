"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import {
  SEO_KEYWORD_SUGGESTIONS,
  HIGHLIGHT_PRESETS,
  FEATURE_MULTI_SELECT,
  ROBOTS_OPTIONS,
  NEARBY_LOCATION_PRESETS,
  SEO_TEMPLATES,
  applySeoTemplate,
  generateSlug,
  generateCanonical,
  parseKeywords,
  keywordsToString,
  charTone,
  wordCount,
  readingTimeMinutes,
  buildVehicleJsonLd,
  computeSeoScore,
  emptySeoReview
} from "../../../lib/vehicleEnterpriseSeo";
import { SITE_URL } from "../../../lib/seo/constants";
import { buildAiPayload, callAiSeo } from "../../../lib/aiSeoClient";
import SeoFaqBuilder from "./SeoFaqBuilder";
import SeoOgImageDropzone from "./SeoOgImageDropzone";
import SeoAiAssistant from "./SeoAiAssistant";

const SeoRichTextEditor = dynamic(() => import("./SeoRichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
});

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600 disabled:bg-slate-50";
}

function Field({ label, children, hint, action }) {
  return (
    <label className="block text-xs font-semibold text-slate-600">
      <span className="flex items-center justify-between gap-2">
        <span>{label}</span>
        {action || null}
      </span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </label>
  );
}

function SectionCard({ title, subtitle, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50"
      >
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="space-y-4 border-t border-slate-100 px-4 py-4">{children}</div> : null}
    </section>
  );
}

function CharMeter({ value, soft = 60, hard = 70 }) {
  const len = String(value || "").length;
  const tone = charTone(len, soft, hard);
  const color =
    tone === "green" ? "bg-emerald-500" : tone === "orange" ? "bg-amber-500" : "bg-rose-500";
  const text =
    tone === "green" ? "text-emerald-700" : tone === "orange" ? "text-amber-700" : "text-rose-700";
  return (
    <div className="mt-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className={text}>
          {len} / {soft} chars
        </span>
        <span className="text-slate-400">soft {soft} · hard {hard}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, (len / hard) * 100)}%` }} />
      </div>
    </div>
  );
}

function TagInput({ values, onChange, suggestions = [], disabled, placeholder }) {
  const [draft, setDraft] = useState("");
  const list = Array.isArray(values) ? values : [];

  const add = (raw) => {
    const tag = String(raw || "").trim();
    if (!tag || list.includes(tag)) return;
    onChange([...list, tag]);
    setDraft("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-300 bg-white p-2">
        {list.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
            {tag}
            {!disabled ? (
              <button type="button" className="text-sky-500 hover:text-rose-600" onClick={() => onChange(list.filter((t) => t !== tag))}>
                ×
              </button>
            ) : null}
          </span>
        ))}
        <input
          className="min-w-[8rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
          disabled={disabled}
          value={draft}
          placeholder={placeholder || "Type & press Enter"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(draft.replace(/,$/, ""));
            }
          }}
        />
      </div>
      {suggestions.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions
            .filter((s) => !list.includes(s))
            .slice(0, 10)
            .map((s) => (
              <button
                key={s}
                type="button"
                disabled={disabled}
                onClick={() => add(s)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-sky-300 hover:bg-sky-50"
              >
                + {s}
              </button>
            ))}
        </div>
      ) : null}
    </div>
  );
}

function ListEditor({ values, onChange, disabled, placeholder, labelAdd = "Add item" }) {
  const list = Array.isArray(values) && values.length ? values : [""];
  return (
    <div className="space-y-2">
      {list.map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            className={inputCls()}
            disabled={disabled}
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...list];
              next[idx] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            disabled={disabled || list.length <= 1}
            className="rounded-lg border border-slate-200 px-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
            onClick={() => onChange(list.filter((_, i) => i !== idx))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        className="text-xs font-semibold text-sky-700 hover:underline"
        onClick={() => onChange([...list, ""])}
      >
        + {labelAdd}
      </button>
    </div>
  );
}

function ChoiceModal({ title, options, onPick, onClose }) {
  if (!options?.length) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <button type="button" className="text-slate-500" onClick={onClose}>✕</button>
        </div>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto p-3">
          {options.map((opt, i) => (
            <button
              key={`${opt}-${i}`}
              type="button"
              onClick={() => onPick(opt)}
              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-left text-sm text-slate-800 hover:border-sky-400 hover:bg-sky-50"
            >
              {opt}
              {typeof opt === "string" ? (
                <span className="mt-0.5 block text-[11px] text-slate-400">{opt.length} chars</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VehicleSeoPanel({ form, patch, disabled = false, pathPrefix = "/cabs", onRequestSave, authToken }) {
  const [previewMode, setPreviewMode] = useState("desktop");
  const [socialTab, setSocialTab] = useState("facebook");
  const [editorDark, setEditorDark] = useState(false);
  const [keywordTags, setKeywordTags] = useState(() => parseKeywords(form.metaKeywords || form.seo));
  const [aiBusy, setAiBusy] = useState(false);
  const [aiBusyKind, setAiBusyKind] = useState("");
  const [openaiConfigured, setOpenaiConfigured] = useState(null);
  const [choice, setChoice] = useState(null);
  const autosaveRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setKeywordTags(parseKeywords(form.metaKeywords || form.seo));
  }, [form.metaKeywords, form.seo]);

  useEffect(() => {
    if (!onRequestSave || disabled) return undefined;
    autosaveRef.current = window.setInterval(() => {
      onRequestSave({ silent: true });
    }, 30_000);
    return () => window.clearInterval(autosaveRef.current);
  }, [onRequestSave, disabled]);

  useEffect(() => {
    fetch("/api/ai/seo-title")
      .then((r) => r.json())
      .then((j) => setOpenaiConfigured(Boolean(j?.openaiConfigured)))
      .catch(() => setOpenaiConfigured(false));
  }, []);

  const score = useMemo(() => computeSeoScore(form), [form]);
  const schema = useMemo(() => buildVehicleJsonLd(form, pathPrefix), [form, pathPrefix]);
  const words = wordCount(form.longSeoContent || form.shortDescription);
  const title = form.seoTitle || applySeoTemplate(SEO_TEMPLATES.title, form);
  const description = form.seoDescription || applySeoTemplate(SEO_TEMPLATES.description, form);
  const url = form.canonicalUrl || generateCanonical(form, pathPrefix);
  const displayUrl = url.replace(/^https?:\/\//, "");

  const setKeywords = (tags) => {
    setKeywordTags(tags);
    const joined = keywordsToString(tags);
    patch({ metaKeywords: joined, seo: joined });
  };

  const runAi = async (kind) => {
    if (disabled || aiBusy) return;
    // Local-only helpers (no LLM needed)
    if (kind === "canonical") {
      patch({ canonicalUrl: generateCanonical({ ...form, slug: form.slug || generateSlug(form) }, pathPrefix) });
      toast.success("Canonical generated");
      return;
    }
    if (kind === "og" || kind === "meta") {
      patch({
        ogTitle: form.seoTitle || applySeoTemplate(SEO_TEMPLATES.title, form),
        ogDescription: form.seoDescription || applySeoTemplate(SEO_TEMPLATES.description, form),
        ogImage: form.ogImage || form.image || "",
        twitterTitle: form.seoTitle || applySeoTemplate(SEO_TEMPLATES.title, form),
        twitterDescription: form.seoDescription || applySeoTemplate(SEO_TEMPLATES.description, form),
        twitterImage: form.twitterImage || form.ogImage || form.image || ""
      });
      toast.success("Meta tags synced from SEO fields");
      return;
    }

    const taskMap = {
      title: "seo-title",
      description: "meta-description",
      keywords: "keywords",
      faq: "faq",
      content: "content",
      slug: "slug",
      h1: "h1",
      h2: "h2",
      alt: "image-alt",
      schema: "schema",
      everything: "everything",
      improve: "improve",
      rewrite: "rewrite",
      simplify: "simplify",
      expand: "expand",
      grammar: "grammar",
      cta: "cta"
    };
    const task = taskMap[kind] || kind;
    setAiBusy(true);
    setAiBusyKind(kind);
    try {
      const payload = buildAiPayload(form, pathPrefix);
      const json = await callAiSeo(task, payload, { token: authToken });
      const data = json.data || {};
      if (json.openaiConfigured != null) setOpenaiConfigured(json.openaiConfigured);

      if (task === "seo-title" && data.titles?.length) {
        setChoice({
          title: "Pick an SEO title",
          options: data.titles,
          apply: (v) => patch({ seoTitle: String(v).slice(0, 70) })
        });
      } else if (task === "meta-description" && data.descriptions?.length) {
        setChoice({
          title: "Pick a meta description",
          options: data.descriptions,
          apply: (v) => patch({ seoDescription: String(v).slice(0, 180) })
        });
      } else if (task === "keywords") {
        const merged = [
          ...(data.primary || []),
          ...(data.secondary || []),
          ...(data.longTail || []),
          ...(data.lsi || [])
        ];
        setKeywords(Array.from(new Set([...keywordTags, ...merged.map((k) => String(k).trim()).filter(Boolean)])));
        toast.success("Keywords added");
      } else if (task === "faq") {
        patch({ faq: data.faqs?.length ? data.faqs : data.faq || [] });
        toast.success("FAQs generated");
      } else if (task === "content") {
        patch({
          longSeoContent: data.html || form.longSeoContent,
          shortDescription: form.shortDescription || `Book ${payload.vehicleName} in ${payload.city} with Cabzii.`
        });
        toast.success("Long SEO content generated");
      } else if (task === "slug" && data.slugs?.length) {
        setChoice({
          title: "Pick a slug",
          options: data.slugs,
          apply: (v) => {
            const slug = String(v);
            patch({
              slug,
              canonicalUrl: generateCanonical({ ...form, slug }, pathPrefix)
            });
          }
        });
      } else if (task === "h1" && data.headings?.length) {
        setChoice({
          title: "Pick an H1",
          options: data.headings,
          apply: (v) => patch({ h1: String(v) })
        });
      } else if (task === "h2" && data.headings?.length) {
        patch({ h2: data.headings });
        toast.success("H2 headings generated");
      } else if (task === "image-alt") {
        const images = (form.images || []).map((img, i) => ({
          ...img,
          alt: img.alt || data.alt || `${payload.vehicleName} photo ${i + 1}`,
          title: img.title || data.title || "",
          caption: img.caption || data.caption || ""
        }));
        patch({ images, imageAlt: form.imageAlt || data.alt || "" });
        toast.success("Image ALT generated");
      } else if (task === "schema" && data.jsonLd) {
        toast.success("Schema refreshed (auto JSON-LD uses live form fields)");
      } else if (task === "everything") {
        const kw = [
          ...(data.keywords?.primary || []),
          ...(data.keywords?.secondary || []),
          ...(data.keywords?.longTail || []),
          ...(data.keywords?.lsi || [])
        ];
        patch({
          seoTitle: data.seoTitle || form.seoTitle,
          seoDescription: data.seoDescription || form.seoDescription,
          shortDescription: data.shortDescription || form.shortDescription,
          longSeoContent: data.longSeoContent || form.longSeoContent,
          h1: data.h1 || form.h1,
          h2: data.h2?.length ? data.h2 : form.h2,
          faq: data.faq?.length ? data.faq : form.faq,
          slug: data.slug || form.slug,
          canonicalUrl: generateCanonical({ ...form, slug: data.slug || form.slug }, pathPrefix),
          imageAlt: data.imageAlt?.alt || form.imageAlt,
          ogTitle: data.seoTitle || form.ogTitle,
          ogDescription: data.seoDescription || form.ogDescription,
          twitterTitle: data.seoTitle || form.twitterTitle,
          twitterDescription: data.seoDescription || form.twitterDescription
        });
        if (kw.length) setKeywords(Array.from(new Set([...keywordTags, ...kw])));
        toast.success(data.source === "openai" ? "Full AI SEO package applied" : "SEO package applied (template fallback)");
      } else if (["improve", "rewrite", "simplify", "expand", "grammar", "cta"].includes(task)) {
        if (data.html) patch({ longSeoContent: data.html });
        toast.success("Content updated");
      } else {
        toast.info("AI response received");
      }

      if (data.source === "template" && openaiConfigured !== true) {
        toast.info("Using smart templates — set OPENAI_API_KEY for live AI", { autoClose: 3500 });
      }
    } catch (e) {
      toast.error(e.message || "AI generation failed");
    } finally {
      setAiBusy(false);
      setAiBusyKind("");
    }
  };

  const generate = (kind) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      void runAi(kind);
    }, 200);
  };

  const toggleFeature = (name) => {
    const current = Array.isArray(form.features) ? form.features : [];
    patch({
      features: current.includes(name) ? current.filter((f) => f !== name) : [...current, name]
    });
  };

  const scoreColor =
    score.score >= 80 ? "text-emerald-600" : score.score >= 55 ? "text-amber-600" : "text-rose-600";

  const generateActions = [
    ["everything", "Generate Everything", true],
    ["title", "Generate Title", false],
    ["description", "Generate Description", false],
    ["keywords", "Generate Keywords", false],
    ["faq", "Generate FAQ", false],
    ["h1", "Generate H1", false],
    ["h2", "Generate H2", false],
    ["content", "Generate Content", false],
    ["slug", "Generate Slug", false],
    ["canonical", "Generate Canonical", false],
    ["og", "Generate Meta Tags", false],
    ["alt", "Generate Image Alt", false],
    ["schema", "Generate Schema", false]
  ];

  return (
    <div className="relative">
      {choice ? (
        <ChoiceModal
          title={choice.title}
          options={choice.options}
          onClose={() => setChoice(null)}
          onPick={(opt) => {
            choice.apply?.(opt);
            setChoice(null);
            toast.success("Applied");
          }}
        />
      ) : null}

      <SeoAiAssistant onAction={generate} busy={aiBusy} openaiConfigured={openaiConfigured} />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_15.5rem]">
        {/* Main SEO form — left */}
        <div className="min-w-0 space-y-4 order-2 lg:order-1">

      {/* Section 1 Basic SEO */}
      <SectionCard title="1. Basic SEO" subtitle="Title, description, keywords, slug, canonical & robots">
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="SEO Title (max 60)"
            action={
              <button type="button" disabled={disabled} className="text-[11px] font-semibold text-sky-700" onClick={() => generate("title")}>
                Auto suggestion
              </button>
            }
          >
            <input className={inputCls()} disabled={disabled} value={form.seoTitle || ""} onChange={(e) => patch({ seoTitle: e.target.value })} placeholder={SEO_TEMPLATES.title} />
            <CharMeter value={form.seoTitle} soft={60} hard={70} />
          </Field>
          <Field
            label="Canonical URL"
            action={
              <button type="button" disabled={disabled} className="text-[11px] font-semibold text-sky-700" onClick={() => generate("canonical")}>
                Auto generate
              </button>
            }
          >
            <input className={inputCls()} disabled={disabled} value={form.canonicalUrl || ""} onChange={(e) => patch({ canonicalUrl: e.target.value })} placeholder={`${SITE_URL}${pathPrefix}/...`} />
          </Field>
          <div className="lg:col-span-2">
            <Field
              label="Meta Description (max 160)"
              action={
                <button type="button" disabled={disabled} className="text-[11px] font-semibold text-sky-700" onClick={() => generate("description")}>
                  Auto suggestion
                </button>
              }
            >
              <textarea className={`${inputCls()} min-h-[88px]`} disabled={disabled} value={form.seoDescription || ""} onChange={(e) => patch({ seoDescription: e.target.value })} placeholder={SEO_TEMPLATES.description} />
              <CharMeter value={form.seoDescription} soft={160} hard={180} />
            </Field>
          </div>
          <Field label="Keywords" hint="Press Enter to add tags">
            <TagInput values={keywordTags} onChange={setKeywords} suggestions={SEO_KEYWORD_SUGGESTIONS} disabled={disabled} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Slug"
              action={
                <button type="button" disabled={disabled} className="text-[11px] font-semibold text-sky-700" onClick={() => generate("slug")}>
                  Auto generate
                </button>
              }
            >
              <input className={inputCls()} disabled={disabled} value={form.slug || ""} onChange={(e) => patch({ slug: e.target.value })} placeholder="force-tempo-traveller-17-seater-chennai" />
            </Field>
            <Field label="Robots">
              <select className={inputCls()} disabled={disabled} value={form.robots || "index,follow"} onChange={(e) => patch({ robots: e.target.value })}>
                {ROBOTS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </SectionCard>

      {/* Section 2 Search Preview */}
      <SectionCard title="2. Search Preview" subtitle="Google desktop & mobile SERP preview">
        <div className="flex gap-2">
          {["desktop", "mobile"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPreviewMode(mode)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${previewMode === mode ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {mode === "desktop" ? "Desktop Preview" : "Mobile Preview"}
            </button>
          ))}
        </div>
        <div className={`rounded-xl border border-slate-200 bg-white p-4 font-[Arial,sans-serif] ${previewMode === "mobile" ? "max-w-sm" : "max-w-2xl"}`}>
          <div className="truncate text-xl text-[#1a0dab]">{title || "SEO title preview"}</div>
          <div className="mt-0.5 truncate text-sm text-[#006621]">{displayUrl}</div>
          <div className="mt-1 line-clamp-2 text-sm text-[#545454]">{description || "Meta description preview appears here as you type."}</div>
        </div>
      </SectionCard>

      {/* Section 3 Social */}
      <SectionCard title="3. Social Sharing" subtitle="Facebook, Twitter, LinkedIn, WhatsApp previews" defaultOpen={false}>
        <div className="mb-3 flex flex-wrap gap-2">
          {[
            ["facebook", "Facebook"],
            ["twitter", "Twitter / X"],
            ["linkedin", "LinkedIn"],
            ["whatsapp", "WhatsApp"]
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSocialTab(id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${socialTab === id ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <Field label="OG Title"><input className={inputCls()} disabled={disabled} value={form.ogTitle || ""} onChange={(e) => patch({ ogTitle: e.target.value })} /></Field>
            <Field label="OG Description"><textarea className={`${inputCls()} min-h-[72px]`} disabled={disabled} value={form.ogDescription || ""} onChange={(e) => patch({ ogDescription: e.target.value })} /></Field>
            <Field label="OG Image URL"><input className={inputCls()} disabled={disabled} value={form.ogImage || ""} onChange={(e) => patch({ ogImage: e.target.value })} placeholder="https://... or upload below" /></Field>
            <SeoOgImageDropzone
              value={form.ogImage}
              disabled={disabled}
              token={authToken}
              onUploaded={(url) => patch({ ogImage: url, twitterImage: form.twitterImage || url })}
              onGenerateAlt={() => generate("alt")}
            />
            <Field label="Twitter Title"><input className={inputCls()} disabled={disabled} value={form.twitterTitle || ""} onChange={(e) => patch({ twitterTitle: e.target.value })} /></Field>
            <Field label="Twitter Description"><textarea className={`${inputCls()} min-h-[72px]`} disabled={disabled} value={form.twitterDescription || ""} onChange={(e) => patch({ twitterDescription: e.target.value })} /></Field>
          </div>
          <div className="space-y-3">
            {socialTab === "twitter" ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#15202b] text-white">
                {(form.twitterImage || form.ogImage || form.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.twitterImage || form.ogImage || form.image} alt="" className="h-36 w-full object-cover" />
                ) : (
                  <div className="flex h-36 items-center justify-center bg-slate-700 text-xs text-slate-300">Twitter card image</div>
                )}
                <div className="p-3">
                  <p className="font-bold">{form.twitterTitle || form.ogTitle || title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-300">{form.twitterDescription || form.ogDescription || description}</p>
                </div>
              </div>
            ) : socialTab === "whatsapp" ? (
              <div className="rounded-xl border border-emerald-200 bg-[#e7f8ef] p-4">
                <p className="text-xs font-bold text-emerald-800">WhatsApp link preview</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{form.ogTitle || title}</p>
                <p className="mt-1 line-clamp-3 text-xs text-slate-600">{form.ogDescription || description}</p>
                <p className="mt-2 text-[11px] text-emerald-700">{displayUrl}</p>
              </div>
            ) : socialTab === "linkedin" ? (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {(form.ogImage || form.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.ogImage || form.image} alt="" className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-400">LinkedIn image</div>
                )}
                <div className="border-t p-3">
                  <p className="font-semibold text-slate-900">{form.ogTitle || title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">{form.ogDescription || description}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">{SITE_URL.replace(/^https?:\/\//, "")}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                {(form.ogImage || form.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.ogImage || form.image} alt="" className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-slate-100 text-xs text-slate-400">Facebook preview image</div>
                )}
                <div className="bg-[#f0f2f5] p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{SITE_URL.replace(/^https?:\/\//, "")}</p>
                  <p className="font-bold text-slate-900">{form.ogTitle || title}</p>
                  <p className="line-clamp-2 text-xs text-slate-600">{form.ogDescription || description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Section 4 Content */}
      <SectionCard title="4. Content SEO" subtitle="TipTap editor · H1 / H2 / H3 · word count">
        <Field label="H1"><input className={inputCls()} disabled={disabled} value={form.h1 || ""} onChange={(e) => patch({ h1: e.target.value })} /></Field>
        <Field label="H2 (unlimited)"><ListEditor values={form.h2} onChange={(h2) => patch({ h2 })} disabled={disabled} labelAdd="Add H2" placeholder="Heading 2" /></Field>
        <Field label="H3 (unlimited)"><ListEditor values={form.h3} onChange={(h3) => patch({ h3 })} disabled={disabled} labelAdd="Add H3" placeholder="Heading 3" /></Field>
        <Field label="Short Description">
          <textarea className={`${inputCls()} min-h-[72px]`} disabled={disabled} value={form.shortDescription || ""} onChange={(e) => patch({ shortDescription: e.target.value })} />
        </Field>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-600">Long SEO Content</p>
          <button type="button" className="text-[11px] font-semibold text-sky-700" onClick={() => setEditorDark((v) => !v)}>
            {editorDark ? "Light editor" : "Dark editor"}
          </button>
        </div>
        <SeoRichTextEditor
          value={form.longSeoContent || ""}
          disabled={disabled}
          dark={editorDark}
          onChange={(html) => patch({ longSeoContent: html })}
        />
        <p className="mt-1 text-[11px] text-slate-500">{words} words · ~{readingTimeMinutes(words)} min read</p>
      </SectionCard>

      {/* Section 5 FAQ */}
      <SectionCard title="5. FAQ" subtitle="Drag and drop · search · auto FAQ schema" defaultOpen={false}>
        <SeoFaqBuilder
          faq={form.faq || []}
          disabled={disabled}
          generating={aiBusy && aiBusyKind === "faq"}
          onChange={(faq) => patch({ faq })}
          onGenerate={() => generate("faq")}
        />
      </SectionCard>

      {/* Section 6 Highlights */}
      <SectionCard title="6. Highlights" subtitle="Trust badges & selling points" defaultOpen={false}>
        <TagInput values={form.highlights || []} onChange={(highlights) => patch({ highlights })} suggestions={HIGHLIGHT_PRESETS} disabled={disabled} />
      </SectionCard>

      {/* Section 7 Features */}
      <SectionCard title="7. Vehicle Features" subtitle="Multi-select amenity tags" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {FEATURE_MULTI_SELECT.map((f) => {
            const on = (form.features || []).includes(f);
            return (
              <button
                key={f}
                type="button"
                disabled={disabled}
                onClick={() => toggleFeature(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${on ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"}`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* Section 8 Specs (mirrors vehicle specs) */}
      <SectionCard title="8. Vehicle Specifications" subtitle="Synced with Specifications tab" defaultOpen={false}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["seats", "Seats", "number"],
            ["fuelType", "Fuel Type", "text"],
            ["transmission", "Transmission", "text"],
            ["engine", "Engine", "text"],
            ["mileage", "Mileage", "text"],
            ["bags", "Luggage Capacity", "number"],
            ["doors", "Doors", "number"],
            ["brand", "Brand", "text"],
            ["model", "Model", "text"],
            ["year", "Year", "text"]
          ].map(([key, label, type]) => (
            <Field key={key} label={label}>
              <input
                type={type}
                className={inputCls()}
                disabled={disabled}
                value={form[key] ?? ""}
                onChange={(e) => patch({ [key]: type === "number" ? Number(e.target.value) : e.target.value })}
              />
            </Field>
          ))}
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" disabled={disabled} checked={form.ac !== false} onChange={(e) => patch({ ac: e.target.checked, airCondition: e.target.checked })} />
            Air Conditioning
          </label>
        </div>
      </SectionCard>

      {/* Section 9 Location */}
      <SectionCard title="9. Location SEO" subtitle="City, state & nearby places" defaultOpen={false}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="State"><input className={inputCls()} disabled={disabled} value={form.state || ""} onChange={(e) => patch({ state: e.target.value })} placeholder="Tamil Nadu" /></Field>
          <Field label="City"><input className={inputCls()} disabled={disabled} value={form.city || ""} onChange={(e) => patch({ city: e.target.value })} placeholder="Chennai" /></Field>
        </div>
        <Field label="Nearby Locations"><TagInput values={form.nearbyLocations || []} onChange={(nearbyLocations) => patch({ nearbyLocations })} suggestions={NEARBY_LOCATION_PRESETS} disabled={disabled} /></Field>
        <Field label="Nearby Airports"><TagInput values={form.nearbyAirports || []} onChange={(nearbyAirports) => patch({ nearbyAirports })} suggestions={["Chennai Airport", "MAA Terminal 1", "MAA Terminal 2"]} disabled={disabled} /></Field>
        <Field label="Nearby Railway Stations"><TagInput values={form.nearbyStations || []} onChange={(nearbyStations) => patch({ nearbyStations })} suggestions={["Chennai Central", "Egmore", "Tambaram"]} disabled={disabled} /></Field>
        <Field label="Nearby Tourist Places"><TagInput values={form.nearbyPlaces || []} onChange={(nearbyPlaces) => patch({ nearbyPlaces })} suggestions={["Marina Beach", "Mahabalipuram", "Pondicherry"]} disabled={disabled} /></Field>
      </SectionCard>

      {/* Section 10 Pricing SEO */}
      <SectionCard title="10. Pricing SEO" subtitle="Starting price & offer copy for schema" defaultOpen={false}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Starting Price / Per KM"><input type="number" className={inputCls()} disabled={disabled} value={form.pricePerKm || form.startingPrice || ""} onChange={(e) => patch({ pricePerKm: Number(e.target.value) })} /></Field>
          <Field label="Price Unit">
            <select className={inputCls()} disabled={disabled} value={form.priceUnit || "Per KM"} onChange={(e) => patch({ priceUnit: e.target.value })}>
              <option>Per KM</option>
              <option>Per Hour</option>
              <option>Per Day</option>
              <option>Package</option>
            </select>
          </Field>
          <Field label="Offer Text"><input className={inputCls()} disabled={disabled} value={form.offerText || ""} onChange={(e) => patch({ offerText: e.target.value })} placeholder="10% off weekend" /></Field>
          <Field label="Discount %"><input type="number" className={inputCls()} disabled={disabled} value={form.discountPercentage || ""} onChange={(e) => patch({ discountPercentage: Number(e.target.value) })} /></Field>
          <Field label="Offer Ends"><input type="date" className={inputCls()} disabled={disabled} value={form.offerEnds || ""} onChange={(e) => patch({ offerEnds: e.target.value })} /></Field>
        </div>
      </SectionCard>

      {/* Section 11 Media SEO */}
      <SectionCard title="11. Media SEO" subtitle="Gallery ALT / title / caption" defaultOpen={false}>
        <div className="space-y-3">
          {(form.images || []).length === 0 ? (
            <p className="text-sm text-slate-500">Add images in the Gallery tab first.</p>
          ) : (
            (form.images || []).map((img, idx) => (
              <div key={idx} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-[96px_1fr]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="h-20 w-full rounded-lg object-cover" loading="lazy" />
                <div className="grid gap-2 sm:grid-cols-3">
                  <Field label="Alt Text">
                    <input className={inputCls()} disabled={disabled} value={img.alt || ""} onChange={(e) => {
                      const images = [...form.images];
                      images[idx] = { ...images[idx], alt: e.target.value };
                      patch({ images });
                    }} />
                  </Field>
                  <Field label="Title">
                    <input className={inputCls()} disabled={disabled} value={img.title || ""} onChange={(e) => {
                      const images = [...form.images];
                      images[idx] = { ...images[idx], title: e.target.value };
                      patch({ images });
                    }} />
                  </Field>
                  <Field label="Caption">
                    <input className={inputCls()} disabled={disabled} value={img.caption || ""} onChange={(e) => {
                      const images = [...form.images];
                      images[idx] = { ...images[idx], caption: e.target.value };
                      patch({ images });
                    }} />
                  </Field>
                </div>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      {/* Section 12 Video */}
      <SectionCard title="12. Video SEO" subtitle="YouTube URL + video schema" defaultOpen={false}>
        <Field label="YouTube URL">
          <input className={inputCls()} disabled={disabled} value={form.youtubeUrl || ""} onChange={(e) => patch({ youtubeUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
        </Field>
        {form.youtubeUrl ? (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <iframe
              title="Vehicle video preview"
              src={form.youtubeUrl.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </SectionCard>

      {/* Section 13 Reviews */}
      <SectionCard title="13. Reviews" subtitle="Customer reviews + aggregate rating schema" defaultOpen={false}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Aggregate Rating"><input type="number" step="0.1" min="0" max="5" className={inputCls()} disabled={disabled} value={form.rating || ""} onChange={(e) => patch({ rating: e.target.value })} /></Field>
          <Field label="Review Count"><input type="number" className={inputCls()} disabled={disabled} value={form.reviewCount || ""} onChange={(e) => patch({ reviewCount: Number(e.target.value) })} /></Field>
        </div>
        <button type="button" disabled={disabled} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold" onClick={() => patch({ seoReviews: [...(form.seoReviews || []), emptySeoReview()] })}>
          + Add review
        </button>
        <div className="space-y-3">
          {(form.seoReviews || []).map((r, idx) => (
            <div key={idx} className="grid gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
              <Field label="Customer Name"><input className={inputCls()} disabled={disabled} value={r.name || ""} onChange={(e) => {
                const seoReviews = [...form.seoReviews];
                seoReviews[idx] = { ...seoReviews[idx], name: e.target.value };
                patch({ seoReviews });
              }} /></Field>
              <Field label="Rating"><input type="number" min="1" max="5" className={inputCls()} disabled={disabled} value={r.rating ?? 5} onChange={(e) => {
                const seoReviews = [...form.seoReviews];
                seoReviews[idx] = { ...seoReviews[idx], rating: Number(e.target.value) };
                patch({ seoReviews });
              }} /></Field>
              <Field label="Location"><input className={inputCls()} disabled={disabled} value={r.location || ""} onChange={(e) => {
                const seoReviews = [...form.seoReviews];
                seoReviews[idx] = { ...seoReviews[idx], location: e.target.value };
                patch({ seoReviews });
              }} /></Field>
              <div className="sm:col-span-2">
                <Field label="Review">
                  <textarea className={`${inputCls()} min-h-[64px]`} disabled={disabled} value={r.review || ""} onChange={(e) => {
                    const seoReviews = [...form.seoReviews];
                    seoReviews[idx] = { ...seoReviews[idx], review: e.target.value };
                    patch({ seoReviews });
                  }} />
                </Field>
                <button type="button" disabled={disabled} className="mt-1 text-xs font-semibold text-rose-600" onClick={() => patch({ seoReviews: form.seoReviews.filter((_, i) => i !== idx) })}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 14 Internal linking */}
      <SectionCard title="14. Internal Linking" subtitle="Related vehicles, cities, packages, blogs, services" defaultOpen={false}>
        <Field label="Related Vehicles"><TagInput values={form.relatedVehicles || []} onChange={(relatedVehicles) => patch({ relatedVehicles })} disabled={disabled} placeholder="slug or name + Enter" /></Field>
        <Field label="Related Cities"><TagInput values={form.relatedCities || []} onChange={(relatedCities) => patch({ relatedCities })} suggestions={["Chennai", "Bengaluru", "Madurai", "Coimbatore"]} disabled={disabled} /></Field>
        <Field label="Related Packages"><TagInput values={form.relatedPackages || []} onChange={(relatedPackages) => patch({ relatedPackages })} disabled={disabled} /></Field>
        <Field label="Related Blogs"><TagInput values={form.relatedBlogs || []} onChange={(relatedBlogs) => patch({ relatedBlogs })} disabled={disabled} /></Field>
        <Field label="Related Services"><TagInput values={form.relatedServices || []} onChange={(relatedServices) => patch({ relatedServices })} suggestions={["airport-taxi", "outstation-cab", "one-way-cab"]} disabled={disabled} /></Field>
      </SectionCard>

      {/* Section 15 Schema */}
      <SectionCard title="15. Schema (JSON-LD)" subtitle="Auto-generated — do not manually edit" defaultOpen={false}>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" disabled={disabled} checked={form.schemaEnabled !== false} onChange={(e) => patch({ schemaEnabled: e.target.checked })} />
          Schema enabled
        </label>
        <pre className="max-h-80 overflow-auto rounded-xl bg-slate-900 p-4 text-[11px] leading-relaxed text-emerald-300">
          {JSON.stringify(schema, null, 2)}
        </pre>
      </SectionCard>

      {/* Section 16 Analytics */}
      <SectionCard title="16. SEO Analytics" subtitle="Checks, suggestions & score breakdown">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {score.checks.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border px-3 py-2 text-xs ${
                c.status === "pass"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : c.status === "warn"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
              }`}
            >
              <p className="font-bold">
                {c.status === "pass" ? "✓" : c.status === "warn" ? "⚠" : "❌"} {c.label}
              </p>
              <p className="mt-0.5">{c.message}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 18 Templates */}
      <SectionCard title="18. Templates" subtitle="Variables: {{vehicle}} {{city}} {{state}} {{price}} {{brand}} {{seats}}" defaultOpen={false}>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-800">Example</p>
          <p className="mt-1 font-mono">{SEO_TEMPLATES.title}</p>
          <p className="mt-2 font-semibold text-slate-800">Resolved</p>
          <p className="mt-1">{applySeoTemplate(SEO_TEMPLATES.title, form)}</p>
        </div>
        <p className="text-xs text-slate-500">Use the Generate buttons above to apply templates automatically.</p>
      </SectionCard>

      {/* Section 19 Validation summary */}
      <SectionCard title="19. Validation" subtitle="Required fields & warnings before save">
        <ul className="space-y-1 text-sm">
          {!form.seoTitle ? <li className="text-rose-600">❌ Missing SEO Title</li> : <li className="text-emerald-700">✓ SEO Title</li>}
          {!form.seoDescription ? <li className="text-rose-600">❌ Missing Description</li> : <li className="text-emerald-700">✓ Description</li>}
          {!form.slug ? <li className="text-rose-600">❌ Missing Slug</li> : <li className="text-emerald-700">✓ Slug</li>}
          {!form.canonicalUrl ? <li className="text-rose-600">❌ Missing Canonical</li> : <li className="text-emerald-700">✓ Canonical</li>}
          {!form.h1 ? <li className="text-rose-600">❌ Missing H1</li> : <li className="text-emerald-700">✓ H1</li>}
          {(form.seoTitle || "").length > 60 ? <li className="text-amber-600">⚠ Title &gt; 60 chars</li> : null}
          {(form.seoDescription || "").length > 160 ? <li className="text-amber-600">⚠ Description &gt; 160 chars</li> : null}
          {!keywordTags.length ? <li className="text-amber-600">⚠ No Keywords</li> : null}
          {!(form.faq || []).some((f) => f.question?.trim()) ? <li className="text-amber-600">⚠ No FAQ</li> : null}
          {!(form.images || []).length ? <li className="text-amber-600">⚠ No Images</li> : null}
        </ul>
      </SectionCard>

      {onRequestSave ? (
        <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
          <div className="text-xs text-slate-600">
            Score <span className="font-bold text-slate-900">{score.score}/100</span>
            <span className="mx-2 text-slate-300">·</span>
            Autosave every 30s
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRequestSave({ silent: false })}
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          >
            Save SEO
          </button>
        </div>
      ) : null}
        </div>

        {/* Right sticky AI / score rail — SEO tab only */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-2 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Live SEO Score</p>
            <p className={`mt-1 text-4xl font-extrabold leading-none ${scoreColor}`}>
              {score.score}
              <span className="text-base font-semibold text-slate-400">/100</span>
            </p>
            <p className="mt-2 text-[11px] leading-snug text-slate-500">
              {aiBusy
                ? `AI working: ${aiBusyKind}…`
                : openaiConfigured
                  ? "OpenAI connected"
                  : "Template mode · add OPENAI_API_KEY"}
            </p>

            <div className="mt-4 max-h-[min(58vh,28rem)] space-y-1.5 overflow-y-auto pr-0.5 lg:max-h-[calc(96vh-14rem)]">
              {generateActions.map(([key, label, primary]) => (
                <button
                  key={key}
                  type="button"
                  disabled={disabled || aiBusy}
                  onClick={() => generate(key)}
                  className={`block w-full rounded-full px-3 py-2 text-left text-[11px] font-semibold transition disabled:opacity-50 ${
                    primary
                      ? "bg-sky-600 text-white hover:bg-sky-700"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50"
                  }`}
                >
                  {aiBusy && aiBusyKind === key ? "Working…" : label}
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-100 pt-3 text-center text-[10px]">
              <div>
                <p className="font-bold text-emerald-600">{score.checks.filter((c) => c.status === "pass").length}</p>
                <p className="text-slate-400">Pass</p>
              </div>
              <div>
                <p className="font-bold text-amber-600">{score.checks.filter((c) => c.status === "warn").length}</p>
                <p className="text-slate-400">Warn</p>
              </div>
              <div>
                <p className="font-bold text-rose-600">{score.checks.filter((c) => c.status === "fail").length}</p>
                <p className="text-slate-400">Fail</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function validateVehicleSeo(form) {
  const errors = [];
  if (!String(form.seoTitle || "").trim()) errors.push("SEO Title is required");
  if (!String(form.seoDescription || "").trim()) errors.push("Meta Description is required");
  if (!String(form.slug || "").trim()) errors.push("Slug is required");
  if (!String(form.canonicalUrl || "").trim()) errors.push("Canonical URL is required");
  if (!String(form.h1 || "").trim()) errors.push("H1 is required");
  return errors;
}

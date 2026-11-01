"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminPageLinksEditor from "./AdminPageLinksEditor";
import { defaultPageLinkGroups, normalizePageLinkGroups } from "../../lib/seo/pageLinks";
import { computeRankingSeoScore } from "../../lib/seo/rankingSeoScore";
import { normalizeFaqs } from "../../lib/admin/adminSeoApi";
import { buildRankingAiPayload, callAiSeo } from "../../lib/aiSeoClient";
import { ensureRankingDescription, ensureRankingTitle } from "../../lib/seo/rankingAiCopy";

const SeoRichTextEditor = dynamic(() => import("./vehicles/SeoRichTextEditor"), { ssr: false });

function inputCls() {
  return "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-600";
}

function Field({ label, children, hint, count, ok, onSuggest, suggesting }) {
  return (
    <div className="block text-xs font-semibold text-slate-600">
      <span className="flex items-center justify-between gap-2">
        <span>
          {label}
          {count != null ? (
            <span className={`ml-2 font-normal ${ok ? "text-emerald-600" : "text-amber-600"}`}>({count} chars)</span>
          ) : null}
        </span>
        {onSuggest ? (
          <button
            type="button"
            disabled={suggesting}
            onClick={onSuggest}
            className="shrink-0 text-[11px] font-semibold text-sky-700 hover:underline disabled:opacity-50"
          >
            {suggesting ? "AI…" : "Suggest"}
          </button>
        ) : null}
      </span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block font-normal text-slate-500">{hint}</span> : null}
    </div>
  );
}

function flattenKeywordList(data = {}) {
  const bag = data.keywords && typeof data.keywords === "object" ? data.keywords : data;
  return [...(bag.primary || []), ...(bag.secondary || []), ...(bag.longTail || []), ...(bag.lsi || [])]
    .map((k) => String(k).trim())
    .filter(Boolean);
}

function extractIntro(html) {
  const text = String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  const words = text.split(" ").slice(0, 70);
  return words.join(" ");
}

function introWordCount(value) {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const AI_ACTIONS = [
  ["everything", "Suggest all"],
  ["seo-title", "Titles"],
  ["meta-description", "Descriptions"],
  ["h1", "H1"],
  ["keywords", "Keywords"],
  ["intro", "Intro"],
  ["content", "Body"],
  ["faq", "FAQs"],
  ["improve", "Improve body"]
];

function editorPageKind(row) {
  if (!row) return "cabs";
  if (row.path === "/") return "home";
  if (row.type === "driver" || row.type === "acting-driver") return "drivers";
  if (row.type === "landing") return "cabs";
  return "cabs";
}

function emptyFaq() {
  return { question: "", answer: "" };
}

const GRADE_PILL = {
  emerald: "bg-emerald-50 text-emerald-800",
  sky: "bg-sky-50 text-sky-800",
  amber: "bg-amber-50 text-amber-800",
  rose: "bg-rose-50 text-rose-800"
};

const GRADE_SCORE = {
  emerald: "text-emerald-600",
  sky: "text-sky-600",
  amber: "text-amber-600",
  rose: "text-rose-600"
};

const CHECK_ROW = {
  pass: "text-emerald-700",
  warn: "text-amber-700",
  fail: "text-rose-700"
};

function RankCalculator({ result }) {
  const { score, grade, checks, passed, total, stats } = result;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">SEO rank calculator</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${GRADE_PILL[grade.tone]}`}>{grade.label}</span>
      </div>
      <div className="mt-1.5 flex items-end gap-2">
        <p className={`text-3xl font-extrabold leading-none ${GRADE_SCORE[grade.tone]}`}>
          {score}
          <span className="text-sm font-semibold text-slate-400">/100</span>
        </p>
        <p className="mb-0.5 text-[11px] text-slate-500">
          {passed}/{total} checks · {stats.words} words
        </p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            grade.tone === "emerald" ? "bg-emerald-500" : grade.tone === "sky" ? "bg-sky-500" : grade.tone === "amber" ? "bg-amber-500" : "bg-rose-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <ul className="mt-2.5 space-y-1">
        {checks.map((check) => (
          <li key={check.id} className={`flex items-start justify-between gap-2 text-[11px] ${CHECK_ROW[check.status]}`}>
            <span className="min-w-0">
              <span className="font-semibold">
                {check.status === "pass" ? "✓" : check.status === "warn" ? "!" : "×"} {check.label}
              </span>
              <span className="ml-1 font-normal text-slate-500">{check.message}</span>
            </span>
            <span className="shrink-0 text-[10px] text-slate-400">{check.weight}</span>
          </li>
        ))}
      </ul>
      {stats.primary ? (
        <p className="mt-2 text-[10px] text-slate-500">
          Focus: <span className="font-semibold text-slate-700">{stats.primary}</span>
        </p>
      ) : (
        <p className="mt-2 text-[10px] text-amber-700">Add a first keyword — it is the focus term.</p>
      )}
    </div>
  );
}

function AiSuggestCard({
  openaiConfigured,
  busy,
  busyKind,
  prompt,
  setPrompt,
  onRun,
  choice,
  onPick,
  onSkipChoice,
  message
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">AI suggestions</p>
        <span className="text-[10px] text-slate-400">
          {openaiConfigured === false ? "Template fallback" : openaiConfigured ? "OpenAI" : "Checking…"}
        </span>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        placeholder="Optional: city, keywords, tone — e.g. Tirupati darshan cab from Chennai"
        className="mt-2 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] text-slate-800 outline-none focus:border-sky-600"
      />
      <div className="mt-2 flex flex-wrap gap-1">
        {AI_ACTIONS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            disabled={busy}
            onClick={() => onRun(id)}
            className={`inline-flex h-7 items-center rounded-full px-2.5 text-[11px] font-semibold disabled:opacity-50 ${
              id === "everything"
                ? "bg-sky-600 text-white hover:bg-sky-700"
                : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50"
            }`}
          >
            {busy && busyKind === id ? "Working…" : label}
          </button>
        ))}
      </div>
      {message ? <p className="mt-2 text-[11px] text-slate-500">{message}</p> : null}
      {choice?.options?.length ? (
        <div className="mt-2 space-y-1 rounded-lg border border-sky-100 bg-sky-50/70 p-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-700">{choice.title}</p>
            <button type="button" className="text-[10px] font-semibold text-slate-500 hover:underline" onClick={onSkipChoice}>
              Skip
            </button>
          </div>
          {choice.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPick(option)}
              className="block w-full rounded-md px-2 py-1 text-left text-[11px] text-slate-700 hover:bg-white"
            >
              {option}
              <span className="ml-1 text-slate-400">({String(option).length})</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminSeoSnippetEditor({
  row,
  open,
  onClose,
  onSave,
  saving = false,
  token = "",
  backLabel = "← Back to SEO pages"
}) {
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
  const [aiBusy, setAiBusy] = useState(false);
  const [aiBusyKind, setAiBusyKind] = useState("");
  const [openaiConfigured, setOpenaiConfigured] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [choice, setChoice] = useState(null);

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

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return undefined;
    fetch("/api/ai/seo-title")
      .then((res) => res.json())
      .then((json) => setOpenaiConfigured(Boolean(json?.openaiConfigured)))
      .catch(() => setOpenaiConfigured(false));
    return undefined;
  }, [open]);

  const rank = useMemo(
    () => computeRankingSeoScore({ form, path: row?.path || "", citySlug: row?.citySlug || "" }),
    [form, row]
  );

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

  const runAi = async (kind) => {
    if (!row || aiBusy) return;
    const apiTask = kind === "intro" ? "improve" : kind;
    const extra =
      kind === "intro"
        ? "Write only a 50–80 word intro paragraph as plain text. No heading, no HTML, no title."
        : aiPrompt;
    const payload = buildRankingAiPayload(form, row, extra);
    if (kind === "intro") payload.content = form.intro || form.seoDescription || form.productName;
    setAiBusy(true);
    setAiBusyKind(kind);
    setAiMessage("");
    try {
      const json = await callAiSeo(apiTask, payload, { token });
      const data = json.data || {};
      if (json.openaiConfigured != null) setOpenaiConfigured(Boolean(json.openaiConfigured));

      if (kind === "seo-title" && data.titles?.length) {
        setChoice({
          title: "Pick a meta title",
          options: data.titles,
          apply: (v) => setForm((p) => ({ ...p, seoTitle: ensureRankingTitle(v, row) }))
        });
        setAiMessage("Pick a title below.");
      } else if (kind === "meta-description" && data.descriptions?.length) {
        setChoice({
          title: "Pick a meta description",
          options: data.descriptions,
          apply: (v) => setForm((p) => ({ ...p, seoDescription: ensureRankingDescription(v, row) }))
        });
        setAiMessage("Pick a description below.");
      } else if (kind === "h1" && data.headings?.length) {
        setChoice({ title: "Pick an H1", options: data.headings, apply: (v) => setForm((p) => ({ ...p, productName: String(v) })) });
        setAiMessage("Pick an H1 below.");
      } else if (kind === "keywords") {
        const merged = flattenKeywordList(data);
        if (merged.length) {
          setForm((p) => {
            const current = String(p.seoKeywords || "")
              .split(/[,|\n]+/)
              .map((k) => k.trim())
              .filter(Boolean);
            return { ...p, seoKeywords: Array.from(new Set([...current, ...merged])).join(", ") };
          });
          setAiMessage("Keywords added.");
        }
      } else if (kind === "faq") {
        const faqs = normalizeFaqs(data.faqs || data.faq || []).filter((faq) => faq.question && faq.answer);
        if (faqs.length) {
          setForm((p) => ({ ...p, faqs }));
          setAiMessage(`${faqs.length} complete FAQs filled.`);
        }
      } else if (kind === "content") {
        const html = data.html || data.longSeoContent || "";
        const intro = data.intro || extractIntro(html);
        setForm((p) => ({
          ...p,
          html: html || p.html,
          intro: introWordCount(p.intro) >= 40 ? p.intro : intro || p.intro
        }));
        setAiMessage("Body filled with 400+ words and H2s.");
      } else if (kind === "intro") {
        const intro = data.intro || extractIntro(data.html || data.text || "");
        if (intro) setForm((p) => ({ ...p, intro }));
        setAiMessage("Intro filled.");
      } else if (kind === "improve") {
        if (data.html) setForm((p) => ({ ...p, html: data.html }));
        setAiMessage("Body improved to rank minima.");
      } else if (kind === "everything") {
        const kw = flattenKeywordList(data.keywords || data);
        const faqs = normalizeFaqs(data.faq || data.faqs || []).filter((faq) => faq.question && faq.answer);
        const html = data.longSeoContent || data.html || "";
        setForm((p) => ({
          ...p,
          seoTitle: ensureRankingTitle(data.seoTitle || data.titles?.[0] || p.seoTitle, row),
          seoDescription: ensureRankingDescription(data.seoDescription || data.descriptions?.[0] || p.seoDescription, row),
          productName: data.h1 || p.productName,
          seoKeywords: kw.length ? kw.join(", ") : p.seoKeywords,
          faqs: faqs.length ? faqs : p.faqs,
          html: html || p.html,
          intro: introWordCount(p.intro) >= 40 ? p.intro : data.intro || extractIntro(html) || p.intro
        }));
        if (data.titles?.length > 1) {
          setChoice({
            title: "More title options",
            options: data.titles,
            apply: (v) => setForm((p) => ({ ...p, seoTitle: ensureRankingTitle(v, row) }))
          });
        }
        setAiMessage(data.source === "openai" ? "AI filled this page. Review then save." : "Template suggestions applied. Add OPENAI_API_KEY for live AI.");
      } else {
        setAiMessage("AI response received.");
      }

      if (data.source === "template") {
        toast.info("Using templates — set OPENAI_API_KEY for live AI");
      } else {
        toast.success("AI suggestions ready");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI failed";
      setAiMessage(msg);
      toast.error(msg);
    } finally {
      setAiBusy(false);
      setAiBusyKind("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-semibold text-sky-700 hover:underline"
            >
              {backLabel}
            </button>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{row.typeLabel}</span>
          </div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-2">
            <h2 className="text-sm font-bold text-slate-900">Edit ranking SEO</h2>
            <code className="truncate text-[11px] text-sky-800">{row.path}</code>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <a
            href={row.path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            View live
          </a>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <span className={`inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-bold ${GRADE_PILL[rank.grade.tone]}`}>
            {rank.score}/100
          </span>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-8 items-center rounded-lg bg-[var(--cabzii-brand)] px-3 text-[12px] font-semibold text-white hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save SEO"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 py-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div className="space-y-4">
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Visible H1, title 50–60 characters, description 120–155, keywords, intro, body, FAQs and hub links.
          </p>

          <Field
            label="Visible H1 *"
            hint="On-page heading Google matches to the query"
            onSuggest={() => runAi("h1")}
            suggesting={aiBusy && aiBusyKind === "h1"}
          >
            <input className={inputCls()} value={form.productName} onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))} required />
          </Field>
          <Field
            label="Meta title *"
            hint="Google blue link — 50–60 characters"
            count={form.seoTitle.length}
            ok={titleOk}
            onSuggest={() => runAi("seo-title")}
            suggesting={aiBusy && aiBusyKind === "seo-title"}
          >
            <input className={inputCls()} value={form.seoTitle} onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))} required />
          </Field>
          <Field
            label="Meta description *"
            hint="Snippet under the title — 120–155 characters"
            count={form.seoDescription.length}
            ok={descOk}
            onSuggest={() => runAi("meta-description")}
            suggesting={aiBusy && aiBusyKind === "meta-description"}
          >
            <textarea className={inputCls()} rows={4} value={form.seoDescription} onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))} required />
          </Field>
          <Field
            label="Search keywords"
            hint="Comma-separated"
            onSuggest={() => runAi("keywords")}
            suggesting={aiBusy && aiBusyKind === "keywords"}
          >
            <textarea className={inputCls()} rows={3} value={form.seoKeywords} onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))} placeholder="acting driver in chennai, outstation acting driver, cabzii" />
          </Field>
          <Field
            label="Intro paragraph"
            hint="Lead under the H1"
            onSuggest={() => runAi("intro")}
            suggesting={aiBusy && aiBusyKind === "intro"}
          >
            <textarea className={inputCls()} rows={4} value={form.intro} onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))} />
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
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">Body HTML</p>
              <button
                type="button"
                disabled={aiBusy}
                onClick={() => runAi("content")}
                className="text-[11px] font-semibold text-sky-700 hover:underline disabled:opacity-50"
              >
                {aiBusy && aiBusyKind === "content" ? "AI…" : "Suggest"}
              </button>
            </div>
            <div className="mt-1 rounded-lg border border-slate-200">
              <SeoRichTextEditor value={form.html} onChange={(html) => setForm((p) => ({ ...p, html }))} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">FAQs</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={aiBusy}
                  className="text-[11px] font-semibold text-sky-700 hover:underline disabled:opacity-50"
                  onClick={() => runAi("faq")}
                >
                  {aiBusy && aiBusyKind === "faq" ? "AI…" : "Suggest"}
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold text-sky-700 hover:underline"
                  onClick={() => setForm((p) => ({ ...p, faqs: [...p.faqs, emptyFaq()] }))}
                >
                  + Add FAQ
                </button>
              </div>
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
                    rows={3}
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
        </div>

        <div className="space-y-4">
          <RankCalculator result={rank} />
          <AiSuggestCard
            openaiConfigured={openaiConfigured}
            busy={aiBusy}
            busyKind={aiBusyKind}
            prompt={aiPrompt}
            setPrompt={setAiPrompt}
            onRun={runAi}
            choice={choice}
            onPick={(option) => {
              choice?.apply?.(option);
              setChoice(null);
            }}
            onSkipChoice={() => setChoice(null)}
            message={aiMessage}
          />

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Google preview</p>
            <p className="mt-2 break-words text-lg font-medium text-[#1a0dab]">{form.seoTitle || "Meta title"}</p>
            <p className="text-xs text-[#006621]">cabzii.in{row.path === "/" ? "" : row.path}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{form.seoDescription || "Meta description appears here."}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
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
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-200 pt-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-8 items-center rounded-lg bg-[var(--cabzii-brand)] px-3 text-[12px] font-semibold text-white hover:bg-[var(--cabzii-brand-hover)] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save SEO"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-2.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
        >
          Back to list
        </button>
      </div>
    </form>
  );
}

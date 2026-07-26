"use client";

import { useState } from "react";

const ACTIONS = [
  { id: "everything", label: "Generate Everything", task: "everything" },
  { id: "improve", label: "Improve SEO", task: "improve" },
  { id: "rewrite", label: "Rewrite Content", task: "rewrite" },
  { id: "simplify", label: "Simplify Content", task: "simplify" },
  { id: "expand", label: "Expand Content", task: "expand" },
  { id: "grammar", label: "Fix Grammar", task: "grammar" },
  { id: "keywords", label: "Add Keywords", task: "keywords" },
  { id: "cta", label: "Generate CTA", task: "cta" },
  { id: "faq", label: "Generate FAQs", task: "faq" },
  { id: "content", label: "Generate Content", task: "content" }
];

export default function SeoAiAssistant({ onAction, busy = false, openaiConfigured }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-sm font-bold text-white shadow-xl hover:bg-sky-700"
        title="AI SEO Assistant"
      >
        AI
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-slate-900">AI SEO Assistant</p>
              <p className="text-[11px] text-slate-500">
                {openaiConfigured === false ? "Template mode (add OPENAI_API_KEY)" : "OpenAI powered"}
              </p>
            </div>
            <button type="button" className="text-slate-400 hover:text-slate-700" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="grid max-h-[50vh] gap-2 overflow-y-auto p-3">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={busy}
                onClick={() => onAction?.(a.task)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50 disabled:opacity-50"
              >
                {busy ? "Working…" : a.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

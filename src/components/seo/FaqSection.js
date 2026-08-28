"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import SectionIntro from "../ui/SectionIntro";

export default function FaqSection({
  eyebrow,
  title = "Frequently asked questions",
  subtitle,
  faqs,
  hideTitle = false,
  /* Compact inner-scroll list on every viewport — keeps long FAQ lists short on mobile */
  scrollable = true,
  scrollMaxClass = "max-h-[17rem] sm:max-h-[min(20rem,50vh)]"
}) {
  if (!faqs?.length) return null;

  const showIntro = Boolean(eyebrow || subtitle);
  const showCardTitle = !hideTitle && !showIntro;

  const listClass = scrollable
    ? `faq-scroll scrollbar-hide overflow-y-auto overscroll-y-contain pr-1 ${scrollMaxClass}`
    : "";

  return (
    <div className={showIntro || hideTitle ? "" : "mt-5 sm:mt-6"}>
      {showIntro ? <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} /> : null}

      <section
        className={`cabzii-card overflow-hidden p-3 sm:p-4 ${showIntro || hideTitle ? "mt-3" : ""}`}
      >
        {showCardTitle ? <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">{title}</h2> : null}
        <div className={`${scrollable ? "faq-scroll-wrap relative" : ""} ${showCardTitle ? "mt-2.5" : ""}`}>
          <div className={`cabzii-faq ${listClass}`}>
            {faqs.map(([question, answer]) => (
              <FaqItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="faq-trigger"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="min-w-0 flex-1 text-left">{question}</span>
        <span className="faq-chevron" aria-hidden>
          <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </button>
      {open ? <p className="faq-answer">{answer}</p> : null}
    </div>
  );
}

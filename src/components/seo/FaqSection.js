import SectionIntro from "../ui/SectionIntro";

export default function FaqSection({
  eyebrow,
  title = "Frequently asked questions",
  subtitle,
  faqs,
  hideTitle = false,
  /** Fixed-height scroll area — use on homepage when there are many FAQs */
  scrollable = false,
  scrollMaxClass = "max-h-[min(20rem,52vh)]"
}) {
  if (!faqs?.length) return null;

  const showIntro = Boolean(eyebrow || subtitle);
  const showCardTitle = !hideTitle && !showIntro;

  const listClass = scrollable
    ? `faq-scroll scrollbar-hide space-y-4 overflow-y-auto overscroll-y-contain pr-1 ${scrollMaxClass}`
    : "space-y-5";

  return (
    <div className={showIntro || hideTitle ? "" : "mt-10"}>
      {showIntro ? <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} /> : null}

      <section
        className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 ${
          showIntro || hideTitle ? "mt-6" : ""
        }`}
      >
        {showCardTitle ? <h2 className="text-xl font-bold text-slate-900">{title}</h2> : null}
        <dl className={`${listClass} ${showCardTitle ? "mt-5" : ""}`}>
          {faqs.map(([question, answer]) => (
            <FaqItem key={question} question={question} answer={answer} compact={scrollable} />
          ))}
        </dl>
      </section>
    </div>
  );
}

function FaqItem({ question, answer, compact = false }) {
  return (
    <div className={compact ? "border-b border-slate-100 pb-4 last:border-0 last:pb-0" : ""}>
      <dt className="text-sm font-semibold text-slate-900">{question}</dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-slate-600">{answer}</dd>
    </div>
  );
}

import SectionIntro from "../ui/SectionIntro";

export default function FaqSection({
  eyebrow,
  title = "Frequently asked questions",
  subtitle,
  faqs,
  hideTitle = false,
  scrollable = false,
  scrollMaxClass = "max-h-[min(20rem,52vh)]"
}) {
  if (!faqs?.length) return null;

  const showIntro = Boolean(eyebrow || subtitle);
  const showCardTitle = !hideTitle && !showIntro;

  const listClass = scrollable
    ? `faq-scroll scrollbar-hide overflow-visible pr-1 md:overflow-y-auto md:overscroll-y-contain ${scrollMaxClass} max-md:!max-h-none`
    : "";

  return (
    <div className={showIntro || hideTitle ? "" : "mt-10"}>
      {showIntro ? <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} /> : null}

      <section
        className={`cabzii-card p-5 md:p-6 ${showIntro || hideTitle ? "mt-6" : ""}`}
      >
        {showCardTitle ? <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2> : null}
        <div className={`cabzii-faq ${listClass} ${showCardTitle ? "mt-4" : ""}`}>
          {faqs.map(([question, answer]) => (
            <FaqItem key={question} question={question} answer={answer} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <details className="group">
      <summary>{question}</summary>
      <p className="faq-answer">{answer}</p>
    </details>
  );
}

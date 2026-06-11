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
    <div className={showIntro || hideTitle ? "" : "mt-10"}>
      {showIntro ? <SectionIntro eyebrow={eyebrow} title={title} subtitle={subtitle} /> : null}

      <section
        className={`cabzii-card overflow-hidden p-5 md:p-6 ${showIntro || hideTitle ? "mt-6" : ""}`}
      >
        {showCardTitle ? <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{title}</h2> : null}
        <div className={`${scrollable ? "faq-scroll-wrap relative" : ""} ${showCardTitle ? "mt-4" : ""}`}>
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
  return (
    <details className="group">
      <summary>
        <span className="min-w-0 flex-1">{question}</span>
        <span className="faq-chevron" aria-hidden>
          <ChevronDown className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </summary>
      <p className="faq-answer">{answer}</p>
    </details>
  );
}

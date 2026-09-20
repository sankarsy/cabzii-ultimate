"use client";

export default function CityCabFaqAccordion({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-4 py-3 sm:px-5">
          <summary className="cursor-pointer list-none marker:content-none">
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">{faq.question}</h3>
            <p className="mt-1 text-xs text-slate-500 group-open:hidden">Show answer</p>
          </summary>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

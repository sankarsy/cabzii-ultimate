"use client";

export default function CityCabFaqAccordion({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {faqs.map((faq) => (
        <details key={faq.question} className="group px-4 py-3 sm:px-5">
          <summary className="cursor-pointer list-none marker:content-none">
            <h3 className="pr-6 text-xs font-semibold text-slate-900 sm:text-sm">{faq.question}</h3>
            <p className="mt-1 text-[11px] text-slate-500 group-open:hidden">Show answer</p>
          </summary>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

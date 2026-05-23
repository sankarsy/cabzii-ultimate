export default function FaqSection({ title = "Frequently asked questions", faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{title}</h2>
      <dl className="mt-5 space-y-5">
        {faqs.map(([question, answer]) => (
          <FaqItem key={question} question={question} answer={answer} />
        ))}
      </dl>
    </section>
  );
}

function FaqItem({ question, answer }) {
  return (
    <div>
      <dt className="text-sm font-bold text-slate-900 md:text-base">{question}</dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-slate-600">{answer}</dd>
    </div>
  );
}

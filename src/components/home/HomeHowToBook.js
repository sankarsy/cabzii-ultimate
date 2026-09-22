const STEPS = [
  {
    title: "Enter pickup in Chennai",
    subtitle: "Add from, to and date. Choose one-way, round-trip, airport or local."
  },
  {
    title: "Compare Hatchback, Sedan, SUV and Tempo Traveller",
    subtitle: "Fares, seats and luggage show on the results page before you pay."
  },
  {
    title: "Pay 50% to confirm",
    subtitle: "Advance is 50% at booking. Apply CABZII500 for ₹500 off the first outstation trip."
  },
  {
    title: "Get driver details",
    subtitle: "After confirmation you receive driver details on SMS or WhatsApp."
  }
];

export default function HomeHowToBook() {
  return (
    <section className="border-t border-slate-200 bg-white py-8 sm:py-10">
      <div className="section-shell">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">How Cabzii cab booking works</h2>
        <p className="mt-1 text-sm text-slate-600">Pickup, fare, 50% confirmation, then driver details on WhatsApp or SMS.</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--cabzii-brand)]">Step {index + 1}</p>
              <h3 className="mt-1 text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.subtitle}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

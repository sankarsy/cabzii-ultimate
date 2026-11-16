import HomeSectionHeader from "./HomeSectionHeader";

const STEPS = [
  {
    title: "Search your trip",
    subtitle: "Add pickup, drop and date. Choose local, airport or outstation."
  },
  {
    title: "Compare cabs",
    subtitle: "Hatchback, sedan, SUV and Tempo Traveller with fares shown first."
  },
  {
    title: "Confirm your booking",
    subtitle: "Check pickup, cab and fare, then confirm. Use CABZII500 for ₹200 off the first outstation trip."
  },
  {
    title: "Get driver details",
    subtitle: "Driver name and number on SMS or WhatsApp after confirmation."
  }
];

export default function HomeHowToBook() {
  return (
    <section className="home-band home-band-sky">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Booking"
          title="How to book"
          subtitle="Search, compare cabs, confirm the fare, then get driver details."
        />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3 rounded-2xl border border-[var(--cabzii-border)] bg-white p-4 shadow-[var(--cabzii-shadow-xs)] sm:flex-col sm:p-5"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--cabzii-brand)] font-[family-name:var(--font-sora)] text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold leading-snug text-[var(--cabzii-ink)] sm:text-[16px]">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--cabzii-muted)]">{step.subtitle}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

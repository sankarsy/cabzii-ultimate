import HomeSectionHeader from "./HomeSectionHeader";

const STEPS = [
  {
    title: "Enter pickup and drop",
    subtitle: "Choose Local, Airport, or Outstation, then add the places and the time."
  },
  {
    title: "Verify your mobile",
    subtitle: "Confirm the number so the driver details and fare updates reach you."
  },
  {
    title: "Choose a cab and the fare",
    subtitle: "Hatchback, sedan, MPV, SUV, van, or bus. The fare is shown before you confirm."
  },
  {
    title: "Book the ride",
    subtitle: "Confirm pickup, cab, and fare. Driver name and number follow on SMS or WhatsApp."
  }
];

export default function HomeHowToBook() {
  return (
    <section className="home-band home-band-sky">
      <div className="section-shell">
        <HomeSectionHeader
          eyebrow="Booking"
          title="How to book"
          subtitle="Pickup and drop, mobile check, cab and fare, then the booking."
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

import { getIcon } from "../icons";

const OFFERS = [
  {
    tag: "CABS",
    title: "Up to 20% OFF on Outstation Cabs",
    desc: "Compare sedan, SUV and Innova fares from verified vendors on cabzii.in.",
    iconKey: "car"
  },
  {
    tag: "TOURS",
    title: "Curated South India tour packages",
    desc: "Handpicked tours with transparent pricing and instant OTP booking.",
    iconKey: "landmark"
  },
  {
    tag: "AIRPORT",
    title: "Airport transfers & acting drivers",
    desc: "On-time airport pickup and professional chauffeurs in 20+ cities.",
    iconKey: "airport"
  }
];

export default function MmtOffersSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Offers for you</h2>
        <span className="text-sm font-semibold text-[var(--cabzii-brand)]">cabzii.in</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {OFFERS.map((offer) => {
          const OfferIcon = getIcon(offer.iconKey);
          return (
            <div
              key={offer.title}
              className="cabzii-card flex gap-4 p-5 transition-shadow hover:shadow-[var(--cabzii-shadow-hover)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--cabzii-brand)]/10 text-[var(--cabzii-brand)]">
                {OfferIcon ? <OfferIcon className="h-5 w-5" strokeWidth={1.75} /> : null}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wide text-orange-600">{offer.tag}</span>
                <h3 className="mt-0.5 font-semibold text-slate-900">{offer.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{offer.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

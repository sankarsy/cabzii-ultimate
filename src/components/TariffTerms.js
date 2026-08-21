const TARIFF_TERMS = [
  "Distance calculation starts from the garage and ends when the vehicle returns or the trip is closed.",
  "More than 7 hours is charged as the 10-hour package where that package is offered.",
  "More than 12 hours is charged as the 15-hour package where that package is offered.",
  "Tariff includes fuel and driver service only.",
  "Toll, parking, entry fees and other applicable charges are extra.",
  "Driver batta is calculated on a calendar-day basis.",
  "Rates may change with diesel or petrol price fluctuations. Please confirm the latest price before booking.",
  "Cancellation charges apply if the vehicle has already left the garage or in case of a no-show.",
  "Vehicle model and facilities are subject to availability.",
  "50% advance payment is required at booking.",
  "Standing AC is limited to 10 minutes.",
  "Additional standing AC charges: Sedan ₹500 per 30 minutes; Premium Sedan/Van ₹1,000 per 30 minutes; Bus ₹2,000 per 30 minutes.",
  "Customers are responsible for interior stains, odour, spillage, vomiting, urination, alcohol spills, food spills and other damage.",
  "Deep cleaning, water wash, seat cleaning, mat replacement, seat-cover replacement or material replacement is charged to the customer when required."
];

export function TariffTerms({ compact = false }) {
  const Heading = compact ? "h3" : "h2";
  return (
    <section className={compact ? "rounded-xl border border-slate-200 bg-white p-4" : "mt-6"}>
      <Heading className="text-base font-bold text-slate-900">Tariff terms</Heading>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700">
        {TARIFF_TERMS.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ul>
    </section>
  );
}

export { TARIFF_TERMS };
export default TariffTerms;

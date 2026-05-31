import { num } from "../lib/cabFare";

export default function CabProductSpecs({ cab }) {
  const features = Array.isArray(cab.features) ? cab.features : [];
  const hourly = num(cab.hourlyRate);
  const day = num(cab.dayRate);
  const extra = num(cab.extraHourRate);

  const rows = [
    { label: "Vehicle", value: cab.title || cab.examples?.split(",")[0]?.trim() || "—" },
    { label: "Category", value: cab.seats > 8 || String(cab.type).includes("Tempo") ? "Van / Bus" : "Taxi Car" },
    { label: "Body type", value: cab.type },
    { label: "Vendor", value: cab.vendor },
    { label: "Seats", value: cab.seats ?? "—" },
    { label: "Base price", value: cab.price ? `₹${num(cab.price).toLocaleString("en-IN")}` : "—" },
    { label: "Hourly rate", value: hourly > 0 ? `₹${hourly.toLocaleString("en-IN")}/hr` : "—" },
    { label: "Day rate", value: day > 0 ? `₹${day.toLocaleString("en-IN")}/day` : "—" },
    { label: "Extra hour", value: extra > 0 ? `₹${extra.toLocaleString("en-IN")}/hr` : "—" },
    { label: "Discount", value: cab.discountPercentage ? `${cab.discountPercentage}% OFF` : "—" },
    { label: "Rating", value: cab.rating != null ? `${cab.rating} / 5` : "—" }
  ];

  return (
    <section id="product-details" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-base font-bold text-slate-900">Product details</h2>
      <p className="mt-0.5 text-xs text-slate-600">Complete specifications for this cab listing.</p>

      <dl className="mt-3 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-2 text-xs">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="text-right font-medium text-slate-900">{row.value}</dd>
          </div>
        ))}
      </dl>

      {features.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Features & amenities</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {features.map((f) => (
              <span key={f} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                {f}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}


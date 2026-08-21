import { formatRating, num } from "../lib/cabFare";
import { formatCabSeatLabel, inferPassengerSeats } from "../lib/cabSeats";
import { formatInrCurrency } from "../lib/formatInr";

export default function CabProductSpecs({ cab }) {
  const features = Array.isArray(cab.features) ? cab.features : [];
  const extra =
    num(cab.extraHourRate) ||
    num((cab.packages || []).find((p) => num(p.extraHourRate) > 0)?.extraHourRate);
  /* Only shown after the first approved verified review */
  const ratingText = formatRating(cab);

  const rows = [
    { label: "Vehicle", value: cab.title || cab.examples?.split(",")[0]?.trim() || "—" },
    { label: "Category", value: inferPassengerSeats(cab) > 8 || String(cab.type).includes("Tempo") ? "Van / Bus" : "Taxi Car" },
    { label: "Body type", value: cab.type },
    { label: "Vendor", value: cab.vendor },
    { label: "Seats", value: formatCabSeatLabel(cab) },
    { label: "Base price", value: cab.price ? formatInrCurrency(num(cab.price)) : "—" },
    { label: "Extra km", value: num(cab.pricePerKm) > 0 ? `${formatInrCurrency(num(cab.pricePerKm))}/km` : "—" },
    { label: "Extra hour", value: extra > 0 ? `${formatInrCurrency(extra)}/hr` : "—" },
    { label: "Driver batta / day", value: num(cab.driverAllowance) > 0 ? formatInrCurrency(num(cab.driverAllowance)) : "—" },
    ...(ratingText ? [{ label: "Rating", value: `${ratingText} / 5 · ${cab.reviewCount} verified` }] : [])
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


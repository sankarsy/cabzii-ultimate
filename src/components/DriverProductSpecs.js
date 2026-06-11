import { buildDriverChargeItems, formatDriverRating, getDriverPricing } from "../lib/driverFare";

export default function DriverProductSpecs({ driver }) {
  const vehicles = Array.isArray(driver.supportedVehicles) ? driver.supportedVehicles : [];
  const languages = Array.isArray(driver.languages) ? driver.languages : [];
  const features = Array.isArray(driver.features) ? driver.features : [];
  const { hourly, day, extraHr, extraKm } = getDriverPricing(driver);
  const chargeItems = buildDriverChargeItems(driver);
  /* Only shown after the first approved verified review */
  const ratingText = formatDriverRating(driver);

  const rows = [
    { label: "Vehicle", value: driver.name },
    { label: "Service type", value: driver.type === "van" ? "Van / Bus chauffeur" : "Taxi car chauffeur" },
    { label: "Vendor", value: driver.vendor || "—" },
    { label: "City", value: driver.city || "—" },
    { label: "Experience", value: driver.experience ?? "—" },
    { label: "Total trips", value: driver.trips ?? "—" },
    { label: "Hourly rate", value: hourly > 0 ? `₹${hourly.toLocaleString("en-IN")}/hr` : "—" },
    { label: "Day rate", value: day > 0 ? `₹${day.toLocaleString("en-IN")}/day` : "—" },
    { label: "Extra hour", value: extraHr > 0 ? `₹${extraHr.toLocaleString("en-IN")}/hr` : "—" },
    { label: "Extra km", value: extraKm > 0 ? `₹${extraKm}/km` : "—" },
    {
      label: "Discount",
      value: driver.discountPercentage ? `${driver.discountPercentage}% OFF` : "—"
    },
    ...(ratingText ? [{ label: "Rating", value: `${ratingText} / 5 · ${driver.reviewCount} verified` }] : [])
  ];

  return (
    <section id="product-details" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-base font-bold text-slate-900">Product details</h2>
      <p className="mt-0.5 text-xs text-slate-600">Complete specifications for this chauffeur listing.</p>

      <dl className="mt-3 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 py-2 text-xs">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="text-right font-medium text-slate-900">{row.value}</dd>
          </div>
        ))}
      </dl>

      {vehicles.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Supported vehicles</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {vehicles.map((v) => (
              <span key={v} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                {v}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {languages.length > 0 ? (
        <div className="mt-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Languages</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <span key={lang} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-700">
                {lang}
              </span>
            ))}
          </div>
        </div>
      ) : null}

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

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Additional charges</p>
        <dl className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/90 p-3">
          {chargeItems.map((item) => (
            <div key={item.label} className="flex justify-between gap-4 py-1.5 text-[10px]">
              <dt className="text-slate-500">{item.label}</dt>
              <dd className="text-right font-medium text-slate-800">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

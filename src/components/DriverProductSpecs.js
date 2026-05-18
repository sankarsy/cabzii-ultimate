import { getDriverPricing, num } from "../lib/driverFare";

export default function DriverProductSpecs({ driver }) {
  const vehicles = Array.isArray(driver.supportedVehicles) ? driver.supportedVehicles : [];
  const languages = Array.isArray(driver.languages) ? driver.languages : [];
  const { hourly, day, extraHr } = getDriverPricing(driver);

  const rows = [
    { label: "Driver name", value: driver.name },
    { label: "Vendor", value: driver.vendor || "—" },
    { label: "Experience", value: driver.experience ?? "—" },
    { label: "Total trips", value: driver.trips ?? "—" },
    { label: "Rating", value: driver.rating != null ? `${driver.rating} / 5` : "—" },
    { label: "Hourly rate", value: hourly > 0 ? `₹${hourly.toLocaleString("en-IN")}/hr` : "—" },
    { label: "Day rate", value: day > 0 ? `₹${day.toLocaleString("en-IN")}/day` : "—" },
    { label: "Extra hour", value: extraHr > 0 ? `₹${extraHr.toLocaleString("en-IN")}/hr` : "—" },
    {
      label: "Discount",
      value: driver.discountPercentage ? `${driver.discountPercentage}% OFF` : "—"
    }
  ];

  return (
    <section id="product-details" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-base font-bold text-slate-900">Driver details</h2>
      <p className="mt-0.5 text-xs text-slate-600">Complete profile and pricing for this driver.</p>

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
              <span key={lang} className="rounded-full bg-cyan-50 px-2.5 py-0.5 text-[10px] font-medium text-cyan-700">
                {lang}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}


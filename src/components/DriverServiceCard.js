"use client";

import { useMemo, useState } from "react";

export default function DriverServiceCard({ driver, onBook }) {
  const isOutstation = (driver.type ?? "").toLowerCase().includes("outstation");
  const baseVehicleFare = typeof driver.vehiclePricing === "number" ? driver.vehiclePricing : driver.vehiclePricing?.sedan ?? driver.pricing?.hourly ?? 0;
  const firstSlabFare = isOutstation
    ? driver.pricing?.["12 hour"] ?? driver.pricing?.["4 hour"] ?? driver.pricing?.hourly ?? baseVehicleFare
    : driver.pricing?.["4 hour"] ?? driver.pricing?.hourly ?? baseVehicleFare;
  const dayFare = driver.pricing?.day ?? Math.round(firstSlabFare * 8);
  const weeklyFare = driver.pricing?.weekly ?? (dayFare > 0 ? Math.round(dayFare * 5) : 0);
  const monthlyFare = driver.pricing?.monthly ?? (weeklyFare > 0 ? Math.round(weeklyFare * 4) : 0);
  const packageOptions = useMemo(
    () => [
      { id: "firstSlab", label: isOutstation ? "12 hours" : "4 hour", price: firstSlabFare },
      { id: "1day", label: isOutstation ? "one way package" : "1 day", price: dayFare },
      { id: "1week", label: "1 week", price: weeklyFare },
      { id: "1month", label: "one month", price: monthlyFare }
    ],
    [isOutstation, firstSlabFare, dayFare, weeklyFare, monthlyFare]
  );
  const [selectedPackage, setSelectedPackage] = useState("firstSlab");

  const extraHour = driver.serviceCharges?.extraHour ?? driver.pricing?.extraHour ?? 0;
  const ex = Number(extraHour) || 0;
  const day = Number(driver.pricing?.day) || 0;
  const nightCharge = driver.serviceCharges?.nightCharge ?? (ex > 0 ? Math.round(ex * 0.25) : null);
  const dropCharge = driver.serviceCharges?.dropCharge ?? "Confirm at booking";
  const outOfCity = driver.serviceCharges?.outOfCity ?? (day > 0 ? Math.round(day * 0.08) : null);
  const cancelCharge = driver.serviceCharges?.cancelCharge ?? null;
  const accommodation = driver.serviceCharges?.accommodation;
  const oneWayBusFare = driver.serviceCharges?.oneWayBusFare;
  const serviceTypeLabel = (driver.type ?? "standard").replace(/\b\w/g, (char) => char.toUpperCase());
  const hasLuxury = (driver.type ?? "").toLowerCase().includes("luxury");
  const typeTag = hasLuxury ? "Luxury" : "Standard";
  const discountPercentage = driver.discountPercentage ?? 0;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900 shadow-sm">
      <div className="flex items-center justify-between gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
          <span aria-hidden="true">O</span>
          Call Driver
        </span>
        <div className="flex items-center gap-1">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
            {typeTag}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">Available 24/7</span>
        </div>
      </div>

      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-tight sm:text-lg">{driver.serviceTitle ?? "—"}</h3>
          <p className="mt-0.5 text-sm text-slate-500">{driver.serviceSubtitle ?? "—"}</p>
        </div>
        {driver.image ? (
          <img
            src={driver.image}
            alt={`${driver.type ?? "driver"} service`}
            className="h-14 w-24 shrink-0 rounded-lg border border-slate-200 object-cover shadow-sm"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-semibold text-slate-600 shadow-sm">CAR</div>
        )}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-1.5 gap-y-1 border-y border-slate-200 py-1.5 text-[10px] font-semibold text-slate-600 md:grid-cols-4">
        <span className="inline-flex items-center gap-2"><span aria-hidden="true">o</span> {serviceTypeLabel}</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden="true">*</span> {driver.rating}</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden="true">o</span> Night charges apply</span>
        <span className="inline-flex items-center gap-2"><span aria-hidden="true">o</span> Trained drivers</span>
      </div>

      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Choose Package</p>
      <div className="mt-1.5 grid auto-rows-fr grid-cols-2 gap-1.5 md:grid-cols-4">
        {packageOptions.map((pkg) => (
          <PackageBox
            key={pkg.id}
            label={pkg.label}
            price={pkg.price}
            discountPercentage={discountPercentage}
            selected={selectedPackage === pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
          />
        ))}
      </div>

      <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-0.5 border-t border-slate-200 pt-1.5 text-xs text-slate-600 sm:grid-cols-2">
        <p>extra hour: ₹{ex}/hr</p>
        {!isOutstation && <p>night charges: {nightCharge != null ? `₹${nightCharge} extra` : "—"}</p>}
        {isOutstation && accommodation && <p>accommodation: {accommodation}</p>}
        {oneWayBusFare && selectedPackage === "1day" && (
          <p>
            one way bus fare: {oneWayBusFare.toString().startsWith("₹") ? oneWayBusFare : `₹${oneWayBusFare}`}
          </p>
        )}
        <p>drop charge: {typeof dropCharge === "number" ? `₹${dropCharge}` : dropCharge}</p>
        <p>out of city (&gt;40 km): {outOfCity != null ? `₹${outOfCity}` : "—"}</p>
        <p>cancel charge: {cancelCharge != null ? `₹${cancelCharge}` : "—"}</p>
      </div>

      <button
        type="button"
        onClick={onBook}
        className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-sky-600 py-2 text-base font-bold text-white transition hover:bg-sky-700"
      >
        Book Now
      </button>
    </article>
  );
}

function PackageBox({ label, price, discountPercentage, selected = false, onClick }) {
  const d = Math.min(99, Math.max(0, Number(discountPercentage) || 0));
  const p = Math.max(0, Number(price) || 0);
  const strike = d > 0 && p > 0 ? Math.round(p / (1 - d / 100)) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full min-h-[4.5rem] w-full flex-col justify-center rounded-lg border p-2 text-left ${
        selected ? "border-[#0056D2] bg-slate-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex min-h-[2rem] items-start justify-between gap-1">
        <p className="line-clamp-2 text-xs font-semibold leading-tight text-slate-700">{label}</p>
        {d > 0 ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
            {d}% off
          </span>
        ) : null}
      </div>
      <div className="min-h-[0.875rem]">
        {strike ? (
          <p className="text-[11px] font-semibold text-slate-400 line-through">₹{strike.toLocaleString("en-IN")}</p>
        ) : null}
      </div>
      <p className="mt-0.5 text-lg font-bold text-sky-700">{p > 0 ? `₹${p.toLocaleString("en-IN")}` : "—"}</p>
    </button>
  );
}

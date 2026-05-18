import { calculateBookingTotals, num, vendorInitials } from "./cabFare";

export { num, vendorInitials as driverInitials };

export function isOutstationDriver(driver) {
  const t = String(driver?.type ?? "").toLowerCase();
  return t.includes("outstation");
}

export function getDriverPricing(driver) {
  const hourly = num(driver?.pricing?.hourly ?? driver?.pricing?.["4 hour"]);
  const day = num(driver?.pricing?.day);
  const extraHr = num(driver?.pricing?.extraHour) || hourly || 0;
  const extraKm = Math.max(12, Math.floor((day || hourly || 100) / 10));
  const nightCharge = extraHr > 0 ? Math.max(0, Math.round(extraHr * 0.25)) : null;
  return { hourly, day, extraHr, extraKm, nightCharge };
}

export function buildDriverFareSlabs(driver) {
  const { hourly, day, extraHr, extraKm } = getDriverPricing(driver);

  const local4 = hourly > 0 ? Math.round(hourly * 4) : day > 0 ? Math.round(day * 0.55) : 0;
  const localDay = day > 0 ? day : hourly > 0 ? Math.round(hourly * 8) : local4;

  const out12 = num(driver?.pricing?.["12 hour"]) || (hourly > 0 ? Math.round(hourly * 12) : Math.round(localDay * 1.2));
  const outTrip = day > 0 ? day : out12;

  return [
    {
      id: "local_4hr",
      group: "local",
      label: "4 Hours",
      shortLabel: "4 Hours",
      list: Math.max(local4, 1),
      popular: true,
      extraKm,
      extraHr: extraHr || hourly || 0
    },
    {
      id: "local_day",
      group: "local",
      label: "1 Day",
      shortLabel: "1 Day",
      list: Math.max(localDay, 1),
      extraKm,
      extraHr: extraHr || hourly || 0
    },
    {
      id: "outstation_12hr",
      group: "outstation",
      label: "12 Hours",
      shortLabel: "12 Hours",
      list: Math.max(out12, 1),
      extraKm,
      extraHr: extraHr || hourly || 0
    },
    {
      id: "outstation_oneway",
      group: "outstation",
      label: "One Way Package",
      shortLabel: "One Way",
      list: Math.max(outTrip, 1),
      note: "Per trip quote",
      extraKm,
      extraHr: extraHr || hourly || 0
    }
  ];
}

export function buildDriverChargeItems(driver) {
  const isOut = isOutstationDriver(driver);
  const { extraKm, extraHr, nightCharge, day } = getDriverPricing(driver);
  const sc = driver?.serviceCharges ?? {};
  const dropCharge = sc.dropCharge ?? "Contact vendor";
  const outOfCity = sc.outOfCity ?? (day > 0 ? `₹${Math.round(day * 0.08)}` : "Per trip quote");
  const cancelCharge = sc.cancelCharge ?? "As per vendor policy";
  const accommodation = sc.accommodation;

  const items = [
    { label: "Extra KM Charge", value: `₹${extraKm}/km` },
    { label: "Extra Hour Charge", value: `₹${extraHr}/hr` },
    { label: "Drop Charge", value: typeof dropCharge === "number" ? `₹${dropCharge}` : String(dropCharge) },
    {
      label: "Night Charges",
      value: nightCharge != null ? `₹${nightCharge} extra (10 PM – 6 AM)` : "—"
    },
    { label: "Cancel Charge", value: typeof cancelCharge === "number" ? `₹${cancelCharge}` : String(cancelCharge) },
    { label: "Out of City (>40 km)", value: typeof outOfCity === "number" ? `₹${outOfCity}` : String(outOfCity) },
    { label: "Driver Allowance", value: "Included" },
    { label: "Toll, Parking & State Tax", value: "As per actuals" }
  ];

  if (isOut && accommodation) {
    items.splice(6, 0, { label: "Accommodation", value: String(accommodation) });
  }

  return items;
}

export function formatDriverRating(driver) {
  if (driver?.rating == null || driver?.rating === "") return null;
  const n = Number(driver.rating);
  if (!Number.isFinite(n)) return null;
  return n.toFixed(1);
}

export function selectionFromDriverPackage(pkg, tab, discountPct) {
  const listPrice = pkg?.list ?? 0;
  const totals = calculateBookingTotals(listPrice, discountPct);
  return {
    packageId: pkg?.id,
    packageLabel: pkg?.label,
    serviceTab: tab,
    listPrice,
    extraKm: pkg?.extraKm,
    extraHr: pkg?.extraHr,
    note: pkg?.note,
    ...totals,
    fare: totals.baseFare
  };
}

export function buildDriverPaymentSearchParams(driverId, selection) {
  if (!driverId || !selection) return null;
  const q = new URLSearchParams({
    type: "driver",
    id: String(driverId),
    baseFare: String(selection.baseFare ?? selection.fare ?? 0),
    taxes: "0",
    total: String(selection.total ?? selection.baseFare ?? 0),
    listPrice: String(selection.listPrice ?? selection.baseFare ?? 0),
    discountPct: String(selection.discountPct ?? 0),
    discountAmount: String(selection.discountAmount ?? 0)
  });
  if (selection.packageId) q.set("packageId", selection.packageId);
  if (selection.packageLabel) q.set("package", selection.packageLabel);
  if (selection.serviceTab) q.set("service", selection.serviceTab);
  if (selection.extraKm != null) q.set("extraKm", String(selection.extraKm));
  if (selection.extraHr != null) q.set("extraHr", String(selection.extraHr));
  return q;
}

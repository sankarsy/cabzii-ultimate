import { calculateBookingTotals, num, packageYouPay, vendorInitials } from "./cabFare";

export { num, vendorInitials as driverInitials };

export function isOutstationDriver(driver) {
  const t = String(driver?.type ?? "").toLowerCase();
  return t.includes("outstation");
}

const DRIVER_SLAB_META = [
  { id: "local_4hr", group: "local", defaultLabel: "4 Hours", key: "local4hr", popular: true },
  { id: "local_day", group: "local", defaultLabel: "1 Day", key: "localDay" },
  { id: "outstation_12hr", group: "outstation", defaultLabel: "12 Hours", key: "outstation12hr" },
  {
    id: "outstation_oneway",
    group: "outstation",
    defaultLabel: "One Way Package",
    key: "outstationOneWay",
    note: "Per trip quote"
  }
];

function labelForKey(labels, key, fallback) {
  const custom = labels?.[key];
  return typeof custom === "string" && custom.trim() ? custom.trim() : fallback;
}

function resolveDriverPackageFare(pkg, driver, fallbackList) {
  const discount = num(pkg?.discountPercentage ?? driver?.discountPercentage);
  const originalPrice =
    num(pkg?.originalPrice) > 0 ? num(pkg.originalPrice) : Math.max(num(fallbackList), 1);
  const price = num(pkg?.price) > 0 ? num(pkg.price) : packageYouPay(originalPrice, discount);
  const hourly = num(driver?.pricing?.hourly);
  const day = num(driver?.pricing?.day);
  const extraHr = num(pkg?.extraHourRate) || num(driver?.pricing?.extraHour) || hourly || 0;
  const extraKm = num(pkg?.extraKmRate) > 0 ? num(pkg.extraKmRate) : Math.max(12, Math.floor((day || hourly || 100) / 10));

  return { originalPrice, price, discountPercentage: discount, extraKm, extraHr };
}

function buildLegacyDriverSlabs(driver) {
  const hourly = num(driver?.pricing?.hourly);
  const day = num(driver?.pricing?.day);
  const local4 = hourly > 0 ? Math.round(hourly * 4) : day > 0 ? Math.round(day * 0.55) : 0;
  const localDay = day > 0 ? day : hourly > 0 ? Math.round(hourly * 8) : local4;
  const out12 = hourly > 0 ? Math.round(hourly * 12) : Math.round(localDay * 1.2);
  const outOne = day > 0 ? day : out12;
  return { local4hr: local4, localDay, outstation12hr: out12, outstationOneWay: outOne };
}

export function getDriverPricing(driver) {
  const slabs = buildDriverFareSlabs(driver);
  const first = slabs[0];
  const extraHr = first?.extraHr ?? num(driver?.pricing?.extraHour) ?? 0;
  const extraKm = first?.extraKm ?? 12;
  const nightCharge = extraHr > 0 ? Math.max(0, Math.round(extraHr * 0.25)) : null;
  return {
    hourly: num(driver?.pricing?.hourly),
    day: num(driver?.pricing?.day),
    extraHr,
    extraKm,
    nightCharge
  };
}

export function buildDriverFareSlabs(driver) {
  const packages = driver?.farePackages || {};
  const labels = driver?.farePackageLabels || {};
  const legacy = buildLegacyDriverSlabs(driver);

  return DRIVER_SLAB_META.map((meta) => {
    const stored = packages[meta.key];
    const fallbackList = legacy[meta.key];
    const fare = resolveDriverPackageFare(stored, driver, fallbackList);
    const label = labelForKey(labels, meta.key, meta.defaultLabel);

    return {
      id: meta.id,
      group: meta.group,
      label,
      shortLabel: label,
      list: fare.originalPrice,
      originalPrice: fare.originalPrice,
      price: fare.price,
      discountPercentage: fare.discountPercentage,
      popular: meta.popular,
      note: meta.note,
      extraKm: fare.extraKm,
      extraHr: fare.extraHr
    };
  });
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

export function buildDriverPaymentSearchParams(driverId, selection) {
  if (!driverId || !selection) return null;
  const q = new URLSearchParams({
    type: "driver",
    id: String(driverId),
    baseFare: String(selection.baseFare ?? selection.fare ?? 0),
    taxes: String(selection.taxes ?? 0),
    total: String(selection.total ?? 0),
    listPrice: String(selection.listPrice ?? selection.baseFare ?? 0),
    discountPct: String(selection.discountPct ?? 0),
    discountAmount: String(selection.discountAmount ?? 0)
  });
  if (selection.packageId) q.set("packageId", selection.packageId);
  if (selection.packageLabel) q.set("package", selection.packageLabel);
  if (selection.serviceTab) q.set("service", selection.serviceTab);
  return q;
}

export function selectionFromDriverPackage(pkg, tab, discountPct) {
  const listPrice = num(pkg?.originalPrice) > 0 ? num(pkg.originalPrice) : num(pkg?.list ?? 0);
  const d =
    pkg?.discountPercentage != null && pkg?.discountPercentage !== ""
      ? num(pkg.discountPercentage)
      : num(discountPct);
  const baseFromPkg = num(pkg?.price) > 0 ? num(pkg.price) : packageYouPay(listPrice, d);
  const totals = calculateBookingTotals(listPrice, d);
  const total = listPrice > 0 && num(pkg?.price) > 0 ? baseFromPkg : totals.total;

  return {
    packageId: pkg?.id,
    packageLabel: pkg?.label,
    serviceTab: tab,
    listPrice,
    extraKm: pkg?.extraKm,
    extraHr: pkg?.extraHr,
    note: pkg?.note,
    ...totals,
    baseFare: total,
    total,
    fare: total
  };
}

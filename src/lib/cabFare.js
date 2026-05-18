export function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function buildFareSlabs(cab) {
  const hourly = num(cab.hourlyRate);
  const day = num(cab.dayRate);
  const price = num(cab.price);
  const local4 =
    hourly > 0 ? Math.round(hourly * 4) : day > 0 ? Math.round(day * 0.55) : price > 0 ? Math.round(price * 0.4) : 0;
  const local8 =
    day > 0 ? Math.round(day) : hourly > 0 ? Math.round(hourly * 8) : price > 0 ? Math.round(price * 0.72) : 0;
  const outOne = price > 0 ? Math.round(price) : Math.max(local8, local4, 1);
  const outTwo = day > 0 ? Math.round(day * 1.85) : Math.round(outOne * 1.62);

  return [
    {
      id: "local_4hr",
      group: "local",
      label: "4 Hrs / 40 Km",
      shortLabel: "4 Hrs / 40 Km",
      list: Math.max(local4, 1),
      popular: true,
      extraKm: Math.max(12, Math.floor(price / 10) || 12),
      extraHr: num(cab.extraHourRate) || Math.max(12, Math.floor(price / 12) || 12)
    },
    {
      id: "local_1day",
      group: "local",
      label: "8 Hrs / 80 Km",
      shortLabel: "8 Hrs / 80 Km",
      list: Math.max(local8, 1),
      extraKm: Math.max(12, Math.floor(price / 10) || 12),
      extraHr: num(cab.extraHourRate) || Math.max(12, Math.floor(price / 12) || 12)
    },
    {
      id: "outstation_oneway",
      group: "outstation",
      label: "One Way",
      shortLabel: "One Way",
      list: Math.max(outOne, 1),
      note: "Per Trip Quote",
      extraKm: Math.max(14, Math.floor(price / 9) || 14),
      extraHr: num(cab.extraHourRate) || Math.max(14, Math.floor(price / 10) || 14)
    },
    {
      id: "outstation_twoway",
      group: "outstation",
      label: "Two Way",
      shortLabel: "Two Way",
      list: Math.max(outTwo, 1),
      note: "Round Trip Quote",
      extraKm: Math.max(14, Math.floor(price / 9) || 14),
      extraHr: num(cab.extraHourRate) || Math.max(14, Math.floor(price / 10) || 14)
    }
  ];
}

export function formatRating(cab) {
  if (cab.rating == null || cab.rating === "") return null;
  const n = Number(cab.rating);
  if (!Number.isFinite(n)) return null;
  return n.toFixed(1);
}

export function vendorInitials(vendor) {
  const parts = String(vendor || "V")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) || "V").toUpperCase();
}

export function packageYouPay(list, discount) {
  const d = Math.min(99, Math.max(0, num(discount)));
  return d > 0 ? Math.round(list * (1 - d / 100)) : list;
}

/** Full payment breakdown for a selected package (GST not shown or added to payable total) */
export function calculateBookingTotals(listPrice, discountPct) {
  const list = Math.max(0, num(listPrice));
  const d = Math.min(99, Math.max(0, num(discountPct)));
  const baseFare = packageYouPay(list, d);
  const discountAmount = list - baseFare;
  const taxes = 0;
  const total = baseFare;
  return { listPrice: list, discountPct: d, discountAmount, baseFare, taxes, total, taxRate: 0 };
}

export function buildPaymentSearchParams(cabId, selection) {
  if (!cabId || !selection) return null;
  const q = new URLSearchParams({
    type: "cab",
    id: String(cabId),
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

export function selectionFromPackage(pkg, tab, discountPct) {
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

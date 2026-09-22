/** Active homepage / CMS offers — never render a date that has already passed. */

const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11
};

function startOfIstDay(d) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return new Date(`${y}-${m}-${day}T00:00:00+05:30`);
}

export function parseOfferEndDate(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T23:59:59+05:30`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const loose = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9}),?\s+(\d{4})/);
  if (loose) {
    const month = MONTHS[loose[2].slice(0, 3).toLowerCase()];
    if (month == null) return null;
    const d = new Date(Date.UTC(Number(loose[3]), month, Number(loose[1]), 18, 29, 59));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isOfferActive(offer, now = new Date()) {
  if (!offer || offer.published === false || offer.active === false) return false;
  const until = parseOfferEndDate(offer.validUntil || offer.validTill);
  if (!until) return true;
  return until.getTime() >= startOfIstDay(now).getTime();
}

export function filterActiveOffers(cards = []) {
  return (Array.isArray(cards) ? cards : []).filter((card) => isOfferActive(card));
}

export function formatOfferValidUntil(offer, now = new Date()) {
  const until = parseOfferEndDate(offer?.validUntil || offer?.validTill);
  if (!until || until.getTime() < startOfIstDay(now).getTime()) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  }).format(until);
}

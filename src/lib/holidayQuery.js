/** Thin /holidays?q=… filters → canonical tour SEO landings. */

export const HOLIDAY_QUERY_CANONICAL = {
  tirupati: "/tour-packages/tirupati-balaji-darshan-tirupati",
  tirumala: "/tour-packages/tirupati-balaji-darshan-tirupati",
  balaji: "/tour-packages/tirupati-balaji-darshan-tirupati"
};

export function resolveHolidayQueryHref(query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return null;
  return HOLIDAY_QUERY_CANONICAL[q] || null;
}

export function canonicalizeHolidayHref(href) {
  const raw = String(href || "").trim();
  if (!raw.startsWith("/holidays")) return raw;
  try {
    const url = new URL(raw, "https://www.cabzii.in");
    return resolveHolidayQueryHref(url.searchParams.get("q")) || raw;
  } catch {
    return raw;
  }
}

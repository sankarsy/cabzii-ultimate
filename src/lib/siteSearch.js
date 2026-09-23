import { actingDriverLandingPath } from "./cityCabPaths";

function normalizeQuery(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[+_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const DRIVER_INTENT =
  /\b(acting\s*drivers?|call\s*drivers?|chauffeurs?|drivers?\s*on\s*hire|hire\s*(an?\s*)?drivers?)\b/;

export function isCallDriverSearchQuery(value) {
  const q = normalizeQuery(value);
  if (!q) return false;
  if (q === "driver" || q === "drivers") return true;
  return DRIVER_INTENT.test(q);
}

function citySlugFromDriverQuery(value) {
  const q = normalizeQuery(value);
  const stripped = q
    .replace(DRIVER_INTENT, " ")
    .replace(/\b(in|at|for|near)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!stripped) return "";
  if (stripped === "bangalore" || stripped === "blr") return "bengaluru";
  if (stripped === "madras") return "chennai";
  const slug = stripped.replace(/\s+/g, "-");
  return /^[a-z0-9-]{3,40}$/.test(slug) ? slug : "";
}

/** Product page for a header search, or `/search?q=` when it is a catalog query. Never uses the city cookie. */
export function resolveSiteSearchHref(value) {
  const raw = String(value || "").trim();
  if (!raw) return "/search";
  if (isCallDriverSearchQuery(raw)) {
    const citySlug = citySlugFromDriverQuery(raw);
    return citySlug ? actingDriverLandingPath(citySlug) : "/call-driver";
  }
  return `/search?q=${encodeURIComponent(raw)}`;
}

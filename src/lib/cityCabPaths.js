/** Canonical city taxi landing: /car-rental/{city-slug}-city-cabs */

export const CITY_CABS_SUFFIX = "-city-cabs";
export const CITY_CABS_HUB_PATH = "/car-rental";
export const CALL_DRIVERS_CHENNAI_PATH = "/call-drivers-chennai";

export function cityCabLandingSlug(citySlug) {
  return `${String(citySlug || "").toLowerCase()}${CITY_CABS_SUFFIX}`;
}

export function cityCabLandingPath(citySlug) {
  return `${CITY_CABS_HUB_PATH}/${cityCabLandingSlug(citySlug)}`;
}

export function parseCityCabLandingSlug(slug) {
  const raw = String(slug || "").toLowerCase();
  if (!raw.endsWith(CITY_CABS_SUFFIX)) return null;
  const citySlug = raw.slice(0, -CITY_CABS_SUFFIX.length);
  return /^[a-z0-9-]+$/.test(citySlug) ? citySlug : null;
}

export function isCityCabLandingPath(pathname) {
  const parts = String(pathname || "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
  return parts.length === 2 && parts[0] === "car-rental" && Boolean(parseCityCabLandingSlug(parts[1]));
}

export function actingDriverLandingPath(citySlug) {
  const slug = String(citySlug || "").toLowerCase();
  if (!slug) return "/acting-driver";
  return slug === "chennai" ? CALL_DRIVERS_CHENNAI_PATH : `/acting-driver/${slug}`;
}

/** Live URL for CMS city pages (cab-booking / acting-driver). */
export function seoCityPublicPath(pageType, citySlug) {
  if (pageType === "acting-driver") return actingDriverLandingPath(citySlug);
  return cityCabLandingPath(citySlug);
}

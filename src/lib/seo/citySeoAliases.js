/**
 * Programmatic Google-search URL aliases for all SEO cities.
 * Maps keyword slugs → canonical paths (301 via middleware).
 */
import { SEO_CITIES } from "./cities";

/** Alternate URL tokens (e.g. bangalore → bengaluru canonical slug). */
const CITY_URL_TOKENS = {
  bengaluru: ["bengaluru", "bangalore"]
};

function tokensForCity(city) {
  const custom = CITY_URL_TOKENS[city.slug];
  if (custom) return custom;
  return [city.slug];
}

function add(map, slug, target) {
  const key = String(slug || "").toLowerCase();
  if (!key || map[key]) return;
  map[key] = target;
}

/** @returns {Record<string, string>} */
export function buildCitySeoKeywordAliases() {
  const map = {};

  for (const city of SEO_CITIES) {
    const canonical = city.slug;
    const hub = `/cab-booking/${canonical}`;

    for (const token of tokensForCity(city)) {
      // Cab booking hub — GSC queries like "cab booking chennai", "chennai cabs"
      add(map, `cab-booking-${token}`, hub);
      add(map, `${token}-cab-booking`, hub);
      add(map, `cab-booking-in-${token}`, hub);
      add(map, `book-cab-in-${token}`, hub);
      add(map, `book-a-cab-in-${token}`, hub);
      add(map, `book-taxi-${token}`, hub);
      add(map, `cab-${token}`, hub);
      add(map, `${token}-cab`, hub);
      add(map, `${token}-cabs`, hub);
      add(map, `cab-in-${token}`, hub);
      add(map, `${token}-cab-service`, hub);
      add(map, `${token}-cab-hire`, hub);
      add(map, `${token}-taxi-hire`, hub);
      add(map, `cab-service-in-${token}`, hub);
      add(map, `cab-service-${token}`, hub);
      add(map, `cab-services-in-${token}`, hub);
      add(map, `cab-services-${token}`, hub);
      add(map, `cabs-services-in-${token}`, hub);
      add(map, `${token}-cab-services`, hub);
      add(map, `taxi-service-${token}`, hub);
      add(map, `daily-cab-service-${token}`, hub);
      add(map, `online-cab-booking-${token}`, hub);

      // Cab / car rental
      add(map, `cab-rental-${token}`, `/services/cab-rental/${canonical}`);
      add(map, `${token}-cab-rental`, `/services/cab-rental/${canonical}`);
      add(map, `cab-rental-in-${token}`, `/services/cab-rental/${canonical}`);
      add(map, `car-rental-${token}`, `/services/car-rental/${canonical}`);
      add(map, `${token}-car-rental`, `/services/car-rental/${canonical}`);
      add(map, `car-rental-in-${token}`, `/services/car-rental/${canonical}`);
      add(map, `${token}-taxi-rental`, `/services/cab-rental/${canonical}`);
      add(map, `taxi-rental-in-${token}`, `/services/cab-rental/${canonical}`);

      // Full-day / hourly packages
      add(map, `full-day-taxi-${token}`, `/services/hourly-rental/${canonical}`);
      add(map, `full-day-taxi-in-${token}`, `/services/hourly-rental/${canonical}`);
      add(map, `full-day-cab-${token}`, `/services/hourly-rental/${canonical}`);
      add(map, `full-day-cab-in-${token}`, `/services/hourly-rental/${canonical}`);
      add(map, `cab-package-in-${token}`, `/services/hourly-rental/${canonical}`);
      add(map, `cab-package-${token}`, `/services/hourly-rental/${canonical}`);
      add(map, `hourly-cab-${token}`, `/services/hourly-rental/${canonical}`);

      // Outstation
      add(map, `outstation-cab-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `${token}-outstation-cabs`, `/services/outstation-cab/${canonical}`);
      add(map, `outstation-taxi-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `outstation-taxi-in-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `outstation-cab-booking-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `outstation-cabs-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `outstation-car-rental-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `cab-for-outstation-from-${token}`, `/services/outstation-cab/${canonical}`);
      add(map, `best-cab-service-in-${token}-for-outstation`, `/services/outstation-cab/${canonical}`);
      add(map, `${token}-outstation-cab`, `/services/outstation-cab/${canonical}`);

      // One-way
      add(map, `one-way-taxi-${token}`, `/services/one-way-cab/${canonical}`);
      add(map, `${token}-one-way-taxi`, `/services/one-way-cab/${canonical}`);

      // Local taxi
      add(map, `${token}-local-taxi`, `/services/local-taxi/${canonical}`);
      add(map, `local-taxi-${token}`, `/services/local-taxi/${canonical}`);

      // Airport
      add(map, `${token}-airport-taxi`, `/services/airport-taxi/${canonical}`);
      add(map, `airport-taxi-${token}`, `/services/airport-taxi/${canonical}`);
      add(map, `${token}-airport-transfer`, `/services/airport-taxi/${canonical}`);
      add(map, `${token}-airport-pickup-taxi`, `/services/airport-taxi/${canonical}`);
      add(map, `${token}-airport-drop-taxi`, `/services/airport-taxi/${canonical}`);
    }
  }

  return map;
}

export const CITY_SEO_KEYWORD_ALIASES = buildCitySeoKeywordAliases();

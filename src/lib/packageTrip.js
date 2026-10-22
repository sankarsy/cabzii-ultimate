import { inferCitySlugFromText } from "../config/seo-scope";
import { resolveScopedCity } from "./cityShowcase";
import { cityBySlug } from "./seo/cities";
import { todayStr } from "./mmtTrip";

/** Destination shown on the package (Tirupati for Balaji darshan, not the customer's city). */
export function packageDestinationName(pkg) {
  const raw = String(pkg?.destination || pkg?.city || "").trim();
  const slug = inferCitySlugFromText(raw) || inferCitySlugFromText(pkg?.name);
  return cityBySlug(slug)?.name || raw;
}

/**
 * Pickup = live selected / GPS city (Madurai if the customer is there).
 * Never use package pricingOriginCity — that is a fare origin, not the customer.
 */
export function customerPickupCity(selectedCity) {
  return resolveScopedCity(selectedCity || "Chennai");
}

export function packageBookingTrip(origin, destName) {
  const from = origin?.name || "Chennai";
  const to = String(destName || "").trim();
  const isOutstation = Boolean(to && to.toLowerCase() !== from.toLowerCase());
  return {
    tripType: isOutstation ? "outstation" : "local",
    from,
    to: isOutstation ? to : from,
    date: todayStr(),
    time: "09:00",
    roundTrip: false,
    city: from,
    packageHours: 8,
    isOutstation
  };
}

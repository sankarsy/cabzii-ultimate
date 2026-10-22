import { inferCitySlugFromText, isSeoScopeAirportCity, SEO_SCOPE_CITIES } from "../config/seo-scope";
import { cityBySlug } from "./seo/cities";
import { actingDriverLandingPath, airportTaxiPublicPath, cityCabLandingPath } from "./cityCabPaths";
import { pickOutstationRoutes } from "./cityOutstationRoutes";
import { formatInr } from "./formatInr";

const IMG = {
  outstation: "/images/showcase/outstation.webp",
  airport: "/images/showcase/airport.webp",
  chennai: "/images/showcase/chennai.webp",
  temple: "/images/showcase/temple.webp",
  driver: "/images/showcase/driver.webp",
  tempo: "/images/showcase/tempo.webp",
  route: "/images/showcase/route.webp"
};

export function resolveScopedCity(nameOrSlug) {
  const slug =
    inferCitySlugFromText(nameOrSlug) ||
    String(nameOrSlug || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
  return cityBySlug(slug) || SEO_SCOPE_CITIES.find((row) => row.slug === slug) || { slug: "chennai", name: "Chennai" };
}

/**
 * Generic home CTAs (/cabs, outstation packages) open that customer's city hub —
 * Pondicherry → /cab-booking/pondicherry, same layout as Chennai.
 */
export function cityScopedCardHref(href, cityNameOrSlug) {
  const city = resolveScopedCity(cityNameOrSlug);
  const landing = cityCabLandingPath(city.slug);
  const path = String(href || "/cabs")
    .split("?")[0]
    .replace(/\/+$/, "") || "/";
  if (path === "/cabs" || path === "/cab-booking" || path === "/cars") return landing;
  if (path === "/call-driver") return actingDriverLandingPath(city.slug);
  if (path === "/services/outstation-cab/chennai") return landing;
  if (path === "/chennai/airport-cab-booking" || path === "/services/airport-taxi/chennai") {
    return isSeoScopeAirportCity(city.slug) ? airportTaxiPublicPath(city.slug) : landing;
  }
  return href || landing;
}

export function cityServiceCards(city) {
  const name = city.name;
  const slug = city.slug;
  const cards = [
    {
      tag: name.toUpperCase(),
      title: `Cab booking in ${name}`,
      desc: `City, airport and outstation cabs in ${name}. Fares show before you pay.`,
      iconKey: "car",
      color: "from-[var(--cabzii-brand)] to-blue-500",
      image: IMG.chennai,
      href: cityCabLandingPath(slug)
    }
  ];
  if (isSeoScopeAirportCity(slug)) {
    cards.push({
      tag: "AIRPORT",
      title: `Airport taxi in ${name}`,
      desc: `Pickup and drop at the published ${name} terminal.`,
      iconKey: "airport",
      color: "from-indigo-500 to-violet-400",
      image: IMG.airport,
      href: airportTaxiPublicPath(slug)
    });
  }
  cards.push(
    {
      tag: "OUTSTATION",
      title: `Outstation cab from ${name}`,
      desc: `One-way and round trip cabs from ${name} to nearby cities.`,
      iconKey: "route",
      color: "from-amber-500 to-orange-400",
      image: IMG.outstation,
      href: `/services/outstation-cab/${slug}`
    },
    {
      tag: "DRIVER",
      title: `Call driver in ${name}`,
      desc: `Hire an acting driver for your own car in ${name}.`,
      iconKey: "driver",
      color: "from-slate-700 to-slate-500",
      image: IMG.driver,
      href: actingDriverLandingPath(slug)
    }
  );
  return cards;
}

export function cityRouteCards(city, limit = 12) {
  return pickOutstationRoutes(city.slug, { direction: "from", limit }).map((route) => ({
    tag: "OUTSTATION",
    title: `${route.originName} → ${route.otherName}`,
    desc: [route.distance, route.duration].filter(Boolean).join(" · ") || `Cab from ${route.originName} to ${route.otherName}.`,
    iconKey: "route",
    color: "from-slate-700 to-slate-500",
    image: IMG.route,
    href: route.href,
    fare: route.sedanFrom ? `From ₹${formatInr(route.sedanFrom)}` : undefined
  }));
}

export function cityServiceLinks(city) {
  return cityServiceCards(city).map((card) => ({ href: card.href, label: card.title }));
}

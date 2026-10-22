import {
  CITY_SLUG_ALIASES,
  isSeoScopeAirportCity,
  SEO_SCOPE_CITIES,
  SEO_SCOPE_SERVICES
} from "../config/seo-scope";
import {
  actingDriverLandingPath,
  airportTaxiPublicPath,
  cityCabLandingPath,
  isActingDriverHubCity
} from "./cityCabPaths";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[+_]+/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extra search tokens so shrine names and spellings hit the live city hub. */
const CITY_SEARCH_ALIASES = {
  sabarimala: [
    "sabarimala",
    "sabarimalai",
    "sabari malai",
    "pamba",
    "nilakkal",
    "erumeli",
    "ayyappa",
    "ayyapa",
    "ayyappan"
  ],
  ayyappankovil: ["ayyappankovil", "ayyappan kovil", "ayyappankoil", "ayyappan koil"],
  pondicherry: ["pondicherry", "puducherry", "pondy"],
  trichy: ["trichy", "tiruchi", "tiruchirappalli"],
  kanchipuram: ["kanchipuram", "kancheepuram"],
  ooty: ["ooty", "udhagamandalam", "udhagai"],
  kodaikanal: ["kodaikanal", "kodai"],
  tirupati: ["tirupati", "tirupathi", "balaji"]
};

function tokensForCity(city) {
  const fromAliasFile = Object.entries(CITY_SLUG_ALIASES)
    .filter(([, slug]) => slug === city.slug)
    .map(([alias]) => alias.replace(/-/g, " "));
  const extra = CITY_SEARCH_ALIASES[city.slug] || [];
  return [...new Set([city.slug.replace(/-/g, " "), city.name, ...fromAliasFile, ...extra].map(normalize).filter(Boolean))];
}

function cityMatchesQuery(city, query) {
  const q = normalize(query);
  if (!q || q.length < 4) return false;
  return tokensForCity(city).some((token) => {
    if (token.length < 4 && q !== token) return false;
    return q === token || q.includes(token) || (token.startsWith(q) && q.length >= 5);
  });
}

function serviceHitsForCity(city) {
  const name = city.name;
  const slug = city.slug;
  const hits = [
    {
      kind: "cab",
      href: cityCabLandingPath(slug),
      title: `Cab booking in ${name}`,
      hint: `Local, outstation and tempo packages for ${name}.`
    }
  ];
  for (const service of SEO_SCOPE_SERVICES) {
    if (service === "airport-taxi" && !isSeoScopeAirportCity(slug)) continue;
    if (service === "outstation-cab") {
      hits.push({
        kind: "outstation",
        href: `/services/outstation-cab/${slug}`,
        title: `Outstation cab to ${name}`,
        hint: "One-way and round-trip. Fare shown before you confirm."
      });
    } else if (service === "one-way-cab") {
      hits.push({
        kind: "oneway",
        href: `/services/one-way-cab/${slug}`,
        title: `One-way cab to ${name}`,
        hint: "Drop without a return mix-up."
      });
    } else if (service === "tempo-traveller") {
      hits.push({
        kind: "tempo",
        href: `/services/tempo-traveller/${slug}`,
        title: `Tempo traveller to ${name}`,
        hint: "Group cab package — 12 to 18 seater."
      });
    } else if (service === "airport-taxi") {
      hits.push({
        kind: "airport",
        href: airportTaxiPublicPath(slug),
        title: `Airport taxi in ${name}`,
        hint: "Pickup and drop at the published terminal."
      });
    }
  }
  if (isActingDriverHubCity(slug)) {
    hits.push({
      kind: "driver",
      href: actingDriverLandingPath(slug),
      title: `Acting driver in ${name}`,
      hint: "A chauffeur for your own car."
    });
  }
  return hits;
}

/** Live city / service pages for header search — not a thin URL farm. */
export function searchPublicCatalog(query) {
  const q = normalize(query);
  if (!q) return [];
  const cities = SEO_SCOPE_CITIES.filter((city) => cityMatchesQuery(city, q));
  const hits = [];
  const seen = new Set();
  for (const city of cities) {
    for (const hit of serviceHitsForCity(city)) {
      if (seen.has(hit.href)) continue;
      seen.add(hit.href);
      hits.push(hit);
    }
  }
  return hits;
}

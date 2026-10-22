/**
 * Live ranking cities only. Add a city here when you publish a rich hub.
 * Everything else 301s away — do not grow a thin city farm from this file.
 */
export const SEO_SCOPE_CITIES = [
  { slug: "chennai", name: "Chennai" },
  { slug: "madurai", name: "Madurai" },
  { slug: "tirupati", name: "Tirupati" },
  { slug: "trichy", name: "Trichy" },
  { slug: "coimbatore", name: "Coimbatore" },
  { slug: "vellore", name: "Vellore" },
  { slug: "kanchipuram", name: "Kanchipuram" },
  { slug: "kodaikanal", name: "Kodaikanal" },
  { slug: "ooty", name: "Ooty" },
  { slug: "pondicherry", name: "Pondicherry" },
  { slug: "sabarimala", name: "Sabarimala" },
  { slug: "ayyappankovil", name: "Ayyappan Kovil" }
];

export const SEO_SCOPE_CITY_SLUGS = SEO_SCOPE_CITIES.map((city) => city.slug);

/** Ranking service landings generated per keep city. */
export const SEO_SCOPE_SERVICES = ["outstation-cab", "one-way-cab", "tempo-traveller", "airport-taxi"];

/**
 * Airport landings for keep cities. Vellore has no commercial airport —
 * its page is a transfer to Chennai / Bengaluru / Tirupati.
 * Kanchipuram, Kodaikanal, Ooty, Sabarimala and Ayyappan Kovil have no airport product.
 * Pondicherry keeps PNY (small commercial field).
 */
export const SEO_SCOPE_NO_AIRPORT_CITY_SLUGS = [
  "kanchipuram",
  "kodaikanal",
  "ooty",
  "sabarimala",
  "ayyappankovil"
];

export const SEO_SCOPE_AIRPORT_CITY_SLUGS = SEO_SCOPE_CITY_SLUGS.filter(
  (slug) => !SEO_SCOPE_NO_AIRPORT_CITY_SLUGS.includes(slug)
);

/**
 * Only these route pages stay live. Create more from Google SEO pages when ready.
 */
export const SEO_SCOPE_FEATURED_ROUTES = [{ from: "chennai", to: "tirupati", slug: "chennai-to-tirupati-cab" }];

export const SEO_SCOPE_ROUTE_DESTINATIONS = SEO_SCOPE_FEATURED_ROUTES.map((row) => row.to);

export const CITY_SLUG_ALIASES = {
  bangalore: "bengaluru",
  tiruchi: "trichy",
  tiruchy: "trichy",
  tiruchirappalli: "trichy",
  tiruchirapalli: "trichy",
  puducherry: "pondicherry",
  pondichery: "pondicherry",
  pondy: "pondicherry",
  kancheepuram: "kanchipuram",
  kanchepuram: "kanchipuram",
  kancepuram: "kanchipuram",
  kodai: "kodaikanal",
  udhagamandalam: "ooty",
  udhagai: "ooty",
  sabarimalai: "sabarimala",
  "sabari-malai": "sabarimala",
  pamba: "sabarimala",
  "ayyappan-kovil": "ayyappankovil",
  "ayyappan-koil": "ayyappankovil",
  "ayyappa-kovil": "ayyappankovil",
  ayyappankoil: "ayyappankovil",
  ayyappancoil: "ayyappankovil"
};

export function normalizeSeoCitySlug(slug) {
  const value = String(slug || "")
    .toLowerCase()
    .trim();
  return CITY_SLUG_ALIASES[value] || value;
}

export function isSeoScopeCity(slug) {
  return SEO_SCOPE_CITY_SLUGS.includes(normalizeSeoCitySlug(slug));
}

export function isSeoScopeAirportCity(slug) {
  return SEO_SCOPE_AIRPORT_CITY_SLUGS.includes(normalizeSeoCitySlug(slug));
}

export function isSeoScopeRoute(fromSlug, toSlug) {
  const from = normalizeSeoCitySlug(fromSlug);
  const to = normalizeSeoCitySlug(toSlug);
  return SEO_SCOPE_FEATURED_ROUTES.some((row) => row.from === from && row.to === to);
}

export function inferCitySlugFromText(value) {
  const raw = normalizeSeoCitySlug(
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
  );
  if (isSeoScopeCity(raw)) return normalizeSeoCitySlug(raw);
  const hay = String(value || "").toLowerCase();
  for (const city of SEO_SCOPE_CITIES) {
    if (hay.includes(city.slug) || hay.includes(city.name.toLowerCase())) return city.slug;
  }
  return "";
}

/** Programmatic service pages at /services/{slug}/{city}. */
export const SEO_SERVICES = [
  {
    slug: "airport-taxi",
    name: "Airport Taxi",
    primaryKeyword: "airport taxi",
    searchQuery: "airport taxi",
    priceFrom: 899,
    highlights: ["MAA/BLR/HYD terminal pickup", "Flight buffer time", "Fixed fare quote"]
  },
  {
    slug: "outstation-cab",
    name: "Outstation Cab",
    primaryKeyword: "outstation cab",
    searchQuery: "outstation cab",
    priceFrom: 1400,
    highlights: ["Round trip & one way", "Per km fare shown upfront", "Highway-experienced drivers"]
  },
  {
    slug: "one-way-cab",
    name: "One Way Cab",
    primaryKeyword: "one way cab",
    searchQuery: "one way cab",
    priceFrom: 4500,
    highlights: ["Inter-city one way drops", "Sedan, SUV & Innova", "No return charge confusion"]
  },
  {
    slug: "driver-on-hire",
    name: "Driver on Hire",
    primaryKeyword: "driver on hire",
    searchQuery: "driver on hire",
    priceFrom: 500,
    highlights: ["Use your own car", "Hourly & daily packages", "Verified chauffeurs"]
  },
  {
    slug: "chauffeur-service",
    name: "Chauffeur Service",
    primaryKeyword: "chauffeur service",
    searchQuery: "chauffeur service",
    priceFrom: 600,
    highlights: ["Corporate & wedding travel", "Professional presentation", "Multi-stop city runs"]
  },
  {
    slug: "tempo-traveller",
    name: "Tempo Traveller",
    primaryKeyword: "tempo traveller rental",
    searchQuery: "tempo traveller",
    priceFrom: 3200,
    highlights: ["12 to 17 seater options", "Group & family trips", "AC tempo for outstation"]
  },
  {
    slug: "car-rental",
    name: "Car Rental",
    primaryKeyword: "car rental",
    searchQuery: "car rental",
    priceFrom: 1200,
    highlights: ["Self-drive alternatives via cab", "Sedan & SUV fleet", "Daily rental slabs"]
  },
  {
    slug: "cab-rental",
    name: "Cab Rental",
    primaryKeyword: "cab rental",
    searchQuery: "cab rental",
    priceFrom: 1400,
    highlights: ["Local day packages", "Extra km rates listed", "Vendor comparison"]
  },
  {
    slug: "local-taxi",
    name: "Local Taxi",
    primaryKeyword: "local taxi service",
    searchQuery: "local taxi",
    priceFrom: 400,
    highlights: ["City point-to-point rides", "Hourly city packages", "Near-me pickup search"]
  },
  {
    slug: "hourly-rental",
    name: "Hourly Rental Taxi",
    primaryKeyword: "hourly cab rental",
    searchQuery: "hourly cab",
    priceFrom: 320,
    highlights: ["4hr / 8hr / 12hr slabs", "Ideal for errands & meetings", "Transparent extra hour rate"]
  },
  {
    slug: "tour-packages",
    name: "Holiday Packages",
    primaryKeyword: "holiday packages",
    searchQuery: "holiday package",
    priceFrom: 4999,
    highlights: ["Pilgrimage circuits", "Beach & hill getaways", "Tirupati & Rameswaram tours"]
  }
];

export function serviceBySlug(slug) {
  return SEO_SERVICES.find((s) => s.slug === slug) ?? null;
}

export function servicePath(service, city) {
  return `/services/${service.slug}/${city.slug}`;
}

export function serviceTitle(service, cityName) {
  return `${service.name} in ${cityName} | Book Online | Cabzii`;
}

export function serviceDescription(service, city) {
  return `Book ${service.name.toLowerCase()} in ${city.name}, ${city.state}. ${service.highlights[0]}. Compare fares and book instantly on Cabzii with OTP login.`;
}

export function serviceKeywords(service, city) {
  const cityLower = city.name.toLowerCase();
  return [
    `${service.primaryKeyword} ${cityLower}`,
    `${service.slug.replace(/-/g, " ")} ${cityLower}`,
    `cabzii ${cityLower}`,
    `taxi ${cityLower}`,
    `cab booking ${cityLower}`
  ];
}

/**
 * Dynamic meta titles & descriptions for city/service/route landing pages.
 * Title ≤ 60 chars · Description 120–155 chars · Keywords at start.
 */

import { SEO_SERVICES } from "./services";

export const META_TITLE_MAX = 60;
export const META_DESC_MIN = 120;
export const META_DESC_MAX = 155;

/** Service slug → blueprint template id */
export const SERVICE_TEMPLATE = {
  "one-way-cab": "outstation",
  "outstation-cab": "outstation",
  "airport-taxi": "airport",
  "car-rental": "local_rental",
  "cab-rental": "local_rental",
  "hourly-rental": "local_rental",
  "local-taxi": "local_rental",
  "driver-on-hire": "local_rental",
  "chauffeur-service": "local_rental",
  "tempo-traveller": "outstation",
  "tour-packages": "outstation"
};

/** Cities: which services appear first on /cab-booking/{city} (links to /services/...) */
export const CITY_PRIORITY_SERVICES = {
  madurai: ["one-way-cab", "car-rental", "outstation-cab", "local-taxi"],
  chennai: ["outstation-cab", "airport-taxi", "car-rental", "cab-rental", "one-way-cab"],
  bengaluru: ["cab-rental", "airport-taxi", "outstation-cab", "one-way-cab"],
  hyderabad: ["airport-taxi", "outstation-cab", "one-way-cab"],
  coimbatore: ["outstation-cab", "one-way-cab", "car-rental"],
  trichy: ["car-rental", "cab-rental", "local-taxi", "outstation-cab"]
};

/** Explicit route slugs with tuned copy (others use route templates) */
export const PRIORITY_ROUTE_SLUGS = ["chennai-to-tirupati-cab", "bengaluru-to-tirupati-cab"];

function len(s) {
  return String(s || "").length;
}

/** Trim title to ≤ max without breaking mid-word when possible */
export function clampTitle(title, max = META_TITLE_MAX) {
  const t = String(title || "").trim();
  if (len(t) <= max) return t;
  const cut = t.slice(0, max - 1).trimEnd();
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > max * 0.55) return `${cut.slice(0, lastSpace)}…`;
  return `${cut}…`;
}

/** Trim description to 120–155 (prefer not below min) */
export function clampDescription(desc, min = META_DESC_MIN, max = META_DESC_MAX) {
  let d = String(desc || "").trim();
  if (len(d) > max) {
    const cut = d.slice(0, max - 1).trimEnd();
    const lastSpace = cut.lastIndexOf(" ");
    d = lastSpace > min ? `${cut.slice(0, lastSpace)}.` : `${cut}.`;
  }
  if (len(d) < min && len(d) > 0) {
    d = `${d} Book online on Cabzii.in with transparent fares and 24/7 support.`;
    if (len(d) > max) d = d.slice(0, max - 1).trimEnd() + ".";
  }
  return d;
}

// ——— Blueprint templates ———

export function outstationServiceTitle(cityName) {
  return clampTitle(`${cityName} One-Way Cabs | Best Outstation Rates - Cabzii`);
}

export function outstationServiceDescription(cityName) {
  return clampDescription(
    `Book safe, affordable outstation and one-way cabs in ${cityName} with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!`
  );
}

export function airportServiceTitle(cityName) {
  return clampTitle(`24/7 Airport Taxi ${cityName} | On-Time Airport Drops - Cabzii`);
}

export function airportServiceDescription(cityName) {
  return clampDescription(
    `Catch your flight without the stress. Reliable airport taxi service in ${cityName} by Cabzii.in. Fixed transparent fares, professional drivers, 24/7.`
  );
}

export function localRentalServiceTitle(cityName) {
  return clampTitle(`Local Car Rental ${cityName} | Hire Cabs by the Hour - Cabzii`);
}

export function localRentalServiceDescription(cityName) {
  return clampDescription(
    `Need a ride around town? Rent a car in ${cityName} with Cabzii.in. Flexible hourly packages, premium comfort, and clean fleets for local sightseeing.`
  );
}

function templateMeta(templateId, cityName) {
  switch (templateId) {
    case "airport":
      return {
        title: airportServiceTitle(cityName),
        description: airportServiceDescription(cityName)
      };
    case "local_rental":
      return {
        title: localRentalServiceTitle(cityName),
        description: localRentalServiceDescription(cityName)
      };
    case "outstation":
    default:
      return {
        title: outstationServiceTitle(cityName),
        description: outstationServiceDescription(cityName)
      };
  }
}

/** Per city+service overrides when template copy needs a tweak */
const SERVICE_META_OVERRIDES = {
  "chennai:cab-rental": {
    title: clampTitle("Local Car Rental Chennai | Hire Cabs by the Hour - Cabzii"),
    description: localRentalServiceDescription("Chennai")
  },
  "bengaluru:cab-rental": {
    title: clampTitle("Bengaluru Cab Booking | Low Rates & 24/7 Taxi - Cabzii"),
    description: clampDescription(
      "Book affordable cabs in Bengaluru with Cabzii.in. Airport drops, outstation trips and local hire. Clean fleets, zero hidden charges, OTP booking 24/7."
    )
  }
};

/** Cab hub /cab-booking/{city} */
const CAB_BOOKING_META = {
  chennai: {
    title: clampTitle("Chennai Cab Booking | Outstation & Airport Taxi - Cabzii"),
    description: clampDescription(
      "Book cabs in Chennai with Cabzii.in — outstation, airport taxi and hourly rental. Clean cars, transparent fares, expert drivers 24/7. Get a free quote today!"
    )
  },
  bengaluru: {
    title: clampTitle("Bengaluru Cab Booking | Low Rates & 24/7 Taxi - Cabzii"),
    description: clampDescription(
      "Book affordable cabs in Bengaluru with Cabzii.in. Airport drops, outstation trips and local hire. Clean fleets, zero hidden charges, OTP booking 24/7."
    )
  },
  madurai: {
    title: clampTitle("Madurai One-Way Cabs | Best Outstation Rates - Cabzii"),
    description: outstationServiceDescription("Madurai")
  },
  hyderabad: {
    title: clampTitle("Hyderabad Cab Booking | Airport Taxi & Outstation - Cabzii"),
    description: clampDescription(
      "Book cabs in Hyderabad with Cabzii.in. Reliable airport taxi, outstation and one-way trips. Fixed fares, clean cars and professional drivers — 24/7."
    )
  },
  coimbatore: {
    title: clampTitle("Coimbatore One-Way Cabs | Best Outstation Rates - Cabzii"),
    description: outstationServiceDescription("Coimbatore")
  },
  trichy: {
    title: clampTitle("Local Car Rental Trichy | Hire Cabs by the Hour - Cabzii"),
    description: localRentalServiceDescription("Trichy")
  }
};

const ROUTE_META_OVERRIDES = {
  "chennai-to-tirupati-cab": {
    title: clampTitle("Chennai to Tirupati One-Way Cab | Best Rates - Cabzii"),
    description: clampDescription(
      "Book safe, affordable one-way cab from Chennai to Tirupati with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!"
    )
  },
  "bengaluru-to-tirupati-cab": {
    title: clampTitle("Bengaluru to Tirupati One-Way Cab | Best Rates - Cabzii"),
    description: clampDescription(
      "Book safe, affordable one-way cab from Bengaluru to Tirupati with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!"
    )
  }
};

export function getServiceMeta(service, city) {
  const key = `${city.slug}:${service.slug}`;
  const override = SERVICE_META_OVERRIDES[key];
  if (override) return override;

  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  return templateMeta(templateId, city.name);
}

export function getCabBookingMeta(city) {
  if (CAB_BOOKING_META[city.slug]) return CAB_BOOKING_META[city.slug];

  return {
    title: clampTitle(`${city.name} Cab Booking | Low Rates & 24/7 Taxi - Cabzii`),
    description: clampDescription(
      `Book affordable cabs in ${city.name} with Cabzii.in. Outstation, airport taxi and local hire. Clean fleets, transparent fares and expert drivers 24/7.`
    )
  };
}

export function getRouteMeta(route) {
  const { slug, fromCity, toCity } = route;
  if (ROUTE_META_OVERRIDES[slug]) return ROUTE_META_OVERRIDES[slug];

  const title = clampTitle(
    `${fromCity.name} to ${toCity.name} One-Way Cab | Best Rates - Cabzii`
  );
  const description = clampDescription(
    `Book safe, affordable one-way cab from ${fromCity.name} to ${toCity.name} with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!`
  );
  return { title, description };
}

export function getServiceH1(service, city) {
  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  if (templateId === "airport") return `24/7 Airport Taxi in ${city.name}`;
  if (templateId === "local_rental") {
    if (service.slug === "cab-rental") return `Cab Rental in ${city.name}`;
    return `Car Rental in ${city.name}`;
  }
  if (service.slug === "one-way-cab") return `One-Way Cabs in ${city.name}`;
  return `${service.name} in ${city.name}`;
}

export function getCabBookingH1(city) {
  if (city.slug === "chennai") return "Cab Booking in Chennai — Online Taxi & Outstation Cabs";
  if (city.slug === "madurai") return "One-Way & Outstation Cabs in Madurai";
  if (city.slug === "trichy") return "Car Rental in Trichy — Hire Cabs by the Hour";
  return `Cab Booking in ${city.name} — Online Taxi Service`;
}

/** Search results deep-link for service landing CTAs */
export function serviceSearchHref(service, city) {
  const base = new URLSearchParams({
    from: city.name,
    date: new Date().toISOString().split("T")[0],
    time: "09:00"
  });

  if (service.slug === "airport-taxi") {
    base.set("serviceTripType", "airport");
    base.set("to", city.name);
    base.set("direction", "pickup");
  } else if (
    service.slug === "car-rental" ||
    service.slug === "cab-rental" ||
    service.slug === "hourly-rental" ||
    service.slug === "local-taxi"
  ) {
    base.set("serviceTripType", "local");
    base.set("to", city.name);
    base.set("packageHours", "8");
  } else {
    base.set("serviceTripType", "outstation");
    base.set("to", "");
  }

  return `/cabs/results?${base.toString()}`;
}

export function serviceMetaKeywords(service, city) {
  const cityLower = city.name.toLowerCase();
  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  const base = [
    `${service.primaryKeyword} ${cityLower}`,
    `${service.slug.replace(/-/g, " ")} ${cityLower}`,
    `cabzii ${cityLower}`
  ];

  if (templateId === "outstation") {
    return [`one way cab ${cityLower}`, `outstation cab ${cityLower}`, ...base];
  }
  if (templateId === "airport") {
    return [`airport taxi ${cityLower}`, `airport drop ${cityLower}`, ...base];
  }
  return [`car rental ${cityLower}`, `cab rental ${cityLower}`, `local taxi ${cityLower}`, ...base];
}

export function cabBookingMetaKeywords(city) {
  const cityLower = city.name.toLowerCase();
  return [
    `cab booking in ${cityLower}`,
    `cab booking ${cityLower}`,
    `taxi ${cityLower}`,
    `outstation cab ${cityLower}`,
    `airport taxi ${cityLower}`,
    "cabzii"
  ];
}

/** Ordered services for city hub — priority slugs first, then fill to limit */
export function servicesForCityHub(citySlug, limit = 8) {
  const priority = CITY_PRIORITY_SERVICES[citySlug];
  const ordered = [];
  const seen = new Set();

  if (priority) {
    for (const slug of priority) {
      const svc = SEO_SERVICES.find((s) => s.slug === slug);
      if (svc) {
        ordered.push(svc);
        seen.add(slug);
      }
    }
  }

  for (const svc of SEO_SERVICES) {
    if (!seen.has(svc.slug) && ordered.length < limit) {
      ordered.push(svc);
      seen.add(svc.slug);
    }
  }

  return ordered;
}

export function routeMetaKeywords(route) {
  const from = route.fromCity.name.toLowerCase();
  const to = route.toCity.name.toLowerCase();
  return [
    `one way cab ${from} to ${to}`,
    `${from} to ${to} taxi`,
    `outstation cab ${from}`,
    "cabzii one way cab"
  ];
}

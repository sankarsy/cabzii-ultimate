/**
 * Dynamic meta titles & descriptions for city/service/route landing pages.
 * Title ≤ 60 chars · Description 120–155 chars · Keywords at start.
 */

import { SEO_SERVICES } from "./services";

export const META_TITLE_MAX = 60;
export const META_DESC_MIN = 120;
export const META_DESC_MAX = 155;

/** Trailing brand in Google SERP titles (MrMed-style: `Product | Detail | cabzii`). */
export const SERP_BRAND = "cabzii";

/** Standard meta title for rich search results: `Primary | Detail | cabzii` */
export function formatSerpTitle(primary, detail) {
  const full = detail ? `${primary} | ${detail} | ${SERP_BRAND}` : `${primary} | ${SERP_BRAND}`;
  return clampTitle(full);
}

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
  coimbatore: ["car-rental", "outstation-cab", "one-way-cab"],
  goa: ["car-rental", "outstation-cab", "airport-taxi", "one-way-cab"],
  delhi: ["car-rental", "airport-taxi", "outstation-cab", "one-way-cab"],
  trichy: ["car-rental", "cab-rental", "local-taxi", "outstation-cab"],
  kodaikanal: ["outstation-cab", "one-way-cab", "car-rental", "tour-packages"]
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
  return formatSerpTitle(`${cityName} One-Way Cabs`, "Outstation Packages");
}

export function outstationServiceDescription(cityName) {
  return clampDescription(
    `Book safe, affordable outstation and one-way cabs in ${cityName} with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!`
  );
}

export function airportServiceTitle(cityName) {
  return formatSerpTitle(`Airport Taxi ${cityName}`, "24/7 Pickup & Drop");
}

export function airportServiceDescription(cityName) {
  return clampDescription(
    `Catch your flight without the stress. Reliable airport taxi service in ${cityName} by Cabzii.in. Fixed transparent fares, professional drivers, 24/7.`
  );
}

export function localRentalServiceTitle(cityName) {
  return formatSerpTitle(`Car Rental in ${cityName}`, "Hourly Packages");
}

export function localRentalServiceDescription(cityName) {
  return clampDescription(
    `Car rental in ${cityName} on Cabzii.in — hourly and full-day packages for local trips, weddings and sightseeing. Book online with transparent fares 24/7.`
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
  "chennai:car-rental": {
    title: formatSerpTitle("Chennai Cabs", "Car Rental & 4–8 Hour Packages"),
    description: clampDescription(
      "Chennai cabs and car rental packages on Cabzii.in — 4 hours, 8 hours and full-day hire in Maduravoyal, OMR and across the city. Book online with upfront package fares."
    )
  },
  "chennai:cab-rental": {
    title: formatSerpTitle("Cab Rental Chennai", "Hourly & Local Packages"),
    description: localRentalServiceDescription("Chennai")
  },
  "coimbatore:car-rental": {
    title: formatSerpTitle("Car Rental Coimbatore", "Hourly Cabs & Packages"),
    description: clampDescription(
      "Car rental in Coimbatore with Cabzii.in — 4hr and 8hr local packages for city errands, airport runs and sightseeing. Compare fares and book online."
    )
  },
  "madurai:car-rental": {
    title: formatSerpTitle("Car Rental Madurai", "Hourly & Daily Packages"),
    description: clampDescription(
      "Car rental in Madurai on Cabzii.in — flexible hourly and full-day cabs for temples, weddings and local travel. Transparent package fares, OTP booking."
    )
  },
  "goa:car-rental": {
    title: formatSerpTitle("Car Rental Goa", "Beach & City Hire"),
    description: clampDescription(
      "Car rental in Goa on Cabzii.in — sedan and SUV hire for North & South Goa trips, airport transfers and day tours. Book online with fixed package rates."
    )
  },
  "bengaluru:car-rental": {
    title: formatSerpTitle("Car Rental Bangalore", "Hourly Cabs & Packages"),
    description: clampDescription(
      "Car rental in Bangalore (Bengaluru) on Cabzii.in — hourly local hire, airport drops and city packages. Clean fleets, expert drivers, book online 24/7."
    )
  },
  "trichy:car-rental": {
    title: formatSerpTitle("Car Rental Trichy", "Hourly & Local Packages"),
    description: clampDescription(
      "Car rental in Trichy on Cabzii.in — hourly and daily cab packages for Srirangam, airport and city travel. Upfront fares on Dzire, Ertiga and Innova."
    )
  },
  "delhi:car-rental": {
    title: formatSerpTitle("Car Rental Delhi", "Hourly & Airport Transfer"),
    description: clampDescription(
      "Car rental in Delhi on Cabzii.in — hourly city hire, airport transfers and local packages across NCR. Book online with transparent fares and OTP login."
    )
  },
  "bengaluru:cab-rental": {
    title: formatSerpTitle("Cab Rental Bangalore", "24/7 Low Rates"),
    description: clampDescription(
      "Cab rental in Bengaluru with Cabzii.in. Airport drops, outstation trips and local hourly hire. Clean fleets, zero hidden charges, OTP booking 24/7."
    )
  }
};

/** Cab hub /cab-booking/{city} */
const CAB_BOOKING_META = {
  chennai: {
    title: formatSerpTitle("Chennai Cabs Booking", "Packages & 4–8 Hours Hire"),
    description: clampDescription(
      "Chennai cabs on Cabzii.in — hourly packages (4 hours, 8 hours), outstation, airport taxi and car rental. Transparent package fares, expert drivers, book online 24/7."
    )
  },
  bengaluru: {
    title: formatSerpTitle("Bengaluru Cab Booking", "24/7 Taxi & Low Rates"),
    description: clampDescription(
      "Book affordable cabs in Bengaluru with Cabzii.in. Airport drops, outstation trips and local hire. Clean fleets, zero hidden charges, OTP booking 24/7."
    )
  },
  madurai: {
    title: formatSerpTitle("Cab Booking Madurai", "Online Taxi & Outstation"),
    description: clampDescription(
      "Cab booking in Madurai on Cabzii.in — online taxi, one-way and outstation cabs to Trichy, Chennai and hill stations. Transparent fares, OTP booking 24/7."
    )
  },
  hyderabad: {
    title: formatSerpTitle("Hyderabad Cab Booking", "Airport & Outstation"),
    description: clampDescription(
      "Book cabs in Hyderabad with Cabzii.in. Reliable airport taxi, outstation and one-way trips. Fixed fares, clean cars and professional drivers — 24/7."
    )
  },
  coimbatore: {
    title: formatSerpTitle("Cab Booking Coimbatore", "Online Taxi & Packages"),
    description: clampDescription(
      "Cab booking in Coimbatore with Cabzii.in — outstation, airport taxi and one-way cabs to Bengaluru, Kodaikanal and Tirupati. Book online with upfront fares."
    )
  },
  trichy: {
    title: formatSerpTitle("Cab Booking Trichy", "Online Taxi & Rental"),
    description: clampDescription(
      "Cab booking in Trichy on Cabzii.in — local hourly rental, outstation and one-way cabs to Chennai and Madurai. Compare fares and book online 24/7."
    )
  },
  kodaikanal: {
    title: formatSerpTitle("Cab Booking Kodaikanal", "Hill Station Taxi"),
    description: clampDescription(
      "Cab booking to Kodaikanal on Cabzii.in — outstation taxis from Coimbatore, Madurai and Chennai. Sedan, SUV and Innova for hill station trips with fixed fares."
    )
  }
};

const ROUTE_META_OVERRIDES = {
  "chennai-to-tirupati-cab": {
    title: formatSerpTitle("Chennai to Tirupati Cab", "One-Way Best Rates"),
    description: clampDescription(
      "Book safe, affordable one-way cab from Chennai to Tirupati with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!"
    )
  },
  "bengaluru-to-tirupati-cab": {
    title: formatSerpTitle("Bengaluru to Tirupati Cab", "One-Way Best Rates"),
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
    title: formatSerpTitle(`${city.name} Cab Booking`, "24/7 Taxi & Packages"),
    description: clampDescription(
      `Book affordable cabs in ${city.name} with Cabzii.in. Outstation, airport taxi and local hire. Clean fleets, transparent fares and expert drivers 24/7.`
    )
  };
}

export function getRouteMeta(route) {
  const { slug, fromCity, toCity } = route;
  if (ROUTE_META_OVERRIDES[slug]) return ROUTE_META_OVERRIDES[slug];

  const title = formatSerpTitle(
    `${fromCity.name} to ${toCity.name} Cab`,
    "One-Way Best Rates"
  );
  const description = clampDescription(
    `Book safe, affordable one-way cab from ${fromCity.name} to ${toCity.name} with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!`
  );
  return { title, description };
}

export function getServiceH1(service, city) {
  if (city.slug === "chennai" && service.slug === "car-rental") {
    return "Chennai Cabs — Car Rental Packages & Hourly Hire";
  }
  if (city.slug === "chennai" && service.slug === "cab-rental") {
    return "Chennai Cabs — Cab Rental Packages & Hourly Hire";
  }
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
  if (city.slug === "chennai") return "Chennai Cabs Booking — Packages, Hours & Outstation";
  if (city.slug === "madurai") return "Cab Booking Madurai — Online Taxi & Outstation";
  if (city.slug === "coimbatore") return "Cab Booking in Coimbatore — Online Taxi Service";
  if (city.slug === "trichy") return "Cab Booking Trichy — Online Taxi & Local Rental";
  if (city.slug === "kodaikanal") return "Cab Booking Kodaikanal — Hill Station Taxi";
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
  const rentalKw = [
    `car rental in ${cityLower}`,
    `car rental ${cityLower}`,
    `cab rental in ${cityLower}`,
    `cab rental ${cityLower}`,
    `local taxi ${cityLower}`
  ];
  if (city.slug === "bengaluru") {
    rentalKw.unshift("car rental in bangalore", "car rental bangalore", "cab rental bangalore");
  }
  if (city.slug === "chennai") {
    rentalKw.push("car rental maduravoyal", "car rental in maduravoyal");
  }
  if (service.slug === "car-rental") {
    return [...rentalKw, "car rental near me", ...base];
  }
  return [...rentalKw, ...base];
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

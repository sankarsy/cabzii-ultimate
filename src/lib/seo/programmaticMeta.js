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
  "chennai:airport-taxi": {
    title: formatSerpTitle("Chennai Airport Taxi", "Pickup & Drop 24/7"),
    description: clampDescription(
      "Chennai airport taxi — MAA pickup and drop, fixed fares, flight tracking. Book Chennai airport transfer online. Sedan, SUV & Innova. Instant confirmation on Cabzii."
    )
  },
  "chennai:local-taxi": {
    title: formatSerpTitle("Chennai Local Taxi", "Hourly & City Rides"),
    description: clampDescription(
      "Chennai local taxi service on Cabzii — point-to-point rides and 4hr/8hr packages across OMR, Anna Nagar, T. Nagar and more. Transparent fares, book online."
    )
  },
  "chennai:outstation-cab": {
    title: formatSerpTitle("Outstation Cab Chennai", "Round Trip Packages"),
    description: clampDescription(
      "Outstation cab from Chennai on Cabzii — round-trip and multi-day highway packages with per-km clarity. Sedan, SUV, Innova and tempo. Book online 24/7."
    )
  },
  "chennai:one-way-cab": {
    title: formatSerpTitle("One Way Taxi Chennai", "Inter-City Drops"),
    description: clampDescription(
      "One way taxi from Chennai on Cabzii — inter-city drops without return empty charges. Chennai to Bangalore, Pondicherry, Tirupati and more. Upfront fares."
    )
  },
  "bengaluru:airport-taxi": {
    title: formatSerpTitle("Bangalore Airport Taxi", "Pickup & 12 Hr Packages"),
    description: clampDescription(
      "Bangalore airport taxi (Kempegowda BLR) — pickup & drop, 4/8/12-hour packages. Book 12 hr / 120 km airport pickup online on Cabzii with upfront fares."
    )
  },
  "bengaluru:hourly-rental": {
    title: formatSerpTitle("Bangalore 12 Hour Cab", "Airport Pickup Packages"),
    description: clampDescription(
      "12 hour cab rental in Bangalore — ideal for airport pickup, meetings & city tours. 12 hr / 120 km packages from Kempegowda airport on Cabzii.in."
    )
  },
  "chennai:car-rental": {
    title: formatSerpTitle("Chennai Cabs", "Car Rental & 4–8 Hour Packages"),
    description: clampDescription(
      "Chennai cabs and car rental packages on Cabzii.in — 4 hours, 8 hours and full-day hire in Maduravoyal, OMR and across the city. Book online with upfront package fares."
    )
  },
  "chennai:cab-rental": {
    title: formatSerpTitle("Cab Rental Chennai", "Hourly & Full-Day Packages"),
    description: clampDescription(
      "Cab rental in Chennai on Cabzii.in — hourly and full-day packages for local trips, weddings and sightseeing. Book online with transparent fares 24/7."
    )
  },
  "chennai:hourly-rental": {
    title: formatSerpTitle("Full Day Taxi Chennai", "4/8/12 Hr Cab Packages"),
    description: clampDescription(
      "Full day taxi and cab rental in Chennai — 4, 8 and 12 hour packages with upfront fares. Ideal for weddings, meetings and city tours. Book on Cabzii.in."
    )
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

/** IATA airports for programmatic airport-taxi meta (all SEO cities with commercial airports). */
export const AIRPORT_BY_CITY = {
  chennai: { code: "MAA", name: "Chennai International Airport" },
  bengaluru: { code: "BLR", name: "Kempegowda International Airport", label: "Bangalore" },
  hyderabad: { code: "HYD", name: "Rajiv Gandhi International Airport" },
  coimbatore: { code: "CJB", name: "Coimbatore International Airport" },
  madurai: { code: "IXM", name: "Madurai Airport" },
  trichy: { code: "TRZ", name: "Tiruchirappalli International Airport" },
  kochi: { code: "COK", name: "Cochin International Airport" },
  goa: { code: "GOI", name: "Goa International Airport" },
  mumbai: { code: "BOM", name: "Chhatrapati Shivaji Maharaj International Airport" },
  delhi: { code: "DEL", name: "Indira Gandhi International Airport" },
  pune: { code: "PNQ", name: "Pune Airport" },
  kolkata: { code: "CCU", name: "Netaji Subhash Chandra Bose International Airport" },
  visakhapatnam: { code: "VTZ", name: "Visakhapatnam Airport" },
  ahmedabad: { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport" },
  jaipur: { code: "JAI", name: "Jaipur International Airport" },
  chandigarh: { code: "IXC", name: "Chandigarh International Airport" },
  tirupati: { code: "TIR", name: "Tirupati Airport" },
  mysore: { code: "MYQ", name: "Mysore Airport" },
  pondicherry: { code: "PNY", name: "Pondicherry Airport" },
  salem: { code: "SXV", name: "Salem Airport" }
};

/** Cab hub /cab-booking/{city} */
const CAB_BOOKING_META = {
  chennai: {
    title: "Cab Booking Chennai | Airport Taxi, Local & Outstation Cabs | Cabzii",
    description: clampDescription(
      "Book airport taxi, local taxi, outstation taxi and one-way cabs in Chennai. Instant confirmation, professional drivers and affordable fares. Book online with Cabzii."
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
  "chennai-to-pondicherry-cab": {
    title: formatSerpTitle("Chennai to Pondicherry Cab", "One-Way Best Rates"),
    description: clampDescription(
      "Chennai to Pondicherry cab on Cabzii — one-way taxi from ₹2,800 sedan. ECR highway, 160 km, 3–4 hours. Book online with upfront fare."
    )
  },
  "chennai-to-bangalore-cab": {
    title: formatSerpTitle("Chennai to Bangalore Taxi", "One-Way Best Rates"),
    description: clampDescription(
      "Chennai to Bangalore taxi on Cabzii — one-way cab from ₹4,500 sedan. NH48 route, 350 km, 6–7 hours. Compare sedan, SUV and Innova fares online."
    )
  },
  "chennai-to-tirupati-cab": {
    title: formatSerpTitle("Chennai to Tirupati Cab", "One-Way Best Rates"),
    description: clampDescription(
      "Book safe, affordable one-way cab from Chennai to Tirupati with Cabzii.in. Clean cars, expert drivers, and zero hidden charges. Get a free quote!"
    )
  },
  "chennai-to-vellore-cab": {
    title: formatSerpTitle("Chennai to Vellore Cab", "One-Way Best Rates"),
    description: clampDescription(
      "Chennai to Vellore cab on Cabzii — one-way taxi from ₹2,600 sedan. 140 km, 3 hours. Medical, education and city travel with upfront fares."
    )
  },
  "chennai-to-coimbatore-cab": {
    title: formatSerpTitle("Chennai to Coimbatore Cab", "One-Way Best Rates"),
    description: clampDescription(
      "Chennai to Coimbatore cab on Cabzii — one-way from ₹6,500 sedan. 505 km highway trip, 8–9 hours. Book sedan, SUV or Innova online."
    )
  },
  "chennai-to-madurai-cab": {
    title: formatSerpTitle("Chennai to Madurai Taxi", "One-Way Best Rates"),
    description: clampDescription(
      "Chennai to Madurai taxi on Cabzii — one-way cab from ₹6,000 sedan. 460 km, 7–8 hours. Temple and family travel with transparent pricing."
    )
  },
  "chennai-to-salem-cab": {
    title: formatSerpTitle("Chennai to Salem Taxi", "One-Way Best Rates"),
    description: clampDescription(
      "Chennai to Salem taxi on Cabzii — one-way cab from ₹4,300 sedan. 340 km, 5–6 hours. Book online with upfront fare and instant confirmation."
    )
  },
  "chennai-to-trichy-cab": {
    title: formatSerpTitle("Chennai to Trichy Taxi", "330 km · One-Way Cab Service"),
    description: clampDescription(
      "Chennai to Trichy taxi & cab service from ₹4,200. 330 km distance by car, 5–6 hours. Book one-way taxi online — Srirangam & city drops on Cabzii."
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

  if (service.slug === "hourly-rental") {
    return {
      title: formatSerpTitle(`Full Day Taxi ${city.name}`, "4/8/12 Hr Cab Packages"),
      description: clampDescription(
        `Full day taxi and cab rental in ${city.name} — 4, 8 and 12 hour packages with upfront fares. Book online on Cabzii.in.`
      )
    };
  }

  if (service.slug === "cab-rental") {
    return {
      title: formatSerpTitle(`Cab Rental ${city.name}`, "Hourly & Full-Day Packages"),
      description: clampDescription(
        `Cab rental in ${city.name} on Cabzii.in — hourly and full-day packages for local trips, weddings and sightseeing. Book online with transparent fares 24/7.`
      )
    };
  }

  if (service.slug === "airport-taxi") {
    const airport = AIRPORT_BY_CITY[city.slug];
    if (airport) {
      const label = airport.label || city.name;
      return {
        title: formatSerpTitle(`${label} Airport Taxi`, `${airport.code} Pickup & Drop`),
        description: clampDescription(
          `${label} airport taxi (${airport.code}) — ${airport.name} pickup and drop. Fixed fares, flight tracking. Book online on Cabzii.in 24/7.`
        )
      };
    }
  }

  if (service.slug === "outstation-cab") {
    return {
      title: formatSerpTitle(`Outstation Cab ${city.name}`, "Round Trip Packages"),
      description: clampDescription(
        `Outstation cab from ${city.name} on Cabzii — round-trip and multi-day highway packages with per-km clarity. Book sedan, SUV or Innova online 24/7.`
      )
    };
  }

  const templateId = SERVICE_TEMPLATE[service.slug] || "outstation";
  return templateMeta(templateId, city.name);
}

/* Deterministic variant picker — same page always gets the same copy,
   but neighbouring pages get different patterns (avoids templated SERPs). */
function hashSlug(slug) {
  let h = 0;
  const s = String(slug || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return h;
}

function inr(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

export function getCabBookingMeta(city) {
  if (CAB_BOOKING_META[city.slug]) return CAB_BOOKING_META[city.slug];

  const variants = [
    {
      title: formatSerpTitle(`${city.name} Cab Booking`, "24/7 Taxi & Packages"),
      description: clampDescription(
        `Book affordable cabs in ${city.name} with Cabzii.in. Outstation, airport taxi and local hire. Clean fleets, transparent fares and expert drivers 24/7.`
      )
    },
    {
      title: formatSerpTitle(`Cab Booking ${city.name}`, "Online Taxi Service"),
      description: clampDescription(
        `Cab booking in ${city.name} made easy — compare outstation, airport and hourly packages on Cabzii.in. Professional drivers, upfront fares, instant OTP booking.`
      )
    },
    {
      title: formatSerpTitle(`Taxi in ${city.name}`, "Book Cabs Online"),
      description: clampDescription(
        `Need a taxi in ${city.name}? Book local, airport and outstation cabs on Cabzii.in with transparent fares, clean cars and 24/7 customer support.`
      )
    }
  ];
  return variants[hashSlug(city.slug) % variants.length];
}

export function getRouteMeta(route) {
  const { slug, fromCity, toCity, distance, duration, sedanFrom } = route;
  if (ROUTE_META_OVERRIDES[slug]) return ROUTE_META_OVERRIDES[slug];

  const from = fromCity.name;
  const to = toCity.name;
  const hasTrip = Boolean(distance && duration);
  const hasFare = Number(sedanFrom) > 0;

  /* Intent-rotated recipes (pharmacy-sheet style):
     transactional · price · informational · trust */
  const variants = [];

  variants.push({
    title: formatSerpTitle(`${from} to ${to} Cab`, "Book One-Way Taxi Online"),
    description: clampDescription(
      hasTrip
        ? `Book ${from} to ${to} one-way cab online — ${distance}, around ${duration}. Verified drivers, fixed fare and instant confirmation on Cabzii.in.`
        : `Book ${from} to ${to} one-way cab online with Cabzii.in. Verified drivers, fixed fares, door pickup and instant confirmation. Reserve your taxi 24/7.`
    )
  });

  if (hasFare) {
    variants.push({
      title: formatSerpTitle(`${from} to ${to} Taxi`, `Fare from ${inr(sedanFrom)}`),
      description: clampDescription(
        `${from} to ${to} taxi fare from ${inr(sedanFrom)} (sedan). Compare sedan, SUV & Innova rates${hasTrip ? ` for the ${distance} trip` : ""} on Cabzii.in — zero hidden charges.`
      )
    });
  }

  if (hasTrip) {
    variants.push({
      title: formatSerpTitle(`${from} to ${to} Cab`, `${distance} in ${duration}`),
      description: clampDescription(
        `Travelling from ${from} to ${to}? It's ${distance} by road, around ${duration}. Get a clean cab, expert driver and upfront fare on Cabzii.in. Book online 24/7.`
      )
    });
  }

  variants.push({
    title: formatSerpTitle(`One Way Cab ${from} to ${to}`, "Fixed Fare"),
    description: clampDescription(
      `Reliable ${from} to ${to} cab service on Cabzii.in — door pickup, GPS-tracked rides and 24/7 support. One-way drops with transparent, upfront pricing.`
    )
  });

  return variants[hashSlug(slug) % variants.length];
}

export function getServiceH1(service, city) {
  if (service.slug === "hourly-rental") {
    return `Full Day Taxi in ${city.name} — 4/8/12 Hour Packages`;
  }
  if (city.slug === "chennai" && service.slug === "car-rental") {
    return "Chennai Cabs — Car Rental Packages & Hourly Hire";
  }
  if (city.slug === "chennai" && service.slug === "cab-rental") {
    return "Chennai Cabs — Cab Rental Packages & Hourly Hire";
  }
  if (service.slug === "cab-rental") {
    return `Cab Rental in ${city.name} — Hourly & Full-Day Packages`;
  }
  if (service.slug === "airport-taxi" && AIRPORT_BY_CITY[city.slug]) {
    const label = AIRPORT_BY_CITY[city.slug].label || city.name;
    return `${label} Airport Taxi — Pickup & Drop 24/7`;
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
  } else if (service.slug === "hourly-rental") {
    base.set("serviceTripType", "hourly");
    base.set("from", city.slug === "bengaluru" ? "Kempegowda International Airport, Bengaluru" : city.name);
    base.set("to", city.name);
    base.set("city", city.name);
    base.set("packageHours", city.slug === "bengaluru" ? "12" : "8");
  } else if (
    service.slug === "car-rental" ||
    service.slug === "cab-rental" ||
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

  if (service.slug === "hourly-rental") {
    return [
      `full day taxi ${cityLower}`,
      `full day taxi in ${cityLower}`,
      `full day cab in ${cityLower}`,
      `cab package in ${cityLower}`,
      `hourly cab rental ${cityLower}`,
      `daily cab service ${cityLower}`,
      ...base
    ];
  }

  if (service.slug === "cab-rental") {
    return [
      `cab rental ${cityLower}`,
      `cab rental in ${cityLower}`,
      `${cityLower} cab rental`,
      `${cityLower} taxi rental`,
      `taxi rental in ${cityLower}`,
      ...base
    ];
  }

  if (templateId === "outstation") {
    return [
      `one way cab ${cityLower}`,
      `outstation cab ${cityLower}`,
      `outstation taxi ${cityLower}`,
      `outstation taxi in ${cityLower}`,
      `outstation cab booking ${cityLower}`,
      `outstation cabs ${cityLower}`,
      `outstation car rental ${cityLower}`,
      `cab for outstation from ${cityLower}`,
      ...base
    ];
  }
  if (templateId === "airport") {
    const airport = AIRPORT_BY_CITY[city.slug];
    const label = (airport?.label || city.name).toLowerCase();
    return [
      `airport taxi ${cityLower}`,
      `${label} airport taxi`,
      `airport drop ${cityLower}`,
      `airport pickup ${cityLower}`,
      `${cityLower} airport transfer`,
      ...base
    ];
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
  const bangaloreExtras =
    city.slug === "bengaluru"
      ? ["cab booking bangalore", "bangalore cab booking", "cab services bangalore"]
      : [];
  return [
    `cab booking in ${cityLower}`,
    `cab booking ${cityLower}`,
    `${cityLower} cab booking`,
    `book cab in ${cityLower}`,
    `book a cab in ${cityLower}`,
    `book taxi ${cityLower}`,
    `cab ${cityLower}`,
    `${cityLower} cab`,
    `${cityLower} cabs`,
    `cab in ${cityLower}`,
    `${cityLower} cab service`,
    `${cityLower} cab hire`,
    `${cityLower} taxi hire`,
    `cab service in ${cityLower}`,
    `cab services in ${cityLower}`,
    `cab services ${cityLower}`,
    `cabs services in ${cityLower}`,
    `${cityLower} cab services`,
    `daily cab service ${cityLower}`,
    `taxi ${cityLower}`,
    `outstation cab ${cityLower}`,
    `airport taxi ${cityLower}`,
    ...bangaloreExtras,
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

const ROUTE_KEYWORD_OVERRIDES = {
  "chennai-to-trichy-cab": [
    "chennai to trichy taxi",
    "chennai to trichy distance by car",
    "chennai to trichy cabs",
    "cab from chennai to trichy",
    "chennai to trichy cab service",
    "chennai to trichy one way taxi",
    "chennai to trichy oneway taxi",
    "chennai to trichy cab",
    "one way cab chennai to trichy"
  ]
};

export function getRouteH1(route) {
  if (route.slug === "chennai-to-trichy-cab") {
    return "Chennai to Trichy Taxi — One-Way Cab Service";
  }
  return `${route.fromCity.name} to ${route.toCity.name} Cab — One Way Taxi`;
}

export function routeMetaKeywords(route) {
  if (ROUTE_KEYWORD_OVERRIDES[route.slug]) {
    return ROUTE_KEYWORD_OVERRIDES[route.slug];
  }
  const from = route.fromCity.name.toLowerCase();
  const to = route.toCity.name.toLowerCase();
  return [
    `one way cab ${from} to ${to}`,
    `${from} to ${to} taxi`,
    `outstation cab ${from}`,
    "cabzii one way cab"
  ];
}
